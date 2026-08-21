"""Auditar el árbol: lo que ejecutas no es lo que declaraste.

Los dos ficheros de `datos/` son DATOS congelados, no software instalado: el
árbol de una aplicación de 2017 y una instantánea de la base de avisos. Este
laboratorio no instala bibliotecas vulnerables — audita datos sobre ellas,
que es lo que hace un auditor de verdad.
"""

import json
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

DATOS = Path(__file__).parent / "datos"
arbol = json.loads((DATOS / "arbol.json").read_text(encoding="utf-8"))
base = json.loads((DATOS / "avisos.json").read_text(encoding="utf-8"))


def _tupla(version: str) -> tuple[int, ...]:
    return tuple(int(parte) for parte in str(version).split("."))


def menor_que(a: str, b: str) -> bool:
    """Comparación NUMÉRICA, componente a componente.

    Comparar versiones como texto es el error que convierte una auditoría en
    un tranquilizante: "2.5.9" > "2.5.10" es cierto alfabéticamente, así que
    una comparación textual declararía sana una versión afectada. Un
    componente que falta cuenta como cero: 2.5.10 < 2.5.10.1.
    """
    ta, tb = _tupla(a), _tupla(b)
    largo = max(len(ta), len(tb))
    ta = ta + (0,) * (largo - len(ta))
    tb = tb + (0,) * (largo - len(tb))
    return ta < tb


@app.get("/dependencias")
def dependencias() -> JSONResponse:
    directas = [p for p in arbol["paquetes"] if p["directa"]]
    # El número que sorprende la primera vez: lo que declaras y lo que
    # ejecutas no son la misma lista.
    return JSONResponse({
        "directas": len(directas),
        "total": len(arbol["paquetes"]),
        "paquetes": [p["nombre"] for p in arbol["paquetes"]],
    })


@app.get("/dependencias/{nombre}")
def detalle(nombre: str) -> JSONResponse:
    paquete = next((p for p in arbol["paquetes"] if p["nombre"] == nombre), None)
    if paquete is None:
        return JSONResponse({"error": "no-esta-en-el-arbol"}, status_code=404)
    return JSONResponse(paquete)


@app.get("/auditoria")
def auditoria(version: str | None = None) -> JSONResponse:
    # `?version=` permite preguntar «¿y si actualizo?» sin tocar el árbol.
    hallazgos = []
    for aviso in base["avisos"]:
        paquete = next((p for p in arbol["paquetes"] if p["nombre"] == aviso["paquete"]), None)
        if paquete is None:
            continue
        instalada = version if version else paquete["version"]
        if not menor_que(instalada, aviso["fijada_en"]):
            continue
        hallazgos.append({
            "id": aviso["id"],
            "paquete": paquete["nombre"],
            "instalada": instalada,
            "fijada_en": aviso["fijada_en"],
            "gravedad": aviso["gravedad"],
            # Si es transitiva, la actualización no se hace sobre ella sino
            # sobre quien la trajo.
            "directa": paquete["directa"],
            "traida_por": paquete["traida_por"],
            "explotada_activamente": aviso.get("explotada_activamente", False),
        })
    return JSONResponse({
        "instantanea": base["instantanea"],
        "avisos_conocidos": len(base["avisos"]),
        "afectadas": len(hallazgos),
        "hallazgos": hallazgos,
    })
