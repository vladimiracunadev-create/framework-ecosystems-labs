import express from "express";

const app = express();
const tarea = { id: "1", titulo: "negociar" };

app.get("/tareas/1", (peticion, respuesta) => {
  // `format` elige según Accept y, de paso, emite `Vary: Accept`: sin esa
  // cabecera una caché serviría el HTML a quien pidió JSON.
  respuesta.format({
    "application/json": () => respuesta.json(tarea),
    "text/html": () => respuesta.type("text/html").send(`<h1>${tarea.titulo}</h1>`),
    default: () => respuesta.status(406).json({ error: "no puedo servir ese tipo" }),
  });
});

app.listen(Number(process.env.PORT ?? 3000));
