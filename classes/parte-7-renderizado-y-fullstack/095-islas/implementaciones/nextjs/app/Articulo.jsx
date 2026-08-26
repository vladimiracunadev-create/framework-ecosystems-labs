import { ARTICULO } from "./datos.js";

/**
 * LA PARTE GRANDE Y MUERTA, como componente de servidor.
 *
 * No lleva `"use client"`, así que su código no viaja: el navegador nunca ve
 * esta función. Hasta aquí, igual que la plantilla `.astro` del otro
 * implementador.
 *
 * La diferencia está en lo que sí viaja: **su resultado**. Next manda la
 * descripción del árbol renderizado —la carga RSC— dentro del documento, y ahí
 * está el texto del artículo otra vez. `/islas.json` lo cuenta, y en Astro ese
 * mismo número sale cero.
 */
export default function Articulo() {
  return (
    <article data-zona="estatica">
      {ARTICULO.map((parrafo, i) => (
        <p key={i}>{parrafo}</p>
      ))}
    </article>
  );
}
