"""El mismo contrato, en FastAPI.

Igual que en las otras cuatro implementaciones, lo que interesa son las líneas
que existen SOLO para apartarse del comportamiento por omisión. Aquí son menos
que en Express y por un motivo concreto: FastAPI deja declarar el código de
estado en el propio decorador, así que no hace falta construir la respuesta a
mano para cambiarlo.
"""

from typing import Any

from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse

app = FastAPI()

tareas: dict[str, dict[str, str]] = {}
estado = {"siguiente": 0}


@app.get("/tareas")
def listar() -> JSONResponse:
    lista = list(tareas.values())
    return JSONResponse({"total": len(lista), "tareas": lista})


@app.post("/tareas")
def crear(cuerpo: dict[str, Any]) -> JSONResponse:
    estado["siguiente"] += 1
    identificador = str(estado["siguiente"])
    tarea = {"id": identificador, "titulo": str(cuerpo.get("titulo", ""))}
    tareas[identificador] = tarea
    # FUERA DE LA OMISIÓN (1): FastAPI respondería 200. El 201 y la cabecera
    # Location se declaran aquí.
    return JSONResponse(tarea, status_code=201, headers={"Location": f"/tareas/{identificador}"})


@app.get("/tareas/{identificador}")
def obtener(identificador: str) -> JSONResponse:
    tarea = tareas.get(identificador)
    # FUERA DE LA OMISIÓN (2): el 404 de FastAPI es JSON, pero con la forma
    # {"detail": "..."} que fija su convención. El contrato pide otra, así que
    # se construye la respuesta en vez de lanzar HTTPException.
    if tarea is None:
        return JSONResponse({"error": "no-encontrada"}, status_code=404)
    return JSONResponse(tarea)


@app.delete("/tareas/{identificador}")
def borrar(identificador: str) -> Response:
    if identificador not in tareas:
        return JSONResponse({"error": "no-encontrada"}, status_code=404)
    tareas.pop(identificador)
    # FUERA DE LA OMISIÓN (3): `Response` pelado, no JSONResponse. Un 204 no
    # lleva cuerpo, y devolver `null` serializado serían cuatro bytes de más.
    return Response(status_code=204)
