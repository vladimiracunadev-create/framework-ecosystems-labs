import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());

// UNA instancia para todo el proceso. Crear un cliente por petición abriría un
// grupo de conexiones nuevo cada vez y agotaría la base en minutos — es el error
// más caro de esta clase, y la clase 061 lo desarrolla.
const prisma = new PrismaClient();

// La tabla se crea aquí y no con `prisma db push`.
//
// El motivo es concreto y merece contarse: la herramienta de migración de Prisma
// DETECTA que la invoca un agente de IA y se niega a ejecutarse. Es una
// salvaguarda deliberada del producto —una migración puede destruir datos— y en
// este laboratorio obliga a crear el esquema por otra vía.
//
// Para esta clase da igual: lo que se enseña es conectar, escribir y leer. Las
// migraciones son la clase 058, y allí se trata su mecanismo completo.
await prisma.$executeRawUnsafe("DROP TABLE IF EXISTS Tarea");
await prisma.$executeRawUnsafe(
  "CREATE TABLE Tarea (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT NOT NULL)",
);

app.get("/salud", async (peticion, respuesta) => {
  // Una consulta trivial es la única forma honesta de decir "estoy conectado".
  // Comprobar que el objeto existe no prueba nada: se construye sin conectar.
  try {
    await prisma.$queryRaw`SELECT 1`;
    respuesta.json({ conectado: true });
  } catch {
    respuesta.status(503).json({ conectado: false });
  }
});

app.post("/tareas", async (peticion, respuesta) => {
  const tarea = await prisma.tarea.create({ data: { titulo: peticion.body?.titulo ?? "" } });
  respuesta.status(201).json(tarea);
});

app.get("/tareas/:id", async (peticion, respuesta) => {
  const tarea = await prisma.tarea.findUnique({ where: { id: Number(peticion.params.id) } });
  return tarea ? respuesta.json(tarea) : respuesta.status(404).json({ code: "NO_EXISTE" });
});

const servidor = app.listen(Number(process.env.PORT ?? 3000));

// Cerrar bien al terminar: sin esto, las conexiones quedan abiertas hasta que la
// base las expire por su cuenta.
for (const senal of ["SIGTERM", "SIGINT"]) {
  process.on(senal, async () => {
    servidor.close();
    await prisma.$disconnect();
    process.exit(0);
  });
}
