from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

tareas: dict[str, dict[str, str]] = {"1": {"id": "1", "titulo": "original"}}
altas = 0


class Cuerpo(BaseModel):
    titulo: str = ""


@app.get("/tareas/{id}")
def obtener(id: str) -> Response:
    if id not in tareas:
        return Response(status_code=404)
    return JSONResponse(tareas[id])


@app.put("/tareas/{id}")
def sustituir(id: str, cuerpo: Cuerpo) -> Response:
    tareas[id] = {"id": id, "titulo": cuerpo.titulo}
    return JSONResponse(tareas[id])


@app.post("/tareas", status_code=201)
def crear(cuerpo: Cuerpo) -> Response:
    global altas
    altas += 1
    identificador = f"nueva-{altas}"
    tareas[identificador] = {"id": identificador, "titulo": cuerpo.titulo}
    return JSONResponse(
        {"id": identificador, "altas": altas},
        status_code=201,
        headers={"location": f"/tareas/{identificador}"},
    )
