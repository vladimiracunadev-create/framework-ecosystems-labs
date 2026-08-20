"""Django en un solo archivo: sin proyecto generado, para que se vea el núcleo."""
import json
import os
import sys

from django.conf import settings
from django.core.management import execute_from_command_line
from django.http import HttpResponse, JsonResponse
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

settings.configure(
    DEBUG=False,
    ALLOWED_HOSTS=["127.0.0.1", "localhost"],
    ROOT_URLCONF=__name__,
    SECRET_KEY="clase-017-no-es-un-secreto-real",
    MIDDLEWARE=[],
)


@csrf_exempt
def crear(peticion):
    if peticion.method != "POST":
        return HttpResponse(status=405)

    try:
        cuerpo = json.loads(peticion.body or b"")
    except ValueError:
        return JsonResponse({"error": "cuerpo JSON mal formado"}, status=400)

    titulo = cuerpo.get("titulo") if isinstance(cuerpo, dict) else None
    if not isinstance(titulo, str) or titulo == "":
        return JsonResponse({"error": "titulo es obligatorio"}, status=422)

    return JsonResponse({"id": "1", "titulo": titulo, "completada": False}, status=201)


urlpatterns = [path("tareas", crear)]

if __name__ == "__main__":
    puerto = os.environ.get("PORT", "3000")
    execute_from_command_line([sys.argv[0], "runserver", f"127.0.0.1:{puerto}", "--noreload"])
