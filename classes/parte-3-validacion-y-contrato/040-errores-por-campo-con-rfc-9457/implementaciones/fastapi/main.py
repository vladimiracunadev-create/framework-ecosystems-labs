from typing import Literal

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

app = FastAPI()

TIPO = "application/problem+json"

# Pydantic devuelve TODOS los errores de una vez, con su ubicación exacta. Lo
# único que hay que hacer es traducir su forma a la del contrato.
CODIGOS = {
    "missing": "REQUERIDO",
    "string_type": "TIPO",
    "string_too_short": "REQUERIDO",
    "string_too_long": "LONGITUD",
    "literal_error": "VALOR",
}


class Tarea(BaseModel):
    titulo: str = Field(min_length=1, max_length=120)
    prioridad: Literal[1, 2, 3] | None = None


@app.post("/tareas", status_code=status.HTTP_201_CREATED)
def crear(tarea: Tarea) -> dict[str, str]:
    return {"titulo": tarea.titulo.strip()}


@app.exception_handler(RequestValidationError)
async def invalido(peticion: Request, error: RequestValidationError) -> JSONResponse:
    errores = []
    for detalle in error.errors():
        # `loc` es ("body", "titulo"): el primer elemento es de dónde vino.
        ubicacion = [str(x) for x in detalle["loc"] if x != "body"]
        errores.append({
            "campo": ".".join(ubicacion) or "cuerpo",
            "codigo": CODIGOS.get(detalle["type"], "INVALIDO"),
            "detalle": detalle["msg"],
        })

    return JSONResponse(
        {"type": "about:blank", "title": "la entrada no es válida",
         "status": 422, "code": "VALIDACION", "errors": errores},
        status_code=422,
        media_type=TIPO,
    )
