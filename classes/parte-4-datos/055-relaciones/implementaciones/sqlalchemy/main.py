from collections.abc import Iterator
from typing import Annotated

from fastapi import Depends, FastAPI, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy import ForeignKey, Integer, String, create_engine, event, func, select
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

    # `cascade="all, delete-orphan"` borra las etiquetas al borrar la tarea desde
    # la sesion; `ondelete="CASCADE"` lo garantiza en la BASE. Hacen falta los
    # dos: el primero para el ORM, el segundo para cualquier otro que escriba.
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


# SQLite NO aplica las claves ajenas salvo que se le pida en cada conexion. Es
# una trampa clasica: el esquema las declara, la base las ignora, y el borrado en
# cascada no ocurre.
@event.listens_for(Engine, "connect")
def activar_claves_ajenas(conexion, registro):
    cursor = conexion.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


Base.metadata.drop_all(motor)
Base.metadata.create_all(motor)
CrearSesion = sessionmaker(bind=motor, expire_on_commit=False)


def sesion() -> Iterator[Session]:
    s = CrearSesion()
    try:
        yield s
    finally:
        s.close()


class Cuerpo(BaseModel):
    titulo: str = ""
    etiquetas: list[str] = []


def salida(tarea: Tarea) -> dict[str, object]:
    return {
        "id": tarea.id,
        "titulo": tarea.titulo,
        "etiquetas": sorted(e.nombre for e in tarea.etiquetas),
    }


@app.post("/tareas", status_code=201)
def crear(cuerpo: Cuerpo, s: Annotated[Session, Depends(sesion)]) -> JSONResponse:
    tarea = Tarea(titulo=cuerpo.titulo,
                  etiquetas=[Etiqueta(nombre=n) for n in cuerpo.etiquetas])
    s.add(tarea)
    s.commit()
    return JSONResponse(salida(tarea), status_code=201)


@app.get("/tareas/{id}")
def obtener(id: int, s: Annotated[Session, Depends(sesion)]) -> JSONResponse:
    # `selectinload` es la carga ANTICIPADA: dos consultas en total, una para la
    # tarea y otra para todas sus etiquetas. Sin ella, SQLAlchemy cargaria la
    # relacion al tocarla — comodo, y el origen del problema de la clase 056.
    tarea = s.scalars(
        select(Tarea).where(Tarea.id == id).options(selectinload(Tarea.etiquetas))
    ).first()
    if tarea is None:
        return JSONResponse({"code": "NO_EXISTE"}, status_code=404)
    return JSONResponse(salida(tarea))


@app.delete("/tareas/{id}")
def borrar(id: int, s: Annotated[Session, Depends(sesion)]) -> Response:
    tarea = s.get(Tarea, id)
    if tarea is None:
        return JSONResponse({"code": "NO_EXISTE"}, status_code=404)
    s.delete(tarea)
    s.commit()
    return Response(status_code=204)


@app.get("/etiquetas")
def contar(s: Annotated[Session, Depends(sesion)]) -> JSONResponse:
    return JSONResponse({"total": s.scalar(select(func.count()).select_from(Etiqueta))})
