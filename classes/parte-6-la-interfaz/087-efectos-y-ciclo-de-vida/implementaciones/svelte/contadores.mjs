/**
 * LOS CONTADORES QUE HACEN VISIBLE EL CICLO DE VIDA.
 *
 * Un efecto no devuelve nada y no aparece en el HTML: por definición, lo que
 * hace ocurre fuera. Así que para poder comprobarlo por contrato hay que dejar
 * una marca, y estos contadores son esa marca.
 *
 * No es un apaño del laboratorio: es exactamente lo que se hace al depurar un
 * efecto que no se sabe si corre — un `console.log` con una cuenta.
 */
export const cuenta = {
  render: 0,
  efecto: 0,
  limpieza: 0,
};

export function reiniciar() {
  cuenta.render = 0;
  cuenta.efecto = 0;
  cuenta.limpieza = 0;
}

/**
 * LA COMPARACIÓN DE DEPENDENCIAS, TAL Y COMO LA HACEN LOS CUATRO.
 *
 * Superficial y con `Object.is`: se comparan los elementos de la lista uno a
 * uno, sin mirar dentro. De ahí sale el error más común con efectos — poner un
 * objeto o un array literal en las dependencias, que es distinto en cada render
 * aunque su contenido sea igual, y hace que el efecto se repita siempre.
 */
export function debeRepetirse(antes, despues) {
  if (antes === null) return true;
  if (antes.length !== despues.length) return true;
  return antes.some((valor, i) => !Object.is(valor, despues[i]));
}
