import { useLoaderData } from "@remix-run/react";

import { nombreDeQuienMira, pedirLaLista } from "../fuente.js";

/** El mismo `loader` con el `await` puesto. Una palabra de diferencia. */
export async function loader() {
  return {
    nombre: nombreDeQuienMira(),
    tareas: await pedirLaLista(),
  };
}

export default function SinFlujo() {
  const { nombre, tareas } = useLoaderData();
  return (
    <main>
      <h1 data-parte="cabecera">Hola, {nombre}</h1>
      <ul data-parte="lista">
        {tareas.map((tarea) => (
          <li key={tarea}>{tarea}</li>
        ))}
      </ul>
    </main>
  );
}
