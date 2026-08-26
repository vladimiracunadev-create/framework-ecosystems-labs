import { Suspense } from "react";
import { Await, useLoaderData } from "@remix-run/react";

import { nombreDeQuienMira, pedirLaLista } from "../fuente.js";

/**
 * REMIX APLAZA LO QUE SE DEVUELVE SIN RESOLVER, IGUAL QUE SVELTEKIT.
 *
 * Con `v3_singleFetch`, una promesa devuelta por el `loader` no se espera: viaja
 * el resto de la respuesta y ella llega después. La declaración es la misma que
 * en SvelteKit —un `await` que no se escribe— y la forma de consumirla es la de
 * React: `<Suspense>` con `<Await>` dentro.
 *
 * Es un buen ejemplo de por qué comparar frameworks por su sintaxis engaña. La
 * decisión —qué se aplaza— se escribe igual en los dos; lo que cambia es quién
 * pinta la parte aplazada, y eso no se ve en el código.
 */
export function loader() {
  return {
    nombre: nombreDeQuienMira(),
    tareas: pedirLaLista(),
  };
}

export default function Flujo() {
  const { nombre, tareas } = useLoaderData();
  return (
    <main>
      <h1 data-parte="cabecera">Hola, {nombre}</h1>
      <Suspense fallback={<p data-parte="esperando">cargando la lista…</p>}>
        <Await resolve={tareas}>
          {(lista) => (
            <ul data-parte="lista">
              {lista.map((tarea) => (
                <li key={tarea}>{tarea}</li>
              ))}
            </ul>
          )}
        </Await>
      </Suspense>
    </main>
  );
}
