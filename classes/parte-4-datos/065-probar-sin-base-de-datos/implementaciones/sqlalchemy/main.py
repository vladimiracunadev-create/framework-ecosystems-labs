"""TRES FORMAS DE PROBAR LO MISMO.

- `doble`: un objeto en memoria que imita al repositorio. No hay motor.
- `en-memoria`: una base de VERDAD, creada para las pruebas y desechable.
- `real`: la misma base que usa el servicio.

Las cuatro pruebas son identicas en las tres. Lo que cambia es que detectan — y
una de ellas solo pasa cuando hay un motor detras.
"""
import time
from collections.abc import Callable
from typing import Any

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from sqlalchemy import Integer, String, create_engine, delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker
from sqlalchemy.pool import StaticPool

app = FastAPI()


class Base(DeclarativeBase):
    pass


class Tarea(Base):
    __tablename__ = "tareas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    # LA RESTRICCION QUE DECIDE LA CLASE. La aplica la BASE, no el codigo — y por
    # eso un doble en memoria no la ve.
    titulo: Mapped[str] = mapped_column(String(120), unique=True)


motor_real = create_engine("sqlite:///datos.db")

# `sqlite:///:memory:` con `StaticPool` mantiene UNA conexion viva, y con ella la
# base entera. Sin `StaticPool`, cada conexion abriria su propia base vacia y las
# pruebas no verian nada de lo que escribieron.
motor_pruebas = create_engine(
    "sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool
)

for motor in (motor_real, motor_pruebas):
    Base.metadata.drop_all(motor)
    Base.metadata.create_all(motor)

SesionReal = sessionmaker(bind=motor_real, expire_on_commit=False)
SesionPruebas = sessionmaker(bind=motor_pruebas, expire_on_commit=False)


class RepositorioSqlAlchemy:
    """El repositorio de verdad: delega en el motor y deja que el aplique sus reglas."""

    def __init__(self, crear_sesion) -> None:
        self.crear_sesion = crear_sesion

    def limpiar(self) -> None:
        with self.crear_sesion() as s:
            s.execute(delete(Tarea))
            s.commit()

    def crear(self, titulo: str) -> Tarea:
        tarea = Tarea(titulo=titulo)
        with self.crear_sesion() as s:
            s.add(tarea)
            s.commit()
        return tarea

    def por_id(self, id_tarea: int) -> Tarea | None:
        with self.crear_sesion() as s:
            return s.get(Tarea, id_tarea)

    def borrar(self, id_tarea: int) -> None:
        with self.crear_sesion() as s:
            s.execute(delete(Tarea).where(Tarea.id == id_tarea))
            s.commit()


class DobleEnMemoria:
    """EL DOBLE.

    Hace lo mismo con un diccionario, y no comprueba la unicidad — igual que el
    repositorio de verdad, que tampoco la comprueba: la aplica la base.

    Ese detalle es la clase entera. El doble no es incorrecto: es INCOMPLETO, y
    su hueco tiene exactamente la forma de lo que el motor hacia por ti.
    """

    def __init__(self) -> None:
        self.filas: dict[int, Tarea] = {}
        self.siguiente = 1

    def limpiar(self) -> None:
        self.filas.clear()
        self.siguiente = 1

    def crear(self, titulo: str) -> Tarea:
        tarea = Tarea(id=self.siguiente, titulo=titulo)
        self.filas[self.siguiente] = tarea
        self.siguiente += 1
        return tarea

    def por_id(self, id_tarea: int) -> Tarea | None:
        return self.filas.get(id_tarea)

    def borrar(self, id_tarea: int) -> None:
        self.filas.pop(id_tarea, None)


def prueba_crear(repositorio) -> bool:
    tarea = repositorio.crear("comprar pan")
    return isinstance(tarea.id, int) and tarea.id > 0


def prueba_leer(repositorio) -> bool:
    creada = repositorio.crear("regar")
    leida = repositorio.por_id(creada.id)
    return leida is not None and leida.titulo == "regar"


def prueba_borrar(repositorio) -> bool:
    creada = repositorio.crear("llamar")
    repositorio.borrar(creada.id)
    return repositorio.por_id(creada.id) is None


def prueba_unicidad(repositorio) -> bool:
    repositorio.crear("repetida")
    try:
        repositorio.crear("repetida")
        return False  # no protesto: el hueco del doble
    except IntegrityError:
        return True


# LAS CUATRO PRUEBAS. Las mismas para las tres estrategias, sin una linea distinta.
PRUEBAS: list[tuple[str, Callable[[Any], bool]]] = [
    ("se crea y devuelve un identificador", prueba_crear),
    ("se lee de vuelta lo que se escribio", prueba_leer),
    ("lo borrado deja de estar", prueba_borrar),
    ("la restriccion de unicidad la aplica la base, no el codigo", prueba_unicidad),
]

ESTRATEGIAS = ["doble", "en-memoria", "real"]


def repositorio_de(estrategia: str):
    if estrategia == "doble":
        return DobleEnMemoria()
    return RepositorioSqlAlchemy(SesionPruebas if estrategia == "en-memoria" else SesionReal)


def ejecutar(estrategia: str) -> list[dict[str, Any]]:
    repositorio = repositorio_de(estrategia)
    resultados = []
    for nombre, prueba in PRUEBAS:
        repositorio.limpiar()
        try:
            paso = prueba(repositorio)
        except Exception:
            paso = False
        resultados.append({"nombre": nombre, "paso": paso})
    repositorio.limpiar()
    return resultados


@app.get("/estrategias")
def estrategias() -> JSONResponse:
    return JSONResponse({
        "estrategias": ESTRATEGIAS,
        "pruebas_por_estrategia": len(PRUEBAS),
    })


@app.get("/probar")
def probar(estrategia: str = "") -> JSONResponse:
    if estrategia not in ESTRATEGIAS:
        return JSONResponse({"code": "ESTRATEGIA_DESCONOCIDA"}, status_code=400)
    resultados = ejecutar(estrategia)
    return JSONResponse({
        "estrategia": estrategia,
        "ejecutadas": len(resultados),
        "pasadas": sum(1 for r in resultados if r["paso"]),
        "usa_motor": estrategia != "doble",
        "detalle": resultados,
    })


@app.get("/que-se-escapa")
def que_se_escapa() -> JSONResponse:
    """DONDE ESTA EL HUECO, exactamente."""
    por_estrategia = {e: ejecutar(e) for e in ESTRATEGIAS}
    indice = len(PRUEBAS) - 1
    return JSONResponse({
        "prueba": "la restricción de unicidad la aplica la base, no el código",
        "doble": por_estrategia["doble"][indice]["paso"],
        "en_memoria": por_estrategia["en-memoria"][indice]["paso"],
        "real": por_estrategia["real"][indice]["paso"],
    })


@app.get("/comparacion")
def comparacion() -> JSONResponse:
    """Y POR QUE SE USA IGUALMENTE EL DOBLE: porque es mucho mas rapido."""
    tiempos: dict[str, int] = {}
    for estrategia in ESTRATEGIAS:
        inicio = time.perf_counter()
        for _ in range(20):
            ejecutar(estrategia)
        tiempos[estrategia] = int((time.perf_counter() - inicio) * 1000)
    return JSONResponse({
        "tiempos_ms": tiempos,
        "repeticiones": 20,
        "doble_es_el_mas_rapido": tiempos["doble"] == min(tiempos.values()),
    })
