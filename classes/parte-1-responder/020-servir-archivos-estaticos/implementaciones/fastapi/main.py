from pathlib import Path

from fastapi import FastAPI, Request, Response
from fastapi.staticfiles import StaticFiles

app = FastAPI()

RAIZ = Path(__file__).parent / "publico"


@app.middleware("http")
async def cachear(peticion: Request, siguiente):
    """StaticFiles no emite `Cache-Control` por su cuenta: se añade aquí.

    Es un buen ejemplo de que servir estáticos «funciona» de inmediato y
    servirlos *bien* requiere una decisión explícita.
    """
    respuesta: Response = await siguiente(peticion)
    if peticion.url.path.startswith("/estatico"):
        respuesta.headers["cache-control"] = "public, max-age=3600"
    return respuesta


app.mount("/estatico", StaticFiles(directory=RAIZ), name="estatico")
