import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Cita en línea: [@identificador]. Es el único mecanismo aceptado para atribuir una afirmación. */
export const CITATION = /\[@([a-z0-9][a-z0-9-]*)\]/g;

export function readJson(relative) {
  return JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
}

/**
 * Directorios que nunca forman parte del contenido. `node_modules` importa más
 * de lo que parece: los laboratorios instalan dependencias en su propia carpeta
 * y sus archivos Markdown aparecerían como documentos del programa.
 */
const IGNORADOS = new Set(["node_modules", ".git", "site", "dist", "build", "coverage", "target", "bin", "obj", "__pycache__", ".venv"]);

export function walk(directory, filter = () => true) {
  const base = path.isAbsolute(directory) ? directory : path.join(root, directory);
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base, { withFileTypes: true }).flatMap((entry) => {
    if (IGNORADOS.has(entry.name)) return [];
    const target = path.join(base, entry.name);
    if (entry.isDirectory()) return walk(target, filter);
    return filter(target) ? [target] : [];
  });
}

export function markdownFiles(...directories) {
  return directories.flatMap((directory) => walk(directory, (file) => file.endsWith(".md"))).sort();
}

/**
 * Front matter mínimo y explícito. No se usa un analizador YAML completo a propósito:
 * el repositorio no incorpora dependencias y el subconjunto admitido cabe en una regla.
 * Admite `clave: valor` y `clave: [a, b, c]`.
 */
export function parseFrontMatter(raw) {
  // Se normaliza el fin de línea: un archivo editado en Windows llegaría con
  // CRLF y el análisis fallaría por un motivo que nada tiene que ver con su
  // contenido.
  const content = raw.replace(/\r\n/g, "\n");
  if (!content.startsWith("---\n")) return { data: null, body: content, endLine: 0 };
  const close = content.indexOf("\n---\n", 4);
  if (close === -1) return { data: null, body: content, endLine: 0 };
  const header = content.slice(4, close);
  const data = {};
  for (const line of header.split("\n")) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      data[key] = value.replace(/^["']|["']$/g, "");
    }
  }
  return { data, body: content.slice(close + 5), endLine: raw.split("\n").length + 2 };
}

export function citationsOf(text) {
  return [...text.matchAll(CITATION)].map((match) => match[1]);
}

export function headings(body) {
  return body
    .split("\n")
    .filter((line) => /^#{1,6}\s/.test(line))
    .map((line) => line.replace(/^#{1,6}\s+/, "").trim());
}

export function loadBibliography() {
  const bibliography = readJson("sources/bibliography.json");
  const index = new Map(bibliography.entries.map((entry) => [entry.id, entry]));
  return { bibliography, index };
}

/** Cita en formato humano, derivada solo de campos presentes en el registro. */
export function formatCitation(entry) {
  const parts = [];
  if (entry.authors?.length) parts.push(entry.authors.join("; "));
  parts.push(`*${entry.title}*`);
  if (entry.container) parts.push(entry.container);
  if (entry.edition) parts.push(`${entry.edition} ed.`);
  if (entry.publisher) parts.push(entry.publisher);
  if (entry.published) parts.push(entry.published);
  if (entry.volume) parts.push(`vol. ${entry.volume}`);
  if (entry.pages) parts.push(`pp. ${entry.pages}`);
  if (entry.isbn13) parts.push(`ISBN ${entry.isbn13}`);
  if (entry.doi) parts.push(`DOI ${entry.doi}`);
  return parts.join(", ");
}
