from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()


def capa(nombre: str):
    async def intermedia(peticion: Request, siguiente):
        if not hasattr(peticion.state, "traza"):
            peticion.state.traza = []
        peticion.state.traza.append(f"entra:{nombre}")
        return await siguiente(peticion)

    return intermedia


# Las capas de Starlette se APILAN: la última registrada envuelve a las
# anteriores, así que se ejecuta primero. Para obtener el mismo orden observable
# que en los otros tres, se registran al revés.
#
# Ese detalle es la razón de ser de esta clase: el orden de ejecución no es el
# de lectura en todos los frameworks.
app.middleware("http")(capa("tres"))
app.middleware("http")(capa("dos"))
app.middleware("http")(capa("uno"))


@app.get("/traza")
def ver(peticion: Request) -> JSONResponse:
    peticion.state.traza.append("manejador")
    return JSONResponse({"traza": peticion.state.traza})
