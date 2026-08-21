import json
from pathlib import Path
from typing import Any

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from sqlalchemy import Integer, String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

app = FastAPI()


class Base(DeclarativeBase):
    pass


class Tarea(Base):
    __tablename__ = "tareas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    titulo: Mapped[str] = mapped_column(String(120))


motor = create_engine("sqlite:///datos.db")
Base.metadata.drop_all(motor)
Base.metadata.create_all(motor)
CrearSesion = sessionmaker(bind=motor, expire_on_commit=False)

# LA SEMILLA ES UN DATO, NO CODIGO. Estar en un archivo aparte tiene dos
# consecuencias practicas: se revisa en una pull request como cualquier otro
# dato, y se puede cargar desde una prueba sin arrancar el servidor.
CATALOGO = json.loads((Path(__file__).parent / "catalogo.json").read_text(encoding="utf-8"))


def sembrar() -> int:
    """IDEMPOTENTE POR IDENTIFICADOR, NO POR «SI ESTA VACIA».

    `merge` inserta si no existe y actualiza si existe. Como los identificadores
    del catalogo son fijos, sembrar dos veces deja el mismo estado — y no se
    lleva por delante lo que hayan anadido otros.

    La alternativa que se ve mucho —«si la tabla esta vacia, siembra»— falla en
    cuanto el catalogo crece: la fila nueva no entra nunca.
    """
    creadas = 0
    with CrearSesion() as s:
        for fila in CATALOGO:
            if s.get(Tarea, fila["id"]) is None:
                creadas += 1
            s.merge(Tarea(id=fila["id"], titulo=fila["titulo"]))
        s.commit()
    return creadas


def total() -> int:
    with CrearSesion() as s:
        return len(s.scalars(select(Tarea)).all())


@app.post("/sembrar")
def sembrar_http() -> JSONResponse:
    creadas = sembrar()
    return JSONResponse({"creadas": creadas, "total": total()})


@app.post("/reiniciar")
def reiniciar() -> JSONResponse:
    """REINICIAR ES OTRA OPERACION: borra y vuelve a sembrar."""
    with CrearSesion() as s:
        s.query(Tarea).delete()
        s.commit()
        # Aqui NO hace falta reiniciar ninguna secuencia, y es un detalle del
        # motor que conviene conocer: SQLAlchemy no emite `AUTOINCREMENT` para
        # una clave primaria entera, asi que SQLite usa el `rowid` y al vaciar la
        # tabla vuelve a empezar en 1 solo. Con `AUTOINCREMENT` —lo que hace
        # Prisma— hay una tabla `sqlite_sequence` que sigue contando, y sin
        # tocarla los identificadores dejan de ser reproducibles.
    creadas = sembrar()
    return JSONResponse({"creadas": creadas, "total": total()})


@app.get("/tareas")
def listar() -> JSONResponse:
    with CrearSesion() as s:
        tareas = s.scalars(select(Tarea).order_by(Tarea.id)).all()
    return JSONResponse({
        "tareas": [{"id": t.id, "titulo": t.titulo} for t in tareas],
        "total": len(tareas),
    })


@app.post("/tareas", status_code=201)
def crear(cuerpo: dict[str, Any]) -> JSONResponse:
    tarea = Tarea(titulo=str(cuerpo.get("titulo", "")))
    with CrearSesion() as s:
        s.add(tarea)
        s.commit()
    return JSONResponse({"id": tarea.id, "titulo": tarea.titulo}, status_code=201)
