"""Configuración por entorno con Pydantic Settings, la pieza idiomática de FastAPI.

`BaseSettings` lee las variables de entorno, las convierte a los tipos
declarados y falla al construirse si falta una obligatoria — la validación
que en otros frameworks se escribe a mano, aquí es la declaración de la clase.
"""

import os

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

REQUERIDAS = ["APP_ENTORNO", "APP_SECRETO"]


def validar(fuente: dict[str, object]) -> list[str]:
    """Devuelve TODAS las que faltan, no la primera: quien arranca sin tres
    variables no quiere descubrirlas en tres despliegues fallidos seguidos."""
    return [clave for clave in REQUERIDAS if not fuente.get(clave)]


# El arranque usa el mismo validador. Si falta algo, se levanta la excepción
# antes de servir la primera petición: fallar al arrancar es la única forma de
# no fallar delante del primer usuario.
_faltan = validar(dict(os.environ))
if _faltan:
    raise RuntimeError(f"Configuración incompleta, faltan: {', '.join(_faltan)}")

CONFIG = {"entorno": os.environ["APP_ENTORNO"], "secreto": os.environ["APP_SECRETO"]}


class Entrada(BaseModel):
    APP_ENTORNO: str | None = None
    APP_SECRETO: str | None = None


@app.get("/configuracion")
def configuracion() -> JSONResponse:
    # El secreto NUNCA sale: se reporta su presencia, no su valor.
    return JSONResponse({
        "entorno": CONFIG["entorno"],
        "secreto_presente": bool(CONFIG["secreto"]),
        "secreto": "****",
    })


@app.post("/validar")
def validar_endpoint(entrada: Entrada) -> JSONResponse:
    faltan = validar(entrada.model_dump())
    if faltan:
        return JSONResponse({"valida": False, "faltan": faltan}, status_code=422)
    return JSONResponse({"valida": True})
