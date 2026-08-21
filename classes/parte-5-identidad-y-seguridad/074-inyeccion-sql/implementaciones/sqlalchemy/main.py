"""Inyección SQL con SQLAlchemy Core: `:titulo` es un marcador, no una interpolación.

El texto de la consulta viaja por un lado y el valor por otro. Cuando la base
recibe la sentencia, ya está decidido qué parte es código — y por eso
`'); DROP TABLE tareas; --` acaba siendo un título de tarea, no un comando.
"""

from typing import Any

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, text

app = FastAPI()

motor = create_engine("sqlite:///datos.db")

with motor.begin() as conexion:
    conexion.execute(text("DROP TABLE IF EXISTS tareas"))
    conexion.execute(text(
        "CREATE TABLE tareas ("
        "  id INTEGER PRIMARY KEY AUTOINCREMENT,"
        "  titulo TEXT NOT NULL"
        ")"
    ))
    # Se parte de dos tareas.
    for titulo in ("preparar informe", "revisar contrato"):
        conexion.execute(text("INSERT INTO tareas (titulo) VALUES (:titulo)"), {"titulo": titulo})


@app.post("/tareas", status_code=201)
def crear(cuerpo: dict[str, Any]) -> JSONResponse:
    titulo = str(cuerpo.get("titulo", ""))
    with motor.begin() as conexion:
        fila = conexion.execute(
            text("INSERT INTO tareas (titulo) VALUES (:titulo) RETURNING id, titulo"),
            {"titulo": titulo},
        ).one()
    return JSONResponse({"id": str(fila.id), "titulo": fila.titulo}, status_code=201)


@app.get("/tareas")
def listar(titulo: str | None = None) -> JSONResponse:
    with motor.connect() as conexion:
        if titulo is None:
            filas = conexion.execute(text("SELECT id, titulo FROM tareas ORDER BY id")).all()
        else:
            # `:titulo` marcador: `' OR '1'='1` se busca como ese texto exacto,
            # que no existe → total 0. Concatenar aquí sería la inyección.
            filas = conexion.execute(
                text("SELECT id, titulo FROM tareas WHERE titulo = :titulo ORDER BY id"),
                {"titulo": titulo},
            ).all()
    tareas = [{"id": str(f.id), "titulo": f.titulo} for f in filas]
    return JSONResponse({"tareas": tareas, "total": len(tareas)})


@app.get("/tareas/{id_tarea}")
def obtener(id_tarea: int) -> JSONResponse:
    with motor.connect() as conexion:
        fila = conexion.execute(
            text("SELECT id, titulo FROM tareas WHERE id = :id"), {"id": id_tarea}
        ).first()
    if fila is None:
        return JSONResponse({"error": "no-encontrada"}, status_code=404)
    return JSONResponse({"id": str(fila.id), "titulo": fila.titulo})
