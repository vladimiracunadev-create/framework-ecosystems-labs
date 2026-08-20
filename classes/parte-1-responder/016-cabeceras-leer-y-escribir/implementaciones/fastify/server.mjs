import Fastify from "fastify";

const app = Fastify();

app.get("/eco", (peticion, respuesta) => {
  const recibido = peticion.headers["x-peticion"] ?? "(ninguna)";
  respuesta
    .header("x-respuesta", "servida")
    .header("cache-control", "no-store")
    .send({ recibido });
});

await app.listen({ port: Number(process.env.PORT ?? 3000), host: "127.0.0.1" });
