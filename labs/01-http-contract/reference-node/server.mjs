import http from "node:http";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";


const MAX_BODY_BYTES = 64 * 1024;


function sendJson(response, status, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    "cache-control": "no-store",
  });
  response.end(body);
}


function problem(response, status, code, message) {
  sendJson(response, status, { error: { code, message } });
}


async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      throw new Error("BODY_TOO_LARGE");
    }
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}


export function createTaskServer() {
  const tasks = new Map();
  const idempotency = new Map();
  let sequence = 1;

  return http.createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");

    try {
      if (request.method === "GET" && url.pathname === "/health") {
        return sendJson(response, 200, { status: "ok" });
      }

      if (request.method === "GET" && url.pathname === "/tasks") {
        return sendJson(response, 200, { items: [...tasks.values()] });
      }

      if (request.method === "GET" && url.pathname.startsWith("/tasks/")) {
        const id = decodeURIComponent(url.pathname.slice("/tasks/".length));
        const task = tasks.get(id);
        if (!task) {
          return problem(response, 404, "TASK_NOT_FOUND", "Task was not found");
        }
        return sendJson(response, 200, task);
      }

      if (request.method === "POST" && url.pathname === "/tasks") {
        const contentType = request.headers["content-type"] ?? "";
        if (!contentType.toLowerCase().startsWith("application/json")) {
          return problem(response, 415, "UNSUPPORTED_MEDIA_TYPE", "Content-Type must be application/json");
        }

        const key = request.headers["idempotency-key"]?.trim();
        if (!key) {
          return problem(response, 400, "IDEMPOTENCY_KEY_REQUIRED", "Idempotency-Key is required");
        }

        if (idempotency.has(key)) {
          return sendJson(response, 200, idempotency.get(key));
        }

        let input;
        try {
          input = await readJson(request);
        } catch (error) {
          const code = error.message === "BODY_TOO_LARGE" ? "BODY_TOO_LARGE" : "MALFORMED_JSON";
          return problem(response, 400, code, "Request body is not valid JSON");
        }

        const title = typeof input?.title === "string" ? input.title.trim() : "";
        if (title.length < 1 || title.length > 120) {
          return problem(response, 422, "VALIDATION_ERROR", "Title must contain 1 to 120 characters");
        }

        const task = {
          id: `task-${sequence++}`,
          title,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        tasks.set(task.id, task);
        idempotency.set(key, task);
        return sendJson(response, 201, task);
      }

      return problem(response, 404, "ROUTE_NOT_FOUND", "Route was not found");
    } catch {
      return problem(response, 500, "INTERNAL_ERROR", "Unexpected server error");
    }
  });
}


const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isMain) {
  const server = createTaskServer();
  server.listen(3000, "127.0.0.1", () => {
    console.log("TaskFlow reference listening on http://127.0.0.1:3000");
  });
  process.on("SIGINT", () => server.close(() => process.exit(0)));
}
