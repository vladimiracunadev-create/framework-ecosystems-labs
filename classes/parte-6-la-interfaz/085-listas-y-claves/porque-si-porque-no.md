# Por qué sí y por qué no — Listas y claves

> [⬅️ Clase 085](README.md) · [📚 Parte 6](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [React](../../../atlas/fichas/react.md) | Es el único que avisa en ejecución cuando la clave falta | No dice nada cuando dos claves se repiten, que es el caso peor | Un aviso en la consola que en un servidor no lee nadie |
| [Vue](../../../atlas/fichas/vue.md) | La defensa llega antes de ejecutar: el verificador marca `v-for` sin `key` como error | Esa defensa es de la herramienta, no del framework, y se puede desactivar | Que el proyecto sin linter quede sin ninguna red |
| [Svelte](../../../atlas/fichas/svelte.md) | La clave es parte de la sintaxis del bucle: se ve al leer | No avisa si falta — solo si se repite, y entonces lanza una excepción | Descubrir el error en el navegador y no en la revisión |
| [SolidJS](../../../atlas/fichas/solid.md) | No hay claves que equivocar: la identidad es la referencia del objeto | El error se muda: recrear objetos hace que se redibuje la lista entera | Vigilar de dónde salen los objetos, sin ningún aviso que lo recuerde |

## 🧭 Lo que este contrato no puede probar

- **El fallo en sí.** Reordenar la lista y ver una casilla marcada quedarse en la
  fila equivocada necesita un navegador. Aquí se verifica todo lo que decide si
  ese fallo puede ocurrir, no el fallo. La clase 128 lo cierra.
- **El coste de una clave mala.** Que `Math.random()` como clave recree la lista
  entera es cierto y medirlo pide la metodología de la clase 007 con un árbol de
  verdad.
- **Que la clave sea única en los datos reales.** El contrato usa tres frutas con
  identificadores distintos. Que los tuyos lo sean depende de tu origen de datos,
  y es una comprobación que ningún framework puede hacer por ti.
- **Lo que hacen los otros cuatro del elenco de la parte.** Lit resuelve esto con
  una directiva aparte —`repeat`— y su documentación recomienda **no** usarla
  salvo que los elementos tengan estado; htmx y Alpine no tienen listas
  reconciliadas porque no reconcilian nada. Se cuenta aquí porque el contraste
  ayuda, y no está en el elenco porque el problema no existe igual para ellos.

## 💡 Lo que hay que llevarse

Una clave contesta una sola pregunta, y hay que tenerla en la cabeza al
escribirla: **este elemento de ahora, ¿es el mismo que aquel de antes?**

De ahí sale todo:

- **El índice contesta mal** porque identifica la posición, no el elemento. Con
  la lista quieta acierta por casualidad; en cuanto se ordena, falla.
- **Un valor aleatorio contesta «no» siempre**, así que el framework recrea todo
  y pierde el estado en cada actualización.
- **El identificador del dato contesta bien** porque acompaña al elemento vaya
  donde vaya.

Y la observación incómoda de esta clase: **el HTML es correcto en todos los
casos**. Un fallo de claves no se ve en la salida, no rompe ninguna prueba de
render y pasa las revisiones sin que nadie levante la mano. Solo aparece cuando
la lista se mueve y el estado se queda — y para entonces el síntoma («la casilla
marcada salta de fila») no se parece en nada a la causa.

Por eso los cuatro frameworks intentan defenderte y **ninguno lo consigue del
todo**: React grita cuando falta, Svelte cuando se repite, Vue antes de ejecutar
y Solid cambiando el modelo. Cuatro defensas parciales para un error que el
resultado no delata.

La conclusión práctica cabe en una regla: **si la lista puede cambiar de orden,
la clave sale del dato**. Y si no puede cambiar de orden hoy, va a poder mañana.

## Fuentes

- [@banks-porcello-learning-react] Banks, A.; Porcello, E. *Learning React*, 2.ª ed. O'Reilly Media, 2020. ISBN 9781492051725 — <https://openlibrary.org/isbn/9781492051725>
- [@vue-reactivity] *Reactivity in Depth*. Vue.js — <https://vuejs.org/guide/extras/reactivity-in-depth.html>
- [@solid-reactivity] *Intro to Reactivity*. SolidJS — <https://docs.solidjs.com/concepts/intro-to-reactivity>
