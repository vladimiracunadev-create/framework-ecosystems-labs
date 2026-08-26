# Clase 099 — La cascada de peticiones

> [⬅️ Clase 098](../098-acciones-de-formulario/README.md) · [📚 Parte 7](../README.md) · [🎓 Clases](../../README.md) · [100 ➡️](../100-html-en-flujo/README.md)
>
> Parte **7 — Renderizado y full-stack** · Nivel **🔴 avanzado** · Pista **`fullstack`** (Renderizado y full-stack)
>
> ✅ **Clase construida** — 5 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Tres datos que no se necesitan entre sí, pedidos uno detrás de otro. La pantalla
sale idéntica y tarda el triple.

Esta clase enseña a **verlo**, que es lo difícil, porque una cascada no deja
rastro en el resultado. Y luego separa las dos que existen: la que se arregla
con dos líneas y la que pide rediseñar la fuente.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Detectar** una cascada accidental cronometrando, sin leer el código.
- **Distinguir** una cascada accidental de una necesaria, y saber que la segunda
  no se arregla con `Promise.all`.
- **Saber si tu framework encadena las cargas anidadas**, en lugar de suponerlo.
- **Desconfiar de un modelo mental convincente** cuando hay un cronómetro a mano.

## 🧩 La situación

Un panel con tres cosas: quién eres, cuántos pedidos tienes y qué avisos hay.
Ninguna de las tres necesita a las otras. Cada una tarda sesenta milisegundos.

Y una cuarta pantalla, `/anidada/detalle`, con **dos cargas en dos niveles**: un
marco que carga el usuario y un contenido que carga los pedidos. Ahí es donde los
cinco frameworks dejan de parecerse.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /cascada` | los tres datos están |
| 2 | `GET /paralelo` | **exactamente los mismos**: la diferencia no se ve |
| 3 | `GET /anidada/detalle` | las dos capas, cada una con su carga |
| 4 | `GET /cascada.json` | **la cascada tarda al menos el doble** |
| 5 | `GET /cascada.json` | los tres cronómetros marcaron algo |
| 6 | `GET /cascada.json` | cada uno dice si sus cargas anidadas van a la vez, y por qué |

**El caso 2 es la trampa que la clase quiere enseñar.** Las dos pantallas traen
lo mismo, palabra por palabra. Ninguna prueba de contenido puede distinguirlas.

Y el caso 5 está por lo mismo que en la clase 096: un cero es fácil de conseguir
no midiendo. `json_distinto` exige que los tres cronómetros hayan marcado algo.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Cascada de peticiones**](../../../glosario/README.md#cascada-de-peticiones) | Peticiones que solo pueden empezar cuando termina la anterior, porque cada una necesita el resultado de la previa. Es la causa más común de una pantalla lenta que en el perfilador parece rápida. |

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
| `app/Panel.jsx` | componente en JSX |
| `app/anidada/detalle/page.js` | código JavaScript |
| `app/anidada/layout.js` | código JavaScript |
| `app/cascada.json/route.js` | código JavaScript |
| `app/cascada/page.js` | código JavaScript |
| `app/fuente.js` | código JavaScript |
| `app/layout.js` | código JavaScript |
| `app/medicion.js` | código JavaScript |

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
| `components/Panel.vue` | archivo del proyecto |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `fuente.js` | código JavaScript |
| `layouts/padre.vue` | archivo del proyecto |
| `medicion.js` | código JavaScript |
| `nuxt.config.ts` | código TypeScript |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pages/anidada/detalle.vue` | archivo del proyecto |

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
| `src/lib/Panel.svelte` | componente de Svelte |
| `src/lib/fuente.js` | código JavaScript |
| `src/lib/medicion.js` | código JavaScript |

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
| `app/Panel.jsx` | componente en JSX |
| `app/fuente.js` | código JavaScript |
| `app/medicion.js` | código JavaScript |
| `app/root.jsx` | componente en JSX |
| `app/routes/anidada.detalle.jsx` | componente en JSX |
| `app/routes/anidada.jsx` | componente en JSX |
| `app/routes/cascada.jsx` | componente en JSX |
| `app/routes/cascada[.]json.js` | código JavaScript |

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
| `src/components/Panel.astro` | archivo del proyecto |
| `src/fuente.js` | código JavaScript |
| `src/layouts/Padre.astro` | archivo del proyecto |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

### La fuente y el cronómetro, idénticos en las cinco

[`astro/src/fuente.js`](implementaciones/astro/src/fuente.js) — y la distinción
que hay que llevarse antes que ninguna otra:

```javascript
 * Ninguna necesita a las otras: se pueden pedir las tres a la vez. Que en
 * `/cascada` se pidan una detrás de otra no es una necesidad del dominio, es un
 * descuido — y ese descuido es el tema de la clase.
 *
 * La cascada de verdad, la que no se puede evitar, es otra: cuando el segundo
 * dato necesita el identificador que trae el primero. Esa cuesta un rediseño de
 * la fuente, no un `Promise.all`. Distinguir las dos es lo que hay que
 * aprender a hacer.
```

Las dos versiones, una al lado de la otra:

```javascript
/** LA CASCADA. Tres `await` seguidos, y ninguno necesita al anterior. Tarda la
 *  suma: unos ciento ochenta milisegundos. */
export async function enCascada() {
  const usuario = await pedirUsuario();
  const pedidos = await pedirPedidos();
  const avisos = await pedirAvisos();
  return { usuario, pedidos, avisos };
}
```

```javascript
/** EN PARALELO. El mismo trabajo, lanzado a la vez. Tarda lo que la más lenta:
 *  unos sesenta. El cambio son dos líneas y no toca ni la fuente ni la pantalla. */
export async function enParalelo() {
```

Y el cronómetro, con sus dos precauciones —
[`astro/src/medicion.js`](implementaciones/astro/src/medicion.js):

```javascript
 * Antes de medir hace una petición de calentamiento a cada ruta. Sin ella, la
 * primera se lleva el coste de abrir módulos y de que el motor compile, y ese
 * coste no tiene nada que ver con la cascada.
```

```javascript
 * Y una advertencia que vale para cualquier número de esta clase: **estos
 * milisegundos son de esta máquina y de esta ejecución**. Lo que significa algo
 * es la relación entre ellos, no su valor. La clase 007 explica por qué publicar
 * lo segundo sin lo primero no dice nada.
```

Y el umbral del anidamiento, elegido para que no haya duda:

```javascript
    // Dos cargas anidadas de sesenta milisegundos: si van a la vez, la respuesta
    // sale por debajo de noventa; si van en cadena, por encima de ciento veinte.
    // No hay zona gris posible con esos números.
    las_cargas_anidadas_van_en_paralelo: anidada < RETARDO_MS * 1.5,
```

### Next.js · el error que se quedó escrito, y por qué

**Este es el hallazgo de la clase.** El comentario de
[`nextjs/app/anidada/layout.js`](implementaciones/nextjs/app/anidada/layout.js)
estaba escrito al revés antes de medir:

```javascript
 * La deducción natural es la contraria: una disposición es un componente `async`
 * y sus hijos son lo que devuelve, así que hasta que este `await` no termine no
 * debería existir nada dentro. Los dos retardos deberían sumarse.
 *
 * No se suman. `children` no es el resultado de esta función: es un elemento que
 * el enrutador ya había creado antes de llamarla, y React puede resolverlo
 * mientras esta espera. La medición sale igual que en Remix y en SvelteKit.
```

```javascript
 * Es la lección de método de la clase, y por eso el comentario está escrito así
 * en lugar de borrar el error: **un modelo mental convincente no es una
 * medición**. La cascada entre niveles se busca cronometrando, no razonando.
```

Y el aviso sobre dónde sí duele en Next —
[`app/cascada/page.js`](implementaciones/nextjs/app/cascada/page.js):

```javascript
/** Tres `await` seguidos. En Next esto es especialmente fácil de escribir sin
 *  querer: como cualquier componente puede cargar lo suyo —clase 096—, la
 *  cascada se reparte entre archivos y deja de verse de un vistazo. */
```

### Remix · las rutas se conocen antes de cargar

[`remix/app/routes/anidada.jsx`](implementaciones/remix/app/routes/anidada.jsx):

```jsx
 * Aquí está la ventaja de Remix que no se ve en un archivo suelto: **este
 * `loader` y el de la ruta hija se ejecutan a la vez**, no en cadena. Remix
 * conoce las dos rutas antes de empezar, sabe qué `loader` tiene cada una y las
 * lanza todas juntas.
```

### SvelteKit · lo mismo, dicho con otras palabras

[`sveltekit/src/routes/anidada/+layout.server.js`](implementaciones/sveltekit/src/routes/anidada/+layout.server.js):

```javascript
 * SvelteKit resuelve la ruta entera antes de cargar nada: sabe que esta petición
 * activa esta disposición y esta página, y lanza sus dos `load` a la vez.
```

Y su recordatorio de que la carga junto a la ruta no es una vacuna —
[`cascada/+page.server.js`](implementaciones/sveltekit/src/routes/cascada/+page.server.js):

```javascript
/** Tres `await` seguidos dentro de `load`. Tener la carga junto a la ruta no
 *  impide escribir una cascada. */
```

### Astro · el marco es un componente, y por eso encadena

[`astro/src/layouts/Padre.astro`](implementaciones/astro/src/layouts/Padre.astro):

```astro
// No hay «rutas anidadas» en Astro: hay componentes que se usan como marco y una
// ranura donde va el contenido. Este frontmatter se ejecuta cuando la página lo
// renderiza, y la página ya ha terminado su propia carga para entonces.
//
// Es decir: en Astro el anidamiento **sí** encadena, y no porque el framework lo
// haga mal, sino porque no hay ningún framework de por medio. Son dos
// componentes, uno dentro de otro, y los frontmatter se ejecutan en el orden en
// que se pintan.
```

Con la salida, que existe:

```astro
// La salida es la misma que en cualquier función: si el marco no necesita el
// dato del contenido, se piden los dos a la vez desde arriba. Lo que Astro no da
// es que ocurra solo.
```

### Nuxt · igual, y con el método aplicado

[`nuxt/layouts/padre.vue`](implementaciones/nuxt/layouts/padre.vue):

```vue
// Lo que decide si se suman o no es en qué orden el renderizador de Vue ejecuta
// los `setup` asíncronos de un componente y de su ranura. La medición de
// `/cascada.json` lo dice sin necesidad de leer el código de Vue, que es
// exactamente lo que hay que hacer con este tipo de preguntas.
```

Y una advertencia sobre `useAsyncData` que conviene tener —
[`nuxt/pages/cascada.vue`](implementaciones/nuxt/pages/cascada.vue):

```vue
// Tres `await` seguidos dentro del cargador. Da igual que se envuelvan en
// `useAsyncData`: la clave y la deduplicación no arreglan el orden, solo evitan
// pedir dos veces lo mismo.
```

## 🔬 Comparación

Cronometrado por el mismo archivo, en la misma máquina, tras calentar cada ruta:

| | `/cascada` | `/paralelo` | `/anidada/detalle` | ¿las anidadas van a la vez? |
| --- | ---: | ---: | ---: | :---: |
| **Remix** | 192 ms | 71 ms | **72 ms** | ✅ |
| **SvelteKit** | 187 ms | 63 ms | **62 ms** | ✅ |
| **Next.js** | 192 ms | 74 ms | **69 ms** | ✅ |
| **Astro** | 187 ms | 63 ms | **125 ms** | ❌ |
| **Nuxt** | 189 ms | 69 ms | **127 ms** | ❌ |

Los milisegundos son de esta máquina. Las tres columnas comparables son cada
pantalla contra sí misma y la última contra el resto.

Cuatro lecturas:

- **La cascada dentro de una carga la escriben los cinco igual de fácil.** Tres
  `await` seguidos son ciento ochenta milisegundos en Astro, en Next, en Nuxt, en
  Remix y en SvelteKit. Ningún framework protege de esto, y ninguno pretende
  hacerlo: es código.
- **Entre niveles sí hay dos familias, y la línea no está donde parecía.** Los
  tres que resuelven la ruta antes de cargar —Remix, SvelteKit y **Next**— lanzan
  las cargas de todos los niveles a la vez. Los dos donde el marco es solo un
  componente —Astro y Nuxt— las encadenan, sesenta milisegundos por nivel.
- **Que Next esté en el primer grupo es el resultado que hubo que medir dos
  veces.** El razonamiento decía lo contrario y el razonamiento estaba mal: el
  enrutador crea el elemento hijo antes de llamar a la disposición, y React lo
  resuelve mientras esta espera.
- **Que Astro y Nuxt estén en el segundo no es un defecto suyo.** Es lo que
  significa que un marco sea un componente y no una ruta. Se arregla igual que
  cualquier otra cascada —pidiendo desde arriba— pero hay que saberlo.

## ⚠️ Errores frecuentes

- **Buscar cascadas leyendo código.** No se ven: tres `await` seguidos parecen
  los pasos de una receta. Se ven cronometrando.
- **Aplicar `Promise.all` a una cascada necesaria.** Si el segundo dato necesita
  el identificador que trae el primero, ponerlos en paralelo no compila o
  devuelve basura. Esa cascada se arregla en la fuente: un endpoint que traiga
  las dos cosas.
- **Creer que cargar junto a la ruta la elimina.** Solo la mueve al servidor,
  donde la red es más rápida. Ciento ochenta milisegundos siguen siendo ciento
  ochenta.
- **Confiar en `useAsyncData` para ordenar.** La clave deduplica y guarda; no
  cambia en qué orden se piden las cosas.
- **Medir la primera petición.** Se lleva el coste de compilar y abrir módulos.
  Sin una petición de calentamiento, la cifra mide otra cosa.

## ✅ Verificación

```bash
node scripts/run-class.mjs 099
```

Para hacerlo tú, la prueba de una línea que encuentra cascadas en cualquier
pantalla:

```bash
curl -s -o /dev/null -w "%{time_total}\n" http://127.0.0.1:4100/cascada
```

Repítelo contra `/paralelo`. Si la diferencia es un múltiplo del número de
peticiones que hace la pantalla, tienes una cascada.

## 🧪 Reto de transferencia

1. **Cronometra tus dos pantallas más lentas.** Si una tarda aproximadamente
   `n × t` donde `n` es su número de consultas, es una cascada. Casi siempre lo
   es.
2. **Clasifica cada espera.** Para cada `await` de tu carga, pregunta si el
   siguiente necesita su resultado. Los que no, se pueden juntar hoy mismo.
3. **Mide el anidamiento de tu framework.** Dos cargas en dos niveles con un
   retardo conocido, y un cronómetro. Es la única forma de saberlo, y el
   resultado puede sorprenderte: aquí sorprendió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 007](../../parte-0-el-metodo/007-como-se-mide-y-como-se-miente-el-rendimiento/README.md) — por qué un número sin entorno no dice nada
- [Clase 097](../097-carga-de-datos-junto-a-la-ruta/README.md) — dónde vive la carga
- [Clase 100](../100-html-en-flujo/README.md) — no esperar a la parte lenta
- [Índice de la parte 7](../README.md)

## Fuentes

- [@remix-docs] *Remix — Documentación oficial* — <https://remix.run/docs>
- [@sveltekit-docs] *SvelteKit — Documentación oficial* — <https://svelte.dev/docs/kit>
- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
- [@nuxt-docs] *Nuxt — Documentación oficial* — <https://nuxt.com/docs>
- [@wagner-web-performance] Wagner, Jeremy. *Web Performance in Action*. Manning Publications, 2016. ISBN 9781617293771 — <https://openlibrary.org/isbn/9781617293771>
