"""Roles con el sistema de dependencias: la autorización se declara en la firma.

FastAPI no trae roles, pero su pieza de composición —`Depends`— hace que la
comprobación viva en la firma de la ruta, no en su cuerpo: quién puede qué se
lee sin leer la implementación.
"""

import secrets
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import JSONResponse, Response
from fastapi.security import HTTPBasic, HTTPBasicCredentials

app = FastAPI()
seguridad = HTTPBasic()

USUARIOS = {
    "ana": {"clave": "secreta123", "rol": "admin"},
    "luis": {"clave": "secreta123", "rol": "lector"},
}

tareas = {
    "1": {"id": "1", "titulo": "preparar informe"},
    "2": {"id": "2", "titulo": "revisar contrato"},
}


def usuario_actual(
    credenciales: Annotated[HTTPBasicCredentials, Depends(seguridad)],
) -> dict[str, str]:
    registrado = USUARIOS.get(credenciales.username)
    # compare_digest: la comparación en tiempo constante de la clase 068.
    if registrado is None or not secrets.compare_digest(
        registrado["clave"], credenciales.password
    ):
        # 401: no sabemos quién eres — y se vuelve a pedir credenciales.
        raise HTTPException(status_code=401, headers={"WWW-Authenticate": "Basic"})
    return {"usuario": credenciales.username, "rol": registrado["rol"]}


def con_rol(*roles: str):
    def comprobar(
        actual: Annotated[dict[str, str], Depends(usuario_actual)],
    ) -> dict[str, str]:
        # 403: sabemos quién eres, y no puedes. La distinción que la clase
        # mide — ante un 401 el cliente reintenta con credenciales; ante un
        # 403, no.
        if roles and actual["rol"] not in roles:
            raise HTTPException(status_code=403, detail="rol-insuficiente")
        return actual

    return comprobar


@app.get("/panel")
def panel(actual: Annotated[dict[str, str], Depends(con_rol("admin"))]) -> JSONResponse:
    return JSONResponse({"usuario": actual["usuario"], "rol": actual["rol"]})


@app.get("/tareas")
def listar(actual: Annotated[dict[str, str], Depends(con_rol())]) -> JSONResponse:
    return JSONResponse({"total": len(tareas)})


@app.delete("/tareas/{identificador}")
def borrar(
    identificador: str,
    actual: Annotated[dict[str, str], Depends(con_rol("admin"))],
) -> Response:
    tareas.pop(identificador, None)
    return Response(status_code=204)
