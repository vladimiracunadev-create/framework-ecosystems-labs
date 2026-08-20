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
    SECRET_KEY="clase-013-no-es-un-secreto-real",
    MIDDLEWARE=[],
)

POR_OMISION = 20


def listar(peticion):
    bruto = peticion.GET.get("limite")
    if bruto is None:
        return JsonResponse({"limite": POR_OMISION})
    try:
        limite = int(bruto)
    except ValueError:
        return JsonResponse({"error": "limite debe ser un entero entre 1 y 100"}, status=422)
    if limite < 1 or limite > 100:
        return JsonResponse({"error": "limite debe ser un entero entre 1 y 100"}, status=422)
    return JsonResponse({"limite": limite})


urlpatterns = [path("tareas", listar)]

if __name__ == "__main__":
    puerto = os.environ.get("PORT", "3000")
    execute_from_command_line([sys.argv[0], "runserver", f"127.0.0.1:{puerto}", "--noreload"])
