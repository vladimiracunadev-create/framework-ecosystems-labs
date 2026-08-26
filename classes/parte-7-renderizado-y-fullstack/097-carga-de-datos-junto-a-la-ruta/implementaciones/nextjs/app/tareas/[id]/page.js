import { notFound } from "next/navigation";

import Traza from "../../Traza.jsx";
import { anotar } from "../../registro.js";
import { pedirUnaTarea } from "../../datos.js";

export const dynamic = "force-dynamic";

/**
 * `notFound()` no devuelve: lanza. Next lo recoge, renderiza la pantalla de no
 * encontrado y **manda un 404 de verdad**.
 *
 * Es un detalle que separa a los frameworks serios del resto: una pantalla de
 * error con estado 200 miente a los buscadores, a las cachés y a cualquiera que
 * llame a la ruta desde un programa.
 */
export default async function Pagina({ params }) {
  const { id } = await params;
  const tarea = await pedirUnaTarea(id);
  if (!tarea) notFound();
  anotar("render");
  return (
    <>
      <h1 data-tarea={tarea.id}>{tarea.texto}</h1>
      <a href="/tareas">volver</a>
      <Traza />
    </>
  );
}
