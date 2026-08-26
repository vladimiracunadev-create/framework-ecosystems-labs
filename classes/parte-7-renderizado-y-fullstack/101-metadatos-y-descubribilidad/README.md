# Clase 101 — Metadatos y descubribilidad

> [⬅️ Clase 100](../100-html-en-flujo/README.md) · [📚 Parte 7](../README.md) · [🎓 Clases](../../README.md) · [102 ➡️](../102-presupuesto-de-javascript/README.md)
>
> Parte **7 — Renderizado y full-stack** · Nivel **🔴 avanzado** · Pista **`fullstack`** (Renderizado y full-stack)
>
> ✅ **Clase construida** — 5 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Un rastreador de una red social **no ejecuta JavaScript**. Pide la página, lee
la cabecera del documento y se va.

Así que todo lo que decide cómo se ve tu enlace cuando alguien lo comparte
—título, descripción, imagen, tipo— tiene que estar en el primer HTML. Esta
clase comprueba que está, en las cinco, y compara cinco formas de escribirlo que
no son intercambiables.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Comprobar** que los metadatos de una ruta salen del servidor, sin abrir el
  navegador.
- **Detectar el fallo más silencioso** de esta parte: dos rutas con el mismo
  título porque el título es de la plantilla.
- **Elegir** entre escribir etiquetas y usar una API dedicada, sabiendo qué
  compra cada una.
- **Reconocer** que el grafo de schema.org se queda fuera de las cinco APIs, y
  por qué.

## 🧩 La situación

Dos rutas: una portada y un artículo. Cada una con su título, su descripción, su
enlace canónico y sus etiquetas de Open Graph. El artículo, además, con su grafo
de `schema.org` en JSON-LD.

Nada de eso se ve en la pantalla. Todo eso es lo único que ve quien comparte el
enlace.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /` | título, descripción, `og:*` y canónico de la portada |
| 2 | `GET /articulo/hola-mundo` | los suyos, que son otros |
| 3 | `GET /articulo/hola-mundo` | **y no arrastra el de la portada** |
| 4 | `GET /articulo/hola-mundo` | su grafo de schema.org, sin escapar |
| 5 | `GET /metadatos.json` | los dos títulos salen del servidor y son distintos |
| 6 | `GET /metadatos.json` | cómo se escriben y si esa forma evita duplicados |

**El caso 3 es el que encuentra el fallo real**, y es un `cuerpo_no_contiene`:

```json
        "cuerpo_no_contiene": ["<title>Tareas de Ada</title>"]
```

Sin él, una implementación con un título por omisión en la plantilla pasaría los
casos 1 y 2 y estaría indexando las dos páginas con el mismo nombre. Pasó
exactamente eso al construir esta clase, y está contado abajo.

<!-- generado: fichas -->

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Next.js** | react-metaframework de JavaScript/TypeScript (TypeScript) | 2016 | MIT | Vercel |
| **Nuxt** | vue-metaframework de JavaScript/TypeScript (TypeScript) | 2016 | MIT | proyecto independiente |
| **SvelteKit** | svelte-metaframework de JavaScript/TypeScript (TypeScript) | 2022 | MIT | proyecto independiente |
| **Remix** | react-metaframework de JavaScript/TypeScript (TypeScript) | 2021 | MIT | proyecto independiente |
| **Astro** | web-metaframework de JavaScript/TypeScript (TypeScript) | 2021 | MIT | proyecto independiente |

### 🔧 Next.js

Convirtió el renderizado en servidor en la opción por omisión del ecosistema React. Su acoplamiento con una plataforma concreta es la dimensión que el módulo 11 obliga a puntuar.

- **Documentación oficial:** <https://nextjs.org/docs>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `next ^15.2.4, react ^19.1.0, react-dom ^19.1.0`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
pnpm exec next build
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 pnpm exec next start -p 3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `app/articulo/hola-mundo/page.js` | código JavaScript |
| `app/datos.js` | código JavaScript |
| `app/layout.js` | código JavaScript |
| `app/metadatos.json/route.js` | código JavaScript |
| `app/page.js` | código JavaScript |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `next.config.mjs` | código JavaScript (módulo ES) |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |

### 🔧 Nuxt

El equivalente de Next.js sobre Vue, con un motor de servidor propio reutilizable fuera del framework.

- **Documentación oficial:** <https://nuxt.com/docs>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `nuxt ^3.16.1, vue ^3.5.13`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
pnpm exec nuxt build
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node .output/server/index.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `datos.ts` | código TypeScript |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `nuxt.config.ts` | código TypeScript |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pages/articulo/hola-mundo.vue` | archivo del proyecto |
| `pages/index.vue` | archivo del proyecto |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |

### 🔧 SvelteKit

Enrutado por sistema de archivos y adaptadores de despliegue intercambiables, que es una estrategia de salida incorporada al diseño.

- **Documentación oficial:** <https://svelte.dev/docs/kit>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `@sveltejs/adapter-node ^5.2.12, @sveltejs/kit ^2.20.2, @sveltejs/vite-plugin-svelte ^5.0.3, svelte ^5.25.3, vite ^6.2.3`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
pnpm exec vite build
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node build/index.js
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `src/app.html` | plantilla o marcado |
| `src/lib/Cabeza.svelte` | componente de Svelte |
| `src/lib/datos.js` | código JavaScript |
| `src/routes/+page.server.js` | código JavaScript |

### 🔧 Remix

Apostó por los estándares de la plataforma web —formularios, respuestas, caché— frente a abstracciones propias. Su fusión con React Router es un ejemplo de convergencia entre proyectos.

- **Documentación oficial:** <https://remix.run/docs>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `@remix-run/node ^2.16.3, @remix-run/react ^2.16.3, @remix-run/serve ^2.16.3, isbot ^5.1.25, react ^18.3.1, react-dom ^18.3.1, @remix-run/dev ^2.16.3, vite ^6.2.3`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
pnpm exec remix vite:build
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 pnpm exec remix-serve ./build/server/index.js
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `app/datos.js` | código JavaScript |
| `app/root.jsx` | componente en JSX |
| `app/routes/_index.jsx` | componente en JSX |
| `app/routes/articulo.hola-mundo.jsx` | componente en JSX |
| `app/routes/metadatos[.]json.js` | código JavaScript |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |

### 🔧 Astro

Arquitectura de islas: por omisión no envía JavaScript y cada componente interactivo se declara explícitamente. Permite mezclar React, Vue y Svelte en la misma página, lo que lo hace un banco de pruebas ideal para comparar.

- **Documentación oficial:** <https://docs.astro.build/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `astro ^5.6.1, @astrojs/node ^9.1.3`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
pnpm exec astro build
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node ./dist/server/entry.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `astro.config.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `src/components/Cabeza.astro` | archivo del proyecto |
| `src/datos.js` | código JavaScript |
| `src/pages/articulo/hola-mundo.astro` | archivo del proyecto |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

### Lo que hay que publicar, idéntico en las cinco

[`astro/src/datos.js`](implementaciones/astro/src/datos.js):

```javascript
 * Un rastreador de una red social no ejecuta JavaScript. Si el título y la
 * descripción se ponen desde el navegador, el enlace compartido sale con el
 * título de la plantilla y sin imagen. Es el fallo de descubribilidad más caro
 * y el más fácil de no ver, porque en el navegador se ve bien.
```

Y el grafo, con la observación que la clase remata al final:

```javascript
/** El grafo de la entidad, en el formato que leen los buscadores. Es lo mismo
 *  que las etiquetas de arriba dicho otra vez y en otro idioma, y esa
 *  duplicación es la parte que ningún framework ahorra. */
export function grafoDelArticulo(origen) {
```

### Astro · etiquetas, y nada más

[`astro/src/components/Cabeza.astro`](implementaciones/astro/src/components/Cabeza.astro):

```astro
// Astro no tiene API de metadatos: tiene componentes, y las etiquetas de la
// cabecera son etiquetas como cualquier otra. Esto es a la vez su virtud y su
// límite. La virtud: no hay nada que aprender, se escribe HTML. El límite: nada
// impide que dos componentes escriban el mismo `<title>` dos veces, porque no
// hay quien lo mire.
```

Y el detalle del JSON-LD, que reaparece en los cinco —
[`hola-mundo.astro`](implementaciones/astro/src/pages/articulo/hola-mundo.astro):

```astro
      `set:html` escribe el contenido sin escapar, que es lo que hace falta aquí:
      un JSON escapado dentro de un `<script>` no lo lee nadie. Es la misma
      capacidad que en React se llama `dangerouslySetInnerHTML` y en Svelte
      `{@html}`, con tres nombres y un solo peligro — la clase 077.
```

### Next.js · un objeto que el framework convierte en etiquetas

[`nextjs/app/page.js`](implementaciones/nextjs/app/page.js):

```javascript
 * No se escriben etiquetas: se devuelve un objeto, y Next lo convierte en
 * etiquetas. La diferencia con escribirlas a mano se nota en tres sitios:
 *
 *   - **No hay duplicados posibles.** Si una disposición y una página declaran
 *     título, el de la página gana; con etiquetas sueltas, saldrían las dos.
 *   - **Se puede heredar y completar.** Una disposición pone lo común y cada
 *     página sobrescribe lo suyo.
 *   - **Es asíncrona.** Puede consultar la base de datos para saber el título.
```

Y su límite, en el artículo —
[`articulo/hola-mundo/page.js`](implementaciones/nextjs/app/articulo/hola-mundo/page.js):

```javascript
        El grafo de schema.org no cabe en el objeto de `generateMetadata`, así
        que se escribe como una etiqueta más. Es el recordatorio de que una API
        dedicada cubre lo previsto, y lo no previsto vuelve al método manual.
```

### SvelteKit · etiquetas, pero dentro de un elemento que el framework mira

[`sveltekit/src/lib/Cabeza.svelte`](implementaciones/sveltekit/src/lib/Cabeza.svelte):

```svelte
  // Se escriben etiquetas, como en Astro, pero dentro de un elemento especial que
  // el framework reconoce: SvelteKit las recoge de todos los componentes del
  // árbol y las pone en la cabecera del documento.
```

```svelte
  // Con una consecuencia práctica que la sintaxis no deja ver: si dos
  // componentes ponen `<title>`, el que gana es el del último renderizado. No es
  // una API que resuelva conflictos como la de Next, pero tampoco es el «cada
  // uno escribe lo que quiera» de Astro.
```

**Y el fallo que esta clase encontró de verdad**, ahora contado en el archivo
donde estaba — [`src/app.html`](implementaciones/sveltekit/src/app.html):

```html
      La plantilla del documento es el sitio donde más veces se ha escrito un
      título por omisión, y donde más caro sale: `%sveltekit.head%` inserta el
      que declare la ruta DESPUÉS, así que el documento acaba con dos `<title>`.
      El navegador enseña el primero y los buscadores también.
```

```html
      Es el fallo de descubribilidad más silencioso que existe: la pantalla se ve
      perfecta, la ruta declara su título, y lo que se indexa es «Mi aplicación».
```

### Nuxt · la API que sabe cómo se llaman los metadatos

[`nuxt/pages/index.vue`](implementaciones/nuxt/pages/index.vue):

```vue
// No recibe etiquetas ni un objeto genérico: recibe **los nombres de los
// metadatos que existen**, con tipos. `ogTitle`, `ogType`, `twitterCard`,
// `articlePublishedTime`. Escribir mal uno es un error de compilación en lugar
// de una etiqueta que nadie lee.
//
// Es la diferencia entre una API que sabe de qué va el problema y una que solo
// mueve cadenas de un sitio a otro.
```

Y la misma excepción de siempre —
[`articulo/hola-mundo.vue`](implementaciones/nuxt/pages/articulo/hola-mundo.vue):

```vue
// El grafo sí es una etiqueta suelta, también aquí: ninguna de las cinco APIs
// dedicadas lo cubre, porque schema.org es un vocabulario abierto y no cabe en
// una lista de nombres.
```

Y una decisión declarada en la configuración —
[`nuxt.config.ts`](implementaciones/nuxt/nuxt.config.ts):

```typescript
 * Nuxt permite poner un título global aquí, en `app.head`. No se usa: un título
 * por omisión escrito en la configuración es la forma más habitual de acabar
 * indexando «Nuxt App» en media aplicación, porque no falla nada cuando una ruta
 * se olvida de poner el suyo.
```

### Remix · una lista de descriptores, y el hueco a la vista

[`remix/app/routes/_index.jsx`](implementaciones/remix/app/routes/_index.jsx):

```jsx
 * Cada elemento es un objeto y Remix decide qué etiqueta le corresponde: `title`
 * se convierte en `<title>`, `name` en `<meta name>`, `property` en
 * `<meta property>`, `tagName: "link"` en `<link>`. Es un punto intermedio entre
 * el objeto cerrado de Next y las etiquetas sueltas de Astro.
```

```jsx
 * Y recibe `data`, que es lo que devolvió el `loader`: el título puede depender
 * del dato que se cargó, sin volver a pedirlo.
```

Y dónde se colocan, escrito a mano —
[`app/root.jsx`](implementaciones/remix/app/root.jsx):

```jsx
 * Que haya que escribirlo a mano en el documento raíz es coherente con el resto
 * del framework: aquí no hay un documento mágico, hay un componente que devuelve
 * HTML y dos huecos con nombre. Se ve dónde va todo.
```

## 🔬 Comparación

| | Cómo se declara | ¿API dedicada? | ¿Evita duplicados? | ¿Recibe los datos cargados? |
| --- | --- | :---: | :---: | :---: |
| **Astro** | etiquetas en un componente | ❌ | ❌ | sí, son variables del frontmatter |
| **SvelteKit** | etiquetas dentro de `<svelte:head>` | ❌ | ❌ gana la última | sí, por propiedades |
| **Next.js** | objeto devuelto por `generateMetadata` | ✅ | ✅ | sí, y puede ser `async` |
| **Nuxt** | `useSeoMeta` con nombres tipados | ✅ | ✅ | sí, en el `setup` |
| **Remix** | lista de descriptores en `meta` | ✅ | ✅ | ✅ recibe `data` del `loader` |

Cuatro lecturas:

- **Los cinco emiten los metadatos en el servidor, y eso ya no es noticia.** Lo
  era hace cinco años, cuando media web servía un `<div id="root">` vacío y las
  redes sociales enseñaban el título de la plantilla. Que los cinco lo resuelvan
  es el argumento entero de la parte 7.
- **La diferencia entre escribir etiquetas y llamar a una API es qué pasa cuando
  dos sitios declaran lo mismo.** Con etiquetas, salen las dos y el navegador
  elige; con una API, hay una regla. En una aplicación de tres rutas da igual; en
  una con veinte y tres niveles de disposiciones, no.
- **Nuxt es el único con nombres tipados**, y es una diferencia mayor de lo que
  parece: `ogTitle` mal escrito es un error de compilación, mientras que
  `<meta property="og:titel">` es una etiqueta perfectamente válida que no lee
  nadie.
- **Los cinco dejan fuera schema.org**, y no por descuido: es un vocabulario
  abierto con miles de tipos y no cabe en una lista de nombres. En los cinco se
  acaba escribiendo un `<script>` con JSON dentro, con la función de escribir sin
  escapar que cada uno llama de otra manera.

## ⚠️ Errores frecuentes

- **Un título por omisión en la plantilla del documento.** Es el fallo de esta
  clase, y es silencioso: el navegador enseña el primero de los dos `<title>` y
  los buscadores también. La pantalla se ve perfecta.
- **Poner los metadatos desde el navegador.** Funciona para la pestaña y no
  funciona para nada más. Quien comparte el enlace no ejecuta tu JavaScript.
- **Olvidar el canónico con parámetros de consulta.** `?utm_source=…` crea una
  URL distinta para el mismo contenido. Sin canónico, se indexa cada variante.
- **Escapar el JSON-LD.** Un grafo con `&quot;` dentro no lo lee ningún
  buscador. Hay que escribirlo sin escapar, con lo que eso implica —clase 077— si
  el contenido viene de fuera.
- **Repetir el título en `og:title` y confiar en que se hereda.** Algunas redes
  usan uno y otras el otro. Poner los dos cuesta una línea.

## ✅ Verificación

```bash
node scripts/run-class.mjs 101
```

Para hacerlo tú, la comprobación que encuentra el fallo de esta clase en
cualquier proyecto:

```bash
curl -s http://127.0.0.1:4100/articulo/hola-mundo | grep -c "<title>"
```

Si sale más de `1`, tienes dos títulos y el que se indexa no es el que crees.

## 🧪 Reto de transferencia

1. **Cuenta tus títulos.** Con el comando de arriba, en tres rutas distintas de
   tu aplicación. Es la prueba más barata de esta parte entera.
2. **Comparte un enlace tuyo.** Pégalo en una red social y mira la vista previa.
   Si sale el nombre del proyecto en lugar del de la página, los metadatos no
   están en el HTML.
3. **Busca tus rutas sin canónico.** Cualquiera que acepte parámetros de consulta
   los necesita, y son casi todas las que tienen filtros o paginación.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 077](../../parte-5-identidad-y-seguridad/077-politica-de-seguridad-de-contenido/README.md) — escribir sin escapar, y lo que cuesta
- [Clase 100](../100-html-en-flujo/README.md) — por qué el flujo también afecta a esto
- [Clase 102](../102-presupuesto-de-javascript/README.md) — poner un límite y hacerlo cumplir
- [Índice de la parte 7](../README.md)

## Fuentes

- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
- [@nuxt-docs] *Nuxt — Documentación oficial* — <https://nuxt.com/docs>
- [@remix-docs] *Remix — Documentación oficial* — <https://remix.run/docs>
- [@sveltekit-docs] *SvelteKit — Documentación oficial* — <https://svelte.dev/docs/kit>
- [@astro-docs] *Astro — Documentación oficial* — <https://docs.astro.build/>
- [@whatwg-html] *HTML Living Standard*. WHATWG — <https://html.spec.whatwg.org/>
