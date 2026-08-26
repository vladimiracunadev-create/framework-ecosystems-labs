"use client";

import { useState } from "react";

/**
 * ISLA 2. Recibe las tareas del componente de servidor que la usa, así que las
 * tareas cruzan la frontera y se serializan.
 *
 * Es la misma regla que en Astro —viaja lo que cruza el borde— con una
 * diferencia importante: aquí, además, viaja el resultado de todo lo que el
 * servidor renderizó alrededor.
 */
export default function Filtro({ tareas }) {
  const [texto, setTexto] = useState("");
  const visibles = tareas.filter((t) => t.includes(texto));
  return (
    <div data-isla="filtro">
      <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="filtrar" />
      <ul>
        {visibles.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
