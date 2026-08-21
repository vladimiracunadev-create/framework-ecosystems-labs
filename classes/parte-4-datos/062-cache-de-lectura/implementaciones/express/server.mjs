import express from "express";

const app = express();
app.use(express.json());

/**
 * EL ALMACÉN. Aquí hace de base de datos, y lo único que importa de él es que
 * cada lectura CUESTA — por eso se cuentan.
 *
 * En un sistema real esa consulta viaja por red, pide una conexión al grupo
 * (clase 061) y hace trabajo en el motor. La caché existe para no pagarlo dos
 * veces por lo mismo.
 */
const almacen = new Map();
let consultas = 0;
let aciertos = 0;

function leerDelAlmacen(id) {
  consultas += 1;
  return almacen.get(id) ?? null;
}

/**
 * LA CACHÉ. En Express no hay ninguna: esto es un `Map`, y esa ausencia es un
 * hallazgo de la clase, no una carencia del ejemplo.
 *
 * Con un solo proceso funciona. Con tres instancias detrás de un balanceador,
 * cada una tiene su propia caché y la invalidación de una no alcanza a las otras
 * — que es el momento en que hace falta algo compartido, como Redis.
 */
const cache = new Map();

function reiniciar() {
  almacen.clear();
  almacen.set(1, { id: 1, titulo: "comprar pan" });
  cache.clear();
  consultas = 0;
  aciertos = 0;
}

reiniciar();

app.get("/reiniciar", (peticion, respuesta) => {
  reiniciar();
  respuesta.json({ consultas, aciertos });
});

app.get("/metricas", (peticion, respuesta) => respuesta.json({ consultas, aciertos }));

/** LEER PASANDO POR LA CACHÉ: mirar, y si no está, consultar y guardar. */
app.get("/tareas/:id", (peticion, respuesta) => {
  const id = Number(peticion.params.id);

  if (cache.has(id)) {
    aciertos += 1;
    respuesta.set("X-Cache", "HIT").json(cache.get(id));
    return;
  }

  const tarea = leerDelAlmacen(id);
  if (!tarea) {
    respuesta.status(404).json({ code: "NO_EXISTE" });
    return;
  }
  // Se guarda una COPIA. Guardar la referencia dejaría que quien reciba la
  // respuesta modifique la entrada de la caché sin querer.
  cache.set(id, { ...tarea });
  respuesta.set("X-Cache", "MISS").json(tarea);
});

/** LEER SIN PASAR POR LA CACHÉ: la verdad, para poder compararla. */
app.get("/sin-cache/tareas/:id", (peticion, respuesta) => {
  const tarea = leerDelAlmacen(Number(peticion.params.id));
  if (!tarea) {
    respuesta.status(404).json({ code: "NO_EXISTE" });
    return;
  }
  respuesta.json(tarea);
});

/** ESCRIBIR E INVALIDAR. Las dos cosas, y en este orden. */
app.patch("/tareas/:id", (peticion, respuesta) => {
  const id = Number(peticion.params.id);
  const tarea = almacen.get(id);
  if (!tarea) {
    respuesta.status(404).json({ code: "NO_EXISTE" });
    return;
  }
  tarea.titulo = String(peticion.body?.titulo ?? tarea.titulo);
  // BORRAR, no actualizar. Escribir el valor nuevo en la caché parece más
  // eficiente y abre una carrera: dos escrituras a la vez pueden dejar en la
  // caché el valor de la que perdió. Borrar solo puede causar una consulta de
  // más.
  cache.delete(id);
  respuesta.json(tarea);
});

/**
 * ESCRIBIR Y OLVIDAR LA INVALIDACIÓN.
 *
 * No falla nada. Simplemente, a partir de aquí, la caché devuelve un valor que
 * ya no existe en ninguna parte — y lo hará hasta que caduque o alguien
 * reinicie el proceso.
 */
app.post("/escribir-sin-invalidar", (peticion, respuesta) => {
  const tarea = almacen.get(1);
  tarea.titulo = String(peticion.body?.titulo ?? tarea.titulo);
  respuesta.json({ ok: true });
});

app.listen(Number(process.env.PORT ?? 3000));
