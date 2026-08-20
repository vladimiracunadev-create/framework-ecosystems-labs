import express from "express";

const app = express();

const CUPO = 3;
const VENTANA_MS = 60_000;

// Cubo de fichas por cliente. En un despliegue con varias instancias esto NO
// sirve: cada proceso tendría su propio cubo y el cupo real sería N veces el
// declarado. Ahí hace falta un almacén compartido.
const cubos = new Map();

function consumir(clave) {
  const ahora = Date.now();
  const cubo = cubos.get(clave) ?? { restantes: CUPO, reinicio: ahora + VENTANA_MS };
  if (ahora >= cubo.reinicio) {
    cubo.restantes = CUPO;
    cubo.reinicio = ahora + VENTANA_MS;
  }
  const permitido = cubo.restantes > 0;
  if (permitido) cubo.restantes -= 1;
  cubos.set(clave, cubo);
  return { permitido, ...cubo };
}

app.use((peticion, respuesta, siguiente) => {
  const { permitido, restantes, reinicio } = consumir(peticion.ip ?? "anonimo");
  const segundos = Math.max(0, Math.ceil((reinicio - Date.now()) / 1000));

  respuesta.set("ratelimit-limit", String(CUPO));
  respuesta.set("ratelimit-remaining", String(restantes));
  respuesta.set("ratelimit-reset", String(segundos));

  if (!permitido) {
    // `Retry-After` no es opcional: sin ella el cliente no sabe cuándo volver
    // y reintenta en bucle, que es justo lo que se quería evitar.
    return respuesta
      .status(429)
      .set("retry-after", String(segundos))
      .type("application/problem+json")
      .json({ type: "about:blank", title: "demasiadas peticiones", status: 429, code: "CUPO_AGOTADO" });
  }
  siguiente();
});

app.get("/datos", (peticion, respuesta) => respuesta.json({ ok: true }));

app.listen(Number(process.env.PORT ?? 3000));
