import { ssr, escape } from "solid-js/web";

/**
 * EL HIJO. Las propiedades se LEEN, no se desestructuran.
 *
 * Es la trampa número uno de quien llega desde React: escribir
 * `function Contador({ valor })` rompe la reactividad de Solid, porque
 * desestructurar lee el valor UNA VEZ y se queda con esa copia.
 *
 * En React eso no importa —la función se vuelve a llamar entera en cada
 * cambio—; en Solid la función se llama una sola vez, así que hay que leer
 * `props.valor` en el momento de usarlo. De ahí el `() =>` de abajo.
 *
 * El canal de subida es una función, como en React: `props.alCambiar`.
 */
export function Contador(props) {
  const valor = () => props.valor;
  return ssr(
    ['<div data-hijo="contador" data-valor="', '"><span>', "</span></div>"],
    escape(String(valor())),
    escape(String(valor())),
  );
}
