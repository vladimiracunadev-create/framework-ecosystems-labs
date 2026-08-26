# Clase 102 — Presupuesto de JavaScript

> [⬅️ Clase 101](../101-metadatos-y-descubribilidad/README.md) · [📚 Parte 7](../README.md) · [🎓 Clases](../../README.md) · [103 ➡️](../103-hipermedia-como-alternativa/README.md)
>
> Parte **7 — Renderizado y full-stack** · Nivel **🔴 avanzado** · Pista **`fullstack`** (Renderizado y full-stack)
>
> ✅ **Clase construida** — 5 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Las clases 094, 095 y 096 midieron lo que cuesta el JavaScript. Esta pone el
número en un archivo y **hace fallar la construcción cuando se pasa**.

Esa segunda mitad es toda la clase. Un presupuesto que no rompe nada es una
buena intención: se comenta en una reunión, se incumple en la siguiente
dependencia y no vuelve a mirarlo nadie.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Escribir un guardián de presupuesto** en cualquier proyecto, en menos de
  cincuenta líneas y sin depender de ninguna herramienta.
- **Medir lo que importa**: lo comprimido, que es lo que viaja, y el directorio
  de cliente, que es lo que se descarga.
- **Comparar el suelo de cinco frameworks** con la misma báscula.
- **Distinguir un límite que muerde de uno decorativo**, y comprobarlo.

## 🧩 La situación

La misma pantalla en las cinco: un encabezado y un botón que cuenta. Es lo más
pequeño que se puede hacer y aun así necesita JavaScript, así que el número que
sale es **el suelo de cada framework**: lo que cuesta empezar.

Y en cada una, un archivo de dos líneas que declara el límite, y otro que lo
hace cumplir.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /` | la pantalla, el botón y el `<script` que lo revive |
| 2 | `GET /presupuesto.json` | **está dentro**, y se comprueba al construir |
| 3 | `GET /presupuesto.json` | **la regla muerde**: con mil bytes de límite, falla |
| 4 | `GET /presupuesto.json` | el límite es sobre lo comprimido, y comprimir ahorra |
| 5 | `GET /presupuesto.json` | archivos contados y bytes distintos de cero |
| 6 | `GET /presupuesto.json` | dónde deja su JavaScript y qué entra en la cuenta |

**Pero la parte importante de esta clase no la comprueba el contrato**: la
comprueba el hecho de que las cinco implementaciones construyan.

```json
  "preparar": [
    ["pnpm", "install", "--silent", "--ignore-scripts"],
    ["pnpm", "exec", "astro", "build"],
    ["node", "presupuesto.mjs"]
  ],
```

Ese tercer paso sale con estado 1 si el paquete se pasa. Si alguien añade una
dependencia gorda a cualquiera de las cinco, **esta clase se pone roja**.

Y el caso 3 está por lo que la clase quiere enseñar: un límite que nunca dice que
no es indistinguible de no tener límite. La misma cuenta se hace con mil bytes
para demostrar que la regla sabe decir que no.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Presupuesto de JavaScript**](../../../glosario/README.md#presupuesto-de-javascript) | Un límite declarado de cuántos bytes de JavaScript puede enviar una página, comprobado automáticamente. Sin límite, el peso solo crece — nadie quita una dependencia por su cuenta. |

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
node presupuesto.mjs
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 pnpm exec next start -p 3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `app/Contador.jsx` | componente en JSX |
| `app/layout.js` | código JavaScript |
| `app/page.js` | código JavaScript |
| `app/presupuesto.json/route.js` | código JavaScript |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `next.config.mjs` | código JavaScript (módulo ES) |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |

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
node presupuesto.mjs
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node .output/server/index.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `nuxt.config.ts` | código TypeScript |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pages/index.vue` | archivo del proyecto |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `presupuesto.json` | datos en JSON usados por la implementación |
| `presupuesto.mjs` | código JavaScript (módulo ES) |

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
node presupuesto.mjs
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
| `presupuesto.json` | datos en JSON usados por la implementación |
| `presupuesto.mjs` | código JavaScript (módulo ES) |
| `src/app.html` | plantilla o marcado |
| `src/routes/+page.svelte` | componente de Svelte |

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
node presupuesto.mjs
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 pnpm exec remix-serve ./build/server/index.js
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `app/root.jsx` | componente en JSX |
| `app/routes/_index.jsx` | componente en JSX |
| `app/routes/presupuesto[.]json.js` | código JavaScript |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `presupuesto.json` | datos en JSON usados por la implementación |

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
node presupuesto.mjs
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
| `presupuesto.json` | datos en JSON usados por la implementación |
| `presupuesto.mjs` | código JavaScript (módulo ES) |
| `src/components/Contador.jsx` | componente en JSX |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

### El guardián, idéntico en las cinco

[`astro/presupuesto.mjs`](implementaciones/astro/presupuesto.mjs) — y la tesis
entera en el primer párrafo:

```javascript
 * Un presupuesto de JavaScript no es un consejo: es un número y una regla que
 * hace fallar la construcción cuando se pasa. Sin esa segunda mitad, el número
 * se comenta en una reunión, se incumple en el siguiente sprint y no vuelve a
 * mirarlo nadie.
```

Las dos decisiones de medición, que son la mitad del valor de la clase:

```javascript
 *   1. **Se mide lo comprimido.** Lo que viaja por la red va comprimido, así que
 *      poner el límite sobre el tamaño en disco es medir algo que nadie
 *      descarga. La diferencia es de tres a cuatro veces.
 *   2. **Se mide el directorio de cliente, no el de servidor.** El código que se
 *      queda en el servidor no cuenta: no lo descarga nadie. Dónde está ese
 *      directorio cambia en cada framework, y esa es una de las comparaciones de
 *      la clase.
```

La regla que muerde, que son cuatro líneas:

```javascript
  if (!r.dentro_del_presupuesto) {
    console.error(
      `PRESUPUESTO SUPERADO: ${kb(r.bytes_comprimidos)} comprimidos frente a un límite de ${kb(r.presupuesto_bytes)}`,
    );
    process.exit(1);
  }
```

Y la comprobación de que sabe decir que no:

```javascript
    // La misma cuenta con un límite absurdo. Está aquí para demostrar que la
    // regla muerde: un presupuesto que nunca dice que no es un adorno.
    con_un_presupuesto_de_mil_bytes_falla: comprimidos > 1000,
```

**Con un detalle que costó cuatro quinientos seguidos:**

```javascript
 * El motivo se descubrió con cuatro quinientos seguidos: cuando este archivo lo
 * importa una ruta de servidor, el empaquetador lo mete DENTRO del paquete, y
 * entonces `import.meta.url` apunta al paquete y no a aquí. El directorio de
 * trabajo, en cambio, es el de la implementación tanto al construir como al
 * servir.
```

### Astro · el suelo más bajo, y se ve por qué

[`astro/src/components/Contador.jsx`](implementaciones/astro/src/components/Contador.jsx):

```jsx
/** Lo único interactivo de la pantalla, y por tanto lo único que ocupa
 *  presupuesto. En Astro, quitar la directiva `client:load` de la página deja el
 *  presupuesto en cero. */
```

Y su declaración —
[`astro/presupuesto.json`](implementaciones/astro/presupuesto.json):

```json
{ "directorio_de_cliente": "dist/client", "maximo_bytes_comprimidos": 14000 }
```

### Next.js · el suelo más alto, y también se ve por qué

[`nextjs/app/Contador.jsx`](implementaciones/nextjs/app/Contador.jsx):

```jsx
/** Lo único interactivo. En Next, el presupuesto no empieza aquí: empieza en el
 *  tiempo de ejecución que la aplicación manda siempre —clase 095—, y este botón
 *  solo añade unos cientos de bytes encima. */
```

Y lo que declara que entra en su cuenta —
[`app/presupuesto.json/route.js`](implementaciones/nextjs/app/presupuesto.json/route.js):

```javascript
    que_entra_en_el_presupuesto: "el tiempo de ejecución de React y Next, más lo que lleve \"use client\"",
```

### SvelteKit · lo que ahorra no mandar un motor

[`sveltekit/src/routes/presupuesto.json/+server.js`](implementaciones/sveltekit/src/routes/presupuesto.json/+server.js):

```javascript
    que_entra_en_el_presupuesto: "el arranque de SvelteKit y los componentes compilados: no viaja motor de árbol virtual",
```

Y la pantalla, que es la misma que en los otros cuatro —
[`+page.svelte`](implementaciones/sveltekit/src/routes/+page.svelte):

```svelte
  // Lo único interactivo de la pantalla.
  let veces = $state(0);
```

### Remix · sin excepciones por ruta

[`remix/app/routes/_index.jsx`](implementaciones/remix/app/routes/_index.jsx):

```jsx
/** Lo único interactivo. En Remix no hay forma de que este botón no viaje: la
 *  aplicación se hidrata entera —clase 094— y no hay interruptor por ruta. */
```

### Nuxt · y la observación que vale para los cinco

[`nuxt/nuxt.config.ts`](implementaciones/nuxt/nuxt.config.ts):

```typescript
 * Sin nada especial. Nuxt trae un analizador de paquetes —`nuxi analyze`— que
 * enseña qué ocupa qué, y no trae un límite que haga fallar la construcción.
 * Ninguno de los cinco lo trae: por eso esta clase lo escribe.
```

Y la pantalla —
[`nuxt/pages/index.vue`](implementaciones/nuxt/pages/index.vue):

```vue
// Lo único interactivo de la pantalla.
const veces = ref(0);
```

## 🔬 Comparación

El suelo de cada framework, medido con la misma báscula: la misma pantalla, el
mismo botón, todo el JavaScript de cliente que produce cada construcción.

| | archivos | en disco | **comprimido** | límite declarado | dónde lo deja |
| --- | ---: | ---: | ---: | ---: | --- |
| **Astro** | 5 | 23,2 kB | **10,0 kB** | 13,7 kB | `dist/client` |
| **SvelteKit** | 12 | 77,4 kB | **32,2 kB** | 39,1 kB | `build/client` |
| **Nuxt** | 4 | 191,7 kB | **72,2 kB** | 80,1 kB | `.output/public/_nuxt` |
| **Remix** | 7 | 255,8 kB | **83,9 kB** | 92,8 kB | `build/client` |
| **Next.js** | 17 | 773,2 kB | **238,9 kB** | 253,9 kB | `.next/static` |

Cinco lecturas:

- **Entre el primero y el último hay veinticuatro veces**, para pintar el mismo
  botón. No es una diferencia de calidad: es la diferencia entre mandar un motor
  de componentes y no mandarlo, y entre mandar un enrutador de cliente y no
  mandarlo. Cada uno de esos kilobytes compra algo.
- **Comprimir divide por tres.** Un presupuesto puesto sobre el tamaño en disco
  mide algo que nadie descarga, y da un número tres veces peor del real. Es el
  error más común al poner el primer límite.
- **Esta báscula pesa todo el directorio de cliente, no una pantalla.** Es
  deliberado: un guardián de presupuesto tiene que enterarse de una dependencia
  gorda añadida en cualquier parte del proyecto, no solo en la portada. Para
  medir una pantalla concreta hace falta la técnica de la clase 096 —descargar lo
  que el documento menciona— y esa no puede fallar en la construcción.
- **Ninguno de los cinco trae esto de serie.** Traen analizadores que enseñan qué
  ocupa qué, que es útil para investigar y no sirve para impedir. El guardián son
  cincuenta líneas y no depende de ninguna herramienta.
- **El número correcto no es el más bajo: es el que has decidido.** Un panel
  interno detrás de un acceso puede permitirse doscientos kilobytes; una portada
  de comercio en una red lenta, no. Lo que no se puede es no haberlo decidido.

## ⚠️ Errores frecuentes

- **Poner el número y no la regla.** Un presupuesto sin un `exit 1` es un
  comentario. La primera vez que alguien tenga prisa, se supera y no pasa nada.
- **Medir sin comprimir.** Multiplica el número por tres y hace que el límite
  parezca inalcanzable. Lo que viaja es lo comprimido.
- **Contar el directorio de servidor.** Es código que no descarga nadie. Meterlo
  en la cuenta infla el número y castiga precisamente lo que se quiere premiar:
  mover trabajo al servidor.
- **Un límite global para veinte pantallas.** El que hay aquí vale para un
  proyecto pequeño. En uno grande hay que medir por ruta, y entonces el número
  útil es el de la clase 096: lo que el documento pide.
- **Subir el límite cuando salta.** Es la reacción natural y la que convierte el
  guardián en un adorno. Subirlo tiene que ser una decisión con un motivo escrito
  al lado, no un arreglo de última hora.

## ✅ Verificación

```bash
node scripts/run-class.mjs 102
```

Cada implementación ejecuta su guardián como último paso de la preparación. Para
verlo tú, dentro del directorio de cualquiera:

```bash
node presupuesto.mjs
```

Y para comprobar que muerde, baja `maximo_bytes_comprimidos` a `1000` en su
`presupuesto.json` y vuelve a ejecutarlo: sale con estado 1 y la clase se pone
roja.

## 🧪 Reto de transferencia

1. **Pesa tu proyecto.** Copia `presupuesto.mjs`, apunta `directorio_de_cliente`
   al tuyo y ejecútalo. El número que salga es tu punto de partida.
2. **Pon el límite un diez por ciento por encima.** No en el número redondo de
   más arriba: en el tuyo más un margen. Así la primera dependencia gorda que
   entre lo va a romper.
3. **Métete el guardián en la integración continua.** Un límite que solo se
   comprueba en tu máquina se incumple en la rama de otra persona.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 094](../094-hidratacion/README.md) — de dónde salen esos bytes
- [Clase 095](../095-islas/README.md) — el suelo y lo que cuesta subirse a él
- [Clase 096](../096-componentes-de-servidor/README.md) — cómo medir una pantalla y no un proyecto
- [Índice de la parte 7](../README.md)

## Fuentes

- [@patterns-dev] *Patterns.dev — Modern Web App Design Patterns* — <https://www.patterns.dev/>
- [@wagner-web-performance] Wagner, Jeremy. *Web Performance in Action*. Manning Publications, 2016. ISBN 9781617293771 — <https://openlibrary.org/isbn/9781617293771>
- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
- [@astro-docs] *Astro — Documentación oficial* — <https://docs.astro.build/>
- [@nuxt-docs] *Nuxt — Documentación oficial* — <https://nuxt.com/docs>
