#!/usr/bin/env node
/**
 * El código, a la vista y sin intermediarios.
 *
 * Una clase de este laboratorio compara frameworks. Si para ver qué escribe
 * cada uno hay que abrir cuatro archivos en cuatro directorios, la comparación
 * está en la cabeza del lector y no en la página: lo que se lee seguido es la
 * prosa, y el código —que es el argumento— queda a un clic de distancia.
 *
 * Este verificador exige dos cosas distintas:
 *
 * 1. **Que el extracto esté.** Cada implementación del elenco aparece en el
 *    README con un enlace a su archivo real y un bloque de código debajo.
 * 2. **Que el extracto sea cierto.** Cada línea del bloque existe *literalmente*
 *    en ese archivo. Un extracto parafraseado —`if (...) errores.push(...)`— es
 *    peor que un enlace: parece código y no lo es, y nada avisa cuando el
 *    archivo cambia y el texto se queda atrás.
 *
 * Se admite elidir: un extracto puede saltarse líneas del original. Lo que no
 * se admite es inventarlas.
 *
 * La deuda pendiente se declara en `classes/_codigo-a-la-vista.json` y se
 * compara en cada ejecución. Una clase que retrocede pone el repositorio en
 * rojo; una clase que se completa y no se borra del registro, también — el
 * registro no puede exagerar la deuda ni ocultarla.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const CLASSES = path.join(root, "classes");
const REGISTRO = path.join(CLASSES, "_codigo-a-la-vista.json");

const manifest = JSON.parse(fs.readFileSync(path.join(CLASSES, "_manifest.json"), "utf8"));

/**
 * Una línea abreviada no se comprueba.
 *
 * Los puntos suspensivos son visibles para quien lee: `if peticion.method ==
 * "GET": ...` anuncia por sí solo que ahí falta algo. Exigir que exista tal cual
 * en el archivo obligaría a pegar la función entera, que es justo lo que
 * convierte un extracto en un volcado ilegible.
 */
const ABREVIADA = /\.\.\.|…/;

/**
 * Comentario final de línea, que se compara aparte.
 *
 * El código es lo que se verifica; el comentario de un extracto puede estar
 * escrito para el lector de la clase. Se acepta la línea si coincide entera o
 * si coincide su parte de código.
 */
const COMENTARIO_FINAL = /\s+(\/\/|#|--).*$/;

/** Directorios que no contienen código escrito por el laboratorio. */
const IGNORADOS = new Set(["node_modules", "vendor", "target", "bin", "obj", "dist", "__pycache__", ".venv"]);

const problemas = [];
const fallar = (donde, mensaje) => problemas.push(`${donde}: ${mensaje}`);

/**
 * Todas las líneas de código de una implementación, normalizadas.
 *
 * Se indexan las líneas de **todos** los archivos fuente del directorio porque
 * una clase puede mostrar el enrutado de un archivo y la plantilla de otro, y
 * el enlace apunta al que ilustra mejor.
 */
function lineasDe(directorio) {
  const lineas = new Set();
  const pila = [directorio];
  while (pila.length) {
    const actual = pila.pop();
    for (const entrada of fs.readdirSync(actual, { withFileTypes: true })) {
      if (IGNORADOS.has(entrada.name)) continue;
      const ruta = path.join(actual, entrada.name);
      if (entrada.isDirectory()) {
        pila.push(ruta);
        continue;
      }
      if (/\.(lock|png|jpg|jpeg|gif|svg|ico|pyc|jar|dll)$/i.test(entrada.name)) continue;
      let contenido;
      try {
        contenido = fs.readFileSync(ruta, "utf8");
      } catch {
        continue;
      }
      for (const linea of contenido.split(/\r?\n/)) {
        const limpia = linea.trim();
        if (!limpia) continue;
        lineas.add(limpia);
        lineas.add(limpia.replace(COMENTARIO_FINAL, "").trim());
      }
    }
  }
  return lineas;
}

/**
 * Extractos del README asociados a una implementación.
 *
 * Se busca un enlace a `implementaciones/<framework>/…` y se toma el primer
 * bloque cercado que venga después, antes del siguiente enlace a otra
 * implementación. Es el formato que usa la clase 011 desde el principio.
 */
function extractosDe(readme, framework) {
  const resultado = [];
  const lineas = readme.split(/\r?\n/);
  let activo = false;
  const enlazadas = new Set();
  let dentro = false;
  let descartar = false;
  let bloque = [];
  const enlaceOtro = /\]\(implementaciones\/([\w.-]+)\//;

  for (const linea of lineas) {
    if (!dentro) {
      // Un encabezado cierra la sección: un bloque solo pertenece a la
      // implementación cuyo enlace aparece en su MISMO apartado. Sin esta
      // línea, un extracto suelto se atribuiría al último enlace visto, que
      // puede estar tres secciones más arriba.
      if (/^#{2,6}\s/.test(linea)) enlazadas.clear();
      for (const enlace of linea.matchAll(new RegExp(enlaceOtro, "g"))) enlazadas.add(enlace[1]);
      // Un extracto pertenece a UNA implementación. Si la sección enumera
      // varias —«Prisma, SQLAlchemy e Hibernate declaran la misma tabla»—, el
      // bloque no es de ninguna en particular: no se verifica contra un archivo
      // concreto y tampoco cuenta como el código de nadie.
      activo = enlazadas.size === 1 && enlazadas.has(framework);
    }
    if (/^\s*```/.test(linea)) {
      if (dentro) {
        if (activo && !descartar && bloque.length) resultado.push(bloque);
        bloque = [];
        dentro = false;
        descartar = false;
      } else {
        const info = linea.replace(/^\s*```/, "").trim().toLowerCase();
        const lenguaje = info.split(/\s+/)[0] ?? "";
        // Los bloques de consola y de datos no son el código de la
        // implementación: son la orden para ejecutarla o su respuesta.
        dentro = !["bash", "sh", "console", "text", "json", "http", "diff", ""].includes(lenguaje);
        // Marca explícita para el contraejemplo: código que la clase enseña
        // precisamente porque NO está en el archivo —la versión que falló, la
        // que se descartó—. Sin la marca, el verificador lo tomaría por un
        // extracto mentiroso; con ella, queda claro para él y para quien lee.
        descartar = info.includes("no-extracto");
      }
      continue;
    }
    if (dentro && activo && !descartar) bloque.push(linea);
  }
  return resultado;
}

// ------------------------------------------------------------------ recorrido

const pendientes = [];
let conCodigo = 0;
let extractosVerificados = 0;
let lineasVerificadas = 0;

for (const parte of manifest.partes) {
  for (const clase of parte.clases) {
    if (clase.estado !== "construida") continue;
    const rel = `classes/${parte.slug}/${clase.slug}`;
    const dir = path.join(CLASSES, parte.slug, clase.slug);
    const dirImpl = path.join(dir, "implementaciones");
    if (!fs.existsSync(dirImpl)) continue;

    const readme = fs.readFileSync(path.join(dir, "README.md"), "utf8");
    const impls = fs
      .readdirSync(dirImpl, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();

    const sinExtracto = [];
    for (const framework of impls) {
      const extractos = extractosDe(readme, framework);
      if (!extractos.length) {
        sinExtracto.push(framework);
        continue;
      }
      const disponibles = lineasDe(path.join(dirImpl, framework));
      for (const bloque of extractos) {
        extractosVerificados++;
        for (const linea of bloque) {
          const limpia = linea.trim();
          if (!limpia || ABREVIADA.test(limpia)) continue;
          lineasVerificadas++;
          const sinComentario = limpia.replace(COMENTARIO_FINAL, "").trim();
          if (!disponibles.has(limpia) && !disponibles.has(sinComentario)) {
            fallar(
              `${rel}/README.md`,
              `el extracto de ${framework} muestra una línea que no está en su código: «${limpia.slice(0, 90)}»`,
            );
          }
        }
      }
    }

    if (sinExtracto.length) {
      pendientes.push({ clase: String(clase.n).padStart(3, "0"), slug: clase.slug, faltan: sinExtracto });
    } else {
      conCodigo++;
    }
  }
}

// ------------------------------------------------------------------- registro

const registro = {
  proposito:
    "Clases construidas cuyo README todavía no muestra el código de todas sus implementaciones. Se reduce clase a clase; verify-excerpts.mjs falla si crece o si no se actualiza al completar una.",
  pendientes: pendientes.length,
  clases: pendientes,
};

const argumentos = process.argv.slice(2);
const serializar = (valor) => `${JSON.stringify(valor, null, 2)}\n`;

if (argumentos.includes("--escribir")) {
  fs.writeFileSync(REGISTRO, serializar(registro));
  console.log(`EXCERPTS_OK: registro actualizado — ${pendientes.length} clases pendientes`);
} else {
  if (!fs.existsSync(REGISTRO)) {
    fallar("classes/_codigo-a-la-vista.json", "no existe; ejecuta `node scripts/verify-excerpts.mjs --escribir`");
  } else {
    const guardado = fs.readFileSync(REGISTRO, "utf8");
    if (guardado !== serializar(registro)) {
      const previas = JSON.parse(guardado).pendientes ?? 0;
      const direccion =
        pendientes.length > previas
          ? `ha CRECIDO de ${previas} a ${pendientes.length}`
          : pendientes.length < previas
            ? `ha bajado de ${previas} a ${pendientes.length} y el registro no se ha actualizado`
            : `ha cambiado de composición (${pendientes.length} clases)`;
      fallar("classes/_codigo-a-la-vista.json", `la deuda ${direccion}`);
    }
  }
}

if (problemas.length) {
  console.error(`EXCERPTS_FAILED: ${problemas.length} incumplimientos`);
  for (const p of problemas) console.error(`  - ${p}`);
  process.exit(1);
}

if (!argumentos.includes("--escribir")) {
  console.log(
    `EXCERPTS_OK: ${extractosVerificados} extractos y ${lineasVerificadas} líneas comprobadas contra su archivo\n` +
      `  · ${conCodigo} clases con el código de todas sus implementaciones a la vista\n` +
      `  · ${pendientes.length} pendientes, declaradas en classes/_codigo-a-la-vista.json`,
  );
}
