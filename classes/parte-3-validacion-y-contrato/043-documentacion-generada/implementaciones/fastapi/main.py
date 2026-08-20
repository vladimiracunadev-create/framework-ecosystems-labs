from fastapi import FastAPI, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

app = FastAPI(title="Tareas", version="1.0.0")

TAREAS: dict[str, dict[str, str]] = {"1": {"id": "1", "titulo": "existente"}}


class Tarea(BaseModel):
    titulo: str = Field(min_length=1, max_length=120)


class TareaCreada(BaseModel):
    id: str
    titulo: str


class Problema(BaseModel):
    code: str


# Los codigos de respuesta se DECLARAN. Sin `responses`, el documento anuncia
# solo el 200 —o el que ponga `status_code`— y el 404 queda sin documentar
# aunque el codigo lo devuelva.
@app.get(
    "/tareas/{id}",
    response_model=TareaCreada,
    responses={404: {"model": Problema, "description": "No existe"}},
)
def obtener(id: str) -> JSONResponse:
    if id not in TAREAS:
        raise HTTPException(status_code=404, detail="no existe")
    return JSONResponse(TAREAS[id])


@app.post(
    "/tareas",
    status_code=status.HTTP_201_CREATED,
    response_model=TareaCreada,
    responses={422: {"model": Problema, "description": "Entrada invalida"}},
)
def crear(tarea: Tarea) -> JSONResponse:
    identificador = str(len(TAREAS) + 1)
    TAREAS[identificador] = {"id": identificador, "titulo": tarea.titulo}
    return JSONResponse(TAREAS[identificador], status_code=201)
