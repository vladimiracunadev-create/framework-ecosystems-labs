#!/usr/bin/env node
/**
 * Arranca una implementación de TaskFlow, espera a que responda y ejecuta
 * contra ella las pruebas de aceptación canónicas. Las mismas pruebas, sin
 * adaptador ni excepciones, para los cinco ecosistemas.
 *
 *   node scripts/run-acceptance.mjs                 lista los destinos
 *   node scripts/run-acceptance.mjs reference-node
 *   node scripts/run-acceptance.mjs express --prepare
 *   node scripts/run-acceptance.mjs --url http://127.0.0.1:8080
 */
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { root } from "./lib/sources.mjs";

const SUITE = path.join(root, "contracts/taskflow/acceptance.test.mjs");
const ARRANQUE_MAXIMO_MS = 180_000;

/**
 * `prepare` solo se ejecuta con `--prepare`: descarga dependencias y no debe
 * correr en cada iteración local.
 */
const DESTINOS = {
  "reference-node": {
    descripcion: "Referencia sin framework (solo el runtime)",
    puerto: 3000,
    cwd: "labs/01-http-contract/reference-node",
    comando: ["node", ["server.mjs"]],
  },
  express: {
    descripcion: "Express — framework minimalista de Node.js",
    puerto: 3001,
    cwd: "labs/02-express-api",
    prepare: ["corepack", ["pnpm", "install", "--ignore-workspace"]],
    comando: ["node", ["src/server.mjs"]],
  },
  fastapi: {
    descripcion: "FastAPI — validación derivada de los tipos",
    puerto: 3002,
    cwd: "labs/03-fastapi",
    prepare: ["python", ["-m", "pip", "install", "--quiet", "fastapi", "uvicorn"]],
    comando: ["python", ["-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "3002"]],
  },
  "spring-boot": {
    descripcion: "Spring Boot — contenedor de dependencias en la JVM",
    puerto: 3003,
    cwd: "labs/04-spring-boot",
    prepare: ["mvn", ["-B", "-q", "package", "-DskipTests"]],
    comando: ["java", ["-jar", "target/taskflow-spring-lab-0.1.0.jar"]],
  },
  aspnet: {
    descripcion: "ASP.NET Core — API mínima sobre .NET",
    puerto: 3004,
    cwd: "labs/05-aspnet-core",
    prepare: ["dotnet", ["build", "-c", "Release", "--nologo"]],
    comando: ["dotnet", ["run", "-c", "Release", "--no-build", "--nologo"]],
  },
};

const argumentos = process.argv.slice(2);
const indiceUrl = argumentos.indexOf("--url");
const urlDirecta = indiceUrl >= 0 ? argumentos[indiceUrl + 1] : null;
const conPreparacion = argumentos.includes("--prepare");
const nombre = argumentos.find((argumento) => !argumento.startsWith("--") && argumento !== urlDirecta);

function listar() {
  console.log("Destinos disponibles:\n");
  for (const [clave, destino] of Object.entries(DESTINOS)) {
    console.log(`  ${clave.padEnd(16)} ${destino.descripcion}`);
  }
  console.log("\n  node scripts/run-acceptance.mjs <destino> [--prepare]");
  console.log("  node scripts/run-acceptance.mjs --url http://host:puerto");
}

const esWindows = process.platform === "win32";

function ejecutar(comando, argumentosDelComando, opciones = {}) {
  return new Promise((resolver, rechazar) => {
    const hijo = spawn(comando, argumentosDelComando, {
      stdio: "inherit",
      // En Windows los lanzadores son archivos .cmd y no se ejecutan sin shell.
      shell: esWindows,
      ...opciones,
    });
    hijo.on("error", rechazar);
    hijo.on("exit", (codigo) => (codigo === 0 ? resolver() : rechazar(new Error(`${comando} terminó con código ${codigo}`))));
  });
}

async function esperarSalud(url) {
  const limite = Date.now() + ARRANQUE_MAXIMO_MS;
  let ultimoError = "sin intento";
  while (Date.now() < limite) {
    try {
      const respuesta = await fetch(`${url}/health`, { signal: AbortSignal.timeout(3000) });
      if (respuesta.ok) return;
      ultimoError = `HTTP ${respuesta.status}`;
    } catch (error) {
      ultimoError = error.message;
    }
    await new Promise((resolver) => setTimeout(resolver, 500));
  }
  throw new Error(`La implementación no respondió en ${ARRANQUE_MAXIMO_MS / 1000} s (${ultimoError})`);
}

function pruebas(url) {
  return ejecutar(process.execPath, ["--test", SUITE], {
    shell: false,
    env: { ...process.env, TASKFLOW_URL: url },
  });
}

if (!nombre && !urlDirecta) {
  listar();
  process.exit(0);
}

// Modo directo: la implementación ya está corriendo en otro sitio.
if (urlDirecta) {
  console.log(`▶ Pruebas de aceptación contra ${urlDirecta}`);
  await pruebas(urlDirecta.replace(/\/$/, ""));
  process.exit(0);
}

const destino = DESTINOS[nombre];
if (!destino) {
  console.error(`Destino desconocido: ${nombre}\n`);
  listar();
  process.exit(1);
}

const cwd = path.join(root, destino.cwd);
const url = `http://127.0.0.1:${destino.puerto}`;

if (conPreparacion && destino.prepare) {
  console.log(`▶ Preparando ${nombre}: ${destino.prepare[0]} ${destino.prepare[1].join(" ")}`);
  await ejecutar(destino.prepare[0], destino.prepare[1], { cwd });
}

console.log(`▶ Arrancando ${nombre} en ${url}`);
const servidor = spawn(destino.comando[0], destino.comando[1], {
  cwd,
  stdio: ["ignore", "inherit", "inherit"],
  shell: esWindows,
  env: { ...process.env, PORT: String(destino.puerto), ASPNETCORE_URLS: url, SERVER_PORT: String(destino.puerto) },
});

let salioSolo = null;
servidor.on("exit", (codigo) => {
  salioSolo = codigo;
});

/** Se cierra el proceso pase lo que pase: un servidor huérfano bloquea el puerto. */
function detener() {
  if (salioSolo !== null || servidor.killed) return;
  if (esWindows) {
    // En Windows el hijo puede haber lanzado su propio subproceso.
    spawn("taskkill", ["/pid", String(servidor.pid), "/f", "/t"], { stdio: "ignore", shell: true });
  } else {
    servidor.kill("SIGTERM");
  }
}
process.on("exit", detener);
process.on("SIGINT", () => {
  detener();
  process.exit(130);
});

try {
  await esperarSalud(url);
  console.log(`▶ Pruebas de aceptación contra ${nombre}\n`);
  await pruebas(url);
  console.log(`\n✔ ${nombre} cumple el contrato canónico.`);
} catch (error) {
  console.error(`\n✘ ${nombre}: ${error.message}`);
  process.exitCode = 1;
} finally {
  detener();
}
