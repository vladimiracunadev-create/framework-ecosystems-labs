"""Token de acceso con PyJWT: firmar al entrar, verificar en cada petición.

El servidor no guarda nada entre las dos: toda la información viaja en el
token y la única prueba de autenticidad es la firma. Esa es la propuesta
completa — y también el precio, porque lo que no se guarda no se puede
revocar (el README vuelve sobre esto).
"""

import time
from typing import Annotated

import jwt
from fastapi import FastAPI, Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

# En producción, del entorno (clase 075). Con HS256 el mismo secreto emite y
# verifica: si otro servicio solo necesita verificar, el par asimétrico
# (RS256/EdDSA) evita repartir la capacidad de emitir.
SECRETO = "clave-de-firma-solo-para-el-laboratorio"
USUARIOS = {"ana": "secreta123"}


class Credenciales(BaseModel):
    usuario: str = ""
    clave: str = ""


@app.post("/token")
def emitir(credenciales: Credenciales) -> JSONResponse:
    if USUARIOS.get(credenciales.usuario) != credenciales.clave:
        return JSONResponse({"error": "credenciales-invalidas"}, status_code=401)
    token = jwt.encode(
        {"sub": credenciales.usuario, "exp": int(time.time()) + 3600},
        SECRETO,
        algorithm="HS256",
    )
    return JSONResponse({"token": token, "tipo": "Bearer", "expira_en": 3600})


@app.get("/informe")
def informe(authorization: Annotated[str | None, Header()] = None) -> JSONResponse:
    cabecera = authorization or ""
    token = cabecera.removeprefix("Bearer ") if cabecera.startswith("Bearer ") else ""
    try:
        # `algorithms` fija lo que se acepta: sin la lista, decidiría la
        # cabecera del token — que escribe el atacante. PyJWT además verifica
        # `exp` por omisión; caducado y alterado terminan en el mismo sitio.
        datos = jwt.decode(token, SECRETO, algorithms=["HS256"])
    except jwt.InvalidTokenError:
        return JSONResponse({"error": "token-invalido"}, status_code=401)
    return JSONResponse({"usuario": datos["sub"]})
