import { createElement as h } from "react";

/**
 * EL HIJO. Recibe un valor y una función.
 *
 * Y aquí está la regla que organiza toda la comunicación entre componentes:
 * **el hijo no cambia el valor**. Lo muestra, y cuando el usuario pulsa el
 * botón, llama a la función que le dieron para avisar de cuánto quiere
 * cambiarlo.
 *
 * Quién decide es el padre. El hijo ni siquiera sabe qué va a pasar con su
 * aviso — puede que el padre sume, puede que ignore, puede que pida
 * confirmación. Esa ignorancia es lo que hace al hijo reutilizable.
 *
 * En React el canal de subida es **una función que baja como una propiedad
 * más**. No hay mecanismo aparte: `alCambiar` es igual que `valor`, solo que
 * resulta ser invocable.
 */
export function Contador({ valor, alCambiar }) {
  return h(
    "div",
    { "data-hijo": "contador", "data-valor": String(valor) },
    h("span", null, String(valor)),
    h("button", { onClick: () => alCambiar(1) }, "+1"),
    h("button", { onClick: () => alCambiar(-1) }, "-1"),
  );
}
