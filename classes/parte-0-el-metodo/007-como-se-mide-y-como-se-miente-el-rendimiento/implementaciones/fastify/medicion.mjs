import { createHash } from "node:crypto";
import os from "node:os";

/**
 * LA MEDICIÓN, SIN NADA DE EXPRESS DENTRO.
 *
 * El método no depende del framework — por eso este archivo no lo menciona, y
 * por eso el de Fastify es idéntico. Lo que cambia entre las cuatro
 * implementaciones de esta clase es el lenguaje, no lo que se hace.
 */

/**
 * LA UNIDAD DE TRABAJO. Determinista y con coste real.
 *
 * Cuatrocientos hashes encadenados sobre la misma semilla: siempre el mismo
 * resultado, siempre el mismo trabajo. Sin coste real no habría cola que medir;
 * sin determinismo, cada muestra mediría algo distinto.
 */
export const VUELTAS = 400;

export function trabajo() {
  let dato = Buffer.from("clase-007");
  for (let i = 0; i < VUELTAS; i += 1) {
    dato = createHash("sha256").update(dato).digest();
  }
  return dato.toString("hex").slice(0, 16);
}

const ahora = () => Number(process.hrtime.bigint()) / 1e6;

function muestrear(n) {
  const tiempos = [];
  for (let i = 0; i < n; i += 1) {
    const inicio = ahora();
    trabajo();
    tiempos.push(ahora() - inicio);
  }
  return tiempos;
}

const media = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

/**
 * El percentil p de una muestra ya ordenada.
 *
 * Con el método del rango más cercano: el valor por debajo del cual queda al
 * menos el p por ciento de las observaciones. No se interpola, para no inventar
 * un número que nadie midió.
 */
function percentil(ordenados, p) {
  const indice = Math.max(0, Math.ceil((p / 100) * ordenados.length) - 1);
  return ordenados[indice];
}

/**
 * LA MEDICIÓN MAL HECHA.
 *
 * Sin calentar y publicando solo la media. No está exagerada: es exactamente lo
 * que aparece en la mayoría de las comparativas que circulan.
 *
 * La primera muestra de un proceso recién arrancado paga la compilación al vuelo
 * y las cachés frías. Meterla en la media contamina el resultado; publicarla
 * sola sería aún peor.
 */
export function medirMal(n) {
  const tiempos = muestrear(n);
  return {
    muestras: n,
    calentamiento: 0,
    publica: "solo la media",
    media_ms: Number(media(tiempos).toFixed(4)),
    por_que_esta_mal: [
      "no calienta: las primeras muestras miden la compilación al vuelo, no el trabajo",
      "publica una media: un solo número no dice nada sobre la forma de la distribución",
      "no dice cuántas veces se repitió ni en qué máquina",
    ],
  };
}

/**
 * LA MEDICIÓN BIEN HECHA.
 *
 * Calienta, mide, ordena y publica la distribución entera. La media sigue ahí —
 * no es que sea falsa, es que sola no basta.
 */
export function medirBien(n) {
  const calentamiento = Math.max(20, Math.floor(n / 5));
  muestrear(calentamiento);

  const tiempos = muestrear(n);
  const ordenados = [...tiempos].sort((a, b) => a - b);
  const redondear = (x) => Number(x.toFixed(4));

  return {
    muestras: n,
    calentamiento,
    publica: "percentiles",
    media_ms: redondear(media(tiempos)),
    p50_ms: redondear(percentil(ordenados, 50)),
    p90_ms: redondear(percentil(ordenados, 90)),
    p99_ms: redondear(percentil(ordenados, 99)),
    maximo_ms: redondear(ordenados[ordenados.length - 1]),
  };
}

/**
 * LO QUE HAY QUE PUBLICAR PARA QUE UN NÚMERO SIGNIFIQUE ALGO.
 *
 * Cuatro datos. Una comparativa a la que le falte uno no se puede reproducir, y
 * lo que no se puede reproducir no es una medición: es una anécdota.
 */
export function entorno(versionDelFramework) {
  return {
    publica: ["runtime", "version_del_framework", "nucleos", "modo_de_compilacion"],
    runtime: `node ${process.versions.node}`,
    version_del_framework: versionDelFramework,
    nucleos: os.cpus().length,
    modo_de_compilacion: "interpretado con compilación al vuelo (V8), sin modo de producción",
    aviso:
      "estos cuatro datos describen la máquina que ejecuta, no el framework: cambiarla cambia todos los números",
  };
}

/**
 * LO QUE SE PUEDE AFIRMAR SIN SABER EN QUÉ MÁQUINA SE EJECUTA.
 *
 * `la_media_oculta_la_cola` es cierto en cualquier ordenador: siempre hay
 * peticiones lentas y la media las esconde. Esa afirmación sí se puede meter en
 * un contrato.
 *
 * «Este framework es un 30 % más rápido que aquel» no, y por eso no está aquí.
 */
export function comparar(n) {
  const mal = medirMal(n);
  const bien = medirBien(n);

  return {
    mal_hecha: mal,
    bien_hecha: bien,
    la_media_oculta_la_cola: bien.p99_ms > bien.media_ms,
    cuanto_la_oculta: `p99 es ${(bien.p99_ms / bien.media_ms).toFixed(1)}× la media`,
    el_calentamiento_cambia_el_numero: mal.media_ms !== bien.media_ms,
    mide_esta_maquina_no_el_framework: true,
    lo_que_no_se_puede_afirmar:
      "que un framework sea más rápido que otro: eso exige la misma máquina, el mismo trabajo y la distribución entera",
  };
}
