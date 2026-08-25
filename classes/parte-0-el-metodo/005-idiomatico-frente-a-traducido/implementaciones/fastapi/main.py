"""LA MISMA RUTA, DOS VECES.

`/idiomatico/tareas` esta escrita como se escribe en FastAPI: un modelo de
Pydantic en la firma, y el framework valida antes de entrar al manejador.

`/traducido/tareas` esta traducida desde Express — no la sintaxis, sino LA
SUPOSICION: que el cuerpo llega como un diccionario y se comprueba a mano.

Aqui la perdida es mayor que en Express, y por eso esta clase existe. La version
traducida no solo se deja `"     "`: renuncia ademas a los tipos, a la
documentacion generada y al 422 automatico. Todo eso venia gratis, y desaparece
sin que ningun error lo anuncie.
"""
import inspect
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator

app = FastAPI()

tareas: list[dict] = []


# >>> idiomatico
class Tarea(BaseModel):
    """Las reglas viven en el TIPO. No hay `if` que se pueda olvidar."""

    titulo: str = Field(min_length=1)

    @field_validator("titulo")
    @classmethod
    def sin_espacios_sobrantes(cls, valor: str) -> str:
        limpio = valor.strip()
        if not limpio:
            raise ValueError("titulo no puede estar vacio")
        return limpio


@app.post("/idiomatico/tareas", status_code=201)
def crear_idiomatico(tarea: Tarea) -> JSONResponse:
    """El manejador NO valida: recibe un objeto que ya cumple."""
    guardada = {"id": len(tareas) + 1, "titulo": tarea.titulo}
    tareas.append(guardada)
    return JSONResponse(guardada, status_code=201)
# <<< idiomatico


# >>> traducido
@app.post("/traducido/tareas", status_code=201)
async def crear_traducido(peticion: Request) -> JSONResponse:
    """Traducida desde Express.

    `await peticion.json()` es el equivalente exacto de `req.body`, y a partir de
    ahi todo se comprueba a mano. Funciona. Pasa las pruebas del camino feliz.

    Y al escribir `Request` en lugar de `Tarea` en la firma, FastAPI deja de
    saber que espera esta ruta: no valida, no convierte y no documenta. La
    diferencia entre las dos no es de estilo — es de cuanto framework se esta
    usando.
    """
    datos = await peticion.json()
    titulo = datos.get("titulo")
    if not titulo:
        return JSONResponse({"code": "TITULO_INVALIDO"}, status_code=422)

    guardada = {"id": len(tareas) + 1, "titulo": titulo}
    tareas.append(guardada)
    return JSONResponse(guardada, status_code=201)
# <<< traducido


@app.exception_handler(RequestValidationError)
async def invalido(peticion: Request, error: RequestValidationError) -> JSONResponse:
    """FastAPI ya responde 422; esto solo le pone al cuerpo la forma del contrato."""
    return JSONResponse({"code": "TITULO_INVALIDO"}, status_code=422)


@app.get("/tareas")
def listar() -> JSONResponse:
    return JSONResponse({"total": len(tareas), "tareas": tareas})


@app.get("/tareas/{id_tarea}")
def leer(id_tarea: int) -> JSONResponse:
    for tarea in tareas:
        if tarea["id"] == id_tarea:
            return JSONResponse(tarea)
    return JSONResponse({"code": "NO_EXISTE"}, status_code=404)


FUENTE = Path(__file__).read_text(encoding="utf-8").splitlines()


def lineas_entre(marca: str) -> int:
    """Cuenta las lineas de codigo de un bloque leyendo ESTE archivo."""
    desde = next(i for i, l in enumerate(FUENTE) if f">>> {marca}" in l)
    hasta = next(i for i, l in enumerate(FUENTE) if f"<<< {marca}" in l)
    return len([
        l for l in FUENTE[desde + 1:hasta]
        if l.strip() and not l.strip().startswith("#") and not l.strip().startswith('"""')
    ])


@app.get("/comparacion")
def comparacion() -> JSONResponse:
    """LA COMPARACION, MEDIDA.

    `mismo_camino_feliz` no esta escrito a mano: se pasa el mismo cuerpo valido
    por las dos versiones y se comparan los resultados. Afirmar que coinciden sin
    comprobarlo seria exactamente el error que esta clase ensena a no cometer.

    `la_ruta_esta_documentada` sale del esquema OpenAPI que FastAPI genera solo.
    Es la perdida que no se ve mirando el codigo: la ruta traducida existe en la
    documentacion, y sin ningun cuerpo declarado.
    """
    cuerpo = {"titulo": "misma tarea"}
    por_la_idiomatica = Tarea(**cuerpo).titulo
    por_la_traducida = cuerpo.get("titulo")

    esquema = app.openapi()["paths"]
    def tiene_cuerpo(ruta: str) -> bool:
        return "requestBody" in esquema[ruta]["post"]

    return JSONResponse({
        "mismo_camino_feliz": por_la_idiomatica == por_la_traducida,
        "quien_valida_en_la_idiomatica": "pydantic, antes de entrar al manejador",
        "quien_valida_en_la_traducida": "nadie",
        "de_donde_viene_la_traduccion": "express",
        "cuerpo_documentado_en_la_idiomatica": tiene_cuerpo("/idiomatico/tareas"),
        "cuerpo_documentado_en_la_traducida": tiene_cuerpo("/traducido/tareas"),
        "firma_idiomatica": str(inspect.signature(crear_idiomatico)),
        "firma_traducida": str(inspect.signature(crear_traducido)),
        "lineas_idiomatico": lineas_entre("idiomatico"),
        "lineas_traducido": lineas_entre("traducido"),
    })
