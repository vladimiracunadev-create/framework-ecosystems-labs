import { createSignal } from "solid-js";
import { ssr, escape } from "solid-js/web";

import { siguiente } from "./reglas.mjs";

/**
 * `createSignal` DEVUELVE UN PAR: leer y escribir.
 *
 * Se parece a `useState` de React y no funciona igual, y la diferencia está en
 * la primera mitad: `valor` **es una función**. Hay que llamarla —`valor()`—
 * porque leerla es lo que suscribe al lector a los cambios.
 *
 * Eso es lo que permite que el componente se ejecute una sola vez: cuando el
 * valor cambia, Solid no vuelve a llamar a `Contador`, vuelve a llamar solo a
 * los sitios donde `valor()` se leyó.
 *
 * En un componente de tres líneas la diferencia no se ve. En una lista de mil
 * elementos, es la diferencia entre redibujar mil y redibujar uno.
 */
export function Contador(props) {
  const [valor, ponerValor] = createSignal(props.inicial ?? 0);
  const id = () => props.id ?? "sola";

  // `ponerValor` está aquí aunque el servidor no la use: es el canal de
  // escritura, y sin él el ejemplo no enseñaría el par completo.
  void (() => ponerValor((v) => siguiente(v, 1)));

  return ssr(
    ['<div data-instancia="', '" data-valor="', '"><span>', "</span></div>"],
    escape(id()),
    escape(String(valor())),
    escape(String(valor())),
  );
}
