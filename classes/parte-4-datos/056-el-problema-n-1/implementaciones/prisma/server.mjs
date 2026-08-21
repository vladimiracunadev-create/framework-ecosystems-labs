import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();

// El cliente emite un evento por CONSULTA. Contarlas es la única forma honesta
// de enseñar esta clase: el problema N+1 no se ve en el resultado —los datos son
// correctos— sino en cuántas consultas costaron.
const prisma = new PrismaClient({ log: [{ emit: "event", level: "query" }] });

let consultas = 0;
prisma.$on("query", () => {
  consultas += 1;
});

await prisma.$executeRawUnsafe("DROP TABLE IF EXISTS Etiqueta");
await prisma.$executeRawUnsafe("DROP TABLE IF EXISTS Tarea");
await prisma.$executeRawUnsafe(
  "CREATE TABLE Tarea (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT NOT NULL)",
);
await prisma.$executeRawUnsafe(
  "CREATE TABLE Etiqueta (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, " +
    "tareaId INTEGER NOT NULL REFERENCES Tarea(id) ON DELETE CASCADE)",
);

// Tres tareas con dos etiquetas cada una.
for (const titulo of ["una", "dos", "tres"]) {
  await prisma.tarea.create({
    data: { titulo, etiquetas: { create: [{ nombre: `${titulo}-a` }, { nombre: `${titulo}-b` }] } },
  });
}

app.get("/reiniciar", (peticion, respuesta) => {
  consultas = 0;
  respuesta.json({ ok: true });
});

app.get("/consultas", (peticion, respuesta) => respuesta.json({ consultas }));

/**
 * LA FORMA INGENUA. En Prisma la relación no viene por omisión, así que
 * reproducir el N+1 exige pedirla explícitamente una por una — que es
 * exactamente lo que hace un bucle que llama a un servicio por elemento.
 *
 * Una consulta para las tareas, más una por cada tarea: 1 + N.
 */
app.get("/tareas-n1", async (peticion, respuesta) => {
  const tareas = await prisma.tarea.findMany();
  const resultado = [];
  for (const tarea of tareas) {
    const etiquetas = await prisma.etiqueta.findMany({ where: { tareaId: tarea.id } });
    resultado.push({ id: tarea.id, titulo: tarea.titulo, etiquetas: etiquetas.map((e) => e.nombre) });
  }
  respuesta.json({ tareas: resultado });
});

/** LA FORMA ANTICIPADA. `include` trae todo en una sola operación. */
app.get("/tareas-anticipada", async (peticion, respuesta) => {
  const tareas = await prisma.tarea.findMany({ include: { etiquetas: true } });
  respuesta.json({
    tareas: tareas.map((t) => ({
      id: t.id,
      titulo: t.titulo,
      etiquetas: t.etiquetas.map((e) => e.nombre),
    })),
  });
});

const servidor = app.listen(Number(process.env.PORT ?? 3000));
for (const senal of ["SIGTERM", "SIGINT"]) {
  process.on(senal, async () => {
    servidor.close();
    await prisma.$disconnect();
    process.exit(0);
  });
}
