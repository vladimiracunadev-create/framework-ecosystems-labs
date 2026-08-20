#!/usr/bin/env node
/**
 * Revisión en línea del catálogo. Comprueba dos cosas que caducan sin avisar:
 *
 *   1. que la documentación oficial de cada tecnología sigue respondiendo;
 *   2. que cada identificador de licencia existe en la lista oficial de SPDX.
 *
 * No modifica el repositorio: informa. Igual que `refresh-sources.mjs`, no forma
 * parte de la validación obligatoria, porque un fallo de red no es un fallo del
 * repositorio.
 *
 *   node scripts/refresh-catalog.mjs
 *   node scripts/refresh-catalog.mjs --family=php
 *   node scripts/refresh-catalog.mjs --strict     falla si algo no responde
 */
import process from "node:process";
import { readJson } from "./lib/sources.mjs";

const AGENTE = "Mozilla/5.0 (compatible; framework-ecosystems-labs)";
const SPDX = "https://spdx.org/licenses/licenses.json";
const TIEMPO_LIMITE = 25_000;
const EN_PARALELO = 8;

const familia = process.argv.find((a) => a.startsWith("--family="))?.split("=")[1];
const estricto = process.argv.includes("--strict");

const catalogo = readJson("catalog/frameworks.json");
const entradas = catalogo.entries.filter((entry) => !familia || entry.family === familia);

const espera = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

async function pedir(url, intento = 1) {
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), TIEMPO_LIMITE);
  try {
    const respuesta = await fetch(url, {
      redirect: "follow",
      signal: control.signal,
      headers: { "user-agent": AGENTE },
    });
    // Un límite de ritmo no es un enlace roto.
    if ((respuesta.status === 429 || respuesta.status >= 500) && intento < 3) {
      await espera(intento * 2000);
      return pedir(url, intento + 1);
    }
    return respuesta.status;
  } catch (error) {
    return error.name === "AbortError" ? "tiempo agotado" : error.message;
  } finally {
    clearTimeout(reloj);
  }
}

// ------------------------------------------------------------------- licencias

const rotos = [];
const bloqueados = [];
let licenciasDesconocidas = [];

try {
  const respuesta = await fetch(SPDX, { headers: { "user-agent": AGENTE } });
  const identificadores = new Set((await respuesta.json()).licenses.map((licencia) => licencia.licenseId));
  const usadas = [...new Set(catalogo.entries.map((entry) => entry.license))];
  // NOASSERTION es la convención de SPDX para «no corresponde a un identificador
  // único», y el catálogo la usa a propósito en licencias duales o privativas.
  licenciasDesconocidas = usadas.filter((l) => l !== "NOASSERTION" && !identificadores.has(l));
  console.log(`Licencias: ${usadas.length} distintas, ${licenciasDesconocidas.length} fuera de la lista SPDX.`);
} catch (error) {
  console.log(`Licencias: no se pudo consultar la lista SPDX (${error.message}).`);
}

// -------------------------------------------------------------------- enlaces

console.log(`Comprobando ${entradas.length} enlaces de documentación oficial…\n`);

for (let i = 0; i < entradas.length; i += EN_PARALELO) {
  const lote = entradas.slice(i, i + EN_PARALELO);
  const resultados = await Promise.all(lote.map((entry) => pedir(entry.official_docs)));
  lote.forEach((entry, posicion) => {
    const estado = resultados[posicion];
    if (estado === 200) return;
    // 403 suele ser un bloqueo a clientes automatizados, no un recurso perdido.
    if (estado === 403) bloqueados.push(`${entry.id}: 403 en ${entry.official_docs}`);
    else rotos.push(`${entry.id}: ${estado} en ${entry.official_docs}`);
  });
  process.stdout.write(`  ${Math.min(i + EN_PARALELO, entradas.length)}/${entradas.length}\r`);
}
process.stdout.write("\n");

// -------------------------------------------------------------------- informe

if (licenciasDesconocidas.length) {
  console.log(`\nIdentificadores de licencia no reconocidos (${licenciasDesconocidas.length}):`);
  for (const licencia of licenciasDesconocidas) console.log(`  ! ${licencia}`);
}
if (rotos.length) {
  console.log(`\nDocumentación que no responde (${rotos.length}):`);
  for (const item of rotos) console.log(`  ! ${item}`);
}
if (bloqueados.length) {
  console.log(`\nAcceso automatizado bloqueado, no verificable aquí (${bloqueados.length}):`);
  for (const item of bloqueados) console.log(`  ? ${item}`);
}
if (!rotos.length && !licenciasDesconocidas.length) {
  console.log(`\nSin deriva: ${entradas.length} enlaces responden y todas las licencias son identificadores SPDX válidos.`);
}

if (estricto && (rotos.length || licenciasDesconocidas.length)) process.exitCode = 1;
