/**
 * EL «HIJO» DE ALPINE: marcado con `$dispatch`.
 *
 * Alpine no tiene componentes con propiedades, pero sí tiene las dos
 * direcciones, y las resuelve con las herramientas del navegador:
 *
 *   - hacia abajo, el dato se escribe en el `x-data` del elemento;
 *   - hacia arriba, `$dispatch` lanza un `CustomEvent` que burbujea, y el padre
 *     lo escucha con `x-on:cambiar` — igual que en Lit.
 *
 * La diferencia con Lit no es el mecanismo, es dónde se declara: allí en una
 * clase, aquí en un atributo. El canal es el mismo evento del DOM.
 */
function paraAtributo(valor) {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function contador(valor) {
  const estado = paraAtributo(JSON.stringify({ valor }));
  const v = paraAtributo(valor);
  return (
    `<div x-data="${estado}" data-hijo="contador" data-valor="${v}">` +
    `<span x-text="valor">${v}</span>` +
    `<button x-on:click="$dispatch('cambiar', 1)">+1</button>` +
    `<button x-on:click="$dispatch('cambiar', -1)">-1</button>` +
    `</div>`
  );
}
