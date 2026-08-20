from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse, Response

app = FastAPI()

TAREA = {"id": "1", "titulo": "negociar"}


def preferido(accept: str) -> str | None:
    """Elige el primer tipo admitido según el orden y la calidad declarados.

    Se implementa a mano porque Starlette no negocia por su cuenta: expone la
    cabecera y deja la decisión a la aplicación.
    """
    candidatos = []
    for parte in accept.split(","):
        trozos = parte.split(";")
        tipo = trozos[0].strip()
        calidad = 1.0
        for extra in trozos[1:]:
            if extra.strip().startswith("q="):
                try:
                    calidad = float(extra.strip()[2:])
                except ValueError:
                    calidad = 0.0
        if calidad > 0:
            candidatos.append((calidad, tipo))
    candidatos.sort(key=lambda x: -x[0])

    for _, tipo in candidatos:
        if tipo in ("application/json", "text/html"):
            return tipo
        if tipo == "*/*" or tipo == "application/*":
            return "application/json"
        if tipo == "text/*":
            return "text/html"
    return None


@app.get("/tareas/1")
def obtener(peticion: Request) -> Response:
    accept = peticion.headers.get("accept", "*/*")
    elegido = preferido(accept)
    cabeceras = {"vary": "Accept"}

    if elegido == "application/json":
        return JSONResponse(TAREA, headers=cabeceras)
    if elegido == "text/html":
        return HTMLResponse(f"<h1>{TAREA['titulo']}</h1>", headers=cabeceras)
    return JSONResponse(
        {"error": "no puedo servir ese tipo"}, status_code=406, headers=cabeceras
    )
