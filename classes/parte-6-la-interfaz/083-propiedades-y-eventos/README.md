# Clase 083 — Propiedades y eventos

> [⬅️ 082](../082-el-primer-componente/README.md) · [📚 Parte 6](../README.md) · [🎓 Clases](../../README.md) · [084 ➡️](../084-estado-local/README.md)
>
> Parte **6 — La interfaz: del HTML del servidor al componente** · Nivel **🟢 introductorio** · Pista **`frontend`** (Interfaz y componentes)
>
> ✅ **Clase construida** — 8 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

**Datos hacia abajo, avisos hacia arriba.** La regla que organiza la
comunicación entre componentes en las ocho tecnologías, y las cinco formas
distintas de implementarla.

Un padre con un valor, un hijo con dos botones. El hijo **no cambia el valor**:
avisa de cuánto quiere cambiarlo, y el padre decide.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Diseñar** la interfaz de un componente: qué entra, qué sale y quién decide.
- **Explicar** por qué el hijo no debe modificar lo que recibe, aunque
  técnicamente pueda.
- **Reconocer** los cinco mecanismos de subida: función que baja, evento
  declarado, evento del DOM, `EventEmitter` y petición.
- **Detectar** un componente mal diseñado por dónde vive la decisión.

## 🧩 La situación

El hijo tiene los botones. El padre tiene el número. ¿Quién suma?

Parece una pregunta de estilo y no lo es: si el hijo suma, el hijo necesita
poder escribir en el estado del padre — y a partir de ahí, cualquier componente
de la aplicación puede cambiar cualquier cosa desde cualquier sitio. Es
exactamente el problema que los frameworks de interfaz vinieron a resolver.

La respuesta, en las ocho: **suma el padre**. El hijo solo dice «+1».

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /` | el hijo recibe el valor por una propiedad |
| 2 | `GET /?valor=7` | otro valor por la misma propiedad |
| 3 | `GET /evento?valor=7&paso=3` | **el manejador del padre produce `10`** |
| 4 | `GET /evento?valor=7&paso=-2` | y `5`: el hijo solo dice cuánto |
| 5 | `GET /flujo.json` | qué recibe y qué emite, leído de su archivo |

**Lo que este contrato no comprueba, y conviene decirlo antes que nada:** el
clic. Disparar un evento en el navegador necesita un navegador, y eso llega en
la clase 128 con pruebas de extremo a extremo.

Lo que sí comprueba es la otra mitad — **la que se diseña mal**: que el dato baje
por una propiedad, que el hijo no la toque, y que el manejador del padre **el de
verdad, el que está en su archivo** produzca el estado nuevo cuando se le llama.

Y esa separación no es un truco para poder verificarlo. Una función que calcula
el estado siguiente a partir del actual y de un evento **se puede probar sola**,
sin framework y sin navegador. Es la misma idea que hay detrás de un reductor, y
es buena práctica en las ocho.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Propiedad**](../../../glosario/README.md#propiedad) *(Prop)* | Un dato que un componente recibe de quien lo usa. Es de solo lectura desde dentro: modificarla rompe la dirección única del flujo de datos. |
| [**Evento**](../../../glosario/README.md#evento) | El aviso que un componente emite hacia arriba para que quien lo usa decida qué hacer. Es la otra mitad de «hacia abajo datos, hacia arriba eventos»: el hijo no cambia lo que recibe, avisa de que algo pasó. |

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
| `Contador.mjs` | código JavaScript (módulo ES) |
| `Padre.mjs` | código JavaScript (módulo ES) |
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
| `Contador.mjs` | código JavaScript (módulo ES) |
| `Padre.mjs` | código JavaScript (módulo ES) |
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
| `src/contador.component.ts` | código TypeScript |
| `src/main.ts` | código TypeScript |
| `src/padre.ts` | código TypeScript |
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
| `Contador.svelte` | componente de Svelte |
| `Padre.mjs` | código JavaScript (módulo ES) |
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
| `Contador.mjs` | código JavaScript (módulo ES) |
| `Padre.mjs` | código JavaScript (módulo ES) |
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
| `Contador.mjs` | código JavaScript (módulo ES) |
| `Padre.mjs` | código JavaScript (módulo ES) |
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
| `contador.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `padre.mjs` | código JavaScript (módulo ES) |
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
| `contador.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `padre.mjs` | código JavaScript (módulo ES) |
| `server.mjs` | código JavaScript (módulo ES) |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Cinco mecanismos distintos para la misma regla.

### React · [`react/Contador.mjs`](implementaciones/react/Contador.mjs) y [`react/Padre.mjs`](implementaciones/react/Padre.mjs)

**El canal de subida es una función que baja:**

```javascript
export function Contador({ valor, alCambiar }) {
  return h(
    "div",
    { "data-hijo": "contador", "data-valor": String(valor) },
    h("span", null, String(valor)),
    h("button", { onClick: () => alCambiar(1) }, "+1"),
    h("button", { onClick: () => alCambiar(-1) }, "-1"),
  );
}
```

```javascript
 * En React el canal de subida es **una función que baja como una propiedad
 * más**. No hay mecanismo aparte: `alCambiar` es igual que `valor`, solo que
 * resulta ser invocable.
```

Y la regla, escrita donde se aplica:

```javascript
 * Y aquí está la regla que organiza toda la comunicación entre componentes:
 * **el hijo no cambia el valor**. Lo muestra, y cuando el usuario pulsa el
 * botón, llama a la función que le dieron para avisar de cuánto quiere
 * cambiarlo.
 *
 * Quién decide es el padre. El hijo ni siquiera sabe qué va a pasar con su
 * aviso — puede que el padre sume, puede que ignore, puede que pida
 * confirmación. Esa ignorancia es lo que hace al hijo reutilizable.
```

**El manejador, separado a propósito:**

```javascript
export function alRecibirCambio(valorActual, paso) {
  return valorActual + paso;
}
```

### Vue · [`vue/Contador.mjs`](implementaciones/vue/Contador.mjs)

**El evento se declara, igual que la propiedad:**

```javascript
  props: {
    valor: { type: Number, required: true },
  },
  emits: ["cambiar"],
```

```javascript
 * Aquí está la diferencia con React, y es de las que se notan en un equipo:
 * `emits: ["cambiar"]` es **un contrato de salida declarado**. Cualquiera que
 * abra el archivo sabe qué eventos puede escuchar sin leer el cuerpo del
 * componente.
```

```javascript
        h("button", { onClick: () => this.$emit("cambiar", 1) }, "+1"),
```

Y Vue defiende la regla más que ninguno:

```javascript
 * La regla de fondo es la misma que en las ocho: **el hijo no cambia la
 * propiedad**. Vue lo lleva más lejos que casi ninguna — en desarrollo, mutar
 * una propiedad desde el hijo produce un aviso en la consola.
```

### Angular · [`angular/src/contador.component.ts`](implementaciones/angular/src/contador.component.ts)

**Cada dirección tiene su decorador:**

```typescript
export class ContadorComponent {
  @Input() valor = 0;
  @Output() cambiar = new EventEmitter<number>();
}
```

```typescript
 * Angular es el único de los ocho donde las dos direcciones tienen **su propio
 * decorador**, y eso hace el contrato del componente legible de un vistazo: la
 * lista de entradas y la de salidas están una encima de la otra.
```

Y la sintaxis del padre lo dice con puntuación —
[`angular/src/main.ts`](implementaciones/angular/src/main.ts):

```typescript
    // `(cambiar)` escucha la salida del hijo. Los paréntesis son la mitad de
    // arriba de la sintaxis de Angular: `[propiedad]` baja, `(evento)` sube, y
    // `[(ngModel)]` —los dos juntos— es el atajo de las dos direcciones que la
    // clase 086 desmonta.
```

Con una nota sobre el peso:

```typescript
 * `EventEmitter` es un objeto de RxJS por debajo. Suena a mucho para emitir un
 * número, y lo es — pero significa que la salida de un componente es un flujo
 * observable, con todo lo que RxJS trae detrás.
```

### Svelte · [`svelte/Contador.svelte`](implementaciones/svelte/Contador.svelte)

```svelte
  let { valor, alCambiar } = $props();
```

```svelte
  // En Svelte 5 los eventos personalizados se fueron: lo que antes era
  // `createEventDispatcher` ahora es una propiedad que resulta ser función,
  // exactamente como en React. Es uno de los cambios más discutidos de la
  // versión 5, y la razón es la simetría — un solo canal en lugar de dos.
```

Un framework que **quitó** su mecanismo de eventos para parecerse a React es un
dato sobre hacia dónde va el ecosistema, y merece verse en el archivo.

### SolidJS · [`solid/Contador.mjs`](implementaciones/solid/Contador.mjs)

Se parece a React y tiene una trampa que no perdona:

```javascript
export function Contador(props) {
  const valor = () => props.valor;
```

```javascript
 * Es la trampa número uno de quien llega desde React: escribir
 * `function Contador({ valor })` rompe la reactividad de Solid, porque
 * desestructurar lee el valor UNA VEZ y se queda con esa copia.
 *
 * En React eso no importa —la función se vuelve a llamar entera en cada
 * cambio—; en Solid la función se llama una sola vez, así que hay que leer
 * `props.valor` en el momento de usarlo. De ahí el `() =>` de abajo.
```

**Es la clase 005 en estado puro:** código que parece de React, escrito en Solid,
que compila y funciona hasta que algo cambia.

### Lit · [`lit/Contador.mjs`](implementaciones/lit/Contador.mjs)

**El canal de subida ya existía:**

```javascript
  avisar(paso) {
    // El hijo NO cambia `this.valor`. Emite y se olvida.
    this.dispatchEvent(
      new CustomEvent("cambiar", { detail: paso, bubbles: true, composed: true }),
    );
  }
```

```javascript
 * Aquí está la diferencia grande de Lit con los otros siete: el canal de subida
 * no lo inventa el framework, **ya existe**. `CustomEvent` y `dispatchEvent` son
 * del estándar del DOM desde siempre, y el padre lo escucha con
 * `addEventListener` como escucharía un clic.
```

Con dos consecuencias que hay que conocer:

```javascript
 *   - el evento BURBUJEA si se lo pides (`bubbles: true`), como cualquier evento
 *     nativo, así que puede escucharlo un ancestro lejano — para bien y para mal;
 *   - `composed: true` hace falta para que atraviese el DOM en la sombra, y
 *     olvidarlo es uno de los fallos clásicos de los componentes web.
```

### Alpine.js · [`alpinejs/contador.mjs`](implementaciones/alpinejs/contador.mjs)

El mismo mecanismo que Lit, declarado en un atributo:

```javascript
    `<button x-on:click="$dispatch('cambiar', 1)">+1</button>` +
```

```javascript
 * La diferencia con Lit no es el mecanismo, es dónde se declara: allí en una
 * clase, aquí en un atributo. El canal es el mismo evento del DOM.
```

Y el padre escucha en el marcado —
[`alpinejs/server.mjs`](implementaciones/alpinejs/server.mjs):

```javascript
// El padre escucha el evento que burbujea y decide. `$event.detail` trae el
// paso; el padre suma. La misma división que en las otras siete, escrita en un
// atributo en lugar de en un archivo.
```

### htmx · [`htmx/contador.mjs`](implementaciones/htmx/contador.mjs)

**El aviso es una petición:**

```javascript
    `<button hx-get="/evento?valor=${v}&paso=1" hx-target="closest [data-padre]">+1</button>` +
```

```javascript
 * En htmx no hay propiedades ni eventos: hay **una petición**. El dato baja
 * porque el servidor lo escribe en el fragmento, y el aviso sube porque el botón
 * lleva `hx-get` con el paso dentro de la dirección.
 *
 * Eso convierte el flujo de datos de esta clase en algo mucho más familiar de lo
 * que parece: **es el mismo de la web de 1995**, con la diferencia de que en vez
 * de recargar la página entera se sustituye un trozo.
```

Y la ventaja que compensa la ida y vuelta:

```javascript
 * Y tiene una propiedad que ninguno de los otros siete tiene: el estado vive en
 * un solo sitio —el servidor—, así que no hay dos verdades que sincronizar.
 * Se paga con una ida y vuelta por cada cambio.
```

La ruta que sirve a los dos clientes —
[`htmx/server.mjs`](implementaciones/htmx/server.mjs):

```javascript
    // LA MISMA RUTA SIRVE PARA LAS DOS COSAS.
    //
    // El contrato la pide como JSON para comprobar el manejador; htmx la pide
    // como HTML para pegar el fragmento nuevo. Es la bifurcación de la clase
    // 081, aplicada a un componente.
```

## 🔬 Comparación

| | Datos hacia abajo | Avisos hacia arriba | ¿Se declara la salida? |
| --- | --- | --- | :---: |
| **React** | propiedades | una función que baja | ❌ |
| **Vue** | `props` con tipo | `$emit` sobre un evento de `emits` | ✅ |
| **Angular** | `@Input()` | `@Output()` con `EventEmitter` | ✅ |
| **Svelte** | `$props()` | una función que baja | ❌ |
| **SolidJS** | `props`, que se **leen** | una función que baja | ❌ |
| **Lit** | `static properties` | `CustomEvent` del DOM | ❌ |
| **Alpine.js** | `x-data` | `$dispatch` → `CustomEvent` | ❌ |
| **htmx** | el fragmento del servidor | **una petición** | ❌ |

Tres cosas que se leen de la tabla:

- **Cinco mecanismos, una sola regla.** El hijo nunca decide. Cambia cómo avisa,
  no quién manda — y eso vale igual para el que manda una petición HTTP.
- **Solo dos declaran su salida.** Vue y Angular te dicen qué eventos emite un
  componente sin abrir su cuerpo; en los otros seis hay que buscarlo. Con
  componentes ajenos, esa diferencia se nota.
- **Los dos que usan `CustomEvent` heredan el burbujeo.** Es potente —un
  ancestro lejano puede escuchar— y es una fuga: el evento llega a sitios que no
  lo esperaban. Los mecanismos propios del framework no burbujean, y eso los hace
  más aburridos y más predecibles.

## ⚠️ Errores frecuentes

- **Mutar la propiedad en el hijo.** Técnicamente se puede en varias. Vue avisa
  en la consola; los demás, no — y el fallo aparece cuando dos hijos comparten
  el mismo objeto.
- **Desestructurar `props` en Solid.** Compila, funciona la primera vez y no
  vuelve a reaccionar. Es el error más caro de esta clase.
- **Olvidar `composed: true` en Lit.** El evento no sale del DOM en la sombra y
  el padre no se entera nunca. No hay error: simplemente no pasa nada.
- **Dejar la decisión en el hijo «porque es más cómodo».** Lo es, hasta que dos
  padres distintos quieren usar el mismo hijo con reglas distintas.
- **Confundir declarar la salida con validarla.** `emits` y `@Output()` dicen qué
  eventos hay, no qué llevan dentro. El contenido sigue siendo cosa tuya.

## ✅ Verificación

```bash
node scripts/run-class.mjs 083
```

Y para ver el flujo que declara cada una:

```bash
curl -s http://127.0.0.1:4100/flujo.json
```

## 🧪 Reto de transferencia

1. **Haz que el hijo sume.** Cambia una implementación para que el hijo modifique
   el valor y observa qué pasa —o qué no pasa— al renderizar dos veces.
2. **Cambia la regla del padre** para que ignore los pasos negativos. El hijo no
   se entera y sigue funcionando: eso es la prueba de que la frontera está bien
   puesta.
3. **Escribe la lista de eventos** que emiten los componentes de tu proyecto. Si
   tu framework no la declara, hacerla a mano es un ejercicio de arqueología
   revelador.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué gana y qué paga cada mecanismo
- [Clase 082](../082-el-primer-componente/README.md) — el componente antes de comunicarse
- [Clase 084](../084-estado-local/README.md) — cuando el estado se queda dentro
- [Clase 088](../088-estado-compartido/README.md) — cuando pasarlo hacia abajo deja de escalar
- [Índice de la parte 6](../README.md)

## Fuentes

- [@banks-porcello-learning-react] Banks, A.; Porcello, E. *Learning React*, 2.ª ed. O'Reilly Media, 2020. ISBN 9781492051725 — <https://openlibrary.org/isbn/9781492051725>
- [@macrae-vue-up-and-running] Macrae, Callum. *Vue.js: Up and Running*. O'Reilly Media, 2018. ISBN 9781491997246 — <https://openlibrary.org/isbn/9781491997246>
- [@mdn-web-docs] *MDN Web Docs*. Mozilla — <https://developer.mozilla.org/>
- [@solid-reactivity] *Intro to Reactivity*. SolidJS — <https://docs.solidjs.com/concepts/intro-to-reactivity>
- [@osmani-js-design-patterns] Osmani, Addy. *Learning JavaScript Design Patterns*, 2.ª ed. O'Reilly Media, 2023. ISBN 9781098139872 — <https://openlibrary.org/isbn/9781098139872>
