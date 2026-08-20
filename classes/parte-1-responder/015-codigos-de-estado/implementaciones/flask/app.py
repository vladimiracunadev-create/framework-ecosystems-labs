import os

from flask import Flask, jsonify, request

app = Flask(__name__)

tareas = {"1": {"id": "1", "titulo": "original"}}
estado = {"siguiente": 100}


@app.post("/tareas")
def crear():
    cuerpo = request.get_json(silent=True) or {}
    identificador = str(estado["siguiente"])
    estado["siguiente"] += 1
    tareas[identificador] = {"id": identificador, "titulo": cuerpo.get("titulo", "")}
    return jsonify(id=identificador), 201, {"Location": f"/tareas/{identificador}"}


@app.delete("/tareas/<id>")
def borrar(id: str):
    if id not in tareas:
        return jsonify(error="no existe"), 404
    del tareas[id]
    return "", 204


@app.get("/tareas/<id>")
def obtener(id: str):
    if id not in tareas:
        return jsonify(error="no existe"), 404
    return jsonify(tareas[id])


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", 3000)))
