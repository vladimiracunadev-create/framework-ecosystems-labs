import Fastify from "fastify";

// Fastify analiza JSON por omisión y devuelve 400 ante un cuerpo mal formado.
const app = Fastify();

app.post("/tareas", (peticion, respuesta) => {
  const titulo = peticion.body?.titulo;
  if (typeof titulo !== "string" || titulo.length === 0) {
    return respuesta.code(422).send({ error: "titulo es obligatorio" });
  }
  respuesta.code(201).send({ id: "1", titulo, completada: false });
});

app.setErrorHandler((error, peticion, respuesta) => {
  if (error.statusCode === 400) {
    return respuesta.code(400).send({ error: "cuerpo JSON mal formado" });
  }
  respuesta.code(error.statusCode ?? 500).send({ error: error.message });
});

await app.listen({ port: Number(process.env.PORT ?? 3000), host: "127.0.0.1" });
