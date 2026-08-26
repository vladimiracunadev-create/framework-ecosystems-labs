# Por qué sí y por qué no — Hidratación

> [⬅️ Clase 094](README.md) · [📚 Parte 7](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Astro](../../../atlas/fichas/astro.md) | Por omisión no hidrata nada: su pantalla inerte pesa 277 bytes | Cada isla necesita una integración —React, Vue, Preact— y su motor completo | Islas que no se hablan entre sí sin un almacén aparte |
| [Next.js](../../../atlas/fichas/nextjs.md) | La frontera es explícita y está en una línea del archivo | Quitar interactividad no quita bytes: la carga RSC crece con lo renderizado | Vigilar qué cruza la frontera, porque todo lo que cruza se envía |
| [SvelteKit](../../../atlas/fichas/sveltekit.md) | `csr = false` por ruta: el interruptor más claro de los cinco | El resultado de `load` se serializa siempre, quieras o no | Elegir entre bytes ahora o una petición después |
| [Nuxt](../../../atlas/fichas/nuxt.md) | El HTML más ligero del elenco en las dos pantallas | Su interruptor lleva «experimental» en el nombre | Depender de una opción que puede cambiar de forma |
| [Remix](../../../atlas/fichas/remix.md) | Una sola etiqueta gobierna toda la hidratación, y se ve en el documento raíz | No hay forma de apagarla para una ruta: es todo o nada | Aceptar el coste en pantallas que no lo necesitan |

## 🧭 Lo que este contrato no puede probar

- **Que la hidratación ocurra.** El verificador no ejecuta JavaScript, así que
  ve la huella —el estado serializado, el enlace al código— pero no el momento
  en que el botón empieza a responder. Medir eso pide un navegador, y es lo que
  hace la clase 128.
- **Cuánto tarda.** El tiempo hasta que la pantalla responde depende de la red,
  del dispositivo y de qué más esté haciendo el navegador. Aquí se miden bytes,
  que son del framework; los milisegundos no lo son.
- **El coste del segundo render.** Que el componente se ejecute dos veces es un
  hecho; cuánto cuesta la segunda depende de lo que el componente haga. Con
  tres tareas, nada.
- **Las discordancias de hidratación.** El fallo más común de este mecanismo
  —que el servidor y el navegador rendericen cosas distintas— solo se manifiesta
  en el navegador, y este contrato no abre ninguno.

## 💡 Lo que hay que llevarse

La hidratación es un arreglo, no un diseño. Nació de juntar dos cosas que se
habían inventado por separado —renderizar en el servidor, que es lo que la web
hacía desde el principio, y componentes con estado en el navegador, que es lo
que trajo la parte 6— y el pegamento entre las dos es serializar el estado y
repetir el render.

De ahí salen las tres cosas que hay que recordar:

1. **El dato viaja dos veces, y sale 2 en los cinco.** No es una mala
   implementación de nadie. Es la definición del mecanismo.
2. **El trabajo se hace dos veces.** El componente se ejecuta en el servidor y
   se vuelve a ejecutar en el navegador para llegar al mismo resultado. Svelte
   manda menos motor, pero repite el render igual.
3. **Quitar interactividad no siempre quita peso.** La pantalla sin hidratar de
   Next pesa más que la hidratada. Si la intuición dice lo contrario, hay que
   medir.

Y de ahí sale también el resto de la parte. Las cuatro clases siguientes son
cuatro formas de pagar menos por lo mismo: **hidratar solo un trozo** (095,
islas), **no mandar el componente en absoluto** (096, componentes de servidor),
**empezar a mandar HTML antes de tenerlo entero** (100, flujo) y **renunciar al
mecanismo** (103, hipermedia).

Ninguna de las cuatro existiría si hidratar fuera gratis. Entender esta clase es
entender por qué existen las otras.

## Fuentes

- [@astro-islands] *Islands Architecture*. Astro — <https://docs.astro.build/en/concepts/islands/>
- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
- [@patterns-dev] *Patterns.dev — Modern Web App Design Patterns* — <https://www.patterns.dev/>
- [@wagner-web-performance] Wagner, Jeremy. *Web Performance in Action*. Manning Publications, 2016. ISBN 9781617293771 — <https://openlibrary.org/isbn/9781617293771>
