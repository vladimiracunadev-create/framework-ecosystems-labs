from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

TIPO = "application/problem+json"


class ErrorDeNegocio(Exception):
    def __init__(self, mensaje: str, estado: int, codigo: str) -> None:
        self.mensaje = mensaje
        self.estado = estado
        self.codigo = codigo


@app.exception_handler(ErrorDeNegocio)
async def negocio(peticion: Request, error: ErrorDeNegocio) -> JSONResponse:
    return JSONResponse(
        {"type": "about:blank", "title": error.mensaje, "status": error.estado,
         "code": error.codigo},
        status_code=error.estado,
        media_type=TIPO,
    )


@app.exception_handler(Exception)
async def no_controlado(peticion: Request, error: Exception) -> JSONResponse:
    # El mensaje original se queda dentro. Filtrarlo es una fuga de informacion.
    print("error no controlado:", error)
    return JSONResponse(
        {"type": "about:blank", "title": "error interno", "status": 500,
         "code": "ERROR_INTERNO"},
        status_code=500,
        media_type=TIPO,
    )


@app.get("/roto")
def roto() -> None:
    raise RuntimeError("referencia interna: secreto=abc123")


@app.get("/negocio")
def negocio_ruta() -> None:
    raise ErrorDeNegocio("la tarea ya estaba completada", 409, "TAREA_YA_COMPLETADA")


@app.get("/ok")
def ok() -> JSONResponse:
    return JSONResponse({"ok": True})
