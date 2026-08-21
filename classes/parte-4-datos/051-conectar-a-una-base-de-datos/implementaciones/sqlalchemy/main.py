from collections.abc import Iterator
from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy import Integer, String, create_engine, text
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker

app = FastAPI()


class Base(DeclarativeBase):
    pass


class Tarea(Base):
    __tablename__ = "tareas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    titulo: Mapped[str] = mapped_column(String(120))


# El MOTOR se crea UNA vez y mantiene el grupo de conexiones. La sesión, en
# cambio, es por unidad de trabajo: crear un motor por peticion abriria un grupo
# nuevo cada vez.
motor = create_engine("sqlite:///datos.db", echo=False)
Base.metadata.drop_all(motor)
Base.metadata.create_all(motor)

CrearSesion = sessionmaker(bind=motor, expire_on_commit=False)


def sesion() -> Iterator[Session]:
    """La sesion se abre por peticion y se CIERRA siempre.

    El `finally` no es opcional: sin el, una excepcion deja la conexion fuera
    del grupo, y con trafico real el grupo se agota en minutos.
    """
    s = CrearSesion()
    try:
        yield s
    finally:
        s.close()


class Cuerpo(BaseModel):
    titulo: str = ""


@app.get("/salud")
def salud(s: Annotated[Session, Depends(sesion)]) -> JSONResponse:
    try:
        s.execute(text("SELECT 1"))
        return JSONResponse({"conectado": True})
    except Exception:
        return JSONResponse({"conectado": False}, status_code=503)


@app.post("/tareas", status_code=201)
def crear(cuerpo: Cuerpo, s: Annotated[Session, Depends(sesion)]) -> JSONResponse:
    tarea = Tarea(titulo=cuerpo.titulo)
    s.add(tarea)
    s.commit()
    return JSONResponse({"id": tarea.id, "titulo": tarea.titulo}, status_code=201)


@app.get("/tareas/{id}")
def obtener(id: int, s: Annotated[Session, Depends(sesion)]) -> JSONResponse:
    tarea = s.get(Tarea, id)
    if tarea is None:
        return JSONResponse({"code": "NO_EXISTE"}, status_code=404)
    return JSONResponse({"id": tarea.id, "titulo": tarea.titulo})
