import { createElement as h } from "react";

import { leer } from "./almacen.mjs";

/**
 * EL MISMO ÁRBOL, SIN QUE EL DATO LO ATRAVIESE.
 *
 * Compara las firmas con las de `PorPropiedades.mjs`: aquí `Medio` y `Rama` no
 * aceptan nada. No saben que existe un usuario, y por eso se pueden mover a
 * cualquier sitio.
 *
 * El nieto lo pide directamente. En React de verdad esto sería `useContext` o
 * un gancho de la biblioteca de estado; la mecánica es la misma — leer de algo
 * que está fuera del árbol de propiedades.
 */
export function Nieto() {
  return h("span", { "data-nivel": "nieto" }, leer());
}

/** NIVEL INTERMEDIO. No acepta nada: no sabe que hay un usuario. */
export function Medio() {
  return h("div", { "data-nivel": "medio" }, h(Nieto));
}

export function Rama({ lado = "unica" }) {
  return h("div", { "data-nivel": "rama", "data-rama": lado }, h(Medio));
}

export function Pantalla() {
  return h("div", { "data-nivel": "pantalla" }, h(Rama));
}

/** DOS RAMAS QUE LEEN LO MISMO SIN CONOCERSE. */
export function DosRamas() {
  return h(
    "div",
    { "data-nivel": "pantalla" },
    h(Rama, { lado: "izquierda" }),
    h(Rama, { lado: "derecha" }),
  );
}
