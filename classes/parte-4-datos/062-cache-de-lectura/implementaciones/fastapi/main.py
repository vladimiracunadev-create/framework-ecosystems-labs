from typing import Any

from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

# EL ALMACEN. Aqui hace de base de datos, y lo unico que importa de el es que
# cada lectura CUESTA — por eso se cuentan.
#
# En un sistema real esa consulta viaja por red, pide una conexion al grupo
# (clase 061) y hace trabajo en el motor. La cache existe para no pagarlo dos
# veces por lo mismo.
almacen: dict[int, dict[str, Any]] = {}
contadores = {"consultas": 0, "aciertos": 0}

# LA CACHE. En FastAPI no hay ninguna: esto es un diccionario, y esa ausencia es
# un hallazgo de la clase, no una carencia del ejemplo.
#
# Con un solo proceso funciona. Con `--workers 4` cada proceso tiene la suya y la
# invalidacion de uno no alcanza a los otros — que es el momento en que hace
# falta algo compartido, como Redis.
cache: dict[int, dict[str, Any]] = {}


def reiniciar_estado() -> None:
    almacen.clear()
    almacen[1] = {"id": 1, "titulo": "comprar pan"}
    cache.clear()
    contadores["consultas"] = 0
    contadores["aciertos"] = 0


reiniciar_estado()


def leer_del_almacen(id_tarea: int) -> dict[str, Any] | None:
    contadores["consultas"] += 1
    return almacen.get(id_tarea)


@app.get("/reiniciar")
def reiniciar() -> JSONResponse:
    reiniciar_estado()
    return JSONResponse(dict(contadores))


@app.get("/metricas")
def metricas() -> JSONResponse:
    return JSONResponse(dict(contadores))


@app.get("/tareas/{id_tarea}")
def leer(id_tarea: int) -> JSONResponse:
    """LEER PASANDO POR LA CACHE: mirar, y si no esta, consultar y guardar."""
    if id_tarea in cache:
        contadores["aciertos"] += 1
        return JSONResponse(cache[id_tarea], headers={"X-Cache": "HIT"})

    tarea = leer_del_almacen(id_tarea)
    if tarea is None:
        return JSONResponse({"code": "NO_EXISTE"}, status_code=404)

    # Se guarda una COPIA. Guardar la referencia dejaria que quien reciba la
    # respuesta modifique la entrada de la cache sin querer.
    cache[id_tarea] = dict(tarea)
    return JSONResponse(tarea, headers={"X-Cache": "MISS"})


@app.get("/sin-cache/tareas/{id_tarea}")
def leer_sin_cache(id_tarea: int) -> JSONResponse:
    """LEER SIN PASAR POR LA CACHE: la verdad, para poder compararla."""
    tarea = leer_del_almacen(id_tarea)
    if tarea is None:
        return JSONResponse({"code": "NO_EXISTE"}, status_code=404)
    return JSONResponse(tarea)


@app.patch("/tareas/{id_tarea}")
def modificar(id_tarea: int, cuerpo: dict[str, Any]) -> JSONResponse:
    """ESCRIBIR E INVALIDAR. Las dos cosas, y en este orden."""
    tarea = almacen.get(id_tarea)
    if tarea is None:
        return JSONResponse({"code": "NO_EXISTE"}, status_code=404)

    tarea["titulo"] = str(cuerpo.get("titulo", tarea["titulo"]))
    # BORRAR, no actualizar. Escribir el valor nuevo en la cache parece mas
    # eficiente y abre una carrera: dos escrituras a la vez pueden dejar en la
    # cache el valor de la que perdio. Borrar solo puede causar una consulta de
    # mas.
    cache.pop(id_tarea, None)
    return JSONResponse(tarea)


@app.post("/escribir-sin-invalidar")
def sin_invalidar(cuerpo: dict[str, Any]) -> JSONResponse:
    """ESCRIBIR Y OLVIDAR LA INVALIDACION.

    No falla nada. Simplemente, a partir de aqui, la cache devuelve un valor que
    ya no existe en ninguna parte — y lo hara hasta que caduque o alguien
    reinicie el proceso.
    """
    almacen[1]["titulo"] = str(cuerpo.get("titulo", almacen[1]["titulo"]))
    return JSONResponse({"ok": True})
