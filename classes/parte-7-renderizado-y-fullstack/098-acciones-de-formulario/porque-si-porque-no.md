# Por qué sí y por qué no — Acciones de formulario

> [⬅️ Clase 098](README.md) · [📚 Parte 7](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Remix](../../../atlas/fichas/remix.md) | `loader` y `action` juntos: escribir invalida la lectura solo | Una acción por ruta: varios botones piden un campo de intención | Un `if` sobre ese campo en cada pantalla con más de un botón |
| [SvelteKit](../../../atlas/fichas/sveltekit.md) | Varias acciones con nombre, y comprobación de origen de serie | Dos archivos por pantalla, y un 403 que desconcierta la primera vez | La ceremonia de separar página y servidor |
| [Next.js](../../../atlas/fichas/nextjs.md) | La sintaxis más elegante: una función donde iba una URL | Hay que decirle a mano qué invalidar, con `revalidatePath` | Una línea fácil de olvidar y un fallo que parece de caché |
| [Astro](../../../atlas/fichas/astro.md) | Un `if` sobre el método: nada que aprender, y protección de origen incluida | El framework no participa: ni invalida, ni valida, ni sabe | Escribirlo todo, incluida la validación |
| [Nuxt](../../../atlas/fichas/nuxt.md) | Una ruta de servidor normal: funciona igual desde cualquier cliente | Ninguna relación declarada entre la escritura y la pantalla | Dos mundos separados, y un almacén que se duplica sin avisar |

## 🧭 Lo que este contrato no puede probar

- **Qué mejora cuando hay JavaScript.** El envío sin recargar, el estado de
  «enviando», la actualización optimista: todo eso ocurre en el navegador y aquí
  no hay ninguno. Lo que sí queda probado es que **nada de eso hace falta para
  que funcione**.
- **La revalidación automática.** Que Remix y SvelteKit vuelvan a ejecutar la
  carga tras la acción se nota al navegar sin recargar. Con una redirección de
  por medio, el efecto se ve igual y la causa no se distingue.
- **La protección contra falsificación de verdad.** El contrato comprueba que
  Astro y SvelteKit exigen el `Origin`, no que la protección sea suficiente. La
  clase 080 se ocupa del testigo, de `SameSite` y de lo que falta.
- **La concurrencia.** Dos altas a la vez sobre un almacén en memoria es un
  problema real que aquí no se toca; es la parte 4 y la clase 112.

## 💡 Lo que hay que llevarse

Lo primero, y es la buena noticia: **los cinco funcionan sin JavaScript**. Ni uno
de los cinco metaframeworks obliga a ejecutar código en el navegador para dar de
alta un dato. La mejora progresiva de la clase 081 no está en contra de este
ecosistema: está dentro.

Lo segundo es la pregunta que separa a dos de los cinco, y es la misma de la
clase 097 vista desde el otro lado: **¿el framework sabe que esto era una
escritura?** Si lo sabe —`action` en Remix, `actions` en SvelteKit— también sabe
que lo que se acaba de escribir invalida lo que se acababa de leer, y vuelve a
cargarlo sin que nadie lo pida. Si no lo sabe, hay que decírselo (`revalidatePath`)
o recargar la página entera.

Lo tercero, y es de higiene: **el formulario vacío se envía**. `required` en el
`<input>` es una comodidad para quien escribe, no una defensa. El caso 5 del
contrato salta esa comodidad como la salta cualquier programa, y los cinco lo
rechazan en el servidor porque es el único sitio donde rechazarlo significa algo.

Y lo cuarto, que es lo que más se aprovecha fuera de aquí. Los dos hallazgos que
costaron un 403 cada uno —Astro y SvelteKit exigen `Origin`, y los dos comparan
contra un origen que no es el que se ve desde fuera— dicen algo general: **la
dirección que un servidor cree tener no es la que tiene**. Detrás de un
balanceador, de un contenedor o de un proxy, eso deja de ser una curiosidad y
pasa a ser la causa de que los formularios fallen en producción y funcionen en
local.

## Fuentes

- [@remix-docs] *Remix — Documentación oficial* — <https://remix.run/docs>
- [@sveltekit-docs] *SvelteKit — Documentación oficial* — <https://svelte.dev/docs/kit>
- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
- [@owasp-top10] *OWASP Top 10*. OWASP Foundation — <https://owasp.org/www-project-top-ten/>
