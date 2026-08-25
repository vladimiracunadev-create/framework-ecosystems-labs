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

<!-- generado: fichas -->

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **React** | biblioteca de interfaz de JavaScript/TypeScript (JavaScript) | 2013 | MIT | Meta y colaboradores |
| **Vue** | framework web de JavaScript/TypeScript (JavaScript) | 2014 | MIT | proyecto independiente |
| **Svelte** | framework de interfaz de JavaScript/TypeScript (JavaScript) | 2016 | MIT | proyecto independiente |
| **SolidJS** | biblioteca de interfaz de JavaScript/TypeScript (JavaScript) | 2018 | MIT | proyecto independiente |

### 🔧 React

Impuso la idea de la interfaz como función del estado y el árbol virtual. Es una biblioteca, no un framework: no arranca tu aplicación ni define su ciclo de vida.

- **Documentación oficial:** <https://react.dev/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `react ^19.0.0, react-dom ^19.0.0`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node server.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

### 🔧 Vue

Adopción progresiva: sirve como etiqueta en una página existente o como framework completo. Su reactividad fina influyó en toda la generación siguiente.

- **Documentación oficial:** <https://vuejs.org/guide/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `@vue/server-renderer ^3.5.0, vue ^3.5.0`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node server.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

### 🔧 Svelte

Mueve el trabajo del navegador al compilador. Cambia el coste de ejecución por dependencia de la fase de construcción: un compromiso, no una mejora gratuita.

- **Documentación oficial:** <https://svelte.dev/docs/svelte>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `svelte ^5.0.0`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node server.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `compilados/Pagina.js` | código JavaScript |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `Pagina.svelte` | componente de Svelte |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

### 🔧 SolidJS

Reactividad de grano fino sin árbol virtual: el componente se ejecuta una vez y solo se actualiza lo que leyó el valor cambiado.

- **Documentación oficial:** <https://docs.solidjs.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `@babel/cli ^7.25.0, @babel/core ^7.26.0, babel-preset-solid ^1.9.0, solid-js ^1.9.0`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm,install,--silent,--ignore-scripts pnpm,exec,babel,App.jsx,--out-file,App.compilada.mjs
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node server.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `.babelrc` | configuración de Babel: qué transformación se aplica al compilar |
| `App.compilada.mjs` | código JavaScript (módulo ES) |
| `App.jsx` | componente en JSX |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las cuatro emiten **la misma política y la misma página**. La cabecera la pone
la capa HTTP, que es donde vive CSP: **no es una característica del framework de
vistas**, y esa es la primera lección de la clase.

Las cuatro parten del mismo desastre — el de la clase 073, consumado:

```javascript
const INYECTADO = "<script>robar()</script>";
```

El escapado falló. Alguien usó la puerta explícita con contenido de un usuario y
el script está en el marcado. Lo que se mide aquí es **la red que hay debajo**.

### La política, idéntica en las cuatro · [`react/server.mjs`](implementaciones/react/server.mjs)

```javascript
function politica(nonce) {
  return [
    "default-src 'self'",
    `script-src 'nonce-${nonce}'`,
    "base-uri 'none'",
    "object-src 'none'",
  ].join("; ");
}
```

```javascript
    const nonce = crypto.randomBytes(16).toString("base64url");
```

**Un nonce por petición, del generador criptográfico.** Un nonce fijo en la
configuración no es un nonce: el atacante lo lee en el HTML de ayer y lo escribe
en su script.

Y las dos últimas directivas son las puertas traseras conocidas de una política
basada en nonce: `<base>` reescribe a dónde apuntan las rutas relativas, y un
`<object>` ejecuta contenido **sin pasar por `script-src`**. Una política que
solo declara `script-src` deja las dos abiertas.

### React · [`react/server.mjs`](implementaciones/react/server.mjs)

```javascript
        h("script", { nonce, dangerouslySetInnerHTML: { __html: "window.saludo=1" } }),
```

`nonce` es **un atributo normal**: el renderizador de servidor lo emite sin
ceremonia. Nada especial que aprender, que es justo lo que se quiere de un
framework aquí.

### Vue · [`vue/server.mjs`](implementaciones/vue/server.mjs)

```javascript
        h("script", { nonce, innerHTML: "window.saludo=1" }),
```

Lo mismo con `innerHTML` en vez de la envoltura de React — la diferencia de
nombres de la clase 073, otra vez.

### Solid · [`solid/App.jsx`](implementaciones/solid/App.jsx)

```jsx
      <script nonce={nonce} innerHTML="window.saludo=1" />
```

JSX directo. Tres de los cuatro resuelven esto en una línea sin pensar.

### Svelte · [`svelte/Pagina.svelte`](implementaciones/svelte/Pagina.svelte) — el caso raro, y por qué

```svelte
  const legitimo = `<scr${"ipt"} nonce="${nonce}">window.saludo=1</scr${"ipt"}>`;
```

```svelte
{@html legitimo}
```

Ese `<scr${"ipt"}>` partido en dos no es un truco gratuito: **es la única forma
de que el compilador de Svelte no se quede con la etiqueta**. Y hay dos rarezas
detrás, las dos del compilador:

1. **Svelte se apropia de los `<script>` de la plantilla** — son el bloque de
   script del componente. Un script destinado al navegador hay que emitirlo por
   la vía cruda, `{@html}`, que es precisamente la puerta que la clase 073
   señalaba como peligrosa. Aquí es la única salida.
2. **Valida el anidamiento HTML en tiempo de compilación.** Un `<div>` dentro de
   `<html>` es un **error de compilación**, no una advertencia en consola. Los
   otros tres del elenco lo renderizan sin protestar.

Las dos juntas explican una decisión de arquitectura real: **SvelteKit no deja
la política en manos del componente y la genera él**. Cuando el compilador se
interpone entre lo que escribes y el marcado, la capa que emite cabeceras tiene
que estar por encima del componente, no dentro.

### La página sin red debajo

```javascript
  if (peticion.url === "/sin-politica") {
```

Las cuatro sirven la **misma página** en una segunda ruta, sin la cabecera. Es
lo que convierte la clase en una medición y no en una declaración: el mismo
marcado, el mismo script inyectado, y la única diferencia es la política. Sin
ese segundo caso, un contrato que solo comprobara `/` no distinguiría una
política que funciona de una política que no hace nada.

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
