import { createElement as h } from "react";

/**
 * EL COMPONENTE. Una función que recibe propiedades y devuelve marcado.
 *
 * En React no hay nada más: no hereda de ninguna clase, no se registra en
 * ningún sitio y no se declara en ningún archivo de configuración. Es una
 * función, y por eso se puede probar llamándola.
 *
 * Se escribe con `createElement` en lugar de con JSX a propósito: JSX no es
 * JavaScript, hace falta un compilador, y esta clase quiere enseñar el modelo
 * sin meter una herramienta de construcción por delante. `h("h1", props, hijos)`
 * es exactamente en lo que JSX se convierte.
 */
export function Saludo({ texto = "Hola, mundo" }) {
  return h("h1", { "data-componente": "saludo" }, texto);
}
