import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

// Se parte de dos tareas. La base se recrea en cada arranque para que el
// contrato mida siempre desde el mismo sitio.
async function sembrar() {
  await prisma.$executeRawUnsafe("DELETE FROM Tarea");
  await prisma.$executeRawUnsafe("DELETE FROM sqlite_sequence WHERE name='Tarea'");
  await prisma.tarea.create({ data: { titulo: "preparar informe" } });
  await prisma.tarea.create({ data: { titulo: "revisar contrato" } });
}
await sembrar();

// El caso normal: `create` construye una consulta PARAMETRIZADA. El título
// viaja como valor, nunca concatenado a la sentencia — y por eso
// `'); DROP TABLE tareas; --` termina siendo un título de tarea, no un
// comando. Prisma no ofrece una vía de concatenar sin querer: su API no
// acepta SQL en los métodos de modelo.
app.post("/tareas", async (peticion, respuesta) => {
  const titulo = String(peticion.body?.titulo ?? "");
  const creada = await prisma.tarea.create({ data: { titulo } });
  respuesta.status(201).json({ id: String(creada.id), titulo: creada.titulo });
});

app.get("/tareas", async (peticion, respuesta) => {
  const titulo = peticion.query.titulo;
  const filas =
    titulo === undefined
      ? await prisma.tarea.findMany({ orderBy: { id: "asc" } })
      // `where: { titulo }` es una igualdad parametrizada: `' OR '1'='1`
      // se busca como ese texto exacto, que no existe → total 0.
      : await prisma.tarea.findMany({ where: { titulo: String(titulo) }, orderBy: { id: "asc" } });
  respuesta.json({ total: filas.length, tareas: filas.map((t) => ({ id: String(t.id), titulo: t.titulo })) });
});

app.get("/tareas/:id", async (peticion, respuesta) => {
  const fila = await prisma.tarea.findUnique({ where: { id: Number(peticion.params.id) } });
  if (!fila) return respuesta.status(404).json({ error: "no-encontrada" });
  respuesta.json({ id: String(fila.id), titulo: fila.titulo });
});

app.listen(Number(process.env.PORT ?? 3000));
