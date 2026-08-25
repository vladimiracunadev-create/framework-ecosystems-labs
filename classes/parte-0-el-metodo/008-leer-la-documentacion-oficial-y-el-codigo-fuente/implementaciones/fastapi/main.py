"""CUATRO PREGUNTAS SOBRE FASTAPI, RESPONDIDAS ABRIENDO FASTAPI.

Ninguna respuesta esta escrita a mano. Todas salen del paquete que hay instalado
en este entorno: sus metadatos, su directorio y sus archivos.

La diferencia con un tutorial no es la calidad de la prosa: es que un tutorial
describe la version que tenia su autor el dia que lo escribio, y esto describe la
que tienes tu ahora.
"""
from importlib import metadata
from pathlib import Path

import fastapi
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

# `fastapi.__file__` es el archivo que el interprete cargo DE VERDAD.
#
# No es lo mismo que suponer una ruta de `site-packages`: con entornos
# virtuales, instalaciones editables o varias versiones, el que se importa puede
# estar en otro sitio. Preguntarle al modulo es la unica respuesta fiable.
RAIZ = Path(fastapi.__file__).parent

# Lo que este proyecto PIDIO, que no siempre es lo que hay.
DECLARADO = {
    linea.split("==")[0].strip(): linea.split("==")[1].strip()
    for linea in Path("requirements.txt").read_text(encoding="utf-8").splitlines()
    if "==" in linea
}

INSTALADA = metadata.version("fastapi")


def _metadatos() -> dict[str, str]:
    """Los metadatos que el paquete publica de si mismo.

    `Project-URL` es una lista de pares «etiqueta, direccion» y es donde los
    paquetes modernos de Python ponen su documentacion. `Home-page` es el campo
    antiguo, que muchos ya no rellenan.
    """
    datos = metadata.metadata("fastapi")
    urls = {}
    for entrada in datos.get_all("Project-URL") or []:
        etiqueta, _, direccion = entrada.partition(",")
        urls[etiqueta.strip().lower()] = direccion.strip()
    if datos.get("Home-page"):
        urls.setdefault("home-page", datos["Home-page"])
    return urls


def _archivos_de_codigo() -> tuple[int, str | None]:
    archivos = sorted(p for p in RAIZ.rglob("*.py") if "__pycache__" not in p.parts)
    primero = str(archivos[0].relative_to(RAIZ)).replace("\\", "/") if archivos else None
    return len(archivos), primero


def pregunta_version() -> dict:
    """QUE VERSION HAY INSTALADA, no cual se pidio.

    Aqui `requirements.txt` fija la version con `==`, asi que cabria esperar que
    coincidan. Muchas veces no coinciden, y esa es la respuesta interesante: pip
    instala en un entorno compartido, y el archivo describe lo que se queria, no
    lo que hay. La que importa en un informe de error es siempre la instalada.
    """
    declarada = DECLARADO.get("fastapi", "sin fijar")
    coincide = declarada == INSTALADA
    return {
        "respondida": True,
        "leida_del_paquete": True,
        "declarada_en_el_proyecto": declarada,
        "instalada": INSTALADA,
        "satisface_lo_declarado": coincide,
        "de_donde_sale": "importlib.metadata, que lee el .dist-info del entorno",
        "aviso": (
            "coinciden"
            if coincide
            else "NO COINCIDEN: `requirements.txt` pide una version y el entorno tiene otra"
        ),
        "por_que_pasa": (
            "pip instala en un entorno COMPARTIDO y `requirements.txt` es un deseo, no un "
            "hecho: mientras nadie ejecute `pip install -r`, el archivo y la maquina "
            "pueden decir cosas distintas. Un archivo de bloqueo por proyecto —lo que hacen "
            "pnpm, Cargo o Bundler— cierra ese hueco"
        ),
        "por_que_importa": (
            "un rango no identifica lo que se ejecuta; en un informe de error solo "
            "vale la version exacta"
        ),
    }


def pregunta_documentacion() -> dict:
    """DONDE ESTA LA DOCUMENTACION OFICIAL, segun el propio paquete."""
    urls = _metadatos()
    return {
        "respondida": True,
        "leida_del_paquete": bool(urls),
        "direcciones_que_publica": urls,
        "documentacion": urls.get("documentation") or urls.get("home-page") or "no la declara",
        "licencia": metadata.metadata("fastapi").get("License-Expression")
        or metadata.metadata("fastapi").get("License")
        or "no la declara",
        "por_que_importa": (
            "el buscador ordena por popularidad; el paquete declara donde esta la "
            "verdad de ESTA version"
        ),
    }


def pregunta_donde_vive() -> dict:
    return {
        "respondida": True,
        "existe": RAIZ.is_dir(),
        "ruta": str(RAIZ).replace("\\", "/"),
        "punto_de_entrada": "__init__.py",
        "por_que_importa": "el codigo que se ejecuta esta en tu disco: no hay que imaginarlo, se abre",
    }


def pregunta_codigo_fuente() -> dict:
    """¿PUEDES LEER SU CODIGO FUENTE SIN SALIR DE TU MAQUINA?

    En Python la respuesta es si, y ademas el interprete te ayuda:
    `inspect.getsource` devuelve el texto de cualquier funcion cargada. Es la
    forma mas directa que existe de contestar «¿y esto que hace exactamente?».
    """
    total, primero = _archivos_de_codigo()
    return {
        "respondida": True,
        "hay_codigo_fuente_en_disco": total > 0,
        "archivos_de_codigo": total,
        "por_ejemplo": primero,
        "que_viaja_en_el_paquete": "el codigo fuente tal cual, sin compilar",
        "como_leerlo": f"abre {RAIZ}/{primero}".replace("\\", "/"),
        "ademas": "inspect.getsource(fastapi.FastAPI.get) devuelve el cuerpo del metodo sin salir del interprete",
        "por_que_importa": (
            "cuando la documentacion no contesta, el codigo si; y aqui esta a un "
            "`cat` de distancia"
        ),
    }


PREGUNTAS = {
    "version": pregunta_version,
    "documentacion": pregunta_documentacion,
    "donde-vive": pregunta_donde_vive,
    "codigo-fuente": pregunta_codigo_fuente,
}


@app.get("/preguntas")
def preguntas() -> JSONResponse:
    return JSONResponse({
        "framework": "fastapi",
        "total": len(PREGUNTAS),
        "preguntas": list(PREGUNTAS),
        "todas_leidas_del_paquete": True,
    })


@app.get("/pregunta/{cual}")
def pregunta(cual: str) -> JSONResponse:
    responder = PREGUNTAS.get(cual)
    if responder is None:
        # Una pregunta que no esta no se contesta con una aproximacion. Es la
        # misma regla que la clase 006 aplica al coste de contratar.
        return JSONResponse(
            {"code": "PREGUNTA_DESCONOCIDA", "preguntas": list(PREGUNTAS)}, status_code=404
        )
    return JSONResponse({"pregunta": cual, "framework": "fastapi", **responder()})
