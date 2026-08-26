# Por qué sí y por qué no — Los tres modelos de reactividad

> [⬅️ Clase 092](README.md) · [📚 Parte 6](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [React](../../../atlas/fichas/react.md) | El modelo mental más simple: la interfaz es una función del estado, sin declarar dependencias | El trabajo es proporcional al árbol, no al cambio | `memo`, `useMemo` y `useCallback`, con sus listas y sus errores |
| [Vue](../../../atlas/fichas/vue.md) | Reactividad fina y con el motor publicado aparte: se puede usar fuera de Vue | Fino para saber qué cambió, grueso para aplicarlo: reejecuta el render del componente | Recordar `.value` en todas partes |
| [Angular](../../../atlas/fichas/angular.md) | Señales de la misma familia que Solid, con tipos y en el framework | Dos modelos conviviendo: casi todo el código en producción sigue con Zone.js | Una migración a medias que dura años |
| [Svelte](../../../atlas/fichas/svelte.md) | El seguimiento lo escribe el compilador: no viaja motor al navegador | Sin compilador no hay reactividad, ni siquiera en un archivo `.js` | Depender siempre de la herramienta de construcción |
| [SolidJS](../../../atlas/fichas/solid.md) | El modelo más fino del elenco: solo se recalcula lo que leyó el valor | Leer donde no toca rompe la suscripción, y no avisa | Vigilar dónde se lee, en cada línea |
| [Lit](../../../atlas/fichas/lit.md) | Fino a nivel de propiedad, sobre el estándar del navegador | La unidad es la plantilla del elemento: se reevalúa entera | Elementos más pequeños para acotar el trabajo |
| [Alpine.js](../../../atlas/fichas/alpinejs.md) | El motor de Vue sin instalar nada ni compilar | La reactividad vive en atributos: sin tipos, sin editor que ayude | Depurar expresiones dentro de cadenas de texto |
| [htmx](../../../atlas/fichas/htmx.md) | Cero líneas de código reactivo y cero datos duplicados | Una ida y vuelta por cambio; sin red no hay interfaz | Latencia visible en cualquier interacción inmediata |

## 🧭 Lo que este contrato no puede probar

- **Cuál va más rápido.** Y no por prudencia: los números de velocidad dependen
  de la máquina, y la clase 007 explica por qué publicarlos sin entorno no
  significa nada. Lo que aquí se mide son **recálculos**, que sí son del modelo.
- **Tres de los ocho modelos.** Svelte, Lit y Alpine necesitan el navegador para
  su ciclo de actualización. Se declara `medido: false` con el motivo en lugar de
  inventar una cifra.
- **El coste real de un recálculo.** Que React reejecute un componente no dice
  cuánto cuesta: depende de lo que ese componente haga. Un componente vacío se
  reejecuta gratis.
- **Cómo se comportan con carga.** Mil elementos, actualizaciones a sesenta por
  segundo, árboles profundos. Ahí el modelo se nota de verdad, y medirlo pide un
  navegador y la metodología de la clase 007.

## 💡 Lo que hay que llevarse

La pregunta que separa los tres modelos no es técnica, es de diseño: **¿cuánto
tiene que saber el framework sobre lo que depende de qué?**

- **Nada** — árbol virtual. Vuelve a ejecutarlo todo y compara. Simple de
  entender, caro de ejecutar, y necesita herramientas para acotar el coste.
- **Lo justo, deducido al leer** — reactividad fina. El valor se convierte en una
  caja para que leerlo sea observable. Barato de ejecutar, y el precio es
  sintáctico: `.value`, `valor()`, `$state`.
- **Nada, porque no hay estado en el cliente** — htmx. Ni árbol ni señales: una
  petición. Cero código de sincronización, y latencia en cada cambio.

La tabla de la clase enseña que **cinco de las ocho eligieron la segunda**, y
Angular tardó diez años en llegar. Eso no significa que React se equivocara: su
modelo es el más fácil de explicar y el que menos formas tiene de romperse en
silencio. Significa que el ecosistema decidió que el coste valía el precio
sintáctico.

Y hay una lección de método, que es la razón de que esta clase cierre la parte 6.
**Los tres modelos son tres respuestas a la misma pregunta, y las tres siguen
vivas.** Cuando aparezca la próxima tecnología de interfaz —y aparecerá—, situarla
en una de las tres casillas dirá más sobre ella que cualquier comparativa: qué va
a necesitar cuando la aplicación crezca, qué herramientas va a traer, y dónde va
a doler.

Eso es exactamente lo que la clase 004 llamó clasificar antes de comparar, y
aquí llega aplicado a la pieza más discutida del ecosistema.

## Fuentes

- [@solid-reactivity] *Intro to Reactivity*. SolidJS — <https://docs.solidjs.com/concepts/intro-to-reactivity>
- [@vue-reactivity] *Reactivity in Depth*. Vue.js — <https://vuejs.org/guide/extras/reactivity-in-depth.html>
- [@patterns-dev] *Patterns.dev — Modern Web App Design Patterns* — <https://www.patterns.dev/>
- [@osmani-js-design-patterns] Osmani, Addy. *Learning JavaScript Design Patterns*, 2.ª ed. O'Reilly Media, 2023. ISBN 9781098139872 — <https://openlibrary.org/isbn/9781098139872>
