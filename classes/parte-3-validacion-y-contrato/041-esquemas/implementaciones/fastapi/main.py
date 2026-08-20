from typing import Literal

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field

app = FastAPI()

CODIGOS = {
    "missing": "REQUERIDO",
    "string_type": "TIPO",
    "int_type": "TIPO",
    "string_too_short": "REQUERIDO",
    "string_too_long": "LONGITUD",
    "literal_error": "VALOR",
    "extra_forbidden": "DESCONOCIDO",
}


class Tarea(BaseModel):
    # `extra="forbid"` es el `additionalProperties: false` de JSON Schema:
    # rechaza campos que no estan declarados. Sin el, un cliente que escribe
    # "titluo" recibe un 422 por titulo ausente y nunca sabe que se equivoco al
    # teclear — o peor, el campo se ignora en silencio.
    model_config = ConfigDict(extra="forbid")

    titulo: str = Field(min_length=1, max_length=120)
    prioridad: Literal[1, 2, 3] | None = None


@app.post("/tareas", status_code=status.HTTP_201_CREATED)
def crear(tarea: Tarea) -> dict[str, str]:
    return {"titulo": tarea.titulo}


@app.get("/esquemas/tarea")
def esquema() -> dict[str, object]:
    # El esquema se DERIVA del modelo: no hay una segunda copia que mantener.
    return Tarea.model_json_schema()


@app.exception_handler(RequestValidationError)
async def invalido(peticion: Request, error: RequestValidationError) -> JSONResponse:
    errores = []
    for detalle in error.errors():
        ubicacion = [str(x) for x in detalle["loc"] if x != "body"]
        errores.append({
            "campo": ".".join(ubicacion) or "cuerpo",
            "codigo": CODIGOS.get(detalle["type"], "INVALIDO"),
        })
    return JSONResponse(
        {"type": "about:blank", "title": "la entrada no es valida", "status": 422,
         "code": "VALIDACION", "errors": errores},
        status_code=422,
        media_type="application/problem+json",
    )
