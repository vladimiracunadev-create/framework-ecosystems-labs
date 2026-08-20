from typing import Literal

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

app = FastAPI(title="Clase 042", version="1.0.0")


class Tarea(BaseModel):
    """UNA declaracion. Tres usos, sin escribir nada mas:

    1. VALIDACION en tiempo de ejecucion — la peticion que no encaja se rechaza.
    2. TIPOS para el editor — `tarea.titulo` se autocompleta y se comprueba.
    3. DOCUMENTACION — el esquema de OpenAPI sale de aqui.

    Cambiar `max_length` a 80 cambia las tres a la vez. No hay forma de que
    diverjan porque no hay tres declaraciones.
    """

    titulo: str = Field(min_length=1, max_length=120, description="Qué hay que hacer")
    prioridad: Literal[1, 2, 3] = Field(default=2, description="1 alta, 3 baja")


@app.post("/tareas", status_code=status.HTTP_201_CREATED)
def crear(tarea: Tarea) -> dict[str, object]:
    return {"titulo": tarea.titulo, "prioridad": tarea.prioridad}


@app.exception_handler(RequestValidationError)
async def invalido(peticion: Request, error: RequestValidationError) -> JSONResponse:
    return JSONResponse({"code": "VALIDACION"}, status_code=422)
