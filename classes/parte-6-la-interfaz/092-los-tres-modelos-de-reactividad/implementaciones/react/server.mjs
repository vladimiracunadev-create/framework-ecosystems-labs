import { createServer } from "node:http";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { MODELOS, NOMBRES, VALORES } from "./modelos.mjs";

/**
 * MEDIR EL ÁRBOL VIRTUAL, DE VERDAD.
 *
 * React sí se puede ejecutar en Node, así que esto no es una simulación: se
 * renderiza el árbol dos veces con `a` distinto y se cuenta cuántas veces se
 * ejecutó CADA componente.
 *
 * El resultado es el modelo entero: cambia un valor y se vuelven a ejecutar los
 * dos hijos, aunque el segundo no lo lea. El framework compara los árboles
 * después y aplica solo la diferencia — pero el trabajo de producir el árbol ya
 * se hizo.
 */
const cuenta = { a: 0, b: 0 };

function MuestraA({ valor }) {
  cuenta.a += 1;
  return h("span", { "data-valor": "a" }, String(valor));
}

function MuestraB({ valor }) {
  cuenta.b += 1;
  return h("span", { "data-valor": "b" }, String(valor));
}

function Pantalla({ a, b }) {
  return h("div", null, h(MuestraA, { valor: a }), h(MuestraB, { valor: b }));
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
      framework: "react",
      modelo: "arbol-virtual",
      es_uno_de_los_tres: NOMBRES.includes("arbol-virtual"),
      ...MODELOS["arbol-virtual"],
    });
    return;
  }

  if (url.pathname === "/medir") {
    cuenta.a = 0;
    cuenta.b = 0;

    // Render inicial.
    renderToStaticMarkup(h(Pantalla, VALORES));
    const trasPrimero = { ...cuenta };

    // Render con `a` cambiado. `b` no se ha tocado.
    renderToStaticMarkup(h(Pantalla, { ...VALORES, a: VALORES.a + 1 }));

    json({
      respondida: true,
      medido: true,
      framework: "react",
      modelo: "arbol-virtual",
      valores: 2,
      cambia: url.searchParams.get("cambia") ?? "a",
      ejecuciones_del_que_cambia: cuenta.a - trasPrimero.a,
      ejecuciones_del_que_no_cambia: cuenta.b - trasPrimero.b,
      trabajo_proporcional_a: "el tamaño del árbol",
      lectura:
        "el componente que NO lee el valor cambiado se vuelve a ejecutar igual: por eso existen React.memo, useMemo y useCallback",
    });
    return;
  }

  if (url.pathname === "/modelos.json") {
    json({ modelos: NOMBRES, ninguno_es_el_mejor: true, detalle: MODELOS });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
