import express from "express";

const app = express();

// El mismo recurso, dos representaciones. La v1 tiene `nombre`; la v2 lo separó
// en `nombre` y `apellido`. Es el cambio incompatible más común que existe.
const PERSONA = { id: "1", nombre: "Ada", apellido: "Lovelace" };

// (1) VERSIÓN EN LA RUTA — la más visible y la más usada.
app.get("/v1/personas/1", (peticion, respuesta) => {
  respuesta.json({ id: PERSONA.id, nombre: `${PERSONA.nombre} ${PERSONA.apellido}` });
});

app.get("/v2/personas/1", (peticion, respuesta) => {
  respuesta.json(PERSONA);
});

// (2) VERSIÓN EN LA CABECERA — el recurso mantiene una sola URL, que es el
// argumento de quienes defienden esta forma: la identidad del recurso no cambia
// porque cambie su representación.
app.get("/personas/1", (peticion, respuesta) => {
  const version = peticion.get("x-api-version") ?? "1";
  respuesta.set("x-api-version", version);

  if (version === "2") return respuesta.json(PERSONA);
  if (version === "1") {
    return respuesta.json({ id: PERSONA.id, nombre: `${PERSONA.nombre} ${PERSONA.apellido}` });
  }
  respuesta.status(400).json({ code: "VERSION_DESCONOCIDA" });
});

app.listen(Number(process.env.PORT ?? 3000));
