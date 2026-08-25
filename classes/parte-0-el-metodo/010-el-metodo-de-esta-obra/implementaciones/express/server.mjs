import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import express from "express";

const app = express();

/**
 * LA CLASE MÁS PEQUEÑA DEL PROGRAMA, Y A PROPÓSITO.
 *
 * El problema que resuelve es trivial porque lo que enseña no es el problema:
 * es CÓMO ESTÁ HECHA UNA CLASE y cómo se reproduce su verificación.
 *
 * Así que esta implementación no inventa nada: abre su propio directorio, lee
 * los archivos que lo forman y contesta con lo que encuentra. Incluido el número
 * de casos de `contrato.json` — el mismo contrato que la está ejecutando ahora
 * mismo.
 */

/** `implementaciones/express` → la carpeta de la clase, dos niveles arriba. */
const RAIZ_DE_LA_CLASE = path.resolve(process.cwd(), "..", "..");

/**
 * LOS CUATRO ARCHIVOS QUE TIENE TODA CLASE DE ESTE PROGRAMA.
 *
 * No es una convención documentada en algún sitio y esperada aquí: es lo que
 * `scripts/verify-classes.mjs` exige, y por eso las 149 clases lo cumplen.
 */
const ANATOMIA = [
  ["README.md", "la clase: el problema, el contrato, el código de cada implementación y la comparación"],
  ["contrato.json", "los casos, idénticos para todas las implementaciones y escritos ANTES que ellas"],
  ["porque-si-porque-no.md", "el juicio: dónde esta solución es natural, dónde es forzada y qué se paga"],
  ["implementaciones/", "un directorio por framework del elenco, cada uno con su receta de arranque"],
];

app.get("/anatomia", (peticion, respuesta) => {
  respuesta.json({
    leida_del_disco: true,
    raiz: path.basename(RAIZ_DE_LA_CLASE),
    archivos: ANATOMIA.map(([nombre]) => nombre),
    que_es_cada_uno: Object.fromEntries(ANATOMIA),
    // Se comprueba que existan de verdad: una lista escrita a mano que no
    // corresponda con el disco es exactamente lo que este repositorio evita.
    todos_presentes: ANATOMIA.every(([nombre]) =>
      existsSync(path.join(RAIZ_DE_LA_CLASE, nombre.replace(/\/$/, ""))),
    ),
  });
});

/**
 * EL CONTRATO, LEÍDO POR QUIEN LO ESTÁ CUMPLIENDO.
 *
 * `casos` no es un número escrito aquí: se cuenta abriendo `contrato.json`. Y
 * uno de los casos de ese contrato comprueba que la cuenta sea la que es, así
 * que añadir un caso sin mirar rompe la clase — que es justo lo que debe pasar.
 */
app.get("/contrato", (peticion, respuesta) => {
  const contrato = JSON.parse(
    readFileSync(path.join(RAIZ_DE_LA_CLASE, "contrato.json"), "utf8"),
  );
  respuesta.json({
    se_lee_a_si_mismo: true,
    clase: contrato.clase,
    tipo: contrato.tipo,
    casos: contrato.casos.length,
    nombres: contrato.casos.map((c) => c.nombre),
    por_que_va_primero:
      "el contrato se escribe antes que cualquier implementación; si se escribiera después, describiría lo que una de ellas hace en vez de lo que todas deben hacer",
  });
});

/** EL ELENCO, que son los directorios que hay — no una lista escrita aparte. */
app.get("/implementaciones", (peticion, respuesta) => {
  const directorio = path.join(RAIZ_DE_LA_CLASE, "implementaciones");
  const elenco = readdirSync(directorio, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  respuesta.json({
    total: elenco.length,
    elenco,
    cada_una_tiene: "ejecutar.json, la receta que dice qué hace falta, cómo se prepara y cómo arranca",
    ninguna_tiene: "adaptadores: el verificador habla el mismo HTTP con todas",
  });
});

/**
 * LOS TRES RESULTADOS POSIBLES, Y EL QUE MÁS SE MALINTERPRETA.
 *
 * «Omitida» no es «pasó». Significa que la cadena de herramientas de esa
 * implementación no está en esta máquina y el verificador NO la ejecutó. Un
 * resumen que mezclara omitidas con verificadas sería un verde falso, y eso es
 * lo único que este repositorio no se permite.
 */
app.get("/estados", (peticion, respuesta) =>
  respuesta.json({
    estados: ["verificada", "con fallo", "omitida"],
    verificada: "se ejecutó y cumplió todos los casos",
    "con fallo": "se ejecutó y no cumplió alguno; el resumen dice cuál y qué respondió",
    omitida: "NO se ejecutó: falta su cadena de herramientas en esta máquina",
    omitida_significa_paso: false,
    por_que_importa:
      "un verde que incluya lo que no se ejecutó no es un verde: es una lista de deseos",
  }),
);

app.get("/verificacion", (peticion, respuesta) =>
  respuesta.json({
    comando: "node scripts/run-class.mjs 010",
    que_hace: [
      "lee contrato.json",
      "por cada directorio del elenco, comprueba si su cadena está en el PATH",
      "si está: prepara, arranca en un puerto libre y le lanza los casos",
      "si no está: la declara omitida y sigue",
      "al final resume qué se verificó, qué falló y qué se omitió",
    ],
    si_te_faltan_cadenas: "node scripts/doctor.mjs",
    todo_el_programa: "node scripts/run-class.mjs --todas",
  }),
);

app.listen(Number(process.env.PORT ?? 3000));
