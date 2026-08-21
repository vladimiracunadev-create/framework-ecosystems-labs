# Por qué sí y por qué no — Política de seguridad de contenido

> [⬅️ Clase 077](README.md) · [📚 Parte 5](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [React](../../../atlas/fichas/react.md) | `nonce` es un atributo más; Next.js lo reparte por petición desde el middleware | React solo no sabe qué scripts emite el empaquetador: los hashes no se los puede calcular él | Depender del meta-framework para que la política sea completa |
| [Vue](../../../atlas/fichas/vue.md) | Mismo atributo directo, y Nuxt trae módulo de seguridad con nonce y hashes | Fuera de Nuxt, coser la política es trabajo manual | Lo mismo, un escalón más arriba |
| [Svelte](../../../atlas/fichas/svelte.md) | **SvelteKit calcula los hashes de lo que él mismo emite**: la respuesta más completa del elenco | El componente suelto es el más incómodo: el compilador se queda con los `<script>` de la plantilla | Aceptar que esto no se hace a nivel de componente |
| [Solid](../../../atlas/fichas/solid.md) | JSX directo, y SolidStart permite cabeceras por ruta | El ecosistema es más joven: menos automatismo hecho | Escribir a mano lo que otros ya generan |

## 🧭 El hallazgo

Esta es la clase donde el framework de vistas **no es el protagonista**, y
eso es lo que enseña. CSP es una cabecera HTTP: la pone el servidor, no el
renderizador. Los cuatro emiten la misma política porque no hay margen — lo
que cambia está un nivel más arriba, en el meta-framework, y ahí sí hay
diferencias grandes.

La razón es estructural: una política estricta necesita saber **qué scripts
son legítimos**, y eso solo lo sabe quien genera la página completa —
plantilla, empaquetado y todo. Por eso SvelteKit puede calcular hashes y un
componente de Svelte no. Cuando la responsabilidad no cabe en la pieza, el
ecosistema la sube de nivel; es el mismo movimiento que la 069 con OAuth,
donde nadie escribe su propio servidor de autorización.

## ⚖️ Cuándo vale la pena

CSP tiene un coste real —romper la página en producción es el escenario
habitual del primer despliegue— y no todas las aplicaciones lo amortizan
igual:

| Situación | ¿Merece una política estricta? |
| --- | --- |
| Aplicación con datos de usuarios y sesión | **sí**, y con nonce, no con lista de dominios |
| Sitio que incrusta scripts de terceros | sí, y **duele**: cada tercero es una excepción que negociar |
| Página estática sin datos ni sesión | poco: hay poco que robar |
| Aplicación interna tras autenticación | sí — «interno» no es un control de seguridad |

Y la regla de despliegue que evita el desastre: **`Report-Only` primero**.
Medir qué se rompería, arreglarlo, y solo entonces bloquear. Una política
desplegada en bloqueo el primer día produce una página rota y un
`unsafe-inline` de urgencia — que es peor que no haberla puesto, porque deja
la cabecera puesta y la defensa apagada [@owasp-cheatsheets].

## Fuentes

- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (Content Security Policy). OWASP — <https://cheatsheetseries.owasp.org/>
- [@mdn-web-docs] *MDN Web Docs* (Content-Security-Policy). Mozilla — <https://developer.mozilla.org/>
