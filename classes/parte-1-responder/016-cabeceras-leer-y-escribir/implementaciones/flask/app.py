import os

from flask import Flask, jsonify, request

app = Flask(__name__)


@app.get("/eco")
def eco():
    recibido = request.headers.get("X-Peticion", "(ninguna)")
    respuesta = jsonify(recibido=recibido)
    respuesta.headers["X-Respuesta"] = "servida"
    respuesta.headers["Cache-Control"] = "no-store"
    return respuesta


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", 3000)))
