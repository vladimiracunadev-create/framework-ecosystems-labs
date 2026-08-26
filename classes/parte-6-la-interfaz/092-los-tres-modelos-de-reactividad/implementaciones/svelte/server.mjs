import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { compileModule } from "svelte/compiler";

import { MODELOS, NOMBRES } from "./modelos.mjs";

/**
 * AQUÍ NO SE PUEDE MEDIR, Y SE DICE.
 *
 * Los efectos de Svelte necesitan el planificador del navegador: fuera de él no
 * se ejecutan nunca. No es una limitación de este laboratorio — es el mismo
 * hecho que la clase 087 verificó contando, y vale igual para `$effect` que para
 * `onMount`.
 *
 * Inventar un número aquí sería peor que no tenerlo, así que la respuesta lleva
 * `medido: false` con el motivo. Es la regla que la clase 006 aplicó al coste de
 * contratar.
 *
 * Pero sí hay una evidencia que ninguno de los otros siete puede dar: **el
 * código que el compilador genera**. Se compila el módulo con runas y se
 * comprueba que el seguimiento está ahí, escrito, en lugar de venir en un motor.
 */
const fuenteModulo = readFileSync(new URL("./reactivo.svelte.js", import.meta.url), "utf8");
const compilado = compileModule(fuenteModulo, { generate: "client" });
writeFileSync(new URL("./reactivo.compilada.mjs", import.meta.url), compilado.js.code);

/**
 * QUÉ FUNCIONES DEL MOTOR APARECEN EN LO GENERADO.
 *
 * `$state` se convierte en llamadas al seguimiento —`state`, `get`, `set`— que
 * el compilador escribe una a una. En el original no aparece ninguna: ahí solo
 * hay una variable con una runa delante.
 *
 * Esa es la tesis de Svelte, hecha visible: el trabajo lo hace el compilador,
 * no un intérprete en el navegador.
 */
function seguimientoGenerado() {
  const codigo = compilado.js.code;
  const buscadas = ["$.state", "$.get", "$.set", "$.user_effect", "$.effect_root"];
  return buscadas
    .map((nombre) => ({ nombre, veces: codigo.split(nombre).length - 1 }))
    .filter((f) => f.veces > 0);
}

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");
  const json = (cuerpo) => {
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify(cuerpo));
  };

  if (url.pathname === "/modelo") {
    json({
      respondida: true,
      framework: "svelte",
      modelo: "reactividad-fina",
      es_uno_de_los_tres: NOMBRES.includes("reactividad-fina"),
      matiz:
        "reactividad fina COMPILADA: el seguimiento no lo hace un motor en tiempo de ejecución, lo escribe el compilador",
      ...MODELOS["reactividad-fina"],
    });
    return;
  }

  if (url.pathname === "/medir") {
    json({
      respondida: true,
      medido: false,
      framework: "svelte",
      modelo: "reactividad-fina",
      valores: 2,
      cambia: url.searchParams.get("cambia") ?? "a",
      por_que_no_se_puede_medir:
        "los efectos de Svelte necesitan el planificador del navegador y fuera de él no se ejecutan: es el mismo hecho que la clase 087 verificó contando",
      lo_que_si_se_puede_ver: "el código que el compilador genera",
      lineas_del_original: fuenteModulo.split(/\r?\n/).filter((l) => l.trim()).length,
      lineas_generadas: compilado.js.code.split(/\r?\n/).filter((l) => l.trim()).length,
      seguimiento_escrito_por_el_compilador: seguimientoGenerado(),
      lectura:
        "en el archivo original no aparece ninguna llamada de seguimiento: solo variables con una runa delante. En el generado están todas, escritas una a una — esa es la tesis de Svelte hecha visible",
    });
    return;
  }

  if (url.pathname === "/modelos.json") {
    json({ modelos: NOMBRES, ninguno_es_el_mejor: true, detalle: MODELOS });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
