import { createElement as h, useEffect, useState } from "react";

import { cuenta } from "./contadores.mjs";

/**
 * EL EFECTO NO CORRE EN EL SERVIDOR, Y ESE ES EL HECHO MÁS IMPORTANTE.
 *
 * `useEffect` está pensado para lo que ocurre DESPUÉS de que el navegador pinte:
 * suscribirse a algo, medir un elemento, arrancar un temporizador. En el
 * servidor no hay nada de eso, así que React no lo ejecuta.
 *
 * La consecuencia práctica es la que sorprende: si los datos se cargan en un
 * efecto, **el HTML del servidor sale vacío** y el usuario ve «sin cargar» hasta
 * que el JavaScript arranca. Es la causa número uno de páginas que parpadean, y
 * la razón de que existan los metaframeworks de la parte 7.
 *
 * La función que se devuelve es LA LIMPIEZA: se ejecuta al desmontar y antes de
 * cada repetición. Olvidarla es la fuga de memoria clásica.
 */
export function Reloj({ etiqueta = "reloj" }) {
  cuenta.render += 1;
  const [dato, ponerDato] = useState("sin cargar");

  useEffect(() => {
    cuenta.efecto += 1;
    ponerDato("cargado en el navegador");

    return () => {
      cuenta.limpieza += 1;
    };
  }, [etiqueta]);

  return h("div", { "data-componente": "reloj", "data-etiqueta": etiqueta }, dato);
}
