#!/usr/bin/env node
/**
 * Diagnóstico de la máquina: qué cadenas de herramientas hay instaladas y
 * cuánto del laboratorio puedes ejecutar hoy con ellas.
 *
 * Existe porque el ejecutor de clases dice «⊘ falta la herramienta `mvn`» y ahí
 * se acaba su trabajo: no es su tarea explicar cómo se instala Maven. Este
 * script cierra ese hueco y responde a la pregunta que viene después —«¿qué me
 * estoy perdiendo y qué tengo que hacer para recuperarlo?».
 *
 * Modos:
 *   node scripts/doctor.mjs             informe de la máquina
 *   node scripts/doctor.mjs --markdown  la tabla generada para empezar/README.md
 *   node scripts/doctor.mjs --check     falla si esa tabla está desactualizada
 *
 * Sin red y sin dependencias. El informe NUNCA infla la cobertura: una cadena
 * ausente se declara ausente, igual que una implementación omitida se declara
 * omitida.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { CADENAS, CADENA_POR_FIRMA } from "./lib/cadenas.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const esWindows = process.platform === "win32";

const INICIO = "<!-- generado: cadenas -->";
const FIN = "<!-- fin generado: cadenas -->";
const DESTINO = path.join(root, "empezar", "README.md");

// ------------------------------------------------------- inventario del repo

/**
 * Recorre las implementaciones de las clases y agrupa por cadena.
 * La fuente es `ejecutar.json`, no una lista escrita a mano: si mañana una
 * clase estrena un ecosistema, aparece aquí sin tocar nada.
 */
function inventario() {
  const porCadena = new Map();
  const desconocidas = new Set();

  function recorrer(dir) {
    for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entrada.name === "node_modules" || entrada.name === "vendor") continue;
      const completa = path.join(dir, entrada.name);
      if (entrada.isDirectory()) {
        recorrer(completa);
        continue;
      }
      if (entrada.name !== "ejecutar.json") continue;
      const config = JSON.parse(fs.readFileSync(completa, "utf8"));
      const firma = (config.requiere ?? []).join("+");
      const cadena = CADENA_POR_FIRMA.get(firma);
      if (!cadena) {
        desconocidas.add(firma);
        continue;
      }
      const relativa = path.relative(root, completa).replace(/\\/g, "/");
      const clase = relativa.split("/")[2]?.slice(0, 3) ?? "???";
      const acumulado = porCadena.get(cadena.id) ?? {
        cadena,
        implementaciones: 0,
        clases: new Set(),
        frameworks: new Set(),
      };
      acumulado.implementaciones += 1;
      acumulado.clases.add(clase);
      acumulado.frameworks.add(config.framework);
      porCadena.set(cadena.id, acumulado);
    }
  }

  recorrer(path.join(root, "classes"));

  // Node aparece dos veces: sola (htmx, Alpine.js) y con pnpm. Quien tiene la
  // segunda tiene la primera, y el informe debe decirlo así en vez de contar
  // dos cadenas que en la práctica se instalan juntas.
  return {
    filas: CADENAS.map((cadena) => porCadena.get(cadena.id)).filter(Boolean),
    desconocidas: [...desconocidas],
  };
}

// ------------------------------------------------------- sondeo de la máquina

/** Ruta completa del ejecutable, o null. Mismo criterio que `run-class.mjs`. */
function resolver(comando) {
  const r = spawnSync(esWindows ? "where" : "which", [comando], { encoding: "utf8" });
  if (r.status !== 0) return null;
  const candidatos = r.stdout.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!esWindows) return candidatos[0] ?? null;
  return candidatos.find((c) => /\.(exe|cmd|bat)$/i.test(c)) ?? candidatos[0] ?? null;
}

const cache = new Map();
function disponible(comando) {
  if (!cache.has(comando)) cache.set(comando, resolver(comando) !== null);
  return cache.get(comando);
}

/**
 * Versión declarada por la propia herramienta.
 *
 * Dos trampas reales que este código evita: en Windows los envoltorios `.cmd`
 * necesitan intérprete, y varias herramientas escupen avisos antes del número
 * —PHP anuncia cada extensión que no encuentra—, así que se busca la primera
 * línea que **parezca** una versión en vez de tomar la primera a secas.
 */
function version(cadena) {
  const [nombre, ...args] = cadena.comprobar[0].split(" ");
  const ruta = resolver(nombre) ?? nombre;
  // Mismo criterio que `run-class.mjs`: el intérprete solo para los envoltorios
  // `.cmd` y `.bat`, y con la ruta entrecomillada una sola vez. Delegar todo en
  // `shell: true` rompe con las rutas largas que instala pnpm.
  const envoltorio = esWindows && /\.(cmd|bat)$/i.test(ruta);
  const r = envoltorio
    ? spawnSync([`"${ruta}"`, ...args].join(" "), { encoding: "utf8", shell: true, timeout: 20_000 })
    : spawnSync(ruta, args, { encoding: "utf8", timeout: 20_000 });
  const lineas = `${r.stdout ?? ""}\n${r.stderr ?? ""}`
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !/^(warning|deprecat|note):/i.test(l));
  const texto = lineas.find((l) => /\d+\.\d+/.test(l)) ?? lineas[0] ?? "sin salida";
  // Estar en el PATH no es estar operativa. Un envoltorio roto —pnpm reinstalado
  // sobre una versión anterior es el caso clásico— resuelve, arranca y devuelve
  // un error. Contarlo como lista sería el verde falso que este repositorio evita.
  return { ok: r.status === 0, texto: texto.slice(0, 120) };
}

// -------------------------------------------------------------------- informe

function informe() {
  const { filas, desconocidas } = inventario();
  const totalImpl = filas.reduce((suma, f) => suma + f.implementaciones, 0);
  let listasImpl = 0;
  const ausentes = [];
  const rotas = [];

  console.log("Cadenas de herramientas del laboratorio\n");
  for (const fila of filas) {
    const faltan = fila.cadena.requiere.filter((bin) => !disponible(bin));
    let marca;
    let detalle;
    if (faltan.length) {
      marca = "⊘";
      detalle = `falta ${faltan.map((b) => `\`${b}\``).join(" y ")}`;
      ausentes.push({ fila, faltan });
    } else {
      const v = version(fila.cadena);
      if (v.ok) {
        marca = "✔";
        detalle = v.texto;
        listasImpl += fila.implementaciones;
      } else {
        marca = "⚠";
        detalle = `en el PATH pero no responde: ${v.texto}`;
        rotas.push({ fila, motivo: v.texto });
      }
    }
    console.log(
      `  ${marca} ${fila.cadena.titulo.padEnd(22)} ${String(fila.implementaciones).padStart(3)} impl · ${String(fila.clases.size).padStart(3)} clases   ${detalle}`,
    );
  }

  const porcentaje = totalImpl ? Math.round((listasImpl / totalImpl) * 100) : 0;
  console.log(
    `\nRESUMEN: ${listasImpl}/${totalImpl} implementaciones ejecutables en esta máquina (${porcentaje} %)`,
  );

  if (desconocidas.length) {
    console.log(
      `\n⚠ Cadenas declaradas en algún ejecutar.json y ausentes del catálogo: ${desconocidas.join(", ")}`,
    );
    console.log("  Añádelas a scripts/lib/cadenas.mjs para que este informe deje de mentir.");
    process.exitCode = 1;
  }

  if (rotas.length) {
    console.log("\nInstaladas pero no operativas — reinstalar es más rápido que diagnosticar:\n");
    for (const { fila, motivo } of rotas) {
      console.log(`  ${fila.cadena.titulo}: ${fila.cadena.comprobar[0]} → ${motivo}`);
      console.log(`    ${fila.cadena.oficial}\n`);
    }
  }

  if (ausentes.length) {
    console.log("\nPara recuperar lo que falta:\n");
    const sistema = esWindows ? "Windows" : process.platform === "darwin" ? "macOS" : "Linux (Debian/Ubuntu)";
    for (const { fila } of ausentes) {
      const receta =
        fila.cadena.instalar[sistema] ?? Object.values(fila.cadena.instalar)[0] ?? [];
      console.log(`  ${fila.cadena.titulo} — ${fila.cadena.oficial}`);
      for (const linea of receta) console.log(`    ${linea}`);
      console.log("");
    }
  } else if (!rotas.length) {
    console.log("\nEstán las ocho cadenas: ninguna implementación se omitirá por falta de herramientas.");
  }

  console.log("Detalle y contexto de cada cadena: empezar/README.md");
}

// ------------------------------------------------------------ tabla generada

function tabla() {
  const { filas } = inventario();
  const lineas = [];

  lineas.push("| Cadena | Qué desbloquea | Frameworks | Instalación oficial |");
  lineas.push("| --- | ---: | --- | --- |");
  for (const fila of filas) {
    const frameworks = [...fila.frameworks].sort().join(", ");
    lineas.push(
      `| **${fila.cadena.titulo}** · ${fila.cadena.version} | ${fila.implementaciones} impl. en ${fila.clases.size} clases | ${frameworks} | [${dominio(fila.cadena.oficial)}](${fila.cadena.oficial}) [@${fila.cadena.cita}] |`,
    );
  }

  const totalImpl = filas.reduce((suma, f) => suma + f.implementaciones, 0);
  lineas.push("");
  lineas.push(
    `Ocho cadenas, **${totalImpl} implementaciones**. Ninguna es obligatoria: el ejecutor corre las que encuentre y **declara** las que omitió.`,
  );

  for (const fila of filas) {
    lineas.push("");
    lineas.push(`### ${fila.cadena.titulo}`);
    lineas.push("");
    lineas.push(fila.cadena.porque);
    lineas.push("");
    for (const [sistema, receta] of Object.entries(fila.cadena.instalar)) {
      lineas.push(`**${sistema}**`);
      lineas.push("");
      lineas.push("```bash");
      for (const linea of receta) lineas.push(linea);
      lineas.push("```");
      lineas.push("");
    }
    lineas.push("Comprobación:");
    lineas.push("");
    lineas.push("```bash");
    for (const comando of fila.cadena.comprobar) lineas.push(comando);
    lineas.push("```");
    if (fila.cadena.nota) {
      lineas.push("");
      lineas.push(`> ⚠️ ${fila.cadena.nota}`);
    }
  }

  return lineas.join("\n");
}

function dominio(url) {
  return new URL(url).hostname.replace(/^www\./, "");
}

function bloque() {
  return `${INICIO}\n\n${tabla()}\n\n${FIN}`;
}

/**
 * El final de línea no es contenido.
 *
 * El repositorio se edita en Windows y se valida en Linux; una herramienta que
 * escribiera el fichero con CRLF pondría este verificador en rojo sin que
 * hubiera cambiado una sola palabra. Se compara el texto, no el formato del
 * salto.
 */
const normalizar = (texto) => texto.replaceAll("\r\n", "\n");

function reescribir({ comprobar }) {
  const actual = fs.readFileSync(DESTINO, "utf8");
  const inicio = actual.indexOf(INICIO);
  const fin = actual.indexOf(FIN);
  if (inicio === -1 || fin === -1) {
    console.error(`DOCTOR_FAILED: empezar/README.md no tiene las marcas ${INICIO} … ${FIN}`);
    process.exitCode = 1;
    return;
  }
  const nuevo = actual.slice(0, inicio) + bloque() + actual.slice(fin + FIN.length);
  if (normalizar(nuevo) === normalizar(actual)) {
    console.log("DOCTOR_OK: la tabla de cadenas está al día");
    return;
  }
  if (comprobar) {
    console.error("DOCTOR_FAILED: empezar/README.md no coincide con los ejecutar.json del repositorio");
    console.error("  Ejecuta: node scripts/doctor.mjs --escribir");
    process.exitCode = 1;
    return;
  }
  fs.writeFileSync(DESTINO, nuevo);
  console.log("DOCTOR_OK: tabla de cadenas regenerada en empezar/README.md");
}

// ------------------------------------------------------------------ ejecución

const argumentos = process.argv.slice(2);
if (argumentos.includes("--markdown")) console.log(tabla());
else if (argumentos.includes("--check")) reescribir({ comprobar: true });
else if (argumentos.includes("--escribir")) reescribir({ comprobar: false });
else informe();
