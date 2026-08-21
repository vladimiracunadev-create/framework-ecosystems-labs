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
 *   node scripts/run-class.mjs --cambiadas origin/main
 *
 * `--cambiadas` existe por una razón medida: una clase con diez
 * implementaciones tarda unos cuatro minutos, casi todo en descargar
 * dependencias de Maven, Composer y Bundler. Ejecutarlas todas en cada empuje
 * costaría horas. En integración continua se ejecutan las clases que el cambio
 * toca; el barrido completo va aparte, por horario o a mano.
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
const cambiadasIdx = args.indexOf("--cambiadas");
const base = cambiadasIdx >= 0 ? args[cambiadasIdx + 1] : null;
const soloIdx = args.indexOf("--solo");
const solo = soloIdx >= 0 ? args[soloIdx + 1] : null;
const objetivo = args.find((a) => !a.startsWith("--") && a !== solo && a !== base);

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

/**
 * Extrae de la salida de un compilador las líneas que sirven para diagnosticar.
 *
 * Un `mvn` o un `dotnet build` escriben cientos de líneas y solo unas pocas
 * dicen qué falló y dónde. Quedarse con las primeras 160 letras de todo el
 * volcado deja mensajes inútiles como «COMPILATION ERROR :».
 */
function lineasDeError(salida) {
  const utiles = salida
    .trim()
    .split(/\r?\n/)
    // `Exception` y `Traceback` no llevan la palabra «error» y son justo lo que
    // imprime un servidor al morirse. Sin ellas, un cierre a mitad de la
    // ejecución llegaba al informe como cuatro líneas de `info:` inútiles.
    .filter((linea) =>
      /error|Error|ERROR|xception|Traceback|FAIL|Fatal|\.java:|\.cs\(|\.go:|warning CS/.test(linea),
    )
    .slice(0, 8);
  const texto = (utiles.length ? utiles : salida.trim().split(/\r?\n/).slice(0, 4)).join(" | ");
  return texto.slice(0, 900);
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

/**
 * Mata el proceso y TODOS sus descendientes.
 *
 * Matar solo al proceso lanzado no basta: `go run`, `mvn` y `dotnet run`
 * compilan y luego ejecutan el binario resultante como hijo. Al morir el padre,
 * el binario sigue vivo y con el puerto ocupado — y la clase siguiente acaba
 * probando el servidor de la anterior sin que nada avise. Es exactamente lo que
 * pasó con Gin en la primera ejecución completa en integración continua.
 *
 * En Windows lo resuelve `taskkill /t`; en POSIX hace falta que el hijo tenga
 * su propio grupo de procesos (`detached: true`) para poder matar el grupo
 * entero con un pid negativo.
 */
function matarArbol(hijo) {
  if (!hijo || hijo.exitCode !== null) return;
  if (esWindows) {
    spawnSync("taskkill", ["/pid", String(hijo.pid), "/t", "/f"], { stdio: "ignore" });
    return;
  }
  try {
    process.kill(-hijo.pid, "SIGTERM");
  } catch {
    try {
      hijo.kill("SIGKILL");
    } catch {
      // El proceso ya había muerto.
    }
  }
}

// ------------------------------------------------------------ comprobación

/**
 * Comparación estructural, no textual.
 *
 * En JSON un objeto es un conjunto NO ordenado de pares [@rfc8259], así que dos
 * respuestas con las mismas claves en distinto orden son la misma respuesta.
 * Comparar por `JSON.stringify` haría fallar a los frameworks que serializan
 * ordenando claves —Flask, por ejemplo— por una diferencia que no existe.
 */
function igualEnProfundidad(real, esperado) {
  if (esperado === null || typeof esperado !== "object") return real === esperado;
  if (Array.isArray(esperado)) {
    return (
      Array.isArray(real) &&
      real.length === esperado.length &&
      esperado.every((v, i) => igualEnProfundidad(real[i], v))
    );
  }
  if (real === null || typeof real !== "object" || Array.isArray(real)) return false;
  const clavesEsperadas = Object.keys(esperado);
  const clavesReales = Object.keys(real);
  if (clavesEsperadas.length !== clavesReales.length) return false;
  return clavesEsperadas.every(
    (k) => Object.hasOwn(real, k) && igualEnProfundidad(real[k], esperado[k]),
  );
}

/**
 * Comparación por SUBCONJUNTO, a cualquier profundidad.
 *
 * Comprueba que lo esperado está dentro de lo real, sin exigir que no haya nada
 * más. Es lo que hace falta cuando parte de la respuesta es propia del framework
 * y no del contrato: en la clase 040, el `detalle` legible de un error de
 * validación lo redacta cada framework en sus palabras —y en su idioma—,
 * mientras que el `codigo` es el que el cliente compara.
 */
function contieneEnProfundidad(real, esperado) {
  if (esperado === null || typeof esperado !== "object") return real === esperado;
  if (Array.isArray(esperado)) {
    return (
      Array.isArray(real) &&
      real.length === esperado.length &&
      esperado.every((v, i) => contieneEnProfundidad(real[i], v))
    );
  }
  if (real === null || typeof real !== "object" || Array.isArray(real)) return false;
  return Object.entries(esperado).every(
    ([k, v]) => Object.hasOwn(real, k) && contieneEnProfundidad(real[k], v),
  );
}

function normalizarCabecera(v) {
  return String(v ?? "").split(";")[0].trim().toLowerCase();
}

/**
 * Busca en los `Set-Cookie` de la respuesta la cookie con ese nombre.
 *
 * `Set-Cookie` no se puede leer con `headers.get`: es la única cabecera que
 * puede aparecer varias veces sin que sus valores se puedan unir por comas
 * —las fechas de `Expires` llevan comas dentro [@rfc6265]— y por eso `fetch`
 * le dedica un método propio.
 */
function extraerCookie(res, nombre) {
  for (const cruda of res.headers.getSetCookie()) {
    const [par, ...resto] = cruda.split(";").map((s) => s.trim());
    const separador = par.indexOf("=");
    if (separador < 0 || par.slice(0, separador) !== nombre) continue;
    return { valor: par.slice(separador + 1), atributos: resto.map((a) => a.toLowerCase()) };
  }
  return null;
}

/**
 * Una cookie está «borrada» si el servidor le puso caducidad en el pasado.
 *
 * No hay una sola forma de hacerlo: unos frameworks envían `Max-Age=0` y
 * otros `Expires` con una fecha de 1970. Las dos significan lo mismo para el
 * navegador [@rfc6265], así que el contrato acepta las dos.
 */
function cookieBorrada(cookie) {
  if (cookie.atributos.some((a) => /^max-age=(0|-\d+)$/.test(a))) return true;
  const expira = cookie.atributos.find((a) => a.startsWith("expires="));
  if (!expira) return false;
  const fecha = Date.parse(expira.slice("expires=".length));
  return !Number.isNaN(fecha) && fecha <= Date.now();
}

async function comprobarCaso(baseUrl, caso, tarro) {
  const p = caso.peticion ?? {};
  const url = new URL(p.ruta ?? "/", baseUrl);
  const init = { method: p.metodo ?? "GET", headers: p.cabeceras ?? {}, redirect: "manual" };

  // Tarro de cookies EXPLÍCITO. `fetch` no guarda cookies entre peticiones, y
  // eso aquí es una ventaja: cada caso declara si viaja con las cookies
  // guardadas (`cookies: true`) y solo los casos marcados con
  // `guardar_cookies` escriben en el tarro. Así un caso puede reenviar
  // deliberadamente una cookie que el servidor ya dio por muerta — que es
  // justo lo que hace un atacante con una cookie robada.
  if (p.cookies && tarro?.size && init.headers.cookie === undefined) {
    init.headers = {
      ...init.headers,
      cookie: [...tarro].map(([nombre, valor]) => `${nombre}=${valor}`).join("; "),
    };
  }
  if (p.cuerpo !== undefined) {
    init.body = typeof p.cuerpo === "string" ? p.cuerpo : JSON.stringify(p.cuerpo);
    init.headers = { "content-type": "application/json", ...init.headers };
  } else if (p.multipart) {
    // El `content-type` de multipart lleva un delimitador generado: lo pone
    // `fetch` a partir del FormData, y ponerlo a mano lo rompería.
    const formulario = new FormData();
    for (const [campo, valor] of Object.entries(p.multipart)) {
      if (typeof valor === "string") {
        formulario.append(campo, valor);
        continue;
      }
      const contenido =
        valor.bytes !== undefined ? "x".repeat(valor.bytes) : (valor.contenido ?? "");
      formulario.append(
        campo,
        new Blob([contenido], { type: valor.tipo ?? "application/octet-stream" }),
        valor.nombre ?? "archivo.bin",
      );
    }
    init.body = formulario;
  }

  let res;
  try {
    res = await fetch(url, init);
  } catch (error) {
    return { ok: false, motivo: `la petición falló: ${error.message}` };
  }

  if (caso.guardar_cookies && tarro) {
    for (const cruda of res.headers.getSetCookie()) {
      const [par] = cruda.split(";");
      const separador = par.indexOf("=");
      if (separador < 0) continue;
      const nombre = par.slice(0, separador).trim();
      const cookie = extraerCookie(res, nombre);
      if (cookieBorrada(cookie)) tarro.delete(nombre);
      else tarro.set(nombre, cookie.valor);
    }
  }

  const e = caso.esperado ?? {};
  const fallos = [];

  // Comprobación de UNA cookie de la respuesta: que existe, qué atributos
  // lleva, y qué NO lleva dentro. Los atributos son el contrato de seguridad
  // —`HttpOnly` y `SameSite` no son decoración— y el valor no debe dejar leer
  // ni el usuario ni la contraseña: la cookie identifica, no cuenta.
  if (e.cookie !== undefined) {
    const cookie = extraerCookie(res, e.cookie.nombre);
    if (!cookie) {
      fallos.push(`no hay Set-Cookie para "${e.cookie.nombre}"`);
    } else {
      for (const atributo of e.cookie.atributos ?? []) {
        if (!cookie.atributos.includes(atributo)) {
          fallos.push(`la cookie "${e.cookie.nombre}" no lleva el atributo ${atributo}`);
        }
      }
      for (const fragmento of e.cookie.valor_no_contiene ?? []) {
        if (cookie.valor.toLowerCase().includes(String(fragmento).toLowerCase())) {
          fallos.push(`el valor de la cookie deja leer "${fragmento}"`);
        }
      }
      if (e.cookie.valor_distinto !== undefined && cookie.valor === e.cookie.valor_distinto) {
        fallos.push(`la cookie conserva el valor que trajo el cliente ("${e.cookie.valor_distinto}")`);
      }
      if (e.cookie.borrada && !cookieBorrada(cookie)) {
        fallos.push(`la cookie "${e.cookie.nombre}" no se borra: sin Max-Age=0 ni Expires en el pasado`);
      }
    }
  }

  if (e.estado !== undefined && res.status !== e.estado) {
    fallos.push(`estado ${res.status}, esperado ${e.estado}`);
  }

  // A veces el estándar admite VARIOS códigos y elegir uno sería inventarse el
  // contrato. La respuesta a una comprobación previa de CORS, por ejemplo, solo
  // tiene que ser un 2xx: Express usa 204 y Starlette 200, y los dos cumplen.
  if (e.estado_en !== undefined && !e.estado_en.includes(res.status)) {
    fallos.push(`estado ${res.status}, esperado uno de ${e.estado_en.join(", ")}`);
  }

  for (const [k, v] of Object.entries(e.cabeceras ?? {})) {
    const real = normalizarCabecera(res.headers.get(k));
    if (real !== String(v).toLowerCase()) {
      fallos.push(`cabecera ${k}: "${real}", esperada "${v}"`);
    }
  }

  // Algunas cabeceras son LISTAS de directivas separadas por comas
  // —`Cache-Control`, `Vary`, `Allow`— y su orden no significa nada. Exigir
  // igualdad de cadena sobre ellas mide la normalización del framework, no el
  // comportamiento: Symfony añade `private` a Cache-Control por omisión, y eso
  // no hace incorrecta la respuesta. Para esas cabeceras se comprueba que la
  // directiva esté presente.
  // Comprobar que una cabecera NO está también es parte del contrato: la
  // ausencia de `Content-Length` es lo que distingue una respuesta troceada de
  // una construida entera antes de enviarla.
  for (const k of e.cabecera_presente ?? []) {
    if (res.headers.get(k) === null) {
      fallos.push(`falta la cabecera ${k}`);
    }
  }

  for (const k of e.cabecera_ausente ?? []) {
    if (res.headers.get(k) !== null) {
      fallos.push(`cabecera ${k} presente ("${res.headers.get(k)}") y debía estar ausente`);
    }
  }

  for (const [k, v] of Object.entries(e.cabeceras_contienen ?? {})) {
    const crudo = String(res.headers.get(k) ?? "").toLowerCase();
    const partes = crudo.split(",").map((x) => x.trim()).filter(Boolean);
    if (!partes.includes(String(v).toLowerCase())) {
      fallos.push(`cabecera ${k}: "${crudo}" no contiene la directiva "${v}"`);
    }
  }

  if (e.cuerpo_contiene !== undefined) {
    // Comprobación por SUBCADENA. Hace falta cuando dos frameworks producen el
    // mismo hecho con estructuras distintas: en la clase 042, los cuatro
    // publican el límite de longitud en su documento de OpenAPI y ninguno lo
    // anida igual. Lo que el contrato exige es que el límite ESTÉ, no dónde.
    const texto = await res.text();
    for (const fragmento of e.cuerpo_contiene) {
      if (!texto.includes(fragmento)) {
        fallos.push(`el cuerpo no contiene "${fragmento}"`);
      }
    }
  } else if (e.cuerpo !== undefined) {
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
    if (!igualEnProfundidad(cuerpo, e.json)) {
      fallos.push(`json ${JSON.stringify(cuerpo)}, esperado ${JSON.stringify(e.json)}`);
    }
  } else if (e.json_contiene !== undefined) {
    // Comparación PARCIAL. Hace falta cuando parte de la respuesta no es
    // determinista —un identificador generado, un instante— y exigir el objeto
    // completo obligaría a predecir lo impredecible.
    let cuerpo;
    try {
      cuerpo = await res.json();
    } catch {
      return { ok: false, motivo: "la respuesta no es JSON válido" };
    }
    for (const [clave, valor] of Object.entries(e.json_contiene)) {
      if (!contieneEnProfundidad(cuerpo?.[clave], valor)) {
        fallos.push(
          `json.${clave} = ${JSON.stringify(cuerpo?.[clave])}, no contiene ${JSON.stringify(valor)}`,
        );
      }
    }
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

  // `preparar` admite un solo comando (array de cadenas) o varios (array de
  // arrays). Varios hacen falta más a menudo de lo que parece: instalar
  // dependencias y, además, dejar el estado limpio antes de arrancar.
  if (cfg.preparar) {
    const pasos = Array.isArray(cfg.preparar[0]) ? cfg.preparar : [cfg.preparar];
    for (const paso of pasos) {
      const c = preparar(paso[0], paso.slice(1));
      const r = spawnSync(c.comando, c.argumentos, {
        cwd: dir, ...c.opciones, encoding: "utf8", timeout: 300_000,
      });
      if (r.status !== 0) {
        return {
          framework,
          estado: "error",
          // Se filtran las líneas que mencionan un error y se conservan hasta
          // 900 caracteres. Truncar a 160 dejaba mensajes como «COMPILATION
          // ERROR :» sin el archivo ni la línea, que obliga a abrir el registro
          // completo de integración continua para saber qué pasó.
          detalle:
            `la preparación falló en \`${paso.join(" ")}\`: ` +
            lineasDeError(r.stderr || r.stdout || ""),
        };
      }
    }
  }

  const env = { ...process.env, PORT: String(puerto), PUERTO: String(puerto) };
  // Sustitución de marcadores: algunos servidores reciben el puerto por argumento
  // y no por variable de entorno.
  const arrancar = cfg.arrancar.map((a) =>
    String(a).replaceAll("${PUERTO}", String(puerto)).replaceAll("${PORT}", String(puerto)),
  );
  // Si el puerto ya está ocupado, arrancar aquí probaría el servidor de otro
  // — un falso verde o un falso rojo, según lo que hubiera al otro lado.
  if (await puertoAbierto(puerto)) {
    return {
      framework,
      estado: "error",
      detalle: `el puerto ${puerto} ya estaba ocupado: se habría probado otro servidor`,
    };
  }

  const c = preparar(arrancar[0], arrancar.slice(1));
  const hijo = spawn(c.comando, c.argumentos, {
    cwd: dir, env, ...c.opciones, stdio: ["ignore", "pipe", "pipe"],
    // Grupo de procesos propio, para poder matar al hijo y a sus descendientes.
    detached: !esWindows,
  });
  let salida = "";
  hijo.stdout.on("data", (d) => (salida += d));
  hijo.stderr.on("data", (d) => (salida += d));

  try {
    const listo = await esperarPuerto(puerto, cfg.espera_ms ?? 30_000);
    if (!listo) {
      return {
        framework,
        estado: "error",
        detalle: `no escuchó en el puerto ${puerto}: ${lineasDeError(salida)}`,
      };
    }

    const base = `http://127.0.0.1:${puerto}`;
    const fallos = [];
    // Un tarro de cookies por implementación: los casos que declaran
    // `guardar_cookies` escriben en él y los que declaran `cookies: true`
    // viajan con su contenido. Nace vacío en cada arranque.
    const tarro = new Map();
    for (const caso of contrato.casos) {
      const r = await comprobarCaso(base, caso, tarro);
      if (!r.ok) fallos.push(`${caso.nombre}: ${r.motivo}`);
    }
    if (!fallos.length) {
      return { framework, estado: "ok", detalle: `${contrato.casos.length} casos` };
    }

    // Si el servidor se murió a mitad, los casos solo saben decir «la petición
    // falló». Lo que explica por qué está en SU salida, y hasta ahora se tiraba
    // a la basura: solo se leía cuando fallaba el arranque.
    const murio = hijo.exitCode !== null || hijo.signalCode !== null;
    const contexto = murio
      ? ` || el servidor terminó por su cuenta (código ${hijo.exitCode}): ${lineasDeError(salida)}`
      : "";
    return { framework, estado: "fallo", detalle: fallos.join(" | ") + contexto };
  } finally {
    matarArbol(hijo);
    // No basta con pedir la muerte: hay que esperar a que el puerto se libere,
    // o la siguiente implementación se encuentra el puerto ocupado.
    for (let i = 0; i < 25 && (await puertoAbierto(puerto)); i++) {
      await esperar(200);
    }
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

/** Clases cuyo directorio aparece en el diff contra la referencia dada. */
function clasesCambiadas(referencia) {
  const r = spawnSync("git", ["diff", "--name-only", `${referencia}...HEAD`], { encoding: "utf8" });
  if (r.status !== 0) {
    console.error(`No se pudo comparar con "${referencia}": ${(r.stderr ?? "").trim()}`);
    process.exit(2);
  }
  const tocados = r.stdout.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const encontradas = new Set();
  for (const parte of manifest.partes) {
    for (const clase of parte.clases) {
      const prefijo = `classes/${parte.slug}/${clase.slug}/`;
      if (tocados.some((t) => t.replaceAll("\\", "/").startsWith(prefijo))) {
        encontradas.add(String(clase.n));
      }
    }
  }
  return [...encontradas];
}

let refs;
if (todas) {
  refs = manifest.partes.flatMap((p) => p.clases.map((c) => String(c.n)));
} else if (base) {
  refs = clasesCambiadas(base);
  if (!refs.length) {
    console.log(`Ninguna clase cambió respecto a ${base}: nada que ejecutar.`);
    console.log("CLASS_RUN_OK");
    process.exit(0);
  }
  console.log(`Clases tocadas por el cambio: ${refs.join(", ")}`);
} else {
  refs = [objetivo];
}

if (!refs[0]) {
  console.error(
    "Uso: node scripts/run-class.mjs <n.º de clase> [--solo <framework>] | --todas | --cambiadas <ref>",
  );
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
