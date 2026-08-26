import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

/**
 * EL PRESUPUESTO, IDÉNTICO EN LAS CINCO IMPLEMENTACIONES.
 *
 * Un presupuesto de JavaScript no es un consejo: es un número y una regla que
 * hace fallar la construcción cuando se pasa. Sin esa segunda mitad, el número
 * se comenta en una reunión, se incumple en el siguiente sprint y no vuelve a
 * mirarlo nadie.
 *
 * Este archivo se ejecuta como último paso de `preparar`, después de construir.
 * Si el paquete de cliente se pasa, sale con estado 1 y la clase entera se marca
 * como rota. Es la única forma de que un límite signifique algo.
 *
 * DOS DECISIONES DE MEDICIÓN, Y LAS DOS IMPORTAN:
 *
 *   1. **Se mide lo comprimido.** Lo que viaja por la red va comprimido, así que
 *      poner el límite sobre el tamaño en disco es medir algo que nadie
 *      descarga. La diferencia es de tres a cuatro veces.
 *   2. **Se mide el directorio de cliente, no el de servidor.** El código que se
 *      queda en el servidor no cuenta: no lo descarga nadie. Dónde está ese
 *      directorio cambia en cada framework, y esa es una de las comparaciones de
 *      la clase.
 */

/**
 * El directorio del proyecto, tomado del directorio de trabajo y no de
 * `import.meta.url`.
 *
 * El motivo se descubrió con cuatro quinientos seguidos: cuando este archivo lo
 * importa una ruta de servidor, el empaquetador lo mete DENTRO del paquete, y
 * entonces `import.meta.url` apunta al paquete y no a aquí. El directorio de
 * trabajo, en cambio, es el de la implementación tanto al construir como al
 * servir.
 */
const AQUI = process.cwd();

export function leerElPresupuesto() {
  return JSON.parse(readFileSync(path.join(AQUI, "presupuesto.json"), "utf8"));
}

function todosLosGuiones(directorio) {
  const encontrados = [];
  for (const entrada of readdirSync(directorio, { withFileTypes: true })) {
    const completo = path.join(directorio, entrada.name);
    if (entrada.isDirectory()) encontrados.push(...todosLosGuiones(completo));
    else if (entrada.name.endsWith(".js") || entrada.name.endsWith(".mjs")) encontrados.push(completo);
  }
  return encontrados;
}

/** Suma los bytes del JavaScript de cliente, en disco y comprimido. */
export function medir() {
  const presupuesto = leerElPresupuesto();
  const directorio = path.join(AQUI, presupuesto.directorio_de_cliente);
  const guiones = todosLosGuiones(directorio);

  let sinComprimir = 0;
  let comprimidos = 0;
  for (const guion of guiones) {
    sinComprimir += statSync(guion).size;
    comprimidos += gzipSync(readFileSync(guion)).length;
  }

  return {
    archivos_contados: guiones.length,
    bytes_sin_comprimir: sinComprimir,
    bytes_comprimidos: comprimidos,
    presupuesto_bytes: presupuesto.maximo_bytes_comprimidos,
    dentro_del_presupuesto: comprimidos <= presupuesto.maximo_bytes_comprimidos,
    // La misma cuenta con un límite absurdo. Está aquí para demostrar que la
    // regla muerde: un presupuesto que nunca dice que no es un adorno.
    con_un_presupuesto_de_mil_bytes_falla: comprimidos > 1000,
    el_presupuesto_es_sobre_lo_comprimido: true,
    la_compresion_ahorra: comprimidos < sinComprimir,
    donde_deja_el_javascript: presupuesto.directorio_de_cliente,
    como_se_hace_cumplir:
      "este archivo se ejecuta como último paso de `preparar` y sale con estado 1 si se pasa",
  };
}

// Ejecutado directamente —desde `preparar`— imprime el resultado y decide si la
// construcción sigue adelante.
if (process.argv[1] && process.argv[1].endsWith("presupuesto.mjs")) {
  const r = medir();
  const kb = (n) => `${(n / 1024).toFixed(1)} kB`;
  console.log(
    `presupuesto: ${r.archivos_contados} archivos · ${kb(r.bytes_sin_comprimir)} en disco · ` +
      `${kb(r.bytes_comprimidos)} comprimidos · límite ${kb(r.presupuesto_bytes)}`,
  );
  if (!r.dentro_del_presupuesto) {
    console.error(
      `PRESUPUESTO SUPERADO: ${kb(r.bytes_comprimidos)} comprimidos frente a un límite de ${kb(r.presupuesto_bytes)}`,
    );
    process.exit(1);
  }
  console.log("PRESUPUESTO_OK");
}
