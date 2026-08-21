import { execFile } from "node:child_process";
import { rm } from "node:fs/promises";
import { promisify } from "node:util";
import express from "express";
import { PrismaClient } from "@prisma/client";

const ejecutar = promisify(execFile);
const app = express();
app.use(express.json());

// Se parte de una base que NO EXISTE: así las migraciones se ejecutan de verdad
// al arrancar, en orden, y el historial que lee `/historial` lo escribieron
// ellas. Con una base ya migrada, la clase probaría bastante menos.
await rm("prisma/datos.db", { force: true });

/**
 * `migrate deploy` es el comando de producción: aplica las migraciones que
 * faltan y nada más. No genera archivos, no pregunta y no toca una base de
 * sombra — por eso es el que se ejecuta en un despliegue.
 *
 * El otro, `migrate dev`, es para desarrollo: compara el esquema con la base,
 * escribe el SQL y puede rehacer la base entera. Confundirlos en producción es
 * un error caro.
 */
async function migrar() {
  await ejecutar("pnpm", ["exec", "prisma", "migrate", "deploy"], {
    shell: process.platform === "win32",
  });
}

await migrar();

const prisma = new PrismaClient();

/** El historial vive en una tabla de la propia base: `_prisma_migrations`. */
async function historial() {
  const filas = await prisma.$queryRawUnsafe(
    "SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NOT NULL " +
      "ORDER BY started_at",
  );
  return filas.map((f) => f.migration_name);
}

app.get("/historial", async (peticion, respuesta) => {
  const aplicadas = await historial();
  respuesta.json({ aplicadas, total: aplicadas.length });
});

/**
 * El esquema se lee del CATÁLOGO de la base, no del modelo de Prisma. Leerlo del
 * modelo probaría que el archivo dice lo que dice, no que la migración se
 * aplicó — que es justo lo que esta clase quiere comprobar.
 */
app.get("/esquema", async (peticion, respuesta) => {
  const columnas = await prisma.$queryRawUnsafe("PRAGMA table_info('Tarea')");
  respuesta.json({ columnas: columnas.map((c) => c.name).sort() });
});

app.get("/tareas", async (peticion, respuesta) => {
  const tareas = await prisma.tarea.findMany({ orderBy: { id: "asc" } });
  respuesta.json({ tareas });
});

app.post("/tareas", async (peticion, respuesta) => {
  const { titulo = "", prioridad = 0 } = peticion.body ?? {};
  respuesta.status(201).json(await prisma.tarea.create({ data: { titulo, prioridad } }));
});

/** Volver a migrar no aplica nada: la historia ya las tiene. */
app.post("/migrar", async (peticion, respuesta) => {
  const antes = await historial();
  await migrar();
  const despues = await historial();
  respuesta.json({ nuevas: despues.length - antes.length, total: despues.length });
});

const servidor = app.listen(Number(process.env.PORT ?? 3000));
for (const senal of ["SIGTERM", "SIGINT"]) {
  process.on(senal, async () => {
    servidor.close();
    await prisma.$disconnect();
    process.exit(0);
  });
}
