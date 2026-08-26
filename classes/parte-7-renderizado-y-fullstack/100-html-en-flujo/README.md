# Clase 100 — HTML en flujo

> [⬅️ Clase 099](../099-la-cascada-de-peticiones/README.md) · [📚 Parte 7](../README.md) · [🎓 Clases](../../README.md) · [101 ➡️](../101-metadatos-y-descubribilidad/README.md)
>
> Parte **7 — Renderizado y full-stack** · Nivel **🔴 avanzado** · Pista **`fullstack`** (Renderizado y full-stack)
>
> ✅ **Clase construida** — 3 implementaciones verificadas contra [`contrato.json`](contrato.json).

> 👥 **Tres implementaciones, y el elenco es corto a propósito.** Astro y Nuxt
> saben enviar respuestas parciales, pero ninguno de los dos tiene una forma
> declarativa de decir «esta parte de la pantalla que llegue después». Sin eso, la
> comparación sería entre tres frameworks que resuelven el problema y dos que lo
> dejan en manos de quien escribe, y esa no es la comparación de esta clase.

## 🎯 Objetivo

La clase 099 arregló la cascada juntando peticiones. Queda la que no se puede
juntar: **una parte de la pantalla es lenta y punto**.

La respuesta es no esperarla. Mandar el documento con lo que ya se sabe, dejar
un hueco marcado, y enviar el contenido del hueco por el mismo canal cuando
esté. Una respuesta HTTP, dos tandas.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Medir un flujo desde fuera**, leyendo la respuesta a trozos, que es la única
  forma de verlo.
- **Declarar qué parte se aplaza** en los tres, y reconocer que dos de los tres
  lo dicen con un `await` que no se escribe.
- **Distinguir un flujo de HTML de un flujo de datos**, que se declaran igual y
  no son lo mismo.
- **Desconfiar de una medición hecha con una herramienta de línea de órdenes**,
  porque puede que el servidor te esté tratando como a un rastreador.

## 🧩 La situación

Una pantalla con dos partes. La cabecera se sabe al instante —el nombre está en
la sesión— y la lista tarda trescientos milisegundos.

Cada implementación la sirve dos veces: en `/flujo`, aplazando la lista; en
`/sin-flujo`, esperándola. **El HTML final es el mismo**. Lo que cambia es
cuándo llega cada mitad.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /flujo` | la cabecera y, al final, el dato de la lista |
| 2 | `GET /flujo` | y el texto de espera que ocupó el hueco |
| 3 | `GET /sin-flujo` | lo mismo **sin** texto de espera: nunca hubo hueco |
| 4 | `GET /flujo.json` | **la cabecera llega antes**, y sin flujo no |
| 5 | `GET /flujo.json` | los cronómetros marcaron algo en las dos pantallas |
| 6 | `GET /flujo.json` | cómo se pide el flujo y quién pinta la parte aplazada |

**Este contrato no puede medir el flujo por sí mismo**, y el motivo enseña algo:

```javascript
 * Y ahí está el motivo de que esta clase necesite su propio medidor en lugar de
 * usar el contrato tal cual: `await respuesta.text()` espera a que la respuesta
 * termine. Con eso, una respuesta que llegó en dos tandas y una que llegó de
 * golpe son indistinguibles — que es exactamente lo que esta clase quiere
 * distinguir.
```

Y las peticiones del contrato llevan una cabecera que no lleva ninguna otra
clase:

```json
        "cabeceras": { "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" }
```

Sin ella, Remix devuelve el documento entero y el caso 2 falla. No es un
capricho del ejercicio: es una decisión deliberada del framework, y está contada
abajo.

<!-- generado: fichas -->

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Next.js** | react-metaframework de JavaScript/TypeScript (TypeScript) | 2016 | MIT | Vercel |
| **Remix** | react-metaframework de JavaScript/TypeScript (TypeScript) | 2021 | MIT | proyecto independiente |
| **SvelteKit** | svelte-metaframework de JavaScript/TypeScript (TypeScript) | 2022 | MIT | proyecto independiente |

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
| `app/flujo.json/route.js` | código JavaScript |
| `app/flujo/page.js` | código JavaScript |
| `app/fuente.js` | código JavaScript |
| `app/layout.js` | código JavaScript |
| `app/medicion.js` | código JavaScript |
| `app/sin-flujo/page.js` | código JavaScript |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

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
| `app/fuente.js` | código JavaScript |
| `app/medicion.js` | código JavaScript |
| `app/root.jsx` | componente en JSX |
| `app/routes/flujo.jsx` | componente en JSX |
| `app/routes/flujo[.]json.js` | código JavaScript |
| `app/routes/sin-flujo.jsx` | componente en JSX |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |

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
| `src/lib/fuente.js` | código JavaScript |
| `src/lib/medicion.js` | código JavaScript |
| `src/routes/flujo.json/+server.js` | código JavaScript |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

### La fuente y el medidor, idénticos en los tres

[`nextjs/app/fuente.js`](implementaciones/nextjs/app/fuente.js):

```javascript
 * Sin flujo, la respuesta entera espera a la lista: la pantalla está en blanco
 * trescientos milisegundos aunque la mitad estuviera lista desde el principio.
 * Con flujo, la cabecera sale ya y la lista llega cuando llega.
```

Y el medidor, que lee a trozos —
[`nextjs/app/medicion.js`](implementaciones/nextjs/app/medicion.js):

```javascript
 * Así que se lee el cuerpo con un lector, trozo a trozo, y se anota el momento
 * en que aparece cada marca. Es lo mismo que hace un navegador, y es la única
 * forma de ver el flujo desde fuera.
```

**Con la marca que descubrió la diferencia de fondo:**

```javascript
 * `lista` busca el DATO —el texto de la primera tarea— porque el dato llega en
 * los tres frameworks, aunque no de la misma forma. `listaEnHtml` busca el
 * marcado, y ahí es donde se separan: hay quien manda el HTML ya construido y
 * quien manda solo el dato para que el navegador lo pinte. Los dos son flujo;
 * solo uno funciona sin JavaScript.
```

**Y el hallazgo que más se aprovecha fuera de aquí:**

```javascript
 * Remix decide si envía la respuesta en flujo o entera mirando esta cabecera:
 * a un rastreador le manda el documento completo, porque un buscador que lea
 * media página indexa media página. Sin cabecera, `isbot` da por hecho que quien
 * pide no es un navegador, y el flujo se apaga.
```

```javascript
 * Se descubre midiendo: con esta cabecera la cabecera llega a los treinta
 * milisegundos, sin ella a los trescientos sesenta. Es una decisión sensata del
 * framework y un aviso para cualquiera que mida rendimiento con una herramienta
 * de línea de órdenes: **puede que no estés midiendo lo que ve un navegador**.
```

### Next.js · una etiqueta alrededor de lo lento

[`nextjs/app/flujo/page.js`](implementaciones/nextjs/app/flujo/page.js):

```javascript
 * Sin ella, Next espera a que el árbol entero esté resuelto y manda el documento
 * completo. Con ella, manda todo lo que ya tiene —incluida la cabecera y el
 * texto de espera— y deja un hueco marcado; cuando `Lista` termina, manda un
 * segundo trozo con el contenido y una instrucción para colocarlo en su sitio.
```

```javascript
 * Es la misma pantalla, la misma consulta y el mismo total. Lo que cambia es
 * cuándo se ve la primera mitad, y eso es lo que mide la persona que espera.
```

Y el requisito de la parte lenta —
[`app/Lista.jsx`](implementaciones/nextjs/app/Lista.jsx):

```jsx
/** La parte lenta, en su propio componente. Que sea `async` y que esté aparte es
 *  todo lo que Next necesita para poder aplazarla. */
```

### SvelteKit · el `await` que no se escribe

[`sveltekit/src/routes/flujo/+page.server.js`](implementaciones/sveltekit/src/routes/flujo/+page.server.js):

```javascript
 * Lo que se devuelve resuelto —`nombre`— viaja en el primer trozo. Lo que se
 * devuelve como promesa —`tareas`— viaja después, cuando se resuelve, y
 * SvelteKit se encarga de coserlo.
```

```javascript
 * Es la declaración más discreta de las tres: no hay componente que envolver ni
 * etiqueta que añadir, solo un `await` que no se escribe. Y ahí está su riesgo,
 * que conviene decir: **quitar o poner ese `await` cambia el comportamiento de
 * la pantalla sin que se note al leer**.
```

Y la otra mitad, en la plantilla —
[`+page.svelte`](implementaciones/sveltekit/src/routes/flujo/+page.svelte):

```svelte
    `{#await}` es la otra mitad: mientras la promesa no se resuelve se pinta lo
    de en medio, y cuando llega se sustituye. Es el equivalente exacto de
    `<Suspense>`, escrito como una estructura de control del lenguaje de
    plantillas en lugar de como un componente.
```

### Remix · se declara igual que en SvelteKit y no hace lo mismo

[`remix/app/routes/flujo.jsx`](implementaciones/remix/app/routes/flujo.jsx):

```jsx
 * Con `v3_singleFetch`, una promesa devuelta por el `loader` no se espera: viaja
 * el resto de la respuesta y ella llega después. La declaración es la misma que
 * en SvelteKit —un `await` que no se escribe— y la forma de consumirla es la de
 * React: `<Suspense>` con `<Await>` dentro.
```

```jsx
 * Es un buen ejemplo de por qué comparar frameworks por su sintaxis engaña. La
 * decisión —qué se aplaza— se escribe igual en los dos; lo que cambia es quién
 * pinta la parte aplazada, y eso no se ve en el código.
```

## 🔬 Comparación

Medido leyendo la respuesta a trozos, en la misma máquina:

| | cabecera | lista | separación | sin flujo, la cabecera | ¿la lista llega **como HTML**? |
| --- | ---: | ---: | ---: | ---: | :---: |
| **Next.js** | 9 ms | 306 ms | 297 ms | 309 ms | ✅ |
| **SvelteKit** | 2 ms | 302 ms | 300 ms | 303 ms | ❌ **solo el dato** |
| **Remix** | 5 ms | 304 ms | 299 ms | 309 ms | ✅ |

Y cómo se pide en cada uno:

| | Cómo se declara | Quién pinta la parte aplazada |
| --- | --- | --- |
| **Next.js** | `<Suspense fallback={…}>` alrededor del componente lento | el servidor: manda el HTML ya construido |
| **SvelteKit** | no poniendo el `await` en `load` | **el navegador**: el servidor manda el dato |
| **Remix** | no poniendo el `await` en el `loader` | el servidor, con `<Await>` dentro de `<Suspense>` |

Cuatro lecturas:

- **Los tres cumplen lo prometido: la cabecera llega trescientos milisegundos
  antes.** Sin flujo, las dos partes llegan juntas al final. La diferencia no
  está en el total —que es el mismo— sino en cuándo se ve la primera mitad.
- **La última columna es la que no se ve en el código.** SvelteKit y Remix
  declaran el aplazamiento exactamente igual, con un `await` que no se escribe, y
  hacen cosas distintas: Remix manda el HTML de la lista ya construido y
  SvelteKit manda el dato para que el navegador lo pinte. Con el JavaScript
  apagado, en SvelteKit el hueco no se rellena nunca.
- **Eso no convierte a SvelteKit en peor.** Mandar el dato pesa menos y es lo
  correcto si la parte aplazada es interactiva de todos modos. Lo que hay que
  saber es cuál de las dos cosas hace tu framework, porque afecta a la clase 081
  y a la 101.
- **Remix apaga el flujo para quien no parezca un navegador.** Es una decisión
  deliberada y sensata —un buscador que lea media página indexa media página— y
  es la razón de que el contrato de esta clase mande una cabecera de agente de
  usuario que ninguna otra clase manda.

## ⚠️ Errores frecuentes

- **Medir un flujo con `await respuesta.text()`.** Espera al final: los dos
  casos salen iguales. Hay que leer a trozos.
- **Aplazar la parte que más se mira.** El flujo no hace nada más rápido: elige
  qué se ve antes. Aplazar la cabecera y enviar el pie primero es peor que no
  aplazar nada.
- **Aplazar sin dejar un hueco del tamaño correcto.** Si el texto de espera ocupa
  menos que el contenido, la página salta cuando llega. Es un fallo de estabilidad
  visual, y se arregla reservando el espacio.
- **Suponer que el flujo arregla una cascada.** No la arregla: la disimula. Tres
  peticiones en fila siguen tardando la suma; lo único que cambia es que se ve
  algo mientras tanto. La clase 099 es la que hay que aplicar primero.
- **Medir rendimiento con `curl` y creerse el número.** Puede que el servidor te
  esté tratando como a un rastreador y te esté mandando otra cosa. Aquí pasó, y
  la diferencia era de diez veces.

## ✅ Verificación

```bash
node scripts/run-class.mjs 100
```

Para verlo tú, con cualquiera arrancada, la forma más directa —`-N` desactiva el
almacenamiento intermedio de `curl`, así que el HTML aparece en pantalla en dos
tandas separadas por trescientos milisegundos:

```bash
curl -N -A "Mozilla/5.0 Chrome/120" http://127.0.0.1:4100/flujo
```

## 🧪 Reto de transferencia

1. **Encuentra tu parte lenta.** En tu pantalla más pesada, mira qué consulta
   marca el ritmo. Si es una sola y las demás son rápidas, esta clase es tuya.
2. **Aplázala y mide.** Con el medidor de aquí: leer a trozos y anotar cuándo
   aparece cada marca. El total no va a bajar; el primer pintado sí.
3. **Comprueba qué manda tu framework.** Apaga el JavaScript y pide la pantalla
   aplazada. Si el hueco no se rellena, tu framework manda el dato y no el
   marcado, y ya sabes con qué contar.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 081](../../parte-6-la-interfaz/081-mejora-progresiva/README.md) — qué pasa sin JavaScript
- [Clase 099](../099-la-cascada-de-peticiones/README.md) — arreglar la cascada antes de disimularla
- [Clase 101](../101-metadatos-y-descubribilidad/README.md) — lo que leen los buscadores
- [Índice de la parte 7](../README.md)

## Fuentes

- [@remix-docs] *Remix — Documentación oficial* — <https://remix.run/docs>
- [@sveltekit-docs] *SvelteKit — Documentación oficial* — <https://svelte.dev/docs/kit>
- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
- [@react-server-components] *React Server Components*. Meta — React — <https://react.dev/reference/rsc/server-components>
- [@wagner-web-performance] Wagner, Jeremy. *Web Performance in Action*. Manning Publications, 2016. ISBN 9781617293771 — <https://openlibrary.org/isbn/9781617293771>
