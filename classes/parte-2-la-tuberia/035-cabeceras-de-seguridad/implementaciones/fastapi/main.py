from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

CABECERAS = {
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "strict-transport-security": "max-age=31536000; includeSubDomains",
    "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
    "referrer-policy": "no-referrer",
}


@app.middleware("http")
async def endurecer(peticion: Request, siguiente):
    respuesta = await siguiente(peticion)
    for nombre, valor in CABECERAS.items():
        # `setdefault` y no asignación directa: si un manejador puso una
        # política más estricta para su ruta, la capa no debe pisarla.
        respuesta.headers.setdefault(nombre, valor)
    return respuesta


@app.get("/datos")
def datos() -> JSONResponse:
    return JSONResponse({"ok": True})
