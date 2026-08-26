import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { crear, listar } from "../almacen.js";

/**
 * `loader` LEE, `action` ESCRIBE, Y LAS DOS VIVEN EN EL ARCHIVO DE LA RUTA.
 *
 * La simetría no es cosmética. Como Remix conoce las dos funciones, sabe que un
 * `action` acabado invalida lo que el `loader` había traído, y **vuelve a
 * llamarlo solo**. Nadie escribe una línea para eso.
 *
 * Y el redirigir de abajo es el patrón de la clase 080 —enviar, redirigir,
 * mostrar—: sin él, recargar después de enviar reenvía el formulario.
 */
export function loader({ request }) {
  return { tareas: listar(), origen: new URL(request.url).origin };
}

export async function action({ request }) {
  const formulario = await request.formData();
  // El campo «intención» es el patrón que Remix popularizó: con varios botones
  // en el mismo formulario, es lo que distingue qué se ha pulsado. Con uno solo
  // sobra, y se deja porque el contrato es el mismo para los cinco.
  if (formulario.get("intencion") === "crear") {
    crear(formulario.get("texto"));
  }
  return redirect("/tareas");
}

export default function Tareas() {
  const { tareas, origen } = useLoaderData();
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
        `<Form>` de Remix renderiza un `<form method="post">` de verdad. Sin
        JavaScript, el navegador lo envía él solo y llega al `action`. Con
        JavaScript, Remix intercepta el envío y hace lo mismo por detrás sin
        recargar. El mismo código, dos caminos: eso es la mejora progresiva de la
        clase 081, aquí de serie.
      */}
      <Form method="post">
        <input type="hidden" name="intencion" value="crear" />
        <input type="text" name="texto" />
        <button type="submit">Añadir</button>
      </Form>
      <span data-origen={origen}></span>
    </>
  );
}
