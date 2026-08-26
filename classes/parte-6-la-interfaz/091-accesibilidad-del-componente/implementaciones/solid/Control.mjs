import { ssr, escape } from "solid-js/web";

/**
 * LA VERSIÓN ACCESIBLE.
 *
 * En Solid los atributos se escriben como en HTML —`for`, `class`— igual que en
 * Vue, y el compilador de JSX no renombra nada. Una fuente de olvidos menos.
 *
 * Lo que Solid no tiene es verificador de accesibilidad propio. Existe
 * `eslint-plugin-solid`, que incluye reglas heredadas de `jsx-a11y`, y hay que
 * instalarlo a propósito.
 *
 * Y hay una cosa que Solid hace mejor sin proponérselo: como no reemplaza
 * elementos al actualizar —cambia atributos— **el foco no se pierde** cuando
 * algo cambia cerca. En un modelo de árbol virtual, reemplazar el elemento
 * enfocado lo saca del foco, y ese fallo es sutil y frecuente.
 */
export function ControlAccesible(props) {
  const abierto = () => props.abierto ?? false;
  return ssr(
    [
      '<div data-version="accesible"><button type="button" aria-expanded="',
      '" aria-controls="panel">Detalles</button><div id="panel"',
      '>contenido</div><label for="titulo">Título</label><input id="titulo" name="titulo"></div>',
    ],
    escape(abierto() ? "true" : "false"),
    abierto() ? "" : " hidden",
  );
}

/**
 * LA VERSIÓN INACCESIBLE. Se ve exactamente igual.
 *
 * Un div con manejador de clic, un texto suelto por etiqueta y el estado
 * expresado solo con una clase. Solid la compila sin decir nada.
 */
export function ControlInaccesible(props) {
  const abierto = () => props.abierto ?? false;
  return ssr(
    [
      '<div data-version="inaccesible"><div class="',
      '">Detalles</div><div class="',
      '">contenido</div><span class="etiqueta">Título</span><input name="titulo" tabindex="-1"></div>',
    ],
    escape(abierto() ? "boton abierto" : "boton"),
    escape(abierto() ? "panel visible" : "panel"),
  );
}
