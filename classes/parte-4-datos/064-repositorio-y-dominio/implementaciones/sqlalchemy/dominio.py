"""EL DOMINIO.

Este archivo no importa SQLAlchemy, ni FastAPI, ni nada que sepa de bases de
datos. Es Python corriente, y por eso las reglas de mas abajo se pueden ejecutar
en una prueba en milisegundos — sin servidor, sin esquema y sin limpiar tablas
entre casos.

La ruta `/dominio` lo lee y comprueba, SOBRE EL TEXTO, que esa afirmacion es
cierta. Prometerlo en un README no cuesta nada; comprobarlo, si.
"""
from typing import Any


class ReglaRota(Exception):
    def __init__(self, codigo: str) -> None:
        super().__init__(codigo)
        self.codigo = codigo


class Tarea:
    def __init__(self, id_tarea: int, titulo: str, hecha: bool = False) -> None:
        self.id = id_tarea
        self.titulo = titulo
        self.hecha = hecha

    def terminar(self) -> None:
        self.hecha = True


class Proyecto:
    """El proyecto es la RAIZ: nadie toca una tarea sin pasar por el.

    Esa es la razon de que las tres reglas puedan vivir aqui. Si el resto del
    codigo pudiera anadir tareas por su cuenta, «no se anaden tareas a un
    proyecto cerrado» seria una recomendacion en lugar de una regla.
    """

    def __init__(
        self,
        id_proyecto: int,
        nombre: str,
        cerrado: bool = False,
        tareas: list[Tarea] | None = None,
    ) -> None:
        self.id = id_proyecto
        self.nombre = nombre
        self.cerrado = cerrado
        self.tareas: list[Tarea] = tareas or []

    def anadir_tarea(self, id_tarea: int, titulo: str) -> Tarea:
        """REGLA 2 y REGLA 3."""
        if self.cerrado:
            raise ReglaRota("PROYECTO_CERRADO")
        if any(t.titulo == titulo for t in self.tareas):
            raise ReglaRota("TITULO_REPETIDO")
        tarea = Tarea(id_tarea, titulo)
        self.tareas.append(tarea)
        return tarea

    def cerrar(self) -> None:
        """REGLA 1."""
        if self.pendientes() > 0:
            raise ReglaRota("QUEDAN_PENDIENTES")
        self.cerrado = True

    def terminar_tarea(self, id_tarea: int) -> Tarea:
        for tarea in self.tareas:
            if tarea.id == id_tarea:
                tarea.terminar()
                return tarea
        raise ReglaRota("NO_EXISTE")

    def pendientes(self) -> int:
        return sum(1 for t in self.tareas if not t.hecha)

    def salida(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "nombre": self.nombre,
            "cerrado": self.cerrado,
            "tareas": len(self.tareas),
            "pendientes": self.pendientes(),
        }
