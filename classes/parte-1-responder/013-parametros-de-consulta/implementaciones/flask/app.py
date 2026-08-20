import os

from flask import Flask, jsonify, request

app = Flask(__name__)
POR_OMISION = 20


@app.get("/tareas")
def listar():
    # Trampa de Flask: `request.args.get("limite", default=20, type=int)` NO
    # devuelve None cuando la conversión falla — devuelve el valor por omisión.
    # Con `?limite=abc` responderías 200 y 20, como si el cliente no hubiera
    # pedido nada. Por eso se lee el texto crudo y se convierte a mano.
    bruto = request.args.get("limite")
    if bruto is None:
        return jsonify(limite=POR_OMISION)

    try:
        limite = int(bruto)
    except ValueError:
        return jsonify(error="limite debe ser un entero entre 1 y 100"), 422

    if limite < 1 or limite > 100:
        return jsonify(error="limite debe ser un entero entre 1 y 100"), 422

    return jsonify(limite=limite)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", 3000)))
