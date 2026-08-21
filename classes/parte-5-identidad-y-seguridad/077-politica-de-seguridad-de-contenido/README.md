# Clase 077 — Política de seguridad de contenido

> [⬅️ 076](../076-auditoria/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [078 ➡️](../078-dependencias-vulnerables/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🔴 avanzado** · Pista **`frontend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Limitar **lo que el navegador acepta ejecutar**. La clase 073 mostró que
estos frameworks escapan por omisión; esta clase empieza donde aquella
falla: **alguien usó la puerta explícita con contenido ajeno y el script
entró**. La política de seguridad de contenido es la red que hay debajo
[@owasp-cheatsheets].

## 🧩 La situación

La página trae dos scripts:

- uno **legítimo**, con el nonce de esta respuesta;
- uno **inyectado**, `<script>robar()</script>`, sin nonce — el XSS de la
  073 que sí entró.

Con la política activa, el navegador ejecuta el primero y **se niega a
ejecutar el segundo**. La ruta `/sin-politica` sirve exactamente la misma
página sin la cabecera: es la comparación.

## 🧮 El contrato

| Petición | Respuesta | Qué mide |
| --- | --- | --- |
| `GET /` | `script-src` con `'nonce-…'`, **sin** `unsafe-inline` ni `unsafe-eval`, y el marcado lleva **ese mismo** nonce | la política real y su coherencia |
| `GET /` | `base-uri 'none'`, `object-src 'none'` | las puertas traseras del nonce, cerradas |
| `GET /` | el marcado contiene `<script>robar()</script>` | **el XSS sí entró** |
| `GET /` otra vez | la política **no** repite el nonce anterior | un nonce por petición |
| `GET /sin-politica` | **sin** cabecera, mismo script inyectado | la diferencia |

El primer caso mide de una vez las dos mitades que hay que hacer coincidir:
la cabecera dice `'nonce-ABC'` y el `<script>` del marcado dice
`nonce="ABC"`. Si no coinciden —el error número uno al desplegar CSP— la
política bloquea al script **bueno**, la página se rompe, y la reacción
habitual es añadir `unsafe-inline`, que desactiva la defensa entera.

El cuarto caso mide que el nonce es de un solo uso. Un nonce fijo en la
configuración **no es un nonce**: el atacante lo lee en el HTML de ayer y lo
escribe en su script.

## 🔬 Qué mide este contrato y qué no

Con honestidad, porque es la mitad del valor de la clase:

- **Sí mide**: la política que el servidor emite, su coherencia con el
  marcado, la frescura del nonce, la ausencia de las escapatorias conocidas y
  la presencia del script inyectado.
- **No mide**: la ejecución. **Quien bloquea es el navegador**, y este
  laboratorio verifica por HTTP sin navegador. Afirmar que el script «no se
  ejecutó» sin ejecutar nada sería exactamente el tipo de verde vacío que
  este repositorio evita.

Lo que sí puede decirse con la medición hecha: **con esta política, un
navegador conforme no ejecuta el script inyectado** — porque no lleva el
nonce y no hay `unsafe-inline` que lo salve [@whatwg-html].

## 🌐 Las implementaciones

Las cuatro emiten la misma política y la misma página; la cabecera la pone la
capa HTTP, que es donde vive CSP — **no es una característica del framework
de vistas**, y esa es la primera lección. Lo que sí cambia es cuánto ayuda
cada uno a poner el nonce en el marcado:

- **React** — `nonce` es un atributo normal en `<script>`; el SSR lo emite
  sin ceremonia.
- **Vue** — igual, vía `h("script", { nonce, innerHTML })`.
- **Solid** — igual, en JSX.
- **Svelte** — el caso raro, y por dos motivos de **compilador**: se queda
  con los `<script>` de la plantilla (son el bloque del componente), así que
  el script con nonce sale por `{@html}`; y valida el anidamiento HTML **en
  compilación** — un `<div>` dentro de `<html>` es error de compilación, no
  advertencia. Los otros tres lo renderizan sin protestar.

## 📊 Comparación

| Framework | El nonce en el marcado | Su meta-framework |
| --- | --- | --- |
| React | atributo directo | Next.js: nonce por petición desde el middleware |
| Vue | atributo directo | Nuxt: módulo de seguridad con nonce y hashes |
| Solid | atributo directo | SolidStart: cabeceras por ruta |
| Svelte | por la vía cruda (`{@html}`) | **SvelteKit: `kit.csp` genera hashes y nonces solo** |

La fila de Svelte resume la clase: **el framework de vistas es el peor lugar
para gestionar CSP**, y por eso el ecosistema lo resuelve un nivel más
arriba. SvelteKit es el más explícito al respecto —calcula los hashes de lo
que él mismo emite—, y es la respuesta correcta: quien genera el marcado es
quien puede saber qué scripts son legítimos.

## ⚠️ Errores frecuentes

- **`unsafe-inline` para que deje de romper.** Es apagar la defensa
  conservando la cabecera: lo peor de los dos mundos, porque parece protegido
  en la auditoría.
- **Nonce fijo** en configuración, o reutilizado entre peticiones.
- **Nonce en la cabecera distinto del nonce del marcado.** La página se rompe
  y el arreglo apresurado suele ser el punto anterior.
- **Olvidar `base-uri` y `object-src`.** Con `<base>` el atacante reescribe a
  dónde apuntan las rutas relativas de tus scripts; con `<object>` ejecuta sin
  pasar por `script-src`. Una política de nonce sin las dos es evitable.
- **CSP como sustituto del escapado.** Es una **segunda** capa: el escapado
  de la 073 sigue siendo la primera, y una política estricta con XSS
  rutinario es una alarma sonando sin que nadie la atienda.
- **Desplegarla directamente en modo bloqueo.** `Content-Security-Policy-
  Report-Only` existe para medir qué se rompería antes de romperlo.

## ✅ Verificación

```bash
node scripts/run-class.mjs 077
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta
las implementaciones que encuentre y declara las que omitió.

## 🧪 Reto de transferencia

Añade `/informe`, la ruta que recibe los informes de violación, y sirve la
página con `Content-Security-Policy-Report-Only` apuntando a ella
(`report-to`). Después añade el caso que lo mide: con `Report-Only`, la
cabecera de bloqueo **no** está presente — es decir, comprueba que estás
midiendo antes de romper, que es el orden correcto de un despliegue de CSP.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 073 — XSS y escapado](../073-xss-y-escapado/README.md) — la primera
  capa, la que esta clase supone fallada
- [Clase 035 — Cabeceras de seguridad](../../parte-2-la-tuberia/035-cabeceras-de-seguridad/README.md) — dónde vive esta cabecera en la tubería

## Fuentes

- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (Content Security Policy). OWASP — <https://cheatsheetseries.owasp.org/>
- [@whatwg-html] *HTML Standard*. WHATWG — <https://html.spec.whatwg.org/>
- [@mdn-web-docs] *MDN Web Docs* (Content-Security-Policy). Mozilla — <https://developer.mozilla.org/>
- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
