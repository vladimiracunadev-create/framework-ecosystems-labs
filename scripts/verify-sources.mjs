#!/usr/bin/env node
/**
 * Verificador de trazabilidad. Sin red y sin dependencias: es determinista y
 * puede ejecutarse en cualquier máquina o en integración continua.
 *
 * Regla del repositorio: ninguna afirmación del programa procede de una fuente
 * difusa. Lo que este script comprueba es exactamente esa regla, no su intención.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {
  root,
  markdownFiles,
  parseFrontMatter,
  citationsOf,
  headings,
  loadBibliography,
} from "./lib/sources.mjs";

const LESSON_SECTIONS = [
  "Prerrequisitos y nivel",
  "Objetivos observables",
  "Concepto independiente del framework",
  "Anatomía comparada",
  "Implementación mínima",
  "Pruebas compartidas",
  "Seguridad y accesibilidad",
  "Errores frecuentes y diagnóstico",
  "Comprobación de recuerdo",
  "Reto de transferencia",
  "Criterios de evaluación",
  "Fuentes",
];

const FRONT_MATTER_KEYS = ["modulo", "titulo", "nivel", "horas", "prerrequisitos", "verificado", "fuentes"];
const NIVELES = new Set(["introductorio", "intermedio", "avanzado"]);
const MIN_CITATIONS_PER_LESSON = 4;

/** Rutas cuyo contenido debe estar citado. */
const CITED_AREAS = ["curriculum", "docs", "assessments", "projects", "atlas", "classes", "empezar", "glosario"];

const problems = [];
const notes = [];

function fail(file, message) {
  problems.push(`${path.relative(root, file).replace(/\\/g, "/")}: ${message}`);
}

// ---------------------------------------------------------------- bibliografía

const { bibliography, index } = loadBibliography();

function validateBibliography() {
  const file = path.join(root, "sources/bibliography.json");
  const seen = new Set();
  if (!bibliography.verified_on) fail(file, "falta verified_on");
  for (const entry of bibliography.entries) {
    if (seen.has(entry.id)) fail(file, `identificador duplicado: ${entry.id}`);
    seen.add(entry.id);
    if (!/^[a-z0-9][a-z0-9-]*$/.test(entry.id)) fail(file, `identificador no canónico: ${entry.id}`);
    if (!entry.title) fail(file, `${entry.id}: sin título`);
    if (!/^https:\/\//.test(entry.locator ?? "")) fail(file, `${entry.id}: localizador no resoluble por https`);
    if (entry.type === "book") {
      if (!/^\d{13}$/.test(entry.isbn13 ?? "")) fail(file, `${entry.id}: libro sin ISBN-13`);
      else if (!isbn13IsValid(entry.isbn13)) fail(file, `${entry.id}: ISBN-13 con dígito de control inválido`);
      if (entry.locator !== `https://openlibrary.org/isbn/${entry.isbn13}`) {
        fail(file, `${entry.id}: el localizador del libro debe apuntar al registro del ISBN`);
      }
      if (!entry.authors?.length) fail(file, `${entry.id}: libro sin autoría`);
      if (!entry.publisher) fail(file, `${entry.id}: libro sin editorial`);
    }
    if (entry.type === "paper") {
      if (!entry.doi) fail(file, `${entry.id}: artículo sin DOI`);
      else if (entry.locator !== `https://doi.org/${entry.doi}`) {
        fail(file, `${entry.id}: el localizador del artículo debe ser su DOI resoluble`);
      }
      if (!entry.container) fail(file, `${entry.id}: artículo sin publicación contenedora`);
    }
    if ((entry.type === "standard" || entry.type === "reference") && !entry.publisher) {
      fail(file, `${entry.id}: fuente institucional sin organismo responsable`);
    }
    if (!entry.topics?.length) fail(file, `${entry.id}: sin temas declarados`);
  }
}

/** El dígito de control descarta ISBN inventados o mal transcritos. */
function isbn13IsValid(isbn) {
  const digits = [...isbn].map(Number);
  const sum = digits.slice(0, 12).reduce((total, digit, position) => total + digit * (position % 2 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10 === digits[12];
}

// ------------------------------------------------------------------ lecciones

function validateLesson(file) {
  const content = fs.readFileSync(file, "utf8");
  const { data, body } = parseFrontMatter(content);
  if (!data) return fail(file, "sin front matter; toda lección debe declarar metadatos y fuentes");

  for (const key of FRONT_MATTER_KEYS) {
    if (data[key] === undefined) fail(file, `front matter sin '${key}'`);
  }
  if (data.nivel && !NIVELES.has(data.nivel)) fail(file, `nivel no reconocido: ${data.nivel}`);
  if (data.horas && !/^\d+$/.test(String(data.horas))) fail(file, "las horas deben ser un entero");
  if (data.verificado && !/^\d{4}-\d{2}-\d{2}$/.test(data.verificado)) fail(file, "verificado debe ser AAAA-MM-DD");

  const present = new Set(headings(body));
  for (const section of LESSON_SECTIONS) {
    if (!present.has(section)) fail(file, `falta la sección obligatoria «${section}»`);
  }

  const declared = new Set(data.fuentes ?? []);
  // Las citas se cuentan solo en la exposición. Si se contaran también en la
  // sección «Fuentes», bastaría listar una obra para darla por citada: la
  // bibliografía quedaría intacta y el texto sin respaldo.
  const cut = body.indexOf("\n## Fuentes");
  if (cut === -1) return fail(file, "sin sección «Fuentes» al final");
  const exposition = body.slice(0, cut);
  const used = new Set(citationsOf(exposition));

  if (used.size < MIN_CITATIONS_PER_LESSON) {
    fail(file, `solo ${used.size} fuentes citadas en el cuerpo; el mínimo es ${MIN_CITATIONS_PER_LESSON}`);
  }
  for (const id of used) {
    if (!index.has(id)) fail(file, `cita a una fuente inexistente: [@${id}]`);
    else if (!declared.has(id)) fail(file, `[@${id}] se cita pero no está declarada en el front matter`);
  }
  for (const id of declared) {
    if (!index.has(id)) fail(file, `front matter declara una fuente inexistente: ${id}`);
    else if (!used.has(id)) fail(file, `${id} se declara pero nunca se cita en el cuerpo`);
  }

  // La sección «Fuentes» debe listar cada fuente declarada, con su localizador.
  const fuentes = body.slice(body.indexOf("\n## Fuentes"));
  for (const id of declared) {
    const entry = index.get(id);
    if (entry && !fuentes.includes(entry.locator)) {
      fail(file, `la sección «Fuentes» no publica el localizador de ${id}`);
    }
  }
  return undefined;
}

// ------------------------------------------------------- citas fuera de lección

function validateCitationsEverywhere() {
  const files = markdownFiles(...CITED_AREAS);
  const used = new Set();
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    for (const id of citationsOf(content)) {
      used.add(id);
      if (!index.has(id)) fail(file, `cita a una fuente inexistente: [@${id}]`);
    }
  }
  const orphans = bibliography.entries.filter((entry) => !used.has(entry.id)).map((entry) => entry.id);
  if (orphans.length) {
    problems.push(
      `sources/bibliography.json: ${orphans.length} entradas nunca se citan (bibliografía decorativa): ${orphans.join(", ")}`,
    );
  }
  notes.push(`${used.size}/${bibliography.entries.length} fuentes citadas en ${files.length} documentos`);
}

// --------------------------------------------------------------------- ejecución

validateBibliography();
const lessons = markdownFiles("curriculum").filter((file) => /[\\/]\d{2}-[^\\/]+\.md$/.test(file));
if (lessons.length < 13) problems.push(`curriculum: se esperaban al menos 13 módulos y hay ${lessons.length}`);
for (const lesson of lessons) validateLesson(lesson);
validateCitationsEverywhere();

if (problems.length) {
  console.error(`SOURCES_FAILED: ${problems.length} incumplimientos`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exitCode = 1;
} else {
  console.log(`SOURCES_OK: ${bibliography.entries.length} fuentes, ${lessons.length} módulos`);
  for (const note of notes) console.log(`  · ${note}`);
}
