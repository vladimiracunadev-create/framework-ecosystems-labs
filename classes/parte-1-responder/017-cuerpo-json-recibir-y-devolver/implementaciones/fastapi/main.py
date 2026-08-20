from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

app = FastAPI()


class Cuerpo(BaseModel):
    titulo: str = Field(min_length=1)


@app.post("/tareas", status_code=status.HTTP_201_CREATED)
def crear(cuerpo: Cuerpo) -> dict[str, object]:
    return {"id": "1", "titulo": cuerpo.titulo, "completada": False}


# FastAPI responde 422 tanto al JSON mal formado como al que no cumple el modelo.
# El contrato distingue ambos casos, así que aquí se separan: si el cuerpo no se
# pudo interpretar, es 400; si se interpretó y no cumple, es 422.
@app.exception_handler(RequestValidationError)
async def validacion(peticion: Request, error: RequestValidationError) -> JSONResponse:
    for detalle in error.errors():
        if detalle.get("type") == "json_invalid":
            return JSONResponse({"error": "cuerpo JSON mal formado"}, status_code=400)
    return JSONResponse({"error": "titulo es obligatorio"}, status_code=422)
