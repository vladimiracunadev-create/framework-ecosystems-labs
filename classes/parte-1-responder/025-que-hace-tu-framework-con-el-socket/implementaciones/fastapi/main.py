from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

# FastAPI no tiene servidor: define una aplicación ASGI que Uvicorn ejecuta.
# La frontera entre ambos es el protocolo ASGI, y es lo que permite cambiar de
# servidor sin tocar la aplicación.
app = FastAPI()


@app.get("/")
def raiz() -> JSONResponse:
    return JSONResponse({"capa": "fastapi"})


@app.exception_handler(404)
async def no_encontrado(peticion: Request, error) -> JSONResponse:
    return JSONResponse({"error": "no existe"}, status_code=404)
