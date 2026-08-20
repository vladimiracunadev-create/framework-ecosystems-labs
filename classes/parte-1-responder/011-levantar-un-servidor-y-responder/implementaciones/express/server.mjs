import express from "express";

const app = express();

app.get("/", (peticion, respuesta) => {
  respuesta.type("text/plain").send("hola");
});

app.listen(Number(process.env.PORT ?? 3000));
