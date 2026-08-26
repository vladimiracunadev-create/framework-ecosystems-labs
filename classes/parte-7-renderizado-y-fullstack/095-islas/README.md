# Clase 095 — Islas

> [⬅️ Clase 094](../094-hidratacion/README.md) · [📚 Parte 7](../README.md) · [🎓 Clases](../../README.md) · [096 ➡️](../096-componentes-de-servidor/README.md)
>
> Parte **7 — Renderizado y full-stack** · Nivel **🔴 avanzado** · Pista **`fullstack`** (Renderizado y full-stack)
>
> ✅ **Clase construida** — 3 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

La clase 094 midió lo que cuesta hidratar una pantalla. Esta contesta la
pregunta obvia que sigue: **¿y si solo hidratamos el trozo que lo necesita?**

Eso es la arquitectura de islas. Y la clase la mide con dos páginas en lugar de
una, porque el número que importa no es lo que pesa una página con islas: es
**cuánto sube al añadirlas**.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Explicar la proporción** en la que se apoya el modelo, y comprobar si tu
  página cumple esa proporción.
- **Distinguir tres mecanismos** que producen un efecto parecido y no son lo
  mismo: islas, fronteras de cliente y componentes de servidor.
- **Saber dónde mirar** en cada framework para averiguar si un componente llega
  al navegador.
- **Leer una comparación de bytes** entendiendo por qué el mismo número
  significa cosas distintas según el punto de partida.

## 🧩 La situación

Una página de artículo. Cuatro párrafos de texto que no reaccionan a nada, un
botón de «me gusta» y un filtro sobre una lista de tres tareas.

Es a propósito la proporción de una página real: casi todo muerto, dos zonas
vivas. Y cada implementación sirve además **la misma página sin las dos zonas
vivas**, en `/sin-islas`, para poder restar.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /` | el artículo entero llega renderizado por el servidor |
| 2 | `GET /` | y las dos islas también, con `data-cuenta="0"` y la lista pintada |
| 3 | `GET /` | con el `<script` que las va a revivir |
| 4 | `GET /sin-islas` | el mismo artículo, sin ningún `data-isla=` |
| 5 | `GET /islas.json` | las dos islas declaradas y **`las_islas_cuestan: true`** |
| 6 | `GET /islas.json` | la medición es real: bytes y diferencia distintos de cero |

El caso 2 es el que separa las islas de la carga en el cliente: **las islas se
renderizan en el servidor igual que todo lo demás**. Que el botón diga `0` en el
HTML significa que no hay hueco vacío esperando a que llegue JavaScript.

Y el caso 5 dice algo que las presentaciones de islas suelen callar:

```json
        "json_contiene": {
          "islas": ["contador", "filtro"],
          "cuantas_islas": 2,
          "las_islas_cuestan": true
        }
```

**Las islas no son gratis.** Son más baratas que hidratarlo todo, que es otra
cosa.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Isla**](../../../glosario/README.md#isla) | Un trozo interactivo dentro de una página que por lo demás es HTML estático. Solo se hidrata la isla, así que el JavaScript que llega es proporcional a lo que de verdad se mueve. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Astro** | web-metaframework de JavaScript/TypeScript (TypeScript) | 2021 | MIT | proyecto independiente |
| **Next.js** | react-metaframework de JavaScript/TypeScript (TypeScript) | 2016 | MIT | Vercel |
| **Nuxt** | vue-metaframework de JavaScript/TypeScript (TypeScript) | 2016 | MIT | proyecto independiente |

### 🔧 Astro

Arquitectura de islas: por omisión no envía JavaScript y cada componente interactivo se declara explícitamente. Permite mezclar React, Vue y Svelte en la misma página, lo que lo hace un banco de pruebas ideal para comparar.

- **Documentación oficial:** <https://docs.astro.build/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `astro ^5.6.1, @astrojs/node ^9.1.3, @astrojs/preact ^4.0.11, preact ^10.26.4`
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
| `src/components/Articulo.astro` | archivo del proyecto |
| `src/components/Contador.jsx` | componente en JSX |
| `src/components/Filtro.jsx` | componente en JSX |

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
| `app/Articulo.jsx` | componente en JSX |
| `app/Contador.jsx` | componente en JSX |
| `app/Filtro.jsx` | componente en JSX |
| `app/datos.js` | código JavaScript |
| `app/islas.json/route.js` | código JavaScript |
| `app/layout.js` | código JavaScript |
| `app/medicion.js` | código JavaScript |
| `app/page.js` | código JavaScript |

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
| `components/Articulo.server.vue` | archivo del proyecto |
| `components/Contador.vue` | archivo del proyecto |
| `components/Filtro.vue` | archivo del proyecto |
| `datos.ts` | código TypeScript |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `medicion.js` | código JavaScript |
| `nuxt.config.ts` | código TypeScript |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

### El medidor, idéntico en las tres

[`astro/src/medicion.js`](implementaciones/astro/src/medicion.js) — y la razón
de que haga falta pedir dos páginas:

```javascript
 * Para saberlo hacen falta dos páginas y no una. `/` lleva el artículo y las dos
 * islas; `/sin-islas` lleva el mismo artículo y nada más. La diferencia entre las
 * dos es el precio de las islas, y ese número no se puede sacar mirando una sola
 * página.
```

La medición que más dice de las tres:

```javascript
/** Cuántas veces aparece una aguja dentro de los guiones en línea, no en el
 *  marcado. Es la diferencia entre «este texto se ve» y «este texto viaja». */
export function vecesDentroDeGuiones(html, aguja) {
```

Y la resta:

```javascript
  return {
    bytes_del_html: bytesConIslas,
    bytes_sin_islas: bytesSinIslas,
    las_islas_cuestan: bytesConIslas > bytesSinIslas,
    lo_que_cuestan_dos_islas: bytesConIslas - bytesSinIslas,
```

El contenido también es el mismo en las tres —
[`astro/src/datos.js`](implementaciones/astro/src/datos.js):

```javascript
 * Esa proporción es el argumento entero de la arquitectura de islas: en una
 * página normal, la mayor parte del marcado no necesita JavaScript, y hidratarla
 * toda es pagar por algo que nadie va a usar.
 */
export const ARTICULO = [
```

### Astro · el documento no es una aplicación

[`astro/src/pages/index.astro`](implementaciones/astro/src/pages/index.astro) —
dos directivas, dos islas:

```astro
    <Articulo />
    <Contador client:load />
    <Filtro client:load tareas={TAREAS} />
```

Y una escala de compromisos que los otros dos no tienen:

```astro
// `client:load` revive la isla en cuanto carga la página. Hay más: `client:idle`
// espera a que el navegador esté ocioso, `client:visible` espera a que la isla
// entre en pantalla, `client:media` la condiciona a una consulta de medios. Esa
// escala de compromisos no existe en los otros dos frameworks de la clase: allí
// la aplicación arranca entera y no hay grados.
```

**Por qué su página sin islas llega con cero `<script>`** —
[`Articulo.astro`](implementaciones/astro/src/components/Articulo.astro):

```astro
// Este componente no tiene forma de llegar al navegador: no hay directiva que
// se le pueda poner. Las plantillas `.astro` se ejecutan en el servidor y
// producen texto; no existe una versión suya en JavaScript de cliente.
```

Y la regla que hay que llevarse, en la segunda isla —
[`Filtro.jsx`](implementaciones/astro/src/components/Filtro.jsx):

```jsx
 * Recibe las tareas como propiedad, así que **las tareas sí viajan**: van
 * serializadas en el atributo `props` de su `<astro-island>`. El artículo no,
 * porque no es propiedad de ninguna isla.
```

Y la configuración, que no enciende nada —
[`astro.config.mjs`](implementaciones/astro/astro.config.mjs):

```javascript
 * Es una diferencia de fondo con los otros dos de esta clase: en Next y en Nuxt
 * hay una aplicación que se arranca y las islas son partes de ella; aquí no hay
 * aplicación, hay un documento con trozos vivos.
```

### Next.js · fronteras de cliente, que no es lo mismo

[`nextjs/app/Articulo.jsx`](implementaciones/nextjs/app/Articulo.jsx) — el
matiz que la medición hace visible:

```jsx
 * La diferencia está en lo que sí viaja: **su resultado**. Next manda la
 * descripción del árbol renderizado —la carga RSC— dentro del documento, y ahí
 * está el texto del artículo otra vez. `/islas.json` lo cuenta, y en Astro ese
 * mismo número sale cero.
```

Y una consecuencia práctica que se paga al leer código ajeno —
[`app/page.js`](implementaciones/nextjs/app/page.js):

```javascript
 * Fíjate en que aquí no hay ninguna directiva: la frontera está dentro de cada
 * componente, no en el sitio donde se usa. Es la decisión de diseño opuesta a la
 * de Astro, y tiene una consecuencia práctica: para saber si algo va al
 * navegador hay que abrir el archivo del componente, no la página.
```

Y por qué su suelo no baja de seis mil bytes —
[`app/sin-islas/page.js`](implementaciones/nextjs/app/sin-islas/page.js):

```javascript
 * Aun así llega con `<script>`: Next arranca su tiempo de ejecución en toda
 * página del App Router para poder navegar sin recargar. La diferencia con `/`
 * es real y se mide, pero no baja a cero como en Astro.
```

### Nuxt · la misma idea, del revés

[`nuxt/nuxt.config.ts`](implementaciones/nuxt/nuxt.config.ts) — y es la
explicación más útil de la clase:

```typescript
 * En Astro el documento es estático y las islas son los trozos vivos. En Nuxt la
 * aplicación está viva entera y una isla es un componente que se queda en el
 * servidor: un archivo `.server.vue`, cuyo HTML llega renderizado y cuyo código
 * no viaja.
```

```typescript
 * `componentIslands` sigue bajo `experimental`, y eso también es un dato de la
 * comparación: en Astro esto no es una opción, es el producto.
 */
export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  experimental: { componentIslands: true },
});
```

Con la declaración en el nombre del archivo —
[`components/Articulo.server.vue`](implementaciones/nuxt/components/Articulo.server.vue):

```vue
// El sufijo `.server` es toda la declaración. Este componente se renderiza en el
// servidor y su código no se incluye en el paquete del navegador.
```

Y el resumen de los tres, escrito en la página —
[`pages/index.vue`](implementaciones/nuxt/pages/index.vue):

```vue
// Aquí no hay directiva ninguna: la decisión está en el nombre del archivo del
// componente. Tres frameworks, tres sitios distintos donde mirar para saber qué
// llega al navegador: la etiqueta (Astro), la primera línea del componente
// (Next) y el nombre del archivo (Nuxt).
```

## 🔬 Comparación

Medido por el mismo archivo, en la misma máquina, en la misma ejecución:

| | `/` con islas | `/sin-islas` | **lo que cuestan las 2 islas** | guiones externos (con / sin) | en línea (con / sin) | el artículo dentro de un guion |
| --- | ---: | ---: | ---: | :---: | ---: | :---: |
| **Astro** | 5769 B | **1164 B** | **+4605 B** | 0 / 0 | 3592 / **0** | **0** |
| **Next.js** | 6727 B | 6599 B | **+128 B** | 6 / 5 | 4536 / 4725 | **1** |
| **Nuxt** | 2741 B | 2514 B | **+227 B** | 1 / 1 | 553 / 562 | 0 |

Y los tres mecanismos, que producen efectos parecidos y no son la misma cosa:

| | Qué es una isla aquí | Dónde se declara | ¿Hay grados? |
| --- | --- | --- | :---: |
| **Astro** | un componente de otro framework incrustado en un documento | en la etiqueta, al usarlo | ✅ cuatro |
| **Next.js** | una frontera dentro del árbol de componentes de servidor | en la primera línea del componente | ❌ |
| **Nuxt** | al revés: un componente que **no** viaja, con sufijo `.server` | en el nombre del archivo | ❌ |

Cinco lecturas, y ninguna es «Astro gana»:

- **La tabla dice dos cosas opuestas a la vez, y las dos son ciertas.** Astro
  tiene el suelo más bajo con diferencia —1164 bytes y cero guiones— y es el que
  **más caro cobra por añadir dos islas**: 4605 bytes contra 128 y 227. No es una
  contradicción: Astro parte de cero y factura el motor de Preact la primera vez;
  los otros dos ya lo tenían pagado.
- **Por eso el número que hay que mirar depende de tu página.** Con dos islas,
  Astro sale ganando por goleada (5769 contra 6727). Con veinte, la ventaja se
  invierte, porque el motor ya está pagado y lo que se suma es solo el
  componente.
- **La columna de la derecha es la diferencia de fondo.** En Astro el texto del
  artículo aparece **cero veces** dentro de un guion: no viaja de ninguna forma.
  En Next aparece una, dentro de la carga RSC. El código no viaja en ninguno de
  los dos; el contenido sí en uno.
- **El suelo de Next es su tiempo de ejecución.** 6599 bytes y cinco guiones
  externos en una página sin una sola línea interactiva. A cambio ofrece
  navegación sin recargar, que Astro no da sin añadir otra cosa. Es un
  intercambio, no un defecto.
- **Nuxt está en medio y va en dirección contraria.** Su suelo es bajo (2514 B)
  y sus islas son componentes que se quedan en el servidor, lo que resta desde
  una aplicación completa en lugar de sumar sobre un documento vacío. Y su
  mecanismo sigue marcado como experimental, mientras que en Astro es el
  producto.

## ⚠️ Errores frecuentes

- **Creer que una isla llega vacía.** No: se renderiza en el servidor como todo
  lo demás. El contrato lo comprueba con `data-cuenta="0"`. Una isla que llega
  vacía es carga en el cliente, que es la clase 093.
- **Comparar el peso total de dos frameworks distintos.** No dice nada: mide el
  suelo, no la arquitectura. Lo que hay que comparar es cuánto **sube** al añadir
  lo mismo.
- **Hacer islas de todo.** Si el ochenta por ciento de la página son islas, el
  modelo no aporta y sí quita: pierdes el estado compartido y ganas
  complicación. Esa es la señal de que lo que quieres es una aplicación.
- **Suponer que dos islas se hablan entre sí.** No lo hacen: cada una es una
  aplicación diminuta con su propio estado. Compartir algo entre islas pide un
  almacén aparte, y es el problema que la clase 141 aborda de frente.
- **Confundir «su código no viaja» con «no viaja».** El artículo de Next no manda
  su función al navegador y aun así su texto está dentro del documento dos veces.
  La clase 096 va exactamente a ese punto.

## ✅ Verificación

```bash
node scripts/run-class.mjs 095
```

Para verlo tú, con cualquiera arrancada, la comparación de una línea:

```bash
curl -s http://127.0.0.1:4100/sin-islas | grep -c "<script"
```

En Astro sale `0`. En los otros dos, no.

## 🧪 Reto de transferencia

1. **Calcula tu proporción.** En tu página más visitada, mide qué porcentaje del
   marcado necesita responder a algo. Si es menos de un tercio, este modelo
   tiene algo que ofrecerte.
2. **Encuentra tus islas.** Escribe la lista de zonas que de verdad necesitan
   JavaScript. Suele salir más corta de lo esperado: cabecera, buscador, y poco
   más.
3. **Mide el suelo de tu framework.** Sirve una página sin nada interactivo y
   pesa lo que llega. Ese número es el precio de entrada, y no baja por muy bien
   que escribas el resto.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 094](../094-hidratacion/README.md) — qué cuesta hidratar
- [Clase 096](../096-componentes-de-servidor/README.md) — no mandar el componente en absoluto
- [Clase 102](../102-presupuesto-de-javascript/README.md) — poner un límite y hacerlo cumplir
- [Clase 141](../../parte-11-legado-migracion-y-decision/141-dos-frameworks-conviviendo/README.md) — cuando las islas son de frameworks distintos
- [Índice de la parte 7](../README.md)

## Fuentes

- [@jasonformat-islands] Miller, Jason. *Islands Architecture*. 2020 — <https://jasonformat.com/islands-architecture/>
- [@astro-islands] *Islands Architecture*. Astro — <https://docs.astro.build/en/concepts/islands/>
- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
- [@patterns-dev] *Patterns.dev — Modern Web App Design Patterns* — <https://www.patterns.dev/>
- [@wagner-web-performance] Wagner, Jeremy. *Web Performance in Action*. Manning Publications, 2016. ISBN 9781617293771 — <https://openlibrary.org/isbn/9781617293771>
