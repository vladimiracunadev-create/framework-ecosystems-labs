"""Propiedad del dato: la tarea ajena no se distingue de la inexistente.

Los dos usuarios tienen el mismo rol — una comprobación por rol los deja
pasar a los dos. La pregunta de esta clase no es «qué clase de usuario
eres» sino «¿es tuyo ESTE dato?», y se responde en la consulta.
"""

import secrets
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import JSONResponse, Response
from fastapi.security import HTTPBasic, HTTPBasicCredentials

app = FastAPI()
seguridad = HTTPBasic()

USUARIOS = {
    "ana": {"clave": "secreta123", "rol": "usuaria"},
    "luis": {"clave": "secreta123", "rol": "usuaria"},
}

tareas = {
    "1": {"id": "1", "titulo": "preparar informe", "propietaria": "ana"},
    "2": {"id": "2", "titulo": "revisar contrato", "propietaria": "luis"},
}


def usuario_actual(
    credenciales: Annotated[HTTPBasicCredentials, Depends(seguridad)],
) -> str:
    registrado = USUARIOS.get(credenciales.username)
    if registrado is None or not secrets.compare_digest(
        registrado["clave"], credenciales.password
    ):
        raise HTTPException(status_code=401, headers={"WWW-Authenticate": "Basic"})
    return credenciales.username


def buscar(identificador: str, usuario: str) -> dict[str, str] | None:
    """Buscar SIEMPRE con el propietario en la condición.

    No es «buscar y luego comprobar»: para este usuario, la tarea ajena
    directamente NO SE ENCUENTRA. En SQL sería
    `WHERE id = :id AND propietaria = :usuario` — el mismo gesto.
    """
    tarea = tareas.get(identificador)
    return tarea if tarea and tarea["propietaria"] == usuario else None


@app.get("/tareas")
def listar(usuario: Annotated[str, Depends(usuario_actual)]) -> JSONResponse:
    mias = [t for t in tareas.values() if t["propietaria"] == usuario]
    return JSONResponse({"total": len(mias), "tareas": mias})


@app.get("/tareas/{identificador}")
def detalle(
    identificador: str, usuario: Annotated[str, Depends(usuario_actual)]
) -> JSONResponse:
    tarea = buscar(identificador, usuario)
    # 404 y no 403: un 403 confirmaría que la tarea EXISTE, y los
    # identificadores son enumerables.
    if tarea is None:
        return JSONResponse({"error": "no-encontrada"}, status_code=404)
    return JSONResponse(tarea)


@app.delete("/tareas/{identificador}")
def borrar(
    identificador: str, usuario: Annotated[str, Depends(usuario_actual)]
) -> Response:
    tarea = buscar(identificador, usuario)
    if tarea is None:
        return JSONResponse({"error": "no-encontrada"}, status_code=404)
    del tareas[tarea["id"]]
    return Response(status_code=204)
