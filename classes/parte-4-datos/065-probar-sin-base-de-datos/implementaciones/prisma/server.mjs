import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();

/**
 * TRES FORMAS DE PROBAR LO MISMO.
 *
 * - `doble`: un objeto en memoria que imita al repositorio. No hay motor.
 * - `en-memoria`: una base de VERDAD, creada para las pruebas y desechable.
 * - `real`: la misma base que usa el servicio.
 *
 * Las cuatro pruebas son idénticas en las tres. Lo que cambia es qué detectan —
 * y una de ellas solo pasa cuando hay un motor detrás.
 */

const prisma = new PrismaClient();

// La base "en memoria" de SQLite: existe mientras dure la conexión y desaparece
// después. Es lo más parecido a H2 en el mundo de Node.
const pruebas = new PrismaClient({
  datasources: { db: { url: "file:pruebas.db" } },
});

async function crearEsquema(cliente) {
  await cliente.$executeRawUnsafe("DROP TABLE IF EXISTS Tarea");
  await cliente.$executeRawUnsafe(
    "CREATE TABLE Tarea (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT NOT NULL)",
  );
  // LA RESTRICCIÓN QUE DECIDE LA CLASE. Vive en la base, no en el código.
  await cliente.$executeRawUnsafe("CREATE UNIQUE INDEX Tarea_titulo_key ON Tarea(titulo)");
}

await crearEsquema(prisma);
await crearEsquema(pruebas);

/** El repositorio de verdad: delega en el motor y deja que él aplique sus reglas. */
class RepositorioPrisma {
  constructor(cliente) {
    this.cliente = cliente;
  }

  async limpiar() {
    await this.cliente.$executeRawUnsafe("DELETE FROM Tarea");
  }

  async crear(titulo) {
    return this.cliente.tarea.create({ data: { titulo } });
  }

  async porId(id) {
    return this.cliente.tarea.findUnique({ where: { id } });
  }

  async borrar(id) {
    await this.cliente.tarea.delete({ where: { id } });
  }
}

/**
 * EL DOBLE.
 *
 * Hace lo mismo con un `Map`, y no comprueba la unicidad — igual que el
 * repositorio de verdad, que tampoco la comprueba: la aplica la base.
 *
 * Ese detalle es la clase entera. El doble no es incorrecto: es INCOMPLETO, y
 * su hueco tiene exactamente la forma de lo que el motor hacía por ti.
 */
class DobleEnMemoria {
  constructor() {
    this.filas = new Map();
    this.siguiente = 1;
  }

  async limpiar() {
    this.filas.clear();
    this.siguiente = 1;
  }

  async crear(titulo) {
    const tarea = { id: this.siguiente++, titulo };
    this.filas.set(tarea.id, tarea);
    return tarea;
  }

  async porId(id) {
    return this.filas.get(id) ?? null;
  }

  async borrar(id) {
    this.filas.delete(id);
  }
}

/** LAS CUATRO PRUEBAS. Las mismas para las tres estrategias, sin una línea distinta. */
const PRUEBAS = [
  {
    nombre: "se crea y devuelve un identificador",
    async ejecutar(repositorio) {
      const tarea = await repositorio.crear("comprar pan");
      return typeof tarea.id === "number" && tarea.id > 0;
    },
  },
  {
    nombre: "se lee de vuelta lo que se escribió",
    async ejecutar(repositorio) {
      const creada = await repositorio.crear("regar");
      const leida = await repositorio.porId(creada.id);
      return leida?.titulo === "regar";
    },
  },
  {
    nombre: "lo borrado deja de estar",
    async ejecutar(repositorio) {
      const creada = await repositorio.crear("llamar");
      await repositorio.borrar(creada.id);
      return (await repositorio.porId(creada.id)) === null;
    },
  },
  {
    nombre: "la restricción de unicidad la aplica la base, no el código",
    async ejecutar(repositorio) {
      await repositorio.crear("repetida");
      try {
        await repositorio.crear("repetida");
        return false; // no protestó: el hueco del doble
      } catch {
        return true;
      }
    },
  },
];

async function ejecutar(estrategia) {
  const repositorio =
    estrategia === "doble"
      ? new DobleEnMemoria()
      : new RepositorioPrisma(estrategia === "en-memoria" ? pruebas : prisma);

  const resultados = [];
  for (const prueba of PRUEBAS) {
    await repositorio.limpiar();
    let paso = false;
    try {
      paso = await prueba.ejecutar(repositorio);
    } catch {
      paso = false;
    }
    resultados.push({ nombre: prueba.nombre, paso });
  }
  await repositorio.limpiar();
  return resultados;
}

const ESTRATEGIAS = ["doble", "en-memoria", "real"];

app.get("/estrategias", (peticion, respuesta) =>
  respuesta.json({ estrategias: ESTRATEGIAS, pruebas_por_estrategia: PRUEBAS.length }),
);

app.get("/probar", async (peticion, respuesta) => {
  const estrategia = String(peticion.query.estrategia ?? "");
  if (!ESTRATEGIAS.includes(estrategia)) {
    respuesta.status(400).json({ code: "ESTRATEGIA_DESCONOCIDA" });
    return;
  }
  const resultados = await ejecutar(estrategia);
  respuesta.json({
    estrategia,
    ejecutadas: resultados.length,
    pasadas: resultados.filter((r) => r.paso).length,
    usa_motor: estrategia !== "doble",
    detalle: resultados,
  });
});

/** DÓNDE ESTÁ EL HUECO, exactamente. */
app.get("/que-se-escapa", async (peticion, respuesta) => {
  const porEstrategia = {};
  for (const estrategia of ESTRATEGIAS) {
    porEstrategia[estrategia] = await ejecutar(estrategia);
  }
  const indice = PRUEBAS.length - 1;
  respuesta.json({
    prueba: PRUEBAS[indice].nombre,
    doble: porEstrategia["doble"][indice].paso,
    en_memoria: porEstrategia["en-memoria"][indice].paso,
    real: porEstrategia["real"][indice].paso,
  });
});

/** Y POR QUÉ SE USA IGUALMENTE EL DOBLE: porque es mucho más rápido. */
app.get("/comparacion", async (peticion, respuesta) => {
  const tiempos = {};
  for (const estrategia of ESTRATEGIAS) {
    const inicio = process.hrtime.bigint();
    for (let i = 0; i < 20; i++) await ejecutar(estrategia);
    tiempos[estrategia] = Number((process.hrtime.bigint() - inicio) / 1_000_000n);
  }
  const minimo = Math.min(...Object.values(tiempos));
  respuesta.json({
    tiempos_ms: tiempos,
    repeticiones: 20,
    doble_es_el_mas_rapido: tiempos["doble"] === minimo,
  });
});

const servidor = app.listen(Number(process.env.PORT ?? 3000));
for (const senal of ["SIGTERM", "SIGINT"]) {
  process.on(senal, async () => {
    servidor.close();
    await prisma.$disconnect();
    await pruebas.$disconnect();
    process.exit(0);
  });
}
