"""Django en un solo archivo: sin proyecto generado, para que se vea el núcleo."""
import json
import os
import sys

from django import forms
from django.conf import settings
from django.core.management import execute_from_command_line
from django.http import HttpResponse, JsonResponse
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

settings.configure(
    DEBUG=False,
    ALLOWED_HOSTS=["127.0.0.1", "localhost"],
    ROOT_URLCONF=__name__,
    SECRET_KEY="clase-039-no-es-un-secreto-real",
    MIDDLEWARE=[],
)


class FormularioTarea(forms.Form):
    """La validación de Django vive en un FORMULARIO, no en la vista.

    Es su respuesta desde 2005 y se nota: el formulario sirve igual para una
    petición JSON que para un `<form>` de navegador, y ese es exactamente el
    tipo de reutilizacion que el framework busca.
    """

    titulo = forms.CharField(min_length=1, max_length=120, strip=True)
    completada = forms.BooleanField(required=False)


@csrf_exempt
def crear(peticion):
    if peticion.method != "POST":
        return HttpResponse(status=405)

    try:
        cuerpo = json.loads(peticion.body or b"")
    except ValueError:
        return JsonResponse({"error": "cuerpo JSON mal formado"}, status=400)

    if not isinstance(cuerpo, dict):
        return JsonResponse({"error": "cuerpo JSON mal formado"}, status=400)

    if "completada" in cuerpo and not isinstance(cuerpo["completada"], bool):
        return JsonResponse({"error": "completada debe ser booleano"}, status=422)

    formulario = FormularioTarea(cuerpo)
    if not formulario.is_valid():
        campo, errores = next(iter(formulario.errors.items()))
        return JsonResponse({"error": f"{campo}: {errores[0]}"}, status=422)

    return JsonResponse({
        "titulo": formulario.cleaned_data["titulo"],
        "completada": formulario.cleaned_data["completada"],
    }, status=201)


urlpatterns = [path("tareas", crear)]

if __name__ == "__main__":
    puerto = os.environ.get("PORT", "3000")
    execute_from_command_line([sys.argv[0], "runserver", f"127.0.0.1:{puerto}", "--noreload"])
