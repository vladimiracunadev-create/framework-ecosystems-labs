import { readFile } from "node:fs/promises";
import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

await prisma.$executeRawUnsafe("DROP TABLE IF EXISTS Tarea");
await prisma.$executeRawUnsafe(
  "CREATE TABLE Tarea (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT NOT NULL)",
);

/**
 * LA SEMILLA ES UN DATO, NO CÓDIGO.
 *
 * Estar en un archivo aparte tiene dos consecuencias prácticas: se revisa en una
 * pull request como cualquier otro dato, y se puede cargar desde una prueba sin
 * arrancar el servidor.
 */
const catalogo = JSON.parse(await readFile(new URL("./catalogo.json", import.meta.url), "utf8"));

/**
 * IDEMPOTENTE POR IDENTIFICADOR, NO POR «SI ESTÁ VACÍA».
 *
 * `upsert` crea si no existe y actualiza si existe. Como los identificadores del
 * catálogo son fijos, sembrar dos veces deja el mismo estado — y no se lleva por
 * delante lo que hayan añadido otros.
 *
 * La alternativa que se ve mucho —«si la tabla está vacía, siembra»— falla en
 * cuanto el catálogo crece: la fila nueva no entra nunca.
 */
async function sembrar() {
  let creadas = 0;
  for (const fila of catalogo) {
    const antes = await prisma.tarea.findUnique({ where: { id: fila.id } });
    await prisma.tarea.upsert({
      where: { id: fila.id },
      update: { titulo: fila.titulo },
      create: fila,
    });
    if (!antes) creadas += 1;
  }
  return creadas;
}

async function total() {
  return prisma.tarea.count();
}

app.post("/sembrar", async (peticion, respuesta) => {
  const creadas = await sembrar();
  respuesta.json({ creadas, total: await total() });
});

/** REINICIAR ES OTRA OPERACIÓN: borra y vuelve a sembrar. */
app.post("/reiniciar", async (peticion, respuesta) => {
  await prisma.$executeRawUnsafe("DELETE FROM Tarea");
  // Sin esto, el autoincremento seguiría donde lo dejó y la tarea añadida a
  // mano dejaría su hueco: los identificadores ya no serían reproducibles.
  await prisma.$executeRawUnsafe("DELETE FROM sqlite_sequence WHERE name = 'Tarea'");
  const creadas = await sembrar();
  respuesta.json({ creadas, total: await total() });
});

app.get("/tareas", async (peticion, respuesta) => {
  const tareas = await prisma.tarea.findMany({ orderBy: { id: "asc" } });
  respuesta.json({ tareas, total: tareas.length });
});

app.post("/tareas", async (peticion, respuesta) => {
  const tarea = await prisma.tarea.create({
    data: { titulo: String(peticion.body?.titulo ?? "") },
  });
  respuesta.status(201).json(tarea);
});

const servidor = app.listen(Number(process.env.PORT ?? 3000));
for (const senal of ["SIGTERM", "SIGINT"]) {
  process.on(senal, async () => {
    servidor.close();
    await prisma.$disconnect();
    process.exit(0);
  });
}
