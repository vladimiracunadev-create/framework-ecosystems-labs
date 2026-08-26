import { redirect } from "@sveltejs/kit";

import { crear, listar } from "$lib/almacen.js";

/**
 * `actions` ES UN OBJETO, Y ESO ES UNA DIFERENCIA DE VERDAD.
 *
 * Remix tiene un `action` por ruta. SvelteKit tiene **varios con nombre**, y el
 * formulario elige cuál con `action="?/borrar"`. En una pantalla con tres
 * botones —crear, marcar, borrar— eso ahorra el `if` sobre un campo oculto que
 * hace falta en los otros cuatro.
 *
 * Aquí solo hay una y se llama `default`, que es la que recibe un `<form
 * method="POST">` sin más.
 */
export function load({ url }) {
  // `url.origin` y no la cabecera `Host`: es exactamente el valor con el que
  // SvelteKit compara el `Origin` de un POST de formulario, y con el adaptador
  // de Node no siempre coinciden. Ver el comentario de `+page.svelte`.
  return { tareas: listar(), origen: url.origin };
}

export const actions = {
  default: async ({ request }) => {
    const formulario = await request.formData();
    if (formulario.get("intencion") === "crear") {
      crear(formulario.get("texto"));
    }
    // Sin esta redirección, SvelteKit devolvería 200 con la página ya
    // actualizada: funciona, y deja el POST en el historial. El patrón de la
    // clase 080 sigue valiendo aquí.
    redirect(303, "/tareas");
  },
};
