#!/usr/bin/env node
/**
 * Revisión en línea de la bibliografía. Consulta los catálogos públicos que
 * dan fe de cada entrada y compara con lo registrado:
 *
 *   libros      -> https://openlibrary.org/isbn/{isbn13}.json
 *   artículos   -> https://api.crossref.org/works/{doi}
 *   normas/refs -> GET a la URL declarada
 *
 * No modifica el repositorio: informa de la deriva. Se ejecuta a mano o en un
 * trabajo programado; la validación obligatoria (`verify-sources.mjs`) no
 * depende de la red para que la integración continua sea reproducible.
 */
import process from "node:process";
import { loadBibliography, formatCitation } from "./lib/sources.mjs";

const AGENT = "framework-ecosystems-labs/1.0 (+https://github.com/vladimiracunadev-create/framework-ecosystems-labs)";
const TIMEOUT = 30_000;
const onlyType = process.argv.find((argument) => argument.startsWith("--type="))?.split("=")[1];

const { bibliography } = loadBibliography();
const drift = [];
const unreachable = [];
let checked = 0;

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

/** Reintenta ante 429/503: los catálogos públicos limitan el ritmo, y un límite
 *  de ritmo no es una fuente rota. */
async function request(url, accept, attempt = 1) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": AGENT, ...(accept ? { accept } : {}) },
    });
    if ((response.status === 429 || response.status >= 500) && attempt < 3) {
      await wait(attempt * 2000);
      return request(url, accept, attempt + 1);
    }
    return response;
  } finally {
    clearTimeout(timer);
  }
}

function normalise(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Coincidencia laxa a propósito. Los catálogos normalizan artículos, guiones y
 * subtítulos de formas distintas («Implementing Domaindriven Design»), de modo
 * que una comparación exacta produciría ruido en vez de hallazgos. Se compara
 * por solapamiento de palabras: si el catálogo contiene el 80 % del título
 * registrado, se trata de la misma obra.
 */
function titlesAgree(registered, catalogued) {
  const a = normalise(registered);
  const b = normalise(catalogued);
  if (!a || !b) return false;
  if (a.replace(/ /g, "").includes(b.replace(/ /g, "")) || b.replace(/ /g, "").includes(a.replace(/ /g, ""))) return true;
  const words = a.split(" ").filter((word) => word.length > 1);
  const target = new Set(b.split(" "));
  const shared = words.filter((word) => target.has(word)).length;
  return words.length > 0 && shared / words.length >= 0.8;
}

async function checkBook(entry) {
  const response = await request(entry.locator + ".json", "application/json");
  if (!response.ok) return unreachable.push(`${entry.id}: HTTP ${response.status} en ${entry.locator}`);
  const record = await response.json();
  const catalogued = [record.title, record.subtitle].filter(Boolean).join(": ");
  if (!titlesAgree(entry.title, catalogued)) {
    drift.push(`${entry.id}: el registro del ISBN dice «${catalogued}» y la bibliografía dice «${entry.title}»`);
  }
  return undefined;
}

async function checkPaper(entry) {
  const response = await request(`https://api.crossref.org/works/${entry.doi}`, "application/json");
  if (!response.ok) return unreachable.push(`${entry.id}: HTTP ${response.status} en Crossref`);
  const record = (await response.json()).message;
  if (!titlesAgree(entry.title, (record.title ?? [])[0])) {
    drift.push(`${entry.id}: Crossref dice «${(record.title ?? [])[0]}» y la bibliografía dice «${entry.title}»`);
  }
  const year = (record.issued?.["date-parts"] ?? [[]])[0][0];
  if (entry.published && year && String(year) !== String(entry.published)) {
    drift.push(`${entry.id}: Crossref data el artículo en ${year} y la bibliografía en ${entry.published}`);
  }
  return undefined;
}

async function checkLink(entry) {
  const response = await request(entry.locator);
  // 403 es habitual en editoriales que bloquean clientes automatizados: el
  // recurso existe, pero no responde a un script. Se informa aparte.
  if (response.status === 403) return unreachable.push(`${entry.id}: 403 (acceso automatizado bloqueado)`);
  if (!response.ok) return unreachable.push(`${entry.id}: HTTP ${response.status} en ${entry.locator}`);
  return undefined;
}

for (const entry of bibliography.entries) {
  if (onlyType && entry.type !== onlyType) continue;
  checked += 1;
  try {
    if (entry.type === "book") await checkBook(entry);
    else if (entry.type === "paper") await checkPaper(entry);
    else await checkLink(entry);
  } catch (error) {
    unreachable.push(`${entry.id}: ${error.message}`);
  }
}

console.log(`Revisadas ${checked} entradas de ${bibliography.entries.length}.`);
if (drift.length) {
  console.log(`\nDeriva respecto al catálogo (${drift.length}):`);
  for (const item of drift) console.log(`  ! ${item}`);
}
if (unreachable.length) {
  console.log(`\nNo verificable en esta ejecución (${unreachable.length}):`);
  for (const item of unreachable) console.log(`  ? ${item}`);
}
if (!drift.length && !unreachable.length) console.log("Sin deriva: la bibliografía coincide con los catálogos.");

if (process.argv.includes("--print")) {
  console.log("\nCitas completas:");
  for (const entry of bibliography.entries) console.log(`  [@${entry.id}] ${formatCitation(entry)}`);
}

// La deriva es informativa: la fuente puede haber cambiado de edición sin que el
// repositorio esté equivocado. Solo se marca error si se pide explícitamente.
if (process.argv.includes("--strict") && drift.length) process.exitCode = 1;
