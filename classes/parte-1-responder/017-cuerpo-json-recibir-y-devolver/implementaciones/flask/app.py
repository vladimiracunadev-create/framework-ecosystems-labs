import os

from flask import Flask, jsonify, request

app = Flask(__name__)


@app.post("/tareas")
def crear():
    # `silent=True` devuelve None en vez de lanzar: así se distingue el cuerpo
    # ilegible (400) del cuerpo legible pero incompleto (422).
    cuerpo = request.get_json(silent=True)
    if cuerpo is None:
        return jsonify(error="cuerpo JSON mal formado"), 400

    titulo = cuerpo.get("titulo")
    if not isinstance(titulo, str) or titulo == "":
        return jsonify(error="titulo es obligatorio"), 422

    return jsonify(id="1", titulo=titulo, completada=False), 201


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", 3000)))
