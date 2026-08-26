import { createSignal, onCleanup, onMount } from "solid-js";
import { ssr, escape } from "solid-js/web";

import { cuenta } from "./contadores.mjs";

/**
 * EN SOLID EL EFECTO SE PARECE MUCHO MÁS A LO QUE UNO CREÍA QUE ERA `useEffect`.
 *
 * `createEffect` corre después de que el componente se haya montado y **vuelve a
 * correr solo cuando cambia algo que leyó**. No hay lista de dependencias: la
 * suscripción se establece al leer la señal, igual que en el render.
 *
 * Eso quita de golpe dos errores clásicos de React: la dependencia olvidada —no
 * hay lista— y el efecto que se repite siempre porque en las dependencias hay un
 * objeto literal.
 *
 * `onMount` es azúcar sobre un efecto que solo corre una vez, y `onCleanup`
 * registra la limpieza. Ninguno de los dos corre en el servidor.
 */
export function Reloj(props) {
  cuenta.render += 1;
  const [dato, ponerDato] = createSignal("sin cargar");
  const etiqueta = () => props.etiqueta ?? "reloj";

  onMount(() => {
    cuenta.efecto += 1;
    ponerDato("cargado en el navegador");
  });

  onCleanup(() => {
    cuenta.limpieza += 1;
  });

  return ssr(
    ['<div data-componente="reloj" data-etiqueta="', '">', "</div>"],
    escape(etiqueta()),
    escape(dato()),
  );
}
