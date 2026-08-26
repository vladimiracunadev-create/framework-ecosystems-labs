"use client";

import { useState } from "react";

/**
 * LA FRONTERA ESTÁ EN LA PRIMERA LÍNEA.
 *
 * `"use client"` no significa «esto se renderiza en el cliente»: este
 * componente SÍ se renderiza en el servidor, y por eso la lista llega pintada.
 * Significa «esto además viaja al navegador y se hidrata».
 *
 * Es la distinción que más confusión causa en Next, y se ve muy bien aquí:
 * `useState(0)` se ejecuta dos veces —una en el servidor y otra en el
 * navegador— y las dos veces sale 0. El mismo trabajo, repetido, para que el
 * `onClick` exista.
 */
export default function ListaViva({ tareas }) {
  const [miradas, setMiradas] = useState(0);
  return (
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
  );
}
