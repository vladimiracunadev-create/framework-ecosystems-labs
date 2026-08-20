import uuid

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()


@app.middleware("http")
async def correlacionar(peticion: Request, siguiente):
    entrante = peticion.headers.get("x-request-id")
    # El límite de longitud no es adorno: el identificador entra en los registros
    # y lo controla el cliente. Sin tope, es una vía para inflarlos.
    correlacion = entrante if entrante and len(entrante) <= 128 else str(uuid.uuid4())
    peticion.state.correlacion = correlacion

    respuesta = await siguiente(peticion)
    respuesta.headers["x-request-id"] = correlacion
    return respuesta


@app.get("/eco")
def eco(peticion: Request) -> JSONResponse:
    return JSONResponse({
        "correlacion": peticion.state.correlacion,
        "generado": peticion.headers.get("x-request-id") is None,
    })
