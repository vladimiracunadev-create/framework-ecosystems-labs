import express from "express";

const app = express();
const POR_OMISION = 20;

app.get("/tareas", (peticion, respuesta) => {
  // Todo lo que llega por la cadena de consulta es TEXTO. Convertirlo y validar
  // el resultado es responsabilidad tuya, no del framework.
  const bruto = peticion.query.limite;
  const limite = bruto === undefined ? POR_OMISION : Number(bruto);
  if (!Number.isInteger(limite) || limite < 1 || limite > 100) {
    return respuesta.status(422).json({ error: "limite debe ser un entero entre 1 y 100" });
  }
  respuesta.json({ limite });
});

app.listen(Number(process.env.PORT ?? 3000));
