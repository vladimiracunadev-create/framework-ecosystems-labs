from typing import Annotated

from fastapi import APIRouter, FastAPI, Header
from fastapi.responses import JSONResponse

app = FastAPI()

PERSONA = {"id": "1", "nombre": "Ada", "apellido": "Lovelace"}


def como_v1() -> dict[str, str]:
    return {"id": PERSONA["id"], "nombre": f"{PERSONA['nombre']} {PERSONA['apellido']}"}


# (1) VERSION EN LA RUTA. Un enrutador por version mantiene el codigo separado:
# la v1 puede congelarse mientras la v2 evoluciona.
v1 = APIRouter(prefix="/v1")
v2 = APIRouter(prefix="/v2")


@v1.get("/personas/1")
def persona_v1() -> JSONResponse:
    return JSONResponse(como_v1())


@v2.get("/personas/1")
def persona_v2() -> JSONResponse:
    return JSONResponse(PERSONA)


app.include_router(v1)
app.include_router(v2)


# (2) VERSION EN LA CABECERA.
@app.get("/personas/1")
def persona(
    x_api_version: Annotated[str, Header()] = "1",
) -> JSONResponse:
    if x_api_version == "2":
        return JSONResponse(PERSONA, headers={"x-api-version": "2"})
    if x_api_version == "1":
        return JSONResponse(como_v1(), headers={"x-api-version": "1"})
    return JSONResponse({"code": "VERSION_DESCONOCIDA"}, status_code=400)
