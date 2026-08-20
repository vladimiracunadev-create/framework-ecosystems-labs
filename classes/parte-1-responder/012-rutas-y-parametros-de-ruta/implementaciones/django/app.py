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
    SECRET_KEY="clase-012-no-es-un-secreto-real",
    MIDDLEWARE=[],
)


def obtener(peticion, id):
    return JsonResponse({"id": id})


# `<str:id>` declara a la vez el nombre y el convertidor. Django tiene también
# `<int:id>`, que rechazaría lo que no sea número antes de llegar a la vista.
urlpatterns = [path("tareas/<str:id>", obtener)]

if __name__ == "__main__":
    puerto = os.environ.get("PORT", "3000")
    execute_from_command_line([sys.argv[0], "runserver", f"127.0.0.1:{puerto}", "--noreload"])
