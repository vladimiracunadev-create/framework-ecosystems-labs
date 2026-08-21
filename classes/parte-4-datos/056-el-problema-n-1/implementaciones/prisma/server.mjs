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

const TITULOS = ["una", "dos", "tres", "cuatro", "cinco", "seis"];

/** Cada tarea con dos etiquetas. El número de tareas es el parámetro del experimento. */
async function sembrar(cuantas) {
  await prisma.$executeRawUnsafe("DELETE FROM Etiqueta");
  await prisma.$executeRawUnsafe("DELETE FROM Tarea");
  await prisma.$executeRawUnsafe("DELETE FROM sqlite_sequence WHERE name IN ('Tarea','Etiqueta')");
  for (const titulo of TITULOS.slice(0, cuantas)) {
    await prisma.tarea.create({
      data: { titulo, etiquetas: { create: [{ nombre: `${titulo}-a` }, { nombre: `${titulo}-b` }] } },
    });
  }
  consultas = 0;
  return cuantas;
}

/**
 * LA FORMA INGENUA. En Prisma la relación no viene por omisión, así que
 * reproducir el N+1 exige pedirla explícitamente una por una — que es
 * exactamente lo que hace un bucle que llama a un servicio por elemento.
 *
 * Una consulta para las tareas, más una por cada tarea: 1 + N.
 */
async function ingenua() {
  const tareas = await prisma.tarea.findMany({ orderBy: { id: "asc" } });
  const resultado = [];
  for (const tarea of tareas) {
    const etiquetas = await prisma.etiqueta.findMany({ where: { tareaId: tarea.id } });
    resultado.push({
      id: tarea.id,
      titulo: tarea.titulo,
      etiquetas: etiquetas.map((e) => e.nombre).sort(),
    });
  }
  return resultado;
}

/** LA FORMA ANTICIPADA. `include` trae todo en una sola operación. */
async function anticipada() {
  const tareas = await prisma.tarea.findMany({
    include: { etiquetas: true },
    orderBy: { id: "asc" },
  });
  return tareas.map((t) => ({
    id: t.id,
    titulo: t.titulo,
    etiquetas: t.etiquetas.map((e) => e.nombre).sort(),
  }));
}

const RUTAS = { "tareas-n1": ingenua, "tareas-anticipada": anticipada };

await sembrar(3);

app.get("/reiniciar", async (peticion, respuesta) => {
  const tareas = await sembrar(3);
  respuesta.json({ consultas, tareas });
});

app.get("/consultas", (peticion, respuesta) => respuesta.json({ consultas }));

app.get("/tareas-n1", async (peticion, respuesta) =>
  respuesta.json({ tareas: await ingenua() }),
);

app.get("/tareas-anticipada", async (peticion, respuesta) =>
  respuesta.json({ tareas: await anticipada() }),
);

/**
 * LO ÚNICO QUE DISTINGUE EL PROBLEMA.
 *
 * Un número absoluto de consultas no dice nada: la carga anticipada cuesta una
 * consulta con unión y dos con segunda consulta, y las dos están bien. Lo que
 * importa es si ese número CRECE con el número de filas.
 *
 * Aquí se mide: se ejecuta la misma ruta con tres tareas y con seis, y se resta.
 */
app.get("/crecimiento", async (peticion, respuesta) => {
  const funcion = RUTAS[String(peticion.query.ruta ?? "")];
  if (!funcion) {
    respuesta.status(404).json({ code: "RUTA_DESCONOCIDA" });
    return;
  }

  await sembrar(3);
  await funcion();
  const con3 = consultas;

  await sembrar(6);
  await funcion();
  const con6 = consultas;

  await sembrar(3);
  respuesta.json({ con_3: con3, con_6: con6, crecimiento: con6 - con3 });
});

const servidor = app.listen(Number(process.env.PORT ?? 3000));
for (const senal of ["SIGTERM", "SIGINT"]) {
  process.on(senal, async () => {
    servidor.close();
    await prisma.$disconnect();
    process.exit(0);
  });
}
