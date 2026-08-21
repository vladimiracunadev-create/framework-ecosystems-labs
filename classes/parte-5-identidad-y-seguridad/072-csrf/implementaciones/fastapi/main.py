"""CSRF con el testigo sincronizado, compuesto sobre la sesión de la 066.

El ataque: la víctima está autenticada aquí, visita la página del atacante,
y esa página envía un POST a este servidor. El navegador ADJUNTA LA COOKIE —
es su trabajo. El testigo corta el ataque porque vive donde el atacante no
puede leer: en la respuesta de un origen ajeno al suyo.
"""

import secrets
from typing import Annotated

from fastapi import Cookie, FastAPI, Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

USUARIOS = {"ana": "secreta123"}
cuentas = {"ana": 100}

# Identificador de sesión → {usuario, csrf}. Como en la 066: el estado en el
# servidor, la cookie solo identifica.
sesiones: dict[str, dict[str, str]] = {}


class Credenciales(BaseModel):
    usuario: str = ""
    clave: str = ""


class Transferencia(BaseModel):
    importe: int = 0


@app.post("/entrar")
def entrar(credenciales: Credenciales) -> JSONResponse:
    if USUARIOS.get(credenciales.usuario) != credenciales.clave:
        return JSONResponse({"error": "credenciales-invalidas"}, status_code=401)
    identificador = secrets.token_urlsafe(32)
    # El testigo vive EN LA SESIÓN y viaja en el cuerpo de la respuesta —
    # nunca en una cookie sola, que el navegador también adjuntaría solo.
    testigo = secrets.token_urlsafe(24)
    sesiones[identificador] = {"usuario": credenciales.usuario, "csrf": testigo}
    respuesta = JSONResponse({"usuario": credenciales.usuario, "csrf": testigo})
    respuesta.set_cookie("sesion", identificador, httponly=True, samesite="lax", path="/")
    return respuesta


@app.post("/transferir")
def transferir(
    datos: Transferencia,
    sesion: Annotated[str | None, Cookie()] = None,
    x_csrf_token: Annotated[str | None, Header()] = None,
) -> JSONResponse:
    actual = sesiones.get(sesion) if sesion else None
    if actual is None:
        return JSONResponse({"error": "no-autenticado"}, status_code=401)
    # El testigo del encabezado tiene que ser EL DE ESTA SESIÓN. La página
    # del atacante no puede leerlo (mismo origen) ni adivinarlo (aleatorio).
    # compare_digest: tiempo constante, clase 068.
    if not x_csrf_token or not secrets.compare_digest(actual["csrf"], x_csrf_token):
        return JSONResponse({"error": "testigo-invalido"}, status_code=403)
    cuentas[actual["usuario"]] -= datos.importe
    return JSONResponse({"saldo": cuentas[actual["usuario"]]})


@app.get("/saldo")
def saldo(sesion: Annotated[str | None, Cookie()] = None) -> JSONResponse:
    actual = sesiones.get(sesion) if sesion else None
    if actual is None:
        return JSONResponse({"error": "no-autenticado"}, status_code=401)
    # GET no muta y no lleva testigo: la defensa protege las escrituras.
    return JSONResponse({"saldo": cuentas[actual["usuario"]]})
