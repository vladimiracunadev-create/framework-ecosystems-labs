import express from "express";

const app = express();
app.use(express.json());

/**
 * Seis cambios sobre un contrato, clasificados. El servidor sirve las DOS
 * versiones a la vez para que el cliente antiguo demuestre si sigue funcionando.
 *
 * COMPATIBLES (el cliente antiguo sigue funcionando):
 *   1. Añadir un campo OPCIONAL a la entrada.
 *   2. Añadir un campo a la SALIDA.
 *   3. Añadir un valor nuevo a un conjunto de SALIDA.
 *
 * INCOMPATIBLES (lo rompen):
 *   4. Hacer OBLIGATORIO un campo que no lo era.
 *   5. Quitar o renombrar un campo de la SALIDA.
 *   6. Estrechar una validación que ya aceptaba valores.
 */

// v1: el contrato original.
app.post("/v1/tareas", (peticion, respuesta) => {
  const titulo = peticion.body?.titulo;
  if (typeof titulo !== "string" || titulo.length === 0 || titulo.length > 200) {
    return respuesta.status(422).json({ code: "VALIDACION" });
  }
  respuesta.status(201).json({ id: "1", titulo });
});

// v2: los tres cambios COMPATIBLES aplicados a la vez.
app.post("/v2/tareas", (peticion, respuesta) => {
  const titulo = peticion.body?.titulo;
  if (typeof titulo !== "string" || titulo.length === 0 || titulo.length > 200) {
    return respuesta.status(422).json({ code: "VALIDACION" });
  }
  // (1) `prioridad` es nueva y OPCIONAL: quien no la envía sigue igual.
  const prioridad = peticion.body?.prioridad ?? 2;
  // (2) y (3): `estado` es un campo nuevo de salida, con un valor que la v1
  // nunca vio. Un cliente que solo lee `id` y `titulo` no se entera.
  respuesta.status(201).json({ id: "1", titulo, prioridad, estado: "pendiente" });
});

// v3: los tres cambios INCOMPATIBLES.
app.post("/v3/tareas", (peticion, respuesta) => {
  const titulo = peticion.body?.titulo;
  // (4) `prioridad` pasa a ser OBLIGATORIA.
  if (peticion.body?.prioridad === undefined) {
    return respuesta.status(422).json({ code: "VALIDACION", campo: "prioridad" });
  }
  // (6) el máximo baja de 200 a 120: un título que antes valía ahora no.
  if (typeof titulo !== "string" || titulo.length === 0 || titulo.length > 120) {
    return respuesta.status(422).json({ code: "VALIDACION", campo: "titulo" });
  }
  // (5) `titulo` se renombra a `nombre`: el cliente que lee `titulo` recibe
  // `undefined` y NO se entera de que algo va mal.
  respuesta.status(201).json({ id: "1", nombre: titulo });
});

app.listen(Number(process.env.PORT ?? 3000));
