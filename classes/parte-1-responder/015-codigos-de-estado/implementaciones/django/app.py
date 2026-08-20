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
    SECRET_KEY="clase-015-no-es-un-secreto-real",
    MIDDLEWARE=[],
)

tareas = {"1": {"id": "1", "titulo": "original"}}
estado = {"siguiente": 100}


@csrf_exempt
def coleccion(peticion):
    if peticion.method != "POST":
        return HttpResponse(status=405)
    try:
        cuerpo = json.loads(peticion.body or b"{}")
    except ValueError:
        cuerpo = {}
    identificador = str(estado["siguiente"])
    estado["siguiente"] += 1
    tareas[identificador] = {"id": identificador, "titulo": cuerpo.get("titulo", "")}
    respuesta = JsonResponse({"id": identificador}, status=201)
    respuesta["Location"] = f"/tareas/{identificador}"
    return respuesta


@csrf_exempt
def por_id(peticion, id):
    if peticion.method == "GET":
        if id not in tareas:
            return JsonResponse({"error": "no existe"}, status=404)
        return JsonResponse(tareas[id])
    if peticion.method == "DELETE":
        if id not in tareas:
            return JsonResponse({"error": "no existe"}, status=404)
        del tareas[id]
        return HttpResponse(status=204)
    return HttpResponse(status=405)


urlpatterns = [path("tareas", coleccion), path("tareas/<str:id>", por_id)]

if __name__ == "__main__":
    puerto = os.environ.get("PORT", "3000")
    execute_from_command_line([sys.argv[0], "runserver", f"127.0.0.1:{puerto}", "--noreload"])
