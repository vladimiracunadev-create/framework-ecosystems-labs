import { Link } from "@remix-run/react";

import { anotar } from "./registro.js";

/** EL COMPONENTE. Recibe las tareas ya cargadas y anota que se ejecuta. */
export default function Lista({ tareas }) {
  anotar("render");
  return (
    <ul data-lista="tareas">
      {tareas.map((tarea) => (
        <li key={tarea.id} data-tarea={tarea.id}>
          <Link to={`/tareas/${tarea.id}`}>{tarea.texto}</Link>
        </li>
      ))}
    </ul>
  );
}
