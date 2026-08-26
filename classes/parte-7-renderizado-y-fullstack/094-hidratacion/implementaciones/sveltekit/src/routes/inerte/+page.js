/**
 * LA LÍNEA QUE APAGA LA HIDRATACIÓN.
 *
 * `csr = false` —de *client-side rendering*— le dice a SvelteKit que para esta
 * ruta no mande el enlace al código del componente ni el estado serializado. La
 * página llega renderizada y se queda así.
 *
 * De los cinco frameworks de la clase, este es el interruptor más explícito:
 * una constante exportada, por ruta, con un nombre que dice lo que hace. En Next
 * hay que quitar `"use client"` de todo el árbol; en Astro hay que no poner
 * `client:*`; en Nuxt hay que tocar la tabla de reglas; en Remix no hay
 * interruptor.
 */
export const csr = false;
