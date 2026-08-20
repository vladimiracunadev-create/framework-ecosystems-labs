from fastapi import FastAPI

app = FastAPI()


# El nombre del segmento y el del argumento coinciden: FastAPI los empareja y,
# de paso, convierte al tipo anotado. Aquí se declara `str` a propósito, para
# que el contrato sea el mismo que en los demás frameworks.
@app.get("/tareas/{id}")
def obtener(id: str) -> dict[str, str]:
    return {"id": id}
