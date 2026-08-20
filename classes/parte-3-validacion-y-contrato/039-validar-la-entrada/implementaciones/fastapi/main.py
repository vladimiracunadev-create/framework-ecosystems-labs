from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator

app = FastAPI()


class Tarea(BaseModel):
    # Las reglas viven en el TIPO. No hay `if` que se pueda olvidar.
    titulo: str = Field(min_length=1, max_length=120)
    completada: bool = False

    @field_validator("titulo")
    @classmethod
    def sin_espacios_sobrantes(cls, valor: str) -> str:
        limpio = valor.strip()
        if not limpio:
            raise ValueError("titulo no puede estar vacío")
        return limpio


@app.post("/tareas", status_code=status.HTTP_201_CREATED)
def crear(tarea: Tarea) -> dict[str, object]:
    return {"titulo": tarea.titulo, "completada": tarea.completada}


@app.exception_handler(RequestValidationError)
async def invalido(peticion: Request, error: RequestValidationError) -> JSONResponse:
    primero = error.errors()[0]
    return JSONResponse({"error": primero.get("msg", "entrada inválida")}, status_code=422)
