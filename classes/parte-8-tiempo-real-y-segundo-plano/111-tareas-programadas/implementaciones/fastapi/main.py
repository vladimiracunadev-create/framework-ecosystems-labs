"""TAREAS PROGRAMADAS CON FASTAPI.

FastAPI **no tiene programador**, y conviene decirlo antes que nada: no hay
decorador de calendario ni nada parecido. Lo que hay en su ecosistema son piezas
aparte —APScheduler para el temporizador, Celery beat cuando ya hay una cola— y
la elección entre ellas es una decisión de arquitectura, no de estilo.

Aquí se usan tareas de `asyncio` a pelo, por el mismo motivo que en las otras
tres implementaciones: **lo que esta clase enseña no es cómo se programa, es el
cerrojo**. Programar es fácil en todas partes; que dos instancias no hagan lo
mismo dos veces, no.
"""

import asyncio
import time

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse

app = FastAPI()

# Cada cuánto se dispara. Cien milisegundos para que la clase dure poco; en un
# sistema real sería una expresión de calendario.
CADA_MS = 100

# Cuántas veces dispara cada prueba.
TICS = 5

# EL CERROJO, CON SU CADUCIDAD.
#
# `duenio` dice quién lo tiene y `hasta` cuándo lo suelta solo. La caducidad es
# la parte que convierte un cerrojo en algo operable: sin ella, una instancia que
# muera con el turno cogido deja la tarea parada para siempre, y nadie se entera
# hasta que alguien pregunta por el informe que no llegó.
cerrojo = {"duenio": None, "hasta": 0.0}


def intentar_coger_el_turno(quien: str, duracion_ms: int) -> bool:
    ahora = time.monotonic() * 1000
    if cerrojo["duenio"] is not None and cerrojo["hasta"] > ahora:
        return False
    cerrojo["duenio"] = quien
    cerrojo["hasta"] = ahora + duracion_ms
    return True


async def programador(quien: str, con_cerrojo: bool, ejecuciones: list[str]) -> None:
    """Dispara TICS veces y anota cuántas trabajó de verdad.

    `con_cerrojo` es lo único que cambia entre las dos pruebas, y es todo el
    contenido de la clase.
    """
    for _ in range(TICS):
        await asyncio.sleep(CADA_MS / 1000)
        if not con_cerrojo or intentar_coger_el_turno(quien, CADA_MS - 10):
            ejecuciones.append(quien)


@app.get("/", response_class=HTMLResponse)
def portada(peticion: Request) -> str:
    return (
        '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">'
        "<title>Programadas</title></head><body><h1>Tareas programadas</h1>"
        f'<p data-cada="{CADA_MS}" data-instancias="2">dos instancias con el mismo temporizador</p>'
        "</body></html>"
    )


@app.get("/programadas.json")
async def programadas() -> dict:
    # SIN CERROJO: las dos instancias trabajan en cada disparo.
    sin_cerrojo: list[str] = []
    await asyncio.gather(
        programador("A", False, sin_cerrojo),
        programador("B", False, sin_cerrojo),
    )

    # CON CERROJO: solo una por disparo.
    cerrojo["duenio"] = None
    cerrojo["hasta"] = 0.0
    con_cerrojo: list[str] = []
    await asyncio.gather(
        programador("A", True, con_cerrojo),
        programador("B", True, con_cerrojo),
    )

    return {
        "framework": "fastapi",
        "instancias": 2,
        "tics": TICS,
        "cada_ms": CADA_MS,
        "sin_cerrojo_ejecuciones": len(sin_cerrojo),
        "con_cerrojo_ejecuciones": len(con_cerrojo),
        "se_duplica_sin_cerrojo": len(sin_cerrojo) == TICS * 2,
        "no_se_duplica_con_cerrojo": len(con_cerrojo) == TICS,
        "el_cerrojo_caduca": True,
        "como_se_programa": (
            "no hay programador en el framework: tareas de asyncio aqui, y "
            "APScheduler o Celery beat en un proyecto de verdad"
        ),
        "donde_esta_el_cerrojo": (
            "un diccionario compartido; en produccion, una fila de una tabla o una clave de Redis"
        ),
        "que_haria_falta_en_produccion": (
            "que el cerrojo viva fuera del proceso y que su caducidad sea mayor que "
            "lo que tarde la tarea"
        ),
    }
