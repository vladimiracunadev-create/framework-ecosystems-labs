import express from "express";

/**
 * TAREAS PROGRAMADAS: EL PROBLEMA NO ES PROGRAMARLAS, ES QUE NO SE DUPLIQUEN.
 *
 * Ejecutar algo cada hora es fácil en cualquier framework. Lo que nadie enseña
 * es lo que pasa cuando hay dos instancias del servicio, que es lo normal: **las
 * dos tienen el mismo temporizador**, y a las tres de la mañana las dos mandan el
 * mismo informe, cobran la misma cuota o cierran el mismo mes.
 *
 * La respuesta es un cerrojo: antes de trabajar, cada instancia intenta quedarse
 * con el turno, y solo trabaja quien lo consigue. Y ese cerrojo tiene una
 * propiedad que se olvida siempre: **tiene que caducar**. Si quien lo tiene se
 * muere sin soltarlo, sin caducidad la tarea no se vuelve a ejecutar jamás.
 *
 * ── CÓMO SE MONTAN AQUÍ LAS DOS INSTANCIAS ────────────────────────────────────
 *
 * Dos programadores independientes, cada uno con su propio temporizador, como
 * tendrían dos procesos. Comparten el cerrojo, que es lo que en producción sería
 * una fila de una tabla o una clave de Redis: eso es lo que hace falta que sea
 * común, y por eso aquí es lo único que se comparte a propósito.
 */

const app = express();

/** Cada cuánto se dispara. Cien milisegundos para que la clase dure poco; en un
 *  sistema real sería una expresión de calendario. */
const CADA_MS = 100;

/** Cuántas veces dispara cada prueba. */
const TICS = 5;

/**
 * EL CERROJO, CON SU CADUCIDAD.
 *
 * `duenio` dice quién lo tiene y `hasta` cuándo lo suelta solo. La caducidad es
 * la parte que convierte un cerrojo en algo operable: sin ella, una instancia
 * que muera con el turno cogido deja la tarea parada para siempre, y nadie se
 * entera hasta que alguien pregunta por el informe que no llegó.
 */
const cerrojo = { duenio: null, hasta: 0 };

function intentarCogerElTurno(quien, duracionMs) {
  const ahora = Date.now();
  if (cerrojo.duenio !== null && cerrojo.hasta > ahora) return false;
  cerrojo.duenio = quien;
  cerrojo.hasta = ahora + duracionMs;
  return true;
}

const esperar = (ms) => new Promise((seguir) => setTimeout(seguir, ms));

/**
 * UN PROGRAMADOR. Dispara `TICS` veces y cuenta cuántas trabajó de verdad.
 *
 * `conCerrojo` es lo único que cambia entre las dos pruebas, y es todo el
 * contenido de la clase.
 */
async function programador(quien, conCerrojo, ejecuciones) {
  for (let i = 0; i < TICS; i += 1) {
    await esperar(CADA_MS);
    if (!conCerrojo || intentarCogerElTurno(quien, CADA_MS - 10)) {
      ejecuciones.push(quien);
    }
  }
}

app.get("/", (peticion, respuesta) => {
  respuesta.type("html").send(
    `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Programadas</title></head>
<body><h1>Tareas programadas</h1>
<p data-cada="${CADA_MS}" data-instancias="2">dos instancias con el mismo temporizador</p>
</body></html>`,
  );
});

app.get("/programadas.json", async (peticion, respuesta) => {
  // SIN CERROJO: las dos instancias trabajan en cada disparo.
  const sinCerrojo = [];
  await Promise.all([
    programador("A", false, sinCerrojo),
    programador("B", false, sinCerrojo),
  ]);

  // CON CERROJO: solo una por disparo.
  cerrojo.duenio = null;
  cerrojo.hasta = 0;
  const conCerrojo = [];
  await Promise.all([
    programador("A", true, conCerrojo),
    programador("B", true, conCerrojo),
  ]);

  respuesta.json({
    framework: "express",
    instancias: 2,
    tics: TICS,
    cada_ms: CADA_MS,
    sin_cerrojo_ejecuciones: sinCerrojo.length,
    con_cerrojo_ejecuciones: conCerrojo.length,
    se_duplica_sin_cerrojo: sinCerrojo.length === TICS * 2,
    no_se_duplica_con_cerrojo: conCerrojo.length === TICS,
    el_cerrojo_caduca: true,
    como_se_programa: "setInterval o setTimeout: en Node no hay programador, hay temporizadores",
    donde_esta_el_cerrojo: "un objeto compartido; en produccion, una fila de una tabla o una clave de Redis",
    que_haria_falta_en_produccion:
      "que el cerrojo viva fuera del proceso y que su caducidad sea mayor que lo que tarde la tarea",
  });
});

app.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
