# Por qué sí y por qué no — El primer componente

> [⬅️ Clase 082](README.md) · [📚 Parte 6](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [React](../../../atlas/fichas/react.md) | Un componente es una función: nada que registrar, nada que declarar | No trae nada más — enrutado, datos y estructura los eliges tú | Un ecosistema de decisiones que el equipo mantiene |
| [Vue](../../../atlas/fichas/vue.md) | Las propiedades se declaran, y esa lista sirve al framework y a quien lee | El componente vive dentro de una aplicación: hay más ceremonia que en React | Un archivo `.vue` que necesita compilador para ser JavaScript |
| [Angular](../../../atlas/fichas/angular.md) | Todo está declarado: selector, plantilla, entradas — nada se adivina | Es el más pesado de arrancar y el que más conceptos pide antes de la primera línea | Dos compilaciones, una aplicación entera y errores como NG0401 |
| [Svelte](../../../atlas/fichas/svelte.md) | El componente se traduce a código: no viaja un motor al navegador | Sin compilar no es JavaScript válido; el paso no es opcional | Depender de una herramienta de construcción para todo, incluso para probar |
| [SolidJS](../../../atlas/fichas/solid.md) | Sintaxis de React con un modelo que ejecuta el componente una sola vez | Ese parecido engaña: las propiedades se leen, no se desestructuran | Un ecosistema mucho más pequeño que aquel al que se parece |
| [Lit](../../../atlas/fichas/lit.md) | El componente es una etiqueta HTML estándar: funciona sin el framework alrededor | Renderizarlo en el servidor exige fingir un navegador entero | El DOM en la sombra, que aísla estilos y complica todo lo demás |
| [Alpine.js](../../../atlas/fichas/alpinejs.md) | Un atributo y ya hay componente: cero construcción, cero instalación | No renderiza en el servidor y el escapado es tuyo, con dos contextos distintos | Que la seguridad dependa de quién escribe la plantilla |
| [htmx](../../../atlas/fichas/htmx.md) | El componente vive donde ya están los datos: el servidor | No hay componente en el cliente, así que no hay estado local ni interactividad sin ida y vuelta | Una petición por cada cambio, y el escapado a cargo del servidor |

## 🧭 Lo que este contrato no puede probar

- **Nada de lo que pasa en el navegador.** El contrato mira el HTML que sale del
  puerto. La reactividad, el ciclo de vida y los eventos —que son la mitad de lo
  que un componente hace— empiezan en la clase 083 y se miden de otra forma.
- **Que Alpine.js funcione.** Su render ocurre en el cliente, así que lo que aquí
  se verifica es **el marcado que se le manda**, no el resultado. Es una
  limitación real de este método y conviene tenerla presente en toda la parte 6.
- **El tamaño de lo que llega al navegador.** Ninguna de las ocho implementaciones
  empaqueta nada, así que la promesa de Svelte —«no viaja el motor»— no se puede
  medir aquí. Necesita una construcción de verdad, y es la clase 097.
- **Qué modelo es más fácil de aprender.** Se puede contar cuántos conceptos hace
  falta nombrar —y la clase 006 lo hace para dos frameworks de servidor— pero
  «fácil» depende de qué sepa ya quien llega.

## 💡 Lo que hay que llevarse

La palabra «componente» significa siete cosas distintas en estas ocho
tecnologías, y confundirlas es el origen de la mitad de las discusiones sobre
interfaces.

Lo que sí es común es la idea que Frost llamó diseño atómico
[@frost-atomic-design]: **una pieza con un límite claro, que recibe datos por
fuera y produce marcado**. Todo lo demás —clase o función, compilado o
interpretado, cliente o servidor— es cómo cada ecosistema implementa esa idea.

Y hay una correlación que merece quedarse, porque predice cosas:

**Quien controla el momento de interpolar, escapa por ti.** Las seis tecnologías
que renderizan escapan solas; las dos que solo colocan marcado, no. No es una
diferencia de calidad ni de madurez: es una consecuencia de dónde ocurre el
trabajo. Si eliges un modelo donde el marcado se construye a mano, **el escapado
pasa a ser responsabilidad tuya en cada línea**, y eso hay que saberlo el primer
día y no el de la auditoría.

## Fuentes

- [@frost-atomic-design] Frost, Brad. *Atomic Design*. 2016 — <https://atomicdesign.bradfrost.com/>
- [@mdn-web-docs] *MDN Web Docs*. Mozilla — <https://developer.mozilla.org/>
- [@solid-reactivity] *Intro to Reactivity*. SolidJS — <https://docs.solidjs.com/concepts/intro-to-reactivity>
