import { useLoaderData } from "@remix-run/react";

import { TAREAS, sello } from "../datos";

/**
 * EL MODELO POR OMISIÓN DE REMIX, Y EL ÚNICO.
 *
 * `loader` corre en el servidor en cada petición. No hay que declarar nada
 * porque no hay alternativa que declarar — y esa ausencia de opciones es lo que
 * Remix ofrece a cambio: una sola forma de hacer las cosas.
 */
export function loader() {
  return { tareas: TAREAS, marca: sello() };
}

export default function Servidor() {
  const { tareas, marca } = useLoaderData();
  return (
    <ul data-estrategia="servidor" data-sello={marca}>
      {tareas.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}
