# Clase 073 — XSS y escapado

> [⬅️ 072](../072-csrf/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [074 ➡️](../074-inyeccion-sql/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🟡 intermedio** · Pista **`frontend`**
>
> ✅ **Clase construida** — 5 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Ver **qué escapa el framework por omisión y qué no**. El *Cross-Site
Scripting* es texto de un usuario que el navegador ejecuta como código; la
defensa moderna no es filtrar lo malo sino **escapar todo por omisión** — y
dejar la vía insegura como una puerta explícita con nombre de peligro
[@owasp-cheatsheets].

## 🧩 La situación

Un usuario escribió `<script>alerta(1)</script>` en un campo de texto. Cada
framework lo renderiza dos veces: por su **interpolación normal** —donde el
script tiene que llegar neutralizado— y por su **puerta explícita** — donde
llega vivo, porque alguien lo pidió con todas las letras.

## 🧮 El contrato

| Petición | Respuesta | Qué mide |
| --- | --- | --- |
| `GET /seguro` | contiene `&lt;script` y **no** contiene `<script>` | la omisión escapa |
| `GET /seguro` | contiene `alerta(1)` | escapar **neutraliza, no recorta**: el texto sigue ahí |
| `GET /inseguro` | contiene `<script>alerta(1)</script>` **literal** | la puerta explícita no escapa |

El segundo caso separa el escapado del filtrado: un framework que *borrara*
el script también pasaría el primer caso — y estaría destruyendo datos del
usuario. La respuesta correcta conserva cada carácter y le quita el poder.

## 🌐 Las implementaciones

Para que el resultado sea medible sin navegador, cada implementación usa el
**renderizado de servidor real** de su framework — `react-dom/server`,
`@vue/server-renderer`, el compilador de Svelte con `generate: "server"`, el
preset de Babel de Solid con `generate: "ssr"` y `@lit-labs/ssr`. Las reglas
de escapado son las mismas que en el DOM: es el mismo código del framework.

## 📊 Comparación: las puertas, por nombre

| Framework | Interpolación segura | La puerta explícita |
| --- | --- | --- |
| React | `{texto}` | `dangerouslySetInnerHTML={{ __html }}` |
| Vue | `{{ texto }}` | `v-html` |
| Svelte | `{texto}` | `{@html texto}` |
| Solid | `{texto}` | `innerHTML={texto}` |
| Lit | `${texto}` | `unsafeHTML(texto)` |

La columna derecha es una lección de diseño de API: React eligió el nombre
más incómodo de la industria y esa incomodidad **es la característica** —
nadie teclea `dangerously` sin enterarse. `v-html` y `innerHTML` son más
neutros, y sus documentaciones compensan abriendo con la advertencia.

## ✂️ Los tres que salieron del elenco

El manifiesto planteaba ocho frameworks; tres no pueden ejercitar **de
verdad** lo que esta clase mide, y antes que simularlos, se recortan:

- **Angular** — escapa por omisión igual que estos cinco (y su puerta es
  `[innerHTML]` + `DomSanitizer.bypassSecurityTrustHtml`), pero su
  renderizado fuera del navegador solo existe dentro de su propia cadena de
  compilación completa. Medirlo aquí exigiría empaquetar la aplicación
  entera con su CLI; imitar su render con otro motor sería medir otra cosa.
- **Alpine.js** — no renderiza plantillas: **manipula el DOM del navegador
  ya cargado** (`x-text` escapa asignando `textContent`; `x-html` no,
  asignando `innerHTML`). Sin navegador no hay nada real que medir.
- **htmx** — la más instructiva de las tres ausencias: htmx **no escapa
  nada por diseño**, porque no genera HTML — lo trae del servidor y lo
  inserta. La defensa XSS de una aplicación htmx vive en el motor de
  plantillas **del servidor**, y ese examen pertenece a los frameworks de
  la pista backend.

## ⚠️ Errores frecuentes

- **Confundir escapar con validar o filtrar.** Validar rechaza entradas;
  escapar neutraliza salidas. Se necesitan las dos, en momentos distintos —
  y filtrar «lo peligroso» con listas negras pierde siempre
  [@hoffman-web-application-security].
- **Usar la puerta explícita para contenido de usuarios.** `v-html` con un
  comentario de blog es un XSS en producción. La puerta es para HTML
  **propio o saneado** (DOMPurify y equivalentes), nunca para texto ajeno.
- **Escapar a mano antes del framework.** El doble escapado muestra
  `&amp;lt;` al usuario — y la próxima vez alguien «arregla» quitando el
  escapado del framework.
- **Creer que el escapado de contenido cubre los atributos y las URL.**
  `href="javascript:…"` no lleva `<` ni `>`: cada contexto tiene sus reglas
  de escapado, y los frameworks cubren contenido y atributos — las URL las
  valida tu código.
- **`HttpOnly` como coartada** (clase 066): impide robar la cookie por
  `document.cookie`, no impide que el script inyectado actúe *como* el
  usuario desde la propia página.

## ✅ Verificación

```bash
node scripts/run-class.mjs 073
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta
las implementaciones que encuentre y declara las que omitió.

## 🧪 Reto de transferencia

Añade a cada implementación una ruta `/atributo` que interpole el texto
malicioso `" onmouseover="alerta(1)` **dentro de un atributo** (`title`), y
comprueba con el contrato que el atributo no se rompe. Es el segundo
contexto de escapado — y el primero que las plantillas caseras con
`replace('<', '&lt;')` pierden.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 077 — Política de seguridad de contenido](../077-politica-de-seguridad-de-contenido/README.md) — la red de seguridad para cuando el escapado falla
- [Clase 066 — Sesión con cookie](../066-sesion-con-cookie/README.md) — qué protege `HttpOnly` y qué no

## Fuentes

- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (Cross Site Scripting Prevention). OWASP — <https://cheatsheetseries.owasp.org/>
- [@owasp-top10] *OWASP Top 10* (A03: Injection). OWASP — <https://owasp.org/www-project-top-ten/>
- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
- [@whatwg-html] *HTML Standard* (parsing y contextos de escapado). WHATWG — <https://html.spec.whatwg.org/>
