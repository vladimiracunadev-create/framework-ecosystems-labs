import express from "express";

const app = express();

class ErrorDeNegocio extends Error {
  constructor(mensaje, estado, codigo) {
    super(mensaje);
    this.estado = estado;
    this.codigo = codigo;
  }
}

app.get("/roto", () => {
  // Un fallo no previsto. Nadie lo captura aquí.
  throw new Error("referencia interna: secreto=abc123");
});

app.get("/negocio", () => {
  throw new ErrorDeNegocio("la tarea ya estaba completada", 409, "TAREA_YA_COMPLETADA");
});

app.get("/ok", (peticion, respuesta) => respuesta.json({ ok: true }));

// Un manejador de errores en Express se reconoce por tener CUATRO argumentos.
// Es una firma mágica, y es la única forma de registrarlo.
app.use((error, peticion, respuesta, siguiente) => {
  if (error instanceof ErrorDeNegocio) {
    return respuesta.status(error.estado).type("application/problem+json").json({
      type: "about:blank",
      title: error.message,
      status: error.estado,
      code: error.codigo,
    });
  }

  // Lo no previsto NO se le cuenta al cliente: el mensaje podría llevar rutas,
  // consultas o secretos. Se registra dentro y se responde genérico.
  console.error("error no controlado:", error.message);
  respuesta.status(500).type("application/problem+json").json({
    type: "about:blank",
    title: "error interno",
    status: 500,
    code: "ERROR_INTERNO",
  });
});

app.listen(Number(process.env.PORT ?? 3000));
