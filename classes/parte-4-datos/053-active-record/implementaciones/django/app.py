"""Django en un solo archivo, con su ORM — que es Active Record de manual.

El modelo NO es una descripción de la tabla que otro objeto sabe guardar: es la
tabla. `tarea.save()`, `tarea.delete()`, `Tarea.objects.get(...)`. El objeto
conoce su almacenamiento, y esa es la definición del patrón.
"""
import json
import os
import sys

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.management import execute_from_command_line
from django.db import connection, models
from django.http import HttpResponse, JsonResponse
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

settings.configure(
    DEBUG=False,
    ALLOWED_HOSTS=["127.0.0.1", "localhost"],
    ROOT_URLCONF=__name__,
    SECRET_KEY="clase-053-no-es-un-secreto-real",
    MIDDLEWARE=[],
    # `INSTALLED_APPS` con `__main__` deja que este mismo archivo sea la
    # aplicacion: sin el, Django no encuentra el modelo de mas abajo.
    INSTALLED_APPS=["__main__"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": "datos.db"}},
    DEFAULT_AUTO_FIELD="django.db.models.AutoField",
)

import django  # noqa: E402

django.setup()


class Tarea(models.Model):
    titulo = models.CharField(max_length=120)
    hecha = models.BooleanField(default=False)

    class Meta:
        app_label = "__main__"
        db_table = "tareas"

    def clean(self) -> None:
        """La regla vive EN EL MODELO, no en la vista.

        Es la consecuencia mas visible de Active Record: si el objeto sabe
        guardarse, tiene sentido que sepa tambien cuando NO debe hacerlo.
        """
        if not self.titulo.strip():
            raise ValidationError({"titulo": "TITULO_REQUERIDO"})

    def salida(self) -> dict:
        return {"id": self.id, "titulo": self.titulo, "hecha": self.hecha}


def cuerpo(peticion) -> dict:
    try:
        return json.loads(peticion.body or b"{}")
    except ValueError:
        return {}


@csrf_exempt
def coleccion(peticion):
    if peticion.method == "POST":
        tarea = Tarea(titulo=str(cuerpo(peticion).get("titulo", "")))
        try:
            # `full_clean` ejecuta las validaciones. Django NO las ejecuta al
            # guardar: `save()` escribe lo que le des. Es una diferencia real con
            # Rails, donde `save` valida siempre.
            tarea.full_clean()
        except ValidationError:
            return JsonResponse({"code": "TITULO_REQUERIDO"}, status=422)
        tarea.save()
        return JsonResponse(tarea.salida(), status=201)

    tareas = [t.salida() for t in Tarea.objects.order_by("id")]
    return JsonResponse({"tareas": tareas, "total": len(tareas)})


@csrf_exempt
def elemento(peticion, id_tarea: int):
    try:
        tarea = Tarea.objects.get(pk=id_tarea)
    except Tarea.DoesNotExist:
        return JsonResponse({"code": "NO_EXISTE"}, status=404)

    if peticion.method == "PATCH":
        datos = cuerpo(peticion)
        if "titulo" in datos:
            tarea.titulo = str(datos["titulo"])
        if "hecha" in datos:
            tarea.hecha = bool(datos["hecha"])
        tarea.save()
        return JsonResponse(tarea.salida())

    if peticion.method == "DELETE":
        tarea.delete()
        return HttpResponse(status=204)

    return JsonResponse(tarea.salida())


urlpatterns = [
    path("tareas", coleccion),
    path("tareas/<int:id_tarea>", elemento),
]

if __name__ == "__main__":
    if os.path.exists("datos.db"):
        os.remove("datos.db")
    # El editor de esquema crea la tabla a partir del modelo, sin migraciones.
    # En un proyecto de verdad habria migraciones — es la clase 058.
    with connection.schema_editor() as editor:
        editor.create_model(Tarea)
    puerto = os.environ.get("PORT", "3000")
    execute_from_command_line([sys.argv[0], "runserver", f"127.0.0.1:{puerto}", "--noreload"])
