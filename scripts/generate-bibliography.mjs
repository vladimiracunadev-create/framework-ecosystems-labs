#!/usr/bin/env node
/**
 * Genera `docs/BIBLIOGRAPHY.md` desde el registro, con el mapa de qué documento
 * cita qué fuente. Con `--check` no escribe: falla si el archivo del repositorio
 * no coincide con lo que se generaría, que es como la integración continua
 * detecta un índice desactualizado.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { root, markdownFiles, citationsOf, loadBibliography, formatCitation } from "./lib/sources.mjs";

const AREAS = ["curriculum", "docs", "assessments", "projects", "atlas"];
const TIPOS = [
  ["book", "Libros", "Obras de referencia. El localizador apunta al registro del ISBN-13 concreto de la edición citada."],
  ["paper", "Artículos", "Investigación con revisión por pares. El localizador es el DOI, resoluble y con metadatos en Crossref."],
  ["standard", "Normas y especificaciones", "Documentos normativos de organismos públicos o consorcios abiertos."],
  ["reference", "Documentación oficial y referencias", "Documentación de quien mantiene la tecnología, o texto del autor citado."],
];

const { bibliography, index } = loadBibliography();

// Mapa inverso: para cada fuente, qué documentos la citan.
const citadoPor = new Map(bibliography.entries.map((entry) => [entry.id, new Set()]));
for (const file of markdownFiles(...AREAS)) {
  const relative = path.relative(root, file).replace(/\\/g, "/");
  if (relative === "docs/BIBLIOGRAPHY.md") continue;
  for (const id of citationsOf(fs.readFileSync(file, "utf8"))) {
    if (citadoPor.has(id)) citadoPor.get(id).add(relative);
  }
}

const lineas = [];
lineas.push("# Bibliografía");
lineas.push("");
lineas.push("Documento generado por `node scripts/generate-bibliography.mjs`. No editar a mano.");
lineas.push("");
lineas.push(
  `Registro: [\`sources/bibliography.json\`](../sources/bibliography.json) · ` +
    `**${bibliography.entries.length}** fuentes · verificadas el **${bibliography.verified_on}** · ` +
    `política en [\`sources/README.md\`](../sources/README.md).`,
);
lineas.push("");
lineas.push("Cada entrada declara un localizador resoluble y es citada al menos una vez en el programa;");
lineas.push("`node scripts/verify-sources.mjs` falla si deja de cumplirse cualquiera de las dos condiciones.");
lineas.push("");

lineas.push("## Resumen");
lineas.push("");
lineas.push("| Tipo | Entradas | Verificación |");
lineas.push("| --- | ---: | --- |");
for (const [tipo, titulo] of TIPOS) {
  const total = bibliography.entries.filter((entry) => entry.type === tipo).length;
  lineas.push(`| ${titulo} | ${total} | \`${bibliography.verification[tipo]}\` |`);
}
lineas.push("");

for (const [tipo, titulo, descripcion] of TIPOS) {
  const entradas = bibliography.entries
    .filter((entry) => entry.type === tipo)
    .sort((a, b) => (a.authors?.[0] ?? a.publisher ?? a.title).localeCompare(b.authors?.[0] ?? b.publisher ?? b.title, "es"));
  if (!entradas.length) continue;
  lineas.push(`## ${titulo}`);
  lineas.push("");
  lineas.push(descripcion);
  lineas.push("");
  for (const entry of entradas) {
    const usos = [...citadoPor.get(entry.id)].sort();
    lineas.push(`### \`${entry.id}\``);
    lineas.push("");
    lineas.push(`${formatCitation(entry)}`);
    lineas.push("");
    lineas.push(`- Localizador: <${entry.locator}>`);
    lineas.push(`- Temas: ${entry.topics.join(", ")}`);
    lineas.push(`- Citada en: ${usos.map((uso) => `[\`${uso}\`](../${uso})`).join(", ")}`);
    lineas.push("");
  }
}

const contenido = `${lineas.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
const destino = path.join(root, "docs/BIBLIOGRAPHY.md");

if (process.argv.includes("--check")) {
  const actual = fs.existsSync(destino) ? fs.readFileSync(destino, "utf8").replace(/\r\n/g, "\n") : "";
  if (actual !== contenido) {
    console.error("BIBLIOGRAPHY_STALE: docs/BIBLIOGRAPHY.md no coincide con el registro. Ejecuta `node scripts/generate-bibliography.mjs`.");
    process.exitCode = 1;
  } else {
    console.log("BIBLIOGRAPHY_OK");
  }
} else {
  fs.writeFileSync(destino, contenido, "utf8");
  console.log(`docs/BIBLIOGRAPHY.md generado: ${bibliography.entries.length} fuentes.`);
}

void index;
