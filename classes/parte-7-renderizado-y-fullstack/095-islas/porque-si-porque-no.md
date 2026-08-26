# Por qué sí y por qué no — Islas

> [⬅️ Clase 095](README.md) · [📚 Parte 7](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Astro](../../../atlas/fichas/astro.md) | El suelo más bajo del elenco: 1164 bytes y cero guiones sin islas | Cobra el motor completo la primera vez que hidratas algo | 4605 bytes por las dos primeras islas |
| [Next.js](../../../atlas/fichas/nextjs.md) | Añadir interactividad es casi gratis: 128 bytes por dos zonas | Su suelo son 6599 bytes aunque no haya nada que responda | El tiempo de ejecución, siempre, en todas las páginas |
| [Nuxt](../../../atlas/fichas/nuxt.md) | Un punto intermedio: suelo bajo e islas baratas | Su mecanismo va del revés y sigue bajo `experimental` | Depender de una función que puede cambiar de forma |

## 🧭 Lo que este contrato no puede probar

- **Que las islas se activen.** El verificador no ejecuta JavaScript: comprueba
  que el HTML llega renderizado y que el código viaja, no que el botón responda.
  Eso es la clase 128.
- **Lo que pesa el código descargado aparte.** Los bytes medidos son los del
  documento. Los trozos que el navegador va a buscar después —`<script src>`—
  cuentan y no están en esta tabla; la clase 102 los mete en un presupuesto.
- **`client:visible` y sus hermanos.** Los grados de Astro dependen de eventos
  del navegador —ocioso, visible, consulta de medios— y ninguno ocurre en una
  petición HTTP.
- **Dónde está el punto de cruce.** Con dos islas gana Astro; con veinte
  probablemente no. Saber dónde se cruzan las dos curvas pide construir las
  veinte, y esta clase construye dos.

## 💡 Lo que hay que llevarse

Lo primero es lo que la tabla enseña y casi ninguna comparativa dice: **el mismo
número significa cosas distintas según de dónde partas**. Astro es el más barato
en esta página y el que más cobra por añadir una isla. Next es el más caro de
entrada y el que casi no cobra por añadir. Quien publique solo una de las dos
columnas está vendiendo algo.

Lo segundo es que hay **tres mecanismos distintos** debajo de una palabra:

- **Islas** (Astro) — el documento no es una aplicación. Los trozos vivos son
  aplicaciones diminutas e incomunicadas, y su código es lo único que viaja.
- **Fronteras de cliente** (Next) — hay una aplicación, y una parte de ella se
  ejecuta en el servidor. El código de esa parte no viaja, pero **su resultado
  sí**, descrito en la carga RSC.
- **Componentes de servidor** (Nuxt, `.server.vue`) — se parte de la aplicación
  entera y se le quitan trozos. La dirección opuesta al mismo destino.

Y lo tercero, que es la lección de método: **este modelo se apoya en una
proporción, y la proporción hay que comprobarla**. Si en tu página el ochenta por
ciento del marcado necesita responder a algo, las islas no te van a ahorrar
nada, y encima vas a perder la comunicación entre las partes. La arquitectura de
islas no es mejor que hidratar: es mejor **para páginas que son casi todas texto
muerto**, que resulta ser la mayoría de la web, pero no la mayoría de lo que
llamamos aplicaciones.

Esa distinción es la misma que la clase 093 pedía hacer por pantalla, un piso más
abajo: ya no entre estrategias de renderizado, sino entre zonas de una misma
pantalla.

## Fuentes

- [@jasonformat-islands] Miller, Jason. *Islands Architecture*. 2020 — <https://jasonformat.com/islands-architecture/>
- [@astro-islands] *Islands Architecture*. Astro — <https://docs.astro.build/en/concepts/islands/>
- [@patterns-dev] *Patterns.dev — Modern Web App Design Patterns* — <https://www.patterns.dev/>
- [@wagner-web-performance] Wagner, Jeremy. *Web Performance in Action*. Manning Publications, 2016. ISBN 9781617293771 — <https://openlibrary.org/isbn/9781617293771>
