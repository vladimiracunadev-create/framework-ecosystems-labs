# Clase 097 — Carga de datos junto a la ruta

> [⬅️ Clase 096](../096-componentes-de-servidor/README.md) · [📚 Parte 7](../README.md) · [🎓 Clases](../../README.md) · [098 ➡️](../098-acciones-de-formulario/README.md)
>
> Parte **7 — Renderizado y full-stack** · Nivel **🔴 avanzado** · Pista **`fullstack`** (Renderizado y full-stack)
>
> ✅ **Clase construida** — 5 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

En la clase 087 los datos se pedían desde el componente, con un efecto, después
de montarlo. El orden era: **monta, pinta vacío, pide, espera, vuelve a
pintar**. De ahí sale el estado de carga, el hueco que salta y la pantalla que
llega vacía.

Los cinco metaframeworks invierten ese orden: **pide, espera, monta, pinta
lleno**. Esta clase lo demuestra anotando el orden real, y luego mira lo que de
verdad separa a los cinco, que no es el orden sino **si el framework sabe que
eso era una carga de datos**.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Demostrar** el orden de carga y render en cualquier proyecto, con un
  cuaderno de tres líneas.
- **Distinguir** una función de carga con nombre conocido de un `await` dentro
  del componente, y decir qué puede hacer el framework con la primera y no con
  el segundo.
- **Dar un 404 de verdad** en los cinco, y explicar por qué un 200 con cara de
  error es un fallo y no un detalle.
- **Anticipar** qué se pierde en cada modelo cuando la aplicación crece.

## 🧩 La situación

Tres tareas, una lista y una pantalla de detalle. La fuente tarda diez
milisegundos a propósito: si cargar no costara nada, daría igual cuándo
empezara.

Y hay una tarea que no existe, la 999, porque **la mitad de esta clase es qué
pasa cuando el dato no está**.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /tareas` | la lista llega cargada, con las tres tareas en el HTML |
| 2 | `GET /tareas/2` | el parámetro llega a la carga: sale la 2 y **no** sale la 1 |
| 3 | `GET /tareas/999` | **404 de verdad**, no un 200 con cara de error |
| 4 | `GET /orden.json` | `["carga:inicio", "carga:fin", "render"]` |
| 5 | `GET /orden.json` | ocurre en el servidor, sin efecto en el cliente |
| 6 | `GET /orden.json` | cada uno declara dónde vive su carga y cómo da su 404 |

**El caso 4 es la clase**, y es una afirmación sobre el orden de dos cosas que no
se ve en el resultado: la lista sale igual de pintada se cargue cuando se
cargue. Así que se anota.

```json
        "json_contiene": {
          "secuencia": ["carga:inicio", "carga:fin", "render"],
          "la_carga_empieza_antes_del_render": true
        }
```

Y el caso 2 lleva un `cuerpo_no_contiene` que parece de más y no lo es: sin él,
una implementación que cargara la lista entera en la pantalla de detalle pasaría
igual.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Carga de datos junto a la ruta**](../../../glosario/README.md#carga-de-datos-junto-a-la-ruta) | Declarar qué datos necesita una pantalla **al lado de su ruta**, no dentro del componente. Permite que el framework los pida en paralelo antes de pintar, en lugar de descubrirlos uno a uno al renderizar. |

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
| `app/Lista.jsx` | componente en JSX |
| `app/Traza.jsx` | componente en JSX |
| `app/datos.js` | código JavaScript |
| `app/layout.js` | código JavaScript |
| `app/orden.json/route.js` | código JavaScript |
| `app/registro.js` | código JavaScript |
| `app/tareas/[id]/page.js` | código JavaScript |
| `app/tareas/page.js` | código JavaScript |

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
| `components/Lista.vue` | archivo del proyecto |
| `components/Traza.vue` | archivo del proyecto |
| `datos.ts` | código TypeScript |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `nuxt.config.ts` | código TypeScript |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pages/tareas/[id].vue` | archivo del proyecto |
| `pages/tareas/index.vue` | archivo del proyecto |

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
| `src/lib/Lista.svelte` | componente de Svelte |
| `src/lib/Traza.svelte` | componente de Svelte |
| `src/lib/datos.js` | código JavaScript |

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
| `app/Lista.jsx` | componente en JSX |
| `app/Traza.jsx` | componente en JSX |
| `app/datos.js` | código JavaScript |
| `app/registro.js` | código JavaScript |
| `app/root.jsx` | componente en JSX |
| `app/routes/orden[.]json.js` | código JavaScript |
| `app/routes/tareas.$id.jsx` | componente en JSX |
| `app/routes/tareas._index.jsx` | componente en JSX |

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
| `src/components/Lista.astro` | archivo del proyecto |
| `src/components/Traza.astro` | archivo del proyecto |
| `src/datos.js` | código JavaScript |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

### El cuaderno, idéntico en las cinco

[`astro/src/registro.js`](implementaciones/astro/src/registro.js) — y por qué
hace falta:

```javascript
 * La promesa que esta clase tiene que demostrar es esta: **la carga de datos
 * empieza antes de que el componente exista**. Es una afirmación sobre el orden
 * de dos cosas, y el orden no se ve en el resultado: la lista sale igual de
 * pintada se cargue cuando se cargue.
```

Con un detalle que costaría una tarde encontrar si se olvidara:

```javascript
/** La función de carga llama a esto al empezar. Sin reiniciar, el cuaderno
 *  arrastraría los eventos de la petición anterior y la secuencia crecería. */
export function reiniciar() {
```

Y la fuente, que tarda a propósito —
[`astro/src/datos.js`](implementaciones/astro/src/datos.js):

```javascript
 * Tarda diez milisegundos a propósito. Una fuente instantánea no serviría para
 * esta clase: si cargar no cuesta nada, da igual cuándo empiece.
 */
export const TAREAS = [
```

```javascript
/** Devuelve `null` si no existe. Quien llama decide qué hacer con eso, y ahí es
 *  donde los cinco frameworks se separan: cada uno tiene su forma de convertir
 *  un `null` en un 404 de verdad. */
export async function pedirUnaTarea(id) {
```

Y el truco que hace comparable la medición —
[`astro/src/components/Traza.astro`](implementaciones/astro/src/components/Traza.astro):

```astro
// Se pinta el último a propósito: para cuando le toca, la secuencia ya está
// completa. Es la forma de sacar el cuaderno de bitácora dentro del propio HTML,
// sin que haga falta que el endpoint comparta memoria con la página.
```

### Astro · no hay función de carga, y no hace falta

[`astro/src/pages/tareas/index.astro`](implementaciones/astro/src/pages/tareas/index.astro):

```astro
// El frontmatter de una página `.astro` se ejecuta entero en el servidor antes
// de que se pinte una sola etiqueta. Esto de aquí ES la carga: un `await` normal,
// arriba, sin nombre especial.
```

**Y aquí está lo que separa a los cinco**, dicho en el archivo más simple de
todos:

```astro
// A cambio, no hay nada que el framework pueda hacer con ella. En SvelteKit o
// Remix la función de carga tiene nombre y firma conocidos, y por eso el
// framework puede llamarla antes de navegar, en paralelo con la de la ruta
// padre, o volver a llamarla al invalidar. Aquí no: es código dentro de la
// página.
```

Su 404 — [`[id].astro`](implementaciones/astro/src/pages/tareas/[id].astro):

```astro
// El parámetro de la ruta llega en `Astro.params`, y la página decide qué hacer
// si no existe. Devolver una `Response` desde el frontmatter corta el
// renderizado y manda ese estado: es la forma que tiene Astro de dar un 404 de
// verdad en lugar de un 200 con cara de error.
```

### Next.js · un `await` dentro del componente

[`nextjs/app/tareas/page.js`](implementaciones/nextjs/app/tareas/page.js):

```javascript
 * No hay `loader`, no hay `load`, no hay `getServerSideProps`. La página es una
 * función `async` y espera. Es lo más parecido a Astro de los cinco, con una
 * diferencia grande: aquí cualquier componente del árbol puede hacer lo mismo
 * —clase 096—, no solo la página.
```

```javascript
 * Lo que se pierde a cambio es lo mismo que pierde Astro: el framework no sabe
 * que esto es una carga de datos. No puede llamarla antes de navegar ni
 * ejecutarla en paralelo con la de otra ruta, porque para él es código.
```

Y su 404, en [`tareas/[id]/page.js`](implementaciones/nextjs/app/tareas/[id]/page.js):

```javascript
 * Es un detalle que separa a los frameworks serios del resto: una pantalla de
 * error con estado 200 miente a los buscadores, a las cachés y a cualquiera que
 * llame a la ruta desde un programa.
```

### SvelteKit · la función que sí tiene nombre

[`sveltekit/src/routes/tareas/+page.server.js`](implementaciones/sveltekit/src/routes/tareas/+page.server.js)
— la lista de lo que se compra con la ceremonia:

```javascript
 * `load` no es código dentro de la página: es una función con nombre y firma que
 * el framework conoce. Y como la conoce, puede hacer cosas con ella que en Astro
 * y en Next no son posibles:
 *
 *   - llamarla al pasar el ratón por encima de un enlace, antes de navegar;
 *   - ejecutarla en paralelo con la `load` de la ruta padre, en lugar de en
 *     cadena;
 *   - volver a llamarla cuando algo la invalide, sin recargar la página.
```

Y su 404 — [`[id]/+page.server.js`](implementaciones/sveltekit/src/routes/tareas/[id]/+page.server.js):

```javascript
 * Y `error(404, …)` lanza. SvelteKit lo recoge, pinta su página de error y manda
 * un 404 de verdad. Es la misma idea que `notFound()` en Next y que devolver una
 * `Response` en Astro: tres formas de decir lo mismo.
```

### Nuxt · el punto intermedio, con una clave

[`nuxt/pages/tareas/index.vue`](implementaciones/nuxt/pages/tareas/index.vue):

```vue
// Es un punto intermedio entre los dos extremos de esta clase. Como en Astro y
// en Next, la carga está dentro de la página; pero a diferencia de ellos, el
// framework SÍ sabe que es una carga: le da una clave, la deduplica, guarda su
// resultado en la carga útil y la puede volver a ejecutar con `refresh()`.
```

Con el precio de esa clave, que conviene saber antes y no después:

```vue
// El precio de esa clave es que hay que inventarla y que sea única. Es la fuente
// de errores más común de esta parte de Nuxt: dos componentes con la misma clave
// comparten dato sin querer.
```

Y un detalle de su 404 que cuesta descubrir —
[`[id].vue`](implementaciones/nuxt/pages/tareas/[id].vue):

```vue
// `useRoute().params` trae el parámetro. Y `createError` con `fatal: true` es lo
// que convierte un dato que no existe en un 404 de verdad: sin `fatal`, Nuxt lo
// trataría como un error recuperable y respondería 200.
```

### Remix · el original

[`remix/app/routes/tareas._index.jsx`](implementaciones/remix/app/routes/tareas._index.jsx):

```jsx
 * Remix lo llevó a su conclusión: la ruta es la unidad, la ruta declara qué
 * datos necesita, y el framework se encarga de tenerlos antes de renderizar. Sin
 * estado de carga, sin efecto en el cliente, sin componente que se monte vacío.
```

Y su 404, que es el más corto de los cinco —
[`tareas.$id.jsx`](implementaciones/remix/app/routes/tareas.$id.jsx):

```jsx
 * Y el 404 se da lanzando una `Response` de la plataforma web, sin ninguna
 * función del framework de por medio. Es la postura de Remix llevada al detalle:
 * cuando el estándar ya tiene una forma de decir algo, se usa esa.
```

## 🔬 Comparación

| | Dónde vive la carga | ¿Tiene nombre que el framework conozca? | Cómo se da un 404 |
| --- | --- | :---: | --- |
| **Astro** | en el frontmatter de la página | ❌ | devolver una `Response` con estado 404 |
| **Next.js** | dentro del componente, con `await` | ❌ | `notFound()`, que lanza |
| **SvelteKit** | `load` en `+page.server.js` | ✅ | `error(404, …)`, que lanza |
| **Nuxt** | `useAsyncData` en el componente, con clave | ✅ | `createError({ statusCode: 404, fatal: true })` |
| **Remix** | `loader` en el archivo de la ruta | ✅ | lanzar una `Response` estándar |

Y la secuencia, que sale idéntica en los cinco:

```text
carga:inicio  →  carga:fin  →  render
```

Cuatro lecturas:

- **El orden lo consiguen los cinco, y ese es el punto de partida, no la
  conclusión.** Lo que separa a esta parte de la 6 es que aquí nadie monta un
  componente vacío. Ninguno de los cinco necesita un estado de carga para la
  primera pantalla.
- **La columna del medio es la que importa.** Astro y Next tienen la sintaxis más
  simple —un `await` y ya— y pagan por ella: para el framework eso es código
  cualquiera. Un `loader` con nombre se puede llamar antes de navegar, en
  paralelo con otro, o de nuevo tras un cambio. Un `await` dentro de una función
  no.
- **Nuxt encontró un punto intermedio y le costó una clave.** `useAsyncData` vive
  dentro del componente y aun así el framework lo conoce, porque se identifica
  con una cadena. Funciona, y trae su propio error clásico: dos claves iguales
  por accidente.
- **Los cinco 404 son cinco formas de decir lo mismo, y las cinco lanzan.** No es
  casualidad: para cortar el renderizado desde dentro de una función que iba a
  devolver datos, lanzar es la única salida limpia. Remix lanza el objeto de la
  plataforma; los demás, uno propio.

## ⚠️ Errores frecuentes

- **Devolver una pantalla de error con estado 200.** Es el fallo más caro de esta
  clase: los buscadores indexan la página de error, las cachés la guardan y
  cualquier programa que llame a esa ruta cree que todo fue bien.
- **Cargar en el componente por costumbre.** Si vienes de la parte 6, el reflejo
  es pedir los datos en un efecto. Aquí eso convierte una pantalla que llegaba
  llena en una que llega vacía.
- **Olvidar `fatal: true` en Nuxt.** Sin él, el error es recuperable y la
  respuesta sale con estado 200. El síntoma es que la pantalla se ve bien y el
  `curl` dice otra cosa.
- **Reutilizar una clave de `useAsyncData`.** Dos componentes con la misma clave
  comparten dato. No falla: devuelve el dato del otro, que es peor.
- **Creer que cargar junto a la ruta arregla la cascada.** No la arregla: la
  mueve al servidor. Si una carga espera a otra, sigue esperando. Esa es la
  clase 099.

## ✅ Verificación

```bash
node scripts/run-class.mjs 097
```

Para verlo tú, con cualquiera arrancada:

```bash
curl -s http://127.0.0.1:4100/orden.json
```

Y la comprobación que hay que llevarse a cualquier proyecto —el 404 de verdad:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:4100/tareas/999
```

## 🧪 Reto de transferencia

1. **Comprueba tus 404.** Pide una ruta con un identificador que no exista en tu
   aplicación y mira el código de estado, no la pantalla. Si sale 200, tienes un
   fallo que nadie ha visto porque en el navegador se ve bien.
2. **Pon el cuaderno.** Tres líneas —anotar al empezar la carga, al terminar y al
   renderizar— dicen si tu pantalla carga antes o después de montar. Es la
   diferencia entre la parte 6 y la 7.
3. **Busca tus cargas anónimas.** Cuenta cuántas de tus llamadas a datos el
   framework puede reconocer como tales. Las que no, no se pueden adelantar, ni
   paralelizar, ni invalidar.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 087](../../parte-6-la-interfaz/087-efectos-y-ciclo-de-vida/README.md) — el orden contrario, y por qué duele
- [Clase 096](../096-componentes-de-servidor/README.md) — quién puede pedir el dato
- [Clase 098](../098-acciones-de-formulario/README.md) — lo mismo, pero escribiendo
- [Clase 099](../099-la-cascada-de-peticiones/README.md) — cuando una carga espera a otra
- [Índice de la parte 7](../README.md)

## Fuentes

- [@remix-docs] *Remix — Documentación oficial* — <https://remix.run/docs>
- [@sveltekit-docs] *SvelteKit — Documentación oficial* — <https://svelte.dev/docs/kit>
- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
- [@nuxt-docs] *Nuxt — Documentación oficial* — <https://nuxt.com/docs>
- [@astro-docs] *Astro — Documentación oficial* — <https://docs.astro.build/>
- [@rfc9110] *RFC 9110 — HTTP Semantics*. IETF — <https://www.rfc-editor.org/rfc/rfc9110>
