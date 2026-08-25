/**
 * EL «HIJO» DE HTMX: un fragmento con el aviso escrito en el marcado.
 *
 * En htmx no hay propiedades ni eventos: hay **una petición**. El dato baja
 * porque el servidor lo escribe en el fragmento, y el aviso sube porque el botón
 * lleva `hx-get` con el paso dentro de la dirección.
 *
 * Eso convierte el flujo de datos de esta clase en algo mucho más familiar de lo
 * que parece: **es el mismo de la web de 1995**, con la diferencia de que en vez
 * de recargar la página entera se sustituye un trozo.
 *
 * Y tiene una propiedad que ninguno de los otros siete tiene: el estado vive en
 * un solo sitio —el servidor—, así que no hay dos verdades que sincronizar.
 * Se paga con una ida y vuelta por cada cambio.
 */
function escapar(valor) {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function contador(valor) {
  const v = escapar(valor);
  return (
    `<div data-hijo="contador" data-valor="${v}">` +
    `<span>${v}</span>` +
    `<button hx-get="/evento?valor=${v}&paso=1" hx-target="closest [data-padre]">+1</button>` +
    `<button hx-get="/evento?valor=${v}&paso=-1" hx-target="closest [data-padre]">-1</button>` +
    `</div>`
  );
}
