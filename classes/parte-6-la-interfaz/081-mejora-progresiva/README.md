# Clase 081 — Mejora progresiva

> [⬅️ 080](../080-formularios-que-funcionan-sin-javascript/README.md) · [📚 Parte 6](../README.md) · [🎓 Clases](../../README.md) · [082 ➡️](../082-el-primer-componente/README.md)
>
> Parte **6 — La interfaz** · Nivel **🟡 intermedio** · Pista **`frontend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Añadir comportamiento **sin romper el caso base**. La clase 080 construyó un
formulario que funciona solo; esta le pone JavaScript encima de forma que, si
el JavaScript no llega —red lenta, error de carga, bloqueador, lector
antiguo—, **el formulario sigue siendo el de la 080**
[@mdn-progressive-enhancement].

## 🧩 La situación

El mismo formulario de alta, dos vías:

- **Sin JavaScript**: envío clásico → `303` → recarga → la tarea está. El
  ciclo entero de la clase 080, intacto.
- **Con JavaScript**: el mismo envío, interceptado → el servidor responde un
  **fragmento** (HTML parcial o JSON) → la página se actualiza sin recargar.

Y la propiedad que define el patrón: **las dos vías escriben en el mismo
sitio**. No hay dos aplicaciones — hay una, con dos formas de hablarle.

## 🧮 El contrato

| Petición | Respuesta | Qué mide |
| --- | --- | --- |
| `GET /` | HTML con `method="post"`, `name="titulo"`, `type="submit"` | el caso base es un formulario de verdad |
| `POST /tareas` a secas | `302/303` + `Location` | sin JavaScript, el ciclo clásico |
| `GET /` | contiene la tarea | y funciona |
| el **mismo** `POST` con la señal de mejora | `200`, **sin** `Location`, un fragmento (no `<html`) con la tarea | con JavaScript, respuesta parcial |
| `GET /` | **las dos** tareas | las dos vías guardan en el mismo sitio |

El último caso es la esencia: si la vía mejorada guardara en otro almacén —o
no guardara—, las dos primeras tareas no convivirían en la misma página. Es
lo que separa la mejora progresiva de tener dos aplicaciones que se parecen.

## 🔬 Qué mide este contrato y qué no

Como en la 077: **la bifurcación vive en el servidor y eso es lo que se mide
sin navegador**. El envío clásico recibe redirección; el envío con la señal
de mejora (`HX-Request` para htmx, `Accept: application/json` para los
demás) recibe el fragmento. Que el JavaScript del cliente **use** bien ese
fragmento es trabajo del navegador y queda declarado, no medido — afirmar lo
contrario sería el verde vacío que este repositorio evita.

Lo que sí queda probado: el servidor sostiene **las dos conversaciones**
sobre el mismo estado, y el marcado base no depende de ninguna de ellas.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Mejora progresiva**](../../../glosario/README.md#mejora-progresiva) | Construir primero el caso que funciona sin JavaScript y añadir comportamiento encima. La propiedad que la define: si el JavaScript no llega, lo que queda **sigue funcionando** — la mejora es mejora, no requisito. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **htmx** | hypermedia-library de JavaScript (JavaScript) | 2020 | BSD-2-Clause | proyecto independiente |
| **Alpine.js** | dom-library de JavaScript (JavaScript) | 2019 | MIT | proyecto independiente |
| **Svelte** | framework de interfaz de JavaScript/TypeScript (JavaScript) | 2016 | MIT | proyecto independiente |
| **React** | biblioteca de interfaz de JavaScript/TypeScript (JavaScript) | 2013 | MIT | Meta y colaboradores |

### 🔧 htmx

Devuelve el estado al servidor: el HTML es la respuesta y los atributos deciden qué fragmento se reemplaza. Demuestra que la evolución del campo no es una línea recta hacia el cliente.

- **Documentación oficial:** <https://htmx.org/docs/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `sin dependencias: solo la biblioteca estándar`
- **Necesita en el PATH:** `node`

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node server.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `server.mjs` | código JavaScript (módulo ES) |

### 🔧 Alpine.js

Comportamiento declarativo en atributos HTML, sin fase de construcción. Recupera el modelo de trabajo de jQuery con el vocabulario reactivo moderno.

- **Documentación oficial:** <https://alpinejs.dev/start-here>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `sin dependencias: solo la biblioteca estándar`
- **Necesita en el PATH:** `node`

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node server.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
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
| `Pagina.svelte` | componente de Svelte |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

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

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las cuatro sirven **el mismo formulario base** —`method`, `action`, un `input`
con nombre: el de la clase 080— y le ponen la mejora encima. Lo que cambia es
**cómo se señala la mejora al servidor** y **qué vuelve**.

### htmx · [`htmx/server.mjs`](implementaciones/htmx/server.mjs)

```javascript
<form method="post" action="/tareas" hx-post="/tareas" hx-target="#lista" hx-swap="beforeend">
  <input name="titulo" value="">
  <button type="submit">Crear</button>
</form>
```

Mejora progresiva **con nombre de biblioteca**. Los atributos `hx-*` van
*encima* de `method` y `action`, no en su lugar: si htmx no carga, son texto
inerte que el navegador ignora y el formulario envía solo.

```javascript
      if (peticion.headers["hx-request"] === "true") {
        respuesta.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        respuesta.end(elemento(tarea));
      } else {
        respuesta.writeHead(303, { location: "/" });
        respuesta.end();
      }
```

La bifurcación entera, en siete líneas. La señal es `HX-Request`, que htmx pone
**siempre**, y lo que vuelve es **HTML listo para insertar** — el servidor sigue
siendo dueño del renderizado, como en la clase 079 [@gross-hypermedia-systems].

```javascript
function elemento(tarea) {
  return `<li data-id="${escapar(tarea.id)}">${escapar(tarea.titulo)}</li>`;
}
```

Una sola función pinta el elemento, y la usan las dos vías: la página completa
la llama en bucle y el fragmento la llama una vez. **Esa reutilización es lo que
garantiza que las dos vías no diverjan** — y el escapado, que la mejora no abra
la puerta que la 079 cerró.

### Alpine.js · [`alpinejs/server.mjs`](implementaciones/alpinejs/server.mjs)

```javascript
  <form method="post" action="/tareas"
        @submit.prevent="fetch('/tareas', { method: 'POST', headers: { accept: 'application/json' }, body: new FormData($el) }).then(r => r.json()).then(t => tareas.push(t))">
```

La misma idea con el estado en el cliente en vez de en el HTML.
`@submit.prevent` intercepta el envío **de este mismo formulario**, y `new
FormData($el)` recoge los campos del propio elemento — no hay una segunda
definición de qué se envía.

```javascript
      if ((peticion.headers.accept ?? "").includes("application/json")) {
        respuesta.writeHead(200, { "content-type": "application/json" });
        respuesta.end(JSON.stringify(tarea));
```

Aquí la señal no es una cabecera propia sino **negociación de contenido** — la
de la clase 018. Y lo que vuelve son **datos**, no marcado: el cliente los
convierte en `<li>`.

### React · [`react/server.mjs`](implementaciones/react/server.mjs)

```javascript
      h("form", { method: "post", action: "/tareas" },
        h("input", { name: "titulo", defaultValue: "" }),
        h("button", { type: "submit" }, "Crear"),
      ),
```

```javascript
    respuesta.end("<!DOCTYPE html>" + renderToStaticMarkup(h(Pagina)));
```

El formulario se sirve **renderizado, con `method` y `action` puestos**:
funciona antes de que cargue una sola línea de JavaScript. Es la idea que React
formalizó con las Server Actions —`<form action>` como caso base, hidratación
como mejora [@react-server-components]—, aquí sin meta-framework para que se vea
el mecanismo y no el azúcar.

`renderToStaticMarkup` y no `renderToString` es deliberado: esta clase mide el
caso *sin* JavaScript, y los marcadores de hidratación no aportan nada a esa
medición.

### Svelte · [`svelte/Pagina.svelte`](implementaciones/svelte/Pagina.svelte)

```svelte
<form method="post" action="/tareas">
  <input name="titulo" value="">
  <button type="submit">Crear</button>
</form>
```

El caso base, en el componente. En SvelteKit esta idea tiene **nombre propio**:
las *form actions* y `use:enhance` interceptan este mismo formulario cuando hay
JavaScript y lo dejan en paz cuando no — que es la definición operativa de
mejora progresiva [@mdn-progressive-enhancement].

Y en [`svelte/server.mjs`](implementaciones/svelte/server.mjs), la misma
bifurcación que Alpine y React:

```javascript
      if ((peticion.headers.accept ?? "").includes("application/json")) {
```

## 📊 Comparación

| Framework | Dónde vive la mejora | La señal al servidor | El fragmento de vuelta |
| --- | --- | --- | --- |
| htmx | atributos en el HTML | `HX-Request` | **HTML** listo para insertar |
| Alpine.js | atributos + expresiones | `Accept: json` | JSON que el cliente pinta |
| React | hidratación del componente | `Accept: json` | JSON que el cliente pinta |
| Svelte | `use:enhance` (SvelteKit) | `Accept: json` | JSON que el cliente pinta |

La columna del fragmento parte el elenco en dos filosofías: htmx devuelve
**HTML** —el servidor sigue siendo dueño del renderizado, como en la 079— y
los otros tres devuelven **datos** que el cliente convierte en marcado. Es
la frontera exacta donde la parte 6 cambia de mundo: a partir de la clase
082, el renderizado se muda al cliente, y esta clase es el puente.

## ⚠️ Errores frecuentes

- **`onSubmit` + `preventDefault` sin `method` ni `action`.** El formulario
  que solo funciona con JavaScript no es mejora progresiva: es la versión
  rota del caso base con pasos extra.
- **Dos endpoints distintos para las dos vías.** El quinto caso del contrato
  existe por esto: acaban divergiendo — validación distinta, bugs distintos.
- **Detectar la mejora con `X-Requested-With` casero.** Las señales
  estándar existen: la cabecera de htmx, la negociación de contenido de la
  clase 018.
- **Probar solo la vía mejorada.** El caso base se rompe en silencio porque
  nadie con JavaScript lo vuelve a pisar. El contrato de esta clase lo pisa
  primero.
- **Confundir «funciona sin JavaScript» con «no usa JavaScript».** La mejora
  es deseable — el punto es que sea *mejora* y no *requisito*.

## ✅ Verificación

```bash
node scripts/run-class.mjs 081
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta
las implementaciones que encuentre y declara las que omitió.

## 🧪 Reto de transferencia

Añade el borrado: un botón por tarea que sin JavaScript es un mini-formulario
`POST /tareas/{id}/borrar` con su redirección, y con la mejora responde el
fragmento vacío (htmx: `hx-swap="delete"`). Mide con el contrato que las dos
vías borran **la misma tarea del mismo almacén** — el quinto caso de esta
clase, en espejo.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 080 — Formularios que funcionan sin JavaScript](../080-formularios-que-funcionan-sin-javascript/README.md) — el caso base
- [Clase 082 — El primer componente](../082-el-primer-componente/README.md) — el otro lado del puente

## Fuentes

- [@mdn-progressive-enhancement] *Progressive Enhancement*. MDN Web Docs — <https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement>
- [@gross-hypermedia-systems] Gross, C.; Stepinski, A.; Akşimşek, D. *Hypermedia Systems*. Big Sky Software, 2024. ISBN 9798990991804 — <https://openlibrary.org/isbn/9798990991804>
- [@react-server-components] *React Server Components*. React — <https://react.dev/reference/rsc/server-components>
- [@htmx-essays] *htmx Essays*. — <https://htmx.org/essays/>
