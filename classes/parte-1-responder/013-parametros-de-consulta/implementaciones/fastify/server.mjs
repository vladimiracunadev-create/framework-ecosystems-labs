import Fastify from "fastify";

const app = Fastify();
const POR_OMISION = 20;

// Fastify valida y convierte a partir de un esquema: el manejador recibe el
// valor ya comprobado. Es la diferencia de fondo con Express, y anticipa la
// clase 041.
const esquema = {
  querystring: {
    type: "object",
    properties: { limite: { type: "integer", minimum: 1, maximum: 100, default: POR_OMISION } },
  },
};

app.get("/tareas", { schema: esquema }, (peticion, respuesta) => {
  respuesta.send({ limite: peticion.query.limite });
});

app.setErrorHandler((error, peticion, respuesta) => {
  respuesta.status(error.statusCode === 400 ? 422 : (error.statusCode ?? 500))
    .send({ error: error.message });
});

await app.listen({ port: Number(process.env.PORT ?? 3000), host: "127.0.0.1" });
