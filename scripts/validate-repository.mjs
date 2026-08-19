#!/usr/bin/env node
/**
 * Validación estructural del repositorio: archivos obligatorios, catálogo,
 * contrato, enlaces relativos y política de gestor de paquetes.
 *
 * La trazabilidad de las fuentes se comprueba aparte, en `verify-sources.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const required = [
  "README.md",
  "PROMPT_MAESTRO.md",
  "LICENSE",
  "package.json",
  "pnpm-workspace.yaml",
  "catalog/frameworks.json",
  "curriculum/README.md",
  "docs/TAXONOMY.md",
  "docs/SOURCES.md",
  "docs/LEARNING-MODEL.md",
  "docs/BIBLIOGRAPHY.md",
  "sources/bibliography.json",
  "sources/README.md",
  "contracts/taskflow/openapi.yaml",
  "contracts/taskflow/ACCEPTANCE.md",
  "labs/01-http-contract/reference-node/server.mjs",
  "labs/01-http-contract/reference-node/server.test.mjs",
  "assessments/rubric.md",
  "assessments/diagnostic.md",
  "scripts/verify-sources.mjs",
  "scripts/generate-site.mjs",
  "scripts/generate-bibliography.mjs",
  "templates/LESSON_TEMPLATE.md",
];

// Directorios que no forman parte del contenido: generados, dependencias o
// metadatos de la herramienta de control de versiones.
const IGNORAR = new Set(["node_modules", "site", ".git", ".pnpm-store", "dist", "coverage"]);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (IGNORAR.has(entry.name)) return [];
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function validateRequired() {
  const missing = required.filter((item) => !fs.existsSync(path.join(root, item)));
  if (missing.length) throw new Error(`Faltan archivos obligatorios: ${missing.join(", ")}`);
}

function validateCatalog() {
  const payload = JSON.parse(fs.readFileSync(path.join(root, "catalog/frameworks.json"), "utf8"));
  const entries = payload.entries;
  const ids = entries.map((entry) => entry.id);
  if (entries.length < 30 || new Set(ids).size !== ids.length) {
    throw new Error("El catálogo debe tener al menos 30 entradas con identificador único");
  }
  for (const entry of entries) {
    if (!entry.official_docs?.startsWith("https://")) throw new Error(`Sin documentación oficial: ${entry.id}`);
    if (!entry.kind || !entry.ecosystem) throw new Error(`Clasificación incompleta: ${entry.id}`);
  }
}

function validateContract() {
  const contract = fs.readFileSync(path.join(root, "contracts/taskflow/openapi.yaml"), "utf8");
  for (const token of ["openapi: 3.1.0", "/health:", "/tasks:", "Idempotency-Key", "TASK_NOT_FOUND"]) {
    if (!contract.includes(token)) throw new Error(`Falta un elemento del contrato: ${token}`);
  }
}

/** Los módulos deben estar numerados de forma continua desde 00. */
function validateCurriculum() {
  const modulos = fs
    .readdirSync(path.join(root, "curriculum"))
    .filter((name) => /^\d{2}-.+\.md$/.test(name))
    .map((name) => name.slice(0, 2))
    .sort();
  if (modulos.length < 13) throw new Error(`Se esperaban al menos 13 módulos y hay ${modulos.length}`);
  modulos.forEach((numero, posicion) => {
    if (Number(numero) !== posicion) throw new Error(`Numeración de módulos discontinua en ${numero}`);
  });
}

function validateRelativeLinks() {
  const pattern = /\[[^\]]+\]\(([^)]+)\)/g;
  const failures = [];
  for (const file of walk(root).filter((item) => item.endsWith(".md"))) {
    const content = fs.readFileSync(file, "utf8");
    for (const match of content.matchAll(pattern)) {
      const target = match[1].split("#", 1)[0];
      if (!target || /^(https?:|mailto:)/.test(target)) continue;
      if (!fs.existsSync(path.resolve(path.dirname(file), target))) {
        failures.push(`${path.relative(root, file)} -> ${match[1]}`);
      }
    }
  }
  if (failures.length) throw new Error(`Enlaces relativos rotos: ${failures.join("; ")}`);
}

function validatePackagePolicy() {
  const forbidden = ["package-lock.json", "yarn.lock", "bun.lock", "bun.lockb"];
  const found = forbidden.filter((item) => fs.existsSync(path.join(root, item)));
  if (found.length) throw new Error(`Gestor de paquetes no admitido: ${found.join(", ")}`);
  const rootPackage = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  if (!rootPackage.packageManager?.startsWith("pnpm@")) throw new Error("packageManager debe usar pnpm");
}

/** Un artefacto generado en el historial se desincroniza de su origen. */
function validateNoGeneratedArtifacts() {
  const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
  if (!/^site\/$/m.test(gitignore)) throw new Error("El sitio generado debe estar ignorado por git");
  if (fs.existsSync(path.join(root, "node_modules"))) {
    console.warn("  aviso: node_modules presente en el árbol de trabajo (ignorado por git)");
  }
}

try {
  validateRequired();
  validateCatalog();
  validateContract();
  validateCurriculum();
  validateRelativeLinks();
  validatePackagePolicy();
  validateNoGeneratedArtifacts();
  console.log("REPOSITORY_OK");
} catch (error) {
  console.error(`VALIDATION_FAILED: ${error.message}`);
  process.exitCode = 1;
}
