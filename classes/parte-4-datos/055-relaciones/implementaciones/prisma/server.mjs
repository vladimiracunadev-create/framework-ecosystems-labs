import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());
const prisma = new PrismaClient();

// Esquema creado a mano: la herramienta de migración de Prisma se niega a
// ejecutarse cuando la invoca un agente de IA (clase 051).
//
// `ON DELETE CASCADE` no es un detalle: sin él, borrar una tarea deja etiquetas
// apuntando a una fila que ya no existe. La base lo puede garantizar; el código
// de la aplicación, solo si nadie se olvida.
await prisma.$executeRawUnsafe("DROP TABLE IF EXISTS Etiqueta");
await prisma.$executeRawUnsafe("DROP TABLE IF EXISTS Tarea");
await prisma.$executeRawUnsafe(
  "CREATE TABLE Tarea (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT NOT NULL)",
);
await prisma.$executeRawUnsafe(
  "CREATE TABLE Etiqueta (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, " +
    "tareaId INTEGER NOT NULL REFERENCES Tarea(id) ON DELETE CASCADE)",
);
await prisma.$executeRawUnsafe("PRAGMA foreign_keys = ON");

app.post("/tareas", async (peticion, respuesta) => {
  // Escritura anidada: la tarea y sus etiquetas en UNA sola operación, y el ORM
  // se encarga del orden y de la clave ajena.
  const tarea = await prisma.tarea.create({
    data: {
      titulo: peticion.body?.titulo ?? "",
      etiquetas: { create: (peticion.body?.etiquetas ?? []).map((nombre) => ({ nombre })) },
    },
    include: { etiquetas: true },
  });
  respuesta.status(201).json(salida(tarea));
});

app.get("/tareas/:id", async (peticion, respuesta) => {
  // `include` es la carga ANTICIPADA: una consulta que trae la tarea con sus
  // etiquetas. Sin él, `tarea.etiquetas` no existe — Prisma no carga sola la
  // relación, y esa decisión evita el problema de la clase 056 por diseño.
  const tarea = await prisma.tarea.findUnique({
    where: { id: Number(peticion.params.id) },
    include: { etiquetas: true },
  });
  return tarea ? respuesta.json(salida(tarea)) : respuesta.status(404).json({ code: "NO_EXISTE" });
});

app.delete("/tareas/:id", async (peticion, respuesta) => {
  try {
    await prisma.tarea.delete({ where: { id: Number(peticion.params.id) } });
    respuesta.status(204).end();
  } catch {
    respuesta.status(404).json({ code: "NO_EXISTE" });
  }
});

app.get("/etiquetas", async (peticion, respuesta) => {
  respuesta.json({ total: await prisma.etiqueta.count() });
});

function salida(tarea) {
  return {
    id: tarea.id,
    titulo: tarea.titulo,
    etiquetas: tarea.etiquetas.map((e) => e.nombre).sort(),
  };
}

const servidor = app.listen(Number(process.env.PORT ?? 3000));
for (const senal of ["SIGTERM", "SIGINT"]) {
  process.on(senal, async () => {
    servidor.close();
    await prisma.$disconnect();
    process.exit(0);
  });
}
