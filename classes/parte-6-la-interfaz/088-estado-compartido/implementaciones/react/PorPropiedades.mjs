import { createElement as h } from "react";

/**
 * EL DATO ATRAVESANDO TRES NIVELES.
 *
 * Fíjate en `Medio`: acepta `usuario` y **no lo usa para nada**. Solo lo recibe
 * para pasarlo. Lo mismo con `Rama`.
 *
 * Eso tiene un nombre —*prop drilling*, perforación de propiedades— y no es un
 * problema de estilo: es un problema de acoplamiento. Cada componente
 * intermedio queda atado a un dato que no le importa, así que no se puede mover
 * ni reutilizar sin arrastrarlo.
 *
 * Con un nivel es correcto. Con dos es incómodo. Con cinco y tres datos
 * distintos, cualquier cambio toca quince firmas.
 */
export function Nieto({ usuario }) {
  return h("span", { "data-nivel": "nieto" }, usuario);
}

/** NIVEL INTERMEDIO. Recibe `usuario` y no lo usa: solo lo pasa. */
export function Medio({ usuario }) {
  return h("div", { "data-nivel": "medio" }, h(Nieto, { usuario }));
}

/** OTRO NIVEL INTERMEDIO. Igual: lo acepta porque el de abajo lo necesita. */
export function Rama({ usuario }) {
  return h("div", { "data-nivel": "rama" }, h(Medio, { usuario }));
}

export function Pantalla({ usuario }) {
  return h("div", { "data-nivel": "pantalla" }, h(Rama, { usuario }));
}

/**
 * CUÁNTOS NIVELES ACEPTAN EL DATO SIN USARLO.
 *
 * No es una estimación: se cuenta sobre este archivo. Es la medida honesta de
 * cuándo compensa cambiar de forma — y la única cifra que convierte «esto es
 * incómodo» en un argumento.
 */
export const COSTE = {
  niveles_que_atraviesa: 3,
  niveles_que_no_usan_el_dato: 2,
};
