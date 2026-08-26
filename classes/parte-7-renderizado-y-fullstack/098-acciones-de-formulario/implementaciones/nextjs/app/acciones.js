"use server";

import { revalidatePath } from "next/cache";

import { crear } from "./almacen.js";

/**
 * UNA ACCIÓN DE SERVIDOR: UNA FUNCIÓN QUE SE PASA COMO SI FUERA UN MANEJADOR.
 *
 * `"use server"` es la directiva simétrica de `"use client"` de la clase 094.
 * Marca que estas funciones se ejecutan en el servidor **aunque se invoquen
 * desde el navegador**: Next crea una ruta por cada una y le pone un
 * identificador, y ese identificador viaja en el formulario.
 *
 * `revalidatePath` es la línea que en Remix y en SvelteKit no hace falta: allí,
 * terminar una acción invalida lo que se había cargado. Aquí hay que decirlo.
 */
export async function crearTarea(formulario) {
  crear(formulario.get("texto"));
  revalidatePath("/tareas");
}
