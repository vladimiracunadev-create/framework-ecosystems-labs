# Por qué sí y por qué no — HTML en flujo

> [⬅️ Clase 100](README.md) · [📚 Parte 7](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Next.js](../../../atlas/fichas/nextjs.md) | La declaración más visible: una etiqueta alrededor de lo lento | La parte lenta tiene que ser un componente aparte y `async` | Partir la pantalla en más archivos de los que pedía |
| [SvelteKit](../../../atlas/fichas/sveltekit.md) | La declaración más barata: un `await` que no se escribe | Manda el dato, no el marcado: sin JavaScript el hueco no se llena | Que quitar o poner una palabra cambie la pantalla sin que se lea |
| [Remix](../../../atlas/fichas/remix.md) | Se declara como en SvelteKit y manda el HTML ya construido | Apaga el flujo si quien pide no parece un navegador | Medir con una herramienta de consola y no enterarse |

## 🧭 Lo que este contrato no puede probar

- **Que la pantalla se vea antes.** Lo que se mide es cuándo llegan los bytes,
  no cuándo pinta el navegador. Lo segundo depende de la hoja de estilo, de las
  fuentes y del dispositivo, y necesita un navegador de verdad.
- **La estabilidad visual.** Si el hueco de espera ocupa menos que el contenido,
  la página salta cuando llega. Es el defecto más común del flujo mal hecho y no
  se ve en una respuesta HTTP.
- **Qué pasa con la red lenta de verdad.** Aquí los trozos viajan por la
  interfaz de retorno de la máquina. Con latencia real, el primer trozo llega más
  tarde y la ventaja crece; con pérdida de paquetes, cambia otra vez.
- **El flujo de Astro y de Nuxt.** Los dos saben enviar respuestas parciales, y
  ninguno tiene una forma declarativa de aplazar una parte de la pantalla. Están
  fuera del elenco por eso, no por no saber.

## 💡 Lo que hay que llevarse

Lo primero es de método y vale para toda la parte: **para ver un flujo hay que
leer la respuesta a trozos**. Cualquier herramienta que espere al final —incluido
`await respuesta.text()`, incluido `curl` sin `-N`— hace indistinguible una
respuesta que llegó en dos tandas de una que llegó de golpe. Si la herramienta no
puede ver la diferencia, no está midiendo lo que crees.

Lo segundo es la distinción que el código no enseña. SvelteKit y Remix declaran
el aplazamiento **exactamente igual** —una promesa devuelta sin `await`— y hacen
cosas distintas: Remix manda el HTML de la parte aplazada ya construido, y
SvelteKit manda el dato para que lo pinte el navegador. Los dos son flujo. Solo
uno funciona con el JavaScript apagado. **Comparar frameworks por su sintaxis
engaña**, y aquí hay una demostración limpia de por qué.

Lo tercero es sobre el flujo en general, y conviene decirlo aunque suene a
aguafiestas: **no hace nada más rápido**. El total es el mismo, la consulta lenta
sigue tardando lo mismo, y el servidor trabaja igual. Lo único que cambia es el
orden en que se ven las cosas. Eso es mucho —quien espera mirando una pantalla en
blanco y quien espera mirando media pantalla no tienen la misma paciencia— pero
no es una optimización: es una decisión de diseño sobre qué merece verse antes.

Y por eso el orden de esta parte es el que es. Primero la clase 099, que quita el
tiempo que sobra. Después esta, que reparte el que no se puede quitar. Aplicarlas
al revés es disimular una cascada en lugar de arreglarla.

## Fuentes

- [@remix-docs] *Remix — Documentación oficial* — <https://remix.run/docs>
- [@sveltekit-docs] *SvelteKit — Documentación oficial* — <https://svelte.dev/docs/kit>
- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
- [@wagner-web-performance] Wagner, Jeremy. *Web Performance in Action*. Manning Publications, 2016. ISBN 9781617293771 — <https://openlibrary.org/isbn/9781617293771>
