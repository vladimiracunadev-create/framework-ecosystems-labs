#!/usr/bin/env node
/**
 * El glosario del programa, generado desde las fuentes de verdad del repositorio.
 *
 * Un glosario escrito a mano tiene dos formas de mentir: una definición que
 * apunta a una clase que ya no existe, y una tecnología del catálogo que nadie
 * definió nunca. Este generador cierra las dos:
 *
 * - Los **conceptos** salen de `glosario/conceptos.json` y cada uno declara
 *   dónde se enseña. Si esa clase o ese módulo no existe, la validación falla.
 * - Las **tecnologías** salen de `catalog/frameworks.json`, así que el glosario
 *   cubre las 138 sin que nadie tenga que acordarse de añadirlas.
 * - Las **cadenas de herramientas** salen de `scripts/lib/cadenas.mjs`.
 * - Las **partes y clases** salen de `classes/_manifest.json`.
 *
 *   node scripts/generate-glosario.mjs           regenera glosario/README.md
 *   node scripts/generate-glosario.mjs --check   falla si está desactualizado
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { CADENAS } from "./lib/cadenas.mjs";

const root = path.resolve(import.meta.dirname, "..");
const DESTINO = path.join(root, "glosario", "README.md");

const datos = JSON.parse(fs.readFileSync(path.join(root, "glosario/conceptos.json"), "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(root, "classes/_manifest.json"), "utf8"));
const catalogoCrudo = JSON.parse(fs.readFileSync(path.join(root, "catalog/frameworks.json"), "utf8"));
const catalogo = catalogoCrudo.entries ?? catalogoCrudo;

const problemas = [];

/** Índice de clases por número, para resolver las referencias. */
const clases = new Map();
for (const parte of manifest.partes) {
  for (const clase of parte.clases) {
    clases.set(clase.n, { ...clase, parte });
  }
}

const KINDS = new Map([
  ["web-framework", "framework web"],
  ["application-framework", "framework de aplicación"],
  ["metaframework", "metaframework"],
  ["ui-library", "biblioteca de interfaz"],
  ["ui-framework", "framework de interfaz"],
  ["orm", "ORM"],
  ["query-builder", "constructor de consultas"],
  ["micro-orm", "micro-ORM"],
  ["runtime", "entorno de ejecución"],
  ["library", "biblioteca"],
  ["template-engine", "motor de plantillas"],
  ["build-tool", "herramienta de construcción"],
  ["mobile-framework", "framework móvil"],
  ["desktop-framework", "framework de escritorio"],
  ["platform", "plataforma"],
  ["css-framework", "framework de CSS"],
  ["testing", "herramienta de pruebas"],
  ["state-management", "gestión de estado"],
]);

/** El enlace a la clase donde se enseña un concepto, comprobado. */
function enlaceClase(numero, termino) {
  const clase = clases.get(numero);
  if (!clase) {
    problemas.push(`«${termino}» remite a la clase ${numero}, que no existe en el manifiesto`);
    return null;
  }
  const etiqueta = `clase ${String(numero).padStart(3, "0")}`;
  const ruta = `../classes/${clase.parte.slug}/${clase.slug}/README.md`;
  const marca = clase.estado === "construida" ? "" : " 🚧";
  return `[${etiqueta}](${ruta})${marca}`;
}

/** El enlace al módulo del currículo, comprobado contra el disco. */
function enlaceModulo(numero, termino) {
  const dir = path.join(root, "curriculum");
  const archivo = fs.readdirSync(dir).find((n) => n.startsWith(`${numero}-`) && n.endsWith(".md"));
  if (!archivo) {
    problemas.push(`«${termino}» remite al módulo ${numero}, que no existe en curriculum/`);
    return null;
  }
  return `[módulo ${numero}](../curriculum/${archivo})`;
}

/** Índice alfabético con todos los términos, incluidos los alias. */
function indiceAlfabetico(conceptos) {
  const entradas = [];
  for (const c of conceptos) {
    entradas.push({ texto: c.termino, ancla: ancla(c.termino) });
    for (const alias of c.alias ?? []) {
      entradas.push({ texto: `${alias} → ${c.termino}`, ancla: ancla(c.termino) });
    }
  }
  entradas.sort((a, b) => a.texto.localeCompare(b.texto, "es"));

  const grupos = new Map();
  for (const entrada of entradas) {
    const letra = entrada.texto[0].toUpperCase();
    if (!grupos.has(letra)) grupos.set(letra, []);
    grupos.get(letra).push(entrada);
  }

  const lineas = [];
  for (const [letra, lista] of grupos) {
    lineas.push(`**${letra}** · ${lista.map((e) => `[${e.texto}](#${e.ancla})`).join(" · ")}`);
    lineas.push("");
  }
  return lineas.join("\n");
}

/** El ancla que GitHub genera para un encabezado. */
function ancla(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// --------------------------------------------------------------- construcción

const conceptos = [...datos.conceptos].sort((a, b) => a.termino.localeCompare(b.termino, "es"));
const porCategoria = new Map();
for (const c of conceptos) {
  if (!datos.categorias[c.categoria]) {
    problemas.push(`«${c.termino}» declara la categoría «${c.categoria}», que no existe`);
    continue;
  }
  if (!porCategoria.has(c.categoria)) porCategoria.set(c.categoria, []);
  porCategoria.get(c.categoria).push(c);
}

const terminos = new Set(conceptos.map((c) => c.termino));
for (const c of conceptos) {
  for (const rel of c.relacionado ?? []) {
    if (!terminos.has(rel)) {
      problemas.push(`«${c.termino}» remite a «${rel}», que no está definido en el glosario`);
    }
  }
}

const lineas = [];

lineas.push("# 📖 Glosario");
lineas.push("");
lineas.push(
  "> [🏠 Repositorio](../README.md) · [🚀 Empezar](../empezar/README.md) · [🎓 Clases](../classes/README.md) · [🗺️ Atlas](../atlas/README.md)",
);
lineas.push("");
lineas.push(
  `Todo el vocabulario del programa en un sitio: **${conceptos.length} conceptos** con su definición y **dónde se enseña**, las **${catalogo.length} tecnologías** del catálogo y las **${CADENAS.length} cadenas de herramientas**.`,
);
lineas.push("");
lineas.push(
  "Este archivo **se genera**. Los conceptos viven en [`glosario/conceptos.json`](conceptos.json), las tecnologías en [`catalog/frameworks.json`](../catalog/frameworks.json) y las cadenas en [`scripts/lib/cadenas.mjs`](../scripts/lib/cadenas.mjs). Cada concepto declara la clase o el módulo donde se enseña, y `node scripts/generate-glosario.mjs --check` **falla si esa referencia no resuelve** — un glosario cuyos enlaces mienten es peor que no tenerlo.",
);
lineas.push("");
lineas.push("Las clases marcadas con 🚧 están en esqueleto: el contrato y el elenco están fijados, la prosa todavía no.");
lineas.push("");
lineas.push("## 🔤 Índice alfabético");
lineas.push("");
lineas.push(indiceAlfabetico(conceptos));

lineas.push("## 🧠 Los conceptos, por área");
lineas.push("");

for (const [id, titulo] of Object.entries(datos.categorias)) {
  const lista = porCategoria.get(id);
  if (!lista?.length) continue;
  lineas.push(`### ${titulo}`);
  lineas.push("");
  for (const c of lista) {
    const alias = c.alias?.length ? ` *(${c.alias.join(", ")})*` : "";
    lineas.push(`#### ${c.termino}`);
    lineas.push("");
    lineas.push(`${c.definicion}${alias ? `\n\nTambién:${alias}` : ""}`);
    lineas.push("");
    const donde = [];
    if (c.clase !== undefined) {
      const enlace = enlaceClase(c.clase, c.termino);
      if (enlace) donde.push(`Se enseña en la ${enlace}`);
    }
    if (c.modulo !== undefined) {
      const enlace = enlaceModulo(c.modulo, c.termino);
      if (enlace) donde.push(`se desarrolla en el ${enlace}`);
    }
    if (c.relacionado?.length) {
      donde.push(`ver también ${c.relacionado.map((r) => `[${r}](#${ancla(r)})`).join(", ")}`);
    }
    if (donde.length) {
      lineas.push(`> ${donde.join(" · ")}.`);
      lineas.push("");
    }
  }
}

lineas.push("## 🧰 Las cadenas de herramientas");
lineas.push("");
lineas.push(
  "Los ejecutables que hace falta tener para ejecutar cada ecosistema del laboratorio. La receta completa de instalación está en [`empezar/`](../empezar/README.md), y `node scripts/doctor.mjs` dice cuáles tienes.",
);
lineas.push("");
lineas.push("| Cadena | Versión de referencia | Se comprueba con | Qué desbloquea |");
lineas.push("| --- | --- | --- | --- |");
for (const cadena of CADENAS) {
  lineas.push(
    `| **${cadena.titulo}** | ${cadena.version} | \`${cadena.comprobar[0]}\` | ${cadena.porque} |`,
  );
}
lineas.push("");

lineas.push("## 🗂️ Las tecnologías del catálogo");
lineas.push("");
lineas.push(
  `Las ${catalogo.length} tecnologías que el programa sitúa, con su categoría y su ecosistema. Cada una tiene su ficha a fondo en el Atlas. **Estar en el catálogo no es una recomendación**, y el número de descargas o de estrellas no aparece en ninguna entrada.`,
);
lineas.push("");

const porEcosistema = new Map();
for (const entrada of catalogo) {
  const clave = entrada.ecosystem ?? "Otros";
  if (!porEcosistema.has(clave)) porEcosistema.set(clave, []);
  porEcosistema.get(clave).push(entrada);
}
const ecosistemas = [...porEcosistema.entries()].sort((a, b) => b[1].length - a[1].length);

for (const [ecosistema, lista] of ecosistemas) {
  lineas.push(`### ${ecosistema} · ${lista.length}`);
  lineas.push("");
  lineas.push("| Tecnología | Qué es | Desde | Estado | Ficha |");
  lineas.push("| --- | --- | ---: | --- | --- |");
  for (const e of [...lista].sort((a, b) => a.name.localeCompare(b.name, "es"))) {
    const kind = KINDS.get(e.kind) ?? e.kind;
    lineas.push(
      `| **${e.name}** | ${kind} | ${e.first_release ?? "—"} | ${e.status ?? "—"} | [ficha](../atlas/fichas/${e.id}.md) |`,
    );
  }
  lineas.push("");
}

lineas.push("## 🎓 Las partes del programa");
lineas.push("");
lineas.push("| Parte | Tema | Clases | Construidas |");
lineas.push("| ---: | --- | ---: | ---: |");
for (const parte of manifest.partes) {
  const construidas = parte.clases.filter((c) => c.estado === "construida").length;
  lineas.push(
    `| ${parte.idx} | [${parte.titulo}](../classes/${parte.slug}/README.md) | ${parte.clases.length} | ${construidas} |`,
  );
}
lineas.push("");
lineas.push(
  "> ¿Falta una palabra? Se añade a [`glosario/conceptos.json`](conceptos.json) con su definición y la clase donde se enseña, y se regenera con `node scripts/generate-glosario.mjs`.",
);
lineas.push("");

const contenido = `${lineas.join("\n")}`;

if (problemas.length) {
  console.error(`GLOSARIO_FAILED: ${problemas.length} referencias que no resuelven`);
  for (const p of problemas) console.error(`  - ${p}`);
  process.exit(1);
}

const normalizar = (texto) => texto.replaceAll("\r\n", "\n");
const comprobar = process.argv.includes("--check");
const actual = fs.existsSync(DESTINO) ? fs.readFileSync(DESTINO, "utf8") : "";

if (normalizar(actual) === normalizar(contenido)) {
  console.log(`GLOSARIO_OK: ${conceptos.length} conceptos, ${catalogo.length} tecnologías, al día`);
} else if (comprobar) {
  console.error("GLOSARIO_FAILED: glosario/README.md no coincide con sus fuentes");
  console.error("  Ejecuta: node scripts/generate-glosario.mjs");
  process.exit(1);
} else {
  fs.mkdirSync(path.dirname(DESTINO), { recursive: true });
  fs.writeFileSync(DESTINO, contenido);
  console.log(`GLOSARIO_OK: ${conceptos.length} conceptos y ${catalogo.length} tecnologías escritos`);
}
