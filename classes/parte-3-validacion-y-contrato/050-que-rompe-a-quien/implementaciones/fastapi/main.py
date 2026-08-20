from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()


def valido(titulo: object, maximo: int) -> bool:
    return isinstance(titulo, str) and 0 < len(titulo) <= maximo


@app.post("/v1/tareas")
async def v1(peticion: Request) -> JSONResponse:
    cuerpo = await peticion.json()
    titulo = cuerpo.get("titulo")
    if not valido(titulo, 200):
        return JSONResponse({"code": "VALIDACION"}, status_code=422)
    return JSONResponse({"id": "1", "titulo": titulo}, status_code=201)


@app.post("/v2/tareas")
async def v2(peticion: Request) -> JSONResponse:
    """Los tres cambios COMPATIBLES: campo opcional nuevo en la entrada, campo
    nuevo en la salida, y un valor nuevo en un conjunto de salida."""
    cuerpo = await peticion.json()
    titulo = cuerpo.get("titulo")
    if not valido(titulo, 200):
        return JSONResponse({"code": "VALIDACION"}, status_code=422)
    return JSONResponse(
        {"id": "1", "titulo": titulo, "prioridad": cuerpo.get("prioridad", 2),
         "estado": "pendiente"},
        status_code=201,
    )


@app.post("/v3/tareas")
async def v3(peticion: Request) -> JSONResponse:
    """Los tres INCOMPATIBLES: campo obligatorio nuevo, campo de salida
    renombrado y validacion estrechada."""
    cuerpo = await peticion.json()
    if "prioridad" not in cuerpo:
        return JSONResponse({"code": "VALIDACION", "campo": "prioridad"}, status_code=422)
    titulo = cuerpo.get("titulo")
    if not valido(titulo, 120):
        return JSONResponse({"code": "VALIDACION", "campo": "titulo"}, status_code=422)
    return JSONResponse({"id": "1", "nombre": titulo}, status_code=201)
