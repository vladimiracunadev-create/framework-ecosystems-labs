"""Auditoría de cambios: un solo lugar por donde pasa cada escritura.

El registro es de solo apéndice — se añaden líneas, nunca se editan ni se
borran. En producción vive aparte de la base de negocio: si quien borró el
dato puede borrar su rastro, el rastro no protege de nada.
"""

from datetime import datetime, timezone
from typing import Annotated, Any

from fastapi import FastAPI, Header
from fastapi.responses import JSONResponse, Response

app = FastAPI()

tareas: dict[str, dict[str, str]] = {}
estado = {"siguiente": 1}
auditoria: list[dict[str, str]] = []


def registrar(actor: str, accion: str, recurso: str, recurso_id: str) -> None:
    auditoria.append({
        "actor": actor or "anonimo",
        "accion": accion,
        "recurso": recurso,
        "recurso_id": recurso_id,
        # El instante lo pone el SERVIDOR: un actor no fecha sus propios actos.
        "instante": datetime.now(timezone.utc).isoformat(),
    })


@app.post("/tareas", status_code=201)
def crear(
    cuerpo: dict[str, Any],
    x_actor: Annotated[str | None, Header()] = None,
) -> JSONResponse:
    identificador = str(estado["siguiente"])
    estado["siguiente"] += 1
    tarea = {"id": identificador, "titulo": str(cuerpo.get("titulo", ""))}
    tareas[identificador] = tarea
    registrar(x_actor or "anonimo", "crear", "tarea", identificador)
    return JSONResponse(tarea, status_code=201)


@app.get("/tareas/{identificador}")
def obtener(identificador: str) -> JSONResponse:
    tarea = tareas.get(identificador)
    # Leer NO se audita: la auditoría registra cambios.
    if tarea is None:
        return JSONResponse({"error": "no-encontrada"}, status_code=404)
    return JSONResponse(tarea)


@app.delete("/tareas/{identificador}")
def borrar(
    identificador: str,
    x_actor: Annotated[str | None, Header()] = None,
) -> Response:
    if identificador not in tareas:
        return JSONResponse({"error": "no-encontrada"}, status_code=404)
    del tareas[identificador]
    registrar(x_actor or "anonimo", "borrar", "tarea", identificador)
    return Response(status_code=204)


@app.get("/auditoria")
def listar() -> JSONResponse:
    return JSONResponse({"total": len(auditoria), "registros": auditoria})
