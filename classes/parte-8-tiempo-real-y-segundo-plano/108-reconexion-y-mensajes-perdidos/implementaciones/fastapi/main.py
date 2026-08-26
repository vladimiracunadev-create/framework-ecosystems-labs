"""RECONEXIÓN Y MENSAJES PERDIDOS CON FASTAPI.

Los dos problemas de esta clase —volver a conectar, y no perderse nada— se
resuelven igual en los cuatro frameworks, porque ninguno de los cuatro los
resuelve: es código que hay que escribir. Lo que cambia es cuánto ayuda cada uno,
y aquí la respuesta es «nada»: Starlette da el canal y se acabó.

La ventaja de escribirlo a mano es que se ve. El historial, el número de cada
mensaje y el «por dónde iba» están en veinte líneas, y entenderlas es entender
por qué la clase 106 salía gratis: `Last-Event-ID` es exactamente esto, ya hecho.
"""

import asyncio
import json

import websockets
from fastapi import FastAPI, Header, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse

app = FastAPI()

# EL HISTORIAL, QUE ES LO QUE HACE POSIBLE NO PERDER NADA.
#
# Sin él, reconectar sirve para volver a estar en línea y no para recuperar lo
# que pasó mientras tanto. Aquí es una lista en memoria; en un sistema real es
# una tabla o un registro de eventos, y su tamaño es una decisión —cuánto hacia
# atrás se puede reanudar— que hay que tomar a propósito.
HISTORIAL: list[dict] = []
SALA: set[WebSocket] = set()
ESTADO = {"siguiente": 1}


async def emitir(texto: str) -> dict:
    mensaje = {"id": ESTADO["siguiente"], "texto": texto}
    ESTADO["siguiente"] += 1
    HISTORIAL.append(mensaje)
    for conexion in list(SALA):
        try:
            await conexion.send_text(json.dumps(mensaje))
        except Exception:
            SALA.discard(conexion)
    return mensaje


@app.websocket("/ws")
async def canal(conexion: WebSocket) -> None:
    await conexion.accept()
    # LA REANUDACIÓN. El cliente dice por cuál iba y el servidor le manda lo que
    # se perdió, en orden, antes de nada más.
    desde = int(conexion.query_params.get("desde", 0))
    for mensaje in [m for m in HISTORIAL if m["id"] > desde]:
        await conexion.send_text(json.dumps(mensaje))
    SALA.add(conexion)
    try:
        while True:
            await conexion.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        SALA.discard(conexion)


@app.get("/", response_class=HTMLResponse)
def portada(peticion: Request) -> str:
    anfitrion = peticion.headers.get("host", "127.0.0.1")
    return (
        '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">'
        "<title>Reconexion</title></head><body><h1>Canal con historial</h1>"
        f'<p data-canal="ws://{anfitrion}/ws?desde=0">el canal, con el punto por donde se reanuda</p>'
        "</body></html>"
    )


# LA ESPERA CRECIENTE, ESCRITA PARA QUE SE VEA.
#
# Cada intento espera el doble que el anterior. Si todo el mundo reintenta cada
# segundo, el servidor que se acaba de caer se vuelve a caer al levantarse.
#
# Falta una cosa que un cliente serio sí hace y aquí no: **ruido**. Si mil
# clientes se cayeron a la vez, con esta tabla los mil reintentan a la vez, y a
# los 100 milisegundos exactos. Sumar un azar de hasta el propio intervalo es lo
# que evita esa avalancha, y se llama fluctuación.
ESPERAS_MS = [100, 200, 400]


async def recoger(conexion, cuantos: int, segundos: float = 1.5) -> list[str]:
    recogidos: list[str] = []
    try:
        for _ in range(cuantos):
            crudo = await asyncio.wait_for(conexion.recv(), timeout=segundos)
            recogidos.append(str(json.loads(crudo)["id"]))
    except asyncio.TimeoutError:
        pass
    return recogidos


@app.get("/reconexion.json")
async def reconexion(host: str = Header(default="127.0.0.1")) -> dict:
    HISTORIAL.clear()
    ESTADO["siguiente"] = 1

    # 1. Alguien conectado, tres mensajes, todos recibidos.
    primero = await websockets.connect(f"ws://{host}/ws?desde=0")
    await emitir("mensaje 1")
    await emitir("mensaje 2")
    await emitir("mensaje 3")
    recibidos_antes = await recoger(primero, 3)

    # 2. EL CORTE. Se cierra la conexión y el mundo sigue.
    await primero.close()
    await asyncio.sleep(0.05)
    await emitir("mensaje 4")
    await emitir("mensaje 5")

    # 3. LA ESPERA CRECIENTE, contra una dirección donde no escucha nadie, para
    #    que los fallos y los tiempos sean reales.
    esperas_reales = []
    for espera in ESPERAS_MS:
        inicio = asyncio.get_event_loop().time()
        await asyncio.sleep(espera / 1000)
        esperas_reales.append(round((asyncio.get_event_loop().time() - inicio) * 1000))
        # El intento en sí, contra una dirección donde no escucha nadie. Su
        # duración NO se suma a la espera medida: lo que se publica es cuánto se
        # esperó antes de reintentar, que es lo que define la política.
        try:
            fallido = await asyncio.wait_for(
                websockets.connect("ws://127.0.0.1:1/ws"), timeout=0.3
            )
            await fallido.close()
        except Exception:
            pass

    # 4. LA REANUDACIÓN. El cliente dice por dónde iba: el 3.
    segundo = await websockets.connect(f"ws://{host}/ws?desde=3")
    recibidos_despues = await recoger(segundo, 2)
    await segundo.close()

    todos = recibidos_antes + recibidos_despues
    return {
        "framework": "fastapi",
        "recibidos_antes_del_corte": recibidos_antes,
        "emitidos_durante_el_corte": 2,
        "recibidos_al_reconectar": recibidos_despues,
        "ni_perdidos_ni_duplicados": ",".join(todos) == "1,2,3,4,5",
        "ninguno_repetido": len(set(todos)) == len(todos),
        "esperas_declaradas_ms": ESPERAS_MS,
        "esperas_reales_ms": esperas_reales,
        "la_espera_crece": all(
            ESPERAS_MS[i] > ESPERAS_MS[i - 1] for i in range(1, len(ESPERAS_MS))
        ),
        "intentos_fallidos": len(ESPERAS_MS),
        "quien_reconecta": (
            "quien escribe el cliente: ni Starlette ni la biblioteca websockets reconectan solas"
        ),
        "como_se_reanuda": (
            "un parametro ?desde= en la URL del canal y un historial en el servidor"
        ),
        "lo_que_falta_para_produccion": (
            "fluctuacion: sumar un azar a cada espera para que mil clientes caidos "
            "no reintenten a la vez"
        ),
    }
