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

<!-- generado: fichas -->

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **React** | biblioteca de interfaz de JavaScript/TypeScript (JavaScript) | 2013 | MIT | Meta y colaboradores |
| **Vue** | framework web de JavaScript/TypeScript (JavaScript) | 2014 | MIT | proyecto independiente |
| **Svelte** | framework de interfaz de JavaScript/TypeScript (JavaScript) | 2016 | MIT | proyecto independiente |
| **SolidJS** | biblioteca de interfaz de JavaScript/TypeScript (JavaScript) | 2018 | MIT | proyecto independiente |
| **Lit** | web-components-library de JavaScript/TypeScript (TypeScript) | 2021 | BSD-3-Clause | Google |

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
| `compilados/Inseguro.js` | código JavaScript |
| `compilados/Seguro.js` | código JavaScript |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Inseguro.svelte` | componente de Svelte |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `Seguro.svelte` | componente de Svelte |

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

### 🔧 Lit

Capa mínima sobre los componentes web del propio estándar. La apuesta por la plataforma en lugar de por el framework.

- **Documentación oficial:** <https://lit.dev/docs/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `@lit-labs/ssr ^3.3.0, lit ^3.2.0`
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

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Para que el resultado sea **medible sin navegador**, cada implementación usa el
renderizado de servidor **real** de su framework: `react-dom/server`,
`@vue/server-renderer`, el compilador de Svelte con `generate: "server"`, el
preset de Babel de Solid con `generate: "ssr"` y `@lit-labs/ssr`. No es una
imitación de las reglas de escapado — **es el mismo código del framework**, y
lo que produce aquí es lo que produce en el DOM.

Las cinco renderizan exactamente el mismo texto hostil:

```javascript
const TEXTO = "<script>alerta(1)</script>";
```

Y cada una lo pinta dos veces: por la vía normal y por la puerta explícita. Lo
que hay que mirar es **cómo se llama la puerta**.

### React · [`react/server.mjs`](implementaciones/react/server.mjs)

```javascript
  "/seguro": () => renderToStaticMarkup(h("p", null, TEXTO)),
  "/inseguro": () =>
    renderToStaticMarkup(h("div", { dangerouslySetInnerHTML: { __html: TEXTO } })),
```

La vía segura **no tiene nombre**: es la interpolación normal, y no existe
opción para olvidarse de escapar. La insegura tiene el nombre más honesto de la
industria — `dangerouslySetInnerHTML` — y encima obliga a envolver el valor en
un objeto con la clave `__html`. Es imposible teclearla por accidente y difícil
de teclear sin enterarse.

### Vue · [`vue/server.mjs`](implementaciones/vue/server.mjs)

```javascript
  "/seguro": () => createSSRApp({ render: () => h("p", TEXTO) }),
  "/inseguro": () => createSSRApp({ render: () => h("div", { innerHTML: TEXTO }) }),
```

Se usan funciones de render porque **es exactamente a lo que compilan las
plantillas**: `{{ texto }}` compila a un hijo de texto escapado, y `v-html`
compila a la propiedad `innerHTML`. Ver el destino de la compilación es más
informativo que ver la plantilla: deja claro que `v-html` no es una directiva
mágica, es una asignación a `innerHTML` con otro nombre.

### Svelte · [`svelte/Seguro.svelte`](implementaciones/svelte/Seguro.svelte) e [`Inseguro.svelte`](implementaciones/svelte/Inseguro.svelte)

```svelte
<p>{texto}</p>
```

```svelte
<div>{@html texto}</div>
```

La diferencia son **cuatro caracteres**: `@html`. Es la puerta más barata de
teclear del elenco, y la documentación de Svelte lo compensa abriendo su
descripción con la advertencia de XSS. Merece la pena verlo junto a React: el
mismo poder, dos costes de escritura muy distintos.

### Solid · [`solid/App.jsx`](implementaciones/solid/App.jsx)

```jsx
export const seguro = (texto) => renderToString(() => <p>{texto}</p>);
```

```jsx
export const inseguro = (texto) => renderToString(() => <div innerHTML={texto} />);
```

JSX igual que React, y la puerta **sin disfraz**: la propiedad `innerHTML` tal
cual. Solid no le pone un nombre alarmante porque no le pone ningún nombre —
usa el de la plataforma. Es coherente con su filosofía (compilar a operaciones
del DOM, no interponer un modelo propio) y a la vez es la puerta menos señalada
de las cinco.

### Lit · [`lit/server.mjs`](implementaciones/lit/server.mjs)

```javascript
  "/seguro": () => collectResultSync(render(html`<p>${TEXTO}</p>`)),
  "/inseguro": () => collectResultSync(render(html`<div>${unsafeHTML(TEXTO)}</div>`)),
```

Aquí el escapado no lo hace un framework: lo hace **la plantilla etiquetada**.
La función ``html`` recibe las partes estáticas y las interpolaciones por separado, así
que sabe con certeza qué escribió el programador y qué vino de fuera — la misma
distinción estructural que hace segura una consulta parametrizada en la clase
074.

Y la puerta es una **directiva importada**: `unsafeHTML` hay que traerla de su
módulo. Una búsqueda de `unsafe-html` en el proyecto encuentra todos los sitios
donde alguien abrió la puerta, que es más de lo que puede decirse de
`innerHTML`.

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
