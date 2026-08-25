/**
 * LA REGLA VIVE CON EL ESTADO — y aquí eso es un problema.
 *
 * En los otros siete, esta función se importa desde el componente. En Alpine el
 * componente es un atributo de HTML, así que la expresión de `x-on:click` no
 * puede importar nada: lo que hay ahí dentro se evalúa en el navegador, con lo
 * que haya en el ámbito global.
 *
 * Por eso la regla acaba escrita DOS VECES: aquí, para el servidor y el
 * contrato, y otra vez dentro de la expresión del atributo. Es la duplicación
 * que Alpine cobra por no tener módulos, y con reglas de verdad se nota.
 */
export function siguiente(valorActual, paso) {
  return Math.max(0, valorActual + paso);
}
