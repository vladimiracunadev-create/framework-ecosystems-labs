"""Django en un solo archivo: sin proyecto generado, para que se vea el núcleo."""
import os
import sys

from django.conf import settings
from django.core.management import execute_from_command_line
from django.shortcuts import render
from django.urls import path

RAIZ = os.path.dirname(os.path.abspath(__file__))

settings.configure(
    DEBUG=False,
    ALLOWED_HOSTS=["127.0.0.1", "localhost"],
    ROOT_URLCONF=__name__,
    SECRET_KEY="clase-079-no-es-un-secreto-real",
    MIDDLEWARE=[],
    TEMPLATES=[
        {
            "BACKEND": "django.template.backends.django.DjangoTemplates",
            "DIRS": [os.path.join(RAIZ, "plantillas")],
            # `autoescape` viene activado: se declara aquí solo para dejarlo a
            # la vista, no porque haga falta encenderlo.
            "OPTIONS": {"autoescape": True},
        }
    ],
)

# La tercera tarea es lo que un usuario escribió en un campo de texto.
TAREAS = [
    {"id": "1", "titulo": "comprar pan"},
    {"id": "2", "titulo": "regar las plantas"},
    {"id": "3", "titulo": "<script>alerta(1)</script>"},
]


def listar(peticion):
    return render(peticion, "tareas.html", {"tareas": TAREAS})


def listar_crudo(peticion):
    return render(peticion, "tareas-crudo.html", {"tareas": TAREAS})


urlpatterns = [path("tareas", listar), path("tareas-crudo", listar_crudo)]

if __name__ == "__main__":
    puerto = os.environ.get("PORT", "3000")
    execute_from_command_line([sys.argv[0], "runserver", f"127.0.0.1:{puerto}", "--noreload"])
