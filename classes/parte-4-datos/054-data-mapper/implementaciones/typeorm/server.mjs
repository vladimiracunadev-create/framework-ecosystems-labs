import "reflect-metadata";
import express from "express";
import { DataSource, EntitySchema } from "typeorm";
import { Tarea, TituloRequerido } from "./dominio.mjs";

const app = express();
app.use(express.json());

/**
 * MODO DATA MAPPER DE TYPEORM.
 *
 * La misma biblioteca que en la clase 053, y la entidad NO hereda de
 * `BaseEntity`: no tiene `save()` ni `find()`. Quien guarda es el repositorio,
 * que se pide a la fuente de datos.
 *
 * TypeORM soporta los dos patrones, y comparar los dos archivos deja la
 * diferencia en una sola línea: `extends BaseEntity`.
 */
const EsquemaTarea = new EntitySchema({
  name: "Tarea",
  target: Tarea,
  tableName: "tareas",
  columns: {
    id: { type: "integer", primary: true, generated: true },
    titulo: { type: "text" },
    hecha: { type: "boolean", default: false },
  },
});

const fuente = new DataSource({
  type: "sqljs",
  autoSave: false,
  synchronize: true,
  entities: [EsquemaTarea],
});

await fuente.initialize();
const repositorio = fuente.getRepository(Tarea);

function responderFallo(error, respuesta) {
  if (error instanceof TituloRequerido) {
    respuesta.status(422).json({ code: error.codigo });
    return true;
  }
  return false;
}

app.post("/tareas", async (peticion, respuesta) => {
  let tarea;
  try {
    // La regla se comprueba en la FÁBRICA del dominio, antes de que el
    // repositorio entre en escena. Una tarea inválida no llega a existir.
    tarea = Tarea.crear(peticion.body?.titulo);
  } catch (error) {
    if (responderFallo(error, respuesta)) return;
    throw error;
  }
  await repositorio.save(tarea);
  respuesta.status(201).json(tarea.salida());
});

app.get("/tareas", async (peticion, respuesta) => {
  const tareas = await repositorio.find({ order: { id: "ASC" } });
  respuesta.json({ tareas: tareas.map((t) => t.salida()), total: tareas.length });
});

app.get("/tareas/:id", async (peticion, respuesta) => {
  const tarea = await repositorio.findOneBy({ id: Number(peticion.params.id) });
  if (!tarea) {
    respuesta.status(404).json({ code: "NO_EXISTE" });
    return;
  }
  respuesta.json(tarea.salida());
});

app.patch("/tareas/:id", async (peticion, respuesta) => {
  const tarea = await repositorio.findOneBy({ id: Number(peticion.params.id) });
  if (!tarea) {
    respuesta.status(404).json({ code: "NO_EXISTE" });
    return;
  }
  try {
    if (peticion.body?.titulo !== undefined) tarea.renombrar(peticion.body.titulo);
    if (peticion.body?.hecha !== undefined) tarea.marcar(peticion.body.hecha);
  } catch (error) {
    if (responderFallo(error, respuesta)) return;
    throw error;
  }
  await repositorio.save(tarea);
  respuesta.json(tarea.salida());
});

app.delete("/tareas/:id", async (peticion, respuesta) => {
  const tarea = await repositorio.findOneBy({ id: Number(peticion.params.id) });
  if (!tarea) {
    respuesta.status(404).json({ code: "NO_EXISTE" });
    return;
  }
  await repositorio.remove(tarea);
  respuesta.status(204).end();
});

const servidor = app.listen(Number(process.env.PORT ?? 3000));
for (const senal of ["SIGTERM", "SIGINT"]) {
  process.on(senal, async () => {
    servidor.close();
    await fuente.destroy();
    process.exit(0);
  });
}
