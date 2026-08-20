import Fastify from "fastify";

const app = Fastify();

// Fastify no usa middleware al estilo de Express: usa GANCHOS con nombre, uno
// por fase del ciclo. `onRequest` es la primera, antes incluso del enrutado.
app.addHook("onRequest", async (peticion, respuesta) => {
  respuesta.header("x-capa", "intermedia");
});

app.get("/a", (peticion, respuesta) => respuesta.send({ ruta: "a" }));
app.get("/b", (peticion, respuesta) => respuesta.send({ ruta: "b" }));

app.setNotFoundHandler((peticion, respuesta) =>
  respuesta.code(404).send({ error: "no existe" }),
);

await app.listen({ port: Number(process.env.PORT ?? 3000), host: "127.0.0.1" });
