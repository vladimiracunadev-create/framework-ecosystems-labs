from collections.abc import Callable

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from sqlalchemy import ForeignKey, Integer, String, create_engine, event, select
from sqlalchemy.engine import Engine
from sqlalchemy.orm import (
    DeclarativeBase, Mapped, mapped_column, relationship, selectinload, sessionmaker,
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

TITULOS = ("una", "dos", "tres", "cuatro", "cinco", "seis")


def sembrar(cuantas: int) -> int:
    """Cada tarea con dos etiquetas. El numero de tareas es el parametro."""
    with CrearSesion() as s:
        s.query(Etiqueta).delete()
        s.query(Tarea).delete()
        for titulo in TITULOS[:cuantas]:
            s.add(Tarea(titulo=titulo, etiquetas=[
                Etiqueta(nombre=f"{titulo}-a"), Etiqueta(nombre=f"{titulo}-b"),
            ]))
        s.commit()
    consultas["total"] = 0
    return cuantas


def ingenua() -> list[dict]:
    """LA FORMA INGENUA.

    Una consulta para las tareas. Y despues, al tocar `tarea.etiquetas`, una
    consulta MAS POR TAREA — sin que nada en este codigo lo insinue. Ese es el
    problema: el bucle parece que solo lee memoria.
    """
    with CrearSesion() as s:
        tareas = s.scalars(select(Tarea).order_by(Tarea.id)).all()
        return [
            {"id": t.id, "titulo": t.titulo, "etiquetas": sorted(e.nombre for e in t.etiquetas)}
            for t in tareas
        ]


def anticipada() -> list[dict]:
    """LA FORMA ANTICIPADA.

    `selectinload` trae todas las etiquetas en UNA segunda consulta, sea cual sea
    el numero de tareas. `joinedload` haria lo mismo en UNA sola con union — y
    duplicaria las filas de la tarea, una por etiqueta.
    """
    with CrearSesion() as s:
        tareas = s.scalars(
            select(Tarea).options(selectinload(Tarea.etiquetas)).order_by(Tarea.id)
        ).all()
        return [
            {"id": t.id, "titulo": t.titulo, "etiquetas": sorted(e.nombre for e in t.etiquetas)}
            for t in tareas
        ]


RUTAS: dict[str, Callable[[], list[dict]]] = {
    "tareas-n1": ingenua,
    "tareas-anticipada": anticipada,
}

sembrar(3)


@app.get("/reiniciar")
def reiniciar() -> JSONResponse:
    tareas = sembrar(3)
    return JSONResponse({"consultas": consultas["total"], "tareas": tareas})


@app.get("/consultas")
def ver() -> JSONResponse:
    return JSONResponse({"consultas": consultas["total"]})


@app.get("/tareas-n1")
def n_mas_uno() -> JSONResponse:
    return JSONResponse({"tareas": ingenua()})


@app.get("/tareas-anticipada")
def anticipada_http() -> JSONResponse:
    return JSONResponse({"tareas": anticipada()})


@app.get("/crecimiento")
def crecimiento(ruta: str = "") -> JSONResponse:
    """LO UNICO QUE DISTINGUE EL PROBLEMA.

    Un numero absoluto de consultas no dice nada: la carga anticipada cuesta una
    consulta con union y dos con segunda consulta, y las dos estan bien. Lo que
    importa es si ese numero CRECE con el numero de filas.

    Aqui se mide: se ejecuta la misma ruta con tres tareas y con seis, y se resta.
    """
    funcion = RUTAS.get(ruta)
    if funcion is None:
        return JSONResponse({"code": "RUTA_DESCONOCIDA"}, status_code=404)

    sembrar(3)
    funcion()
    con_3 = consultas["total"]

    sembrar(6)
    funcion()
    con_6 = consultas["total"]

    sembrar(3)
    return JSONResponse({"con_3": con_3, "con_6": con_6, "crecimiento": con_6 - con_3})
