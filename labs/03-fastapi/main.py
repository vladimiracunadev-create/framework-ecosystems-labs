"""TaskFlow sobre FastAPI.

Mismo contrato, mismas pruebas de aceptación. Lo que esta implementación enseña
al compararla con la referencia es el compromiso de la validación declarativa:
el framework valida por ti a partir del tipo, y a cambio hay que **traducir su
formato de error al del contrato**. Ese traductor es el precio de la comodidad,
y es trabajo propio que no desaparece.
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from typing import Annotated, Any

from fastapi import FastAPI, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, StringConstraints
from starlette.exceptions import HTTPException as StarletteHTTPException

TITLE_MAX = 120
MAX_BODY_BYTES = 64 * 1024
PROBLEM_BASE = "https://vladimiracunadev-create.github.io/framework-ecosystems-labs/problems"

CATALOGO: dict[str, tuple[int, str]] = {
    "IDEMPOTENCY_KEY_REQUIRED": (400, "Idempotency key required"),
    "MALFORMED_JSON": (400, "Malformed JSON"),
    "TASK_NOT_FOUND": (404, "Task not found"),
    "ROUTE_NOT_FOUND": (404, "Route not found"),
    "METHOD_NOT_ALLOWED": (405, "Method not allowed"),
    "IDEMPOTENCY_KEY_REUSED": (409, "Idempotency key reused"),
    "BODY_TOO_LARGE": (413, "Body too large"),
    "UNSUPPORTED_MEDIA_TYPE": (415, "Unsupported media type"),
    "VALIDATION_ERROR": (422, "Validation error"),
    "INTERNAL_ERROR": (500, "Internal error"),
}

# Traducción del vocabulario de Pydantic al catálogo del contrato. Sin esta
# tabla, los clientes verían los códigos internos del framework y un cambio de
# versión del framework rompería el contrato.
PYDANTIC_A_CAMPO = {
    "missing": "TITLE_REQUIRED",
    "string_type": "TITLE_REQUIRED",
    "string_too_short": "TITLE_EMPTY",
    "string_too_long": "TITLE_TOO_LONG",
}


def problem(
    code: str,
    *,
    detail: str | None = None,
    instance: str | None = None,
    errors: list[dict[str, str]] | None = None,
    headers: dict[str, str] | None = None,
) -> JSONResponse:
    status, title = CATALOGO.get(code, CATALOGO["INTERNAL_ERROR"])
    payload: dict[str, Any] = {
        "type": f"{PROBLEM_BASE}/{code.lower().replace('_', '-')}",
        "title": title,
        "status": status,
        "code": code,
    }
    if detail:
        payload["detail"] = detail
    if instance:
        payload["instance"] = instance
    if errors:
        payload["errors"] = errors
    return JSONResponse(
        payload,
        status_code=status,
        media_type="application/problem+json",
        headers=headers,
    )


class CreateTask(BaseModel):
    model_config = ConfigDict(extra="forbid")
    # `strip_whitespace` antes de medir: un título de solo espacios queda vacío
    # y cae en el mismo error que un título ausente de contenido.
    title: Annotated[
        str,
        StringConstraints(strip_whitespace=True, min_length=1, max_length=TITLE_MAX),
    ]


app = FastAPI(title="TaskFlow FastAPI Lab", version="2.0.0")

tasks: dict[str, dict] = {}
idempotency: dict[str, dict] = {}
sequence = 1


@app.middleware("http")
async def puerta_de_entrada(request: Request, call_next):
    """Comprobaciones previas al análisis del cuerpo.

    El orden importa y es una decisión de seguridad: el tamaño y el tipo se
    comprueban ANTES de que el framework analice nada. Si se dejan para después,
    el límite no protege de lo que ya se leyó.
    """
    if request.method == "POST" and request.url.path == "/tasks":
        content_type = request.headers.get("content-type", "")
        if not content_type.lower().startswith("application/json"):
            return problem(
                "UNSUPPORTED_MEDIA_TYPE",
                detail="Content-Type must be application/json",
                instance=request.url.path,
            )

        declared = request.headers.get("content-length")
        if declared is not None and declared.isdigit() and int(declared) > MAX_BODY_BYTES:
            return problem("BODY_TOO_LARGE", instance=request.url.path)

        if not request.headers.get("idempotency-key", "").strip():
            return problem(
                "IDEMPOTENCY_KEY_REQUIRED",
                detail="POST is not idempotent: send a client-generated Idempotency-Key",
                instance=request.url.path,
            )

    return await call_next(request)


@app.exception_handler(RequestValidationError)
async def traducir_validacion(request: Request, exc: RequestValidationError) -> JSONResponse:
    errores: list[dict[str, str]] = []
    for detalle in exc.errors():
        tipo = detalle.get("type", "")
        if tipo == "json_invalid":
            return problem("MALFORMED_JSON", instance=request.url.path)
        # loc = ("body", "title"); el campo es el último tramo.
        localizacion = [str(parte) for parte in detalle.get("loc", []) if parte != "body"]
        campo = localizacion[-1] if localizacion else ""
        codigo = PYDANTIC_A_CAMPO.get(tipo)
        if codigo is None:
            codigo = "TITLE_REQUIRED" if campo == "title" else "FIELD_INVALID"
        errores.append({"field": campo, "code": codigo, "detail": str(detalle.get("msg", ""))})

    return problem(
        "VALIDATION_ERROR",
        detail="The request body failed validation",
        instance=request.url.path,
        errors=errores,
    )


@app.exception_handler(StarletteHTTPException)
async def traducir_http(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    if exc.status_code == 405:
        # Starlette no siempre adjunta `Allow`, y un 405 sin él deja al cliente
        # adivinando qué método sí vale. Se deriva de las rutas declaradas.
        ruta = request.url.path
        permitidos = "GET, POST" if ruta == "/tasks" else "GET"
        return problem("METHOD_NOT_ALLOWED", instance=ruta, headers={"Allow": permitidos})
    if exc.status_code == 404:
        return problem("ROUTE_NOT_FOUND", instance=request.url.path)
    if isinstance(exc.detail, str) and exc.detail in CATALOGO:
        return problem(exc.detail, instance=request.url.path)
    return problem("INTERNAL_ERROR", instance=request.url.path)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/tasks")
def list_tasks() -> dict:
    return {"items": list(tasks.values())}


@app.get("/tasks/{task_id}")
def get_task(task_id: str) -> Any:
    if task_id not in tasks:
        return problem("TASK_NOT_FOUND", instance=f"/tasks/{task_id}")
    return tasks[task_id]


@app.post("/tasks", status_code=201)
async def create_task(request: Request, response: Response) -> Any:
    global sequence
    key = request.headers.get("idempotency-key", "").strip()
    crudo = await request.body()

    if len(crudo) > MAX_BODY_BYTES:
        return problem("BODY_TOO_LARGE", instance="/tasks")

    try:
        entrada = json.loads(crudo or b"{}")
    except json.JSONDecodeError:
        return problem("MALFORMED_JSON", instance="/tasks")

    previa = idempotency.get(key)
    if previa is not None:
        if previa["fingerprint"] != json.dumps(entrada, sort_keys=True):
            return problem(
                "IDEMPOTENCY_KEY_REUSED",
                detail="The key was already used with a different request body",
                instance="/tasks",
            )
        response.status_code = 200
        return previa["task"]

    # La validación sigue siendo la del modelo declarado: se invoca a mano
    # porque la idempotencia debe resolverse antes, no porque se desconfíe de ella.
    try:
        validada = CreateTask.model_validate(entrada)
    except Exception as error:  # pydantic.ValidationError
        errores = [
            {
                "field": str(detalle["loc"][-1]) if detalle.get("loc") else "",
                "code": PYDANTIC_A_CAMPO.get(detalle.get("type", ""), "FIELD_INVALID"),
                "detail": str(detalle.get("msg", "")),
            }
            for detalle in getattr(error, "errors", lambda: [])()
        ] or [{"field": "title", "code": "TITLE_REQUIRED", "detail": "title is required"}]
        return problem(
            "VALIDATION_ERROR",
            detail="The request body failed validation",
            instance="/tasks",
            errors=errores,
        )

    task = {
        "id": f"task-{sequence}",
        "title": validada.title,
        "completed": False,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    sequence += 1
    tasks[task["id"]] = task
    idempotency[key] = {"task": task, "fingerprint": json.dumps(entrada, sort_keys=True)}
    response.headers["Location"] = f"/tasks/{task['id']}"
    return task


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=int(os.environ.get("PORT", "3002")), log_level="warning")
