/**
 * Pruebas unitarias de la referencia.
 *
 * Complementan a `contracts/taskflow/acceptance.test.mjs`, que comprueba el
 * contrato desde fuera: aquí se comprueban las decisiones internas que el
 * contrato no ve —validación por campo, límite de cuerpo, cierre correcto—
 * y que serían igual de ciertas con otro transporte.
 */
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createTaskServer, validateCreateTask } from "./server.mjs";

let servidor;
let base;

before(async () => {
  servidor = createTaskServer();
  await new Promise((resolver) => servidor.listen(0, "127.0.0.1", resolver));
  base = `http://127.0.0.1:${servidor.address().port}`;
});

after(() => new Promise((resolver) => servidor.close(resolver)));

const crear = (body, key = `u-${Math.random().toString(36).slice(2)}`) =>
  fetch(`${base}/tasks`, {
    method: "POST",
    headers: { "content-type": "application/json", "idempotency-key": key },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

// ------------------------------------------------- validación, sin servidor

test("la validación es una función pura y se prueba sin abrir un puerto", () => {
  assert.deepEqual(validateCreateTask({ title: "válido" }), []);
  assert.equal(validateCreateTask({}).at(0).code, "TITLE_REQUIRED");
  assert.equal(validateCreateTask({ title: "   " }).at(0).code, "TITLE_EMPTY");
  assert.equal(validateCreateTask({ title: "x".repeat(121) }).at(0).code, "TITLE_TOO_LONG");
  assert.equal(validateCreateTask(null).at(0).code, "BODY_NOT_OBJECT");
  assert.equal(validateCreateTask([]).at(0).code, "BODY_NOT_OBJECT");
});

test("cada error de validación nombra su campo", () => {
  for (const entrada of [{}, { title: "" }, { title: "x".repeat(200) }, { title: 7 }]) {
    const [error] = validateCreateTask(entrada);
    assert.equal(error.field, "title", `la interfaz no podría señalar el control para ${JSON.stringify(entrada)}`);
  }
});

test("el límite del título es inclusivo en 120", () => {
  assert.deepEqual(validateCreateTask({ title: "y".repeat(120) }), []);
  assert.equal(validateCreateTask({ title: "y".repeat(121) }).length, 1);
});

// ------------------------------------------------------ comportamiento HTTP

test("GET /health no depende del estado almacenado", async () => {
  const respuesta = await fetch(`${base}/health`);
  assert.equal(respuesta.status, 200);
  assert.deepEqual(await respuesta.json(), { status: "ok" });
});

test("crear devuelve 201 con Location y el recurso queda accesible ahí", async () => {
  const respuesta = await crear({ title: "Referencia" });
  assert.equal(respuesta.status, 201);
  const location = respuesta.headers.get("location");
  const tarea = await respuesta.json();
  assert.equal(location, `/tasks/${tarea.id}`);
  assert.equal((await fetch(`${base}${location}`)).status, 200);
});

test("los errores viajan como application/problem+json", async () => {
  const respuesta = await fetch(`${base}/tasks/inexistente`);
  assert.match(respuesta.headers.get("content-type") ?? "", /^application\/problem\+json/);
  const cuerpo = await respuesta.json();
  assert.deepEqual(Object.keys(cuerpo).sort(), ["code", "instance", "status", "title", "type"]);
  assert.equal(cuerpo.code, "TASK_NOT_FOUND");
});

test("un cuerpo por encima del límite se corta durante la lectura", async () => {
  // 64 KiB es el límite; se envía holgadamente por encima para que el corte
  // ocurra mientras llega y no después de haberlo acumulado entero.
  const respuesta = await crear({ title: "z".repeat(200_000) });
  assert.equal(respuesta.status, 413);
  assert.equal((await respuesta.json()).code, "BODY_TOO_LARGE");
  assert.equal((await fetch(`${base}/health`)).status, 200, "el proceso sigue sano tras rechazar el cuerpo");
});

test("un JSON malformado produce 400 y no una excepción sin controlar", async () => {
  const respuesta = await crear("{no es json");
  assert.equal(respuesta.status, 400);
  assert.equal((await respuesta.json()).code, "MALFORMED_JSON");
});

test("la misma clave con distinto cuerpo es un conflicto, no una repetición", async () => {
  const key = "conflicto-1";
  assert.equal((await crear({ title: "original" }, key)).status, 201);
  assert.equal((await crear({ title: "original" }, key)).status, 200);
  const conflicto = await crear({ title: "distinto" }, key);
  assert.equal(conflicto.status, 409);
  assert.equal((await conflicto.json()).code, "IDEMPOTENCY_KEY_REUSED");
});

test("un método no admitido responde 405 y declara Allow", async () => {
  const respuesta = await fetch(`${base}/tasks`, { method: "PUT" });
  assert.equal(respuesta.status, 405);
  assert.equal(respuesta.headers.get("allow"), "GET, POST");
});

test("ningún error de la referencia expone rutas ni trazas", async () => {
  const respuestas = await Promise.all([
    fetch(`${base}/ninguna`),
    fetch(`${base}/tasks/inexistente`),
    crear("{roto"),
    fetch(`${base}/tasks`, { method: "DELETE" }),
  ]);
  for (const respuesta of respuestas) {
    const texto = JSON.stringify(await respuesta.json());
    assert.ok(!/node_modules|[A-Za-z]:\\|\bat\s+\w+\s+\(/.test(texto), `filtra el interior: ${texto}`);
  }
});
