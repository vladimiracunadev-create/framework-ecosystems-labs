import express from "express";

import { DIMENSIONES } from "./coste.mjs";

const app = express();
app.use(express.json());

/**
 * EL SERVICIO. Todo él.
 *
 * Un archivo, una lista y dos rutas. La otra implementación de esta clase hace
 * exactamente lo mismo repartido en siete archivos — no porque esté peor
 * escrita, sino porque su framework pide esa estructura.
 *
 * En ese «exactamente lo mismo» está el contenido de la clase: si el resultado
 * es idéntico, la comparación no puede ser sobre el resultado. Tiene que ser
 * sobre lo que cuesta.
 */

const tareas = [];

app.post("/tareas", (peticion, respuesta) => {
  const titulo = peticion.body?.titulo;
  if (typeof titulo !== "string" || titulo.trim().length === 0) {
    respuesta.status(422).json({ code: "TITULO_INVALIDO" });
    return;
  }
  const tarea = { id: tareas.length + 1, titulo: titulo.trim() };
  tareas.push(tarea);
  respuesta.status(201).json(tarea);
});

app.get("/tareas", (peticion, respuesta) => respuesta.json({ total: tareas.length, tareas }));

// ---------------------------------------------------------------- el informe

app.get("/coste", (peticion, respuesta) =>
  respuesta.json({
    framework: "express",
    dimensiones: Object.keys(DIMENSIONES),
    medibles_desde_aqui: Object.entries(DIMENSIONES)
      .filter(([, calcular]) => calcular().medido)
      .map(([nombre]) => nombre),
  }),
);

app.get("/coste/:dimension", (peticion, respuesta) => {
  const calcular = DIMENSIONES[peticion.params.dimension];
  if (!calcular) {
    respuesta.status(404).json({ code: "DIMENSION_DESCONOCIDA" });
    return;
  }
  respuesta.json({ dimension: peticion.params.dimension, framework: "express", ...calcular() });
});

app.listen(Number(process.env.PORT ?? 3000));
