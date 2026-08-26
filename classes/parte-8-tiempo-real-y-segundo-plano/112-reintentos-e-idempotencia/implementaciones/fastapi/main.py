"""REINTENTAR SIN CAUSAR DAÑO, CON FASTAPI.

El caso que hay que tener en la cabeza no es el proveedor caído: es **la
respuesta que se perdió**. El cobro se hizo, la respuesta no llegó, y quien pidió
no tiene forma de distinguir eso de que no se hiciera. Va a reintentar, y con
razón.

Ninguno de los cuatro frameworks de esta clase trae idempotencia. Y no es una
carencia: **la clave la tiene que poner quien pide**, porque solo él sabe si dos
peticiones son el mismo intento. Lo único que el servidor puede hacer es
recordar qué contestó a cada clave, y eso son diez líneas.
"""

import asyncio

import httpx
from fastapi import FastAPI, Header, Request
from fastapi.responses import JSONResponse

app = FastAPI()

# Los cobros hechos. Lo que hay que impedir es que esta lista crezca dos veces
# por el mismo intento.
COBROS: list[dict] = []

# LA MEMORIA DE CLAVES, QUE ES TODA LA IDEA.
#
# Guarda, por clave, **la respuesta que ya se dio**. No basta con recordar «esta
# clave ya pasó»: hay que devolver lo mismo, porque quien reintenta necesita el
# identificador del cobro tanto como el primero.
#
# Y tiene que caducar. Una clave guardada para siempre es una fuga de memoria con
# forma de tabla; una que caduca demasiado pronto deja pasar un reintento tardío.
CLAVES: dict[str, dict] = {}


@app.post("/cobros")
async def cobrar(
    peticion: Request, idempotency_key: str | None = Header(default=None)
) -> JSONResponse:
    cuerpo = await peticion.json()
    importe = int(cuerpo.get("importe", 30))

    # SIN CLAVE NO HAY NADA QUE HACER. El servidor no puede distinguir un
    # reintento de un cobro nuevo, y tiene que cobrar. Es correcto, y es el
    # motivo de que la clave la ponga quien pide.
    if idempotency_key and idempotency_key in CLAVES:
        anterior = CLAVES[idempotency_key]
        return JSONResponse(status_code=200, content={**anterior, "repetida": True})

    cobro = {"id": f"cobro-{len(COBROS) + 1}", "importe": importe, "estado": "cobrado"}
    COBROS.append(cobro)
    if idempotency_key:
        CLAVES[idempotency_key] = cobro
    return JSONResponse(status_code=201, content={**cobro, "repetida": False})


@app.get("/cobros")
def listar() -> dict:
    return {
        "cobros_totales": len(COBROS),
        "importe_total": sum(c["importe"] for c in COBROS),
        "cobros": COBROS,
    }


# La espera creciente entre reintentos. Sin ella, reintentar es una forma de
# tumbar lo que se acaba de caer.
ESPERAS_MS = [50, 100, 200]


def operacion_inestable():
    """Falla las dos primeras veces y funciona a la tercera.

    Es el caso normal de un proveedor con un mal rato, no de uno roto.
    """
    estado = {"intentos": 0}

    async def intentar() -> str:
        estado["intentos"] += 1
        if estado["intentos"] < 3:
            raise RuntimeError("el proveedor no contesta")
        return "hecho"

    return intentar


@app.get("/idempotencia.json")
async def idempotencia(host: str = Header(default="127.0.0.1")) -> dict:
    origen = f"http://{host}"
    COBROS.clear()
    CLAVES.clear()

    async with httpx.AsyncClient() as cliente:
        # CON CLAVE: tres peticiones, un cobro.
        for _ in range(3):
            await cliente.post(
                f"{origen}/cobros",
                json={"importe": 30},
                headers={"idempotency-key": "k-prueba"},
            )
        con_clave = (await cliente.get(f"{origen}/cobros")).json()["cobros_totales"]

        # SIN CLAVE: tres peticiones, tres cobros. Y esto no es un fallo del
        # servidor: es lo correcto, porque no puede saber que era el mismo
        # intento.
        COBROS.clear()
        CLAVES.clear()
        for _ in range(3):
            await cliente.post(f"{origen}/cobros", json={"importe": 30})
        sin_clave = (await cliente.get(f"{origen}/cobros")).json()["cobros_totales"]

    # LOS REINTENTOS, con espera creciente y un tope.
    intentar = operacion_inestable()
    intentos = 0
    resultado = None
    for espera in [0, *ESPERAS_MS]:
        if espera:
            await asyncio.sleep(espera / 1000)
        intentos += 1
        try:
            resultado = await intentar()
            break
        except RuntimeError:
            resultado = None

    return {
        "framework": "fastapi",
        "con_clave_peticiones": 3,
        "con_clave_cobros": con_clave,
        "sin_clave_peticiones": 3,
        "sin_clave_cobros": sin_clave,
        "la_clave_evita_el_duplicado": con_clave == 1 and sin_clave == 3,
        "reintentos": intentos,
        "exito_tras_reintentos": resultado == "hecho",
        "esperas_ms": ESPERAS_MS,
        "la_espera_crece": True,
        "donde_se_guarda_la_clave": (
            "un diccionario en memoria; en produccion, una tabla con indice unico"
        ),
        "que_hace_falta_para_que_valga": (
            "guardar la RESPUESTA y no solo la clave, y ponerle caducidad: sin lo "
            "primero el reintento se queda sin identificador, sin lo segundo la tabla "
            "crece para siempre"
        ),
        "que_no_se_debe_reintentar": "lo que devuelve 4xx: un 400 no mejora por repetirlo",
    }
