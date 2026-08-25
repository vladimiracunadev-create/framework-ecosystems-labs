import { readFileSync } from "node:fs";
import express from "express";

const app = express();
app.use(express.json());

/**
 * LA MISMA RUTA, DOS VECES.
 *
 * `/idiomatico/tareas` está escrita como se escribe en Express. `/traducido/tareas`
 * está traducida desde Rails — no la sintaxis, que sería absurda, sino LA
 * SUPOSICIÓN: que basta con comprobar que el campo «viene».
 *
 * En Rails eso lo resuelve `validates :titulo, presence: true`, y `presence` en
 * Rails considera vacío un texto de solo espacios. Aquí no hay modelo debajo, y
 * la traducción se quedó con la mitad de la regla.
 */

const tareas = [];

// >>> idiomatico
/**
 * En Express la validación se escribe. No hay atajo, y por eso está aquí en una
 * función con nombre en lugar de repartida por el manejador: es la única forma
 * de que dos rutas apliquen exactamente la misma regla.
 *
 * Devuelve el título ya normalizado, no solo un sí o un no. Validar y normalizar
 * en el mismo sitio evita que una ruta recorte y otra no.
 */
function tituloValido(cuerpo) {
  const titulo = cuerpo?.titulo;
  if (typeof titulo !== "string") return null;
  const limpio = titulo.trim();
  return limpio.length === 0 ? null : limpio;
}

app.post("/idiomatico/tareas", (peticion, respuesta) => {
  const titulo = tituloValido(peticion.body);
  if (titulo === null) {
    respuesta.status(422).json({ code: "TITULO_INVALIDO" });
    return;
  }
  const tarea = { id: tareas.length + 1, titulo };
  tareas.push(tarea);
  respuesta.status(201).json(tarea);
});
// <<< idiomatico

// >>> traducido
/**
 * Traducida desde Rails.
 *
 * `if (!titulo)` es la comprobación de presencia tal y como suena: ¿vino algo?
 * Y es verdad que cubre el campo ausente y la cadena vacía.
 *
 * Lo que no cubre —y en Rails sí cubría— es `"     "`. Cinco espacios son un
 * texto perfectamente presente para JavaScript. El traductor no omitió la
 * validación: la tradujo mal, que es mucho más difícil de ver.
 */
app.post("/traducido/tareas", (peticion, respuesta) => {
  const titulo = peticion.body?.titulo;
  if (!titulo) {
    respuesta.status(422).json({ code: "TITULO_INVALIDO" });
    return;
  }
  const tarea = { id: tareas.length + 1, titulo };
  tareas.push(tarea);
  respuesta.status(201).json(tarea);
});
// <<< traducido

app.get("/tareas", (peticion, respuesta) => respuesta.json({ total: tareas.length, tareas }));

app.get("/tareas/:id", (peticion, respuesta) => {
  const tarea = tareas.find((t) => t.id === Number(peticion.params.id));
  if (!tarea) {
    respuesta.status(404).json({ code: "NO_EXISTE" });
    return;
  }
  respuesta.json(tarea);
});

const fuente = readFileSync(new URL(import.meta.url), "utf8");

/** Cuenta las líneas de código de un bloque leyendo ESTE archivo. */
function lineasEntre(marca) {
  const lineas = fuente.split(/\r?\n/);
  const desde = lineas.findIndex((l) => l.includes(`>>> ${marca}`));
  const hasta = lineas.findIndex((l) => l.includes(`<<< ${marca}`));
  return lineas
    .slice(desde + 1, hasta)
    .filter((l) => l.trim() && !l.trim().startsWith("*") && !l.trim().startsWith("/")).length;
}

/**
 * LA COMPARACIÓN, MEDIDA.
 *
 * `mismo_camino_feliz` no está escrito a mano: se pasa el mismo cuerpo válido
 * por las dos versiones y se comparan los resultados. Afirmar que coinciden sin
 * comprobarlo sería exactamente el error que esta clase enseña a no cometer.
 */
app.get("/comparacion", (peticion, respuesta) => {
  const cuerpo = { titulo: "misma tarea" };
  const porLaIdiomatica = tituloValido(cuerpo);
  const porLaTraducida = cuerpo.titulo ? cuerpo.titulo : null;

  respuesta.json({
    mismo_camino_feliz: porLaIdiomatica === porLaTraducida,
    quien_valida_en_la_idiomatica: "una función escrita a mano",
    quien_valida_en_la_traducida: "nadie",
    de_donde_viene_la_traduccion: "rails",
    lineas_idiomatico: lineasEntre("idiomatico"),
    lineas_traducido: lineasEntre("traducido"),
  });
});

app.listen(Number(process.env.PORT ?? 3000));
