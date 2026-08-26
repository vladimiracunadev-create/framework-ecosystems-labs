# Por qué sí y por qué no — Accesibilidad del componente

> [⬅️ Clase 091](README.md) · [📚 Parte 6](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [React](../../../atlas/fichas/react.md) | El verificador más maduro del ecosistema: `eslint-plugin-jsx-a11y` | Renombra atributos —`htmlFor`, `className`— y ese renombrado se olvida | Instalar y configurar el verificador para tener la red |
| [Vue](../../../atlas/fichas/vue.md) | Los atributos se escriben como en HTML: nada que recordar | El verificador es de la comunidad, y `v-if` frente a `v-show` es una trampa propia | Saber que existe el plugin para instalarlo |
| [Svelte](../../../atlas/fichas/svelte.md) | **El compilador avisa sin instalar nada**, el primer día | Los avisos cubren solo lo deducible del marcado estático | Confiar en ellos y creer que ya está todo cubierto |
| [SolidJS](../../../atlas/fichas/solid.md) | No reemplaza nodos, así que el foco no se pierde al actualizar | Sin verificador propio maduro; hereda reglas de `jsx-a11y` | Un ecosistema de herramientas más pequeño |

## 🧭 Lo que este contrato no puede probar

Esta sección es más larga que en otras clases, y con razón: **la mayor parte de
la accesibilidad no está en el marcado estático.**

- **El contraste.** Que el texto se distinga del fondo es una medición de color y
  necesita el CSS aplicado.
- **El orden del foco.** Que al abrir el panel el foco entre dentro, y al cerrar
  vuelva al botón, es comportamiento en el navegador. Es de las cosas que peor se
  hacen y aquí no se ve.
- **Lo que anuncia un lector de pantalla.** El marcado correcto es condición
  necesaria y no suficiente: cómo se lee en la práctica depende del lector, del
  navegador y del sistema.
- **El movimiento y el tiempo.** Animaciones que no respetan la preferencia de
  movimiento reducido, avisos que desaparecen antes de poder leerlos.
- **Que una persona real pueda usarlo.** Ninguna auditoría automática sustituye a
  probarlo con quien navega con teclado, con lector o con la vista cansada. Las
  herramientas encuentran una parte; el resto se encuentra usándolo.

Las cinco reglas de esta clase son **un suelo**: si fallan, hay un problema
seguro. Que pasen no demuestra nada más que eso.

## 💡 Lo que hay que llevarse

La regla que más problemas evita cabe en una frase: **usa el elemento nativo**.

Un `<button>` trae gratis el foco con teclado, la activación con Enter y Espacio,
el papel correcto para un lector y el comportamiento que el sistema operativo
espera. Un `<div>` con `onClick` no trae nada de eso, y recuperarlo a mano
—`role`, `tabindex`, manejadores de teclado— son cuatro líneas que casi nadie
escribe.

Lo segundo es entender **por qué este error sobrevive a todo**. No da error, no
rompe ninguna prueba, no se ve en la pantalla y no lo detecta ninguna revisión que
mire capturas. Es exactamente el mismo perfil que el fallo de claves de la clase
085: **la salida es correcta y el comportamiento no**.

De ahí que la única defensa que funciona sea automática y temprana. Los cuatro
frameworks lo saben y responden distinto: tres con un verificador que hay que
instalar, uno con avisos en el compilador. La diferencia práctica no es de
calidad —los verificadores son buenos— sino de **cuánta gente los tiene puestos**.

Y una nota sobre el orden de prioridades, porque esta clase llega tarde en la
parte 6 y no debería. Norman lo dice del diseño de objetos y vale igual aquí: **la
accesibilidad no es una capa que se añade al final, es una consecuencia de haber
elegido bien las piezas** [@norman-design-everyday-things]. Un `<button>` puesto
el primer día no cuesta nada; convertir doscientos `<div>` en botones seis meses
después, sí.

## Fuentes

- [@norman-design-everyday-things] Norman, Don. *The Design of Everyday Things*, ed. revisada. Basic Books, 2013. ISBN 9780465050659 — <https://openlibrary.org/isbn/9780465050659>
- [@mdn-web-docs] *MDN Web Docs*. Mozilla — <https://developer.mozilla.org/>
- [@silver-form-design-patterns] Silver, Adam. *Form Design Patterns*. Smashing Magazine, 2018. ISBN 9783945749456 — <https://openlibrary.org/isbn/9783945749456>
