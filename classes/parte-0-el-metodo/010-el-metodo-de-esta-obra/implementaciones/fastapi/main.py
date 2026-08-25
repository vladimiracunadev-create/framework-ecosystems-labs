"""LA CLASE MAS PEQUENA DEL PROGRAMA, Y A PROPOSITO.

El problema que resuelve es trivial porque lo que ensena no es el problema: es
COMO ESTA HECHA UNA CLASE y como se reproduce su verificacion.

Asi que esta implementacion no inventa nada: abre su propio directorio, lee los
archivos que lo forman y contesta con lo que encuentra. Incluido el numero de
casos de `contrato.json` — el mismo contrato que la esta ejecutando ahora mismo.
"""
import json
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

# `implementaciones/fastapi` → la carpeta de la clase, dos niveles arriba.
RAIZ_DE_LA_CLASE = Path.cwd().resolve().parent.parent

# LOS CUATRO ARCHIVOS QUE TIENE TODA CLASE DE ESTE PROGRAMA.
#
# No es una convencion documentada en algun sitio y esperada aqui: es lo que
# `scripts/verify-classes.mjs` exige, y por eso las 149 clases lo cumplen.
ANATOMIA = [
    ("README.md", "la clase: el problema, el contrato, el codigo de cada implementacion y la comparacion"),
    ("contrato.json", "los casos, identicos para todas las implementaciones y escritos ANTES que ellas"),
    ("porque-si-porque-no.md", "el juicio: donde esta solucion es natural, donde es forzada y que se paga"),
    ("implementaciones/", "un directorio por framework del elenco, cada uno con su receta de arranque"),
]


@app.get("/anatomia")
def anatomia() -> JSONResponse:
    return JSONResponse({
        "leida_del_disco": True,
        "raiz": RAIZ_DE_LA_CLASE.name,
        "archivos": [nombre for nombre, _ in ANATOMIA],
        "que_es_cada_uno": dict(ANATOMIA),
        # Se comprueba que existan de verdad: una lista escrita a mano que no
        # corresponda con el disco es exactamente lo que este repositorio evita.
        "todos_presentes": all(
            (RAIZ_DE_LA_CLASE / nombre.rstrip("/")).exists() for nombre, _ in ANATOMIA
        ),
    })


@app.get("/contrato")
def contrato() -> JSONResponse:
    """EL CONTRATO, LEIDO POR QUIEN LO ESTA CUMPLIENDO.

    `casos` no es un numero escrito aqui: se cuenta abriendo `contrato.json`. Y
    uno de los casos de ese contrato comprueba que la cuenta sea la que es, asi
    que anadir un caso sin mirar rompe la clase — que es justo lo que debe pasar.
    """
    datos = json.loads((RAIZ_DE_LA_CLASE / "contrato.json").read_text(encoding="utf-8"))
    return JSONResponse({
        "se_lee_a_si_mismo": True,
        "clase": datos["clase"],
        "tipo": datos["tipo"],
        "casos": len(datos["casos"]),
        "nombres": [c["nombre"] for c in datos["casos"]],
        "por_que_va_primero": (
            "el contrato se escribe antes que cualquier implementacion; si se escribiera "
            "despues, describiria lo que una de ellas hace en vez de lo que todas deben hacer"
        ),
    })


@app.get("/implementaciones")
def implementaciones() -> JSONResponse:
    """EL ELENCO, que son los directorios que hay — no una lista escrita aparte."""
    directorio = RAIZ_DE_LA_CLASE / "implementaciones"
    elenco = sorted(d.name for d in directorio.iterdir() if d.is_dir())
    return JSONResponse({
        "total": len(elenco),
        "elenco": elenco,
        "cada_una_tiene": "ejecutar.json, la receta que dice que hace falta, como se prepara y como arranca",
        "ninguna_tiene": "adaptadores: el verificador habla el mismo HTTP con todas",
    })


@app.get("/estados")
def estados() -> JSONResponse:
    """LOS TRES RESULTADOS POSIBLES, Y EL QUE MAS SE MALINTERPRETA.

    «Omitida» no es «paso». Significa que la cadena de herramientas de esa
    implementacion no esta en esta maquina y el verificador NO la ejecuto. Un
    resumen que mezclara omitidas con verificadas seria un verde falso, y eso es
    lo unico que este repositorio no se permite.
    """
    return JSONResponse({
        "estados": ["verificada", "con fallo", "omitida"],
        "verificada": "se ejecuto y cumplio todos los casos",
        "con fallo": "se ejecuto y no cumplio alguno; el resumen dice cual y que respondio",
        "omitida": "NO se ejecuto: falta su cadena de herramientas en esta maquina",
        "omitida_significa_paso": False,
        "por_que_importa": (
            "un verde que incluya lo que no se ejecuto no es un verde: es una lista de deseos"
        ),
    })


@app.get("/verificacion")
def verificacion() -> JSONResponse:
    return JSONResponse({
        "comando": "node scripts/run-class.mjs 010",
        "que_hace": [
            "lee contrato.json",
            "por cada directorio del elenco, comprueba si su cadena esta en el PATH",
            "si esta: prepara, arranca en un puerto libre y le lanza los casos",
            "si no esta: la declara omitida y sigue",
            "al final resume que se verifico, que fallo y que se omitio",
        ],
        "si_te_faltan_cadenas": "node scripts/doctor.mjs",
        "todo_el_programa": "node scripts/run-class.mjs --todas",
    })
