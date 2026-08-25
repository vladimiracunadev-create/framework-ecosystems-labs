# Por qué sí y por qué no — Estado local

> [⬅️ Clase 084](README.md) · [📚 Parte 6](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [React](../../../atlas/fichas/react.md) | Una primitiva, una línea, y funciona igual en cualquier componente | El componente entero se vuelve a ejecutar en cada cambio | `useMemo` y `useCallback` para lo que no debía recalcularse |
| [Vue](../../../atlas/fichas/vue.md) | `setup()` corre una vez: nada se recrea y no hacen falta envoltorios | `.value` en todas partes, y olvidarlo no da error, da un valor raro | Una caja que abrir cada vez que se lee |
| [Angular](../../../atlas/fichas/angular.md) | Las señales son explícitas y conviven con el resto del framework | Diez años de Zone.js todavía en el ecosistema y en los ejemplos | Dos modelos de detección de cambios en la misma versión |
| [Svelte](../../../atlas/fichas/svelte.md) | Se lee y se escribe como una variable normal: la sintaxis más limpia de las ocho | Esa limpieza depende de un compilador que hay que ejecutar siempre | No poder leer el código y saber qué es reactivo sin conocer las runas |
| [SolidJS](../../../atlas/fichas/solid.md) | Leer suscribe, así que al cambiar solo se redibuja el hueco | Parece React y no lo es, y el parecido cuesta caro | Recordar en cada línea que las propiedades y las señales son funciones |
| [Lit](../../../atlas/fichas/lit.md) | Cada instancia es un objeto del DOM con identidad propia | Hay que declarar `state: true` o el estado queda expuesto como atributo | Un olvido que convierte estado privado en entrada pública |
| [Alpine.js](../../../atlas/fichas/alpinejs.md) | El estado es un objeto de JavaScript: no hay primitiva que aprender | Las expresiones viven en atributos y no pueden importar nada | Las reglas escritas dos veces, sin tipos y sin ayuda del editor |
| [htmx](../../../atlas/fichas/htmx.md) | Una sola fuente de verdad: no hay dos copias que sincronizar | No hay estado local; cualquier cambio es una ida y vuelta | Latencia en cada interacción, y nada funciona sin red |

## 🧭 Lo que este contrato no puede probar

- **El redibujado.** Ver el número subir al pulsar necesita un navegador. Aquí se
  verifica dónde se declara el estado, de quién es y qué regla lo gobierna — no
  que la pantalla cambie. La clase 128 cierra ese hueco.
- **El coste de cada modelo.** Que Solid redibuje un hueco y React un componente
  es cierto y aquí no se mide: haría falta una lista grande, un navegador y la
  metodología de la clase 007. Es la clase 092.
- **Que el estado sea de verdad privado.** En seis de las ocho se puede alcanzar
  desde fuera si uno se empeña —en Lit incluso es cómodo—. El contrato comprueba
  que el componente no lo *necesite* de fuera, no que sea inaccesible.
- **Cuándo conviene subirlo.** El contrato no tiene opinión sobre eso, y la
  respuesta depende de quién más necesite el dato. Es la clase 088.

## 💡 Lo que hay que llevarse

La pregunta que ordena todo esto no es «¿qué primitiva uso?», es **«¿de quién es
este dato?»**.

Si solo lo usa el componente, se queda dentro y la aplicación no se entera. Si lo
necesitan dos hermanos, sube al padre. Si lo necesita media aplicación, deja de
ser estado de interfaz y pasa a ser otra cosa. Las tres respuestas son correctas
en su sitio, y la mayoría de los problemas de estado vienen de haber elegido mal
el sitio y no de haber elegido mal la herramienta.

La segunda idea es más pequeña y más útil a diario: **la regla vive con el
estado**. «No baja de cero» es una propiedad del contador, no del botón ni del
padre. Escribirla en una función pura al lado del estado tiene tres efectos que
compensan de sobra las tres líneas que cuesta:

1. se prueba sin renderizar nada;
2. no se puede aplicar distinto en dos sitios;
3. quien lea el componente ve la regla, no la deduce.

Es la misma idea que la parte 4 aplica al dominio y la parte 3 a la validación:
**la lógica junto al dato que gobierna**. Osmani lo llama, para componentes,
mantener el estado tan cerca de donde se usa como sea posible
[@osmani-js-design-patterns] — y la versión corta cabe en una frase: *si nadie
más lo mira, no lo subas*.

## Fuentes

- [@osmani-js-design-patterns] Osmani, Addy. *Learning JavaScript Design Patterns*, 2.ª ed. O'Reilly Media, 2023. ISBN 9781098139872 — <https://openlibrary.org/isbn/9781098139872>
- [@vue-reactivity] *Reactivity in Depth*. Vue.js — <https://vuejs.org/guide/extras/reactivity-in-depth.html>
- [@solid-reactivity] *Intro to Reactivity*. SolidJS — <https://docs.solidjs.com/concepts/intro-to-reactivity>
