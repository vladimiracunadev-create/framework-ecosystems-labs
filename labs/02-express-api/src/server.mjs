/**
 * TaskFlow sobre Express.
 *
 * Mismo contrato, mismas pruebas de aceptación. Lo interesante de comparar esta
 * implementación con la referencia sin framework no es cuánto código se ahorra,
 * sino DÓNDE cambia el riesgo: aquí el análisis del cuerpo, el enrutado y el
 * orden de la cadena los decide Express, y los errores que produce hay que
 * traducirlos al catálogo del contrato en un único lugar.
 */
import express from "express";
import process from "node:process";

const TITLE_MAX = 120;
const PROBLEM_BASE = "https://vladimiracunadev-create.github.io/framework-ecosystems-labs/problems";

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

function problem(response, code, { detail, instance, errors, allow } = {}) {
  const { status, title } = CATALOGO[code] ?? CATALOGO.INTERNAL_ERROR;
  const payload = { type: `${PROBLEM_BASE}/${kebab(code)}`, title, status, code };
  if (detail) payload.detail = detail;
  if (instance) payload.instance = instance;
  if (errors?.length) payload.errors = errors;
  if (allow) response.set("Allow", allow);
  return response.status(status).type("application/problem+json").json(payload);
}

// Idéntica a la de la referencia: la regla de validación es del dominio, no del
// transporte, y se copia tal cual porque el contrato es el mismo.
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

export function createApp() {
  const app = express();
  const tasks = new Map();
  const idempotency = new Map();
  let sequence = 1;

  app.disable("x-powered-by");

  // El tipo de contenido se comprueba ANTES de analizar: si se deja a
  // express.json, un Content-Type ajeno pasa de largo con el cuerpo vacío y el
  // fallo aparece más tarde como un error de validación equivocado.
  app.post("/tasks", (request, response, next) => {
    if (!request.is("application/json")) {
      return problem(response, "UNSUPPORTED_MEDIA_TYPE", {
        instance: request.path,
        detail: "Content-Type must be application/json",
      });
    }
    return next();
  });

  app.use(express.json({ limit: "64kb" }));

  app.get("/health", (_request, response) => response.json({ status: "ok" }));
  app.get("/tasks", (_request, response) => response.json({ items: [...tasks.values()] }));

  app.get("/tasks/:taskId", (request, response) => {
    const task = tasks.get(request.params.taskId);
    if (!task) return problem(response, "TASK_NOT_FOUND", { instance: request.path });
    return response.json(task);
  });

  app.post("/tasks", (request, response) => {
    const key = String(request.get("Idempotency-Key") ?? "").trim();
    if (!key) {
      return problem(response, "IDEMPOTENCY_KEY_REQUIRED", {
        instance: request.path,
        detail: "POST is not idempotent: send a client-generated Idempotency-Key",
      });
    }

    const previous = idempotency.get(key);
    if (previous) {
      if (previous.fingerprint !== JSON.stringify(request.body)) {
        return problem(response, "IDEMPOTENCY_KEY_REUSED", {
          instance: request.path,
          detail: "The key was already used with a different request body",
        });
      }
      return response.json(previous.task);
    }

    const errors = validateCreateTask(request.body);
    if (errors.length) {
      return problem(response, "VALIDATION_ERROR", {
        instance: request.path,
        detail: "The request body failed validation",
        errors,
      });
    }

    const task = {
      id: `task-${sequence++}`,
      title: request.body.title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    tasks.set(task.id, task);
    idempotency.set(key, { task, fingerprint: JSON.stringify(request.body) });
    return response.status(201).location(`/tasks/${task.id}`).json(task);
  });

  // Métodos no admitidos sobre rutas que sí existen.
  app.all("/health", (request, response) => problem(response, "METHOD_NOT_ALLOWED", { instance: request.path, allow: "GET" }));
  app.all("/tasks", (request, response) => problem(response, "METHOD_NOT_ALLOWED", { instance: request.path, allow: "GET, POST" }));
  app.all("/tasks/:taskId", (request, response) => problem(response, "METHOD_NOT_ALLOWED", { instance: request.path, allow: "GET" }));

  app.use((request, response) => problem(response, "ROUTE_NOT_FOUND", { instance: request.path }));

  // Traductor único de errores. Aquí llegan los que produce el propio Express,
  // que no conoce el catálogo del contrato.
  app.use((error, request, response, _next) => {
    if (error?.type === "entity.too.large") {
      return problem(response, "BODY_TOO_LARGE", { instance: request.path });
    }
    if (error?.type === "entity.parse.failed" || error instanceof SyntaxError) {
      return problem(response, "MALFORMED_JSON", { instance: request.path });
    }
    return problem(response, "INTERNAL_ERROR", { instance: request.path });
  });

  return app;
}

if (process.env.NODE_ENV !== "test") {
  const port = Number(process.env.PORT ?? 3001);
  createApp().listen(port, "127.0.0.1", () => console.log(`Express adapter listening on http://127.0.0.1:${port}`));
}
