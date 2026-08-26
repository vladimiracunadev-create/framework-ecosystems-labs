import { useLoaderData } from "@remix-run/react";

import Lista from "../Lista.jsx";
import Traza from "../Traza.jsx";
import { pedirLasTareas } from "../datos.js";

/**
 * EL `loader` ES EL ORIGINAL DE TODO ESTO.
 *
 * Remix lo llevó a su conclusión: la ruta es la unidad, la ruta declara qué
 * datos necesita, y el framework se encarga de tenerlos antes de renderizar. Sin
 * estado de carga, sin efecto en el cliente, sin componente que se monte vacío.
 *
 * Y como es una exportación con nombre, el framework puede hacer cosas con ella:
 * llamarla al pasar el ratón por un enlace, ejecutarla en paralelo con las de
 * las rutas padre —clase 099— y volver a llamarla después de un `action`
 * —clase 098— sin que nadie tenga que pedirlo.
 */
export async function loader() {
  return { tareas: await pedirLasTareas() };
}

export default function Tareas() {
  const { tareas } = useLoaderData();
  return (
    <>
      <h1>Tareas</h1>
      <Lista tareas={tareas} />
      <Traza />
    </>
  );
}
