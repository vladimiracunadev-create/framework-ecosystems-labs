# Por qué sí y por qué no — XSS y escapado

> [⬅️ Clase 073](README.md) · [📚 Parte 5](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [React](../../../atlas/fichas/react.md) | La puerta se llama `dangerouslySetInnerHTML`: el nombre es la advertencia | Escapa hasta las comillas en texto — la salida es más ruidosa que la de otros | Nada en la práctica: el ruido de entidades no le importa al navegador |
| [Vue](../../../atlas/fichas/vue.md) | `v-html` es corto, conocido y está documentado con su peligro delante | Tan corto que aparece en respuestas de foro sin la advertencia al lado | Vigilar `v-html` en revisión de código como palabra clave |
| [Svelte](../../../atlas/fichas/svelte.md) | `{@html}` salta a la vista en cualquier diff | Escapa lo mínimo (`<` y `&` en contenido): correcto, pero deja menos margen a los contextos que no cubre | Saber que «suficiente» depende del contexto de inserción |
| [Solid](../../../atlas/fichas/solid.md) | La puerta es `innerHTML` a secas: ninguna capa de disfraz sobre el DOM real | Justo por eso es la más fácil de teclear sin pensar | La convención del equipo hace el trabajo que el nombre no hace |
| [Lit](../../../atlas/fichas/lit.md) | `unsafeHTML` importado de un módulo aparte: usarlo deja rastro hasta en los imports | El renderizado servidor vive en un paquete `labs` | Asumir la madurez «labs» de la pieza SSR |

## ✂️ Y los tres que no están

| Framework | Por qué no está | La lección que deja igual |
| --- | --- | --- |
| [Angular](../../../atlas/fichas/angular.md) | Su render fuera del navegador solo existe dentro de su CLI completo; empaquetar la aplicación entera es otra clase de coste, e imitar su render sería medir otra cosa | Escapa por omisión y además **sanea**: `[innerHTML]` pasa por `DomSanitizer`, la postura más protectora del elenco |
| [Alpine.js](../../../atlas/fichas/alpinejs.md) | Manipula el DOM vivo del navegador; sin navegador no hay render que medir | `x-text` asigna `textContent` (seguro por construcción), `x-html` asigna `innerHTML` — la misma pareja, sobre el DOM |
| [htmx](../../../atlas/fichas/htmx.md) | **No escapa nada por diseño**: inserta el HTML que el servidor mandó | La defensa XSS de una aplicación htmx vive en el motor de plantillas del servidor — la responsabilidad cambió de sitio, no desapareció |

## 🧭 El hallazgo

Los cinco medidos convergen en el mismo diseño — **escapar por omisión,
puerta explícita para salirse** — y divergen solo en cuánto cuesta teclear
la puerta. Esa convergencia es reciente e histórica: la generación anterior
(PHP crudo, JSP con scriptlets, jQuery con `.html()`) hacía lo contrario —
insertar crudo era lo fácil y escapar era el gesto extra. El XSS pasó de
epidemia a excepción cuando los frameworks invirtieron la omisión
[@hoffman-web-application-security].

La consecuencia práctica: en 2026, el XSS en aplicaciones con estos
frameworks casi siempre entra por una de dos puertas — el uso indebido de
la vía explícita con contenido ajeno, o los contextos que el framework no
cubre (URLs `javascript:`, atributos construidos a mano). El escapado del
framework no es toda la defensa; la clase 077 añade la red que atrapa lo
que se escape de esta.

## Fuentes

- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (XSS Prevention). OWASP — <https://cheatsheetseries.owasp.org/>
- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
