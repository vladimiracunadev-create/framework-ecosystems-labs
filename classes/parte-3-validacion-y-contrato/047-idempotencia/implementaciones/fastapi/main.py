from typing import Annotated

from fastapi import FastAPI, Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

tareas: dict[str, dict[str, str]] = {}
respuestas: dict[str, dict[str, object]] = {}
estado = {"siguiente": 1}


class Cuerpo(BaseModel):
    titulo: str = ""


def crear(titulo: str) -> dict[str, str]:
    identificador = str(estado["siguiente"])
    estado["siguiente"] += 1
    tarea = {"id": identificador, "titulo": titulo}
    tareas[identificador] = tarea
    return tarea


@app.post("/tareas")
def crear_tarea(
    cuerpo: Cuerpo,
    idempotency_key: Annotated[str | None, Header()] = None,
) -> JSONResponse:
    if idempotency_key is None:
        return JSONResponse(crear(cuerpo.titulo), status_code=201)

    previa = respuestas.get(idempotency_key)
    if previa is not None:
        return JSONResponse(
            previa["cuerpo"],
            status_code=int(previa["estado"]),
            headers={"idempotent-replay": "true"},
        )

    tarea = crear(cuerpo.titulo)
    respuestas[idempotency_key] = {"estado": 201, "cuerpo": tarea}
    return JSONResponse(tarea, status_code=201)


@app.get("/tareas")
def contar() -> JSONResponse:
    return JSONResponse({"total": len(tareas)})
