import time

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

registro: list[dict[str, object]] = []


@app.middleware("http")
async def registrar(peticion: Request, siguiente):
    inicio = time.perf_counter()
    respuesta = await siguiente(peticion)
    duracion = time.perf_counter() - inicio

    # No se registra la propia consulta del registro: mirar el registro no es
    # tráfico de la aplicación, y contarlo lo ensuciaría.
    if peticion.url.path != "/registro":
        registro.append({
            "metodo": peticion.method,
            "ruta": peticion.url.path,
            "estado": respuesta.status_code,
            "medido": duracion >= 0,
        })
    return respuesta


@app.get("/ok")
def ok() -> JSONResponse:
    return JSONResponse({"ok": True})


@app.get("/falla")
def falla() -> JSONResponse:
    return JSONResponse({"error": "roto"}, status_code=500)


@app.get("/registro")
def ver() -> JSONResponse:
    return JSONResponse({"registro": registro})
