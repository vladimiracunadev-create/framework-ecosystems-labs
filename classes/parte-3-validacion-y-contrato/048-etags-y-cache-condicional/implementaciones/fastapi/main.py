import hashlib
import json
from typing import Annotated

from fastapi import FastAPI, Header, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

tarea: dict[str, str] = {"id": "1", "titulo": "original"}


class Cuerpo(BaseModel):
    titulo: str = ""


def etiqueta(valor: dict[str, str]) -> str:
    crudo = json.dumps(valor, sort_keys=True, separators=(",", ":")).encode()
    return '"' + hashlib.sha256(crudo).hexdigest()[:16] + '"'


@app.get("/tareas/1")
def obtener(
    if_none_match: Annotated[str | None, Header()] = None,
) -> Response:
    actual = etiqueta(tarea)
    if if_none_match == actual:
        # 304 SIN cuerpo: el estandar lo exige, y algunos clientes se atragantan
        # si llega contenido.
        return Response(status_code=304, headers={"etag": actual})
    return JSONResponse(tarea, headers={"etag": actual})


@app.put("/tareas/1")
def sustituir(
    cuerpo: Cuerpo,
    if_match: Annotated[str | None, Header()] = None,
) -> Response:
    global tarea
    actual = etiqueta(tarea)

    if if_match is None:
        return JSONResponse({"code": "PRECONDICION_REQUERIDA"}, status_code=428)
    if if_match != actual:
        return JSONResponse({"code": "PRECONDICION_FALLIDA"}, status_code=412)

    tarea = {"id": "1", "titulo": cuerpo.titulo}
    return JSONResponse(tarea, headers={"etag": etiqueta(tarea)})
