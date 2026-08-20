/**
 * TaskFlow — implementación de referencia sin framework.
 *
 * Usa solo módulos nativos del runtime a propósito: es el patrón de medida
 * contra el que se comparan las demás implementaciones. Todo lo que aquí se
 * escribe a mano es exactamente lo que un framework hará por ti más adelante,
 * y el módulo 02 del programa enseña a reconocer dónde.
 *
 * Cumple `contracts/taskflow/openapi.yaml` v2.0.0 y pasa
 * `contracts/taskflow/acceptance.test.mjs` sin modificación.
 */
import http from "node:http";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import process from "node:process";

const MAX_BODY_BYTES = 64 * 1024;
const TITLE_MAX = 120;
const PROBLEM_BASE = "https://vladimiracunadev-create.github.io/framework-ecosystems-labs/problems";

/** Catálogo cerrado de errores: el mismo que declara el contrato. */
const CATALOGO = {
  IDEMPOTENCY_KEY_REQUIRED: { status: 400, title: "Idempotency key required" },
  MALFORMED_JSON: { status: 400, title: "Malformed JSON" },
  TASK_NOT_FOUND: { status: 404, title: "Task not found" },
  ROUTE_NOT_FOUND: { status: 404, title: "Route not found" },
  METHOD_NOT_ALLOWED: { status: 405, title: "Method not allowed" },
  IDEMPOTENCY_KEY_REUSED: { status: 409, title: "Idempotency key reused" },
  BODY_TOO_LARGE: { status: 413, title: "Body too large" },
  UNSUPPORTED_MEDIA_TYPE: { status: 415, title: "Unsupported media type" },
  VALIDATION_ERROR: { status: 422, title: "Validation error" },
  INTERNAL_ERROR: { status: 500, title: "Internal error" },
};

const kebab = (code) => code.toLowerCase().replace(/_/g, "-");

function send(response, status, payload, headers = {}) {
  const body = JSON.stringify(payload);
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    "cache-control": "no-store",
    ...headers,
  });
  response.end(body);
}

/**
 * Emite un error según RFC 9457. Es el ÚNICO punto que construye respuestas de
 * error: si cada rama las armara por su cuenta, tarde o temprano una filtraría
 * una traza o cambiaría el formato sin que nadie lo note.
 */
function problem(response, code, { detail, instance, errors, headers } = {}) {
  const { status, title } = CATALOGO[code] ?? CATALOGO.INTERNAL_ERROR;
  const payload = { type: `${PROBLEM_BASE}/${kebab(code)}`, title, status, code };
  if (detail) payload.detail = detail;
  if (instance) payload.instance = instance;
  if (errors?.length) payload.errors = errors;
  send(response, status, payload, { "content-type": "application/problem+json; charset=utf-8", ...headers });
}

/**
 * Lee el cuerpo comprobando el límite MIENTRAS llega: comprobarlo al final
 * significa que la memoria ya se consumió.
 *
 * Se usan eventos y no `for await` a propósito. Salir de un `for await`
 * destruye el flujo, y destruir el flujo cierra el socket antes de que la
 * respuesta 413 salga: el cliente vería una conexión cortada en lugar del
 * error que explica qué pasó. Aquí solo se pausa la lectura.
 */
function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let cortado = false;

    request.on("data", (chunk) => {
      if (cortado) return;
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        cortado = true;
        request.pause();
        reject(Object.assign(new Error("body too large"), { code: "BODY_TOO_LARGE" }));
        return;
      }
      chunks.push(chunk);
    });

    request.on("end", () => {
      if (cortado) return;
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw.trim()) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(Object.assign(new Error("invalid json"), { code: "MALFORMED_JSON" }));
      }
    });

    request.on("error", (error) => {
      if (!cortado) reject(Object.assign(error, { code: "MALFORMED_JSON" }));
    });
  });
}

/** Validación por campo. Devolver el campo culpable no es un lujo del backend:
 *  sin él, una interfaz accesible no puede señalar el control que falló. */
export function validateCreateTask(input) {
  const errors = [];
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return [{ field: "", code: "BODY_NOT_OBJECT", detail: "The body must be a JSON object" }];
  }
  const { title } = input;
  if (typeof title !== "string") {
    errors.push({ field: "title", code: "TITLE_REQUIRED", detail: "title is required and must be a string" });
  } else if (title.trim().length === 0) {
    errors.push({ field: "title", code: "TITLE_EMPTY", detail: "title must not be blank" });
  } else if (title.trim().length > TITLE_MAX) {
    errors.push({ field: "title", code: "TITLE_TOO_LONG", detail: `title must not exceed ${TITLE_MAX} characters` });
  }
  return errors;
}

/**
 * Descarta el resto del cuerpo sin guardarlo, hasta un tope. Cortesía con el
 * cliente honesto que envió de más; límite firme frente al que no lo es.
 */
function drainAndClose(request, tope = MAX_BODY_BYTES * 10) {
  let descartado = 0;
  request.on("data", (chunk) => {
    descartado += chunk.length;
    if (descartado > tope) request.destroy();
  });
  request.resume();
}

export function createTaskServer() {
  const tasks = new Map();
  // Guarda la tarea y la huella del cuerpo: repetir la clave con otro cuerpo
  // es un error del cliente, no una repetición legítima.
  const idempotency = new Map();
  let sequence = 1;

  return http.createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const instance = url.pathname;
    const method = request.method ?? "GET";

    try {
      if (url.pathname === "/health") {
        if (method !== "GET") return problem(response, "METHOD_NOT_ALLOWED", { instance, headers: { allow: "GET" } });
        return send(response, 200, { status: "ok" });
      }

      if (url.pathname === "/tasks") {
        if (method === "GET") return send(response, 200, { items: [...tasks.values()] });
        if (method !== "POST") {
          return problem(response, "METHOD_NOT_ALLOWED", { instance, headers: { allow: "GET, POST" } });
        }

        const contentType = String(request.headers["content-type"] ?? "");
        if (!contentType.toLowerCase().startsWith("application/json")) {
          return problem(response, "UNSUPPORTED_MEDIA_TYPE", {
            instance,
            detail: "Content-Type must be application/json",
          });
        }

        const key = String(request.headers["idempotency-key"] ?? "").trim();
        if (!key) {
          return problem(response, "IDEMPOTENCY_KEY_REQUIRED", {
            instance,
            detail: "POST is not idempotent: send a client-generated Idempotency-Key",
          });
        }

        let input;
        try {
          input = await readBody(request);
        } catch (error) {
          const code = error.code ?? "MALFORMED_JSON";
          if (code === "BODY_TOO_LARGE") {
            // El cliente sigue enviando. Si se cierra el socket ahora, ve un
            // corte de conexión en vez del motivo, así que el resto se descarta
            // —sin acumularlo— hasta un tope, y solo entonces se corta.
            drainAndClose(request);
            return problem(response, code, { instance, headers: { connection: "close" } });
          }
          return problem(response, code, { instance });
        }

        const previous = idempotency.get(key);
        if (previous) {
          if (previous.fingerprint !== JSON.stringify(input)) {
            return problem(response, "IDEMPOTENCY_KEY_REUSED", {
              instance,
              detail: "The key was already used with a different request body",
            });
          }
          return send(response, 200, previous.task);
        }

        const errors = validateCreateTask(input);
        if (errors.length) {
          return problem(response, "VALIDATION_ERROR", { instance, detail: "The request body failed validation", errors });
        }

        const task = {
          id: `task-${sequence++}`,
          title: input.title.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
        };
        tasks.set(task.id, task);
        idempotency.set(key, { task, fingerprint: JSON.stringify(input) });
        return send(response, 201, task, { location: `/tasks/${task.id}` });
      }

      if (url.pathname.startsWith("/tasks/")) {
        if (method !== "GET") return problem(response, "METHOD_NOT_ALLOWED", { instance, headers: { allow: "GET" } });
        const id = decodeURIComponent(url.pathname.slice("/tasks/".length));
        const task = tasks.get(id);
        if (!task) return problem(response, "TASK_NOT_FOUND", { instance });
        return send(response, 200, task);
      }

      return problem(response, "ROUTE_NOT_FOUND", { instance });
    } catch {
      // Nunca se propaga el error original al cliente: el detalle interno se
      // registra, no se publica.
      return problem(response, "INTERNAL_ERROR", { instance });
    }
  });
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isMain) {
  const port = Number(process.env.PORT ?? 3000);
  const server = createTaskServer();
  server.listen(port, "127.0.0.1", () => {
    console.log(`TaskFlow reference listening on http://127.0.0.1:${port}`);
  });
  const cerrar = () => server.close(() => process.exit(0));
  process.on("SIGINT", cerrar);
  process.on("SIGTERM", cerrar);
}
