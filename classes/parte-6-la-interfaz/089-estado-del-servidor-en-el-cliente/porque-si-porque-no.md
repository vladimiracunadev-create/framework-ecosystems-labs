# Por qué sí y por qué no — Estado del servidor en el cliente

> [⬅️ Clase 089](README.md) · [📚 Parte 6](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [React](../../../atlas/fichas/react.md) | El ecosistema más maduro para esto: TanStack Query es el estándar de hecho | Nada en el núcleo, así que cada proyecto elige y a veces no elige nada | Una dependencia grande, con su curva y su versión que mantener |
| [Vue](../../../atlas/fichas/vue.md) | Pinia Colada encaja con las convenciones del framework | Pinia ya está instalado, y el estado del servidor acaba dentro sin decidirlo | Escribir a mano la obsolescencia que la biblioteca traía hecha |
| [Svelte](../../../atlas/fichas/svelte.md) | SvelteKit evita gran parte del problema cargando en el servidor | Fuera de SvelteKit, el ecosistema de consultas es más pequeño | Depender del metaframework para la solución más limpia |
| [SolidJS](../../../atlas/fichas/solid.md) | `createResource` en el núcleo: cargando, error y cancelación resueltos | No es una caché: sin claves, sin invalidación global | Creer que ya está cubierto y descubrir el hueco tarde |

## 🧭 Lo que este contrato no puede probar

- **La revalidación en segundo plano.** Aquí la petición de refresco ocurre en la
  misma llamada. En el navegador es asíncrona: el usuario ve lo viejo y el dato
  llega después. Verlo pide un navegador — clase 128.
- **La deduplicación de peticiones simultáneas.** Que dos componentes pidiendo la
  misma clave a la vez produzcan **una sola** petición es una de las mejores
  propiedades de estas bibliotecas, y necesita concurrencia real.
- **Los reintentos y el retroceso exponencial.** Están en todas las bibliotecas y
  aquí no: la fuente de esta clase no falla nunca.
- **Cuánto se ahorra de verdad.** El contador dice cuántas peticiones se evitaron
  en esta secuencia. En una aplicación real depende del patrón de navegación, y
  medirlo es trabajo de la pestaña de red.

## 💡 Lo que hay que llevarse

Hay **dos especies de estado** y confundirlas es el error caro:

- **El tuyo.** Si un panel está abierto, qué pestaña está activa, qué hay escrito
  en un campo. Nace y muere contigo, y las clases 084 y 088 dicen dónde ponerlo.
- **El ajeno.** La lista de usuarios, el precio, el stock. Vive en el servidor, lo
  cambia otra gente, y lo que tú tienes es **una copia con fecha**.

Tratar el segundo como el primero produce siempre la misma secuencia: se guarda
en un estado, funciona, y meses después alguien pregunta por qué la pantalla
enseña un dato que ya no existe.

Lo que hacen TanStack Query, SWR, Pinia Colada y compañía no es guardar el dato
—eso es un `Map`—: es **gestionar el desfase**. Saber cuándo la copia envejeció,
servirla igual mientras llega la nueva, y borrarla cuando algo la invalidó. Son
las cuatro ideas de la caché de esta clase, y caben en cuarenta líneas: lo que
las bibliotecas añaden encima son las suscripciones, la deduplicación, los
reintentos y las herramientas para verlo.

Nygard tiene la formulación general, hablando de sistemas integrados: **toda
copia de un dato remoto es una apuesta sobre cuánto tarda en cambiar**
[@nygard-release-it]. La caché no elimina la apuesta — la hace explícita, con un
plazo que alguien eligió.

Y la conclusión que abre la parte siguiente: **el mejor estado del servidor en el
cliente es el que no está ahí**. Si el dato se carga en el servidor antes de
renderizar, no hay copia que envejecer ni desfase que gestionar. Eso no siempre
se puede, y cuándo se puede es la clase 093.

## Fuentes

- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@patterns-dev] *Patterns.dev — Modern Web App Design Patterns* — <https://www.patterns.dev/>
- [@osmani-js-design-patterns] Osmani, Addy. *Learning JavaScript Design Patterns*, 2.ª ed. O'Reilly Media, 2023. ISBN 9781098139872 — <https://openlibrary.org/isbn/9781098139872>
