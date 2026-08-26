"""EL ESTADO DE CONEXIÓN ES LOCAL, Y ESO SE ROMPE CON LA SEGUNDA INSTANCIA.

Las clases 107 y 108 guardaron la lista de conexiones abiertas en un conjunto del
proceso. Con un servidor funciona perfectamente. Con dos —que es lo que hay en
cuanto se pone un balanceador delante o se despliega sin cortar— la mitad de la
gente deja de enterarse de la mitad de las cosas.

Y falla de la peor manera posible: **no da ningún error**.

── CÓMO SE MONTAN AQUÍ LAS DOS INSTANCIAS, Y QUÉ TIENE DE ARTIFICIAL ──────────

Este archivo levanta DOS aplicaciones, en dos puertos, con **dos conjuntos de
conexiones separados**. Comparten proceso, y en producción serían dos procesos o
dos máquinas: eso es lo único que aquí está simplificado, y no afecta a lo que la
clase mide, porque lo que separa a las dos instancias —su estado en memoria—
está separado de verdad.

Todo lo demás es real, incluido el reparto: cuando la instancia A avisa a la B,
lo hace por HTTP.
"""

import asyncio
import json
import os

import httpx
import uvicorn
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse

PUERTO_A = int(os.environ.get("PORT", "3000"))
PUERTO_B = PUERTO_A + 1


def montar(nombre: str, puerto: int, pares: list[str]) -> tuple[FastAPI, set]:
    """Monta una instancia: su aplicación, su canal y SU PROPIO conjunto."""
    app = FastAPI()
    sala: set[WebSocket] = set()

    async def entregar_aqui(texto: str) -> None:
        for conexion in list(sala):
            try:
                await conexion.send_text(
                    json.dumps({"texto": texto, "entregado_por": nombre})
                )
            except Exception:
                sala.discard(conexion)

    @app.websocket("/ws")
    async def canal(conexion: WebSocket) -> None:
        await conexion.accept()
        sala.add(conexion)
        try:
            while True:
                await conexion.receive_text()
        except WebSocketDisconnect:
            pass
        finally:
            sala.discard(conexion)

    # La ruta que usa el reparto entre instancias. Es una ruta normal, y por eso
    # se ve lo que el reparto es de verdad: **una petición más**.
    @app.post("/interno")
    async def interno(peticion: Request) -> dict:
        cuerpo = await peticion.json()
        await entregar_aqui(cuerpo["texto"])
        return {"entregado_por": nombre}

    @app.post("/publicar")
    async def publicar(peticion: Request) -> dict:
        cuerpo = await peticion.json()
        await entregar_aqui(cuerpo["texto"])
        # EL REPARTO. Con `bus`, se avisa a las demás instancias; sin él, no.
        #
        # Este reparto por HTTP a cada par es la versión más simple que funciona,
        # y tiene dos límites que hay que saber: crece al cuadrado con el número
        # de instancias, y si un par está caído su gente se pierde el mensaje sin
        # que nadie se entere. Un intermediario de mensajes —Redis, NATS,
        # RabbitMQ— resuelve las dos cosas.
        if cuerpo.get("bus"):
            async with httpx.AsyncClient() as cliente:
                for par in pares:
                    await cliente.post(f"{par}/interno", json={"texto": cuerpo["texto"]})
        return {"publicado_en": nombre, "con_bus": bool(cuerpo.get("bus"))}

    @app.get("/", response_class=HTMLResponse)
    def portada() -> str:
        return (
            '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">'
            "<title>Dos instancias</title></head><body><h1>Dos instancias</h1>"
            f'<p data-instancia="{nombre}" data-canal="ws://127.0.0.1:{puerto}/ws">esta instancia</p>'
            f'<p data-pares="{",".join(pares)}">las demas</p></body></html>'
        )

    return app, sala


app, _sala_a = montar("A", PUERTO_A, [f"http://127.0.0.1:{PUERTO_B}"])
app_b, _sala_b = montar("B", PUERTO_B, [f"http://127.0.0.1:{PUERTO_A}"])


@app.on_event("startup")
async def levantar_la_segunda() -> None:
    """La segunda instancia se levanta como una tarea del mismo bucle.

    Es uvicorn de verdad, con su propio socket en su propio puerto: lo único que
    comparte con la primera es el proceso.
    """
    configuracion = uvicorn.Config(app_b, host="127.0.0.1", port=PUERTO_B, log_level="warning")
    asyncio.create_task(uvicorn.Server(configuracion).serve())
    await asyncio.sleep(0.5)


@app.get("/instancias.json")
async def instancias() -> dict:
    """LA DEMOSTRACIÓN: EL MISMO MENSAJE, DOS VECES.

    Alguien conectado a la instancia B. El mensaje se publica siempre en la A.
    Sin reparto no llega; con reparto, sí. Es el mismo código, la misma conexión
    y el mismo mensaje: lo único que cambia es si las instancias se hablan.
    """
    import websockets

    recibidos: list[dict] = []

    async with websockets.connect(f"ws://127.0.0.1:{PUERTO_B}/ws") as en_b:

        async def escuchar() -> None:
            try:
                while True:
                    recibidos.append(json.loads(await en_b.recv()))
            except Exception:
                pass

        tarea = asyncio.create_task(escuchar())

        async with httpx.AsyncClient() as cliente:
            await cliente.post(
                f"http://127.0.0.1:{PUERTO_A}/publicar",
                json={"texto": "hola sin bus", "bus": False},
            )
            await asyncio.sleep(0.15)
            sin_bus = len(recibidos)

            await cliente.post(
                f"http://127.0.0.1:{PUERTO_A}/publicar",
                json={"texto": "hola a todos", "bus": True},
            )
            await asyncio.sleep(0.15)
            con_bus = len(recibidos)

        tarea.cancel()

    ultimo = recibidos[-1] if recibidos else {}
    return {
        "framework": "fastapi",
        "instancias": 2,
        "el_estado_de_conexion_es_local": True,
        "sin_bus_recibio_el_otro": sin_bus > 0,
        "con_bus_recibio_el_otro": con_bus > sin_bus,
        "mismo_mensaje": ultimo.get("texto", ""),
        "entregado_por": ultimo.get("entregado_por", ""),
        "como_se_difunde": "una peticion HTTP de la instancia que publica a cada una de las demas",
        "donde_esta_la_lista": (
            "en un conjunto de cada proceso: una variable, no un almacen compartido"
        ),
        "que_haria_falta_en_produccion": (
            "un intermediario de mensajes: el reparto directo crece al cuadrado y "
            "pierde lo de un par caido"
        ),
    }
