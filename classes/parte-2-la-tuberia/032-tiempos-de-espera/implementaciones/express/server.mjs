import express from "express";

const app = express();
const LIMITE_MS = 300;
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// El tiempo de espera se aplica en la CAPA, no en cada manejador: así ninguna
// ruta puede olvidarse de tenerlo.
app.use((peticion, respuesta, siguiente) => {
  const temporizador = setTimeout(() => {
    if (respuesta.headersSent) return;
    respuesta.status(504).type("application/problem+json").json({
      type: "about:blank",
      title: "el servidor tardó demasiado",
      status: 504,
      code: "TIEMPO_AGOTADO",
    });
  }, LIMITE_MS);

  // Cancelar el temporizador al terminar es obligatorio: sin esto, cada
  // petición deja un temporizador vivo hasta que expira. Con tráfico real, eso
  // es una fuga de memoria lenta y difícil de encontrar.
  respuesta.on("finish", () => clearTimeout(temporizador));
  respuesta.on("close", () => clearTimeout(temporizador));
  siguiente();
});

app.get("/rapido", (peticion, respuesta) => respuesta.json({ ok: true }));

app.get("/lento", async (peticion, respuesta) => {
  await esperar(LIMITE_MS * 4);
  // Al llegar aquí la respuesta ya se envió: escribir otra vez rompería el
  // protocolo, así que se comprueba antes.
  if (!respuesta.headersSent) respuesta.json({ ok: true, tarde: true });
});

app.listen(Number(process.env.PORT ?? 3000));
