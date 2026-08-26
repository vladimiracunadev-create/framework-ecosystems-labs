# Por qué sí y por qué no — La cascada de peticiones

> [⬅️ Clase 099](README.md) · [📚 Parte 7](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Remix](../../../atlas/fichas/remix.md) | Conoce las rutas antes de cargar: los niveles van a la vez | Dentro de un `loader`, una cascada se escribe igual de fácil | Revisar cada `await` a mano |
| [SvelteKit](../../../atlas/fichas/sveltekit.md) | Lo mismo, y con la carga separada de la pantalla | Igual: `load` no ordena nada por ti | Lo mismo |
| [Next.js](../../../atlas/fichas/nextjs.md) | Los niveles también van a la vez, y `<Suspense>` corta la espera | La carga repartida entre componentes esconde la cascada | Buscarla en varios archivos en lugar de en uno |
| [Astro](../../../atlas/fichas/astro.md) | Todo a la vista en un frontmatter: la cascada se lee de arriba abajo | El marco es un componente: sus esperas se suman a las de la página | Sesenta milisegundos por nivel, y saber que pasa |
| [Nuxt](../../../atlas/fichas/nuxt.md) | `useAsyncData` deduplica y guarda lo pedido | La disposición encadena igual que en Astro | Lo mismo, con la clave además que mantener |

## 🧭 Lo que este contrato no puede probar

- **Que estos milisegundos signifiquen algo fuera de aquí.** Son de una máquina y
  de una ejecución. Lo comparable es cada pantalla contra sí misma; el resto es
  ruido con decimales, y la clase 007 explica por qué.
- **La cascada en el navegador.** Un componente que pide al montarse, y dentro
  otro que pide al montarse: esa es la cascada clásica del cliente, y necesita un
  navegador para verse. Aquí todo ocurre en el servidor.
- **La cascada necesaria.** El caso en que el segundo dato depende del primero no
  está implementado: se nombra y se explica cómo se arregla —en la fuente, no en
  el código de la pantalla— pero no se mide.
- **Qué pasa con veinte peticiones.** Con tres, `Promise.all` es la respuesta
  obvia. Con veinte contra la misma base de datos, lanzarlas a la vez puede ser
  peor que en cadena, y eso es la clase 137.

## 💡 Lo que hay que llevarse

Primero, la trampa: **una cascada no deja rastro en el resultado**. Las dos
pantallas de esta clase traen exactamente los mismos datos, en el mismo orden,
con el mismo marcado. Ninguna prueba de contenido las distingue, ninguna revisión
de código las ve fácil —tres `await` seguidos parecen los pasos de una receta— y
la única herramienta que las encuentra es un cronómetro.

Segundo, la distinción que evita perder la tarde: **hay dos cascadas y solo una
se arregla con `Promise.all`**.

- La **accidental** —tres datos independientes pedidos en fila— cuesta dos
  líneas.
- La **necesaria** —el segundo dato necesita el identificador del primero— no se
  arregla en la pantalla. Se arregla en la fuente, con un endpoint o una consulta
  que traiga las dos cosas. Intentar paralelizarla es no haber entendido el
  problema.

Tercero, sobre los frameworks: entre niveles anidados hay dos familias, y la
frontera está en si el framework **conoce la ruta entera antes de empezar a
cargar**. Remix, SvelteKit y Next la conocen y lanzan todos los niveles a la vez.
En Astro y en Nuxt el marco es un componente normal, así que sus esperas se
suman. Ninguna de las dos posturas es un fallo: son consecuencias de qué es una
disposición en cada uno.

Y cuarto, que es lo que más se lleva uno de aquí. La posición de Next en esa
tabla estaba escrita al revés antes de medir, con un razonamiento que sonaba
impecable. El comentario equivocado se quedó en el código, corregido y con la
explicación de por qué falló, porque esa es la lección: **un modelo mental
convincente no es una medición**. Es exactamente lo que la clase 007 pedía, y
aquí le tocó a quien escribe el material.

## Fuentes

- [@remix-docs] *Remix — Documentación oficial* — <https://remix.run/docs>
- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
- [@wagner-web-performance] Wagner, Jeremy. *Web Performance in Action*. Manning Publications, 2016. ISBN 9781617293771 — <https://openlibrary.org/isbn/9781617293771>
