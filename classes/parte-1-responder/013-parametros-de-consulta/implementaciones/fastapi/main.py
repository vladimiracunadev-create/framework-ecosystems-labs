from fastapi import FastAPI, Query

app = FastAPI()


# El valor por omisión, el tipo y los límites viven en la firma. FastAPI valida
# antes de llamar a la función: si `limite` no encaja, esta línea no se ejecuta.
@app.get("/tareas")
def listar(limite: int = Query(default=20, ge=1, le=100)) -> dict[str, int]:
    return {"limite": limite}
