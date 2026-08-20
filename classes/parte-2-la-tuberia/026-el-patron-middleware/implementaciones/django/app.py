"""Django en un solo archivo: sin proyecto generado, para que se vea el núcleo."""
import os
import sys

from django.conf import settings
from django.core.management import execute_from_command_line
from django.http import JsonResponse
from django.urls import path

# El middleware de Django es una función que RECIBE la siguiente y DEVUELVE la
# suya. Esa forma —una fábrica— permite hacer trabajo una sola vez al arrancar,
# fuera de la función que se ejecuta en cada petición.
def capa(siguiente):
    def procesar(peticion):
        respuesta = siguiente(peticion)
        respuesta["X-Capa"] = "intermedia"
        return respuesta

    return procesar


settings.configure(
    DEBUG=False,
    ALLOWED_HOSTS=["127.0.0.1", "localhost"],
    ROOT_URLCONF=__name__,
    SECRET_KEY="clase-026-no-es-un-secreto-real",
    MIDDLEWARE=[f"{__name__}.capa"],
)


def a(peticion):
    return JsonResponse({"ruta": "a"})


def b(peticion):
    return JsonResponse({"ruta": "b"})


def no_encontrado(peticion, exception=None):
    # El argumento DEBE llamarse `exception`: Django lo pasa por nombre
    # (`callback(request, exception=...)`). Traducirlo produce un TypeError que
    # se manifiesta como un 500 al pedir una ruta inexistente — un fallo que
    # solo aparece en el camino de error, que es donde menos se prueba.
    return JsonResponse({"error": "no existe"}, status=404)


handler404 = no_encontrado
urlpatterns = [path("a", a), path("b", b)]

if __name__ == "__main__":
    puerto = os.environ.get("PORT", "3000")
    execute_from_command_line([sys.argv[0], "runserver", f"127.0.0.1:{puerto}", "--noreload"])
