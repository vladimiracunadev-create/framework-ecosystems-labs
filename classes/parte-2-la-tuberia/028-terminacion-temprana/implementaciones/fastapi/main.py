from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

estado = {"manejador": 0}


@app.middleware("http")
async def autenticar(peticion: Request, siguiente):
    if peticion.url.path == "/publico":
        return await siguiente(peticion)

    # Devolver una respuesta SIN llamar a `siguiente` corta la cadena: el
    # manejador de la ruta no se ejecuta.
    if peticion.headers.get("authorization") != "Bearer valido":
        return JSONResponse(
            {"error": "no autorizado", "manejador": estado["manejador"]},
            status_code=401,
            headers={"www-authenticate": "Bearer"},
        )
    return await siguiente(peticion)


@app.get("/privado")
def privado() -> JSONResponse:
    estado["manejador"] += 1
    return JSONResponse({"ok": True, "manejador": estado["manejador"]})


@app.get("/publico")
def publico() -> JSONResponse:
    return JSONResponse({"ok": True, "publico": True})
