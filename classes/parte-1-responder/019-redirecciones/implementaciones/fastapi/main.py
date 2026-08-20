from fastapi import FastAPI
from fastapi.responses import JSONResponse, RedirectResponse

app = FastAPI()


@app.get("/antigua")
def antigua() -> RedirectResponse:
    return RedirectResponse("/nueva", status_code=301)


@app.get("/temporal")
def temporal() -> RedirectResponse:
    return RedirectResponse("/nueva", status_code=302)


@app.post("/temporal-estricta")
def estricta() -> RedirectResponse:
    # 307 conserva método y cuerpo: el POST sigue siendo POST tras el salto.
    return RedirectResponse("/nueva", status_code=307)


@app.get("/nueva")
def nueva() -> JSONResponse:
    return JSONResponse({"destino": "nueva"})


@app.post("/nueva")
def nueva_post() -> JSONResponse:
    return JSONResponse({"destino": "nueva", "metodo": "POST"})
