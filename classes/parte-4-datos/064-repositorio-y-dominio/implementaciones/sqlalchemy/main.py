import re
from pathlib import Path
from typing import Any, Protocol

from dominio import Proyecto, ReglaRota, Tarea
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from sqlalchemy import Boolean, ForeignKey, Integer, String, create_engine, func, select
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, sessionmaker

app = FastAPI()

RAIZ = Path(__file__).parent


class Base(DeclarativeBase):
    pass


class FilaProyecto(Base):
    """El modelo de PERSISTENCIA, distinto del de dominio.

    Se parece a `Proyecto` porque este caso es sencillo, y no tiene por que
    parecerse: es el mapeador quien traduce entre los dos.
    """

    __tablename__ = "proyectos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120))
    cerrado: Mapped[bool] = mapped_column(Boolean, default=False)
    tareas: Mapped[list["FilaTarea"]] = relationship(
        cascade="all, delete-orphan", lazy="selectin"
    )


class FilaTarea(Base):
    __tablename__ = "tareas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    titulo: Mapped[str] = mapped_column(String(120))
    hecha: Mapped[bool] = mapped_column(Boolean, default=False)
    proyecto_id: Mapped[int] = mapped_column(ForeignKey("proyectos.id", ondelete="CASCADE"))


motor = create_engine("sqlite:///datos.db")
Base.metadata.drop_all(motor)
Base.metadata.create_all(motor)
CrearSesion = sessionmaker(bind=motor, expire_on_commit=False)


class Repositorio(Protocol):
    """Lo unico que el dominio necesita. Tres metodos.

    Cualquier cosa que sepa hacer esto le vale — y por eso hay dos.
    """

    def por_id(self, id_proyecto: int) -> Proyecto | None: ...
    def guardar(self, proyecto: Proyecto) -> Proyecto: ...
    def siguiente_id_proyecto(self) -> int: ...
    def siguiente_id_tarea(self) -> int: ...


class RepositorioEnMemoria:
    """Para las pruebas. Un diccionario y dos contadores."""

    def __init__(self) -> None:
        self.proyectos: dict[int, Proyecto] = {}
        self.siguiente = 1
        self.siguiente_tarea = 1

    def por_id(self, id_proyecto: int) -> Proyecto | None:
        return self.proyectos.get(id_proyecto)

    def guardar(self, proyecto: Proyecto) -> Proyecto:
        self.proyectos[proyecto.id] = proyecto
        return proyecto

    def siguiente_id_proyecto(self) -> int:
        valor = self.siguiente
        self.siguiente += 1
        return valor

    def siguiente_id_tarea(self) -> int:
        valor = self.siguiente_tarea
        self.siguiente_tarea += 1
        return valor


class RepositorioSqlAlchemy:
    """Para el servicio. Traduce entre las filas y las entidades del dominio."""

    def por_id(self, id_proyecto: int) -> Proyecto | None:
        with CrearSesion() as s:
            fila = s.get(FilaProyecto, id_proyecto)
            if fila is None:
                return None
            # Devuelve una ENTIDAD DEL DOMINIO, no una fila. Es la linea que
            # separa un repositorio de verdad de uno decorativo: si devolviera la
            # fila, el dominio dependeria del ORM igual que antes.
            return Proyecto(
                fila.id,
                fila.nombre,
                fila.cerrado,
                [Tarea(t.id, t.titulo, t.hecha) for t in sorted(fila.tareas, key=lambda t: t.id)],
            )

    def guardar(self, proyecto: Proyecto) -> Proyecto:
        with CrearSesion() as s:
            fila = s.get(FilaProyecto, proyecto.id)
            if fila is None:
                fila = FilaProyecto(id=proyecto.id, nombre=proyecto.nombre)
                s.add(fila)
            fila.nombre = proyecto.nombre
            fila.cerrado = proyecto.cerrado

            existentes = {t.id: t for t in fila.tareas}
            for tarea in proyecto.tareas:
                if tarea.id in existentes:
                    existentes[tarea.id].titulo = tarea.titulo
                    existentes[tarea.id].hecha = tarea.hecha
                else:
                    fila.tareas.append(
                        FilaTarea(id=tarea.id, titulo=tarea.titulo, hecha=tarea.hecha)
                    )
            s.commit()
        return proyecto

    def siguiente_id_proyecto(self) -> int:
        with CrearSesion() as s:
            return (s.scalar(select(func.max(FilaProyecto.id))) or 0) + 1

    def siguiente_id_tarea(self) -> int:
        with CrearSesion() as s:
            return (s.scalar(select(func.max(FilaTarea.id))) or 0) + 1


repositorio: Repositorio = RepositorioSqlAlchemy()


def responder_regla(error: ReglaRota) -> JSONResponse:
    estado = 404 if error.codigo == "NO_EXISTE" else 409
    return JSONResponse({"code": error.codigo}, status_code=estado)


@app.get("/dominio")
def ver_dominio() -> JSONResponse:
    """LA COMPROBACION QUE HACE HONESTA A ESTA CLASE.

    Se lee el archivo del dominio y se busca cualquier mencion al ORM o al
    framework web. Si apareciera una, esta ruta lo diria — y el contrato fallaria.
    """
    texto = (RAIZ / "dominio.py").read_text(encoding="utf-8")
    # Se miran los IMPORTS, no cualquier mencion: el propio comentario del
    # archivo dice «no importa SQLAlchemy», y buscar la palabra suelta daria un
    # falso positivo. Lo que importa es de que depende el modulo, no de que habla.
    importados = [
        linea for linea in texto.splitlines()
        if linea.startswith("import ") or linea.startswith("from ")
    ]
    prohibidas = ("sqlalchemy", "fastapi", "pydantic")
    return JSONResponse({
        "menciona_orm": any(
            palabra in linea.lower() for linea in importados for palabra in prohibidas
        ),
        "importa": importados,
        "reglas": len(re.findall(r"REGLA \d", texto)),
    })


@app.post("/proyectos", status_code=201)
def crear_proyecto(cuerpo: dict[str, Any]) -> JSONResponse:
    proyecto = Proyecto(repositorio.siguiente_id_proyecto(), str(cuerpo.get("nombre", "")))
    repositorio.guardar(proyecto)
    return JSONResponse(proyecto.salida(), status_code=201)


@app.post("/proyectos/{id_proyecto}/tareas", status_code=201)
def anadir_tarea(id_proyecto: int, cuerpo: dict[str, Any]) -> JSONResponse:
    proyecto = repositorio.por_id(id_proyecto)
    if proyecto is None:
        return JSONResponse({"code": "NO_EXISTE"}, status_code=404)
    try:
        # La regla se aplica EN EL DOMINIO. El manejador no sabe cuales son ni en
        # que orden se comprueban: solo traduce el fallo a un codigo HTTP.
        proyecto.anadir_tarea(repositorio.siguiente_id_tarea(), str(cuerpo.get("titulo", "")))
    except ReglaRota as error:
        return responder_regla(error)
    repositorio.guardar(proyecto)
    return JSONResponse(proyecto.salida(), status_code=201)


@app.post("/proyectos/{id_proyecto}/tareas/{id_tarea}/terminar")
def terminar_tarea(id_proyecto: int, id_tarea: int) -> JSONResponse:
    proyecto = repositorio.por_id(id_proyecto)
    if proyecto is None:
        return JSONResponse({"code": "NO_EXISTE"}, status_code=404)
    try:
        proyecto.terminar_tarea(id_tarea)
    except ReglaRota as error:
        return responder_regla(error)
    repositorio.guardar(proyecto)
    return JSONResponse(proyecto.salida())


@app.post("/proyectos/{id_proyecto}/cerrar")
def cerrar(id_proyecto: int) -> JSONResponse:
    proyecto = repositorio.por_id(id_proyecto)
    if proyecto is None:
        return JSONResponse({"code": "NO_EXISTE"}, status_code=404)
    try:
        proyecto.cerrar()
    except ReglaRota as error:
        return responder_regla(error)
    repositorio.guardar(proyecto)
    return JSONResponse(proyecto.salida())


@app.get("/proyectos/{id_proyecto}")
def leer(id_proyecto: int) -> JSONResponse:
    proyecto = repositorio.por_id(id_proyecto)
    if proyecto is None:
        return JSONResponse({"code": "NO_EXISTE"}, status_code=404)
    return JSONResponse(proyecto.salida())


@app.get("/pruebas-del-dominio")
def pruebas_del_dominio() -> JSONResponse:
    """LAS MISMAS TRES REGLAS, CONTRA EL REPOSITORIO EN MEMORIA.

    Sin base de datos, sin esquema, sin limpiar tablas. Es el argumento entero de
    esta clase, y aqui se ejecuta de verdad en lugar de afirmarse.
    """
    memoria = RepositorioEnMemoria()
    resultados: list[dict[str, Any]] = []

    def comprobar(nombre: str, funcion, esperado: str) -> None:
        try:
            funcion()
            resultados.append({"nombre": nombre, "paso": False, "motivo": "no lanzo"})
        except ReglaRota as error:
            resultados.append({
                "nombre": nombre, "paso": error.codigo == esperado, "motivo": error.codigo,
            })

    uno = Proyecto(memoria.siguiente_id_proyecto(), "pruebas")
    uno.anadir_tarea(memoria.siguiente_id_tarea(), "pendiente")
    memoria.guardar(uno)
    comprobar("no se cierra con pendientes", uno.cerrar, "QUEDAN_PENDIENTES")

    dos = Proyecto(memoria.siguiente_id_proyecto(), "cerrado")
    dos.cerrar()
    comprobar(
        "no se anade a uno cerrado",
        lambda: dos.anadir_tarea(memoria.siguiente_id_tarea(), "tarde"),
        "PROYECTO_CERRADO",
    )

    tres = Proyecto(memoria.siguiente_id_proyecto(), "repetidos")
    tres.anadir_tarea(memoria.siguiente_id_tarea(), "misma")
    comprobar(
        "no se repite el titulo",
        lambda: tres.anadir_tarea(memoria.siguiente_id_tarea(), "misma"),
        "TITULO_REPETIDO",
    )

    return JSONResponse({
        "ejecutadas": len(resultados),
        "pasadas": sum(1 for r in resultados if r["paso"]),
        "uso_base_de_datos": False,
        "detalle": resultados,
    })
