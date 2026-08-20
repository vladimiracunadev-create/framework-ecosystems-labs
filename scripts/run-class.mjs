#!/usr/bin/env node
/**
 * Verificador de equivalencia entre frameworks.
 *
 * Dada una clase, ejecuta cada implementación de su elenco contra los casos de
 * `contrato.json` y comprueba que todas producen la misma respuesta. Las que
 * necesitan una cadena de herramientas ausente **se omiten y se declaran**: un
 * resultado verde nunca significa «todo pasó», significa «esto pasó, esto se
 * omitió».
 *
 * Uso:
 *   node scripts/run-class.mjs 011
 *   node scripts/run-class.mjs 011 --solo express
 *   node scripts/run-class.mjs --todas
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawn, spawnSync } from "node:child_process";
import net from "node:net";

const root = path.resolve(import.meta.dirname, "..");
const CLASSES = path.join(root, "classes");
const manifest = JSON.parse(fs.readFileSync(path.join(CLASSES, "_manifest.json"), "utf8"));

const args = process.argv.slice(2);
const todas = args.includes("--todas");
const soloIdx = args.indexOf("--solo");
const solo = soloIdx >= 0 ? args[soloIdx + 1] : null;
const objetivo = args.find((a) => !a.startsWith("--") && a !== solo);

const esWindows = process.platform === "win32";

// -------------------------------------------------------------- utilidades

/** Ruta completa del ejecutable, o null si no está en el PATH. */
function resolver(cmd) {
  if (cmd.includes("/") || cmd.includes("\\")) return cmd;
  const r = spawnSync(esWindows ? "where" : "which", [cmd], { encoding: "utf8" });
  if (r.status !== 0) return null;
  const candidatos = r.stdout.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!esWindows) return candidatos[0] ?? null;
  // En Windows `where` devuelve también los guiones de shell POSIX sin
  // extensión, que `spawn` no sabe ejecutar. Se prefiere el ejecutable real.
  return (
    candidatos.find((c) => /\.(exe|cmd|bat)$/i.test(c)) ?? candidatos[0] ?? null
  );
}

function existeEjecutable(cmd) {
  return resolver(cmd) !== null;
}

/**
 * Lanza un proceso sin delegar en el intérprete de comandos.
 *
 * `shell: true` concatena los argumentos sin escaparlos, así que un argumento
 * con espacios o comas se parte por donde no debe. En Windows hace falta el
 * intérprete solo para los envoltorios `.cmd` y `.bat`; en ese caso se
 * construye una única línea con cada argumento entrecomillado.
 */
function preparar(cmd, args) {
  const ruta = resolver(cmd) ?? cmd;
  if (esWindows && /\.(cmd|bat)$/i.test(ruta)) {
    const linea = [ruta, ...args].map((a) => (/[\s&|<>^"]/.test(a) ? `"${a}"` : a)).join(" ");
    return { comando: linea, argumentos: [], opciones: { shell: true } };
  }
  return { comando: ruta, argumentos: args, opciones: { shell: false } };
}

function esperar(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function puertoAbierto(puerto) {
  return new Promise((resolve) => {
    const s = net.connect({ port: puerto, host: "127.0.0.1" });
    s.once("connect", () => (s.destroy(), resolve(true)));
    s.once("error", () => (s.destroy(), resolve(false)));
    s.setTimeout(400, () => (s.destroy(), resolve(false)));
  });
}

async function esperarPuerto(puerto, limiteMs) {
  const fin = Date.now() + limiteMs;
  while (Date.now() < fin) {
    if (await puertoAbierto(puerto)) return true;
    await esperar(200);
  }
  return false;
}

function matarArbol(hijo) {
  if (!hijo || hijo.exitCode !== null) return;
  if (esWindows) spawnSync("taskkill", ["/pid", String(hijo.pid), "/t", "/f"], { stdio: "ignore" });
  else hijo.kill("SIGTERM");
}

// ------------------------------------------------------------ comprobación

function normalizarCabecera(v) {
  return String(v ?? "").split(";")[0].trim().toLowerCase();
}

async function comprobarCaso(baseUrl, caso) {
  const p = caso.peticion ?? {};
  const url = new URL(p.ruta ?? "/", baseUrl);
  const init = { method: p.metodo ?? "GET", headers: p.cabeceras ?? {}, redirect: "manual" };
  if (p.cuerpo !== undefined) {
    init.body = typeof p.cuerpo === "string" ? p.cuerpo : JSON.stringify(p.cuerpo);
    init.headers = { "content-type": "application/json", ...init.headers };
  }

  let res;
  try {
    res = await fetch(url, init);
  } catch (error) {
    return { ok: false, motivo: `la petición falló: ${error.message}` };
  }

  const e = caso.esperado ?? {};
  const fallos = [];

  if (e.estado !== undefined && res.status !== e.estado) {
    fallos.push(`estado ${res.status}, esperado ${e.estado}`);
  }

  for (const [k, v] of Object.entries(e.cabeceras ?? {})) {
    const real = normalizarCabecera(res.headers.get(k));
    if (real !== String(v).toLowerCase()) {
      fallos.push(`cabecera ${k}: "${real}", esperada "${v}"`);
    }
  }

  if (e.cuerpo !== undefined) {
    const texto = await res.text();
    if (texto.trim() !== String(e.cuerpo).trim()) {
      fallos.push(`cuerpo "${texto.trim().slice(0, 60)}", esperado "${e.cuerpo}"`);
    }
  } else if (e.json !== undefined) {
    let cuerpo;
    try {
      cuerpo = await res.json();
    } catch {
      return { ok: false, motivo: "la respuesta no es JSON válido" };
    }
    const esperado = JSON.stringify(e.json);
    const real = JSON.stringify(cuerpo);
    if (real !== esperado) fallos.push(`json ${real}, esperado ${esperado}`);
  }

  return fallos.length ? { ok: false, motivo: fallos.join("; ") } : { ok: true };
}

// -------------------------------------------------------- una implementación

async function verificarImplementacion(dir, framework, contrato, puerto) {
  const receta = path.join(dir, "ejecutar.json");
  if (!fs.existsSync(receta)) {
    return { framework, estado: "sin-implementar", detalle: "no existe ejecutar.json" };
  }

  const cfg = JSON.parse(fs.readFileSync(receta, "utf8"));

  for (const bin of cfg.requiere ?? []) {
    if (!existeEjecutable(bin)) {
      return { framework, estado: "omitida", detalle: `falta la herramienta \`${bin}\`` };
    }
  }

  // Sonda de entorno. Estar en el PATH no basta: una herramienta puede estar
  // rota y una dependencia puede no estar instalada. Si la sonda falla, la
  // implementación se OMITE (problema del entorno), no se marca como rota
  // (problema del código). La distinción importa: un informe que confunde
  // ambas cosas deja de ser útil.
  if (cfg.comprobar) {
    const c = preparar(cfg.comprobar[0], cfg.comprobar.slice(1));
    const r = spawnSync(c.comando, c.argumentos, {
      cwd: dir, ...c.opciones, encoding: "utf8", timeout: 60_000,
    });
    if (r.status !== 0) {
      const motivo = (r.stderr || r.stdout || "sin salida").trim().split(/\r?\n/)[0].slice(0, 120);
      return { framework, estado: "omitida", detalle: `entorno no preparado: ${motivo}` };
    }
  }

  if (cfg.preparar) {
    const c = preparar(cfg.preparar[0], cfg.preparar.slice(1));
    const r = spawnSync(c.comando, c.argumentos, {
      cwd: dir, ...c.opciones, encoding: "utf8", timeout: 300_000,
    });
    if (r.status !== 0) {
      return { framework, estado: "error", detalle: `la preparación falló: ${(r.stderr || r.stdout || "").trim().slice(0, 200)}` };
    }
  }

  const env = { ...process.env, PORT: String(puerto), PUERTO: String(puerto) };
  // Sustitución de marcadores: algunos servidores reciben el puerto por argumento
  // y no por variable de entorno.
  const arrancar = cfg.arrancar.map((a) =>
    String(a).replaceAll("${PUERTO}", String(puerto)).replaceAll("${PORT}", String(puerto)),
  );
  const c = preparar(arrancar[0], arrancar.slice(1));
  const hijo = spawn(c.comando, c.argumentos, {
    cwd: dir, env, ...c.opciones, stdio: ["ignore", "pipe", "pipe"],
  });
  let salida = "";
  hijo.stdout.on("data", (d) => (salida += d));
  hijo.stderr.on("data", (d) => (salida += d));

  try {
    const listo = await esperarPuerto(puerto, cfg.espera_ms ?? 30_000);
    if (!listo) {
      return { framework, estado: "error", detalle: `no escuchó en el puerto ${puerto}: ${salida.trim().slice(0, 200)}` };
    }

    const base = `http://127.0.0.1:${puerto}`;
    const fallos = [];
    for (const caso of contrato.casos) {
      const r = await comprobarCaso(base, caso);
      if (!r.ok) fallos.push(`${caso.nombre}: ${r.motivo}`);
    }
    return fallos.length
      ? { framework, estado: "fallo", detalle: fallos.join(" | ") }
      : { framework, estado: "ok", detalle: `${contrato.casos.length} casos` };
  } finally {
    matarArbol(hijo);
    await esperar(200);
  }
}

// ---------------------------------------------------------------- una clase

function localizar(ref) {
  const n = Number(ref);
  for (const parte of manifest.partes) {
    for (const clase of parte.clases) {
      if (clase.n === n || clase.slug === ref || clase.slug.startsWith(`${ref}-`)) {
        return { parte, clase, dir: path.join(CLASSES, parte.slug, clase.slug) };
      }
    }
  }
  return null;
}

async function verificarClase(ref, puertoBase = 4100) {
  const encontrada = localizar(ref);
  if (!encontrada) {
    console.error(`No existe la clase "${ref}".`);
    return { ok: false, resultados: [] };
  }
  const { clase, dir } = encontrada;
  const contrato = JSON.parse(fs.readFileSync(path.join(dir, "contrato.json"), "utf8"));

  console.log(`\nClase ${String(clase.n).padStart(3, "0")} — ${clase.titulo}`);

  if (contrato.tipo !== "http") {
    console.log(`  ⊘ contrato de tipo "${contrato.tipo}": este verificador solo ejecuta contratos http.`);
    return { ok: true, resultados: [] };
  }
  if (!contrato.casos.length) {
    console.log("  ⊘ sin casos todavía (clase en esqueleto).");
    return { ok: true, resultados: [] };
  }

  const resultados = [];
  let puerto = puertoBase;
  for (const framework of clase.elenco) {
    if (solo && framework !== solo) continue;
    const impl = path.join(dir, "implementaciones", framework);
    if (!fs.existsSync(impl)) {
      resultados.push({ framework, estado: "sin-implementar", detalle: "carpeta ausente" });
      continue;
    }
    resultados.push(await verificarImplementacion(impl, framework, contrato, puerto++));
  }

  const icono = { ok: "✔", fallo: "✘", error: "✘", omitida: "⊘", "sin-implementar": "·" };
  for (const r of resultados) {
    console.log(`  ${icono[r.estado]} ${r.framework.padEnd(20)} ${r.detalle}`);
  }

  const rotas = resultados.filter((r) => r.estado === "fallo" || r.estado === "error");
  return { ok: rotas.length === 0, resultados };
}

// ------------------------------------------------------------------ entrada

const refs = todas
  ? manifest.partes.flatMap((p) => p.clases.map((c) => String(c.n)))
  : [objetivo];

if (!refs[0]) {
  console.error("Uso: node scripts/run-class.mjs <n.º de clase> [--solo <framework>] | --todas");
  process.exit(2);
}

let fallos = 0;
const total = { ok: 0, fallo: 0, error: 0, omitida: 0, "sin-implementar": 0 };

for (const ref of refs) {
  const r = await verificarClase(ref);
  if (!r.ok) fallos++;
  for (const x of r.resultados) total[x.estado]++;
}

console.log(
  `\nRESUMEN: ${total.ok} verificadas · ${total.fallo + total.error} con fallo · ` +
    `${total.omitida} omitidas por falta de herramientas · ${total["sin-implementar"]} sin implementar`,
);

if (fallos) {
  console.error(`CLASS_RUN_FAILED: ${fallos} clases con implementaciones rotas`);
  process.exit(1);
}
console.log("CLASS_RUN_OK");
