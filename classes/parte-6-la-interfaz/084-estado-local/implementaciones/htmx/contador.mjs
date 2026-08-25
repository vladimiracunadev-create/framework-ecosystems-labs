import { siguiente } from "./reglas.mjs";

/**
 * EN HTMX NO HAY ESTADO LOCAL, Y ESA ES LA POSTURA.
 *
 * Lo que en los otros siete vive dentro del componente, aquí vive en el
 * servidor y viaja en la dirección de la petición. El «estado local» de este
 * contador es el número que va en `?valor=`.
 *
 * Suena a limitación y es una decisión con nombre: **una sola fuente de
 * verdad**. En los otros siete hay dos copias del dato —la del servidor y la del
 * cliente— y mantenerlas de acuerdo es la mitad del trabajo de una aplicación
 * moderna. Aquí no hay segunda copia porque no hay cliente con memoria.
 *
 * Se paga con una petición por cada cambio, y con que sin red no hay interfaz.
 */
function escapar(valor) {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function contador(id = "sola", valor = 0) {
  const v = escapar(siguiente(valor, 0));
  const i = escapar(id);
  return (
    `<div data-instancia="${i}" data-valor="${v}">` +
    `<span>${v}</span>` +
    `<button hx-get="/paso?id=${i}&valor=${v}&paso=1" hx-target="closest [data-instancia]" hx-swap="outerHTML">+1</button>` +
    `<button hx-get="/paso?id=${i}&valor=${v}&paso=-1" hx-target="closest [data-instancia]" hx-swap="outerHTML">-1</button>` +
    `</div>`
  );
}
