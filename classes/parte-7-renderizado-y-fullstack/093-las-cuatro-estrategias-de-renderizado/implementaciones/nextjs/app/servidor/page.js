import { TAREAS, sello } from "../datos";

/**
 * `force-dynamic` saca esta página del lote estático.
 *
 * A partir de aquí se renderiza EN CADA PETICIÓN, y el sello lo demuestra. Es la
 * misma decisión que en Astro se toma con `prerender` y en SvelteKit con la
 * misma palabra: una línea por pantalla.
 *
 * En Next hay además una vía indirecta que sorprende a mucha gente: usar una
 * función que lee la petición —cookies, cabeceras— **convierte la ruta en
 * dinámica sola**, sin declararlo. Es cómodo y hace difícil saber qué estrategia
 * tiene cada pantalla sin construir el proyecto.
 */
export const dynamic = "force-dynamic";

export default function Servidor() {
  const marca = sello();
  return (
    <ul data-estrategia="servidor" data-sello={marca}>
      {TAREAS.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}
