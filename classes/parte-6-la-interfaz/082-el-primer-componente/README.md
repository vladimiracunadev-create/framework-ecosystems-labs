# Clase 082 — El primer componente

> [⬅️ 081](../081-mejora-progresiva/README.md) · [📚 Parte 6](../README.md) · [🎓 Clases](../../README.md) · [083 ➡️](../083-propiedades-y-eventos/README.md)
>
> Parte **6 — La interfaz: del HTML del servidor al componente** · Nivel **🟢 introductorio** · Pista **`frontend`** (Interfaz y componentes)
>
> ✅ **Clase construida** — 8 implementaciones verificadas contra [`contrato.json`](contrato.json).

> 🖥️ **Ocho tecnologías de interfaz y ningún navegador.** Las ocho responden
> HTML por un puerto, así que el contrato las compara con las mismas peticiones
> que las 81 clases anteriores. Cómo se consigue eso con las que renderizan en
> el cliente está explicado abajo, y es media clase.

## 🎯 Objetivo

Escribir **el mismo componente ocho veces** —recibe un texto, lo muestra— y ver
qué es un componente en cada tecnología.

Porque no es lo mismo en todas: una función, un objeto, una clase, un archivo
propio, una etiqueta del navegador, un trozo de marcado o una función del
servidor. **Siete respuestas distintas a la misma palabra.**

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Escribir un componente** en cualquiera de las ocho, sin herramienta de
  construcción por delante.
- **Distinguir** las que se compilan de las que se interpretan, y por qué.
- **Explicar** por qué seis escapan el texto solas y dos no.
- **Reconocer** dónde ocurre el render en cada una: servidor, navegador o los
  dos.

## 🧩 La situación

El componente más pequeño que se puede escribir: recibe un texto y lo pone
dentro de un `<h1>`. Nada de estado, nada de eventos, nada de ciclo de vida —
eso son las clases 083 a 087.

Y aun así, ocho tecnologías lo resuelven de siete maneras distintas, con dos
diferencias que se ven ya: **quién escapa el texto** y **dónde ocurre el
render**.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /` | el componente con su texto por omisión |
| 2 | `GET /componente?texto=…` | el mismo componente con otro texto: **eso es una propiedad** |
| 3 | `GET /dos?a=…&b=…` | dos instancias con datos distintos |
| 4 | `GET /componente?texto=<script>…` | **el texto peligroso no se convierte en etiqueta** |
| 5 | `GET /componente.json` | cómo se escribe el componente, leído de su archivo |

**Las ocho responden HTML por el mismo puerto.** Seis lo renderizan en el
servidor; htmx devuelve un fragmento porque **eso es su modelo**; y Alpine.js
manda la plantilla con el texto ya puesto, porque su render ocurre en el
navegador y el contrato mira antes.

Y una nota sobre el caso 4 que salió al escribirlo: el contrato comprueba
`&lt;script` y no `&lt;script&gt;`. **React escapa también el cierre y Svelte
no**, y las dos cosas son correctas — en contenido de texto, escapar `>` es
opcional. Un contrato más estricto habría dado por rota una implementación
perfectamente segura.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Componente**](../../../glosario/README.md#componente) | Una unidad de interfaz con sus datos de entrada, su marcado y su comportamiento. Los datos entran por propiedades y los avisos salen por eventos: hacia abajo datos, hacia arriba eventos. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **React** | biblioteca de interfaz de JavaScript/TypeScript (JavaScript) | 2013 | MIT | Meta y colaboradores |
| **Vue** | framework de interfaz de JavaScript/TypeScript (JavaScript) | 2014 | MIT | proyecto independiente |
| **Angular** | framework de interfaz de TypeScript (TypeScript) | 2016 | MIT | Google y colaboradores |
| **Svelte** | framework de interfaz de JavaScript/TypeScript (JavaScript) | 2016 | MIT | proyecto independiente |
| **SolidJS** | biblioteca de interfaz de JavaScript/TypeScript (JavaScript) | 2018 | MIT | proyecto independiente |
| **Lit** | web-components-library de JavaScript/TypeScript (TypeScript) | 2021 | BSD-3-Clause | Google |
| **Alpine.js** | dom-library de JavaScript (JavaScript) | 2019 | MIT | proyecto independiente |
| **htmx** | hypermedia-library de JavaScript (JavaScript) | 2020 | BSD-2-Clause | proyecto independiente |

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
| `Saludo.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

### 🔧 Vue

Adopción progresiva: sirve como etiqueta en una página existente o como framework completo. Su reactividad fina influyó en toda la generación siguiente.

- **Documentación oficial:** <https://vuejs.org/guide/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `vue ^3.5.0, @vue/server-renderer ^3.5.0`
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
| `Saludo.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

### 🔧 Angular

Framework completo con contenedor de dependencias, enrutado, formularios y herramientas en la caja. La opinión arquitectónica más fuerte del ecosistema JavaScript.

- **Documentación oficial:** <https://angular.dev/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `@angular/common ^19.2.0, @angular/compiler ^19.2.0, @angular/core ^19.2.0, @angular/platform-browser ^19.2.0, @angular/platform-server ^19.2.0, rxjs ^7.8.2, zone.js ^0.15.0, typescript ^5.6.3, @types/node ^24.7.0`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
pnpm exec tsc -p tsconfig.json
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node dist/main.js
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `src/main.ts` | código TypeScript |
| `src/saludo.component.ts` | código TypeScript |
| `tsconfig.json` | configuración del compilador de TypeScript |

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
| `Saludo.svelte` | componente de Svelte |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

### 🔧 SolidJS

Reactividad de grano fino sin árbol virtual: el componente se ejecuta una vez y solo se actualiza lo que leyó el valor cambiado.

- **Documentación oficial:** <https://docs.solidjs.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `solid-js ^1.9.0`
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
| `Saludo.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

### 🔧 Lit

Capa mínima sobre los componentes web del propio estándar. La apuesta por la plataforma en lugar de por el framework.

- **Documentación oficial:** <https://lit.dev/docs/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `lit ^3.2.0, @lit-labs/ssr ^3.3.0`
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
| `Saludo.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
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
| `saludo.mjs` | código JavaScript (módulo ES) |
| `server.mjs` | código JavaScript (módulo ES) |

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
| `saludo.mjs` | código JavaScript (módulo ES) |
| `server.mjs` | código JavaScript (módulo ES) |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Ocho veces el mismo componente. Están en orden de más a menos framework.

### Angular · [`angular/src/saludo.component.ts`](implementaciones/angular/src/saludo.component.ts)

**El componente es una clase con un decorador:**

```typescript
@Component({
  selector: "mi-saludo",
  standalone: true,
  template: `<h1 data-componente="saludo">{{ texto }}</h1>`,
})
export class SaludoComponent {
  @Input() texto = "Hola, mundo";
}
```

Es el más declarado de los ocho: `selector` dice con qué etiqueta se usa,
`template` qué dibuja, `@Input()` qué entra.

```typescript
 * Ese `standalone: true` es historia reciente. Hasta Angular 14, todo componente
 * tenía que declararse en un `NgModule`, y esa ceremonia era la queja número uno
 * del framework. Hoy es el valor por omisión.
```

**Y renderizarlo no es llamar a una función** — [`angular/src/main.ts`](implementaciones/angular/src/main.ts):

```typescript
 * Angular no renderiza un componente suelto: renderiza una APLICACIÓN.
 *
 * Hay que envolverlo en un componente raíz, arrancar la aplicación y esperar a
 * que el framework termine su ciclo. Es el paso extra que en React no existe —y
 * la razón es la misma que en Vue, solo que más marcada: el componente vive
 * dentro de algo que lo gobierna.
```

```typescript
  return renderApplication((contexto) => bootstrapApplication(Raiz, { providers: [] }, contexto), {
    document: documento,
  });
```

```typescript
  // El `contexto` no es opcional en el servidor: lleva la plataforma que
  // `renderApplication` acaba de crear. Sin pasarlo, Angular falla con NG0401 —
  // «Missing Platform», que es de los errores que más cuesta interpretar
  // cuando uno viene de React y esperaba una función suelta.
```

### Vue · [`vue/Saludo.mjs`](implementaciones/vue/Saludo.mjs)

**Un objeto que declara sus propiedades:**

```javascript
export const Saludo = {
  name: "Saludo",
  props: {
    texto: { type: String, default: "Hola, mundo" },
  },
  render() {
    return h("h1", { "data-componente": "saludo" }, this.texto);
  },
};
```

```javascript
 * Aquí está la primera diferencia con React: las propiedades **se declaran**.
 * `props: { texto: { ... } }` no es documentación, es la lista de lo que el
 * componente acepta — Vue usa esa lista para separar propiedades de atributos
 * sueltos, y para avisar cuando falta una obligatoria.
```

Y el componente vive dentro de una aplicación, como en Angular aunque con menos
ceremonia — [`vue/server.mjs`](implementaciones/vue/server.mjs):

```javascript
const render = (nodo) => renderToString(createSSRApp({ render: () => nodo }));
```

### React · [`react/Saludo.mjs`](implementaciones/react/Saludo.mjs)

**Una función. Eso es todo:**

```javascript
export function Saludo({ texto = "Hola, mundo" }) {
  return h("h1", { "data-componente": "saludo" }, texto);
}
```

```javascript
 * En React no hay nada más: no hereda de ninguna clase, no se registra en
 * ningún sitio y no se declara en ningún archivo de configuración. Es una
 * función, y por eso se puede probar llamándola.
```

Sin declaración de propiedades, sin registro, sin aplicación alrededor —
[`react/server.mjs`](implementaciones/react/server.mjs):

```javascript
    servir(respuesta, pagina(renderToStaticMarkup(h(Saludo, {}))));
```

Compáralo con las dos anteriores: **es la diferencia entre una biblioteca y un
framework**, exactamente como la definió la clase 001.

### Solid · [`solid/Saludo.mjs`](implementaciones/solid/Saludo.mjs)

Se parece a React y no funciona como React:

```javascript
export function Saludo(props) {
  const texto = () => props.texto ?? "Hola, mundo";
  return ssr(
    ['<h1 data-componente="saludo">', "</h1>"],
    escape(texto()),
  );
}
```

```javascript
 * Aquí está la diferencia que define a Solid, y no se ve en un componente tan
 * pequeño como este: en React esta función se vuelve a llamar cada vez que el
 * estado cambia; en Solid **se llama una sola vez** y lo que se actualiza
 * después son los huecos concretos del marcado.
```

Y una consecuencia visible ya: **el escapado es una llamada explícita**,
`escape(...)`, en el código que el compilador genera. En React lo hace el motor
al renderizar; aquí está escrito.

### Svelte · [`svelte/Saludo.svelte`](implementaciones/svelte/Saludo.svelte)

**Un archivo propio, con marcado y script juntos:**

```svelte
<script>
  // EL COMPONENTE. Un archivo, con su marcado y su script juntos.
  //
  // `$props()` es la runa de Svelte 5 para declarar lo que entra. La
  // desestructuración con valor por omisión es JavaScript corriente: aquí no
  // hay un objeto de configuración ni una lista de propiedades aparte.
  let { texto = "Hola, mundo" } = $props();
</script>

<h1 data-componente="saludo">{texto}</h1>
```

Y esto no es JavaScript: hay que compilarlo —
[`svelte/server.mjs`](implementaciones/svelte/server.mjs):

```javascript
 * Los otros siete llevan su motor al sitio donde se ejecutan: React, Vue, Solid
 * y Lit envían una biblioteca al navegador que interpreta el componente en
 * tiempo de ejecución. Svelte no: **traduce el componente a código** durante la
 * compilación, y lo que se envía es ese código.
```

```javascript
const { js } = compile(fuente, { generate: "server", name: "Saludo" });
```

El paso de compilación está **a la vista**, en el arranque del servidor, en lugar
de escondido en una herramienta de construcción. Es el mismo trabajo que hace
Vite en un proyecto real.

### Lit · [`lit/Saludo.mjs`](implementaciones/lit/Saludo.mjs)

**Aquí el componente es una etiqueta HTML nueva:**

```javascript
export class Saludo extends LitElement {
  static properties = {
    texto: { type: String },
  };
```

```javascript
customElements.define("mi-saludo", Saludo);
```

```javascript
 * Aquí está la diferencia grande de Lit con los otros siete: lo que se define no
 * es una función ni un objeto del framework, es **una etiqueta HTML nueva**.
 * `<mi-saludo texto="...">` funciona en cualquier página, con o sin Lit
 * alrededor, porque los elementos personalizados son parte del estándar del
 * navegador desde 2018.
```

Y esa ventaja tiene su factura en el servidor —
[`lit/server.mjs`](implementaciones/lit/server.mjs):

```javascript
import "@lit-labs/ssr/lib/install-global-dom-shim.js";
```

```javascript
// El apaño de DOM tiene que instalarse ANTES de importar nada de Lit: define
// `HTMLElement`, `customElements` y compañía, que en Node no existen. Un
// elemento personalizado es del navegador, así que renderizarlo en el servidor
// exige fingir que hay uno.
```

También merece leerse la decisión sobre el DOM en la sombra:

```javascript
  // `createRenderRoot` devolviendo el propio elemento desactiva el DOM en la
  // sombra. Sin esto, el marcado quedaría dentro de un `<template shadowroot>`
  // y el contrato —que mira el HTML como texto— vería otra cosa.
```

### Alpine.js · [`alpinejs/saludo.mjs`](implementaciones/alpinejs/saludo.mjs)

**El componente es un trozo de marcado con un atributo:**

```javascript
export function saludo(texto = "Hola, mundo") {
  const estado = paraAtributo(JSON.stringify({ texto }));
  return `<div x-data="${estado}"><h1 data-componente="saludo" x-text="texto">${paraTexto(texto)}</h1></div>`;
}
```

```javascript
 * Alpine no tiene archivos de componente ni funciones de render. Un componente
 * es **un trozo de HTML con `x-data`**, y el ámbito de esa variable es ese
 * elemento y todo lo que cuelga de él.
```

**Y aquí aparece la diferencia que ninguna de las seis anteriores tiene:**

```javascript
 * DOS CONTEXTOS, DOS ESCAPADOS.
 *
 * El mismo texto va a un atributo de HTML y al contenido de un elemento, y no
 * se escapan igual: dentro de un atributo entrecomillado, la comilla cierra el
 * atributo; dentro del texto, no significa nada.
```

Por eso hay dos funciones de escapado, y por eso el texto aparece dos veces en
el marcado: dentro de `x-data` para que Alpine lo tenga como estado, y dentro
del `<h1>` para que se vea antes de que cargue Alpine. **No es duplicación: es
mejora progresiva**, la clase 081 aplicada a este modelo.

### htmx · [`htmx/saludo.mjs`](implementaciones/htmx/saludo.mjs)

La implementación más corta, y la que más incomoda:

```javascript
export function saludo(texto = "Hola, mundo") {
  return `<h1 data-componente="saludo">${escapar(texto)}</h1>`;
}
```

```javascript
 * En los otros siete, el componente es una pieza que vive en el cliente y se
 * instancia allí. En htmx la pieza vive **en el servidor**: es una función que
 * devuelve un fragmento de HTML, y el navegador solo lo pega donde toque.
```

**Que sea la más corta no significa que sea la más simple**: significa que el
trabajo está en otro sitio — en el servidor, donde ya hay un lenguaje y un motor
de plantillas.

Y el aviso que la acompaña:

```javascript
 * Los otros siete frameworks escapan solos al interpolar. Aquí no hay quien lo
 * haga: si esta función no existiera, `<script>` llegaría al navegador como una
 * etiqueta de verdad.
```

En un proyecto real esto lo resuelve el motor de plantillas del servidor —Jinja,
Blade, ERB, Thymeleaf— que sí escapa por omisión. La clase 073 lo mide en cinco
de ellos.

## 🔬 Comparación

| | Qué es un componente | ¿Se compila? | ¿Dónde renderiza? | ¿Escapa solo? |
| --- | --- | :---: | --- | :---: |
| **Angular** | una clase con decorador | **sí, dos veces** | servidor y navegador | ✅ |
| **Vue** | un objeto con `props` y `render` | en la práctica sí (`.vue`) | servidor y navegador | ✅ |
| **React** | una función | en la práctica sí (JSX) | servidor y navegador | ✅ |
| **Solid** | una función que corre **una vez** | sí | servidor y navegador | ✅ (explícito) |
| **Svelte** | un archivo `.svelte` | **sí, obligatorio** | servidor y navegador | ✅ |
| **Lit** | una etiqueta HTML nueva | no | navegador; servidor con apaño | ✅ |
| **Alpine.js** | marcado con `x-data` | no | **solo navegador** | ❌ |
| **htmx** | una función del **servidor** | no | **solo servidor** | ❌ |

Cuatro lecturas de la tabla:

- **La palabra «componente» no significa lo mismo en las ocho.** Va de una clase
  con metadatos a una función de texto en el servidor. Cuando alguien compara
  «componentes» entre dos de ellas, conviene preguntar de cuál habla.
- **Compilar no es un defecto ni una virtud: es un momento.** Svelte y Solid
  mueven trabajo del navegador al momento de construir; Lit y Alpine no compilan
  nada y a cambio interpretan en el cliente. Las dos posturas tienen su factura.
- **Seis escapan solas y dos no**, y las dos que no son las que no renderizan.
  No es casualidad: **quien no controla el momento de interpolar no puede
  escapar por ti**. La seguridad de la interfaz depende de quién construye el
  marcado.
- **Angular es el único que no renderiza un componente suelto.** Necesita una
  aplicación arrancada. Es lo que la clase 001 llamó inversión de control,
  llevado hasta el final.

## ⚠️ Errores frecuentes

- **Creer que un componente es siempre una función.** En tres de las ocho no lo
  es, y el modelo mental cambia bastante.
- **Dar por hecho el escapado.** En Alpine y en htmx el escapado es tuyo, y en
  Alpine además depende del contexto. Es la puerta de la clase 073.
- **Confundir «no se compila» con «no hay paso de construcción».** Lit no
  compila plantillas, pero un proyecto real lo empaqueta igual.
- **Comparar el tamaño del código sin mirar dónde está el trabajo.** htmx tiene
  la implementación más corta y necesita un servidor que genere HTML.
- **Suponer que todo componente se puede renderizar en el servidor.** Alpine no,
  y Lit solo con un apaño que finge un navegador.

## ✅ Verificación

```bash
node scripts/run-class.mjs 082
```

Ocho implementaciones, cinco casos cada una. Todas necesitan Node.js; seis
además `pnpm` para instalar sus dependencias.

Para ver qué dice cada una de sí misma:

```bash
curl -s http://127.0.0.1:4100/componente.json
```

## 🧪 Reto de transferencia

1. **Escribe el mismo componente** en la tecnología que uses a diario y compara
   tu versión con la de aquí. Si la tuya necesita un archivo de configuración,
   averigua cuál y por qué.
2. **Quita el escapado** de la implementación de htmx o de Alpine y vuelve a
   ejecutar la clase. El caso 4 se pone en rojo — y eso es una vulnerabilidad de
   verdad, no un fallo de prueba.
3. **Mira el código que Svelte genera.** Está en `compilados/Saludo.js` después
   de arrancar. Ver en qué se convierte un `.svelte` explica su tesis mejor que
   cualquier comparativa.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué gana y qué paga cada modelo
- [Clase 081](../081-mejora-progresiva/README.md) — el caso base que Alpine y htmx respetan
- [Clase 073](../../parte-5-identidad-y-seguridad/073-xss-y-escapado/README.md) — qué pasa cuando el escapado falta
- [Clase 083](../083-propiedades-y-eventos/README.md) — el mismo componente, ahora comunicándose
- [Índice de la parte 6](../README.md)

## Fuentes

- [@banks-porcello-learning-react] Banks, A.; Porcello, E. *Learning React*, 2.ª ed. O'Reilly Media, 2020. ISBN 9781492051725 — <https://openlibrary.org/isbn/9781492051725>
- [@macrae-vue-up-and-running] Macrae, Callum. *Vue.js: Up and Running*. O'Reilly Media, 2018. ISBN 9781491997246 — <https://openlibrary.org/isbn/9781491997246>
- [@solid-reactivity] *Intro to Reactivity*. SolidJS — <https://docs.solidjs.com/concepts/intro-to-reactivity>
- [@mdn-web-docs] *MDN Web Docs*. Mozilla — <https://developer.mozilla.org/>
- [@frost-atomic-design] Frost, Brad. *Atomic Design*. 2016 — <https://atomicdesign.bradfrost.com/>
