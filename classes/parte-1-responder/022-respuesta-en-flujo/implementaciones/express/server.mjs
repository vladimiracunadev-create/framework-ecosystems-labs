import express from "express";

const app = express();
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

app.get("/flujo", async (peticion, respuesta) => {
  // Sin `Content-Length`, la respuesta va troceada: el cliente empieza a leer
  // antes de que el servidor sepa cuánto va a enviar en total.
  respuesta.type("text/plain");
  respuesta.setHeader("cache-control", "no-store");
  for (const trozo of ["uno\n", "dos\n", "tres\n"]) {
    respuesta.write(trozo);
    await esperar(50);
  }
  respuesta.end();
});

app.listen(Number(process.env.PORT ?? 3000));
