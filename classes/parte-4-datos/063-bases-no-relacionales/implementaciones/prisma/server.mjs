import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());

const prisma = new PrismaClient({ log: [{ emit: "event", level: "query" }] });

let consultas = 0;
prisma.$on("query", () => {
  consultas += 1;
});

await prisma.$executeRawUnsafe("DROP TABLE IF EXISTS Documento");
await prisma.$executeRawUnsafe(
  "CREATE TABLE Documento (id INTEGER PRIMARY KEY AUTOINCREMENT, documento TEXT NOT NULL)",
);

/**
 * SQLite NO TIENE TIPO JSON.
 *
 * Su soporte —la extensión JSON1— son funciones que operan sobre TEXTO:
 * `json_extract`, `json_each`, `json_set`. El documento se guarda como una
 * cadena y el motor sabe mirar dentro cuando se lo pides.
 *
 * Es una diferencia real con PostgreSQL, que sí tiene un tipo `jsonb` con su
 * propia representación binaria y sus propios índices.
 */

app.post("/tareas", async (peticion, respuesta) => {
  const cuerpo = peticion.body ?? {};
  const creado = await prisma.documento.create({
    data: { documento: JSON.stringify(cuerpo) },
  });
  respuesta.status(201).json({ id: creado.id, ...cuerpo });
});

/** UNA lectura. Sin uniones, porque no hay nada que unir. */
app.get("/tareas/:id", async (peticion, respuesta) => {
  consultas = 0;
  const fila = await prisma.documento.findUnique({
    where: { id: Number(peticion.params.id) },
  });
  if (!fila) {
    respuesta.status(404).json({ code: "NO_EXISTE" });
    return;
  }
  respuesta.json({ id: fila.id, ...JSON.parse(fila.documento) });
});

app.get("/consultas", (peticion, respuesta) => respuesta.json({ consultas }));

/**
 * EL ESQUEMA. Dos columnas, y ninguna se llama «titulo».
 *
 * `campos_declarados` es cero a propósito: la base no sabe qué campos tiene una
 * tarea. Eso no significa que no haya esquema — significa que **el esquema está
 * en el código** y que nadie lo hace cumplir.
 */
app.get("/esquema", async (peticion, respuesta) => {
  const columnas = await prisma.$queryRawUnsafe("PRAGMA table_info('Documento')");
  respuesta.json({
    columnas: columnas.map((c) => c.name).sort(),
    campos_declarados: 0,
  });
});

/**
 * BUSCAR DENTRO DEL DOCUMENTO.
 *
 * `json_each` convierte un array del documento en filas, y a partir de ahí es
 * SQL corriente. Sin esa función habría que traerse todos los documentos y
 * filtrarlos en memoria — que es exactamente el problema de la clase 060.
 */
app.get("/por-etiqueta", async (peticion, respuesta) => {
  const nombre = String(peticion.query.nombre ?? "");
  const filas = await prisma.$queryRaw`
    SELECT DISTINCT d.id AS id
      FROM Documento d, json_each(d.documento, '$.etiquetas') e
     WHERE e.value = ${nombre}
     ORDER BY d.id`;
  const ids = filas.map((f) => Number(f.id));
  respuesta.json({ ids, total: ids.length });
});

/**
 * EL COSTE DE INCRUSTAR.
 *
 * El autor está dentro de cada tarea. Es lo que hace que leer una tarea sea una
 * sola operación — y también lo que obliga a tocar TODOS los documentos para
 * cambiarle el nombre.
 *
 * En el modelo relacional sería un `UPDATE autores SET nombre = ...` sobre una
 * fila. Aquí no hay una fila: hay tantas copias como documentos.
 */
app.post("/renombrar-autor", async (peticion, respuesta) => {
  const { correo = "", nombre = "" } = peticion.body ?? {};
  const filas = await prisma.documento.findMany();

  let tocados = 0;
  for (const fila of filas) {
    const documento = JSON.parse(fila.documento);
    if (documento.autor?.correo !== correo) continue;
    documento.autor.nombre = nombre;
    await prisma.documento.update({
      where: { id: fila.id },
      data: { documento: JSON.stringify(documento) },
    });
    tocados += 1;
  }

  respuesta.json({ documentos_tocados: tocados });
});

const servidor = app.listen(Number(process.env.PORT ?? 3000));
for (const senal of ["SIGTERM", "SIGINT"]) {
  process.on(senal, async () => {
    servidor.close();
    await prisma.$disconnect();
    process.exit(0);
  });
}
