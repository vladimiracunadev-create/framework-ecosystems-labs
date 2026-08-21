"""El grupo de conexiones, visto desde dentro.

Una conexion a la base es un recurso caro: un socket, una sesion en el servidor,
memoria alli. Abrir una por peticion no escala, y por eso todo el mundo usa un
grupo — casi siempre sin saber que tamano tiene.
"""
import threading
import time

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, text
from sqlalchemy.exc import TimeoutError as TiempoAgotado
from sqlalchemy.pool import QueuePool

app = FastAPI()

# DOS conexiones, a proposito. Con el valor por omision —cinco, mas diez de
# desbordamiento— haria falta lanzar dieciseis peticiones a la vez para ver algo,
# y la clase trata justamente de que este numero es pequeno y finito.
#
# `max_overflow=0` quita el colchon: el grupo es dos, y no hay mas.
# `pool_timeout=1` es la diferencia entre fallar y quedarse colgado.
motor = create_engine(
    "sqlite:///datos.db",
    poolclass=QueuePool,
    pool_size=2,
    max_overflow=0,
    pool_timeout=1,
)

with motor.begin() as inicial:
    inicial.execute(text("DROP TABLE IF EXISTS tareas"))
    inicial.execute(text("CREATE TABLE tareas (id INTEGER PRIMARY KEY, titulo TEXT NOT NULL)"))
    inicial.execute(text("INSERT INTO tareas (id, titulo) VALUES (1, 'una')"))

# Las conexiones que se piden prestadas y no se devuelven. Se guardan aqui para
# que sigan fuera del grupo: una fuga es exactamente esto.
fugadas: list = []


@app.get("/grupo")
def grupo() -> JSONResponse:
    """`checkedout()` es el numero de conexiones PRESTADAS ahora mismo.

    Es el dato que conviene tener en un panel: si sube y no baja, hay una fuga;
    si roza el maximo de forma sostenida, el grupo esta mal dimensionado.
    """
    return JSONResponse({"tamano": motor.pool.size(), "en_uso": motor.pool.checkedout()})


@app.get("/consulta")
def consulta() -> JSONResponse:
    """Prestada, no regalada.

    El bloque `with` devuelve la conexion al grupo al salir. Ese `with` es toda
    la diferencia entre un servicio que aguanta y uno que se para a la hora.
    """
    with motor.connect() as conexion:
        conexion.execute(text("SELECT COUNT(*) FROM tareas")).scalar_one()
    return JSONResponse({"ok": True})


def _retener(segundos: float, esperas: list[float], barrera: threading.Barrier) -> None:
    barrera.wait()
    inicio = time.monotonic()
    with motor.connect() as conexion:
        esperas.append(time.monotonic() - inicio)
        conexion.execute(text("SELECT 1"))
        time.sleep(segundos)


@app.get("/tres-a-la-vez")
def tres_a_la_vez() -> JSONResponse:
    """Tres peticiones, dos conexiones. La tercera ESPERA — y entra.

    Esperar no es un fallo: es el grupo haciendo su trabajo. El problema empieza
    cuando la espera se alarga tanto que el cliente se cansa antes.
    """
    esperas: list[float] = []
    barrera = threading.Barrier(3)
    hilos = [threading.Thread(target=_retener, args=(0.3, esperas, barrera)) for _ in range(3)]
    for hilo in hilos:
        hilo.start()
    for hilo in hilos:
        hilo.join()

    return JSONResponse({
        "completadas": len(esperas),
        "espero_alguna": max(esperas) > 0.1,
        "espera_maxima_ms": int(max(esperas) * 1000),
    })


@app.get("/agotar")
def agotar() -> JSONResponse:
    """Con las dos retenidas mas tiempo que la espera, la tercera FALLA.

    Y falla de forma declarada, con un 503 y un codigo: el cliente sabe que puede
    reintentar. La alternativa —esperar sin limite— convierte una base lenta en
    un servicio colgado, porque cada peticion que espera retiene tambien su hilo.
    """
    listas = threading.Barrier(3)
    retenedores = [
        threading.Thread(target=_retener, args=(2.0, [], listas)) for _ in range(2)
    ]
    for hilo in retenedores:
        hilo.start()
    listas.wait()
    time.sleep(0.2)  # el tiempo justo para que las dos esten prestadas

    try:
        with motor.connect() as conexion:
            conexion.execute(text("SELECT 1"))
        respuesta = JSONResponse({"ok": True})
    except TiempoAgotado:
        respuesta = JSONResponse({"code": "GRUPO_AGOTADO"}, status_code=503)

    for hilo in retenedores:
        hilo.join()
    return respuesta


@app.get("/fugar")
def fugar() -> JSONResponse:
    """UNA FUGA: pedir prestado y no devolver.

    No hay excepcion, no hay registro, no hay nada. El grupo simplemente tiene
    una conexion menos para siempre, y el sintoma aparece horas despues como
    «la aplicacion se cuelga por las tardes».
    """
    fugadas.append(motor.connect())
    return JSONResponse({"fugadas": len(fugadas)})
