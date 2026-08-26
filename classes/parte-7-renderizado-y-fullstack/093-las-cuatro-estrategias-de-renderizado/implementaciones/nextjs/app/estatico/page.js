import { TAREAS, sello } from "../datos";

/**
 * ESTÁTICA POR OMISIÓN.
 *
 * En el enrutador de aplicación de Next, una página sin nada dinámico dentro
 * **se genera al construir**. No hace falta pedirlo: hay que pedir lo contrario.
 *
 * `dynamic = "force-static"` está escrito igualmente para que la diferencia con
 * la página de al lado se vea sin tener que conocer la regla por omisión.
 */
export const dynamic = "force-static";

export default function Estatico() {
  const marca = sello();
  return (
    <ul data-estrategia="estatico" data-sello={marca}>
      {TAREAS.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}
