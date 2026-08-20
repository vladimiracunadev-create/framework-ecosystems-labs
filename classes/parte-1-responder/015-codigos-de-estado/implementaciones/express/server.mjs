import express from "express";

const app = express();
app.use(express.json());

const tareas = new Map([["1", { id: "1", titulo: "original" }]]);
let siguiente = 100;

// 201 Created: además del código, la respuesta DEBE indicar dónde quedó el
// recurso nuevo. Sin Location, el cliente tiene que adivinar la ruta.
app.post("/tareas", (peticion, respuesta) => {
  const id = String(siguiente++);
  tareas.set(id, { id, titulo: peticion.body?.titulo ?? "" });
  respuesta.status(201).location(`/tareas/${id}`).json({ id });
});

// 204 No Content: la operación fue bien y no hay nada que devolver. El cuerpo
// tiene que ir vacío de verdad.
app.delete("/tareas/:id", (peticion, respuesta) => {
  if (!tareas.has(peticion.params.id)) return respuesta.status(404).json({ error: "no existe" });
  tareas.delete(peticion.params.id);
  respuesta.status(204).end();
});

app.get("/tareas/:id", (peticion, respuesta) => {
  const tarea = tareas.get(peticion.params.id);
  return tarea ? respuesta.json(tarea) : respuesta.status(404).json({ error: "no existe" });
});

app.listen(Number(process.env.PORT ?? 3000));
