"""Contraseñas con Argon2id, el ganador del Password Hashing Competition.

`PasswordHasher` genera la sal, elige los parámetros de memoria y tiempo, y
los escribe DENTRO del resumen — verificar no necesita configuración, la lee
del propio resumen. Subir los parámetros mañana no rompe los resúmenes de
ayer: `check_needs_rehash` dice cuáles re-resumir al siguiente inicio de
sesión.
"""

from argon2 import PasswordHasher
from argon2.exceptions import VerificationError
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

ph = PasswordHasher()

# Usuario → resumen. La contraseña en claro no se guarda nunca.
usuarios: dict[str, str] = {}

# Resumen señuelo: verificar contra él cuesta lo mismo que una verificación
# real, y el tiempo de respuesta no delata qué usuarios existen.
SENUELO = PasswordHasher().hash("senuelo-que-nunca-coincide")


class Credenciales(BaseModel):
    usuario: str = ""
    clave: str = ""


@app.post("/usuarios")
def registrar(credenciales: Credenciales) -> JSONResponse:
    if not credenciales.usuario or not credenciales.clave:
        return JSONResponse({"error": "faltan-campos"}, status_code=422)
    if credenciales.usuario in usuarios:
        return JSONResponse({"error": "ya-existe"}, status_code=409)
    resumen = ph.hash(credenciales.clave)
    usuarios[credenciales.usuario] = resumen
    # La ventana de inspección del laboratorio: el contrato mide que la misma
    # clave produce resúmenes distintos. En producción, el resumen no sale.
    return JSONResponse({"usuario": credenciales.usuario, "resumen": resumen}, status_code=201)


@app.post("/entrar")
def entrar(credenciales: Credenciales) -> JSONResponse:
    resumen = usuarios.get(credenciales.usuario, SENUELO)
    try:
        ph.verify(resumen, credenciales.clave)
        coincide = True
    except VerificationError:
        coincide = False
    if not coincide or credenciales.usuario not in usuarios:
        # «No existe» y «clave mala» responden igual: distinguirlos regalaría
        # la lista de usuarios.
        return JSONResponse({"error": "credenciales-invalidas"}, status_code=401)
    return JSONResponse({"usuario": credenciales.usuario})
