import { pedirLaLista } from "../fuente.js";
import { nombreDeQuienMira } from "../fuente.js";

export const dynamic = "force-dynamic";

/**
 * La misma pantalla sin `<Suspense>`: el `await` está en la propia página, así
 * que no hay nada que Next pueda mandar antes de que termine.
 *
 * El resultado final es idéntico byte a byte en lo que importa. La diferencia
 * está en el reloj, y solo se ve leyendo la respuesta a trozos.
 */
export default async function Pagina() {
  const tareas = await pedirLaLista();
  return (
    <main>
      <h1 data-parte="cabecera">Hola, {nombreDeQuienMira()}</h1>
      <ul data-parte="lista">
        {tareas.map((tarea) => (
          <li key={tarea}>{tarea}</li>
        ))}
      </ul>
    </main>
  );
}
