import os

from flask import Flask, render_template

app = Flask(__name__)

# La tercera tarea es lo que un usuario escribió en un campo de texto.
TAREAS = [
    {"id": "1", "titulo": "comprar pan"},
    {"id": "2", "titulo": "regar las plantas"},
    {"id": "3", "titulo": "<script>alerta(1)</script>"},
]


@app.get("/tareas")
def listar():
    return render_template("tareas.html", tareas=TAREAS)


@app.get("/tareas-crudo")
def listar_crudo():
    return render_template("tareas-crudo.html", tareas=TAREAS)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", 3000)))
