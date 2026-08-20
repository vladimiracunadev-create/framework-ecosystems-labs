import Fastify from "fastify";

const app = Fastify();
const tareas = new Map([["1", { id: "1", titulo: "original" }]]);
let siguiente = 100;

app.post("/tareas", (peticion, respuesta) => {
  const id = String(siguiente++);
  tareas.set(id, { id, titulo: peticion.body?.titulo ?? "" });
  respuesta.code(201).header("location", `/tareas/${id}`).send({ id });
});

app.delete("/tareas/:id", (peticion, respuesta) => {
  if (!tareas.has(peticion.params.id)) return respuesta.code(404).send({ error: "no existe" });
  tareas.delete(peticion.params.id);
  respuesta.code(204).send();
});

app.get("/tareas/:id", (peticion, respuesta) => {
  const tarea = tareas.get(peticion.params.id);
  return tarea ? respuesta.send(tarea) : respuesta.code(404).send({ error: "no existe" });
});

await app.listen({ port: Number(process.env.PORT ?? 3000), host: "127.0.0.1" });
