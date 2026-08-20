import json

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

LIMITE = 1024
TIPO = "application/problem+json"


@app.middleware("http")
async def limitar(peticion: Request, siguiente):
    # Se mira primero la longitud declarada: rechazar por la cabecera evita
    # leer un solo byte del cuerpo.
    declarada = peticion.headers.get("content-length")
    if declarada is not None and declarada.isdigit() and int(declarada) > LIMITE:
        return JSONResponse(
            {"type": "about:blank", "title": "cuerpo demasiado grande",
             "status": 413, "code": "CUERPO_EXCEDIDO"},
            status_code=413,
            media_type=TIPO,
        )
    return await siguiente(peticion)


@app.post("/tareas", status_code=201)
async def crear(peticion: Request) -> JSONResponse:
    crudo = await peticion.body()
    # Un cliente puede omitir `Content-Length` y enviar el cuerpo troceado: por
    # eso el tope se vuelve a comprobar sobre lo leido.
    if len(crudo) > LIMITE:
        return JSONResponse(
            {"type": "about:blank", "title": "cuerpo demasiado grande",
             "status": 413, "code": "CUERPO_EXCEDIDO"},
            status_code=413,
            media_type=TIPO,
        )
    try:
        cuerpo = json.loads(crudo or b"{}")
    except ValueError:
        return JSONResponse({"error": "cuerpo JSON mal formado"}, status_code=400)
    return JSONResponse({"bytes": len(json.dumps(cuerpo, separators=(",", ":")))},
                        status_code=201)
