import { ssr, escape } from "solid-js/web";

/**
 * EL COMPONENTE. Una función que se ejecuta UNA VEZ.
 *
 * Aquí está la diferencia que define a Solid, y no se ve en un componente tan
 * pequeño como este: en React esta función se vuelve a llamar cada vez que el
 * estado cambia; en Solid **se llama una sola vez** y lo que se actualiza
 * después son los huecos concretos del marcado.
 *
 * La consecuencia práctica llega en la clase 084 y en la 092. Aquí lo único que
 * se nota es que el componente sigue siendo una función que devuelve marcado,
 * igual que en React.
 *
 * `ssr` y `escape` son lo que el compilador de Solid produce a partir de JSX:
 * plantillas de texto con huecos, no un árbol de objetos. Escribirlo a mano deja
 * ver el modelo sin meter un compilador por delante — y deja ver también que el
 * escapado es una llamada explícita en el código generado.
 */
export function Saludo(props) {
  const texto = () => props.texto ?? "Hola, mundo";
  return ssr(
    ['<h1 data-componente="saludo">', "</h1>"],
    escape(texto()),
  );
}
