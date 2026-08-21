import express from "express";

const app = express();
app.use(express.json());

const tareas = new Map();
let siguiente = 1;

// El registro de auditoría. En producción vive en un almacén de solo
// APÉNDICE —nunca se actualiza ni se borra una línea— y aparte de la base de
// negocio: si el atacante que borró la tarea puede borrar también su rastro,
// el registro no vale nada.
const auditoria = [];

// El interceptor: un solo lugar por donde pasa cada cambio. Escribir el
// rastro dentro de cada handler invita a olvidarlo en el siguiente; aquí,
// registrar es una función que los handlers de escritura llaman, y las
// lecturas no.
function registrar(peticion, accion, recurso, id) {
  auditoria.push({
    // El actor sale de quién está autenticado (clases 066-067). Aquí llega
    // por cabecera para que el contrato lo fije sin montar el login entero.
    actor: peticion.get("x-actor") ?? "anonimo",
    accion,
    recurso,
    recurso_id: String(id),
    // El instante lo pone el SERVIDOR, no el cliente: un actor no puede
    // mentir sobre cuándo hizo algo si no es él quien lo fecha.
    instante: new Date().toISOString(),
  });
}

app.post("/tareas", (peticion, respuesta) => {
  const id = String(siguiente++);
  const tarea = { id, titulo: peticion.body?.titulo ?? "" };
  tareas.set(id, tarea);
  registrar(peticion, "crear", "tarea", id);
  respuesta.status(201).json(tarea);
});

app.get("/tareas/:id", (peticion, respuesta) => {
  const tarea = tareas.get(peticion.params.id);
  // Leer NO se audita: la auditoría registra CAMBIOS. (Los accesos a datos
  // sensibles a veces sí se registran, en un canal aparte; esta clase mide
  // la auditoría de cambios, que es la universal.)
  if (!tarea) return respuesta.status(404).json({ error: "no-encontrada" });
  respuesta.json(tarea);
});

app.delete("/tareas/:id", (peticion, respuesta) => {
  if (!tareas.has(peticion.params.id)) {
    return respuesta.status(404).json({ error: "no-encontrada" });
  }
  tareas.delete(peticion.params.id);
  registrar(peticion, "borrar", "tarea", peticion.params.id);
  respuesta.status(204).end();
});

app.get("/auditoria", (peticion, respuesta) => {
  respuesta.json({ total: auditoria.length, registros: auditoria });
});

app.listen(Number(process.env.PORT ?? 3000));
