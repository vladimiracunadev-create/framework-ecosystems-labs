import os

from flask import Flask, jsonify

app = Flask(__name__)


# Flask no tiene middleware propio: tiene GANCHOS por fase. `after_request` se
# ejecuta con la respuesta ya construida, incluida la de un 404.
@app.after_request
def capa(respuesta):
    respuesta.headers["X-Capa"] = "intermedia"
    return respuesta


@app.get("/a")
def a():
    return jsonify(ruta="a")


@app.get("/b")
def b():
    return jsonify(ruta="b")


@app.errorhandler(404)
def no_encontrado(error):
    return jsonify(error="no existe"), 404


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", 3000)))
