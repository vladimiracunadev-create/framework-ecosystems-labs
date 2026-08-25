"""El mismo saludo con Flask, y la misma inversión de control que en Express.

`@app.get("/saludo")` no llama a nada: REGISTRA la función en una tabla de
rutas que Flask consulta cuando llega una petición. Quien decide llamarla —y
qué hacer si ninguna coincide— es el framework.

Que en Python el registro se escriba como un decorador y en JavaScript como
una llamada a método es sintaxis. El mecanismo es idéntico.
"""

import os

from flask import Flask, Response, request

app = Flask(__name__)


@app.get("/saludo")
def saludo() -> Response:
    # `request` no es un argumento: es un objeto de contexto que Flask deja
    # accesible durante la petición. Es una decisión de diseño discutible
    # —dificulta probar la función aislada— y es la de Flask.
    nombre = request.args.get("nombre")
    cuerpo = f"hola {nombre}" if nombre else "hola"
    return Response(cuerpo, mimetype="text/plain")


# Sin 404 escrito. Werkzeug —la capa WSGI sobre la que se apoya Flask— lo
# emite cuando el emparejador de rutas no encuentra nada.

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", 3000)))
