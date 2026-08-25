// El mismo contrato en cinco ecosistemas. Lo que hay que mirar en este archivo
// no es lo que hace —es trivial— sino CUÁNTAS LÍNEAS EXISTEN SOLO PARA CUMPLIR
// EL CONTRATO, es decir, para apartarse del comportamiento por omisión de
// Express. Están marcadas una a una.
import express from "express";

const app = express();
app.use(express.json());

const tareas = new Map();
let siguiente = 0;

app.get("/tareas", (peticion, respuesta) => {
  const lista = [...tareas.values()];
  respuesta.json({ total: lista.length, tareas: lista });
});

app.post("/tareas", (peticion, respuesta) => {
  const id = String(++siguiente);
  const tarea = { id, titulo: peticion.body?.titulo ?? "" };
  tareas.set(id, tarea);
  // FUERA DE LA OMISIÓN (1): Express respondería 200. El contrato exige 201 y
  // la cabecera Location, así que las dos se escriben.
  respuesta.status(201).location(`/tareas/${id}`).json(tarea);
});

app.get("/tareas/:id", (peticion, respuesta) => {
  const tarea = tareas.get(peticion.params.id);
  // FUERA DE LA OMISIÓN (2): el 404 de Express es una página HTML con una
  // traza. El contrato exige JSON, así que hay que interceptarlo aquí.
  if (!tarea) return respuesta.status(404).json({ error: "no-encontrada" });
  respuesta.json(tarea);
});

app.delete("/tareas/:id", (peticion, respuesta) => {
  if (!tareas.has(peticion.params.id)) {
    return respuesta.status(404).json({ error: "no-encontrada" });
  }
  tareas.delete(peticion.params.id);
  // FUERA DE LA OMISIÓN (3): `end()` sin argumento, porque un 204 no lleva
  // cuerpo. Un `json({})` aquí devolvería dos bytes y rompería el contrato.
  respuesta.status(204).end();
});

app.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
