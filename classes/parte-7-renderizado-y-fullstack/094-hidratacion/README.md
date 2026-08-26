# Clase 094 — Hidratación

> [⬅️ Clase 093](../093-las-cuatro-estrategias-de-renderizado/README.md) · [📚 Parte 7](../README.md) · [🎓 Clases](../../README.md) · [095 ➡️](../095-islas/README.md)
>
> Parte **7 — Renderizado y full-stack** · Nivel **🔴 avanzado** · Pista **`fullstack`** (Renderizado y full-stack)
>
> ✅ **Clase construida** — 5 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

La clase 093 dejó una pregunta abierta. Si el servidor ya mandó el HTML pintado,
**¿para qué hace falta después el JavaScript?**

La respuesta es la hidratación, y tiene un precio que casi nunca se enseña
porque no se ve: **el mismo dato viaja dos veces**. Una pintada, para que la
pantalla se vea. Y otra empaquetada, para que el navegador pueda repetir el
render del servidor y llegar exactamente al mismo sitio.

Esta clase lo mide. En las cinco. Con el mismo medidor.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Explicar los cuatro pasos** de la hidratación y decir qué está roto en cada
  uno si la pantalla no responde.
- **Encontrar el estado serializado** dentro del HTML de cualquier sitio, y
  reconocer de qué framework es por el nombre de la variable.
- **Medir** lo que cuesta hidratar una pantalla, sin abrir el navegador.
- **Localizar el interruptor** —si existe— con el que cada framework apaga la
  hidratación de una ruta.

## 🧩 La situación

Una lista de tres tareas y un botón que cuenta cuántas veces la has mirado.
Nada más.

El botón es el que crea toda la deuda: sin él, las cinco implementaciones
podrían mandar HTML y callarse. Con él, hay que revivir el componente en el
navegador, y para revivirlo hay que mandarle el estado con el que se renderizó.

Cada implementación sirve además la **misma lista sin el botón**, en `/inerte`,
para tener con qué comparar.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /` | la lista y el botón llegan **pintados**, con `data-cuenta="0"` |
| 2 | `GET /` | y con el `<script` que los va a revivir |
| 3 | `GET /inerte` | el mismo contenido, sin nada interactivo |
| 4 | `GET /coste.json` | **`el_dato_viaja_veces: 2`** |
| 5 | `GET /coste.json` | los cuatro pasos, en orden y los mismos en los cinco |
| 6 | `GET /coste.json` | hay estado serializado de verdad: bytes dentro de guiones en línea |

**El caso 4 es la clase.** Y no es una cifra escrita a mano: cada implementación
pide sus propias dos pantallas por HTTP y cuenta.

```json
        "json_contiene": {
          "hidrata": true,
          "el_dato_viaja_veces": 2,
          "el_dato_viaja_mas_de_una_vez": true,
          "se_paga_dos_veces": true
        }
```

El caso 6 usa `json_distinto`, que es la forma de exigir «esto existe y no está
vacío» cuando el valor concreto cambia entre frameworks: el mecanismo tiene
nombre distinto en cada uno y los bytes no son comparables uno a uno, pero
**ninguno de los cinco puede tener cero**.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Hidratación**](../../../glosario/README.md#hidratación) | Volver interactivo un HTML que ya llegó pintado, adjuntándole el JavaScript del componente. Es trabajo duplicado —el servidor pintó y el cliente vuelve a recorrer— y es lo que las islas y la resumibilidad intentan reducir. |

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
| `app/ListaViva.jsx` | componente en JSX |
| `app/coste.json/route.js` | código JavaScript |
| `app/datos.js` | código JavaScript |
| `app/inerte/page.js` | código JavaScript |
| `app/layout.js` | código JavaScript |
| `app/medicion.js` | código JavaScript |
| `app/page.js` | código JavaScript |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

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
| `medicion.js` | código JavaScript |
| `nuxt.config.ts` | código TypeScript |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pages/index.vue` | archivo del proyecto |
| `pages/inerte.vue` | archivo del proyecto |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |

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
| `src/datos.js` | código JavaScript |
| `src/medicion.js` | código JavaScript |
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
| `app/medicion.js` | código JavaScript |
| `app/root.jsx` | componente en JSX |
| `app/routes/_index.jsx` | componente en JSX |
| `app/routes/coste[.]json.js` | código JavaScript |
| `app/routes/inerte.jsx` | componente en JSX |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |

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
| `src/components/ListaViva.jsx` | componente en JSX |
| `src/datos.js` | código JavaScript |
| `src/medicion.js` | código JavaScript |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

### El medidor, idéntico en las cinco

Es la condición para que la tabla del final signifique algo. El archivo es el
mismo byte a byte en Astro, Next.js, Nuxt, SvelteKit y Remix —
[`astro/src/medicion.js`](implementaciones/astro/src/medicion.js):

```javascript
/** Cuenta las apariciones de una aguja en un texto. Sin expresiones regulares:
 *  la aguja es texto literal y no debe interpretarse. */
export function contarApariciones(texto, aguja) {
  let veces = 0;
  let desde = 0;
  for (;;) {
    const donde = texto.indexOf(aguja, desde);
    if (donde === -1) return veces;
    veces += 1;
    desde = donde + aguja.length;
  }
}
```

```javascript
/** Suma los bytes del contenido de los `<script>` SIN `src`: los que viajan
 *  dentro del propio HTML. Ahí es donde vive el estado serializado. */
export function bytesDeGuionesEnLinea(html) {
  let total = 0;
```

Y la medición en sí, que es **una petición HTTP real del servidor contra sí
mismo**:

```javascript
export async function medir(host, pedir = fetch) {
  const origen = `http://${host}`;
  const hidratada = await (await pedir(`${origen}/`)).text();
  const inerte = await (await pedir(`${origen}/inerte`)).text();
  const veces = contarApariciones(hidratada, AGUJA);
```

Con un detalle que costó encontrar y que vale para cualquier proyecto:

```javascript
 * Recibe el `Host` con el que llegó la petición en lugar de suponer un puerto,
 * y hay un motivo concreto: el adaptador de Node de Astro devuelve
 * `http://localhost` **sin puerto** en `Astro.url`, así que fiarse de lo que el
 * framework dice que es su propia dirección falla. El `Host` lo pone quien
 * pide, y siempre es correcto.
```

Y los cuatro pasos, que son los mismos en los cinco porque la hidratación es un
mecanismo y no una función de biblioteca:

```javascript
export const PASOS = [
  "el servidor ejecuta los componentes y devuelve HTML ya pintado",
  "el navegador lo muestra: la pantalla se ve, pero no responde",
  "el navegador descarga el código de esos mismos componentes",
  "el navegador los vuelve a ejecutar con el estado que venía en el HTML y ata los manejadores",
];
```

### Astro · una directiva, y nada más

[`astro/src/pages/index.astro`](implementaciones/astro/src/pages/index.astro) —
la línea que crea la deuda es una sola:

```astro
// `client:load` es la línea que crea la deuda. Sin ella, el componente se
// renderiza en el servidor y ahí se acaba: el HTML sería el mismo y el botón no
// haría nada. Con ella, Astro envuelve el resultado en un `<astro-island>`,
// mete las propiedades serializadas en un atributo y manda el código del
// componente al navegador para que lo reviva.
```

Y la isla, [`ListaViva.jsx`](implementaciones/astro/src/components/ListaViva.jsx),
donde se ve el trabajo repetido:

```jsx
 * Fíjate en `useState(0)`: el servidor la ejecuta y sale 0, el navegador la
 * ejecuta otra vez y vuelve a salir 0. El mismo trabajo, hecho dos veces. Es el
 * precio, y no hay forma de evitarlo mientras haya un componente que hidratar.
 */
export default function ListaViva({ tareas }) {
  const [miradas, setMiradas] = useState(0);
```

**Y la postura, en la configuración** —
[`astro.config.mjs`](implementaciones/astro/astro.config.mjs):

```javascript
 * Consecuencia directa: una página de Astro sin islas manda **cero** JavaScript
 * de componentes. En los otros cuatro hay que trabajar para conseguir eso.
```

### Next.js · la frontera está en la primera línea

[`nextjs/app/ListaViva.jsx`](implementaciones/nextjs/app/ListaViva.jsx) —
con la aclaración que más falta hace:

```jsx
 * `"use client"` no significa «esto se renderiza en el cliente»: este
 * componente SÍ se renderiza en el servidor, y por eso la lista llega pintada.
 * Significa «esto además viaja al navegador y se hidrata».
```

Y el peaje, en [`app/page.js`](implementaciones/nextjs/app/page.js):

```javascript
 * Ese es el peaje que el App Router cobra por cruzar la frontera. Todo lo que se
 * pasa de un componente de servidor a uno de cliente tiene que poder
 * serializarse, y todo lo que se serializa **se envía**. El dato que ya está
 * pintado en el `<ul>` viaja otra vez para que el navegador pueda repetir el
 * render y llegar al mismo sitio.
```

**Y el resultado más incómodo de la clase**, escrito en la propia
implementación — [`app/inerte/page.js`](implementaciones/nextjs/app/inerte/page.js):

```javascript
 * Aviso para no sacar la conclusión de más: **esto no significa que la página
 * llegue sin JavaScript**. Next envía de todas formas su tiempo de ejecución y
 * la descripción de la pantalla en su propio formato —lo que llama la carga
 * RSC—, y ahí el texto de las tareas vuelve a aparecer. `/coste.json` lo
 * cuenta, y el número es el mismo que en la pantalla hidratada.
```

Los números lo confirman abajo: **la pantalla sin hidratar de Next pesa más que
la hidratada**, y el dato aparece tres veces en lugar de dos.

### SvelteKit · el interruptor más explícito de los cinco

[`sveltekit/src/routes/inerte/+page.js`](implementaciones/sveltekit/src/routes/inerte/+page.js)
es un archivo de una línea útil:

```javascript
export const csr = false;
```

Con lo que esa línea significa dicho arriba:

```javascript
 * De los cinco frameworks de la clase, este es el interruptor más explícito:
 * una constante exportada, por ruta, con un nombre que dice lo que hace. En Next
 * hay que quitar `"use client"` de todo el árbol; en Astro hay que no poner
 * `client:*`; en Nuxt hay que tocar la tabla de reglas; en Remix no hay
 * interruptor.
```

Y el momento exacto en el que empieza el viaje doble —
[`+page.server.js`](implementaciones/sveltekit/src/routes/+page.server.js):

```javascript
 * Ese es el momento exacto en el que el dato empieza a viajar dos veces, y es
 * inevitable: si el navegador no recibiera el estado, tendría que volver a
 * pedirlo, y entonces la pantalla parpadearía.
 */
export function load() {
  return { tareas: TAREAS };
}
```

Con un matiz sobre Svelte que conviene no exagerar —
[`+page.svelte`](implementaciones/sveltekit/src/routes/+page.svelte):

```svelte
  // Svelte tiene aquí una ventaja de tamaño —el compilador no manda un motor de
  // árbol virtual al navegador— pero no de naturaleza: el componente se vuelve a
  // ejecutar igual.
```

### Nuxt · la puerta de entrada a la carga útil

[`nuxt/pages/index.vue`](implementaciones/nuxt/pages/index.vue) — y aquí está la
elección real, dicha sin adornos:

```vue
// Si en vez de esto se escribiera `const tareas = TAREAS`, la lista llegaría
// pintada igual y NO viajaría dos veces... hasta que algo la necesitara en el
// navegador. Entonces habría que volver a pedirla. Esa es la elección real:
// pagar bytes ahora o pagar una petición después.
const tareas = useState("tareas", () => TAREAS);
```

Y su interruptor, en la tabla de siempre —
[`nuxt.config.ts`](implementaciones/nuxt/nuxt.config.ts):

```typescript
  routeRules: {
    // Sin nada que hidratar: ni arranque de Vue, ni estado serializado.
    "/inerte": { experimentalNoScripts: true },
  },
```

```typescript
 * El nombre lleva «experimental» y conviene tomárselo en serio: es la forma
 * menos asentada de las cinco. SvelteKit tiene `csr = false` desde hace años y
 * Astro no necesita nada porque su valor por omisión ya es ese.
```

### Remix · el que no tiene interruptor

[`remix/app/root.jsx`](implementaciones/remix/app/root.jsx) — toda la
hidratación de la aplicación cabe en una etiqueta:

```jsx
 * Lo que Remix no ofrece es quitarla **para una ruta**: o está para todas o no
 * está para ninguna. Es el precio de no tener modos.
 */
export default function App() {
```

Y la distinción que su pantalla inerte enseña a medias, declarada en el archivo
— [`app/routes/inerte.jsx`](implementaciones/remix/app/routes/inerte.jsx):

```jsx
 * Pero la aplicación de Remix arranca igual, porque `<Scripts />` está en el
 * documento raíz y no distingue rutas. Es la diferencia entre **no serializar
 * estado** y **no hidratar**, y esta pantalla enseña la primera sin conseguir la
 * segunda.
```

## 🔬 Comparación

Los números salen de `/coste.json` de cada implementación, medidos por el mismo
archivo, en la misma máquina y en la misma ejecución:

| | `/` pesa | de eso, en línea | `/inerte` pesa | el dato en `/` | el dato en `/inerte` |
| --- | ---: | ---: | ---: | :---: | :---: |
| **Astro** | 4471 B | 3592 B | **277 B** | 2 | 1 |
| **Next.js** | 4441 B | 3266 B | **4854 B** | 2 | **3** |
| **SvelteKit** | 1562 B | 562 B | 883 B | 2 | 1 |
| **Nuxt** | 1469 B | 417 B | 398 B | 2 | 1 |
| **Remix** | 1837 B | 995 B | 1639 B | 2 | 1 |

Los bytes se mueven con cada versión de cada framework: lo que hay que leer no
son las cifras exactas sino las distancias entre ellas, y esas son estables.

Y dónde vive el estado en cada uno:

| | Dónde está el estado serializado | Cómo se apaga la hidratación |
| --- | --- | --- |
| **Astro** | atributo `props` de `<astro-island>` | no poner `client:*` — es lo que pasa por omisión |
| **Next.js** | `self.__next_f.push(...)`, la carga RSC | quitar `"use client"` de todo el árbol |
| **SvelteKit** | guion en línea con `__sveltekit_…` | `export const csr = false` en la ruta |
| **Nuxt** | `<script type="application/json" id="__NUXT_DATA__">` | `experimentalNoScripts` en la tabla de reglas |
| **Remix** | guion en línea con `window.__remixContext` | **no se puede**, salvo quitando `<Scripts />` del sitio entero |

Cinco lecturas:

- **El 2 sale en los cinco.** No es coincidencia ni mala implementación: es la
  definición de hidratar. Si el navegador va a repetir el render, necesita el
  mismo estado con el que se hizo la primera vez.
- **Astro tiene la mayor diferencia entre sus dos pantallas: 277 bytes contra
  4471, dieciséis veces.** Esa distancia es su producto entero, y la clase 095
  la explota: si hidratar cuesta eso, hidrata solo lo que lo necesite.
- **La pantalla sin hidratar de Next pesa MÁS que la hidratada, y el dato
  aparece tres veces.** Es el resultado más contraintuitivo de la clase y merece
  entenderse: la carga RSC describe el árbol que renderizó el servidor, y cuanto
  más árbol renderiza, más hay que describir. Quitar interactividad en el App
  Router no quita bytes.
- **Nuxt y SvelteKit se parecen mucho**, y no por casualidad: los dos serializan
  el resultado de una función de carga y los dos tienen un interruptor por ruta.
  La diferencia está en cuánto ha madurado cada uno.
- **Remix es el único sin salida intermedia.** O toda la aplicación se hidrata,
  o ninguna. Coherente con lo que ya se vio en la clase 093, y con un coste
  concreto: no hay forma de abaratar una pantalla suelta.

## ⚠️ Errores frecuentes

- **Creer que renderizar en el servidor ahorra JavaScript.** No ahorra nada por
  sí solo: lo *añade*, porque al código de los componentes hay que sumarle el
  estado serializado. Lo que ahorra es tiempo hasta que se ve algo.
- **Confundir «no interactivo» con «sin hidratar».** La pantalla inerte de Remix
  no serializa estado y aun así arranca la aplicación entera. La de Next pesa
  más que la interactiva. Ninguna de las dos deja de hidratar.
- **Pasar datos enormes a un componente de cliente.** En Next todo lo que cruza
  la frontera se serializa y se envía. Un listado de mil filas pasado como
  propiedad son mil filas en el HTML, además de las mil ya pintadas.
- **Suponer que el estado del servidor y el del navegador coinciden.** Si el
  componente usa la hora, un valor aleatorio o algo del navegador, el segundo
  render no da lo mismo que el primero. Eso es una discordancia de hidratación,
  y es la causa de la mitad de los avisos en consola de un proyecto nuevo.
- **Fiarse de la dirección que el framework dice tener.** El adaptador de Node de
  Astro devuelve `http://localhost` sin puerto. La cabecera `Host` la manda quien
  pide, y esa sí es correcta.

## ✅ Verificación

```bash
node scripts/run-class.mjs 094
```

Las cinco se construyen antes de responder, y cada una se pide a sí misma dos
veces para contar. Para verlo tú, con cualquiera arrancada:

```bash
curl -s http://127.0.0.1:4100/coste.json
```

Y para ver el estado serializado con tus propios ojos, que es lo que más
convence:

```bash
curl -s http://127.0.0.1:4100/ | grep -o "comprar pan"
```

Salen dos líneas. Una es la que ves en pantalla; la otra es la que el navegador
va a leer para reconstruirla.

## 🧪 Reto de transferencia

1. **Busca el estado serializado de un sitio real.** Abre el código fuente de
   cualquier página hecha con estos frameworks y busca `__NEXT_DATA__`,
   `__NUXT_DATA__`, `__remixContext` o `astro-island`. Vas a encontrar tus
   propios datos ahí dentro.
2. **Mide tu pantalla más pesada.** Cuenta cuántas veces aparece un dato que ya
   está pintado. Si aparece dos veces y no hay nada interactivo en esa zona, hay
   bytes que sobran.
3. **Apaga la hidratación de una ruta.** Con el interruptor de tu framework, si
   lo tiene. Comprueba qué se rompe: si no se rompe nada, esa ruta no
   necesitaba hidratarse.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 093](../093-las-cuatro-estrategias-de-renderizado/README.md) — dónde se genera el HTML
- [Clase 095](../095-islas/README.md) — hidratar solo lo que lo necesita
- [Clase 096](../096-componentes-de-servidor/README.md) — no mandar el componente en absoluto
- [Clase 102](../102-presupuesto-de-javascript/README.md) — poner un límite y hacerlo cumplir
- [Índice de la parte 7](../README.md)

## Fuentes

- [@astro-islands] *Islands Architecture*. Astro — <https://docs.astro.build/en/concepts/islands/>
- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
- [@patterns-dev] *Patterns.dev — Modern Web App Design Patterns* — <https://www.patterns.dev/>
- [@wagner-web-performance] Wagner, Jeremy. *Web Performance in Action*. Manning Publications, 2016. ISBN 9781617293771 — <https://openlibrary.org/isbn/9781617293771>
- [@osmani-js-design-patterns] Osmani, Addy. *Learning JavaScript Design Patterns*, 2.ª ed. O'Reilly Media, 2023. ISBN 9781098139872 — <https://openlibrary.org/isbn/9781098139872>
