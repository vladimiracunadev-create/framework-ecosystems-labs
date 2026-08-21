"""La capa de persistencia. AQUI vive todo lo que sabe de SQL.

El mapeo es IMPERATIVO: la tabla se describe aparte y se ata a la clase del
dominio con `map_imperatively`. La clase `Tarea` de `dominio.py` no cambia ni una
linea por estar mapeada — que es la promesa entera del patron.
"""
from typing import Any

from dominio import Tarea, TituloRequerido
from fastapi import FastAPI
from fastapi.responses import JSONResponse, Response
from sqlalchemy import Boolean, Column, Integer, MetaData, String, Table, create_engine, select
from sqlalchemy.orm import Session, registry, sessionmaker

app = FastAPI()

metadatos = MetaData()

tabla_tareas = Table(
    "tareas",
    metadatos,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("titulo", String(120), nullable=False),
    Column("hecha", Boolean, nullable=False, default=False),
)

# El mapeador. Es LA UNICA linea que une el dominio con el almacenamiento, y
# esta aqui — no dentro de la clase.
mapeador = registry()
mapeador.map_imperatively(Tarea, tabla_tareas)

motor = create_engine("sqlite:///datos.db")
metadatos.drop_all(motor)
metadatos.create_all(motor)
CrearSesion = sessionmaker(bind=motor, expire_on_commit=False)


class Repositorio:
    """El repositorio es el que sabe guardar. La entidad, no."""

    def __init__(self, sesion: Session) -> None:
        self.sesion = sesion

    def guardar(self, tarea: Tarea) -> Tarea:
        self.sesion.add(tarea)
        self.sesion.commit()
        return tarea

    def por_id(self, id_tarea: int) -> Tarea | None:
        return self.sesion.get(Tarea, id_tarea)

    def todas(self) -> list[Tarea]:
        return list(self.sesion.scalars(select(Tarea).order_by(tabla_tareas.c.id)).all())

    def borrar(self, tarea: Tarea) -> None:
        self.sesion.delete(tarea)
        self.sesion.commit()


@app.post("/tareas", status_code=201)
def crear(cuerpo: dict[str, Any]) -> JSONResponse:
    try:
        # La regla se comprueba AL CONSTRUIR el objeto del dominio, antes de que
        # el repositorio entre en escena. Una tarea invalida no llega a existir.
        tarea = Tarea(titulo=str(cuerpo.get("titulo", "")))
    except TituloRequerido:
        return JSONResponse({"code": "TITULO_REQUERIDO"}, status_code=422)

    with CrearSesion() as s:
        Repositorio(s).guardar(tarea)
    return JSONResponse(tarea.salida(), status_code=201)


@app.get("/tareas")
def listar() -> JSONResponse:
    with CrearSesion() as s:
        tareas = Repositorio(s).todas()
    return JSONResponse({"tareas": [t.salida() for t in tareas], "total": len(tareas)})


@app.get("/tareas/{id_tarea}")
def obtener(id_tarea: int) -> JSONResponse:
    with CrearSesion() as s:
        tarea = Repositorio(s).por_id(id_tarea)
    if tarea is None:
        return JSONResponse({"code": "NO_EXISTE"}, status_code=404)
    return JSONResponse(tarea.salida())


@app.patch("/tareas/{id_tarea}")
def modificar(id_tarea: int, cuerpo: dict[str, Any]) -> JSONResponse:
    with CrearSesion() as s:
        repositorio = Repositorio(s)
        tarea = repositorio.por_id(id_tarea)
        if tarea is None:
            return JSONResponse({"code": "NO_EXISTE"}, status_code=404)
        try:
            if "titulo" in cuerpo:
                tarea.renombrar(str(cuerpo["titulo"]))
            if "hecha" in cuerpo:
                tarea.marcar(bool(cuerpo["hecha"]))
        except TituloRequerido:
            return JSONResponse({"code": "TITULO_REQUERIDO"}, status_code=422)
        repositorio.guardar(tarea)
        salida = tarea.salida()
    return JSONResponse(salida)


@app.delete("/tareas/{id_tarea}", status_code=204)
def borrar(id_tarea: int) -> Response:
    with CrearSesion() as s:
        repositorio = Repositorio(s)
        tarea = repositorio.por_id(id_tarea)
        if tarea is None:
            return JSONResponse({"code": "NO_EXISTE"}, status_code=404)
        repositorio.borrar(tarea)
    return Response(status_code=204)
