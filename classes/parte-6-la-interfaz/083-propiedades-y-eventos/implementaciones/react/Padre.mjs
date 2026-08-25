import { createElement as h } from "react";

import { Contador } from "./Contador.mjs";

/**
 * EL PADRE. Tiene el valor y decide qué hacer con los avisos.
 *
 * `alRecibirCambio` es el manejador de verdad: la función que se ejecuta cuando
 * el hijo avisa. Está exportada aparte a propósito, para que el contrato pueda
 * llamarla y comprobar que produce el estado nuevo — sin necesidad de un
 * navegador que dispare el clic.
 *
 * Esa separación no es un truco para poder probarla: es buena práctica. Una
 * función que calcula el estado siguiente a partir del actual y de un evento se
 * puede probar sola, y es la misma idea que hay detrás de un reductor.
 */
export function alRecibirCambio(valorActual, paso) {
  return valorActual + paso;
}

export function Padre({ valor = 0 }) {
  return h(
    "div",
    { "data-padre": "app" },
    // DATOS HACIA ABAJO: el valor viaja como propiedad.
    // AVISOS HACIA ARRIBA: la función también viaja hacia abajo, pero lo que
    // transporta —la llamada— sube.
    h(Contador, { valor, alCambiar: (paso) => alRecibirCambio(valor, paso) }),
  );
}
