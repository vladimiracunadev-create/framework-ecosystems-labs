import { useLoaderData } from "@remix-run/react";

import { SELLO_DE_ARRANQUE, TAREAS } from "../datos";

/**
 * LO MÁS PARECIDO A ESTÁTICO QUE REMIX OFRECE.
 *
 * El sello sale de una constante del módulo, calculada una sola vez al arrancar
 * el proceso. Así que no cambia entre peticiones y el contrato lo ve igual que
 * vería una página prerenderizada.
 *
 * Pero no es lo mismo, y la diferencia importa: aquí el servidor SÍ trabaja en
 * cada petición —renderiza el componente— y lo único constante es el dato. En
 * los otros cuatro, el servidor no ejecuta nada porque el HTML ya existe.
 *
 * La forma correcta de conseguir lo estático en Remix es una cabecera
 * `Cache-Control` y una red de distribución delante, que es exactamente lo que
 * su documentación recomienda.
 */
export function loader() {
  return { tareas: TAREAS, marca: SELLO_DE_ARRANQUE };
}

export function headers() {
  // La cabecera que en un despliegue real haría el trabajo de lo estático.
  return { "Cache-Control": "public, max-age=3600" };
}

export default function Estatico() {
  const { tareas, marca } = useLoaderData();
  return (
    <ul data-estrategia="estatico" data-sello={marca}>
      {tareas.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}
