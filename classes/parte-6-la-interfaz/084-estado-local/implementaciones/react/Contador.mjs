import { createElement as h, useState } from "react";

/**
 * `useState` DECLARA UN DATO QUE VIVE DENTRO.
 *
 * No entra por propiedades y no sale por eventos: es del componente. Y cuando
 * el componente se usa dos veces, hay dos estados — React los guarda por
 * posición en el árbol, no por nombre.
 *
 * `inicial` sí es una propiedad, y esa distinción es la que más se confunde:
 * lo que se recibe es **el valor de partida**, no el estado. A partir del primer
 * render, cambiar `inicial` desde fuera no hace nada. En React eso tiene nombre
 * —«propiedad no controlada»— y es fuente de errores para todo el mundo.
 */
export function Contador({ id = "sola", inicial = 0 }) {
  const [valor, ponerValor] = useState(inicial);

  return h(
    "div",
    { "data-instancia": id, "data-valor": String(valor) },
    h("span", null, String(valor)),
    h("button", { onClick: () => ponerValor(siguiente(valor, 1)) }, "+1"),
    h("button", { onClick: () => ponerValor(siguiente(valor, -1)) }, "-1"),
  );
}

/**
 * LA REGLA VIVE CON EL ESTADO.
 *
 * «No baja de cero» no es cosa del padre ni del botón: es una propiedad de este
 * contador. Ponerla aquí, en una función pura, es lo que permite probarla sin
 * renderizar nada — y lo que evita que dos sitios distintos la apliquen distinto.
 */
export function siguiente(valorActual, paso) {
  return Math.max(0, valorActual + paso);
}
