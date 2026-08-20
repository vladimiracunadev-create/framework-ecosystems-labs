from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

tareas: dict[str, dict[str, object]] = {
    "1": {"id": "1", "titulo": "existente", "completada": False},
}
estado = {"siguiente": 2}


class Cuerpo(BaseModel):
    titulo: str = ""


@app.get("/tareas/{id}")
def obtener(id: str) -> Response:
    if id not in tareas:
        return JSONResponse({"code": "NO_EXISTE"}, status_code=404)
    return JSONResponse(tareas[id])


@app.post("/tareas")
def crear(cuerpo: Cuerpo) -> Response:
    if not cuerpo.titulo.strip():
        return JSONResponse({"code": "VALIDACION"}, status_code=422)

    identificador = str(estado["siguiente"])
    estado["siguiente"] += 1
    tarea = {"id": identificador, "titulo": cuerpo.titulo.strip(), "completada": False}
    tareas[identificador] = tarea
    return JSONResponse(tarea, status_code=201,
                        headers={"location": f"/tareas/{identificador}"})


@app.delete("/tareas/{id}")
def borrar(id: str) -> Response:
    if id not in tareas:
        return JSONResponse({"code": "NO_EXISTE"}, status_code=404)
    del tareas[id]
    return Response(status_code=204)
