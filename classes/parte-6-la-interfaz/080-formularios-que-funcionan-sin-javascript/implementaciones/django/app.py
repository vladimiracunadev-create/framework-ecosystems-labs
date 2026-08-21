"""Django en un solo archivo: sin proyecto generado, para que se vea el núcleo."""
import os
import sys

from django.conf import settings
from django.core.management import execute_from_command_line
from django.shortcuts import redirect, render
from django.urls import path

RAIZ = os.path.dirname(os.path.abspath(__file__))

settings.configure(
    DEBUG=False,
    ALLOWED_HOSTS=["127.0.0.1", "localhost"],
    ROOT_URLCONF=__name__,
    SECRET_KEY="clase-080-no-es-un-secreto-real",
    # El middleware de CSRF ACTIVO: esta clase no lo apaga. Un formulario sin
    # testigo es el ataque de la clase 072, y el sitio donde vive el testigo
    # es exactamente esta plantilla.
    MIDDLEWARE=["django.middleware.csrf.CsrfViewMiddleware"],
    TEMPLATES=[
        {
            "BACKEND": "django.template.backends.django.DjangoTemplates",
            "DIRS": [os.path.join(RAIZ, "plantillas")],
        }
    ],
)

TAREAS = []
SIGUIENTE = {"id": 1}


def tareas(peticion):
    if peticion.method == "POST":
        titulo = peticion.POST.get("titulo", "")
        TAREAS.append({"id": str(SIGUIENTE["id"]), "titulo": titulo})
        SIGUIENTE["id"] += 1
        # ENVIAR, REDIRIGIR, MOSTRAR. La respuesta al POST no es la página:
        # es un 302 a la página. Sin esto, recargar reenvía el formulario y
        # el navegador pregunta «¿reenviar datos?» — y crea otra tarea.
        return redirect("/tareas")
    return render(peticion, "tareas.html", {"tareas": TAREAS})


urlpatterns = [path("tareas", tareas)]

if __name__ == "__main__":
    puerto = os.environ.get("PORT", "3000")
    execute_from_command_line([sys.argv[0], "runserver", f"127.0.0.1:{puerto}", "--noreload"])
