"""SONDEO CON FASTAPI.

La misma mecánica que en Express, con una diferencia de forma que se nota al
escribirla: FastAPI no tiene un objeto respuesta al que ponerle cabeceras salvo
que se pida. Para devolver un 304 sin cuerpo hay que construir una `Response` a
mano, porque el camino cómodo del framework —devolver un diccionario— siempre
lleva cuerpo y siempre lleva 200.

Es un ejemplo pequeño y claro de lo que la clase 005 llamaba idiomático frente a
traducido: el camino que el framework hace fácil es devolver datos, y aquí lo que
hace falta es devolver *ausencia* de datos.
"""

import asyncio

import httpx
from fastapi import FastAPI, Header, Response

app = FastAPI()

# El estado que se sondea. La versión sube en cada cambio y es lo que hace de
# marca de validación.
estado = {"version": 1, "valor": "tres pedidos"}


def marca() -> str:
    """El identificador de la versión actual, entre comillas como pide HTTP."""
    return f'"v{estado["version"]}"'


@app.get("/estado")
def leer_estado(if_none_match: str | None = Header(default=None)) -> Response:
    actual = marca()

    # LA CONDICIÓN, QUE ES TODA LA CLASE. Si quien pregunta ya tiene esta
    # versión, se le dice que no hay nada nuevo: 304, sin cuerpo.
    if if_none_match == actual:
        return Response(status_code=304, headers={"ETag": actual})

    return Response(
        content=f'{{"version":{estado["version"]},"valor":"{estado["valor"]}"}}',
        media_type="application/json",
        # `no-cache` no significa «no guardes»: significa «guárdalo, pero
        # pregunta antes de usarlo».
        headers={"ETag": actual, "Cache-Control": "no-cache"},
    )


@app.post("/cambiar")
def cambiar() -> dict:
    estado["version"] += 1
    estado["valor"] = f"{estado['version'] + 2} pedidos"
    return estado


@app.get("/sondeo.json")
async def sondeo(host: str = Header(default="127.0.0.1")) -> dict:
    """Una sesión de sondeo, medida por el propio servidor.

    Seis preguntas: cinco sin novedad y una con ella. Es la proporción real de
    cualquier sondeo —casi todas las preguntas sobran— y es la razón de que el
    condicional importe tanto.
    """
    origen = f"http://{host}"
    intervalo = 50

    async with httpx.AsyncClient() as cliente:
        primera = await cliente.get(f"{origen}/estado")
        etiqueta = primera.headers.get("etag")

        sin_cambios = 0
        bytes_sin_cambios = 0
        for _ in range(5):
            await asyncio.sleep(intervalo / 1000)
            r = await cliente.get(f"{origen}/estado", headers={"if-none-match": etiqueta})
            if r.status_code == 304:
                sin_cambios += 1
                bytes_sin_cambios += len(r.content)

        await cliente.post(f"{origen}/cambiar")
        con_novedad = await cliente.get(
            f"{origen}/estado", headers={"if-none-match": etiqueta}
        )

    return {
        "framework": "fastapi",
        "intervalo_ms": intervalo,
        "sondeos": 6,
        "sin_cambios": sin_cambios,
        "con_cambios": 1 if con_novedad.status_code == 200 else 0,
        "peticiones_desperdiciadas": sin_cambios,
        "bytes_de_cuerpo_sin_cambios": bytes_sin_cambios,
        "bytes_de_cuerpo_con_cambios": len(con_novedad.content),
        "el_dato_llega_con_un_retraso_de_hasta_ms": intervalo,
        "como_se_declara_el_etag": (
            "construyendo una Response a mano: el camino comodo del framework "
            "siempre lleva cuerpo y siempre lleva 200"
        ),
        "que_no_arregla_el_condicional": (
            "la ida y vuelta ocurre igual: se ahorra el cuerpo, no la peticion ni la latencia"
        ),
        "cuando_conviene": (
            "cuando el retraso aceptable se mide en segundos y no en milisegundos, "
            "que es casi siempre"
        ),
    }
