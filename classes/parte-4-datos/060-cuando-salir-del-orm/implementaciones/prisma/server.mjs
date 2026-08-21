import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();

const prisma = new PrismaClient();

await prisma.$executeRawUnsafe("DROP TABLE IF EXISTS Tarea");
await prisma.$executeRawUnsafe(
  "CREATE TABLE Tarea (id INTEGER PRIMARY KEY AUTOINCREMENT, proyecto TEXT NOT NULL, " +
    "titulo TEXT NOT NULL, hecha INTEGER NOT NULL DEFAULT 0)",
);

const SEMILLA = [
  { proyecto: "casa", titulo: "comprar pan", hecha: true },
  { proyecto: "casa", titulo: "regar", hecha: false },
  { proyecto: "trabajo", titulo: "informe", hecha: true },
  { proyecto: "viaje", titulo: "reservar", hecha: false },
];

// Cuántas FILAS le llegan al proceso. Es la medida honesta de esta clase: los
// dos informes devuelven lo mismo, y lo que cambia es cuánto viaja por la red y
// cuánto trabajo hace el proceso en lugar del motor.
let filasLeidas = 0;

async function sembrar() {
  await prisma.$executeRawUnsafe("DELETE FROM Tarea");
  for (const fila of SEMILLA) await prisma.tarea.create({ data: fila });
  filasLeidas = 0;
}

await sembrar();

app.get("/reiniciar", async (peticion, respuesta) => {
  await sembrar();
  respuesta.json({ tareas: SEMILLA.length, proyectos: new Set(SEMILLA.map((t) => t.proyecto)).size });
});

app.get("/filas-leidas", (peticion, respuesta) => respuesta.json({ filas_leidas: filasLeidas }));

/**
 * CON EL ORM. Prisma tiene `groupBy`, y aun así aquí se hace a propósito lo que
 * se hace de verdad cuando la agregación no encaja: traerse las filas y agrupar
 * en memoria.
 *
 * Con cuatro tareas da igual. Con cuatro millones, el proceso se queda sin
 * memoria haciendo un trabajo que el motor sabe hacer sin moverlas.
 */
app.get("/informe-orm", async (peticion, respuesta) => {
  filasLeidas = 0;
  const tareas = await prisma.tarea.findMany();
  filasLeidas = tareas.length;

  const porProyecto = new Map();
  for (const tarea of tareas) {
    const acumulado = porProyecto.get(tarea.proyecto) ?? { total: 0, hechas: 0 };
    acumulado.total += 1;
    if (tarea.hecha) acumulado.hechas += 1;
    porProyecto.set(tarea.proyecto, acumulado);
  }

  const filas = [...porProyecto.entries()]
    .map(([proyecto, v]) => ({ proyecto, ...v }))
    .sort((a, b) => a.proyecto.localeCompare(b.proyecto));
  respuesta.json({ filas });
});

/**
 * EN SQL. El motor agrupa y devuelve TRES filas.
 *
 * `$queryRaw` es una plantilla etiquetada: cada `${}` es un marcador, no una
 * interpolación. Salir del ORM no significa salir de las consultas
 * parametrizadas — eso no se negocia nunca.
 */
app.get("/informe-sql", async (peticion, respuesta) => {
  const crudo = peticion.query.minimo;
  const minimo = crudo === undefined ? 1 : Number(crudo);
  // El parámetro se valida ANTES de llegar a la consulta: un marcador solo vale
  // para un valor, así que si esperas un número, compruébalo.
  if (!Number.isInteger(minimo) || minimo < 0) {
    respuesta.status(400).json({ code: "MINIMO_INVALIDO" });
    return;
  }

  filasLeidas = 0;
  const filas = await prisma.$queryRaw`
    SELECT proyecto,
           COUNT(*)                        AS total,
           SUM(CASE WHEN hecha THEN 1 ELSE 0 END) AS hechas
      FROM Tarea
     GROUP BY proyecto
    HAVING COUNT(*) >= ${minimo}
     ORDER BY proyecto`;
  filasLeidas = filas.length;

  respuesta.json({
    filas: filas.map((f) => ({
      proyecto: f.proyecto,
      total: Number(f.total),
      hechas: Number(f.hechas),
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
