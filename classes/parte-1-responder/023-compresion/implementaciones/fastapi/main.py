from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import PlainTextResponse

app = FastAPI()

# `minimum_size` es el mismo umbral que en Express: por debajo, comprimir sale
# más caro que enviar. El middleware añade `Vary: Accept-Encoding` por su cuenta.
app.add_middleware(GZipMiddleware, minimum_size=1024)

LARGO = "tarea pendiente. " * 400


@app.get("/grande", response_class=PlainTextResponse)
def grande() -> str:
    return LARGO


@app.get("/pequeno", response_class=PlainTextResponse)
def pequeno() -> str:
    return "corto"
