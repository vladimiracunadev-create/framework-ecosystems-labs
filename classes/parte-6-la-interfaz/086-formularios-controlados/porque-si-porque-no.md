# Por qué sí y por qué no — Formularios controlados

> [⬅️ Clase 086](README.md) · [📚 Parte 6](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [React](../../../atlas/fichas/react.md) | Sin atajo: las dos mitades están siempre a la vista y la regla tiene su sitio | Un formulario de veinte campos son veinte estados y veinte manejadores | Verbosidad, y el `value` sin manejador que congela el campo |
| [Vue](../../../atlas/fichas/vue.md) | `v-model` cubre el caso normal en una línea, con modificadores para lo habitual | El atajo quita el hueco donde va la normalización | Deshacerlo justo en los campos que más lógica tienen |
| [Svelte](../../../atlas/fichas/svelte.md) | `bind:` y `$bindable()`: la única propiedad de dos direcciones declarada del elenco | Romper el flujo único, aunque sea a propósito, hay que saber cuándo se paga | Que un componente pueda escribir en el estado del padre |
| [SolidJS](../../../atlas/fichas/solid.md) | Escribe el atributo en lugar de reconciliar: no hay salto de cursor | Sin atajo, como React, y con la sintaxis de las señales encima | Recordar que las propiedades se leen llamándolas, también aquí |

## 🧭 Lo que este contrato no puede probar

- **Teclear.** Ver la letra aparecer, el límite frenar y el cursor quedarse donde
  estaba necesita un navegador. Aquí se verifica el marcado y la función de
  cambio. La clase 128 cierra el resto.
- **El salto del cursor.** Es real en el modelo de árbol virtual cuando se
  reemplaza el elemento en lugar de actualizarlo, y no se puede reproducir sin
  DOM.
- **El coste por pulsación.** Que React vuelva a ejecutar el componente y Solid
  escriba un atributo es cierto y medirlo pide la metodología de la clase 007.
- **La accesibilidad del campo.** Etiqueta asociada, mensajes de error
  anunciados, foco al fallar. Nada de eso se mira aquí y todo importa más que
  esta clase: es la 091.

## 💡 Lo que hay que llevarse

La pregunta —**¿quién guarda el valor?**— tiene dos respuestas correctas, y la
mayoría de los proyectos eligen la primera para todo sin haberla comparado.

**Controlar** compensa cuando algo tiene que pasar mientras se escribe: validar,
normalizar, habilitar un botón, filtrar una lista, calcular otro campo. Ahí el
estado en el componente es el único sitio desde el que se puede hacer.

**No controlar** compensa cuando el valor solo importa al enviar. Un formulario
de veinte campos con veinte estados y veinte manejadores no hace nada que un
`<form>` no hiciera solo, y a cambio ejecuta código en cada pulsación.

Silver lo dice desde el diseño y vale igual desde el código: **el formulario más
robusto es el que menos depende de que el JavaScript funcione**
[@silver-form-design-patterns]. Un campo no controlado dentro de un `<form>` con
`action` sigue enviando aunque el script falle — que es la clase 081 aplicada
aquí.

Y la observación sobre los atajos, que es la que se llevará quien ya sabe todo lo
anterior: **`v-model` y `bind:value` son excelentes hasta el momento exacto en
que hace falta una regla**. No porque sean malos, sino porque su trabajo es
esconder el punto donde la regla iría. Cuando abras uno de ellos para meter una
validación, estás escribiendo lo que React escribe siempre — y ahí se ve que la
diferencia entre los cuatro es cuánto azúcar ponen encima de la misma idea.

## Fuentes

- [@silver-form-design-patterns] Silver, Adam. *Form Design Patterns*. Smashing Magazine, 2018. ISBN 9783945749456 — <https://openlibrary.org/isbn/9783945749456>
- [@mdn-web-docs] *MDN Web Docs*. Mozilla — <https://developer.mozilla.org/>
- [@vue-reactivity] *Reactivity in Depth*. Vue.js — <https://vuejs.org/guide/extras/reactivity-in-depth.html>
