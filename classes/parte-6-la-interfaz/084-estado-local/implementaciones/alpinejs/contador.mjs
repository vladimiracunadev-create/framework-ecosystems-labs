import { siguiente } from "./reglas.mjs";

/**
 * EL ESTADO ES EL OBJETO DE `x-data`.
 *
 * Y su ámbito es el elemento: dos `x-data` hermanos son dos estados
 * independientes, sin que haya que declarar nada. Es el modelo más simple de los
 * ocho — no hay que aprender ninguna primitiva, porque el estado es un objeto de
 * JavaScript escrito en un atributo.
 *
 * El precio está en la línea del botón: `Math.max(0, valor + 1)` es la misma
 * regla que `siguiente()`, escrita otra vez porque un atributo no puede
 * importar un módulo.
 */
function paraAtributo(valor) {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function contador(id = "sola", inicial = 0) {
  const estado = paraAtributo(JSON.stringify({ valor: siguiente(inicial, 0) }));
  return (
    `<div x-data="${estado}" data-instancia="${paraAtributo(id)}" data-valor="${paraAtributo(inicial)}">` +
    `<span x-text="valor">${paraAtributo(inicial)}</span>` +
    `<button x-on:click="valor = Math.max(0, valor + 1)">+1</button>` +
    `<button x-on:click="valor = Math.max(0, valor - 1)">-1</button>` +
    `</div>`
  );
}
