from collections.abc import Iterator
from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.responses import JSONResponse
from sqlalchemy import ForeignKey, Integer, String, create_engine, event, select
from sqlalchemy.engine import Engine
from sqlalchemy.orm import (
    DeclarativeBase, Mapped, Session, mapped_column, relationship, selectinload, sessionmaker,
)

app = FastAPI()


class Base(DeclarativeBase):
    pass


class Tarea(Base):
    __tablename__ = "tareas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    titulo: Mapped[str] = mapped_column(String(120))
    # Perezosa por omision: la lista se carga al TOCARLA. Es lo que hace que el
    # problema N+1 aparezca sin escribir un solo bucle de consultas.
    etiquetas: Mapped[list["Etiqueta"]] = relationship(
        back_populates="tarea", cascade="all, delete-orphan"
    )


class Etiqueta(Base):
    __tablename__ = "etiquetas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(60))
    tarea_id: Mapped[int] = mapped_column(ForeignKey("tareas.id", ondelete="CASCADE"))
    tarea: Mapped[Tarea] = relationship(back_populates="etiquetas")


motor = create_engine("sqlite:///datos.db")

consultas = {"total": 0}


# Contar las consultas es la unica forma honesta de ensenar esta clase: el
# resultado del N+1 es CORRECTO, y lo que falla es cuanto costo obtenerlo.
@event.listens_for(Engine, "before_cursor_execute")
def contar(conexion, cursor, sentencia, parametros, contexto, muchos):
    consultas["total"] += 1


Base.metadata.drop_all(motor)
Base.metadata.create_all(motor)
CrearSesion = sessionmaker(bind=motor, expire_on_commit=False)

with CrearSesion() as inicial:
    for titulo in ("una", "dos", "tres"):
        inicial.add(Tarea(titulo=titulo, etiquetas=[
            Etiqueta(nombre=f"{titulo}-a"), Etiqueta(nombre=f"{titulo}-b"),
        ]))
    inicial.commit()


def sesion() -> Iterator[Session]:
    s = CrearSesion()
    try:
        yield s
    finally:
        s.close()


@app.get("/reiniciar")
def reiniciar() -> JSONResponse:
    consultas["total"] = 0
    return JSONResponse({"ok": True})


@app.get("/consultas")
def ver() -> JSONResponse:
    return JSONResponse({"consultas": consultas["total"]})


@app.get("/tareas-n1")
def n_mas_uno(s: Annotated[Session, Depends(sesion)]) -> JSONResponse:
    """LA FORMA INGENUA.

    Una consulta para las tareas. Y despues, al tocar `tarea.etiquetas`, una
    consulta MAS POR TAREA — sin que nada en este codigo lo insinue. Ese es el
    problema: el bucle parece que solo lee memoria.
    """
    tareas = s.scalars(select(Tarea)).all()
    return JSONResponse({"tareas": [
        {"id": t.id, "titulo": t.titulo, "etiquetas": [e.nombre for e in t.etiquetas]}
        for t in tareas
    ]})


@app.get("/tareas-anticipada")
def anticipada(s: Annotated[Session, Depends(sesion)]) -> JSONResponse:
    """LA FORMA ANTICIPADA. `selectinload` trae todas las etiquetas en UNA
    segunda consulta, sea cual sea el numero de tareas."""
    tareas = s.scalars(select(Tarea).options(selectinload(Tarea.etiquetas))).all()
    return JSONResponse({"tareas": [
        {"id": t.id, "titulo": t.titulo, "etiquetas": [e.nombre for e in t.etiquetas]}
        for t in tareas
    ]})
