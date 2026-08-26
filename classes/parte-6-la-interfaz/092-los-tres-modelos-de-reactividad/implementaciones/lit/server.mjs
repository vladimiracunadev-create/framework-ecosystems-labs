import "@lit-labs/ssr/lib/install-global-dom-shim.js";

import { createServer } from "node:http";
import { LitElement, html } from "lit";

import { MODELOS, NOMBRES, VALORES } from "./modelos.mjs";

/**
 * LIT ES REACTIVIDAD FINA A NIVEL DE PROPIEDAD, NO DE EXPRESIÓN.
 *
 * Cuando una propiedad reactiva cambia, Lit marca el elemento como sucio y
 * vuelve a evaluar SU plantilla entera. Después compara hueco por hueco y toca
 * solo los que cambiaron.
 *
 * Es un punto intermedio real entre los otros dos: más fino que el árbol virtual
 * —no reconstruye un árbol ni recorre hijos— y más grueso que las señales de
 * Solid o Vue, que no vuelven a evaluar nada que no dependa del valor.
 *
 * Y la unidad de aislamiento es el ELEMENTO: dos `<mi-caja>` hermanas no se
 * afectan, pero dentro de una, cambiar una propiedad reevalúa su plantilla.
 */
class Caja extends LitElement {
  static properties = { valor: {}, otro: {} };

  constructor() {
    super();
    this.valor = VALORES.a;
    this.otro = VALORES.b;
    this.evaluaciones = 0;
  }

  createRenderRoot() {
    return this;
  }

  render() {
    this.evaluaciones += 1;
    return html`<span>${this.valor}</span><span>${this.otro}</span>`;
  }
}
customElements.define("mi-caja", Caja);

/**
 * AQUÍ NO SE PUEDE MEDIR EL CICLO COMPLETO, Y SE DICE.
 *
 * La actualización de Lit ocurre en una microtarea con el ciclo de vida del
 * elemento en un documento de verdad. El apaño de DOM del renderizado en
 * servidor construye el elemento y evalúa su plantilla, pero no ejecuta el ciclo
 * de actualización — así que contar reevaluaciones aquí daría un número que no
 * describe al framework.
 *
 * Lo que sí se puede afirmar sin medir, porque es la forma del modelo: la unidad
 * es la plantilla del elemento, no la expresión.
 */
createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://localhost");
  const json = (cuerpo) => {
    respuesta.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    respuesta.end(JSON.stringify(cuerpo));
  };

  if (url.pathname === "/modelo") {
    json({
      respondida: true,
      framework: "lit",
      modelo: "reactividad-fina",
      es_uno_de_los_tres: NOMBRES.includes("reactividad-fina"),
      matiz:
        "fina a nivel de PROPIEDAD y de elemento: al cambiar una propiedad se reevalúa la plantilla de ese elemento entera, y después se tocan solo los huecos que cambiaron",
      ...MODELOS["reactividad-fina"],
    });
    return;
  }

  if (url.pathname === "/medir") {
    json({
      respondida: true,
      medido: false,
      framework: "lit",
      modelo: "reactividad-fina",
      valores: 2,
      cambia: url.searchParams.get("cambia") ?? "a",
      por_que_no_se_puede_medir:
        "la actualización de Lit ocurre en una microtarea con el ciclo de vida del elemento en un documento real; el apaño de DOM construye el elemento pero no ejecuta ese ciclo",
      lo_que_si_se_puede_afirmar:
        "la unidad de reevaluación es la plantilla del elemento, no la expresión: cambiar una de dos propiedades reevalúa la plantilla entera de ESE elemento",
      unidad_de_aislamiento: "el elemento personalizado",
      lectura:
        "es el punto intermedio real del elenco: más fino que el árbol virtual —no reconstruye ni recorre hijos— y más grueso que las señales, que no reevalúan lo que no depende del valor",
    });
    return;
  }

  if (url.pathname === "/modelos.json") {
    json({ modelos: NOMBRES, ninguno_es_el_mejor: true, detalle: MODELOS });
    return;
  }

  respuesta.writeHead(404).end();
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
