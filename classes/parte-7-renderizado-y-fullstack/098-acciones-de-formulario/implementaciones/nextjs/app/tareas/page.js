import { headers } from "next/headers";

import { crearTarea } from "../acciones.js";
import { listar } from "../almacen.js";

export const dynamic = "force-dynamic";

export default async function Pagina() {
  const tareas = listar();
  const anfitrion = (await headers()).get("host");
  return (
    <>
      <h1>Tareas</h1>
      <ul>
        {tareas.map((tarea) => (
          <li key={tarea.id} data-tarea={tarea.id}>
            {tarea.texto}
          </li>
        ))}
      </ul>
      {/*
        `action={crearTarea}` no es una URL: es una función. Next la convierte en
        un `<form method="POST">` con un campo oculto que lleva el identificador
        de la acción, y el formulario apunta a la propia página.

        Sin JavaScript, el navegador envía ese formulario, Next reconoce el
        identificador, ejecuta la función en el servidor y devuelve la página ya
        actualizada. Es mejora progresiva de verdad, y el campo oculto es lo que
        la hace posible: el contrato lo lee del HTML y lo devuelve, igual que un
        navegador.
      */}
      <form action={crearTarea}>
        <input type="text" name="texto" />
        <button type="submit">Añadir</button>
      </form>
      <span data-origen={`http://${anfitrion}`}></span>
    </>
  );
}
