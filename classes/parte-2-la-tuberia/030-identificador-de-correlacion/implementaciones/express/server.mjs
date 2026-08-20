import { randomUUID } from "node:crypto";
import express from "express";

const app = express();

// Se RESPETA el identificador que llega y se GENERA uno si no viene. Las dos
// mitades importan: respetarlo permite seguir una petición entre servicios;
// generarlo garantiza que ninguna se quede sin rastro.
app.use((peticion, respuesta, siguiente) => {
  const entrante = peticion.get("x-request-id");
  peticion.correlacion = entrante && entrante.length <= 128 ? entrante : randomUUID();
  respuesta.set("x-request-id", peticion.correlacion);
  siguiente();
});

app.get("/eco", (peticion, respuesta) => {
  respuesta.json({ correlacion: peticion.correlacion, generado: !peticion.get("x-request-id") });
});

app.listen(Number(process.env.PORT ?? 3000));
