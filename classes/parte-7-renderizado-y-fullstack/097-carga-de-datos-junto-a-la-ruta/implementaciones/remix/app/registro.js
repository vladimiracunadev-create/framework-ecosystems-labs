/**
 * UN CUADERNO DE BITÁCORA, IDÉNTICO EN LAS CINCO IMPLEMENTACIONES.
 *
 * La promesa que esta clase tiene que demostrar es esta: **la carga de datos
 * empieza antes de que el componente exista**. Es una afirmación sobre el orden
 * de dos cosas, y el orden no se ve en el resultado: la lista sale igual de
 * pintada se cargue cuando se cargue.
 *
 * Así que se anota. La función de carga anota cuándo empieza y cuándo termina;
 * el componente anota cuándo se ejecuta. La página emite la secuencia resultante
 * en un atributo, y `/orden.json` la lee.
 *
 * Sale lo mismo en las cinco: `carga:inicio`, `carga:fin`, `render`.
 */

let eventos = [];

/** La función de carga llama a esto al empezar. Sin reiniciar, el cuaderno
 *  arrastraría los eventos de la petición anterior y la secuencia crecería. */
export function reiniciar() {
  eventos = [];
}

export function anotar(que) {
  eventos.push(que);
}

/** La secuencia, lista para meterla en un atributo HTML. */
export function secuencia() {
  return eventos.join("|");
}
