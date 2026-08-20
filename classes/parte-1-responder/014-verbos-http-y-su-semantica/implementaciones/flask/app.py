import os

from flask import Flask, jsonify, request

app = Flask(__name__)

tareas = {"1": {"id": "1", "titulo": "original"}}
altas = 0


@app.get("/tareas/<id>")
def obtener(id: str):
    if id not in tareas:
        return "", 404
    return jsonify(tareas[id])


@app.put("/tareas/<id>")
def sustituir(id: str):
    cuerpo = request.get_json(silent=True) or {}
    tareas[id] = {"id": id, "titulo": cuerpo.get("titulo", "")}
    return jsonify(tareas[id])


@app.post("/tareas")
def crear():
    global altas
    cuerpo = request.get_json(silent=True) or {}
    altas += 1
    identificador = f"nueva-{altas}"
    tareas[identificador] = {"id": identificador, "titulo": cuerpo.get("titulo", "")}
    return jsonify(id=identificador, altas=altas), 201, {"Location": f"/tareas/{identificador}"}


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", 3000)))
