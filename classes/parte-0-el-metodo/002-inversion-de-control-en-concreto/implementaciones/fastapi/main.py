"""La inversión de control con un decorador, que es un registro disfrazado.

`@app.get("/trabajo")` recibe la función recién definida, la guarda en la tabla
de rutas y devuelve la función sin tocarla. NO la llama — y el primer caso del
contrato lo demuestra: recién arrancado el contador vale cero.

Que el registro se escriba encima de la función en vez de a su lado es
sintaxis. El mecanismo es el mismo que en Express.
"""

from fastapi import FastAPI
from fastapi.responses import JSONResponse, PlainTextResponse

app = FastAPI()

estado = {"veces": 0}


@app.get("/trabajo", response_class=PlainTextResponse)
def manejar_trabajo() -> str:
    estado["veces"] += 1
    return "hecho"


@app.get("/invocaciones")
def invocaciones() -> JSONResponse:
    # La ventana de inspección: expone el contador sin tocarlo.
    return JSONResponse({"veces": estado["veces"]})


# Y una diferencia que esta clase saca a la luz: aquí no hay `listen`. El objeto
# `app` se declara y lo ejecuta un servidor externo —Uvicorn— desde fuera del
# archivo. La inversión de control llega hasta el arranque.
