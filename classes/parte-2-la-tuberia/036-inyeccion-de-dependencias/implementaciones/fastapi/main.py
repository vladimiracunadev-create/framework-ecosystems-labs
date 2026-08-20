from typing import Annotated, Protocol

from fastapi import Depends, FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()


class Reloj(Protocol):
    def ahora(self) -> str: ...


class RelojFijo:
    def ahora(self) -> str:
        return "2026-01-01T00:00:00Z"


def obtener_reloj() -> Reloj:
    return RelojFijo()


# En FastAPI la inyección se declara en la FIRMA, no en un contenedor aparte.
# `Depends` resuelve la función y pasa su resultado. La sustitución se hace con
# `app.dependency_overrides`, que es lo que usan las pruebas.
@app.get("/ahora")
def ahora(reloj: Annotated[Reloj, Depends(obtener_reloj)]) -> JSONResponse:
    return JSONResponse({"ahora": reloj.ahora(), "origen": "inyectado"})
