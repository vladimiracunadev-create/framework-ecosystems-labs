import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { once } from "node:events";
import { createTaskServer } from "./server.mjs";


const server = createTaskServer();
let baseUrl;


before(async () => {
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});


after(async () => {
  server.close();
  await once(server, "close");
});


test("health and empty collection", async () => {
  const health = await fetch(`${baseUrl}/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: "ok" });

  const tasks = await fetch(`${baseUrl}/tasks`);
  assert.deepEqual(await tasks.json(), { items: [] });
});


test("requires an idempotency key", async () => {
  const response = await fetch(`${baseUrl}/tasks`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title: "Learn contracts" }),
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error.code, "IDEMPOTENCY_KEY_REQUIRED");
});


test("creates once and reuses the result", async () => {
  const request = {
    method: "POST",
    headers: { "content-type": "application/json", "idempotency-key": "class-01" },
    body: JSON.stringify({ title: "  Compare frameworks  " }),
  };
  const created = await fetch(`${baseUrl}/tasks`, request);
  const createdBody = await created.json();
  assert.equal(created.status, 201);
  assert.equal(createdBody.title, "Compare frameworks");
  assert.equal(createdBody.completed, false);

  const repeated = await fetch(`${baseUrl}/tasks`, request);
  const repeatedBody = await repeated.json();
  assert.equal(repeated.status, 200);
  assert.equal(repeatedBody.id, createdBody.id);

  const found = await fetch(`${baseUrl}/tasks/${createdBody.id}`);
  assert.equal(found.status, 200);
  assert.equal((await found.json()).id, createdBody.id);
});


test("normalizes validation and not-found errors", async () => {
  const invalid = await fetch(`${baseUrl}/tasks`, {
    method: "POST",
    headers: { "content-type": "application/json", "idempotency-key": "invalid-01" },
    body: JSON.stringify({ title: "   " }),
  });
  assert.equal(invalid.status, 422);
  assert.equal((await invalid.json()).error.code, "VALIDATION_ERROR");

  const missing = await fetch(`${baseUrl}/tasks/does-not-exist`);
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).error.code, "TASK_NOT_FOUND");
});
