import express from "express";

const app = express();

// Sin este middleware, `peticion.body` es undefined. Express no analiza el
// cuerpo por omisión: es una decisión de framework mínimo.
app.use(express.json());

app.post("/tareas", (peticion, respuesta) => {
  const titulo = peticion.body?.titulo;
  if (typeof titulo !== "string" || titulo.length === 0) {
    return respuesta.status(422).json({ error: "titulo es obligatorio" });
  }
  respuesta.status(201).json({ id: "1", titulo, completada: false });
});

// El JSON mal formado lo detecta el middleware y llega aquí como error. Sin
// este manejador, Express respondería 400 con una página HTML de error.
app.use((error, peticion, respuesta, siguiente) => {
  if (error instanceof SyntaxError) {
    return respuesta.status(400).json({ error: "cuerpo JSON mal formado" });
  }
  siguiente(error);
});

app.listen(Number(process.env.PORT ?? 3000));
