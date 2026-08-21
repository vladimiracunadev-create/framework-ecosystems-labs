"""FastAPI no trae sesiones de servidor: aquí se compone la pieza que falta.

Lo que el ecosistema ofrece —el SessionMiddleware de Starlette— guarda los
datos DENTRO de la cookie, firmados. Eso no puede pasar el último caso del
contrato: una cookie que lleva los datos consigo sigue valiendo después de
cerrar sesión, porque no hay nada en el servidor que borrar. Para poder
invalidar de verdad, el estado tiene que vivir en el servidor y a la cookie
solo puede viajar un identificador opaco.
"""

import secrets
from typing import Annotated

from fastapi import Cookie, FastAPI, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

USUARIOS = {"ana": "secreta123"}

# Identificador de sesión → usuario. En producción esto vive en un almacén
# compartido con caducidad (Redis es lo habitual): en memoria, cada instancia
# tendría sus propias sesiones y un reinicio las cerraría todas.
sesiones: dict[str, str] = {}


class Credenciales(BaseModel):
    usuario: str = ""
    clave: str = ""


@app.post("/entrar")
def entrar(credenciales: Credenciales) -> JSONResponse:
    if USUARIOS.get(credenciales.usuario) != credenciales.clave:
        return JSONResponse({"error": "credenciales-invalidas"}, status_code=401)

    # Se ignora cualquier cookie que traiga la petición y se emite un
    # identificador NUEVO en cada inicio de sesión: es la defensa contra la
    # fijación. `token_urlsafe` sale del generador criptográfico del sistema;
    # un contador o un `random` corriente serían adivinables.
    identificador = secrets.token_urlsafe(32)
    sesiones[identificador] = credenciales.usuario

    respuesta = JSONResponse({"usuario": credenciales.usuario})
    respuesta.set_cookie(
        key="sesion",
        value=identificador,
        httponly=True,   # el script de la página no puede leerla
        samesite="lax",  # no viaja en peticiones que otra página provoca
        path="/",
    )
    return respuesta


@app.get("/perfil")
def perfil(sesion: Annotated[str | None, Cookie()] = None) -> JSONResponse:
    usuario = sesiones.get(sesion) if sesion else None
    if usuario is None:
        return JSONResponse({"error": "no-autenticado"}, status_code=401)
    return JSONResponse({"usuario": usuario})


@app.post("/salir")
def salir(sesion: Annotated[str | None, Cookie()] = None) -> Response:
    # Primero muere la sesión en el servidor, después se le pide al navegador
    # que tire la cookie. El orden de importancia es ese: sin el `pop`, una
    # copia robada de la cookie seguiría abriendo la puerta.
    if sesion:
        sesiones.pop(sesion, None)
    respuesta = Response(status_code=204)
    respuesta.delete_cookie(key="sesion", path="/")
    return respuesta
