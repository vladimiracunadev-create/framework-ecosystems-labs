import Fastify from "fastify";

const app = Fastify();
const tareas = new Map([["1", { id: "1", titulo: "original" }]]);
let altas = 0;

app.get("/tareas/:id", (peticion, respuesta) => {
  const tarea = tareas.get(peticion.params.id);
  return tarea ? respuesta.send(tarea) : respuesta.code(404).send();
});

app.put("/tareas/:id", (peticion, respuesta) => {
  const tarea = { id: peticion.params.id, titulo: peticion.body?.titulo ?? "" };
  tareas.set(peticion.params.id, tarea);
  respuesta.send(tarea);
});

app.post("/tareas", (peticion, respuesta) => {
  altas += 1;
  const id = `nueva-${altas}`;
  tareas.set(id, { id, titulo: peticion.body?.titulo ?? "" });
  respuesta.code(201).header("location", `/tareas/${id}`).send({ id, altas });
});

await app.listen({ port: Number(process.env.PORT ?? 3000), host: "127.0.0.1" });
