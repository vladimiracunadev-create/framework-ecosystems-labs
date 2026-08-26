# Clase 093 — Las cuatro estrategias de renderizado

> [⬅️ Parte 6](../../parte-6-la-interfaz/README.md) · [📚 Parte 7](../README.md) · [🎓 Clases](../../README.md) · [094 ➡️](../094-hidratacion/README.md)
>
> Parte **7 — Renderizado y full-stack** · Nivel **🟡 intermedio** · Pista **`fullstack`** (Renderizado y full-stack)
>
> ✅ **Clase construida** — 5 implementaciones verificadas contra [`contrato.json`](contrato.json).

> 🏗️ **Primera clase con metaframeworks.** Next.js, Nuxt, SvelteKit, Remix y
> Astro se construyen de verdad —`build` y servidor de producción— antes de que
> el contrato les pregunte nada.

## 🎯 Objetivo

**¿Dónde se genera el HTML?** Hay cuatro respuestas, y la correcta cambia **por
pantalla**, no por proyecto.

Y una demostración que no se ve en ninguna comparativa: la diferencia entre
generar al construir y generar por petición **no se nota mirando una respuesta**.
Las dos traen el mismo contenido. Se nota pidiendo dos veces.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Nombrar las cuatro estrategias** con lo que gana y lo que paga cada una.
- **Demostrar** cuál está usando una pantalla, sin acceso al código.
- **Elegir** la estrategia de una pantalla concreta a partir de sus datos y su
  público.
- **Reconocer** dónde declara cada metaframework esa decisión, y qué cuesta que
  esté ahí.

## 🧩 La situación

Una lista de tres tareas. La misma en las tres pantallas — a propósito: si el
contenido cambiara, la comparación mediría el contenido en lugar de la
estrategia.

Lo único que las distingue es **cuándo se generó el HTML que las contiene**. Y
eso no se ve: hay que provocarlo.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /estatico` | el contenido y su sello — **y guarda el sello** |
| 2 | `GET /estatico` otra vez | **el sello es el mismo**: se generó una vez |
| 3 | `GET /servidor` | el mismo contenido — y guarda su sello |
| 4 | `GET /servidor` otra vez | **el sello cambió**: se genera en cada petición |
| 5 | `GET /cliente` | el HTML llega **sin** el contenido |
| 6 | `GET /estrategias.json` | las cuatro, con sus compromisos |

**Los casos 2 y 4 son la clase entera**, y son la razón de que este contrato use
una capacidad que casi ninguna otra clase necesita: capturar un valor de una
respuesta con `guardar_cuerpo` y compararlo contra la siguiente.

```json
      "guardar_cuerpo": { "selloEstatico": { "patron": "data-sello=\"([^\"]+)\"" } }
```

Con una sola petición, las dos pantallas son indistinguibles. Con dos, la
diferencia es evidente y no admite discusión.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Renderizado en el servidor**](../../../glosario/README.md#renderizado-en-el-servidor) *(SSR)* | Generar el HTML en el servidor en cada petición. La página se ve antes y el servidor trabaja más; el JavaScript llega después para darle vida. |
| [**Generación estática**](../../../glosario/README.md#generación-estática) *(SSG)* | Generar el HTML una vez, al construir, y servirlo como archivo. Lo más rápido y lo más barato, y solo vale si el contenido no depende de quién mira. |

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
| `.next/BUILD_ID` | archivo del proyecto |
| `.next/app-build-manifest.json` | datos en JSON usados por la implementación |
| `.next/app-path-routes-manifest.json` | datos en JSON usados por la implementación |
| `.next/build-manifest.json` | datos en JSON usados por la implementación |
| `.next/diagnostics/build-diagnostics.json` | datos en JSON usados por la implementación |
| `.next/diagnostics/framework.json` | datos en JSON usados por la implementación |
| `.next/export-marker.json` | datos en JSON usados por la implementación |
| `.next/images-manifest.json` | datos en JSON usados por la implementación |

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
| `.nuxt/app.config.mjs` | código JavaScript (módulo ES) |
| `.nuxt/components.d.ts` | código TypeScript |
| `.nuxt/imports.d.ts` | código TypeScript |
| `.nuxt/manifest/latest.json` | datos en JSON usados por la implementación |
| `.nuxt/manifest/meta/fd2a2134-ef9a-4877-a459-e0f3990c9c75.json` | datos en JSON usados por la implementación |
| `.nuxt/nuxt.d.ts` | código TypeScript |
| `.nuxt/prerender/chunks/_/error-500.mjs` | código JavaScript (módulo ES) |
| `.nuxt/prerender/chunks/_/error-500.mjs.map` | archivo del proyecto |

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
| `.svelte-kit/adapter-node/entries/chunks/vendor.js` | código JavaScript |
| `.svelte-kit/adapter-node/entries/env.js` | código JavaScript |
| `.svelte-kit/adapter-node/entries/handler.js` | código JavaScript |
| `.svelte-kit/adapter-node/entries/index.js` | código JavaScript |
| `.svelte-kit/adapter-node/entries/shims.js` | código JavaScript |
| `.svelte-kit/adapter-node/entries/utils.js` | código JavaScript |
| `.svelte-kit/ambient.d.ts` | código TypeScript |
| `.svelte-kit/env.d.ts` | código TypeScript |

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
| `app/routes/cliente.jsx` | componente en JSX |
| `app/routes/estatico.jsx` | componente en JSX |
| `app/routes/estrategias[.]json.js` | código JavaScript |
| `app/routes/servidor.jsx` | componente en JSX |
| `app/routes/tareas[.]json.js` | código JavaScript |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

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
| `.astro/content-assets.mjs` | código JavaScript (módulo ES) |
| `.astro/content-modules.mjs` | código JavaScript (módulo ES) |
| `.astro/content.d.ts` | código TypeScript |
| `.astro/types.d.ts` | código TypeScript |
| `astro.config.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las cinco comparten el mismo contenido y el mismo sello —
[`astro/src/datos.mjs`](implementaciones/astro/src/datos.mjs):

```javascript
 * En la estática se calcula una vez, al construir, y queda escrito en el archivo
 * para siempre. En la de servidor se calcula en cada petición. El contrato pide
 * cada pantalla dos veces y compara: mismo sello significa generada al
 * construir; sello distinto, generada ahora.
 *
 * Es la única forma de demostrar la diferencia, porque el contenido de las dos
 * respuestas es idéntico.
```

### Astro · [`astro/src/pages/estatico.astro`](implementaciones/astro/src/pages/estatico.astro)

**La decisión, una línea por página:**

```astro
export const prerender = true;
```

```astro
// Esta línea significa: genera el HTML AL CONSTRUIR y sírvelo como un archivo.
// El servidor no ejecuta nada — solo entrega bytes.
```

Y la de al lado — [`servidor.astro`](implementaciones/astro/src/pages/servidor.astro):

```astro
// `prerender = false` saca esta página del lote estático y la pone en el
// servidor: su HTML se genera EN CADA PETICIÓN.
//
// Una línea, una página. Esa granularidad es la respuesta de Astro a la pregunta
// de esta parte: la estrategia no se elige por proyecto, se elige por pantalla.
```

**Y una postura que se declara en la configuración** —
[`astro.config.mjs`](implementaciones/astro/astro.config.mjs):

```javascript
 * `output: "static"` es el valor por omisión de Astro, y es una postura: **por
 * omisión no hay servidor**. Las páginas se generan al construir y se sirven
 * como archivos.
```

### Next.js · [`nextjs/app/servidor/page.js`](implementaciones/nextjs/app/servidor/page.js)

```javascript
export const dynamic = "force-dynamic";
```

Con un aviso que conviene tener presente al auditar un proyecto ajeno:

```javascript
 * En Next hay además una vía indirecta que sorprende a mucha gente: usar una
 * función que lee la petición —cookies, cabeceras— **convierte la ruta en
 * dinámica sola**, sin declararlo. Es cómodo y hace difícil saber qué estrategia
 * tiene cada pantalla sin construir el proyecto.
```

**Y la frontera más explícita del elenco** —
[`nextjs/app/cliente/page.js`](implementaciones/nextjs/app/cliente/page.js):

```javascript
 * Esa directiva en la primera línea marca dónde acaba el servidor y empieza el
 * navegador. Todo lo que se importe desde aquí hacia abajo **viaja al cliente**.
```

La salida de `next build` lo dice con símbolos: `○ (Static)` para cuatro rutas y
`ƒ (Dynamic)` para `/servidor`. **El propio constructor publica la estrategia de
cada pantalla**, que es lo que a los otros cuatro les cuesta más enseñar.

### SvelteKit · [`sveltekit/src/routes/estatico/+page.server.js`](implementaciones/sveltekit/src/routes/estatico/+page.server.js)

```javascript
 * SvelteKit la ejecuta AL CONSTRUIR, guarda el HTML resultante y en producción
 * lo sirve como un archivo. `load` no se vuelve a ejecutar nunca.
```

Y el componente, que es **el mismo para las dos estrategias** —
[`+page.svelte`](implementaciones/sveltekit/src/routes/estatico/+page.svelte):

```svelte
  // Recibe los datos por `data`, venga de donde venga. No sabe si su `load`
  // corrió al construir o hace un milisegundo — y esa ignorancia es lo que
  // permite cambiar de estrategia sin tocar la interfaz.
```

**Esa es la propiedad que hace útil todo esto:** cambiar de estrategia no
significa reescribir la pantalla.

Con una decisión de arquitectura escondida en una línea —
[`svelte.config.js`](implementaciones/sveltekit/svelte.config.js):

```javascript
 * SvelteKit no supone un destino: `adapter-node` produce un servidor de Node,
 * `adapter-static` produce archivos, y hay adaptadores para las plataformas de
 * despliegue. El mismo código fuente sale de una forma o de otra según cuál se
 * ponga aquí.
```

### Nuxt · [`nuxt/nuxt.config.ts`](implementaciones/nuxt/nuxt.config.ts) — todo en una tabla

```typescript
 * Nuxt es el único de los cinco que reúne las decisiones de renderizado **en un
 * solo sitio**: `routeRules` es un mapa de patrón de ruta a estrategia.
 *
 * Tiene una ventaja concreta sobre escribirlo en cada página: se puede leer la
 * arquitectura de la aplicación entera de un vistazo, sin abrir veinte archivos.
 * Y una desventaja simétrica: la decisión queda lejos de la pantalla a la que
 * afecta, así que es fácil que se desincronicen.
```

```typescript
  routeRules: {
    "/estatico": { prerender: true },
    "/cliente": { prerender: true },
    "/tareas.json": { prerender: true },
    "/estrategias.json": { prerender: true },
```

Y el efecto en la página, dicho sin adornos —
[`nuxt/pages/estatico.vue`](implementaciones/nuxt/pages/estatico.vue):

```vue
// Nuxt la ejecuta al construir y guarda el HTML. En el archivo no hay ninguna
// marca de que sea estática — hay que ir a la tabla. Ese es el precio de tener
// las decisiones juntas.
```

### Remix · [`remix/app/routes/estatico.jsx`](implementaciones/remix/app/routes/estatico.jsx) — el que dice que no

**Es el único de los cinco sin modo estático**, y no por falta de tiempo —
[`remix/vite.config.js`](implementaciones/remix/vite.config.js):

```javascript
 * No es una carencia por hacer. Su argumento es que lo estático es un caso
 * particular de lo dinámico con una caché delante, y que esa caché la resuelve
 * mejor una red de distribución con cabeceras HTTP —`Cache-Control`— que el
 * framework con un modo aparte.
```

Y la implementación **declara exactamente lo que hace y lo que no**:

```javascript
 * Pero no es lo mismo, y la diferencia importa: aquí el servidor SÍ trabaja en
 * cada petición —renderiza el componente— y lo único constante es el dato. En
 * los otros cuatro, el servidor no ejecuta nada porque el HTML ya existe.
```

```javascript
export function headers() {
  // La cabecera que en un despliegue real haría el trabajo de lo estático.
  return { "Cache-Control": "public, max-age=3600" };
}
```

Y la postura se nota también en lo que cuesta cada camino —
[`remix/app/routes/cliente.jsx`](implementaciones/remix/app/routes/cliente.jsx):

```javascript
 * Es la manera más clara de ver la postura del framework: **el camino cómodo es
 * el del servidor**, y hacerlo en el cliente cuesta más código, no menos.
```

## 🔬 Comparación

| | Dónde se declara | Por omisión | ¿Tiene modo estático? |
| --- | --- | --- | :---: |
| **Astro** | `export const prerender` en la página | **estático** | ✅ |
| **Next.js** | `export const dynamic` en la ruta | estático | ✅ |
| **SvelteKit** | `export const prerender` en `+page.server.js` | servidor | ✅ |
| **Nuxt** | `routeRules`, una tabla central | servidor | ✅ |
| **Remix** | no se declara | servidor | ❌ **por decisión** |

Cuatro lecturas:

- **Cuatro de los cinco eligen por pantalla, y ninguno igual.** Tres lo escriben
  al lado de la pantalla, Nuxt en una tabla central. Las dos formas tienen la
  misma ventaja y el mismo defecto, invertidos: cercanía frente a visión de
  conjunto.
- **El valor por omisión dice mucho del framework.** Astro y Next empiezan
  estáticos —son herederos de la web de documentos—; SvelteKit, Nuxt y Remix
  empiezan en el servidor —son herederos de la aplicación—.
- **Remix es el más interesante precisamente por lo que le falta.** Su argumento
  —lo estático es una caché, y la caché es de HTTP— es defendible y coherente
  con la parte 1 de este programa.
- **Next es el único cuyo constructor publica la estrategia de cada ruta.** `○` y
  `ƒ` en la salida de `next build` es una herramienta de auditoría que los otros
  cuatro no dan tan fácil.

## ⚠️ Errores frecuentes

- **Elegir una estrategia para todo el proyecto.** Es la que esta parte viene a
  desmontar, y la clase 104 la remata: catálogo estático, panel en servidor,
  editor en cliente — en la misma aplicación.
- **Creer que estático significa «sin datos».** Significa «con los datos de
  cuando se construyó». Un catálogo de diez mil productos puede ser estático.
- **Poner en el cliente lo que podría venir del servidor.** La pantalla de
  cliente de esta clase llega vacía. Con datos que el servidor tiene, eso es
  regalar el primer pintado.
- **No saber qué estrategia tiene cada pantalla.** En Next, leer una cookie
  convierte la ruta en dinámica sin avisar. Construir el proyecto y mirar la
  salida es la única forma de estar seguro.
- **Confundir un módulo evaluado una vez con prerenderizado.** Es exactamente lo
  que la implementación de Remix declara: el sello no cambia y aun así el
  servidor trabaja en cada petición.

## ✅ Verificación

```bash
node scripts/run-class.mjs 093
```

Las cinco se instalan y se construyen antes de responder. Es la clase más lenta
del programa hasta aquí, y esa lentitud **es parte de lo que se aprende**: un
metaframework tiene un paso de construcción, y ese paso es lo que permite que
haya páginas generadas antes de la primera visita.

Para verlo tú:

```bash
curl -s http://127.0.0.1:4100/estatico | grep -o 'data-sello="[^"]*"'
```

Ejecútalo dos veces contra `/estatico` y dos contra `/servidor`.

## 🧪 Reto de transferencia

1. **Averigua la estrategia de tu pantalla más visitada.** Pídela dos veces y
   compara algo que cambie —una fecha, un identificador—. Si no cambia, es
   estática.
2. **Busca una pantalla estática que no debería serlo**, o al revés. El síntoma
   de la primera es contenido viejo; el de la segunda, un servidor trabajando
   para devolver siempre lo mismo.
3. **Construye la implementación de Next** y lee la tabla de la salida. Los
   símbolos `○` y `ƒ` son el mapa de estrategias de la aplicación entera.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 087](../../parte-6-la-interfaz/087-efectos-y-ciclo-de-vida/README.md) — por qué la pantalla de cliente llega vacía
- [Clase 089](../../parte-6-la-interfaz/089-estado-del-servidor-en-el-cliente/README.md) — el problema que el servidor evita
- [Clase 104](../104-elegir-estrategia-por-pantalla/README.md) — tres pantallas, tres estrategias
- [Índice de la parte 7](../README.md)

## Fuentes

- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
- [@astro-islands] *Islands Architecture*. Astro — <https://docs.astro.build/en/concepts/islands/>
- [@patterns-dev] *Patterns.dev — Modern Web App Design Patterns* — <https://www.patterns.dev/>
- [@riva-nextjs] Riva, Michele. *Real-World Next.js*. Packt Publishing, 2022. ISBN 9781801073493 — <https://openlibrary.org/isbn/9781801073493>
- [@wagner-web-performance] Wagner, Jeremy. *Web Performance in Action*. Manning Publications, 2016. ISBN 9781617293771 — <https://openlibrary.org/isbn/9781617293771>
