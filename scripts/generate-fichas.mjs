#!/usr/bin/env node
/**
 * La ficha técnica de cada implementación, dentro de su clase.
 *
 * Quien llega por primera vez a una clase tiene cuatro preguntas antes de poder
 * leer una línea de código: **qué es esto, qué versión estoy mirando, qué
 * necesito instalar y qué hace cada archivo**. Este generador las contesta en la
 * propia clase, y las contesta desde los archivos reales — el catálogo, el
 * `ejecutar.json` y el manifiesto de dependencias de cada ecosistema.
 *
 * Se genera y no se escribe a mano por la razón de siempre: una versión escrita
 * en prosa envejece en cuanto alguien toca el `package.json`, y nadie se entera.
 *
 *   node scripts/generate-fichas.mjs           regenera todas las clases construidas
 *   node scripts/generate-fichas.mjs --check   falla si alguna está desactualizada
 *
 * El bloque se inserta entre marcas HTML. Si una clase no las tiene, se añaden
 * justo antes de la sección de implementaciones — el sitio donde hacen falta.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { inventarioDe } from "./lib/inventario.mjs";

const root = path.resolve(import.meta.dirname, "..");
const CLASSES = path.join(root, "classes");

const INICIO = "<!-- generado: fichas -->";
const FIN = "<!-- fin generado: fichas -->";

const manifest = JSON.parse(fs.readFileSync(path.join(CLASSES, "_manifest.json"), "utf8"));
const catalogoCrudo = JSON.parse(fs.readFileSync(path.join(root, "catalog/frameworks.json"), "utf8"));
const catalogo = new Map((catalogoCrudo.entries ?? catalogoCrudo).map((e) => [e.id, e]));

/**
 * Los conceptos que cada clase define, sacados del glosario.
 *
 * Así la clase y el glosario no pueden discrepar: la palabra se define una vez,
 * en `glosario/conceptos.json`, y aparece en la clase que la enseña sin que
 * nadie tenga que copiarla.
 */
const glosario = JSON.parse(fs.readFileSync(path.join(root, "glosario/conceptos.json"), "utf8"));
const conceptosPorClase = new Map();
for (const concepto of glosario.conceptos) {
  if (concepto.clase === undefined) continue;
  if (!conceptosPorClase.has(concepto.clase)) conceptosPorClase.set(concepto.clase, []);
  conceptosPorClase.get(concepto.clase).push(concepto);
}

/** El ancla que GitHub genera para un encabezado del glosario. */
function ancla(texto) {
  // El mismo criterio que GitHub: minúsculas, fuera la puntuación, los espacios
  // a guiones — y los acentos SE CONSERVAN. Quitarlos produciría enlaces que no
  // llevan a ninguna parte en la mitad de las entradas.
  return texto
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Nombre legible de la categoría del catálogo. */
const CATEGORIAS = new Map([
  ["web-framework", "framework web"],
  ["application-framework", "framework de aplicación"],
  ["metaframework", "metaframework"],
  ["ui-library", "biblioteca de interfaz"],
  ["ui-framework", "framework de interfaz"],
  ["orm", "mapeador objeto-relacional"],
  ["query-builder", "constructor de consultas"],
  ["micro-orm", "micro-ORM"],
  ["runtime", "entorno de ejecución"],
  ["library", "biblioteca"],
  ["template-engine", "motor de plantillas"],
  ["build-tool", "herramienta de construcción"],
  ["mobile-framework", "framework móvil"],
  ["desktop-framework", "framework de escritorio"],
  ["platform", "plataforma"],
]);

const normalizar = (texto) => texto.replaceAll("\r\n", "\n");
/**
 * Una receta puede ser un comando o una LISTA de comandos: NestJS instala y
 * después compila. Aplanarlos con un espacio producía una línea que no se puede
 * ejecutar —`pnpm,install,... pnpm,exec,tsc,...`— y que llevaba semanas
 * publicada en la clase 036.
 */
const comando = (partes) => {
  if (!partes?.length) return "";
  if (Array.isArray(partes[0])) return partes.map(comando).join("\n");
  return partes.join(" ").replaceAll("${PUERTO}", "3000");
};

/** El bloque de fichas de una clase. */
/** El bloque completo, entre las marcas que lo delimitan en el README. */
const envolver = (lineas) => `${INICIO}\n\n${lineas.join("\n")}\n\n${FIN}`;

function fichas(dir, elenco, numero) {
  const dirImpl = path.join(dir, "implementaciones");
  const presentes = fs.existsSync(dirImpl)
    ? fs
        .readdirSync(dirImpl, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .filter((nombre) => elenco.includes(nombre))
        .sort((a, b) => elenco.indexOf(a) - elenco.indexOf(b))
    : [];

  const inventarios = presentes.map((framework) => inventarioDe(dirImpl, framework, catalogo));
  const lineas = [];

  const vocabulario = conceptosPorClase.get(numero) ?? [];
  if (vocabulario.length) {
    lineas.push("## 📖 Las palabras que esta clase define");
    lineas.push("");
    lineas.push(
      "Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.",
    );
    lineas.push("");
    lineas.push("| Palabra | Qué significa |");
    lineas.push("| --- | --- |");
    for (const c of vocabulario) {
      const alias = c.alias?.length ? ` *(${c.alias.join(", ")})*` : "";
      lineas.push(
        `| [**${c.termino}**](../../../glosario/README.md#${ancla(c.termino)})${alias} | ${c.definicion} |`,
      );
    }
    lineas.push("");
  }

  // Una clase sin implementaciones —las de tipo `catalogo`, que preguntan al
  // catálogo en lugar de levantar servidores— no tiene piezas que inventariar, y
  // aun así define palabras. El vocabulario de arriba vale igual.
  if (!inventarios.length) {
    return lineas.length ? envolver(lineas) : null;
  }

  lineas.push("## 🧰 Las piezas de esta clase, una por una");
  lineas.push("");
  lineas.push(
    "Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.",
  );
  lineas.push("");
  lineas.push("| Framework | Qué es | Desde | Licencia | Quién lo mantiene |");
  lineas.push("| --- | --- | ---: | --- | --- |");
  for (const i of inventarios) {
    const categoria = CATEGORIAS.get(i.kind) ?? i.kind ?? "—";
    lineas.push(
      `| **${i.nombre}** | ${categoria} de ${i.ecosistema ?? "—"} (${i.lenguaje ?? "—"}) | ${i.desde ?? "—"} | ${i.licencia ?? "—"} | ${i.gobernanza ?? "proyecto independiente"} |`,
    );
  }
  lineas.push("");

  for (const i of inventarios) {
    lineas.push(`### 🔧 ${i.nombre}`);
    lineas.push("");
    if (i.nota) {
      lineas.push(`${i.nota}`);
      lineas.push("");
    }
    lineas.push(`- **Documentación oficial:** <${i.documentacion}>`);
    lineas.push(`- **Estado en el catálogo:** ${i.estado ?? "—"}`);
    lineas.push(`- **Versión que ejecuta esta clase:** \`${i.version}\``);
    lineas.push(
      `- **Necesita en el PATH:** ${i.requiere.length ? i.requiere.map((r) => `\`${r}\``).join(", ") : "nada más que lo ya instalado"}`,
    );
    lineas.push("");
    if (i.preparar) {
      lineas.push("Preparar sus dependencias, dentro de su directorio:");
      lineas.push("");
      lineas.push("```bash");
      lineas.push(comando(i.preparar));
      lineas.push("```");
      lineas.push("");
    }
    if (i.arrancar) {
      lineas.push("Arrancarla suelta, sin el verificador:");
      lineas.push("");
      lineas.push("```bash");
      lineas.push(`PORT=3000 ${comando(i.arrancar)}`);
      lineas.push("```");
      lineas.push("");
    }
    if (i.archivos.length) {
      lineas.push("Qué hay dentro de su directorio:");
      lineas.push("");
      lineas.push("| Archivo | Qué es |");
      lineas.push("| --- | --- |");
      for (const a of i.archivos) lineas.push(`| \`${a.ruta}\` | ${a.rol} |`);
      lineas.push("");
    }
  }

  lineas.push(
    "> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.",
  );

  return envolver(lineas);
}

/** Dónde va el bloque si la clase todavía no lo tiene: justo antes del código. */
function insertar(contenido, bloque) {
  const anclas = ["\n## 🌐 Las implementaciones", "\n## 🔬 Comparación", "\n## 📊 Comparación", "\n## ✅ Verificación"];
  for (const ancla of anclas) {
    const posicion = contenido.indexOf(ancla);
    if (posicion !== -1) {
      return `${contenido.slice(0, posicion)}\n${bloque}\n${contenido.slice(posicion)}`;
    }
  }
  return `${contenido.trimEnd()}\n\n${bloque}\n`;
}

const argumentos = process.argv.slice(2);
/**
 * La primera línea en la que dos versiones dejan de coincidir.
 *
 * Sin esto, `--check` decía qué archivo estaba desfasado y no por qué — y
 * cuando lo que falla es la máquina de integración continua y no la tuya, «está
 * desfasado» no basta para arreglarlo. Diagnosticar a ciegas costó dos vueltas.
 */
function primeraDiferencia(antes, despues) {
  const a = antes.split("\n");
  const b = despues.split("\n");
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    if (a[i] === b[i]) continue;
    return [
      `línea ${i + 1}`,
      `en el archivo: ${JSON.stringify(a[i] ?? "(no hay línea)")}`,
      `debería ser:   ${JSON.stringify(b[i] ?? "(no hay línea)")}`,
    ];
  }
  return ["difieren solo en el final del archivo"];
}

const comprobar = argumentos.includes("--check");
const problemas = [];
let escritas = 0;
let alDia = 0;

for (const parte of manifest.partes) {
  for (const clase of parte.clases) {
    if (clase.estado !== "construida") continue;
    const dir = path.join(CLASSES, parte.slug, clase.slug);
    const readme = path.join(dir, "README.md");
    if (!fs.existsSync(readme)) continue;

    const bloque = fichas(dir, clase.elenco ?? [], clase.n);
    if (!bloque) continue;

    const actual = fs.readFileSync(readme, "utf8");
    const inicio = actual.indexOf(INICIO);
    const fin = actual.indexOf(FIN);

    // Media pareja de marcas es peor que ninguna: con la de apertura puesta y la
    // de cierre mal escrita, este generador se llevaba por delante todo lo que
    // hubiera debajo hasta encontrar un cierre más abajo. Pasó una vez, en la
    // clase 004, y se comió cinco secciones sin decir nada.
    if ((inicio === -1) !== (fin === -1) || (fin !== -1 && fin < inicio)) {
      console.error(
        `FICHAS_FAILED: ${path.relative(root, readme).replace(/\\/g, "/")} tiene las marcas ` +
          `descolocadas (apertura ${inicio}, cierre ${fin}). Deben ir en pareja y en orden.`,
      );
      process.exit(1);
    }

    const nuevo =
      inicio === -1 || fin === -1
        ? insertar(actual, bloque)
        : actual.slice(0, inicio) + bloque + actual.slice(fin + FIN.length);

    if (normalizar(nuevo) === normalizar(actual)) {
      alDia++;
      continue;
    }
    if (comprobar) {
      problemas.push({
        ruta: `classes/${parte.slug}/${clase.slug}/README.md`,
        diferencia: primeraDiferencia(normalizar(actual), normalizar(nuevo)),
      });
      continue;
    }
    fs.writeFileSync(readme, nuevo);
    escritas++;
  }
}

if (problemas.length) {
  console.error(`FICHAS_FAILED: ${problemas.length} clases con la ficha técnica desactualizada`);
  for (const p of problemas) {
    console.error(`  - ${p.ruta}`);
    for (const linea of p.diferencia) console.error(`      ${linea}`);
  }
  console.error("  Ejecuta: node scripts/generate-fichas.mjs");
  process.exit(1);
}

console.log(
  comprobar
    ? `FICHAS_OK: ${alDia} clases con su ficha técnica al día`
    : `FICHAS_OK: ${escritas} escritas, ${alDia} ya estaban al día`,
);
