from typing import Annotated

from fastapi import FastAPI, Header
from fastapi.responses import JSONResponse

app = FastAPI()


# `Header` convierte el guion bajo del argumento en guion medio del nombre real:
# `x_peticion` lee la cabecera `x-peticion`.
@app.get("/eco")
def eco(x_peticion: Annotated[str, Header()] = "(ninguna)") -> JSONResponse:
    return JSONResponse(
        {"recibido": x_peticion},
        headers={"x-respuesta": "servida", "cache-control": "no-store"},
    )
