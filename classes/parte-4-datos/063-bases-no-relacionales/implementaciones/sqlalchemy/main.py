from typing import Any

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from sqlalchemy import JSON, Integer, create_engine, event, inspect, select, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

app = FastAPI()


class Base(DeclarativeBase):
    pass


class Documento(Base):
    """TODO EL ESQUEMA. Un identificador y un documento.

    La forma de la tarea —titulo, etiquetas, autor— no esta aqui: esta en cada
    documento. Es literalmente el cambio del que trata la clase.

    `JSON` es un tipo de SQLAlchemy, no de SQLite: el ORM serializa y deserializa
    por ti, y en la base queda TEXTO. SQLite no tiene tipo JSON — su soporte, la
    extension JSON1, son funciones que operan sobre texto.
    """

    __tablename__ = "documentos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    documento: Mapped[dict[str, Any]] = mapped_column(JSON)


motor = create_engine("sqlite:///datos.db")

consultas = {"total": 0}


@event.listens_for(Engine, "before_cursor_execute")
def contar(conexion, cursor, sentencia, parametros, contexto, muchos):
    consultas["total"] += 1


Base.metadata.drop_all(motor)
Base.metadata.create_all(motor)
CrearSesion = sessionmaker(bind=motor, expire_on_commit=False)


@app.post("/tareas", status_code=201)
def crear(cuerpo: dict[str, Any]) -> JSONResponse:
    fila = Documento(documento=cuerpo)
    with CrearSesion() as s:
        s.add(fila)
        s.commit()
    return JSONResponse({"id": fila.id, **cuerpo}, status_code=201)


@app.get("/tareas/{id_tarea}")
def leer(id_tarea: int) -> JSONResponse:
    """UNA lectura. Sin uniones, porque no hay nada que unir."""
    consultas["total"] = 0
    with CrearSesion() as s:
        fila = s.get(Documento, id_tarea)
        if fila is None:
            return JSONResponse({"code": "NO_EXISTE"}, status_code=404)
        contenido = dict(fila.documento)
    return JSONResponse({"id": id_tarea, **contenido})


@app.get("/consultas")
def ver_consultas() -> JSONResponse:
    return JSONResponse({"consultas": consultas["total"]})


@app.get("/esquema")
def esquema() -> JSONResponse:
    """Dos columnas, y ninguna se llama «titulo».

    `campos_declarados` es cero a proposito: la base no sabe que campos tiene una
    tarea. Eso no significa que no haya esquema — significa que EL ESQUEMA ESTA
    EN EL CODIGO y que nadie lo hace cumplir.
    """
    columnas = [c["name"] for c in inspect(motor).get_columns("documentos")]
    return JSONResponse({"columnas": sorted(columnas), "campos_declarados": 0})


@app.get("/por-etiqueta")
def por_etiqueta(nombre: str = "") -> JSONResponse:
    """BUSCAR DENTRO DEL DOCUMENTO.

    `json_each` convierte un array del documento en filas, y a partir de ahi es
    SQL corriente. Sin esa funcion habria que traerse todos los documentos y
    filtrarlos en memoria — que es exactamente el problema de la clase 060.
    """
    consulta = text("""
        SELECT DISTINCT d.id AS id
          FROM documentos d, json_each(d.documento, '$.etiquetas') e
         WHERE e.value = :nombre
         ORDER BY d.id
    """)
    with motor.connect() as conexion:
        ids = [int(f.id) for f in conexion.execute(consulta, {"nombre": nombre}).all()]
    return JSONResponse({"ids": ids, "total": len(ids)})


@app.post("/renombrar-autor")
def renombrar_autor(cuerpo: dict[str, Any]) -> JSONResponse:
    """EL COSTE DE INCRUSTAR.

    El autor esta dentro de cada tarea. Es lo que hace que leer una tarea sea una
    sola operacion — y tambien lo que obliga a tocar TODOS los documentos para
    cambiarle el nombre.

    En el modelo relacional seria un `UPDATE autores SET nombre = ...` sobre una
    fila. Aqui no hay una fila: hay tantas copias como documentos.
    """
    correo = str(cuerpo.get("correo", ""))
    nombre = str(cuerpo.get("nombre", ""))

    tocados = 0
    with CrearSesion() as s:
        for fila in s.scalars(select(Documento)).all():
            contenido = dict(fila.documento)
            autor = contenido.get("autor")
            if not isinstance(autor, dict) or autor.get("correo") != correo:
                continue
            # Se reasigna el diccionario ENTERO: SQLAlchemy no detecta cambios
            # dentro de una columna JSON salvo que se use `MutableDict`. Es una
            # trampa clasica y silenciosa — el cambio simplemente no se guarda.
            contenido["autor"] = {**autor, "nombre": nombre}
            fila.documento = contenido
            tocados += 1
        s.commit()

    return JSONResponse({"documentos_tocados": tocados})
