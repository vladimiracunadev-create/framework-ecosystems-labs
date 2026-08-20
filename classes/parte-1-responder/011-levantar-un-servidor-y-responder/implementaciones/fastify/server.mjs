import Fastify from "fastify";

const app = Fastify();

app.get("/", (peticion, respuesta) => {
  respuesta.type("text/plain").send("hola");
});

await app.listen({ port: Number(process.env.PORT ?? 3000), host: "127.0.0.1" });
