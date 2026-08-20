from fastapi import FastAPI, Query, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

app = FastAPI()


# FastAPI rechaza por su cuenta el limite fuera de rango, con SU formato. Aqui
# se traduce al del contrato: el codigo estable lo decide la API, no la
# biblioteca de validacion.
@app.exception_handler(RequestValidationError)
async def invalido(peticion: Request, error: RequestValidationError) -> JSONResponse:
    campo = next(
        (str(x) for detalle in error.errors() for x in detalle["loc"] if x != "query"),
        "",
    )
    codigos = {"limite": "LIMITE_INVALIDO", "desde": "DESDE_INVALIDO"}
    return JSONResponse({"code": codigos.get(campo, "PARAMETRO_INVALIDO")}, status_code=422)

TAREAS = [{"id": str(i + 1).zfill(3), "titulo": f"tarea {i + 1}"} for i in range(25)]


# (1) POR DESPLAZAMIENTO. El limite y su rango se declaran en la firma: el
# maximo NO es opcional, o un cliente pide un millon de filas.
@app.get("/tareas")
def listar(
    desde: int = Query(default=0, ge=0),
    limite: int = Query(default=10, ge=1, le=50),
) -> JSONResponse:
    return JSONResponse({
        "elementos": TAREAS[desde:desde + limite],
        "total": len(TAREAS),
    })


# (2) POR CURSOR.
@app.get("/tareas-cursor")
def por_cursor(
    cursor: str | None = None,
    limite: int = Query(default=10, ge=1, le=50),
) -> JSONResponse:
    if cursor is None:
        inicio = 0
    else:
        posiciones = [i for i, t in enumerate(TAREAS) if t["id"] == cursor]
        if not posiciones:
            return JSONResponse({"code": "CURSOR_INVALIDO"}, status_code=422)
        inicio = posiciones[0] + 1

    elementos = TAREAS[inicio:inicio + limite]
    siguiente = elementos[-1]["id"] if inicio + limite < len(TAREAS) else None
    return JSONResponse({"elementos": elementos, "siguiente": siguiente})
