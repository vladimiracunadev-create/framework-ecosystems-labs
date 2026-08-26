import { ssr, escape } from "solid-js/web";

import { leer } from "./almacen.mjs";

/**
 * EL MISMO ÁRBOL, SIN QUE EL DATO LO ATRAVIESE.
 *
 * En Solid el almacén compartido tiene una ventaja que en React no existe: como
 * la reactividad es fina, **escribir en el almacén solo redibuja los sitios que
 * lo leyeron**. No hay que envolver nada en memorias ni preocuparse de que la
 * mitad del árbol se vuelva a renderizar.
 *
 * En React, un contexto que cambia hace que se vuelvan a ejecutar todos los
 * componentes que lo consumen —y sus hijos— salvo que uno lo evite a mano. Es la
 * queja clásica sobre el contexto de React, y aquí simplemente no aparece.
 */
export function Nieto() {
  return ssr(['<span data-nivel="nieto">', "</span>"], escape(leer()));
}

/** NIVEL INTERMEDIO. Sin propiedades: no sabe que hay un usuario. */
export function Medio() {
  return ssr(['<div data-nivel="medio">', "</div>"], Nieto());
}

export function Rama(props) {
  return ssr(
    ['<div data-nivel="rama" data-rama="', '">', "</div>"],
    escape(props.lado ?? "unica"),
    Medio(),
  );
}

export function Pantalla() {
  return ssr(['<div data-nivel="pantalla">', "</div>"], Rama({}));
}

export function DosRamas() {
  return ssr(
    ['<div data-nivel="pantalla">', "", "</div>"],
    Rama({ lado: "izquierda" }),
    Rama({ lado: "derecha" }),
  );
}
