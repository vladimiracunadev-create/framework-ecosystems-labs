from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()


# La capa recibe la petición y una función que llama al resto de la cadena.
# `await siguiente(peticion)` es el `next()` de Express con otro nombre.
@app.middleware("http")
async def capa(peticion: Request, siguiente):
    respuesta = await siguiente(peticion)
    respuesta.headers["x-capa"] = "intermedia"
    return respuesta


@app.get("/a")
def a() -> JSONResponse:
    return JSONResponse({"ruta": "a"})


@app.get("/b")
def b() -> JSONResponse:
    return JSONResponse({"ruta": "b"})


@app.exception_handler(404)
async def no_encontrado(peticion: Request, error) -> JSONResponse:
    return JSONResponse({"error": "no existe"}, status_code=404)
