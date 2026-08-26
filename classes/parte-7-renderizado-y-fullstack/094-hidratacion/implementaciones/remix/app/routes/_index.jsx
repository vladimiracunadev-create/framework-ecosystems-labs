import { useState } from "react";
import { useLoaderData } from "@remix-run/react";

import { TAREAS } from "../datos.js";

/**
 * El `loader` corre en el servidor. Lo que devuelve se usa para renderizar el
 * HTML **y** se serializa dentro del documento, en `window.__remixContext`,
 * para que el navegador tenga el mismo estado al hidratar.
 *
 * En Remix esto no se puede desactivar por ruta: si hay `loader`, sus datos
 * viajan. Es el mismo mecanismo que en SvelteKit, sin interruptor.
 */
export function loader() {
  return { tareas: TAREAS };
}

export default function Indice() {
  const { tareas } = useLoaderData();
  const [miradas, setMiradas] = useState(0);
  return (
    <>
      <h1>Hidratación</h1>
      <section data-hidratacion="pendiente">
        <ul>
          {tareas.map((tarea) => (
            <li key={tarea}>{tarea}</li>
          ))}
        </ul>
        <button
          data-interactivo="si"
          data-cuenta={miradas}
          onClick={() => setMiradas(miradas + 1)}
        >
          He mirado la lista {miradas} veces
        </button>
      </section>
    </>
  );
}
