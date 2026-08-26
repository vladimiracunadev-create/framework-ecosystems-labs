"""WEBSOCKET CON FASTAPI.

FastAPI trae el WebSocket incorporado —viene de Starlette— y el decorador se
parece tanto al de una ruta normal que oculta lo que de verdad cambia: el
manejador **no devuelve nada**. Se queda dentro de un bucle mientras la conexión
viva, y ahí está el precio: mientras dure, hay una tarea ocupada.

Lo que no trae es la difusión. La lista de conexiones abiertas hay que llevarla a
mano —el conjunto `SALA` de abajo— y esa lista es exactamente lo que la clase 109
demuestra que se rompe en cuanto hay dos instancias del servidor.
"""

import asyncio
import base64
import hashlib

import websockets
from fastapi import FastAPI, Header, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse

app = FastAPI()

# LA LISTA DE CONEXIONES, A MANO. Es un conjunto en la memoria de ESTE proceso, y
# esa frase es el resumen del problema de la clase 109.
SALA: set[WebSocket] = set()


@app.websocket("/ws")
async def canal(conexion: WebSocket) -> None:
    await conexion.accept()
    SALA.add(conexion)
    try:
        while True:
            texto = await conexion.receive_text()
            # LA VUELTA: por la misma conexión que trajo el mensaje.
            await conexion.send_text(f"eco: {texto}")
            # Y LA DIFUSIÓN: a todos los demás, recorriendo la lista a mano.
            for otro in list(SALA):
                if otro is not conexion:
                    await otro.send_text(f"difusion: {texto}")
    except WebSocketDisconnect:
        pass
    finally:
        SALA.discard(conexion)


@app.get("/", response_class=HTMLResponse)
def portada(peticion: Request) -> str:
    anfitrion = peticion.headers.get("host", "127.0.0.1")
    return (
        '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">'
        "<title>WebSocket</title></head>"
        f'<body><h1>Canal</h1><p data-canal="ws://{anfitrion}/ws">el canal de esta pagina</p>'
        '<script>const s = new WebSocket("ws://" + location.host + "/ws");</script>'
        "</body></html>"
    )


# La cadena fija del RFC 6455. No es un secreto ni una protección: existe para
# que un servidor que no sepa de WebSocket no pueda contestar por accidente algo
# que parezca correcto.
GUID_DEL_RFC = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
CLAVE_DE_EJEMPLO = "dGhlIHNhbXBsZSBub25jZQ=="


def accept_esperado() -> str:
    """La cuenta del `Sec-WebSocket-Accept`, escrita para que se vea.

    SHA-1 de la clave concatenada con la cadena fija, en base64. Con la clave de
    ejemplo del RFC la respuesta es siempre la misma, y por eso el contrato la
    puede exigir literal.
    """
    resumen = hashlib.sha1((CLAVE_DE_EJEMPLO + GUID_DEL_RFC).encode("ascii")).digest()
    return base64.b64encode(resumen).decode("ascii")


async def apreton_de_manos(anfitrion: str, ruta: str) -> tuple[str, str]:
    """El apretón, hecho a mano contra el propio servidor.

    Es la única parte del protocolo que se puede comprobar con herramientas de
    HTTP: a partir del 101 lo que viaja ya no es HTTP y ninguna de ellas lo
    entiende.
    """
    maquina, _, puerto = anfitrion.partition(":")
    lector, escritor = await asyncio.open_connection(maquina, int(puerto or 80))
    escritor.write(
        (
            f"GET {ruta} HTTP/1.1\r\n"
            f"Host: {anfitrion}\r\n"
            "Upgrade: websocket\r\n"
            "Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {CLAVE_DE_EJEMPLO}\r\n"
            "Sec-WebSocket-Version: 13\r\n\r\n"
        ).encode("ascii")
    )
    await escritor.drain()
    cabeceras = await lector.readuntil(b"\r\n\r\n")
    escritor.close()
    lineas = cabeceras.decode("latin1").split("\r\n")
    estado = lineas[0].split(" ")[1]
    aceptado = ""
    for linea in lineas[1:]:
        nombre, _, valor = linea.partition(": ")
        if nombre.lower() == "sec-websocket-accept":
            aceptado = valor
    return estado, aceptado


@app.get("/ws.json")
async def ws_json(host: str = Header(default="127.0.0.1")) -> dict:
    estado, aceptado = await apreton_de_manos(host, "/ws")

    # Dos clientes de verdad: uno habla y el otro escucha. Es la prueba de que la
    # difusión existe, y no se puede hacer con una sola conexión.
    async with websockets.connect(f"ws://{host}/ws") as primero:
        async with websockets.connect(f"ws://{host}/ws") as segundo:
            await primero.send("hola")
            recibido = await asyncio.wait_for(primero.recv(), timeout=2)
            recibido_por_el_otro = await asyncio.wait_for(segundo.recv(), timeout=2)

    return {
        "framework": "fastapi",
        "ruta_del_canal": "/ws",
        "apreton_de_manos": estado,
        "accept_recibido": aceptado,
        "accept_es_correcto": aceptado == accept_esperado(),
        "enviado": "hola",
        "recibido": recibido,
        "segundo_cliente_recibio": recibido_por_el_otro,
        "mensajes_en_ambos_sentidos": True,
        "sobre_la_misma_conexion": True,
        "quien_guarda_las_conexiones": (
            "quien escribe la aplicacion: un conjunto en la memoria de ESTE proceso"
        ),
        "como_se_monta": (
            "un decorador que se parece al de una ruta normal y no devuelve nada: "
            "se queda en un bucle mientras la conexion viva"
        ),
        "lo_que_se_pierde_al_dejar_http": (
            "las cabeceras solo valen para el apreton, y ninguna herramienta de HTTP "
            "puede leer lo que pasa despues"
        ),
    }
