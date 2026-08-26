"""COLAS DE TRABAJO CON FASTAPI.

FastAPI es el único de los cuatro que trae una pieza con nombre para esto:
`BackgroundTasks`. Se declara como un parámetro más del manejador y se le añade
lo que hay que hacer después; el framework lo ejecuta **cuando la respuesta ya se
ha enviado**.

Es cómodo y hay que saber exactamente hasta dónde llega, porque su nombre invita
a confundirlo con una cola de verdad: la tarea vive en el proceso, no se
reintenta, no se puede consultar, y **si el proceso se reinicia desaparece**.
Para lo que sirve —mandar un correo después de contestar— es perfecta. Para lo
que no, la respuesta se llama Celery, y es otra pieza de infraestructura.
"""

import asyncio
import time

import httpx
from fastapi import BackgroundTasks, FastAPI, Header, Request, Response
from fastapi.responses import JSONResponse

app = FastAPI()

# Lo que tarda el trabajo. Cuatrocientos milisegundos es poco para un informe de
# verdad y bastante para que la diferencia con la respuesta no se pueda confundir
# con ruido.
TARDANZA_MS = 400

# LA COLA, QUE AQUÍ ES UN DICCIONARIO Y EN PRODUCCIÓN NO PUEDE SERLO.
#
# Si el proceso se reinicia, la cola se pierde: todo lo encolado y no hecho
# desaparece sin que nadie se entere.
TRABAJOS: dict[int, dict] = {}
ESTADO = {"siguiente": 1}


async def hacer_el_trabajo(id_trabajo: int, descripcion: str) -> None:
    TRABAJOS[id_trabajo]["estado"] = "en curso"
    await asyncio.sleep(TARDANZA_MS / 1000)
    TRABAJOS[id_trabajo]["estado"] = "terminada"
    TRABAJOS[id_trabajo]["resultado"] = f"informe de {descripcion}"


@app.post("/tareas")
async def crear(peticion: Request, tareas: BackgroundTasks) -> Response:
    cuerpo = await peticion.json()
    descripcion = cuerpo.get("descripcion", "sin nombre")
    id_trabajo = ESTADO["siguiente"]
    ESTADO["siguiente"] += 1
    TRABAJOS[id_trabajo] = {
        "id": id_trabajo,
        "descripcion": descripcion,
        "estado": "encolada",
        "resultado": None,
    }
    # LA PIEZA DEL FRAMEWORK. Se añade aquí y se ejecuta cuando la respuesta ya
    # ha salido.
    tareas.add_task(hacer_el_trabajo, id_trabajo, descripcion)

    # 202 y no 200: **esto no está hecho**. Y `Location` para que quien pregunta
    # no tenga que inventarse la URL donde mirar.
    return JSONResponse(
        status_code=202,
        content={"id": id_trabajo, "estado": "encolada"},
        headers={"Location": f"/tareas/{id_trabajo}"},
    )


@app.get("/tareas/{id_trabajo}")
def consultar(id_trabajo: int) -> Response:
    trabajo = TRABAJOS.get(id_trabajo)
    if trabajo is None:
        return JSONResponse(status_code=404, content={"error": "no existe"})
    return JSONResponse(content=trabajo)


@app.get("/cola.json")
async def cola(host: str = Header(default="127.0.0.1")) -> dict:
    """La medición: lo que tarda la respuesta contra lo que tarda el trabajo.

    Es la única forma de demostrar que la petición no espera, porque el resultado
    final es el mismo con cola y sin ella.
    """
    origen = f"http://{host}"
    async with httpx.AsyncClient() as cliente:
        inicio = time.monotonic()
        encolada = await cliente.post(
            f"{origen}/tareas", json={"descripcion": "ventas de marzo"}
        )
        ms_hasta_la_respuesta = round((time.monotonic() - inicio) * 1000)
        id_trabajo = encolada.json()["id"]

        estado = "encolada"
        while estado != "terminada" and (time.monotonic() - inicio) < 5:
            await asyncio.sleep(0.02)
            estado = (await cliente.get(f"{origen}/tareas/{id_trabajo}")).json()["estado"]
        ms_hasta_terminar = round((time.monotonic() - inicio) * 1000)

    return {
        "framework": "fastapi",
        "estado_de_la_respuesta": encolada.status_code,
        "tardanza_del_trabajo_ms": TARDANZA_MS,
        "ms_hasta_la_respuesta": ms_hasta_la_respuesta,
        "ms_hasta_terminar": ms_hasta_terminar,
        "la_respuesta_no_espera": ms_hasta_la_respuesta < TARDANZA_MS / 2,
        "se_pierde_al_reiniciar": True,
        "donde_vive_la_cola": "un diccionario en la memoria del proceso",
        "como_se_encola": (
            "BackgroundTasks, una pieza del framework: se declara como parametro y "
            "se ejecuta cuando la respuesta ya ha salido"
        ),
        "es_paralelismo": False,
        "que_haria_falta_en_produccion": (
            "una cola fuera del proceso —Celery con Redis o RabbitMQ— para que un "
            "reinicio no borre lo pendiente y para poder reintentar"
        ),
    }
