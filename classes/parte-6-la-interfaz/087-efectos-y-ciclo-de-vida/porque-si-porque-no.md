# Por qué sí y por qué no — Efectos y ciclo de vida

> [⬅️ Clase 087](README.md) · [📚 Parte 6](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [React](../../../atlas/fichas/react.md) | Una sola herramienta para todo, y una lista que se puede ajustar a propósito | Esa misma lista es la fuente de sus dos errores más caros | Mantener a mano lo que los otros tres deducen |
| [Vue](../../../atlas/fichas/vue.md) | Separa ciclo de vida de reacción: cada herramienta dice para qué es | Hay que saber cuál toca, y quien viene de React busca una sola | Aprender dos APIs donde antes había una |
| [Svelte](../../../atlas/fichas/svelte.md) | `$effect` deduce sus dependencias: el error de olvidar una no existe | Tampoco se puede acotar a propósito sin rodeos | Menos control sobre cuándo se repite |
| [SolidJS](../../../atlas/fichas/solid.md) | La suscripción por lectura es la misma en el render y en el efecto: un solo modelo | Leer una señal donde no querías suscribirte crea repeticiones sorpresa | Vigilar dónde se lee, no dónde se declara |

## 🧭 Lo que este contrato no puede probar

- **Que el efecto corra en el navegador.** Aquí se comprueba que **no** corre en
  el servidor, que es la mitad interesante. Verlo correr, repetirse y limpiarse
  necesita un navegador — clase 128.
- **El orden entre efectos.** Cuándo corre uno respecto a otro, y respecto al
  pintado del navegador, es una diferencia real entre los cuatro y no se puede
  observar sin DOM.
- **La fuga de memoria.** Un efecto sin limpieza deja suscripciones vivas. Medirlo
  pide montar y desmontar muchas veces con un perfilador.
- **El doble disparo de React en desarrollo.** Es cierto, está declarado en la
  respuesta de la implementación y solo ocurre con el modo estricto en el
  navegador.

## 💡 Lo que hay que llevarse

Un efecto es **una puerta al mundo de fuera**: lo que no se puede calcular a
partir del estado y hay que ir a buscar o registrar en alguna parte.

De ahí salen las tres reglas que aguantan en las cuatro tecnologías:

1. **Si se puede calcular, no es un efecto.** Derivar un valor del estado se hace
   al renderizar. Guardarlo en otro estado desde un efecto duplica la verdad y
   añade un render.
2. **Todo lo que se abre, se cierra.** Suscripción, temporizador, observador,
   conexión: la limpieza no es opcional, es la otra mitad del efecto.
3. **Lo que tiene que estar en el primer HTML no puede vivir en un efecto.** Es
   la conclusión verificada de esta clase, y la que más consecuencias tiene:
   explica el parpadeo, explica por qué los buscadores a veces no ven el
   contenido, y explica la parte 7 entera.

La diferencia entre los cuatro es más pequeña de lo que parece: **todos deducen
las dependencias menos React**, y React no lo hace por una razón defendible —
poder acotar el efecto aunque lea más cosas de las que declara. Esa libertad es
también su trampa, y el ecosistema entero de reglas de linter para `useEffect`
existe por eso.

Si uno se lleva una sola frase: **un efecto no es «código que corre al
renderizar», es código que corre cuando el componente ya está en la pantalla** —
y por eso en el servidor, donde no hay pantalla, no corre nunca.

## Fuentes

- [@banks-porcello-learning-react] Banks, A.; Porcello, E. *Learning React*, 2.ª ed. O'Reilly Media, 2020. ISBN 9781492051725 — <https://openlibrary.org/isbn/9781492051725>
- [@vue-reactivity] *Reactivity in Depth*. Vue.js — <https://vuejs.org/guide/extras/reactivity-in-depth.html>
- [@solid-reactivity] *Intro to Reactivity*. SolidJS — <https://docs.solidjs.com/concepts/intro-to-reactivity>
