import Link from "next/link";

import { anotar } from "./registro.js";

/** EL COMPONENTE. Recibe las tareas ya cargadas y anota que se ejecuta. Ese
 *  apunte aparece siempre después de `carga:fin`. */
export default function Lista({ tareas }) {
  anotar("render");
  return (
    <ul data-lista="tareas">
      {tareas.map((tarea) => (
        <li key={tarea.id} data-tarea={tarea.id}>
          <Link href={`/tareas/${tarea.id}`}>{tarea.texto}</Link>
        </li>
      ))}
    </ul>
  );
}
