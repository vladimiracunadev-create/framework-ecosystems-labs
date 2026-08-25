#!/usr/bin/env node
/**
 * Verificador estructural del árbol de clases.
 *
 * Comprueba lo que el generador no puede garantizar por sí solo: que cada clase
 * declarada existe, que su elenco apunta a tecnologías reales del catálogo, y
 * —sobre todo— que una clase marcada como **construida** cumple de verdad su
 * contrato: casos ejecutables, implementaciones presentes, secciones
 * obligatorias y fuentes citadas.
 *
 * La distinción entre esqueleto y construida es la que hace honesto el
 * recuento. Sin ella, marcar una clase como hecha sería una afirmación sin
 * respaldo.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const CLASSES = path.join(root, "classes");

const manifest = JSON.parse(fs.readFileSync(path.join(CLASSES, "_manifest.json"), "utf8"));
const catalogo = JSON.parse(fs.readFileSync(path.join(root, "catalog/frameworks.json"), "utf8"));
const idsCatalogo = new Set((catalogo.entries ?? catalogo).map((e) => e.id));
const bibliografia = JSON.parse(fs.readFileSync(path.join(root, "sources/bibliography.json"), "utf8"));
const idsFuentes = new Set(bibliografia.entries.map((e) => e.id));

const SECCIONES_CONSTRUIDA = [
  "Objetivo",
  "La situación",
  "El contrato",
  "Las implementaciones",
  "Comparación",
  "Verificación",
  "Errores frecuentes",
  "Reto de transferencia",
  "Fuentes",
];

/**
 * Una clase de tipo `catalogo` no levanta servidores: afirma cosas sobre cómo se
 * clasifican las tecnologías y las contrasta con `catalog/frameworks.json`.
 *
 * No se le exigen implementaciones —no habría qué ejecutar— pero se le exige lo
 * equivalente, y por el mismo motivo: que cada afirmación sea comprobable y que
 * el elenco no sea decorativo.
 */
const SECCIONES_CATALOGO = [
  "Objetivo",
  "La situación",
  "El contrato",
  "Las piezas",
  "Comparación",
  "Verificación",
  "Errores frecuentes",
  "Reto de transferencia",
  "Fuentes",
];

const MIN_IMPLEMENTACIONES = 2;

/** Extensiones que cuentan como código de la implementación, no como andamiaje. */
const EXTENSIONES_FUENTE = new Set([
  ".mjs", ".js", ".ts", ".py", ".java", ".cs", ".go", ".php", ".rb", ".ru",
]);

/** Busca de forma recursiva un archivo con código, saltando lo descargado. */
function tieneFuente(directorio) {
  const IGNORADOS = new Set(["node_modules", "vendor", "target", "bin", "obj", "dist", "__pycache__"]);
  for (const entrada of fs.readdirSync(directorio, { withFileTypes: true })) {
    if (IGNORADOS.has(entrada.name)) continue;
    const ruta = path.join(directorio, entrada.name);
    if (entrada.isDirectory()) {
      if (tieneFuente(ruta)) return true;
      continue;
    }
    if (EXTENSIONES_FUENTE.has(path.extname(entrada.name))) return true;
  }
  return false;
}
const MIN_CASOS = 2;

const problemas = [];
const fallar = (donde, mensaje) => problemas.push(`${donde}: ${mensaje}`);

/**
 * Las exigencias que valen para cualquier clase construida, sea del tipo que
 * sea: las secciones de su guion, que no siga diciendo que es un esqueleto y que
 * cada cita resuelva contra la bibliografía verificada.
 */
function comprobarSecciones(rel, dir, secciones) {
  const readme = fs.readFileSync(path.join(dir, "README.md"), "utf8");
  for (const seccion of secciones) {
    if (!readme.includes(seccion)) fallar(`${rel}/README.md`, `falta la sección "${seccion}"`);
  }
  if (readme.includes("Clase en esqueleto")) {
    fallar(`${rel}/README.md`, "sigue marcada como esqueleto pero el manifiesto la da por construida");
  }

  // Trazabilidad: toda cita debe resolver contra la bibliografía verificada.
  const citas = [...readme.matchAll(/\[@([a-z0-9-]+)\]/g)].map((m) => m[1]);
  if (citas.length === 0) fallar(`${rel}/README.md`, "una clase construida sin ninguna fuente citada");
  for (const cita of new Set(citas)) {
    if (!idsFuentes.has(cita)) fallar(`${rel}/README.md`, `cita a una fuente inexistente: [@${cita}]`);
  }
}

const numerosVistos = new Set();
const slugsVistos = new Set();
let construidas = 0;
let esqueletos = 0;
let implementaciones = 0;
let casos = 0;

for (const parte of manifest.partes) {
  const dirParte = path.join(CLASSES, parte.slug);
  if (!fs.existsSync(dirParte)) {
    fallar(parte.slug, "la parte no existe en el disco");
    continue;
  }

  for (const clase of parte.clases) {
    const rel = `classes/${parte.slug}/${clase.slug}`;
    const dir = path.join(dirParte, clase.slug);

    if (numerosVistos.has(clase.n)) fallar(rel, `número de clase duplicado: ${clase.n}`);
    numerosVistos.add(clase.n);
    if (slugsVistos.has(clase.slug)) fallar(rel, "slug duplicado");
    slugsVistos.add(clase.slug);

    if (!manifest.pistas[clase.pista]) fallar(rel, `pista desconocida: ${clase.pista}`);
    if (!clase.elenco?.length) fallar(rel, "elenco vacío");
    for (const id of clase.elenco ?? []) {
      if (!idsCatalogo.has(id)) fallar(rel, `elenco con una tecnología ausente del catálogo: ${id}`);
    }

    if (!fs.existsSync(dir)) {
      fallar(rel, "la carpeta de la clase no existe");
      continue;
    }
    for (const archivo of ["README.md", "contrato.json", "porque-si-porque-no.md"]) {
      if (!fs.existsSync(path.join(dir, archivo))) fallar(rel, `falta ${archivo}`);
    }

    const rutaContrato = path.join(dir, "contrato.json");
    if (!fs.existsSync(rutaContrato)) continue;

    let contrato;
    try {
      contrato = JSON.parse(fs.readFileSync(rutaContrato, "utf8"));
    } catch (error) {
      fallar(`${rel}/contrato.json`, `no es JSON válido: ${error.message}`);
      continue;
    }

    if (contrato.clase !== String(clase.n).padStart(3, "0")) {
      fallar(`${rel}/contrato.json`, `el campo clase dice "${contrato.clase}" y debería decir "${String(clase.n).padStart(3, "0")}"`);
    }

    if (clase.estado !== "construida") {
      esqueletos++;
      continue;
    }

    // -------------------------------------------------- exigencias de una clase construida
    construidas++;

    if ((contrato.casos?.length ?? 0) < MIN_CASOS) {
      fallar(`${rel}/contrato.json`, `una clase construida necesita al menos ${MIN_CASOS} casos, tiene ${contrato.casos?.length ?? 0}`);
    }
    casos += contrato.casos?.length ?? 0;

    for (const caso of contrato.casos ?? []) {
      if (!caso.nombre) fallar(`${rel}/contrato.json`, "un caso sin nombre");
      if (!caso.esperado) fallar(`${rel}/contrato.json`, `el caso "${caso.nombre}" no declara qué espera`);
    }

    if (contrato.tipo === "catalogo") {
      // Cada caso pregunta al catálogo y cada elenco aparece en alguna pregunta:
      // sin esto, la clase podría listar cinco tecnologías y no afirmar nada de
      // ninguna, que es justo el «relleno» que el repositorio no admite.
      const preguntadas = new Set();
      for (const caso of contrato.casos ?? []) {
        if (!caso.pregunta) {
          fallar(`${rel}/contrato.json`, `el caso "${caso.nombre}" no pregunta nada al catálogo`);
          continue;
        }
        for (const id of [caso.pregunta.tecnologia, caso.pregunta.compite_con]) {
          if (id === undefined) continue;
          preguntadas.add(id);
          if (!idsCatalogo.has(id)) {
            fallar(`${rel}/contrato.json`, `pregunta por "${id}", que no está en el catálogo`);
          }
        }
      }
      for (const id of clase.elenco) {
        if (!preguntadas.has(id)) {
          fallar(`${rel}/contrato.json`, `"${id}" está en el elenco y ningún caso pregunta por él`);
        }
      }
      comprobarSecciones(rel, dir, SECCIONES_CATALOGO);
      continue;
    }

    const dirImpl = path.join(dir, "implementaciones");
    const presentes = fs.existsSync(dirImpl)
      ? fs.readdirSync(dirImpl, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
      : [];

    if (presentes.length < MIN_IMPLEMENTACIONES) {
      fallar(rel, `una clase construida necesita al menos ${MIN_IMPLEMENTACIONES} implementaciones, tiene ${presentes.length}`);
    }
    for (const nombre of presentes) {
      if (!clase.elenco.includes(nombre)) {
        fallar(rel, `la implementación "${nombre}" no está en el elenco declarado`);
      }
      if (contrato.tipo === "http" && !fs.existsSync(path.join(dirImpl, nombre, "ejecutar.json"))) {
        fallar(`${rel}/implementaciones/${nombre}`, "falta ejecutar.json: el verificador no sabría arrancarla");
      }

      // Andamiaje sin código. El caso que se coló en la clase 034: la carpeta
      // tenía su `pom.xml` y su receta, y ningún archivo fuente. La compilación
      // fallaba en integración continua con un error del empaquetador que no
      // decía nada sobre la causa real.
      if (!tieneFuente(path.join(dirImpl, nombre))) {
        fallar(
          `${rel}/implementaciones/${nombre}`,
          "solo hay andamiaje: ningún archivo de código en la implementación",
        );
      }

      implementaciones++;
    }

    comprobarSecciones(rel, dir, SECCIONES_CONSTRUIDA);
  }
}

if (problemas.length) {
  console.error(`CLASSES_FAILED: ${problemas.length} incumplimientos`);
  for (const p of problemas) console.error(`  - ${p}`);
  process.exit(1);
}

console.log(
  `CLASSES_OK: ${construidas + esqueletos} clases en ${manifest.partes.length} partes\n` +
    `  · ${construidas} construidas (${implementaciones} implementaciones, ${casos} casos verificables)\n` +
    `  · ${esqueletos} en esqueleto, con contrato y elenco ya fijados`,
);
