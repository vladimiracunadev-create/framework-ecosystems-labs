import express from "express";

const app = express();
let manejadorLlamado = 0;

// Terminar la cadena es NO llamar a `siguiente()` y responder aquí mismo. El
// manejador de la ruta nunca llega a ejecutarse: por eso el contador de abajo
// sirve de prueba.
app.use((peticion, respuesta, siguiente) => {
  if (peticion.path === "/publico") return siguiente();

  const autorizacion = peticion.get("authorization");
  if (autorizacion !== "Bearer valido") {
    return respuesta
      .status(401)
      .set("www-authenticate", "Bearer")
      .json({ error: "no autorizado", manejador: manejadorLlamado });
  }
  siguiente();
});

app.get("/privado", (peticion, respuesta) => {
  manejadorLlamado += 1;
  respuesta.json({ ok: true, manejador: manejadorLlamado });
});

app.get("/publico", (peticion, respuesta) => respuesta.json({ ok: true, publico: true }));

app.listen(Number(process.env.PORT ?? 3000));
