from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

TAREAS = [
    {"id": "1", "titulo": "beta", "prioridad": 2, "completada": False},
    {"id": "2", "titulo": "alfa", "prioridad": 1, "completada": True},
    {"id": "3", "titulo": "gamma", "prioridad": 3, "completada": False},
]

CAMPOS_ORDENABLES = {"titulo", "prioridad"}
CAMPOS_FILTRABLES = {"completada", "prioridad"}


@app.get("/tareas")
def listar(peticion: Request) -> JSONResponse:
    resultado = list(TAREAS)

    for campo, valor in peticion.query_params.items():
        if campo == "orden":
            continue
        if campo not in CAMPOS_FILTRABLES:
            return JSONResponse(
                {"code": "CAMPO_NO_FILTRABLE", "campo": campo}, status_code=422)
        if campo == "completada":
            if valor not in ("true", "false"):
                return JSONResponse({"code": "VALOR_INVALIDO", "campo": campo}, status_code=422)
            resultado = [t for t in resultado if t["completada"] == (valor == "true")]
        if campo == "prioridad":
            if not valor.lstrip("-").isdigit():
                return JSONResponse({"code": "VALOR_INVALIDO", "campo": campo}, status_code=422)
            resultado = [t for t in resultado if t["prioridad"] == int(valor)]

    orden = peticion.query_params.get("orden")
    if orden is not None:
        descendente = orden.startswith("-")
        campo = orden[1:] if descendente else orden
        if campo not in CAMPOS_ORDENABLES:
            return JSONResponse(
                {"code": "CAMPO_NO_ORDENABLE", "campo": campo}, status_code=422)
        resultado.sort(key=lambda t: t[campo], reverse=descendente)

    return JSONResponse({"elementos": resultado})
