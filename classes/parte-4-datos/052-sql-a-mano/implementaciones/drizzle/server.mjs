import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { sql } from "drizzle-orm";
import express from "express";

const app = express();
app.use(express.json());

const cliente = createClient({ url: "file:datos.db" });
const db = drizzle(cliente);

await db.run(sql`DROP TABLE IF EXISTS tareas`);
await db.run(sql`CREATE TABLE tareas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL
)`);

/**
 * La plantilla `sql` NO es una plantilla de texto.
 *
 * Cada `${...}` se convierte en un MARCADOR de la consulta y el valor viaja
 * aparte, por otro canal. Por eso `'; DROP TABLE tareas; --` acaba siendo un
 * título de tarea y no una orden: cuando la base recibe la consulta, ya está
 * decidido qué parte es código.
 *
 * Concatenar con `+` haría exactamente lo contrario, y por eso Drizzle exige la
 * plantilla en lugar de aceptar una cadena.
 */
app.post("/tareas", async (peticion, respuesta) => {
  const titulo = String(peticion.body?.titulo ?? "");
  const { rows } = await db.run(
    sql`INSERT INTO tareas (titulo) VALUES (${titulo}) RETURNING id, titulo`,
  );
  respuesta.status(201).json({ id: Number(rows[0].id), titulo: rows[0].titulo });
});

app.get("/tareas", async (peticion, respuesta) => {
  const titulo = peticion.query.titulo;
  const consulta =
    titulo === undefined
      ? sql`SELECT id, titulo FROM tareas ORDER BY id`
      : sql`SELECT id, titulo FROM tareas WHERE titulo = ${String(titulo)} ORDER BY id`;
  const { rows } = await db.run(consulta);
  const tareas = rows.map((f) => ({ id: Number(f.id), titulo: f.titulo }));
  respuesta.json({ tareas, total: tareas.length });
});

app.get("/tareas/:id", async (peticion, respuesta) => {
  const { rows } = await db.run(
    sql`SELECT id, titulo FROM tareas WHERE id = ${Number(peticion.params.id)}`,
  );
  if (rows.length === 0) {
    respuesta.status(404).json({ code: "NO_EXISTE" });
    return;
  }
  respuesta.json({ id: Number(rows[0].id), titulo: rows[0].titulo });
});

const servidor = app.listen(Number(process.env.PORT ?? 3000));
for (const senal of ["SIGTERM", "SIGINT"]) {
  process.on(senal, () => {
    servidor.close();
    cliente.close();
    process.exit(0);
  });
}
