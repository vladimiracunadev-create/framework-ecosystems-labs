import { createServer } from "node:http";

import { computed, signal } from "@angular/core";

import { MODELOS, NOMBRES, VALORES } from "./modelos.js";

/**
 * ANGULAR TIENE DOS MODELOS A LA VEZ, Y ESA ES SU SITUACIÓN REAL.
 *
 * Durante diez años el modelo fue **detección de cambios por revisión**: Zone.js
 * parcheaba `setTimeout`, `addEventListener` y las peticiones de red para saber
 * cuándo algo pudo haber cambiado, y entonces Angular revisaba el árbol entero
 * comparando valores.
 *
 * No es árbol virtual —no construye un árbol nuevo— pero paga lo mismo: trabajo
 * proporcional al tamaño de la aplicación, no al del cambio.
 *
 * Desde la versión 16 hay señales, que son reactividad fina de la misma familia
 * que Solid y Vue. Y funcionan **fuera de un componente y fuera del navegador**,
 * así que aquí se pueden medir de verdad.
 *
 * La transición no ha terminado: la mayoría del código de Angular en producción
 * sigue usando el modelo antiguo, y los dos conviven en la misma versión.
 */
function medir() {
  const cuenta = { a: 0, b: 0 };
  const a = signal(VALORES.a);
  const b = signal(VALORES.b);

  // `computed` es PEREZOSO: no recalcula al cambiar la señal, recalcula cuando
  // alguien lo lee después de que haya cambiado. Por eso se leen los dos antes y
  // después — leer es parte del experimento.
  const derivadoA = computed(() => {
    cuenta.a += 1;
    return a();
  });
  const derivadoB = computed(() => {
    cuenta.b += 1;
    return b();
  });

  derivadoA();
  derivadoB();
  const inicial = { ...cuenta };

  a.set(VALORES.a + 1);
  derivadoA();
  derivadoB();

  return {
    ejecuciones_del_que_cambia: cuenta.a - inicial.a,
    ejecuciones_del_que_no_cambia: cuenta.b - inicial.b,
    ejecuciones_al_registrar: inicial,
  };
}

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url ?? "/", "http://localhost");
  const json = (cuerpo: unknown) => {
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify(cuerpo));
  };

  if (url.pathname === "/modelo") {
    json({
      respondida: true,
      framework: "angular",
      modelo: "reactividad-fina",
      es_uno_de_los_tres: NOMBRES.includes("reactividad-fina"),
      matiz:
        "dos modelos conviviendo: la revisión del árbol con Zone.js desde 2016, y señales desde la versión 16. La mayoría del código en producción sigue en el primero",
      ...MODELOS["reactividad-fina"],
    });
    return;
  }

  if (url.pathname === "/medir") {
    json({
      respondida: true,
      medido: true,
      framework: "angular",
      modelo: "reactividad-fina",
      valores: 2,
      cambia: url.searchParams.get("cambia") ?? "a",
      ...medir(),
      trabajo_proporcional_a: "el número de lectores del valor que cambió",
      lectura:
        "el mismo resultado que Vue y Solid. Lo que Angular añade a la comparación es el CONTRASTE con su propio pasado: el modelo anterior revisaba el árbol entero en cada evento",
      nota_de_la_medida:
        "`computed` es perezoso: recalcula al leerlo después de un cambio, no al cambiar. Por eso el experimento lee los dos derivados antes y después",
    });
    return;
  }

  if (url.pathname === "/modelos.json") {
    json({ modelos: NOMBRES, ninguno_es_el_mejor: true, detalle: MODELOS });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
