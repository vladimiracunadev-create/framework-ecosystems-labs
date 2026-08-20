import os

from flask import Flask, Response

app = Flask(__name__)


@app.get("/")
def raiz() -> Response:
    return Response("hola", mimetype="text/plain")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", 3000)))
