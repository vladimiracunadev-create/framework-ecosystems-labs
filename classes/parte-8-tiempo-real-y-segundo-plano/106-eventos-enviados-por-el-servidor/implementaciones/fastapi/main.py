"""EVENTOS ENVIADOS POR EL SERVIDOR CON FASTAPI.

FastAPI trae `StreamingResponse`, que recibe un generador y va escribiendo lo
que este produzca. Es la forma más directa de las cuatro y la que mejor enseña
qué es un flujo: **una función que devuelve trozos en lugar de un valor**.

El detalle que hay que mirar es `media_type`: sin `text/event-stream`, esto sería
una descarga larga y no un flujo de eventos. El formato del texto es el mismo;
lo que cambia es que el navegador lo interprete.
"""

import json

import httpx
from fastapi import FastAPI, Header
from fastapi.responses import StreamingResponse

app = FastAPI()

# Los eventos que hay que entregar. En un sistema real vendrían de una cola o de
# un canal de la base de datos; lo que importa aquí es que cada uno tiene un
# número de orden, y que ese número es lo que permite reanudar.
PEDIDOS = [
    {"id": 1, "cliente": "Ada", "importe": 32},
    {"id": 2, "cliente": "Grace", "importe": 18},
    {"id": 3, "cliente": "Alan", "importe": 47},
]


def como_evento(pedido: dict) -> str:
    """El formato, que son cuatro reglas y ninguna más.

    Cada evento es un bloque de líneas `campo: valor` terminado en **una línea
    en blanco**. Olvidar esa línea es el error número uno: el navegador se queda
    esperando y no entrega nada.
    """
    return (
        f"id: {pedido['id']}\n"
        f"event: pedido\n"
        f"data: {json.dumps(pedido, separators=(',', ':'))}\n\n"
    )


@app.get("/eventos")
def eventos(last_event_id: str | None = Header(default=None)) -> StreamingResponse:
    # LA REANUDACIÓN, QUE ES LA MITAD DE LA CLASE. El navegador manda esta
    # cabecera solo, sin que nadie lo programe, con el identificador del último
    # evento que recibió. Lo único que hay que hacer es hacerle caso.
    ultimo = int(last_event_id or 0)

    def generar():
        # Cuánto debe esperar el navegador antes de reconectar si esto se corta.
        yield "retry: 2000\n\n"
        for pedido in PEDIDOS:
            if pedido["id"] > ultimo:
                yield como_evento(pedido)
        # El generador termina, y con él la respuesta. Un flujo real no
        # terminaría: se quedaría abierto emitiendo un comentario —`: latido`—
        # cada treinta segundos para que ningún intermediario lo dé por muerto.

    return StreamingResponse(
        generar(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            # Sin esta, un nginx delante guarda la respuesta en un buffer y no
            # entrega nada hasta que se llena. Es el fallo clásico de esta
            # tecnología y solo aparece en producción.
            "X-Accel-Buffering": "no",
        },
    )


@app.get("/sse.json")
async def sse(host: str = Header(default="127.0.0.1")) -> dict:
    origen = f"http://{host}"
    async with httpx.AsyncClient() as cliente:
        flujo = await cliente.get(f"{origen}/eventos")
    texto = flujo.text
    return {
        "framework": "fastapi",
        "tipo_de_contenido": flujo.headers.get("content-type"),
        "eventos_recibidos": texto.count("event: "),
        "bytes_del_flujo": len(texto.encode("utf-8")),
        "es_unidireccional": True,
        "reconecta_solo_el_navegador": True,
        "cabecera_de_reanudacion": "Last-Event-ID",
        "como_se_declara": (
            "con StreamingResponse y un generador: el flujo es una funcion que "
            "devuelve trozos en lugar de un valor"
        ),
        "que_cuesta": (
            "una conexion abierta por cliente, y un trabajador de uvicorn ocupado "
            "mientras dure"
        ),
        "el_fallo_clasico": (
            "un proxy inverso que guarda la respuesta en un buffer y no entrega nada"
        ),
    }
