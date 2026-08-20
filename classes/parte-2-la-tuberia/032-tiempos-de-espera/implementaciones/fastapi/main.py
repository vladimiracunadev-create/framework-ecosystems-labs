import asyncio

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

LIMITE = 0.3
TIPO = "application/problem+json"


@app.middleware("http")
async def tiempo_de_espera(peticion: Request, siguiente):
    try:
        # `wait_for` CANCELA la corrutina al agotarse el plazo: el trabajo deja
        # de consumir recursos, no solo deja de esperarse. Es la diferencia con
        # un temporizador que solo responde antes.
        return await asyncio.wait_for(siguiente(peticion), timeout=LIMITE)
    except (asyncio.TimeoutError, TimeoutError):
        return JSONResponse(
            {"type": "about:blank", "title": "el servidor tardó demasiado",
             "status": 504, "code": "TIEMPO_AGOTADO"},
            status_code=504,
            media_type=TIPO,
        )


@app.get("/rapido")
def rapido() -> JSONResponse:
    return JSONResponse({"ok": True})


@app.get("/lento")
async def lento() -> JSONResponse:
    await asyncio.sleep(LIMITE * 4)
    return JSONResponse({"ok": True, "tarde": True})
