import functools
from collections.abc import Callable

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

auditoria: list[str] = []


# (1) EXTERNA — en FastAPI se llama middleware. Ve método y ruta; no sabe qué
# función se ejecutará.
@app.middleware("http")
async def capa(peticion: Request, siguiente):
    if peticion.url.path != "/auditoria":
        auditoria.append(f"externa:{peticion.method} {peticion.url.path}")
    return await siguiente(peticion)


# (2) INTERNA — en Python es un DECORADOR: envuelve UNA función concreta y sabe
# su nombre y sus argumentos. Python no necesita un mecanismo de aspectos aparte,
# porque el decorador ya es la forma nativa de envolver comportamiento.
def auditar(funcion: Callable) -> Callable:
    @functools.wraps(funcion)
    def envoltura(*args, **kwargs):
        auditoria.append(f"interna:{funcion.__name__}")
        resultado = funcion(*args, **kwargs)
        auditoria.append("interna:fin")
        return resultado

    return envoltura


@app.get("/accion")
@auditar
def accion() -> JSONResponse:
    auditoria.append("manejador")
    return JSONResponse({"ok": True})


@app.get("/auditoria")
def ver() -> JSONResponse:
    return JSONResponse({"auditoria": auditoria})
