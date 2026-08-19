import express from "express";

const app = express();
app.use(express.json({ limit: "64kb" }));

const tasks = new Map();
const idempotency = new Map();
let sequence = 1;

app.get("/health", (_request, response) => response.json({ status: "ok" }));
app.get("/tasks", (_request, response) => response.json({ items: [...tasks.values()] }));
app.get("/tasks/:taskId", (request, response) => {
  const task = tasks.get(request.params.taskId);
  if (!task) return response.status(404).json({ error: { code: "TASK_NOT_FOUND", message: "Task was not found" } });
  return response.json(task);
});
app.post("/tasks", (request, response) => {
  if (!request.is("application/json")) {
    return response.status(415).json({ error: { code: "UNSUPPORTED_MEDIA_TYPE", message: "Content-Type must be application/json" } });
  }
  const key = request.get("Idempotency-Key")?.trim();
  if (!key) return response.status(400).json({ error: { code: "IDEMPOTENCY_KEY_REQUIRED", message: "Idempotency-Key is required" } });
  if (idempotency.has(key)) return response.status(200).json(idempotency.get(key));
  const title = typeof request.body?.title === "string" ? request.body.title.trim() : "";
  if (title.length < 1 || title.length > 120) {
    return response.status(422).json({ error: { code: "VALIDATION_ERROR", message: "Title must contain 1 to 120 characters" } });
  }
  const task = { id: `task-${sequence++}`, title, completed: false, createdAt: new Date().toISOString() };
  tasks.set(task.id, task);
  idempotency.set(key, task);
  return response.status(201).json(task);
});

app.use((_request, response) => response.status(404).json({ error: { code: "ROUTE_NOT_FOUND", message: "Route was not found" } }));
app.use((_error, _request, response, _next) => response.status(400).json({ error: { code: "MALFORMED_JSON", message: "Request body is not valid JSON" } }));

app.listen(3001, "127.0.0.1", () => console.log("Express adapter listening on http://127.0.0.1:3001"));
