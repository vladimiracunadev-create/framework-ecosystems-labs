import express from "express";

const app = express();
app.use(express.json());

// Estado en memoria: la clase trata de la SEMÁNTICA de los verbos, no de datos.
const tareas = new Map([["1", { id: "1", titulo: "original" }]]);
let altas = 0;

// GET es SEGURO: no cambia nada. Llamarlo mil veces deja el mismo estado.
app.get("/tareas/:id", (peticion, respuesta) => {
  const tarea = tareas.get(peticion.params.id);
  return tarea ? respuesta.json(tarea) : respuesta.status(404).end();
});

// PUT es IDEMPOTENTE: sustituye el recurso entero. Repetirlo deja el mismo
// estado que hacerlo una vez.
app.put("/tareas/:id", (peticion, respuesta) => {
  const tarea = { id: peticion.params.id, titulo: peticion.body?.titulo ?? "" };
  tareas.set(peticion.params.id, tarea);
  respuesta.json(tarea);
});

// POST NO es idempotente: cada llamada crea un recurso nuevo.
app.post("/tareas", (peticion, respuesta) => {
  altas += 1;
  const id = `nueva-${altas}`;
  tareas.set(id, { id, titulo: peticion.body?.titulo ?? "" });
  respuesta.status(201).location(`/tareas/${id}`).json({ id, altas });
});

app.listen(Number(process.env.PORT ?? 3000));
