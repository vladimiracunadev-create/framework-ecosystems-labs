import { createElement as h } from "react";

/**
 * LA VERSIÓN ACCESIBLE. Elementos nativos y estado expuesto.
 *
 * Fíjate en lo poco que hay: un `<button>` en lugar de un `<div>`, una `<label>`
 * con `htmlFor`, y un `aria-expanded`. Tres decisiones, y la diferencia entre un
 * componente que puede usar todo el mundo y uno que no.
 *
 * `htmlFor` es el nombre que React le da a `for`, porque `for` es palabra
 * reservada en JavaScript. Es de las pocas veces que React cambia el nombre de
 * un atributo del HTML, y por eso se olvida tanto.
 */
export function ControlAccesible({ abierto = false }) {
  return h(
    "div",
    { "data-version": "accesible" },
    h(
      "button",
      { type: "button", "aria-expanded": abierto ? "true" : "false", "aria-controls": "panel" },
      "Detalles",
    ),
    h("div", { id: "panel", hidden: !abierto }, "contenido"),
    h("label", { htmlFor: "titulo" }, "Título"),
    h("input", { id: "titulo", name: "titulo" }),
  );
}

/**
 * LA VERSIÓN INACCESIBLE. Se ve exactamente igual.
 *
 * Un `<div>` con una clase que lo pinta como botón, un texto suelto encima del
 * campo, y el estado abierto expresado solo con una clase de CSS.
 *
 * Nada de esto da error. Ninguna prueba de render lo detecta. En la pantalla es
 * indistinguible — y para quien navega con teclado, el botón no existe.
 */
export function ControlInaccesible({ abierto = false }) {
  return h(
    "div",
    { "data-version": "inaccesible" },
    h("div", { className: abierto ? "boton abierto" : "boton", onClick: () => {} }, "Detalles"),
    h("div", { className: abierto ? "panel visible" : "panel" }, "contenido"),
    h("span", { className: "etiqueta" }, "Título"),
    h("input", { name: "titulo", tabIndex: -1 }),
  );
}
