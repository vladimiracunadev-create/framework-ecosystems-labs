import os

from flask import Flask, jsonify

app = Flask(__name__)


@app.get("/tareas/<id>")
def obtener(id: str):
    return jsonify(id=id)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", 3000)))
