from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

tareas: dict[str, dict[str, str]] = {"1": {"id": "1", "titulo": "original"}}
siguiente = 100


class Cuerpo(BaseModel):
    titulo: str = ""


@app.post("/tareas")
def crear(cuerpo: Cuerpo) -> Response:
    global siguiente
    identificador = str(siguiente)
    siguiente += 1
    tareas[identificador] = {"id": identificador, "titulo": cuerpo.titulo}
    return JSONResponse(
        {"id": identificador},
        status_code=201,
        headers={"location": f"/tareas/{identificador}"},
    )


# `status_code=204` en el decorador y `Response(status_code=204)` sin cuerpo:
# devolver contenido con un 204 es un error que algunos clientes castigan.
@app.delete("/tareas/{id}", status_code=204)
def borrar(id: str) -> Response:
    if id not in tareas:
        return JSONResponse({"error": "no existe"}, status_code=404)
    del tareas[id]
    return Response(status_code=204)


@app.get("/tareas/{id}")
def obtener(id: str) -> Response:
    if id not in tareas:
        return JSONResponse({"error": "no existe"}, status_code=404)
    return JSONResponse(tareas[id])
