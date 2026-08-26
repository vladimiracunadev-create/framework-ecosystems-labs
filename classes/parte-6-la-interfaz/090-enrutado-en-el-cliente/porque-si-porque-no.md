# Por qué sí y por qué no — Enrutado en el cliente

> [⬅️ Clase 090](README.md) · [📚 Parte 6](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [React](../../../atlas/fichas/react.md) | Eliges enrutador según el proyecto, y hay varios maduros | No hay uno oficial: cada proyecto elige, y los tutoriales no coinciden | Que el orden de la tabla sea tuyo, con el fallo de `/nueva` incluido |
| [Vue](../../../atlas/fichas/vue.md) | Vue Router es oficial y ordena por especificidad: un error menos | Sigue siendo una dependencia que instalar y versionar | Aprender sus convenciones, que no son las del emparejador de nadie más |
| [Angular](../../../atlas/fichas/angular.md) | Viene en el framework, con tipos y con guardias de ruta | Empareja en orden, así que el fallo de `/nueva` existe igual | Una pieza más del framework que aprender aunque no la uses |
| [Svelte](../../../atlas/fichas/svelte.md) | SvelteKit quita la tabla: la ruta es el directorio | Hay que aprender qué significa cada corchete y cada `+` en un nombre | Renombrar carpetas para cambiar direcciones |

## 🧭 Lo que este contrato no puede probar

- **La navegación sin recarga.** Que pulsar un enlace cambie la pantalla sin
  pedir nada al servidor es **lo único** que distingue un enrutador de cliente de
  uno de servidor, y necesita navegador. Es la clase 128.
- **El historial.** Que el botón «atrás» funcione, que la posición del scroll se
  recupere y que una dirección se pueda marcar como favorita son propiedades del
  navegador.
- **Las guardias y la carga perezosa.** Interceptar una navegación para
  comprobar permisos, o cargar el código de una pantalla solo al entrar, son
  funciones reales de los cuatro enrutadores y no se ven aquí.
- **La configuración de reserva del servidor web.** Que `/tareas/42` recargada a
  pelo llegue a la aplicación en lugar de dar un 404 del servidor es
  configuración de infraestructura, no del framework.

## 💡 Lo que hay que llevarse

**La dirección es estado, y es el mejor estado que hay.** Se puede compartir,
marcar como favorita, recargar y mandar por mensaje. Ningún `useState` hace eso.

De ahí sale la pregunta útil al diseñar una pantalla: *si el usuario recarga
ahora, ¿debería ver lo mismo?* Si la respuesta es sí —el filtro, la pestaña, la
página del listado, el término buscado—, ese dato pertenece a la URL y no al
componente.

Y hay una consecuencia que casi nadie aprovecha: **la dirección la escribe el
usuario**. Un parámetro de ruta es entrada externa, con todo lo que la parte 3
dijo sobre validar lo que entra. `/tareas/42` y `/tareas/borrar-todo` llegan por
el mismo canal.

Sobre la comparación de los cuatro, la lectura de fondo es la de la clase 004
otra vez: **cuánto decide el framework por ti**. React no decide nada y hay tres
enrutadores compitiendo; SvelteKit decide hasta la estructura de carpetas. Las
dos posturas funcionan, y la diferencia se nota el día que quieres hacer algo que
tu framework no previó.

La última idea es la que abre la parte siguiente. El enrutador de esta clase se
ejecuta en el servidor **y** en el cliente con la misma tabla. Esa simetría no es
un truco del laboratorio: es lo que permite que una página llegue ya renderizada
y siga funcionando después sin recargar. Cómo se combina eso —y qué cuesta— es la
clase 093.

## Fuentes

- [@fielding-rest-dissertation] Fielding, Roy T. *Architectural Styles and the Design of Network-based Software Architectures*. UC Irvine, 2000 — <https://ics.uci.edu/~fielding/pubs/dissertation/top.htm>
- [@mdn-web-docs] *MDN Web Docs*. Mozilla — <https://developer.mozilla.org/>
- [@patterns-dev] *Patterns.dev — Modern Web App Design Patterns* — <https://www.patterns.dev/>
