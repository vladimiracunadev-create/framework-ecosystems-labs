import express from "express";

const app = express();

// El conjunto mínimo, con lo que hace cada una. Ninguna sustituye a una defensa
// del servidor: son instrucciones que el NAVEGADOR aplica si se las pides.
const CABECERAS = {
  // Prohíbe adivinar el tipo por el contenido: sin ella, un navegador podía
  // ejecutar como script algo servido como texto.
  "x-content-type-options": "nosniff",
  // Impide que la página se incruste en un marco ajeno (secuestro de clic).
  "x-frame-options": "DENY",
  // Obliga a HTTPS durante un año en visitas posteriores.
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  // Limita lo que el navegador acepta cargar y ejecutar.
  "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
  // No filtra la URL completa a terceros al salir del sitio.
  "referrer-policy": "no-referrer",
};

app.use((peticion, respuesta, siguiente) => {
  for (const [nombre, valor] of Object.entries(CABECERAS)) respuesta.set(nombre, valor);
  // Quitar la firma del servidor: no es una defensa, y da información gratis.
  respuesta.removeHeader("x-powered-by");
  siguiente();
});

app.get("/datos", (peticion, respuesta) => respuesta.json({ ok: true }));

app.listen(Number(process.env.PORT ?? 3000));
