import express from "express";

const app = express();

app.get("/eco", (peticion, respuesta) => {
  // Los nombres de cabecera NO distinguen mayúsculas: el estándar lo exige, y
  // los frameworks las normalizan a minúsculas al recibirlas.
  const recibido = peticion.get("x-peticion") ?? "(ninguna)";
  respuesta
    .set("x-respuesta", "servida")
    .set("cache-control", "no-store")
    .json({ recibido });
});

app.listen(Number(process.env.PORT ?? 3000));
