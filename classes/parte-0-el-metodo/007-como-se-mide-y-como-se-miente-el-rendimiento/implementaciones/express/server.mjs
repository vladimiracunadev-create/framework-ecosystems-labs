import { createRequire } from "node:module";
import express from "express";

import { VUELTAS, comparar, entorno, medirBien, medirMal, trabajo } from "./medicion.mjs";

const app = express();

const require = createRequire(import.meta.url);
const versionDeExpress = require("express/package.json").version;

/**
 * Cuántas repeticiones, con un tope.
 *
 * Sin tope, `?n=10000000` bloquearía el proceso — y una ruta que mide no debería
 * poder tumbar el servicio que mide.
 */
const repeticiones = (peticion) => Math.min(2000, Math.max(1, Number(peticion.query.n ?? 100)));

app.get("/trabajo", (peticion, respuesta) =>
  respuesta.json({ hecho: true, vueltas: VUELTAS, huella: trabajo() }),
);

app.get("/medir-mal", (peticion, respuesta) => respuesta.json(medirMal(repeticiones(peticion))));

app.get("/medir-bien", (peticion, respuesta) => respuesta.json(medirBien(repeticiones(peticion))));

app.get("/comparar", (peticion, respuesta) => respuesta.json(comparar(repeticiones(peticion))));

app.get("/entorno", (peticion, respuesta) =>
  respuesta.json({ framework: `express ${versionDeExpress}`, ...entorno(versionDeExpress) }),
);

app.listen(Number(process.env.PORT ?? 3000));
