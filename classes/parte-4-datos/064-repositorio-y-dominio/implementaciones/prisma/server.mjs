import { readFile } from "node:fs/promises";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { Proyecto, ReglaRota } from "./dominio.mjs";
import { RepositorioEnMemoria, RepositorioPrisma } from "./repositorios.mjs";

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

await prisma.$executeRawUnsafe("DROP TABLE IF EXISTS Tarea");
await prisma.$executeRawUnsafe("DROP TABLE IF EXISTS Proyecto");
await prisma.$executeRawUnsafe(
  "CREATE TABLE Proyecto (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, " +
    "cerrado INTEGER NOT NULL DEFAULT 0)",
);
await prisma.$executeRawUnsafe(
  "CREATE TABLE Tarea (id INTEGER PRIMARY KEY, titulo TEXT NOT NULL, " +
    "hecha INTEGER NOT NULL DEFAULT 0, " +
    "proyectoId INTEGER NOT NULL REFERENCES Proyecto(id) ON DELETE CASCADE)",
);

const repositorio = new RepositorioPrisma(prisma);

function responderRegla(error, respuesta) {
  if (!(error instanceof ReglaRota)) throw error;
  respuesta.status(error.codigo === "NO_EXISTE" ? 404 : 409).json({ code: error.codigo });
}

/**
 * LA COMPROBACIÓN QUE HACE HONESTA A ESTA CLASE.
 *
 * Se lee el archivo del dominio y se miran sus IMPORTS. No cualquier mención: el
 * propio comentario de ese archivo dice «no importa Prisma», y buscar la palabra
 * suelta daría un falso positivo. Lo que importa es DE QUÉ DEPENDE el módulo, no
 * de qué habla.
 *
 * Prometer un dominio limpio en un README no cuesta nada. Comprobarlo, sí.
 */
app.get("/dominio", async (peticion, respuesta) => {
  const texto = await readFile(new URL("./dominio.mjs", import.meta.url), "utf8");
  const importados = texto
    .split(String.fromCharCode(10))
    .filter((linea) => linea.startsWith("import "));
  const prohibidas = ["prisma", "express"];
  respuesta.json({
    menciona_orm: importados.some((linea) =>
      prohibidas.some((palabra) => linea.toLowerCase().includes(palabra)),
    ),
    importa: importados,
    reglas: (texto.match(/REGLA \d/g) ?? []).length,
  });
});

app.post("/proyectos", async (peticion, respuesta) => {
  const id = await repositorio.siguienteIdProyecto();
  const proyecto = new Proyecto(id, String(peticion.body?.nombre ?? ""));
  await repositorio.guardar(proyecto);
  respuesta.status(201).json(proyecto.salida());
});

app.post("/proyectos/:id/tareas", async (peticion, respuesta) => {
  const proyecto = await repositorio.porId(Number(peticion.params.id));
  if (!proyecto) {
    respuesta.status(404).json({ code: "NO_EXISTE" });
    return;
  }
  try {
    // La regla se aplica EN EL DOMINIO. El manejador no sabe cuáles son ni en
    // qué orden se comprueban: solo traduce el fallo a un código HTTP.
    proyecto.anadirTarea(await repositorio.siguienteIdTarea(), String(peticion.body?.titulo ?? ""));
  } catch (error) {
    responderRegla(error, respuesta);
    return;
  }
  await repositorio.guardar(proyecto);
  respuesta.status(201).json(proyecto.salida());
});

app.post("/proyectos/:id/tareas/:tarea/terminar", async (peticion, respuesta) => {
  const proyecto = await repositorio.porId(Number(peticion.params.id));
  if (!proyecto) {
    respuesta.status(404).json({ code: "NO_EXISTE" });
    return;
  }
  try {
    proyecto.terminarTarea(Number(peticion.params.tarea));
  } catch (error) {
    responderRegla(error, respuesta);
    return;
  }
  await repositorio.guardar(proyecto);
  respuesta.json(proyecto.salida());
});

app.post("/proyectos/:id/cerrar", async (peticion, respuesta) => {
  const proyecto = await repositorio.porId(Number(peticion.params.id));
  if (!proyecto) {
    respuesta.status(404).json({ code: "NO_EXISTE" });
    return;
  }
  try {
    proyecto.cerrar();
  } catch (error) {
    responderRegla(error, respuesta);
    return;
  }
  await repositorio.guardar(proyecto);
  respuesta.json(proyecto.salida());
});

app.get("/proyectos/:id", async (peticion, respuesta) => {
  const proyecto = await repositorio.porId(Number(peticion.params.id));
  if (!proyecto) {
    respuesta.status(404).json({ code: "NO_EXISTE" });
    return;
  }
  respuesta.json(proyecto.salida());
});

/**
 * LAS MISMAS TRES REGLAS, CONTRA EL REPOSITORIO EN MEMORIA.
 *
 * Sin base de datos, sin esquema, sin limpiar tablas. Es el argumento entero de
 * esta clase, y aquí se ejecuta de verdad en lugar de afirmarse.
 */
async function pruebasDelDominio() {
  const memoria = new RepositorioEnMemoria();
  const resultados = [];

  async function comprobar(nombre, funcion, codigoEsperado) {
    try {
      await funcion();
      resultados.push({ nombre, paso: false, motivo: "no lanzó" });
    } catch (error) {
      resultados.push({ nombre, paso: error.codigo === codigoEsperado, motivo: error.codigo });
    }
  }

  const uno = new Proyecto(await memoria.siguienteIdProyecto(), "pruebas");
  uno.anadirTarea(await memoria.siguienteIdTarea(), "pendiente");
  await memoria.guardar(uno);
  await comprobar("no se cierra con pendientes", () => uno.cerrar(), "QUEDAN_PENDIENTES");

  const dos = new Proyecto(await memoria.siguienteIdProyecto(), "cerrado");
  dos.cerrar();
  await comprobar(
    "no se añade a uno cerrado",
    async () => dos.anadirTarea(await memoria.siguienteIdTarea(), "tarde"),
    "PROYECTO_CERRADO",
  );

  const tres = new Proyecto(await memoria.siguienteIdProyecto(), "repetidos");
  tres.anadirTarea(await memoria.siguienteIdTarea(), "misma");
  await comprobar(
    "no se repite el título",
    async () => tres.anadirTarea(await memoria.siguienteIdTarea(), "misma"),
    "TITULO_REPETIDO",
  );

  return resultados;
}

app.get("/pruebas-del-dominio", async (peticion, respuesta) => {
  const resultados = await pruebasDelDominio();
  respuesta.json({
    ejecutadas: resultados.length,
    pasadas: resultados.filter((r) => r.paso).length,
    uso_base_de_datos: false,
    detalle: resultados,
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
