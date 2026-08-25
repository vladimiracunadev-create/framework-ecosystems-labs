import { createRequire } from "node:module";
import Fastify from "fastify";

import { VUELTAS, comparar, entorno, medirBien, medirMal, trabajo } from "./medicion.mjs";

const app = Fastify({ logger: false });

const require = createRequire(import.meta.url);
const versionDeFastify = require("fastify/package.json").version;

/**
 * MISMO ARCHIVO DE MEDICIÓN QUE EXPRESS, LETRA POR LETRA.
 *
 * Es a propósito, y es media clase: si el método de medida fuera distinto en
 * cada implementación, la comparación no significaría nada. Lo único que cambia
 * aquí es quién atiende la petición.
 *
 * Y ese «lo único» es también el aviso: en una comparativa de frameworks, el
 * trabajo de la ruta suele dominar el tiempo. Lo que se está midiendo casi nunca
 * es el framework.
 */

const repeticiones = (peticion) => Math.min(2000, Math.max(1, Number(peticion.query.n ?? 100)));

app.get("/trabajo", () => ({ hecho: true, vueltas: VUELTAS, huella: trabajo() }));

app.get("/medir-mal", (peticion) => medirMal(repeticiones(peticion)));

app.get("/medir-bien", (peticion) => medirBien(repeticiones(peticion)));

app.get("/comparar", (peticion) => comparar(repeticiones(peticion)));

app.get("/entorno", () => ({
  framework: `fastify ${versionDeFastify}`,
  ...entorno(versionDeFastify),
}));

await app.listen({ port: Number(process.env.PORT ?? 3000), host: "127.0.0.1" });
