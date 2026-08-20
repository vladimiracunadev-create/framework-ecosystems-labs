"""Django en un solo archivo: sin proyecto generado, para que se vea el núcleo."""
import os
import sys

from django.conf import settings
from django.core.management import execute_from_command_line
from django.http import JsonResponse
from django.urls import path

settings.configure(
    DEBUG=False,
    ALLOWED_HOSTS=["127.0.0.1", "localhost"],
    ROOT_URLCONF=__name__,
    SECRET_KEY="clase-016-no-es-un-secreto-real",
    MIDDLEWARE=[],
)


def eco(peticion):
    # `peticion.headers` normaliza el nombre; el diccionario `META` de toda la
    # vida usaba `HTTP_X_PETICION`, en mayúsculas y con guion bajo.
    recibido = peticion.headers.get("X-Peticion", "(ninguna)")
    respuesta = JsonResponse({"recibido": recibido})
    respuesta["X-Respuesta"] = "servida"
    respuesta["Cache-Control"] = "no-store"
    return respuesta


urlpatterns = [path("eco", eco)]

if __name__ == "__main__":
    puerto = os.environ.get("PORT", "3000")
    execute_from_command_line([sys.argv[0], "runserver", f"127.0.0.1:{puerto}", "--noreload"])
