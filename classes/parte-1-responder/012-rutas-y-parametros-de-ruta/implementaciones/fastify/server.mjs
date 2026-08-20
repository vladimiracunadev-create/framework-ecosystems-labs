import Fastify from "fastify";

const app = Fastify();

app.get("/tareas/:id", (peticion, respuesta) => {
  respuesta.send({ id: peticion.params.id });
});

await app.listen({ port: Number(process.env.PORT ?? 3000), host: "127.0.0.1" });
