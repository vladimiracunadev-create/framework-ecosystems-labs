#!/usr/bin/env node
/**
 * Genera el Atlas de frameworks desde `catalog/frameworks.json`.
 *
 *   node scripts/generate-atlas.mjs           escribe el índice y rellena las tablas
 *   node scripts/generate-atlas.mjs --check   falla si algo quedó desactualizado
 *
 * La prosa de cada página de ecosistema se escribe a mano —es la parte que
 * enseña— y las tablas se generan —es la parte que se desincroniza—. Cada tabla
 * vive entre marcas `<!-- generado:... -->` y `<!-- fin -->`, y este script es
 * el único que escribe entre ellas.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { root, readJson } from "./lib/sources.mjs";

const ATLAS = path.join(root, "atlas");
const soloVerificar = process.argv.includes("--check");

const catalogo = readJson("catalog/frameworks.json");

export const FAMILIAS = {
  javascript: { titulo: "JavaScript y TypeScript", archivo: "javascript.md" },
  python: { titulo: "Python", archivo: "python.md" },
  php: { titulo: "PHP", archivo: "php.md" },
  jvm: { titulo: "JVM — Java, Kotlin, Scala y Groovy", archivo: "jvm.md" },
  dotnet: { titulo: ".NET y C#", archivo: "dotnet.md" },
  go: { titulo: "Go", archivo: "go.md" },
  rust: { titulo: "Rust", archivo: "rust.md" },
  ruby: { titulo: "Ruby", archivo: "ruby.md" },
  beam: { titulo: "BEAM — Elixir y Erlang", archivo: "beam.md" },
  dart: { titulo: "Dart", archivo: "dart.md" },
  apple: { titulo: "Plataformas de Apple", archivo: "apple.md" },
  nativo: { titulo: "Escritorio nativo — C y C++", archivo: "nativo.md" },
  cloud: { titulo: "Plataformas de ejecución", archivo: "cloud.md" },
};

const ERAS = {
  pionero: { etiqueta: "Pionero", glifo: "🌱", orden: 0 },
  clasico: { etiqueta: "Clásico", glifo: "🏛️", orden: 1 },
  vigente: { etiqueta: "Vigente", glifo: "🟢", orden: 2 },
  emergente: { etiqueta: "Emergente", glifo: "🌊", orden: 3 },
};

const ESTADOS = {
  activo: "🟢 activo",
  mantenimiento: "🟡 mantenimiento",
  historico: "⚪ histórico",
};

const porFamilia = (familia) => catalogo.entries.filter((entry) => entry.family === familia);

/** Ficha propia si existe el archivo; si no, el nombre a secas. */
function enlaceFicha(entry, desde) {
  const ficha = path.join(ATLAS, "fichas", `${entry.id}.md`);
  if (!fs.existsSync(ficha)) return `**${entry.name}**`;
  const relativa = path.relative(path.dirname(desde), ficha).replace(/\\/g, "/");
  return `[**${entry.name}**](${relativa})`;
}

function tablaDeEcosistema(familia, destino) {
  const entradas = porFamilia(familia);
  const lineas = [
    "| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |",
    "| --- | --- | ---: | --- | --- | --- | --- |",
  ];
  for (const entry of entradas) {
    lineas.push(
      `| ${enlaceFicha(entry, destino)} | \`${entry.kind}\` | ${entry.first_release ?? "—"} | ` +
        `${ERAS[entry.era].glifo} ${ERAS[entry.era].etiqueta} | ${ESTADOS[entry.status]} | ` +
        `\`${entry.license}\` | [oficial](${entry.official_docs}) |`,
    );
  }
  return lineas.join("\n");
}

function notasDeEcosistema(familia) {
  const entradas = porFamilia(familia);
  return entradas.map((entry) => `- **${entry.name}** — ${entry.note}`).join("\n");
}

// ------------------------------------------------------------ índice completo

function indiceCompleto() {
  const destino = path.join(ATLAS, "frameworks.md");
  const total = catalogo.entries.length;
  const cuenta = (predicado) => catalogo.entries.filter(predicado).length;

  const lineas = [
    "# Índice del Atlas",
    "",
    "> [⬅️ Atlas](README.md) · [📚 Programa](../curriculum/README.md) · [🧭 Taxonomía](../docs/TAXONOMY.md)",
    "",
    "Documento generado por `node scripts/generate-atlas.mjs`. No editar a mano.",
    "",
    `**${total} tecnologías** registradas en [\`catalog/frameworks.json\`](../catalog/frameworks.json), ` +
      `verificadas el **${catalogo.verified_on}**.`,
    "",
    "Estar en el Atlas no es una recomendación. Es una afirmación más modesta y más útil:",
    "esta tecnología existió o existe, hizo algo reconocible, y aquí está su documentación oficial.",
    "",
    "## Reparto",
    "",
    "| Familia | Tecnologías | Pioneras | Clásicas | Vigentes | Emergentes |",
    "| --- | ---: | ---: | ---: | ---: | ---: |",
  ];

  for (const [familia, meta] of Object.entries(FAMILIAS)) {
    const entradas = porFamilia(familia);
    if (!entradas.length) continue;
    const porEra = (era) => entradas.filter((entry) => entry.era === era).length;
    lineas.push(
      `| [${meta.titulo}](ecosistemas/${meta.archivo}) | ${entradas.length} | ` +
        `${porEra("pionero")} | ${porEra("clasico")} | ${porEra("vigente")} | ${porEra("emergente")} |`,
    );
  }
  lineas.push(`| **Total** | **${total}** | **${cuenta((e) => e.era === "pionero")}** | ` +
    `**${cuenta((e) => e.era === "clasico")}** | **${cuenta((e) => e.era === "vigente")}** | ` +
    `**${cuenta((e) => e.era === "emergente")}** |`);
  lineas.push("");

  lineas.push("## Por clasificación");
  lineas.push("");
  lineas.push("Esta tabla es el ejercicio del módulo 00 aplicado a todo el catálogo: **nada de esto");
  lineas.push("son sinónimos**, y las comparaciones entre columnas distintas rara vez significan algo.");
  lineas.push("");
  lineas.push("| Clasificación | Cuántas | Ejemplos |");
  lineas.push("| --- | ---: | --- |");
  const clases = [...new Set(catalogo.entries.map((entry) => entry.kind))].sort();
  for (const clase of clases) {
    const entradas = catalogo.entries.filter((entry) => entry.kind === clase);
    lineas.push(`| \`${clase}\` | ${entradas.length} | ${entradas.slice(0, 4).map((e) => e.name).join(", ")} |`);
  }
  lineas.push("");

  lineas.push("## Todas las tecnologías");
  lineas.push("");
  for (const [familia, meta] of Object.entries(FAMILIAS)) {
    const entradas = porFamilia(familia);
    if (!entradas.length) continue;
    lineas.push(`### ${meta.titulo}`);
    lineas.push("");
    lineas.push(`Contexto y genealogía: [${meta.archivo}](ecosistemas/${meta.archivo}).`);
    lineas.push("");
    lineas.push(tablaDeEcosistema(familia, destino));
    lineas.push("");
  }

  return { destino, contenido: `${lineas.join("\n").trim()}\n` };
}

// -------------------------------------------------- bloques dentro de páginas

const MARCA = /<!-- generado:([a-z-]+) ([a-z-]+) -->\n([\s\S]*?)<!-- fin -->/g;

function rellenarBloques(archivo) {
  const original = fs.readFileSync(archivo, "utf8").replace(/\r\n/g, "\n");
  const actualizado = original.replace(MARCA, (completo, tipo, argumento) => {
    let cuerpo;
    if (tipo === "tabla-ecosistema") cuerpo = tablaDeEcosistema(argumento, archivo);
    else if (tipo === "notas-ecosistema") cuerpo = notasDeEcosistema(argumento);
    else return completo;
    return `<!-- generado:${tipo} ${argumento} -->\n${cuerpo}\n<!-- fin -->`;
  });
  return { original, actualizado };
}

// ------------------------------------------------------------------ ejecución

const problemas = [];
let escritos = 0;

const { destino, contenido } = indiceCompleto();
if (soloVerificar) {
  const actual = fs.existsSync(destino) ? fs.readFileSync(destino, "utf8").replace(/\r\n/g, "\n") : "";
  if (actual !== contenido) problemas.push("atlas/frameworks.md no coincide con el catálogo");
} else {
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, contenido, "utf8");
  escritos += 1;
}

const paginas = fs.existsSync(path.join(ATLAS, "ecosistemas"))
  ? fs.readdirSync(path.join(ATLAS, "ecosistemas")).map((nombre) => path.join(ATLAS, "ecosistemas", nombre))
  : [];

for (const pagina of paginas) {
  const { original, actualizado } = rellenarBloques(pagina);
  if (original === actualizado) continue;
  if (soloVerificar) problemas.push(`${path.relative(root, pagina).replace(/\\/g, "/")} tiene tablas desactualizadas`);
  else {
    fs.writeFileSync(pagina, actualizado, "utf8");
    escritos += 1;
  }
}

// Cobertura: toda entrada del catálogo debe caer en una familia con página.
for (const entry of catalogo.entries) {
  const meta = FAMILIAS[entry.family];
  if (!meta) problemas.push(`${entry.id}: familia desconocida «${entry.family}»`);
  else if (!fs.existsSync(path.join(ATLAS, "ecosistemas", meta.archivo))) {
    problemas.push(`falta la página de ecosistema atlas/ecosistemas/${meta.archivo}`);
  }
}

if (problemas.length) {
  console.error(`ATLAS_${soloVerificar ? "STALE" : "FAILED"}: ${problemas.length} problemas`);
  for (const problema of [...new Set(problemas)]) console.error(`  - ${problema}`);
  if (!soloVerificar) console.error("  Ejecuta: node scripts/generate-atlas.mjs");
  process.exitCode = 1;
} else if (soloVerificar) {
  console.log(`ATLAS_OK: ${catalogo.entries.length} tecnologías, ${paginas.length} ecosistemas, índice al día`);
} else {
  const fichas = fs.existsSync(path.join(ATLAS, "fichas"))
    ? fs.readdirSync(path.join(ATLAS, "fichas")).filter((n) => n.endsWith(".md")).length
    : 0;
  console.log(
    `ATLAS_OK: ${catalogo.entries.length} tecnologías en ${paginas.length} ecosistemas, ` +
      `${fichas} fichas propias, ${escritos} archivos actualizados`,
  );
}
