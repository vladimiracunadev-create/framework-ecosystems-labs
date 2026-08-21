from typing import Any

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, text

app = FastAPI()

# `create_engine` a secas: esta clase usa SQLAlchemy CORE, sin mapeo de objetos.
# Se escribe el SQL y se lee el resultado, que es exactamente de lo que trata.
motor = create_engine("sqlite:///datos.db")

with motor.begin() as conexion:
    conexion.execute(text("DROP TABLE IF EXISTS tareas"))
    conexion.execute(text(
        "CREATE TABLE tareas ("
        "  id INTEGER PRIMARY KEY AUTOINCREMENT,"
        "  titulo TEXT NOT NULL"
        ")"
    ))


@app.post("/tareas", status_code=201)
def crear(cuerpo: dict[str, Any]) -> JSONResponse:
    """`:titulo` es un MARCADOR, no una interpolacion.

    El texto de la consulta viaja por un lado y el valor por otro. Cuando la base
    recibe la sentencia, ya esta decidido que parte es codigo — y por eso
    `'; DROP TABLE tareas; --` acaba siendo un titulo de tarea.
    """
    titulo = str(cuerpo.get("titulo", ""))
    with motor.begin() as conexion:
        fila = conexion.execute(
            text("INSERT INTO tareas (titulo) VALUES (:titulo) RETURNING id, titulo"),
            {"titulo": titulo},
        ).one()
    return JSONResponse({"id": fila.id, "titulo": fila.titulo}, status_code=201)


@app.get("/tareas")
def listar(titulo: str | None = None) -> JSONResponse:
    with motor.connect() as conexion:
        if titulo is None:
            filas = conexion.execute(
                text("SELECT id, titulo FROM tareas ORDER BY id")
            ).all()
        else:
            filas = conexion.execute(
                text("SELECT id, titulo FROM tareas WHERE titulo = :titulo ORDER BY id"),
                {"titulo": titulo},
            ).all()
    tareas = [{"id": f.id, "titulo": f.titulo} for f in filas]
    return JSONResponse({"tareas": tareas, "total": len(tareas)})


@app.get("/tareas/{id_tarea}")
def obtener(id_tarea: int) -> JSONResponse:
    with motor.connect() as conexion:
        fila = conexion.execute(
            text("SELECT id, titulo FROM tareas WHERE id = :id"),
            {"id": id_tarea},
        ).first()
    if fila is None:
        return JSONResponse({"code": "NO_EXISTE"}, status_code=404)
    return JSONResponse({"id": fila.id, "titulo": fila.titulo})
