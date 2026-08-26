# Por qué sí y por qué no — Las cuatro estrategias de renderizado

> [⬅️ Clase 093](README.md) · [📚 Parte 7](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Astro](../../../atlas/fichas/astro.md) | Por omisión no hay servidor: una página es un archivo salvo que pida lo contrario | Sacar una página al servidor obliga a añadir un adaptador al proyecto entero | Una línea por página, y recordar ponerla |
| [Next.js](../../../atlas/fichas/nextjs.md) | El único cuyo constructor publica la estrategia de cada ruta: `○` y `ƒ` en la salida | Leer una cookie convierte la ruta en dinámica sin declararlo | Auditar el proyecto construyéndolo, no leyéndolo |
| [SvelteKit](../../../atlas/fichas/sveltekit.md) | La estrategia cambia sin tocar el componente: `load` es el único que se entera | El adaptador manda: `adapter-static` anula lo que digan las rutas | Dos sitios donde mirar cuando algo no sale estático |
| [Nuxt](../../../atlas/fichas/nuxt.md) | `routeRules` deja leer la arquitectura entera de un vistazo | La decisión queda lejos de la pantalla, y se desincronizan | Una tabla que hay que mantener a mano |
| [Remix](../../../atlas/fichas/remix.md) | Una sola forma de hacerlo: no hay modos, ni decisión que documentar | No hay generación al construir, y punto | Resolver lo estático fuera, con caché y `Cache-Control` |

## 🧭 Lo que este contrato no puede probar

- **Cuánto más rápida es una respuesta estática.** El contrato demuestra *que* se
  generó una sola vez, no que llegue antes. Medir eso pide la metodología de la
  clase 007, y aquí las cinco corren en la misma máquina que las pide.
- **El revalidado.** Es la cuarta estrategia y la única que el contrato solo
  describe: verificarla exige esperar a que venza un plazo, y ninguno de los
  cinco lo implementa igual. La clase 097 la aborda entera.
- **Qué pasa desplegado.** Astro estático en una red de distribución y Astro
  estático servido por Node son la misma construcción con rendimientos
  incomparables. La clase 103 entra ahí.
- **El coste de construir.** Un catálogo de diez mil páginas estáticas tarda, y
  ese tiempo es la razón principal de que exista el revalidado. Con tres tareas
  no se ve.

## 💡 Lo que hay que llevarse

La pregunta de esta clase no es cuál de las cuatro es mejor. Es **cuál es mejor
para esta pantalla**, y hay tres datos que la contestan casi siempre:

1. **¿El contenido es el mismo para todo el mundo?** Si no, se cae lo estático.
2. **¿Con qué frecuencia cambia?** Si cambia menos que los despliegues, estático;
   si cambia a diario y hay muchas páginas, revalidado; si cambia a cada
   segundo, servidor.
3. **¿Importa el primer pintado?** Si la pantalla está detrás de un acceso,
   normalmente no, y el cliente sale barato.

Ninguno de los tres es una decisión de framework. Son decisiones del producto, y
por eso esta clase abre la parte: **los cinco metaframeworks existen para que esa
decisión se pueda tomar por pantalla en lugar de por proyecto.**

Y hay una lección lateral, que es de método y vale para todo el programa. La
diferencia entre estático y servidor **no se ve mirando una respuesta**: las dos
traen exactamente el mismo HTML. Se ve pidiendo dos veces y comparando un valor
que cambie. Cuando dos cosas parecen idénticas y sabes que no lo son, la salida
casi nunca es mirar más de cerca — es **construir la observación que las separa**.

Ese es el mismo movimiento de la clase 025 con las cachés y el de la 062 con la
revalidación, y aquí queda aplicado a la pieza más visible de todas: la página.

## Fuentes

- [@astro-islands] *Islands Architecture*. Astro — <https://docs.astro.build/en/concepts/islands/>
- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
- [@patterns-dev] *Patterns.dev — Modern Web App Design Patterns* — <https://www.patterns.dev/>
- [@riva-nextjs] Riva, Michele. *Real-World Next.js*. Packt Publishing, 2022. ISBN 9781801073493 — <https://openlibrary.org/isbn/9781801073493>
