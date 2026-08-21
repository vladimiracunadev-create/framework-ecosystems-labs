"""EL DOMINIO. Este archivo no importa SQLAlchemy.

Es la prueba de que Data Mapper no es un detalle de configuracion: la clase de
abajo no hereda de nada, no conoce ninguna tabla y no sabe guardarse. Se puede
instanciar, probar y razonar sin que exista una base de datos.
"""


class TituloRequerido(Exception):
    """La regla es del dominio, no de la base ni del framework web."""


class Tarea:
    def __init__(self, titulo: str, hecha: bool = False) -> None:
        if not titulo.strip():
            raise TituloRequerido()
        self.id: int | None = None
        self.titulo = titulo
        self.hecha = hecha

    def marcar(self, hecha: bool) -> None:
        self.hecha = hecha

    def renombrar(self, titulo: str) -> None:
        if not titulo.strip():
            raise TituloRequerido()
        self.titulo = titulo

    def salida(self) -> dict:
        return {"id": self.id, "titulo": self.titulo, "hecha": self.hecha}
