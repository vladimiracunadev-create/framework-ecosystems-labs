from collections import defaultdict

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from sqlalchemy import Boolean, Integer, String, create_engine, select, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

app = FastAPI()


class Base(DeclarativeBase):
    pass


class Tarea(Base):
    __tablename__ = "tareas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    proyecto: Mapped[str] = mapped_column(String(60))
    titulo: Mapped[str] = mapped_column(String(120))
    hecha: Mapped[bool] = mapped_column(Boolean, default=False)


motor = create_engine("sqlite:///datos.db")
Base.metadata.drop_all(motor)
Base.metadata.create_all(motor)
CrearSesion = sessionmaker(bind=motor, expire_on_commit=False)

SEMILLA = [
    ("casa", "comprar pan", True),
    ("casa", "regar", False),
    ("trabajo", "informe", True),
    ("viaje", "reservar", False),
]

# Cuantas FILAS le llegan al proceso. Es la medida honesta de esta clase: los dos
# informes devuelven lo mismo, y lo que cambia es cuanto viaja por la red y
# cuanto trabajo hace el proceso en lugar del motor.
filas_leidas = {"total": 0}


def sembrar() -> None:
    with CrearSesion() as s:
        s.query(Tarea).delete()
        for proyecto, titulo, hecha in SEMILLA:
            s.add(Tarea(proyecto=proyecto, titulo=titulo, hecha=hecha))
        s.commit()
    filas_leidas["total"] = 0


sembrar()


@app.get("/reiniciar")
def reiniciar() -> JSONResponse:
    sembrar()
    return JSONResponse({"tareas": len(SEMILLA), "proyectos": len({p for p, _, _ in SEMILLA})})


@app.get("/filas-leidas")
def leidas() -> JSONResponse:
    return JSONResponse({"filas_leidas": filas_leidas["total"]})


@app.get("/informe-orm")
def informe_orm() -> JSONResponse:
    """CON EL ORM.

    SQLAlchemy sabe agregar perfectamente; aqui se hace a proposito lo que se
    hace de verdad cuando la agregacion no encaja en el mapeador: traerse las
    filas y agrupar en memoria.

    Con cuatro tareas da igual. Con cuatro millones, el proceso se queda sin
    memoria haciendo un trabajo que el motor sabe hacer sin moverlas.
    """
    with CrearSesion() as s:
        tareas = s.scalars(select(Tarea)).all()
    filas_leidas["total"] = len(tareas)

    acumulado: dict[str, dict[str, int]] = defaultdict(lambda: {"total": 0, "hechas": 0})
    for tarea in tareas:
        acumulado[tarea.proyecto]["total"] += 1
        if tarea.hecha:
            acumulado[tarea.proyecto]["hechas"] += 1

    filas = [
        {"proyecto": proyecto, **valores}
        for proyecto, valores in sorted(acumulado.items())
    ]
    return JSONResponse({"filas": filas})


@app.get("/informe-sql")
def informe_sql(minimo: str = "1") -> JSONResponse:
    """EN SQL. El motor agrupa y devuelve TRES filas.

    `text()` con `:minimo` es un marcador, no una interpolacion. Salir del ORM no
    significa salir de las consultas parametrizadas — eso no se negocia nunca.
    """
    # El parametro se valida ANTES de llegar a la consulta: un marcador solo vale
    # para un valor, asi que si esperas un numero, compruebalo.
    if not minimo.isdigit():
        return JSONResponse({"code": "MINIMO_INVALIDO"}, status_code=400)

    consulta = text("""
        SELECT proyecto,
               COUNT(*)                               AS total,
               SUM(CASE WHEN hecha THEN 1 ELSE 0 END) AS hechas
          FROM tareas
         GROUP BY proyecto
        HAVING COUNT(*) >= :minimo
         ORDER BY proyecto
    """)
    with motor.connect() as conexion:
        filas = conexion.execute(consulta, {"minimo": int(minimo)}).all()
    filas_leidas["total"] = len(filas)

    return JSONResponse({"filas": [
        {"proyecto": f.proyecto, "total": int(f.total), "hechas": int(f.hechas)} for f in filas
    ]})
