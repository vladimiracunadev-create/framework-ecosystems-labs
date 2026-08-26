# Por qué sí y por qué no — Carga de datos junto a la ruta

> [⬅️ Clase 097](README.md) · [📚 Parte 7](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Astro](../../../atlas/fichas/astro.md) | Un `await` arriba y ya está: no hay nada que aprender | El framework no sabe que eso era una carga | Nada de adelantar, paralelizar ni invalidar |
| [Next.js](../../../atlas/fichas/nextjs.md) | Cualquier componente del árbol puede cargar lo suyo | Tampoco tiene nombre: para el framework es código | Lo mismo que Astro, con un árbol más grande donde perderlo |
| [SvelteKit](../../../atlas/fichas/sveltekit.md) | `load` con nombre y firma: el framework puede actuar sobre ella | Un archivo más por ruta, y dos sitios donde mirar | La ceremonia de separar carga y componente |
| [Nuxt](../../../atlas/fichas/nuxt.md) | Dentro del componente y aun así reconocible, gracias a la clave | La clave hay que inventarla y que sea única | Errores silenciosos cuando dos claves coinciden |
| [Remix](../../../atlas/fichas/remix.md) | El original, y el más coherente: la ruta declara lo que necesita | Todo pasa por la ruta: un componente hondo no puede pedir lo suyo | Pasar el dato por propiedades — clase 096 |

## 🧭 Lo que este contrato no puede probar

- **Que la carga se adelante al navegar.** Pasar el ratón por un enlace y que el
  framework empiece a cargar antes del clic es la ventaja principal de tener una
  función con nombre, y ocurre solo en el navegador. Aquí se declara, no se mide.
- **La invalidación.** Volver a ejecutar la carga después de un cambio es la
  clase 098, y necesita una escritura de por medio.
- **El paralelismo entre rutas anidadas.** Que la carga del padre y la del hijo
  corran a la vez es la clase 099, y se mide con dos cargas, no con una.
- **Los diez milisegundos.** La fuente tarda a propósito, pero es un `setTimeout`.
  Una base de datos real tarda de otra forma y falla de otras maneras.

## 💡 Lo que hay que llevarse

Lo primero es el orden, y sale igual en los cinco:

```text
carga:inicio  →  carga:fin  →  render
```

Eso, comparado con la clase 087, es la diferencia entre una pantalla que llega
llena y una que llega vacía. Ninguno de los cinco necesita un estado de carga
para la primera pantalla, y **el estado de carga que no existe no puede tener
errores**.

Lo segundo es la pregunta que de verdad separa a los cinco, y no es de sintaxis:
**¿el framework sabe que eso era una carga de datos?**

- Si lo sabe —`load`, `loader`, `useAsyncData`— puede llamarla al pasar el ratón
  por un enlace, ejecutarla en paralelo con la de la ruta padre, y volver a
  ejecutarla cuando algo la invalide. Sin que nadie escriba una línea para eso.
- Si no lo sabe —un `await` dentro del componente— no puede hacer ninguna de las
  tres. Y no es que no las haga: es que no puede.

Esa es la razón de que la sintaxis más simple no sea la mejor aquí. Un `await`
arriba se lee mejor que un archivo aparte, y a cambio renuncias a que el
framework trabaje por ti. Es exactamente el mismo intercambio de la clase 034
con los mapeadores de objetos: **decir las cosas de una forma que la herramienta
entienda cuesta ceremonia y compra automatismo**.

Y lo tercero, que es de higiene y vale más que las dos anteriores juntas: **un
404 tiene que ser un 404**. Los cinco lanzan para conseguirlo, cada uno con su
verbo, porque lanzar es la única forma limpia de cortar desde dentro de una
función que iba a devolver datos. Una pantalla de error con estado 200 se ve
perfecta en el navegador y miente a todo lo demás.

## Fuentes

- [@remix-docs] *Remix — Documentación oficial* — <https://remix.run/docs>
- [@sveltekit-docs] *SvelteKit — Documentación oficial* — <https://svelte.dev/docs/kit>
- [@nuxt-docs] *Nuxt — Documentación oficial* — <https://nuxt.com/docs>
- [@rfc9110] *RFC 9110 — HTTP Semantics*. IETF — <https://www.rfc-editor.org/rfc/rfc9110>
