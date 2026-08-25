# Por qué sí y por qué no — Propiedades y eventos

> [⬅️ Clase 083](README.md) · [📚 Parte 6](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [React](../../../atlas/fichas/react.md) | Un solo mecanismo: todo baja como propiedad, incluidas las funciones | Nada declara qué eventos emite un componente: hay que leerlo entero | Buscar en el cuerpo qué propiedades resultan ser invocables |
| [Vue](../../../atlas/fichas/vue.md) | `emits` es un contrato de salida legible sin abrir el componente | Dos mecanismos que aprender en vez de uno | Recordar cuál usar, y que `$emit` no burbujea como un evento del DOM |
| [Angular](../../../atlas/fichas/angular.md) | `@Input()` y `@Output()` juntos: el contrato del componente se lee de un vistazo | `EventEmitter` arrastra RxJS para emitir un número | Un flujo observable donde bastaba una llamada |
| [Svelte](../../../atlas/fichas/svelte.md) | Un solo canal desde la versión 5: menos que aprender | Ese cambio rompió el código de la versión 4 | Una migración para quien ya usaba `createEventDispatcher` |
| [SolidJS](../../../atlas/fichas/solid.md) | Las propiedades son accesos, así que el hijo ve siempre el valor de ahora | Se parece tanto a React que se escribe como React y deja de reaccionar | Una trampa silenciosa que no da error, solo deja de actualizar |
| [Lit](../../../atlas/fichas/lit.md) | El canal ya existía: `CustomEvent` es del navegador, no del framework | El burbujeo llega a ancestros que no lo esperaban, y `composed` se olvida | Depurar por qué un evento no sale del DOM en la sombra |
| [Alpine.js](../../../atlas/fichas/alpinejs.md) | Las dos direcciones en dos atributos, sin instalar nada | La lógica vive en cadenas de texto dentro del HTML: sin tipos, sin editor que ayude | Errores que solo aparecen al ejecutar, y en el navegador |
| [htmx](../../../atlas/fichas/htmx.md) | Una sola verdad: el estado vive en el servidor y no hay nada que sincronizar | Una ida y vuelta por cada cambio, y sin red no hay interfaz | Latencia en cada interacción, incluidas las triviales |

## 🧭 Lo que este contrato no puede probar

- **El clic.** Disparar un evento y ver el árbol actualizarse necesita un
  navegador de verdad. Aquí se comprueba el manejador, no el disparo. La clase
  128 cierra ese hueco con pruebas de extremo a extremo.
- **Que el hijo no mute la propiedad.** El contrato comprueba que **no lo hace en
  esta implementación**, leyendo su archivo y su comportamiento. No puede
  impedir que otra lo haga: en seis de las ocho, mutar es técnicamente posible.
- **El burbujeo.** Que un `CustomEvent` con `bubbles: true` llegue a un ancestro
  lejano es cierto y ocurre en el navegador. Aquí solo se ve que se emite.
- **Qué pasa con muchos niveles.** Pasar una propiedad de padre a nieto a
  bisnieto funciona y se vuelve insoportable. Ese problema tiene nombre —
  *prop drilling*— y solución, y es la clase 088.

## 💡 Lo que hay que llevarse

La regla cabe en cuatro palabras —**datos abajo, avisos arriba**— y no es una
convención de estilo: es lo que hace que una interfaz se pueda razonar.

Cuando el hijo puede escribir en el estado del padre, cualquier componente puede
cambiar cualquier cosa desde cualquier sitio, y averiguar por qué un número está
mal deja de tener respuesta. Cuando solo el dueño escribe, la pregunta «¿quién
cambió esto?» tiene siempre la misma respuesta: **el que lo tiene**.

Las ocho tecnologías implementan la regla con cinco mecanismos distintos, y esa
variedad esconde lo importante. Osmani lo formula como un patrón general: lo que
distingue a un componente reutilizable es **lo poco que sabe de su entorno**
[@osmani-js-design-patterns]. Un hijo que emite «+1» sirve en una calculadora, en
un carrito y en un formulario. Un hijo que suma solo sirve donde sumar sea lo
correcto.

Y la consecuencia práctica al diseñar: **decide primero quién es el dueño del
dato**, y de ahí sale todo lo demás. Si el dato es del padre, el hijo emite. Si
el dato es del hijo, el padre no debería estar mirándolo — y eso es la clase 084.

## Fuentes

- [@osmani-js-design-patterns] Osmani, Addy. *Learning JavaScript Design Patterns*, 2.ª ed. O'Reilly Media, 2023. ISBN 9781098139872 — <https://openlibrary.org/isbn/9781098139872>
- [@mdn-web-docs] *MDN Web Docs*. Mozilla — <https://developer.mozilla.org/>
- [@vue-reactivity] *Reactivity in Depth*. Vue.js — <https://vuejs.org/guide/extras/reactivity-in-depth.html>
