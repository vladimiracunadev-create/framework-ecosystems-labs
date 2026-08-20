from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse

app = FastAPI()

LIMITE = 1024


@app.post("/subir", status_code=201)
async def subir(archivo: UploadFile | None = None) -> JSONResponse:
    if archivo is None:
        return JSONResponse({"error": "falta el archivo"}, status_code=422)

    # Se lee a trozos y se corta en cuanto se pasa del límite: leer entero y
    # medir después ya habría gastado la memoria que se quería proteger.
    total = 0
    while trozo := await archivo.read(256):
        total += len(trozo)
        if total > LIMITE:
            return JSONResponse({"error": "archivo demasiado grande"}, status_code=413)

    return JSONResponse({"nombre": archivo.filename, "bytes": total}, status_code=201)
