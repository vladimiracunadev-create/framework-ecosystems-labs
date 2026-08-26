import { ssr, escape } from "solid-js/web";

/**
 * EL DATO ATRAVESANDO TRES NIVELES.
 *
 * `Medio` y `Rama` reciben `props` con un `usuario` que no leen: solo lo
 * reenvían. En Solid esto tiene un matiz propio que conviene decir — como las
 * propiedades son accesos perezosos, **reenviarlas no cuesta nada**: el valor no
 * se lee hasta abajo del todo.
 *
 * Así que el coste aquí no es de rendimiento, es de acoplamiento: los niveles
 * intermedios siguen atados a un dato que no les importa, y eso no lo arregla
 * ninguna optimización.
 */
export function Nieto(props) {
  return ssr(['<span data-nivel="nieto">', "</span>"], escape(String(props.usuario)));
}

/** NIVEL INTERMEDIO. Reenvía `usuario` sin leerlo. */
export function Medio(props) {
  return ssr(['<div data-nivel="medio">', "</div>"], Nieto({ usuario: props.usuario }));
}

export function Rama(props) {
  return ssr(['<div data-nivel="rama">', "</div>"], Medio({ usuario: props.usuario }));
}

export function Pantalla(props) {
  return ssr(['<div data-nivel="pantalla">', "</div>"], Rama({ usuario: props.usuario }));
}

export const COSTE = {
  niveles_que_atraviesa: 3,
  niveles_que_no_usan_el_dato: 2,
};
