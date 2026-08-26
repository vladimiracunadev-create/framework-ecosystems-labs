"""EVENTOS DE DOMINIO CON FASTAPI.

Python no trae bus de eventos y FastAPI tampoco. Lo que sí trae el lenguaje es lo
que hace falta para escribirlo: un diccionario de listas de funciones. Quince
líneas.

Y esa pequeñez es parte de la lección. Un bus de eventos no es una pieza de
infraestructura: es un cambio de dirección en las llamadas. Lo caro no es
montarlo, es decidir **qué pasa cuando un consumidor falla**, y eso no lo resuelve
ninguna biblioteca por ti.
"""

import httpx
from fastapi import FastAPI, Header, Request
from fastapi.responses import JSONResponse

app = FastAPI()

# LO QUE PASA CUANDO ALGO PASA. Una lista de funciones por nombre de evento:
# esto es un bus de eventos, y no hace falta más.
SUSCRIPTORES: dict[str, list[tuple[str, object]]] = {}


def suscribir(evento: str, nombre: str, reaccion) -> None:
    SUSCRIPTORES.setdefault(evento, []).append((nombre, reaccion))


def publicar(evento: str, datos: dict) -> list[str]:
    """Avisar a todos, y que el fallo de uno no arrastre a los demás.

    El `try` de dentro del bucle es la línea más importante del archivo. Sin él,
    el primer consumidor que reviente deja sin ejecutar a los siguientes y
    devuelve el error a quien publicó — es decir, rompe el alta por culpa de un
    correo.
    """
    fallidos = []
    for nombre, reaccion in SUSCRIPTORES.get(evento, []):
        try:
            reaccion(datos)
        except Exception:
            fallidos.append(nombre)
    return fallidos


ESTADO = {"usuarios": [], "correos": [], "altas_contadas": 0, "fallidos": []}


# LOS DOS CONSUMIDORES, INDEPENDIENTES. Ninguno sabe del otro, y el alta no sabe
# de ninguno.
def bienvenida(usuario: dict) -> None:
    ESTADO["correos"].append(f"bienvenida a {usuario['nombre']}")


def estadisticas(_usuario: dict) -> None:
    ESTADO["altas_contadas"] += 1


suscribir("usuario.creado", "bienvenida", bienvenida)
suscribir("usuario.creado", "estadisticas", estadisticas)


@app.post("/usuarios")
async def crear(peticion: Request) -> JSONResponse:
    cuerpo = await peticion.json()
    usuario = {"id": len(ESTADO["usuarios"]) + 1, "nombre": cuerpo.get("nombre", "sin nombre")}
    ESTADO["usuarios"].append(usuario)
    # El alta hace lo suyo y anuncia lo que pasó. No sabe quién escucha.
    ESTADO["fallidos"] = publicar("usuario.creado", usuario)
    return JSONResponse(status_code=201, content=usuario)


@app.get("/efectos")
def efectos() -> dict:
    return {
        "usuarios": len(ESTADO["usuarios"]),
        "correos_enviados": len(ESTADO["correos"]),
        "altas_contadas": ESTADO["altas_contadas"],
        "correos": ESTADO["correos"],
        "consumidores_fallidos": ESTADO["fallidos"],
    }


def reiniciar() -> None:
    ESTADO["usuarios"] = []
    ESTADO["correos"] = []
    ESTADO["altas_contadas"] = 0
    ESTADO["fallidos"] = []


@app.get("/eventos.json")
async def eventos(host: str = Header(default="127.0.0.1")) -> dict:
    origen = f"http://{host}"

    async with httpx.AsyncClient() as cliente:
        # 1. Los dos consumidores reaccionan a la misma alta.
        reiniciar()
        await cliente.post(f"{origen}/usuarios", json={"nombre": "Ada"})
        con_los_dos = (await cliente.get(f"{origen}/efectos")).json()

        # 2. UN CONSUMIDOR ROTO NO ROMPE A LOS DEMÁS NI A QUIEN PUBLICÓ.
        #
        # Es la prueba que decide si esto sirve en producción.
        def roto(_usuario: dict) -> None:
            raise RuntimeError("este consumidor esta roto")

        suscribir("usuario.creado", "roto", roto)
        reiniciar()
        respuesta_del_alta = await cliente.post(f"{origen}/usuarios", json={"nombre": "Grace"})
        con_uno_roto = (await cliente.get(f"{origen}/efectos")).json()

        # 3. Quitar un consumidor no toca al emisor.
        SUSCRIPTORES["usuario.creado"] = [
            s for s in SUSCRIPTORES["usuario.creado"] if s[0] != "roto"
        ]
        reiniciar()
        await cliente.post(f"{origen}/usuarios", json={"nombre": "Alan"})
        sin_el_roto = (await cliente.get(f"{origen}/efectos")).json()

    return {
        "framework": "fastapi",
        "consumidores": 2,
        "los_dos_reaccionaron": con_los_dos["correos_enviados"] == 1
        and con_los_dos["altas_contadas"] == 1,
        "un_consumidor_roto_no_rompe_a_los_demas": con_uno_roto["correos_enviados"] == 1
        and con_uno_roto["altas_contadas"] == 1,
        "la_peticion_no_falla": respuesta_del_alta.status_code == 201,
        "quitar_un_consumidor_no_toca_al_emisor": sin_el_roto["correos_enviados"] == 1
        and sin_el_roto["altas_contadas"] == 1,
        "el_emisor_no_conoce_a_los_consumidores": True,
        "como_se_publica": "una funcion publicar() sobre un diccionario de listas: quince lineas",
        "como_se_suscribe": "llamando a suscribir() con el nombre del evento",
        "es_sincrono": True,
        "que_pasa_si_un_consumidor_falla": (
            "se captura y se sigue; el fallo se PIERDE, y para reintentarlo el evento "
            "tendria que estar guardado en algun sitio"
        ),
        "que_haria_falta_en_produccion": (
            "guardar el evento antes de publicarlo, para poder reintentar al consumidor que fallo"
        ),
    }
