import os

from flask import Flask, jsonify, request

app = Flask(__name__)

TITULO_MAX = 120


def validar(cuerpo):
    titulo = cuerpo.get("titulo")
    if not isinstance(titulo, str):
        return "titulo debe ser texto"
    if not titulo.strip():
        return "titulo no puede estar vacío"
    if len(titulo) > TITULO_MAX:
        return "titulo no puede pasar de 120 caracteres"
    completada = cuerpo.get("completada")
    if completada is not None and not isinstance(completada, bool):
        return "completada debe ser booleano"
    return None


@app.post("/tareas")
def crear():
    cuerpo = request.get_json(silent=True)
    if cuerpo is None or not isinstance(cuerpo, dict):
        return jsonify(error="cuerpo JSON mal formado"), 400

    error = validar(cuerpo)
    if error:
        return jsonify(error=error), 422

    return jsonify(titulo=cuerpo["titulo"].strip(),
                   completada=cuerpo.get("completada", False)), 201


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", 3000)))
