import "reflect-metadata";
import express from "express";
import { BaseEntity, DataSource, EntitySchema } from "typeorm";

const app = express();
app.use(express.json());

/**
 * MODO ACTIVE RECORD DE TYPEORM.
 *
 * Heredar de `BaseEntity` es lo que convierte la entidad en la puerta a la
 * tabla: aparecen `save()`, `remove()`, `findOneBy()` y compañía sobre la propia
 * clase. TypeORM soporta los dos patrones —este y el de la clase 054— y la
 * elección es exactamente de qué lado quieres el conocimiento.
 */
class Tarea extends BaseEntity {
  /** La regla vive EN EL MODELO. Si el objeto sabe guardarse, tiene sentido que
   *  sepa también cuándo NO debe hacerlo. */
  validar() {
    if (!String(this.titulo ?? "").trim()) {
      const error = new Error("TITULO_REQUERIDO");
      error.codigo = "TITULO_REQUERIDO";
      throw error;
    }
  }

  salida() {
    return { id: this.id, titulo: this.titulo, hecha: this.hecha };
  }
}

// Sin decoradores ni TypeScript: `EntitySchema` describe la tabla y `target` la
// ata a la clase de arriba.
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

// `sqljs` es SQLite compilado a WebAssembly: sin módulo nativo y sin guion de
// instalación. Para una clase es ideal; para producción, no.
const fuente = new DataSource({
  type: "sqljs",
  autoSave: false,
  synchronize: true,
  entities: [EsquemaTarea],
});

await fuente.initialize();
Tarea.useDataSource(fuente);

app.post("/tareas", async (peticion, respuesta) => {
  const tarea = Tarea.create({ titulo: String(peticion.body?.titulo ?? ""), hecha: false });
  try {
    tarea.validar();
  } catch (error) {
    respuesta.status(422).json({ code: error.codigo ?? "INVALIDO" });
    return;
  }
  await tarea.save();
  respuesta.status(201).json(tarea.salida());
});

app.get("/tareas", async (peticion, respuesta) => {
  const tareas = await Tarea.find({ order: { id: "ASC" } });
  respuesta.json({ tareas: tareas.map((t) => t.salida()), total: tareas.length });
});

app.get("/tareas/:id", async (peticion, respuesta) => {
  const tarea = await Tarea.findOneBy({ id: Number(peticion.params.id) });
  if (!tarea) {
    respuesta.status(404).json({ code: "NO_EXISTE" });
    return;
  }
  respuesta.json(tarea.salida());
});

app.patch("/tareas/:id", async (peticion, respuesta) => {
  const tarea = await Tarea.findOneBy({ id: Number(peticion.params.id) });
  if (!tarea) {
    respuesta.status(404).json({ code: "NO_EXISTE" });
    return;
  }
  if (peticion.body?.titulo !== undefined) tarea.titulo = String(peticion.body.titulo);
  if (peticion.body?.hecha !== undefined) tarea.hecha = Boolean(peticion.body.hecha);
  await tarea.save();
  respuesta.json(tarea.salida());
});

app.delete("/tareas/:id", async (peticion, respuesta) => {
  const tarea = await Tarea.findOneBy({ id: Number(peticion.params.id) });
  if (!tarea) {
    respuesta.status(404).json({ code: "NO_EXISTE" });
    return;
  }
  await tarea.remove();
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
