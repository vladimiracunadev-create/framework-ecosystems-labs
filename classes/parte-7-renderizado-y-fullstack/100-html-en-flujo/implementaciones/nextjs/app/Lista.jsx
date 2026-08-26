import { pedirLaLista } from "./fuente.js";

/** La parte lenta, en su propio componente. Que sea `async` y que esté aparte es
 *  todo lo que Next necesita para poder aplazarla. */
export default async function Lista() {
  const tareas = await pedirLaLista();
  return (
    <ul data-parte="lista">
      {tareas.map((tarea) => (
        <li key={tarea}>{tarea}</li>
      ))}
    </ul>
  );
}
