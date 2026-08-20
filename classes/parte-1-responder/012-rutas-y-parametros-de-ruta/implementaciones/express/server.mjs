import express from "express";

const app = express();

// `:id` es un segmento con nombre. Express lo extrae a `peticion.params`.
app.get("/tareas/:id", (peticion, respuesta) => {
  respuesta.json({ id: peticion.params.id });
});

app.listen(Number(process.env.PORT ?? 3000));
