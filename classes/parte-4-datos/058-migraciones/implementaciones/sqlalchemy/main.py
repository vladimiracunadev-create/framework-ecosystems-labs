import os
from pathlib import Path
from typing import Any

from alembic import command
from alembic.config import Config
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from sqlalchemy import Integer, String, create_engine, inspect, select, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

app = FastAPI()

RAIZ = Path(__file__).parent
BASE = RAIZ / "datos.db"

# Se parte de una base que NO EXISTE: asi las migraciones se ejecutan de verdad
# al arrancar, en orden, y el historial que lee `/historial` lo escribieron
# ellas. Con una base ya migrada, la clase probaria bastante menos.
if BASE.exists():
    os.remove(BASE)

configuracion = Config(str(RAIZ / "alembic.ini"))
configuracion.set_main_option("script_location", str(RAIZ / "migraciones"))


def migrar() -> None:
    """`upgrade head` aplica lo que falte y nada mas.

    Es el equivalente de `prisma migrate deploy` o de `dotnet ef database
    update`: no genera archivos, no compara modelos, solo ejecuta las revisiones
    que la tabla `alembic_version` todavia no registra.
    """
    command.upgrade(configuracion, "head")


migrar()

motor = create_engine(f"sqlite:///{BASE}")
CrearSesion = sessionmaker(bind=motor, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class Tarea(Base):
    __tablename__ = "tareas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    titulo: Mapped[str] = mapped_column(String(120))
    prioridad: Mapped[int] = mapped_column(Integer, server_default="0")


def aplicadas() -> list[str]:
    """Alembic guarda SOLO la revision actual, no la lista entera.

    Es una diferencia real con Flyway y con EF Core, que llevan una fila por
    migracion. Para saber cuantas se aplicaron hay que recorrer la cadena de
    `down_revision` hacia atras desde la actual — que es exactamente lo que hace
    `iterate_revisions`.
    """
    from alembic.script import ScriptDirectory

    with motor.connect() as conexion:
        fila = conexion.execute(text("SELECT version_num FROM alembic_version")).first()
    if fila is None:
        return []
    guiones = ScriptDirectory.from_config(configuracion)
    return [r.revision for r in guiones.iterate_revisions(fila[0], "base")][::-1]


@app.get("/historial")
def historial() -> JSONResponse:
    lista = aplicadas()
    return JSONResponse({"aplicadas": lista, "total": len(lista)})


@app.get("/esquema")
def esquema() -> JSONResponse:
    """Se lee del CATALOGO de la base, no del modelo.

    Leerlo del modelo probaria que el archivo dice lo que dice, no que la
    migracion se aplico — que es justo lo que esta clase quiere comprobar.
    """
    columnas = [c["name"] for c in inspect(motor).get_columns("tareas")]
    return JSONResponse({"columnas": sorted(columnas)})


@app.get("/tareas")
def tareas() -> JSONResponse:
    with CrearSesion() as s:
        filas = s.scalars(select(Tarea).order_by(Tarea.id)).all()
    return JSONResponse({"tareas": [
        {"id": t.id, "titulo": t.titulo, "prioridad": t.prioridad} for t in filas
    ]})


@app.post("/tareas", status_code=201)
def crear(cuerpo: dict[str, Any]) -> JSONResponse:
    tarea = Tarea(titulo=cuerpo.get("titulo", ""), prioridad=cuerpo.get("prioridad", 0))
    with CrearSesion() as s:
        s.add(tarea)
        s.commit()
    return JSONResponse(
        {"id": tarea.id, "titulo": tarea.titulo, "prioridad": tarea.prioridad},
        status_code=201,
    )


@app.post("/migrar")
def volver_a_migrar() -> JSONResponse:
    """Volver a migrar no aplica nada: la historia ya las tiene."""
    antes = len(aplicadas())
    migrar()
    despues = aplicadas()
    return JSONResponse({"nuevas": len(despues) - antes, "total": len(despues)})
