import { useLoaderData } from "@remix-run/react";

import Traza from "../Traza.jsx";
import { anotar } from "../registro.js";
import { pedirUnaTarea } from "../datos.js";

/**
 * `params` llega como argumento, igual que en SvelteKit.
 *
 * Y el 404 se da lanzando una `Response` de la plataforma web, sin ninguna
 * función del framework de por medio. Es la postura de Remix llevada al detalle:
 * cuando el estándar ya tiene una forma de decir algo, se usa esa.
 */
export async function loader({ params }) {
  const tarea = await pedirUnaTarea(params.id);
  if (!tarea) throw new Response("esa tarea no existe", { status: 404 });
  return { tarea };
}

export default function Detalle() {
  const { tarea } = useLoaderData();
  anotar("render");
  return (
    <>
      <h1 data-tarea={tarea.id}>{tarea.texto}</h1>
      <a href="/tareas">volver</a>
      <Traza />
    </>
  );
}
