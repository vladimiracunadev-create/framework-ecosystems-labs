import express from "express";

const app = express();

// El límite se comprueba MIENTRAS se recibe. Express lee la cabecera
// `Content-Length` y, si excede, corta sin leer el cuerpo; si no viene, corta
// al superar el tope durante la lectura.
app.use(express.json({ limit: "1kb" }));

app.post("/tareas", (peticion, respuesta) => {
  respuesta.status(201).json({ bytes: JSON.stringify(peticion.body ?? {}).length });
});

app.use((error, peticion, respuesta, siguiente) => {
  if (error?.type === "entity.too.large") {
    return respuesta.status(413).type("application/problem+json").json({
      type: "about:blank",
      title: "cuerpo demasiado grande",
      status: 413,
      code: "CUERPO_EXCEDIDO",
    });
  }
  if (error instanceof SyntaxError) {
    return respuesta.status(400).json({ error: "cuerpo JSON mal formado" });
  }
  siguiente(error);
});

app.listen(Number(process.env.PORT ?? 3000));
