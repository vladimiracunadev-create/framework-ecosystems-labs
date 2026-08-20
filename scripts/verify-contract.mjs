#!/usr/bin/env node
/**
 * Coherencia entre el contrato, las lecciones y las implementaciones.
 *
 * Existe por un fallo real: el currículo enseñaba un formato de error que el
 * contrato canónico no cumplía, y nada lo detectaba. Ninguna de estas
 * comprobaciones depende de leer con atención.
 *
 *   1. Cada código del catálogo se ejercita en las pruebas de aceptación.
 *   2. Cada implementación declara el catálogo completo.
 *   3. Ninguna implementación inventa códigos fuera del catálogo.
 *   4. Todo extracto del contrato citado en una lección coincide literalmente
 *      con el contrato.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { root, markdownFiles } from "./lib/sources.mjs";

const CONTRATO = "contracts/taskflow/openapi.yaml";
const SUITE = "contracts/taskflow/acceptance.test.mjs";

/** Implementaciones que deben cubrir el catálogo entero. */
const IMPLEMENTACIONES = [
  "labs/01-http-contract/reference-node/server.mjs",
  "labs/02-express-api/src/server.mjs",
  "labs/03-fastapi/main.py",
  "labs/04-spring-boot/src/main/java/dev/learning/taskflow/TaskflowApplication.java",
  "labs/05-aspnet-core/Program.cs",
];

/** INTERNAL_ERROR no se puede provocar desde fuera sin romper el servicio. */
const SIN_PRUEBA_EXTERNA = new Set(["INTERNAL_ERROR"]);

const leer = (relativo) => fs.readFileSync(path.join(root, relativo), "utf8");
const problemas = [];
const fallo = (mensaje) => problemas.push(mensaje);

// ------------------------------------------------------------ 1. el catálogo

const contrato = leer(CONTRATO);
const bloqueCatalogo = contrato.slice(contrato.indexOf("x-error-catalog:"));
if (!bloqueCatalogo) fallo(`${CONTRATO}: falta x-error-catalog`);

const codigos = [...bloqueCatalogo.matchAll(/^ {4}([A-Z][A-Z0-9_]*):/gm)].map((coincidencia) => coincidencia[1]);
if (codigos.length < 8) fallo(`${CONTRATO}: el catálogo declara solo ${codigos.length} códigos`);

const suite = leer(SUITE);
for (const codigo of codigos) {
  if (SIN_PRUEBA_EXTERNA.has(codigo)) continue;
  if (!suite.includes(codigo)) {
    fallo(`${SUITE}: el código ${codigo} está en el contrato y ninguna prueba lo ejercita`);
  }
}

// La inversa: la suite no puede afirmar códigos que el contrato no declara.
const declarados = new Set([...codigos, ...SIN_PRUEBA_EXTERNA]);
for (const coincidencia of suite.matchAll(/code:\s*"([A-Z][A-Z0-9_]*)"/g)) {
  if (!declarados.has(coincidencia[1])) {
    fallo(`${SUITE}: la prueba espera ${coincidencia[1]}, que el contrato no declara`);
  }
}

// ------------------------------------------------------ 2 y 3. cobertura real

const CODIGOS_DE_CAMPO = new Set(
  [...bloqueCatalogo.matchAll(/^ {4}(TITLE_[A-Z_]+):/gm)].map((coincidencia) => coincidencia[1]),
);

for (const implementacion of IMPLEMENTACIONES) {
  if (!fs.existsSync(path.join(root, implementacion))) {
    fallo(`falta la implementación ${implementacion}`);
    continue;
  }
  const fuente = leer(implementacion);
  const faltantes = codigos.filter((codigo) => !fuente.includes(codigo));
  if (faltantes.length) {
    fallo(`${implementacion}: no puede emitir ${faltantes.join(", ")}`);
  }
  for (const codigo of CODIGOS_DE_CAMPO) {
    if (!fuente.includes(codigo)) fallo(`${implementacion}: no emite el código de campo ${codigo}`);
  }
}

// ------------------------------------------------- 4. extractos de la lección

/**
 * Un bloque precedido por `<!-- extracto-verificado: ruta -->` debe aparecer
 * literalmente en esa ruta. Es la comprobación que habría evitado que una
 * lección citara el contrato con un valor distinto del real.
 */
const MARCA = /<!--\s*extracto-verificado:\s*([^\s>]+)\s*-->\s*\n```[a-z]*\n([\s\S]*?)```/g;

let extractos = 0;
for (const archivo of markdownFiles("curriculum", "docs", "contracts", "labs", "projects")) {
  const relativo = path.relative(root, archivo).replace(/\\/g, "/");
  const contenido = fs.readFileSync(archivo, "utf8").replace(/\r\n/g, "\n");

  for (const coincidencia of contenido.matchAll(MARCA)) {
    extractos += 1;
    const origen = coincidencia[1];
    if (!fs.existsSync(path.join(root, origen))) {
      fallo(`${relativo}: el extracto apunta a ${origen}, que no existe`);
      continue;
    }
    const fuente = leer(origen).replace(/\r\n/g, "\n");
    const lineas = coincidencia[2]
      .split("\n")
      .map((linea) => linea.trimEnd())
      .filter((linea) => linea.trim() && !linea.trim().startsWith("# …"));

    const ausentes = lineas.filter((linea) => !fuente.includes(linea.trim()));
    if (ausentes.length) {
      fallo(
        `${relativo}: el extracto de ${origen} no coincide con el original. ` +
          `Líneas ausentes: ${ausentes.slice(0, 3).map((linea) => JSON.stringify(linea.trim())).join(", ")}`,
      );
    }
  }
}

// -------------------------------------------------------------------- informe

if (problemas.length) {
  console.error(`CONTRACT_FAILED: ${problemas.length} incoherencias`);
  for (const problema of problemas) console.error(`  - ${problema}`);
  process.exitCode = 1;
} else {
  console.log(
    `CONTRACT_OK: ${codigos.length} códigos del catálogo cubiertos por ${IMPLEMENTACIONES.length} implementaciones, ` +
      `${extractos} extractos verificados contra su original`,
  );
}
