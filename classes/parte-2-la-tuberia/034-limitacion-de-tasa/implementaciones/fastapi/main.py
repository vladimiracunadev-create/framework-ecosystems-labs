import math
import time

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

CUPO = 3
VENTANA = 60.0
TIPO = "application/problem+json"

cubos: dict[str, dict[str, float]] = {}


def consumir(clave: str) -> tuple[bool, int, int]:
    ahora = time.time()
    cubo = cubos.setdefault(clave, {"restantes": CUPO, "reinicio": ahora + VENTANA})
    if ahora >= cubo["reinicio"]:
        cubo["restantes"] = CUPO
        cubo["reinicio"] = ahora + VENTANA
    permitido = cubo["restantes"] > 0
    if permitido:
        cubo["restantes"] -= 1
    return permitido, int(cubo["restantes"]), max(0, math.ceil(cubo["reinicio"] - ahora))


@app.middleware("http")
async def limitar(peticion: Request, siguiente):
    clave = peticion.client.host if peticion.client else "anonimo"
    permitido, restantes, segundos = consumir(clave)
    cabeceras = {
        "ratelimit-limit": str(CUPO),
        "ratelimit-remaining": str(restantes),
        "ratelimit-reset": str(segundos),
    }

    if not permitido:
        return JSONResponse(
            {"type": "about:blank", "title": "demasiadas peticiones",
             "status": 429, "code": "CUPO_AGOTADO"},
            status_code=429,
            media_type=TIPO,
            headers={**cabeceras, "retry-after": str(segundos)},
        )

    respuesta = await siguiente(peticion)
    for nombre, valor in cabeceras.items():
        respuesta.headers[nombre] = valor
    return respuesta


@app.get("/datos")
def datos() -> JSONResponse:
    return JSONResponse({"ok": True})
