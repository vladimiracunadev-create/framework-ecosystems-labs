/**
 * Pruebas de aceptación de TaskFlow.
 *
 * Estas pruebas son el examen del programa. Se ejecutan **sin modificación**
 * contra cualquier implementación, en cualquier lenguaje: solo hablan HTTP.
 * Si una implementación necesita que se cambie una de ellas para pasar, la
 * comparación entre ecosistemas deja de significar nada.
 *
 *   node scripts/run-acceptance.mjs reference-node
 *   TASKFLOW_URL=http://127.0.0.1:3001 node --test contracts/taskflow/acceptance.test.mjs
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import process from "node:process";

const BASE = (process.env.TASKFLOW_URL ?? "").replace(/\/$/, "");
if (!BASE) {
  throw new Error("Falta TASKFLOW_URL. Usa scripts/run-acceptance.mjs o expórtala a mano.");
}

const JSON_HEADERS = { "content-type": "application/json" };
let contador = 0;
/** Cada caso usa su propia clave: reutilizarla entre pruebas las acopla. */
const clave = () => `acc-${process.pid}-${++contador}`;

const crear = (titulo, { key = clave(), headers = {}, body } = {}) =>
  fetch(`${BASE}/tasks`, {
    method: "POST",
    headers: { ...JSON_HEADERS, "idempotency-key": key, ...headers },
    body: body ?? JSON.stringify({ title: titulo }),
  });

/**
 * Comprobación transversal del sobre de error. Se aplica a TODA respuesta de
 * error del contrato: un error mal formado es un incumplimiento aunque el
 * código de estado sea el correcto.
 */
async function problema(respuesta, { status, code }) {
  assert.equal(respuesta.status, status, `se esperaba ${status} y llegó ${respuesta.status}`);
  const tipoContenido = respuesta.headers.get("content-type") ?? "";
  assert.ok(
    tipoContenido.startsWith("application/problem+json"),
    `los errores viajan como application/problem+json, no como «${tipoContenido}»`,
  );
  const cuerpo = await respuesta.json();
  for (const miembro of ["type", "title", "status", "code"]) {
    assert.ok(cuerpo[miembro] !== undefined, `falta el miembro obligatorio «${miembro}» del problema`);
  }
  assert.match(String(cuerpo.type), /^https?:\/\//, "type debe ser un URI resoluble");
  assert.equal(cuerpo.status, status, "el miembro status debe coincidir con el código HTTP");
  assert.equal(cuerpo.code, code);

  // Un error nunca expone el interior del servidor.
  const serializado = JSON.stringify(cuerpo);
  for (const filtracion of [/\bat\s+\w+\s+\(/, /node_modules/, /[A-Za-z]:\\/, /\/(usr|home|var)\//, /SELECT\s+.*\s+FROM/i]) {
    assert.ok(!filtracion.test(serializado), `el error filtra detalles internos: ${serializado.slice(0, 160)}`);
  }
  return cuerpo;
}

// --------------------------------------------------------------------- salud

test("GET /health responde 200 y declara el estado", async () => {
  const respuesta = await fetch(`${BASE}/health`);
  assert.equal(respuesta.status, 200);
  assert.deepEqual(await respuesta.json(), { status: "ok" });
});

// ------------------------------------------------------------------ colección

test("GET /tasks devuelve una colección con items", async () => {
  const respuesta = await fetch(`${BASE}/tasks`);
  assert.equal(respuesta.status, 200);
  const cuerpo = await respuesta.json();
  assert.ok(Array.isArray(cuerpo.items), "la colección se envuelve en items");
});

// --------------------------------------------------------------------- crear

test("POST /tasks válido responde 201, cabecera Location y la tarea creada", async () => {
  const respuesta = await crear("Comparar dos ecosistemas");
  assert.equal(respuesta.status, 201);
  const location = respuesta.headers.get("location");
  assert.ok(location, "un 201 sin Location obliga al cliente a adivinar dónde quedó el recurso");
  const tarea = await respuesta.json();
  assert.equal(typeof tarea.id, "string");
  assert.equal(tarea.title, "Comparar dos ecosistemas");
  assert.equal(tarea.completed, false);
  assert.ok(!Number.isNaN(Date.parse(tarea.createdAt)), "createdAt debe ser una fecha válida");
  assert.equal(location, `/tasks/${tarea.id}`);
});

test("POST /tasks recorta los espacios del título", async () => {
  const tarea = await (await crear("   Con espacios   ")).json();
  assert.equal(tarea.title, "Con espacios");
});

test("la tarea creada se puede recuperar por su Location", async () => {
  const creada = await crear("Recuperable");
  const location = creada.headers.get("location");
  const respuesta = await fetch(`${BASE}${location}`);
  assert.equal(respuesta.status, 200);
  assert.deepEqual(await respuesta.json(), await creada.json());
});

// --------------------------------------------------------------- idempotencia

test("repetir la misma clave de idempotencia no crea una segunda tarea", async () => {
  const key = clave();
  const primera = await crear("Una sola vez", { key });
  const segunda = await crear("Una sola vez", { key });

  assert.equal(primera.status, 201);
  assert.equal(segunda.status, 200, "la repetición se reconoce, no se vuelve a crear");
  const a = await primera.json();
  const b = await segunda.json();
  assert.equal(a.id, b.id);

  const items = (await (await fetch(`${BASE}/tasks`)).json()).items;
  const coincidencias = items.filter((tarea) => tarea.id === a.id);
  assert.equal(coincidencias.length, 1, "la tarea aparece una sola vez en la colección");
});

test("reutilizar una clave con un cuerpo distinto responde 409", async () => {
  const key = clave();
  await crear("Cuerpo original", { key });
  const conflicto = await crear("Cuerpo diferente", { key });
  await problema(conflicto, { status: 409, code: "IDEMPOTENCY_KEY_REUSED" });
});

test("POST /tasks sin Idempotency-Key responde 400", async () => {
  const respuesta = await fetch(`${BASE}/tasks`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ title: "Sin clave" }),
  });
  await problema(respuesta, { status: 400, code: "IDEMPOTENCY_KEY_REQUIRED" });
});

test("POST /tasks con Idempotency-Key en blanco responde 400", async () => {
  const respuesta = await crear("Clave en blanco", { key: "   " });
  await problema(respuesta, { status: 400, code: "IDEMPOTENCY_KEY_REQUIRED" });
});

// ---------------------------------------------------------------- validación

test("un título vacío responde 422 e indica el campo que falló", async () => {
  const cuerpo = await problema(await crear("   "), { status: 422, code: "VALIDATION_ERROR" });
  assert.ok(Array.isArray(cuerpo.errors) && cuerpo.errors.length > 0, "422 debe incluir errors[]");
  const campo = cuerpo.errors.find((error) => error.field === "title");
  assert.ok(campo, "la interfaz necesita saber QUÉ campo falló para señalarlo");
  assert.equal(campo.code, "TITLE_EMPTY");
});

test("un título ausente responde 422 con TITLE_REQUIRED", async () => {
  const cuerpo = await problema(await crear(null, { body: JSON.stringify({}) }), {
    status: 422,
    code: "VALIDATION_ERROR",
  });
  assert.equal(cuerpo.errors.find((error) => error.field === "title")?.code, "TITLE_REQUIRED");
});

test("un título que no es cadena responde 422 con TITLE_REQUIRED", async () => {
  const cuerpo = await problema(await crear(null, { body: JSON.stringify({ title: 42 }) }), {
    status: 422,
    code: "VALIDATION_ERROR",
  });
  assert.equal(cuerpo.errors.find((error) => error.field === "title")?.code, "TITLE_REQUIRED");
});

test("un título de más de 120 caracteres responde 422 con TITLE_TOO_LONG", async () => {
  const cuerpo = await problema(await crear("x".repeat(121)), { status: 422, code: "VALIDATION_ERROR" });
  assert.equal(cuerpo.errors.find((error) => error.field === "title")?.code, "TITLE_TOO_LONG");
});

test("un título de exactamente 120 caracteres se acepta", async () => {
  const respuesta = await crear("y".repeat(120));
  assert.equal(respuesta.status, 201, "el límite es inclusivo: 120 es válido y 121 no");
});

// -------------------------------------------------------- entradas hostiles

test("un cuerpo que no es JSON responde 400 y no 500", async () => {
  const respuesta = await crear(null, { body: "{esto no es json" });
  await problema(respuesta, { status: 400, code: "MALFORMED_JSON" });
});

test("un Content-Type que no es JSON responde 415", async () => {
  const respuesta = await crear(null, {
    headers: { "content-type": "text/plain" },
    body: "title=hola",
  });
  await problema(respuesta, { status: 415, code: "UNSUPPORTED_MEDIA_TYPE" });
});

test("un cuerpo mayor que el límite responde 413 y el servidor sigue vivo", async () => {
  const respuesta = await crear(null, { body: JSON.stringify({ title: "z".repeat(100_000) }) });
  await problema(respuesta, { status: 413, code: "BODY_TOO_LARGE" });
  // El servicio no puede quedar degradado por una petición grande.
  assert.equal((await fetch(`${BASE}/health`)).status, 200);
});

// ------------------------------------------------------------ rutas y métodos

test("una tarea inexistente responde 404 con TASK_NOT_FOUND", async () => {
  const respuesta = await fetch(`${BASE}/tasks/no-existe`);
  await problema(respuesta, { status: 404, code: "TASK_NOT_FOUND" });
});

test("una ruta inexistente responde 404 con ROUTE_NOT_FOUND", async () => {
  const respuesta = await fetch(`${BASE}/ruta-inexistente`);
  await problema(respuesta, { status: 404, code: "ROUTE_NOT_FOUND" });
});

test("un método no admitido responde 405 y declara Allow", async () => {
  const respuesta = await fetch(`${BASE}/tasks`, { method: "DELETE" });
  await problema(respuesta, { status: 405, code: "METHOD_NOT_ALLOWED" });
  const allow = respuesta.headers.get("allow") ?? "";
  assert.ok(allow.includes("GET") && allow.includes("POST"), `Allow debe listar los métodos válidos, llegó «${allow}»`);
});
