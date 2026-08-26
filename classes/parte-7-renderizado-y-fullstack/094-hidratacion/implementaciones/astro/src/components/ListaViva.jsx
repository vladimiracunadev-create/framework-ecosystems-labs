import { useState } from "preact/hooks";

/**
 * LA ISLA: EL ÚNICO COMPONENTE DE ESTA APLICACIÓN QUE VIAJA AL NAVEGADOR.
 *
 * Se renderiza en el servidor —de ahí que la lista llegue pintada— y además su
 * código se descarga y se vuelve a ejecutar en el navegador para que el botón
 * funcione. Eso segundo es la hidratación.
 *
 * Fíjate en `useState(0)`: el servidor la ejecuta y sale 0, el navegador la
 * ejecuta otra vez y vuelve a salir 0. El mismo trabajo, hecho dos veces. Es el
 * precio, y no hay forma de evitarlo mientras haya un componente que hidratar.
 */
export default function ListaViva({ tareas }) {
  const [miradas, setMiradas] = useState(0);
  return (
    <section data-hidratacion="pendiente">
      <ul>
        {tareas.map((tarea) => (
          <li key={tarea}>{tarea}</li>
        ))}
      </ul>
      <button
        data-interactivo="si"
        data-cuenta={miradas}
        onClick={() => setMiradas(miradas + 1)}
      >
        He mirado la lista {miradas} veces
      </button>
    </section>
  );
}
