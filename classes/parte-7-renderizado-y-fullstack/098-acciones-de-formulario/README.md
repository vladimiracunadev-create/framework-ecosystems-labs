# Clase 098 — Acciones de formulario

> [⬅️ Clase 097](../097-carga-de-datos-junto-a-la-ruta/README.md) · [📚 Parte 7](../README.md) · [🎓 Clases](../../README.md) · [099 ➡️](../099-la-cascada-de-peticiones/README.md)
>
> Parte **7 — Renderizado y full-stack** · Nivel **🔴 avanzado** · Pista **`fullstack`** (Renderizado y full-stack)
>
> ✅ **Clase construida** — 5 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

La clase 097 leyó. Esta escribe, y la exigencia es la misma que en la 080: **el
alta tiene que funcionar con el JavaScript apagado**.

Eso no es nostalgia. Es la única forma de saber que el formulario es un
formulario y no un `div` con un manejador encima. Y el verificador no ejecuta
JavaScript, así que lo que ve es exactamente lo que vería alguien con la red a
medias, un bloqueador puesto o el guion todavía descargándose.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Escribir una escritura que funcione sin JavaScript** en los cinco, y saber
  qué añade cada uno cuando sí lo hay.
- **Distinguir** un framework que sabe que una escritura invalida una lectura de
  uno al que hay que decírselo.
- **Reconocer la comprobación de origen** que Astro y SvelteKit traen encendida
  de serie, y por qué un `curl` sin cabecera `Origin` recibe un 403.
- **Usar el campo de intención** para tener varios botones en un mismo
  formulario sin inventarse rutas.

## 🧩 La situación

Una lista de tres tareas y un formulario para añadir la cuarta. Nada de
JavaScript en ninguna de las cinco páginas.

Y una cuarta petición que es la que de verdad separa las implementaciones
serias: **el formulario con el campo en blanco**. Un navegador lo envía sin
protestar, así que el servidor tiene que rechazarlo.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /tareas` | un `<form>` de verdad, con su campo oculto — y guarda el nombre |
| 2 | `GET /accion.json` | de partida se ven **3** |
| 3 | `POST /tareas` | el envío sin JavaScript funciona |
| 4 | `GET /tareas` | y la tarea está: `sacar la basura`, `data-tarea="4"` |
| 5 | `POST /tareas` con el texto en blanco | se envía, porque un navegador lo permite |
| 6 | `GET /accion.json` | **pero no añade nada: siguen siendo cuatro** |

Los casos 2 y 6 son la pinza que hace verificable el 5: no hace falta inventarse
un formato de mensaje de error común a los cinco, basta con **contar antes y
después**.

Y el caso 1 guarda dos cosas del HTML que el caso 3 devuelve, igual que haría un
navegador:

```json
      "guardar_cuerpo": {
        "campoOculto": { "patron": "type=\"hidden\" name=\"([^\"]+)\"" },
        "origen": { "patron": "data-origen=\"([^\"]+)\"" }
      },
```

**Las dos hicieron falta de verdad, y las dos enseñan algo:**

- El **campo oculto**, porque en Next el nombre de ese campo lo genera el
  compilador —es el identificador de la acción de servidor— y cambia con cada
  construcción. Leerlo del HTML es exactamente lo que hace un navegador.
- El **origen**, porque Astro y SvelteKit rechazan con **403** cualquier POST de
  formulario sin cabecera `Origin` que coincida con la suya. Es protección
  contra falsificación de peticiones —clase 080— encendida de serie.

Y el cuerpo va en `multipart` y no en `urlencoded` porque es lo que emite el
formulario de una acción de servidor de Next: `<form action={fn}>` renderiza
`encType="multipart/form-data"`, y con el otro tipo la acción no llega a
ejecutarse.

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
| `app/accion.json/route.js` | código JavaScript |
| `app/acciones.js` | código JavaScript |
| `app/almacen.js` | código JavaScript |
| `app/cuenta.js` | código JavaScript |
| `app/layout.js` | código JavaScript |
| `app/tareas/page.js` | código JavaScript |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `next.config.mjs` | código JavaScript (módulo ES) |

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
| `almacen.ts` | código TypeScript |
| `cuenta.ts` | código TypeScript |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `nuxt.config.ts` | código TypeScript |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pages/tareas.vue` | archivo del proyecto |
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
| `src/lib/almacen.js` | código JavaScript |
| `src/lib/cuenta.js` | código JavaScript |
| `src/routes/accion.json/+server.js` | código JavaScript |

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
| `app/almacen.js` | código JavaScript |
| `app/cuenta.js` | código JavaScript |
| `app/root.jsx` | componente en JSX |
| `app/routes/accion[.]json.js` | código JavaScript |
| `app/routes/tareas.jsx` | componente en JSX |
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
| `src/almacen.js` | código JavaScript |
| `src/cuenta.js` | código JavaScript |
| `src/pages/accion.json.js` | código JavaScript |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

### El almacén, idéntico en las cinco

[`astro/src/almacen.js`](implementaciones/astro/src/almacen.js):

```javascript
 * En memoria y sin base de datos: lo que esta clase compara es **cómo llega la
 * escritura al servidor**, no dónde se guarda. La parte 4 ya se ocupó de lo
 * segundo.
 *
 * `crear` devuelve `null` si el texto viene vacío, y ese `null` es la mitad del
 * contrato: el formulario vacío no puede añadir una tarea en blanco por muy
 * bonita que sea la sintaxis del framework.
```

Y la cuenta, que se hace mirando el HTML y no la memoria —
[`astro/src/cuenta.js`](implementaciones/astro/src/cuenta.js):

```javascript
 * Podría contarse leyendo el almacén directamente, y sería más corto. Se hace
 * así por un motivo: en algunos de los cinco frameworks el manejador de un
 * endpoint y el render de una página comparten memoria, y en otros no. Una
 * comprobación que dependiera de eso mediría el empaquetador en lugar del
 * framework.
```

### Remix · el `action`, pareja simétrica del `loader`

[`remix/app/routes/tareas.jsx`](implementaciones/remix/app/routes/tareas.jsx):

```jsx
 * La simetría no es cosmética. Como Remix conoce las dos funciones, sabe que un
 * `action` acabado invalida lo que el `loader` había traído, y **vuelve a
 * llamarlo solo**. Nadie escribe una línea para eso.
```

Y la mejora progresiva, que aquí no cuesta nada:

```jsx
        `<Form>` de Remix renderiza un `<form method="post">` de verdad. Sin
        JavaScript, el navegador lo envía él solo y llega al `action`. Con
        JavaScript, Remix intercepta el envío y hace lo mismo por detrás sin
        recargar. El mismo código, dos caminos: eso es la mejora progresiva de la
        clase 081, aquí de serie.
```

Y el campo de intención, que es de él —

```jsx
  // El campo «intención» es el patrón que Remix popularizó: con varios botones
  // en el mismo formulario, es lo que distingue qué se ha pulsado. Con uno solo
  // sobra, y se deja porque el contrato es el mismo para los cinco.
```

### SvelteKit · varias acciones con nombre

[`sveltekit/src/routes/tareas/+page.server.js`](implementaciones/sveltekit/src/routes/tareas/+page.server.js):

```javascript
 * Remix tiene un `action` por ruta. SvelteKit tiene **varios con nombre**, y el
 * formulario elige cuál con `action="?/borrar"`. En una pantalla con tres
 * botones —crear, marcar, borrar— eso ahorra el `if` sobre un campo oculto que
 * hace falta en los otros cuatro.
```

Con el patrón de la clase 080 explicado en la propia acción:

```javascript
    // Sin esta redirección, SvelteKit devolvería 200 con la página ya
    // actualizada: funciona, y deja el POST en el historial. El patrón de la
    // clase 080 sigue valiendo aquí.
    redirect(303, "/tareas");
```

**Y la comprobación de origen, que costó un 403 descubrir** —
[`+page.svelte`](implementaciones/sveltekit/src/routes/tareas/+page.svelte):

```svelte
  No es un adorno del ejercicio: SvelteKit rechaza con 403 cualquier POST de
  formulario cuyo `Origin` no coincida con el suyo, y lo hace **de serie, sin
  configurarlo**. Es la protección contra la falsificación de peticiones de la
  clase 080, aquí encendida por omisión. Un navegador manda esa cabecera solo; un
  `curl` sin ella, no, y por eso el contrato tiene que ponerla.
```

Con el detalle que hace falta para que funcione —
[`+page.server.js`](implementaciones/sveltekit/src/routes/tareas/+page.server.js):

```javascript
  // `url.origin` y no la cabecera `Host`: es exactamente el valor con el que
  // SvelteKit compara el `Origin` de un POST de formulario, y con el adaptador
  // de Node no siempre coinciden. Ver el comentario de `+page.svelte`.
```

### Next.js · una función pasada como si fuera una URL

[`nextjs/app/acciones.js`](implementaciones/nextjs/app/acciones.js):

```javascript
 * `"use server"` es la directiva simétrica de `"use client"` de la clase 094.
 * Marca que estas funciones se ejecutan en el servidor **aunque se invoquen
 * desde el navegador**: Next crea una ruta por cada una y le pone un
 * identificador, y ese identificador viaja en el formulario.
```

Y la línea que en Remix y SvelteKit no existe:

```javascript
 * `revalidatePath` es la línea que en Remix y en SvelteKit no hace falta: allí,
 * terminar una acción invalida lo que se había cargado. Aquí hay que decirlo.
```

Y cómo se convierte una función en un formulario que funciona sin JavaScript —
[`app/tareas/page.js`](implementaciones/nextjs/app/tareas/page.js):

```javascript
        Sin JavaScript, el navegador envía ese formulario, Next reconoce el
        identificador, ejecuta la función en el servidor y devuelve la página ya
        actualizada. Es mejora progresiva de verdad, y el campo oculto es lo que
        la hace posible: el contrato lo lee del HTML y lo devuelve, igual que un
        navegador.
```

### Astro · un `if` sobre el método, como en 1995

[`astro/src/pages/tareas/index.astro`](implementaciones/astro/src/pages/tareas/index.astro):

```astro
 * Aquí no hay `action` ni `actions`: hay un `if` sobre el método de la petición,
 * que es como se ha hecho esto en la web desde 1995. El frontmatter de la página
 * atiende el POST, escribe y redirige.
```

Con la explicación de por qué no se usa `astro:actions`, que sí existe:

```astro
 * Astro 5 sí trae `astro:actions`, con validación por esquema y llamada tipada
 * desde el cliente. No se usa en esta clase por un motivo concreto y no por
 * pereza: su formulario apunta a una URL con un parámetro de consulta propio, y
 * entonces el contrato dejaría de ser el mismo para los cinco. Lo que se ve aquí
 * es el camino que Astro nunca quita.
```

**Y el hallazgo más aprovechable de la clase**, que costó dos 403 seguidos:

```astro
// Lo que sorprende es contra qué compara: `Astro.url.origin`, que con el
// adaptador de Node sale `http://localhost` SIN PUERTO. Un navegador mandaría
// `http://127.0.0.1:4100` y sería rechazado. Es un aviso que vale más que el
// ejercicio: la dirección que un framework cree tener y la que se ve desde fuera
// son dos cosas distintas.
```

### Nuxt · la ruta que hay que escribir a mano

[`nuxt/server/routes/tareas.post.ts`](implementaciones/nuxt/server/routes/tareas.post.ts):

```typescript
 * El sufijo `.post` del nombre del archivo hace que esta ruta atienda solo los
 * POST a `/tareas`; los GET siguen llegando a la página. Funciona, y es una ruta
 * de servidor como cualquier otra: Nitro no sabe que tiene nada que ver con la
 * pantalla que la usa.
```

```typescript
 * Ahí está la diferencia con Remix y SvelteKit, y no es de sintaxis: allí el
 * framework sabe que una escritura acabada invalida lo que se había leído, y
 * vuelve a cargarlo. Aquí no hay nada que invalidar porque no hay relación
 * declarada entre las dos cosas.
```

**Y una consecuencia de su arquitectura que se descubre a golpes** —
[`server/api/tareas.get.ts`](implementaciones/nuxt/server/api/tareas.get.ts):

```typescript
 * En Nuxt las rutas de servidor —Nitro— y el renderizado de las páginas se
 * empaquetan por separado. Un módulo importado desde los dos sitios acaba
 * duplicado: **son dos instancias distintas en memoria**, y una escritura hecha
 * desde una ruta de servidor no se ve desde la página.
 *
 * Se descubre exactamente así: escribiendo, recargando y viendo que no está.
```

## 🔬 Comparación

| | Mecanismo | Dónde vive | ¿Revalida sola? | ¿Comprueba el origen de serie? |
| --- | --- | --- | :---: | :---: |
| **Remix** | `action` exportado por la ruta | junto al `loader` | ✅ | ❌ |
| **SvelteKit** | objeto `actions`, con entradas con nombre | `+page.server.js` | ✅ | ✅ 403 |
| **Next.js** | función con `"use server"` en el atributo `action` | módulo aparte | ❌ `revalidatePath` | avisa, no bloquea |
| **Astro** | un `if` sobre `Astro.request.method` | en la propia página | ❌ | ✅ 403 |
| **Nuxt** | una ruta de servidor escrita a mano | `server/routes/*.post.ts` | ❌ | ❌ |

Cinco lecturas:

- **Los cinco funcionan sin JavaScript, y eso no era obvio.** Ninguno de los
  cinco obliga a que el navegador ejecute nada para dar de alta una tarea. La
  mejora progresiva de la clase 081 no está en contra de estos frameworks: está
  dentro de ellos.
- **La columna de revalidar es la que separa a dos de los cinco.** Remix y
  SvelteKit saben que una escritura invalida una lectura porque conocen las dos
  funciones —es la consecuencia directa de la clase 097—. Los otros tres no lo
  saben, y hay que decírselo o volver a pedir la página.
- **Astro y SvelteKit vienen con protección contra falsificación encendida.** Es
  la mejor noticia de la clase y la que más 403 cuesta descubrir. Nuxt y Remix no
  la traen: en esos hay que ponerla, y la clase 080 explica cómo.
- **La sintaxis más bonita no es la que menos código pide.** La de Next es la más
  elegante —una función pasada donde iba una URL— y es la única que necesita una
  línea extra para que la lista se refresque.
- **Nuxt es el único sin nada específico.** Una ruta de servidor con `.post` en
  el nombre y un formulario con `action` explícito. Funciona en todas partes, no
  hay nada que aprender, y no hay nada que el framework pueda hacer por ti.

## ⚠️ Errores frecuentes

- **Un botón con un manejador en lugar de un formulario.** Se ve igual, funciona
  igual mientras haya JavaScript, y deja de funcionar cuando no lo hay. La prueba
  es la de esta clase: apagarlo y pulsar.
- **Confiar en la validación del navegador.** `required` en el `<input>` no
  protege nada: el POST del caso 5 llega igual. Validar en el servidor no es
  duplicar; es el único sitio donde vale.
- **Olvidar `revalidatePath` en Next.** El alta funciona, la lista no se entera,
  y el error parece de caché. Es de contrato: nadie dijo que esa escritura
  afectara a esa lectura.
- **Devolver la página en lugar de redirigir.** Sin el patrón enviar-redirigir-
  mostrar de la clase 080, recargar reenvía el formulario y crea la tarea dos
  veces.
- **Suponer que el estado en memoria es uno solo.** En Nuxt, la página y las
  rutas de servidor viven en dos paquetes distintos, y un módulo importado desde
  los dos sitios existe dos veces.

## ✅ Verificación

```bash
node scripts/run-class.mjs 098
```

Para hacerlo tú, la comprobación que descubre los formularios falsos:

```bash
curl -s http://127.0.0.1:4100/tareas | grep -o "<form[^>]*>"
```

Si no sale un `<form>` con `method` de escritura, esa pantalla necesita
JavaScript para funcionar.

## 🧪 Reto de transferencia

1. **Apaga el JavaScript y usa tu aplicación.** No para dejarla así: para saber
   cuántas cosas dejan de funcionar. La lista suele ser más corta de lo que se
   teme y más larga de lo que se cree.
2. **Manda un POST vacío a tu alta.** Con `curl`, saltándote el `required` del
   navegador. Si crea el registro, tienes validación solo en el cliente.
3. **Comprueba tu protección de origen.** Manda un POST de formulario sin
   cabecera `Origin`. Si pasa, tu aplicación acepta envíos desde cualquier sitio
   y te toca la clase 080.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 080](../../parte-6-la-interfaz/080-formularios-que-funcionan-sin-javascript/README.md) — el patrón enviar-redirigir-mostrar y el testigo
- [Clase 081](../../parte-6-la-interfaz/081-mejora-progresiva/README.md) — funcionar primero, mejorar después
- [Clase 097](../097-carga-de-datos-junto-a-la-ruta/README.md) — la mitad que lee
- [Clase 099](../099-la-cascada-de-peticiones/README.md) — cuando una carga espera a otra
- [Índice de la parte 7](../README.md)

## Fuentes

- [@remix-docs] *Remix — Documentación oficial* — <https://remix.run/docs>
- [@sveltekit-docs] *SvelteKit — Documentación oficial* — <https://svelte.dev/docs/kit>
- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
- [@nuxt-docs] *Nuxt — Documentación oficial* — <https://nuxt.com/docs>
- [@astro-docs] *Astro — Documentación oficial* — <https://docs.astro.build/>
- [@owasp-top10] *OWASP Top 10*. OWASP Foundation — <https://owasp.org/www-project-top-ten/>
