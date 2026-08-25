# Clase 084 — Estado local

> [⬅️ 083](../083-propiedades-y-eventos/README.md) · [📚 Parte 6](../README.md) · [🎓 Clases](../../README.md) · [085 ➡️](../085-listas-y-claves/README.md)
>
> Parte **6 — La interfaz: del HTML del servidor al componente** · Nivel **🟢 introductorio** · Pista **`frontend`** (Interfaz y componentes)
>
> ✅ **Clase construida** — 8 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Un dato que vive **dentro** del componente: no entra por propiedades, no sale
por eventos y nadie de fuera lo toca.

Y la pregunta que decide todo lo demás: **¿de quién es este dato?** Si es del
componente, se queda dentro. Si alguien más lo necesita, ya no es local — y eso
es la clase 088.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Declarar estado local** en las ocho tecnologías, con su primitiva propia.
- **Distinguir** el valor inicial —que sí es una propiedad— del estado, que no
  lo es.
- **Explicar** por qué dos instancias del mismo componente no comparten nada.
- **Situar** dónde vive la regla de negocio de un componente y por qué eso hace
  que se pueda probar.

## 🧩 La situación

Un contador. El número es suyo: nadie más lo mira, nadie más lo cambia.

Dos instancias en la misma página, y ninguna sabe de la otra. Con un matiz que
esta clase pone a prueba: **el valor de partida sí puede venir de fuera**, y
confundir eso con el estado es de los errores más comunes que existen.

Además, el contador tiene una regla —**no baja de cero**—, y dónde se ponga esa
regla decide si se puede probar sin montar una interfaz entera.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /` | dos instancias con estados distintos: `0` y `5` |
| 2 | `GET /sin-propiedades` | **el componente funciona sin recibir nada** |
| 3 | `GET /transicion?desde=5&paso=1` | la transición produce `6` |
| 4 | `GET /transicion?desde=0&paso=-1` | y `0`: la regla vive con el estado |
| 5 | `GET /estado.json` | cómo se declara aquí, leído del archivo |

**El caso 2 es el que define «local».** Si el componente necesitara una
propiedad para tener estado, el estado no sería suyo.

**Lo que este contrato no comprueba:** el redibujado al cambiar. Ver un número
subir necesita un navegador, y eso es la clase 128. Lo que se verifica es lo que
decide el diseño — dónde se declara, de quién es y qué regla lo gobierna.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Estado**](../../../glosario/README.md#estado) | Un dato que el componente posee y puede cambiar. Cuando cambia, la interfaz se vuelve a pintar. La pregunta difícil no es cómo se declara: es dónde debe vivir. |

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
| `src/reglas.ts` | código TypeScript |
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
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `reglas.mjs` | código JavaScript (módulo ES) |
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
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `reglas.mjs` | código JavaScript (módulo ES) |
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
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `reglas.mjs` | código JavaScript (módulo ES) |
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
| `reglas.mjs` | código JavaScript (módulo ES) |
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
| `reglas.mjs` | código JavaScript (módulo ES) |
| `server.mjs` | código JavaScript (módulo ES) |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Ocho primitivas para la misma idea, ordenadas de la más explícita a la más
implícita.

### React · [`react/Contador.mjs`](implementaciones/react/Contador.mjs)

```javascript
export function Contador({ id = "sola", inicial = 0 }) {
  const [valor, ponerValor] = useState(inicial);
```

```javascript
 * `inicial` sí es una propiedad, y esa distinción es la que más se confunde:
 * lo que se recibe es **el valor de partida**, no el estado. A partir del primer
 * render, cambiar `inicial` desde fuera no hace nada. En React eso tiene nombre
 * —«propiedad no controlada»— y es fuente de errores para todo el mundo.
```

Y una decisión de diseño que se repite en las ocho:

```javascript
 * LA REGLA VIVE CON EL ESTADO.
 *
 * «No baja de cero» no es cosa del padre ni del botón: es una propiedad de este
 * contador. Ponerla aquí, en una función pura, es lo que permite probarla sin
 * renderizar nada — y lo que evita que dos sitios distintos la apliquen distinto.
```

### Vue · [`vue/Contador.mjs`](implementaciones/vue/Contador.mjs)

```javascript
  setup(props) {
    const valor = ref(props.inicial);
```

```javascript
 * Y aquí hay una diferencia real con React que se ve en la última línea: en Vue
 * `setup()` **se ejecuta una sola vez** por instancia. Lo que se vuelve a
 * ejecutar en cada cambio es solo la función de render.
 *
 * La consecuencia práctica es que las variables de `setup` no se recrean, así
 * que no hacen falta los envoltorios de memoria que en React sí — `useMemo`,
 * `useCallback`. Es el mismo motivo por el que Solid no los necesita.
```

### Angular · [`angular/src/contador.component.ts`](implementaciones/angular/src/contador.component.ts)

```typescript
  valor = signal(0);

  cambiar(paso: number) {
    this.valor.update((actual) => siguiente(actual, paso));
  }
```

Y la historia detrás, que explica por qué Angular tuvo fama de lento:

```typescript
 * Durante diez años el estado de un componente de Angular fue **un campo
 * normal**, y quien detectaba los cambios era Zone.js: una biblioteca que
 * parchea `setTimeout`, `addEventListener` y las peticiones de red para saber
 * cuándo volver a mirar el árbol entero.
 *
 * Funcionaba y era caro. Desde la versión 16, `signal()` hace lo que hacen las
 * demás desde el principio: avisar de que este dato concreto cambió.
```

### SolidJS · [`solid/Contador.mjs`](implementaciones/solid/Contador.mjs)

```javascript
  const [valor, ponerValor] = createSignal(props.inicial ?? 0);
```

Se parece a `useState` y no lo es:

```javascript
 * Se parece a `useState` de React y no funciona igual, y la diferencia está en
 * la primera mitad: `valor` **es una función**. Hay que llamarla —`valor()`—
 * porque leerla es lo que suscribe al lector a los cambios.
 *
 * Eso es lo que permite que el componente se ejecute una sola vez: cuando el
 * valor cambia, Solid no vuelve a llamar a `Contador`, vuelve a llamar solo a
 * los sitios donde `valor()` se leyó.
 *
 * En un componente de tres líneas la diferencia no se ve. En una lista de mil
 * elementos, es la diferencia entre redibujar mil y redibujar uno.
```

### Svelte · [`svelte/Contador.svelte`](implementaciones/svelte/Contador.svelte)

```svelte
  let valor = $state(inicial);
```

```svelte
  // Y aquí Svelte 5 hace algo que ninguno de los otros siete: `valor` se lee y
  // se escribe como una variable normal. No hay `.value`, no hay función
  // `ponerValor`, no hay `$emit`. La runa marca la variable como reactiva y el
  // COMPILADOR se encarga del resto.
  //
  // Ese es el argumento de Svelte entero: si hay un compilador, la sintaxis no
  // tiene por qué pagar el precio de la reactividad.
```

### Lit · [`lit/Contador.mjs`](implementaciones/lit/Contador.mjs)

```javascript
  static properties = {
    id: { type: String },
    valor: { state: true },
  };
```

```javascript
 * `state: true` es la diferencia con la clase 082: una propiedad normal tiene
 * puente con un atributo de HTML —se puede poner desde fuera con
 * `<mi-contador valor="3">`— y una de estado, no. Es privada del elemento.
 *
 * Que el estado sea un campo de un objeto tiene una ventaja que los otros siete
 * no dan: **cada instancia es un objeto de verdad**, con su identidad. Se puede
 * hacer `document.querySelector("mi-contador").valor` y ahí está.
```

### Alpine.js · [`alpinejs/contador.mjs`](implementaciones/alpinejs/contador.mjs)

```javascript
    `<button x-on:click="valor = Math.max(0, valor + 1)">+1</button>` +
```

El modelo más simple de los ocho, con una factura concreta —
[`alpinejs/reglas.mjs`](implementaciones/alpinejs/reglas.mjs):

```javascript
 * En los otros siete, esta función se importa desde el componente. En Alpine el
 * componente es un atributo de HTML, así que la expresión de `x-on:click` no
 * puede importar nada: lo que hay ahí dentro se evalúa en el navegador, con lo
 * que haya en el ámbito global.
 *
 * Por eso la regla acaba escrita DOS VECES: aquí, para el servidor y el
 * contrato, y otra vez dentro de la expresión del atributo. Es la duplicación
 * que Alpine cobra por no tener módulos, y con reglas de verdad se nota.
```

Esa duplicación **está declarada** en su respuesta: `la_regla_esta_duplicada:
true`. Es el tipo de cosa que una comparativa normal no cuenta.

### htmx · [`htmx/contador.mjs`](implementaciones/htmx/contador.mjs)

```javascript
 * EN HTMX NO HAY ESTADO LOCAL, Y ESA ES LA POSTURA.
 *
 * Lo que en los otros siete vive dentro del componente, aquí vive en el
 * servidor y viaja en la dirección de la petición. El «estado local» de este
 * contador es el número que va en `?valor=`.
 *
 * Suena a limitación y es una decisión con nombre: **una sola fuente de
 * verdad**. En los otros siete hay dos copias del dato —la del servidor y la del
 * cliente— y mantenerlas de acuerdo es la mitad del trabajo de una aplicación
 * moderna. Aquí no hay segunda copia porque no hay cliente con memoria.
```

Y la independencia entre instancias se consigue con el objetivo de la petición —
[`htmx/server.mjs`](implementaciones/htmx/server.mjs):

```javascript
    // El fragmento nuevo se sustituye a sí mismo con `hx-swap="outerHTML"`, y
    // solo el que se pulsó: el otro contador ni se entera. Es la independencia
    // entre instancias, conseguida por el objetivo de la petición.
```

## 🔬 Comparación

| | Cómo se declara | Cómo se lee | Quién redibuja |
| --- | --- | --- | --- |
| **React** | `useState(inicial)` | una variable | React, al llamar al asignador |
| **Vue** | `ref(inicial)` en `setup()` | `.value` | la reactividad, al escribir |
| **Angular** | `signal(inicial)` | `valor()` | la señal |
| **Svelte** | `$state(inicial)` | **una variable normal** | el código compilado |
| **SolidJS** | `createSignal(inicial)` | `valor()` | **solo los huecos que la leyeron** |
| **Lit** | campo con `state: true` | `this.valor` | el elemento |
| **Alpine.js** | el objeto de `x-data` | una propiedad | Alpine, con un proxy |
| **htmx** | **no existe** | la dirección de la petición | el servidor |

Cuatro lecturas:

- **La sintaxis más cómoda la tiene el que compila.** Svelte lee y escribe una
  variable normal porque hay un compilador que reescribe la asignación. Los que
  no compilan necesitan una caja —`.value`, `valor()`, `.set()`— para saber
  cuándo alguien lee o escribe.
- **Leer llamando no es un capricho.** En Solid y en Angular, `valor()` es lo que
  registra al lector. Esa suscripción por lectura es lo que permite redibujar un
  hueco en vez de un componente entero.
- **Angular llegó tarde a lo mismo y lo dice su historia.** Diez años de Zone.js
  revisando el árbol completo, y una señal en la versión 16.
- **htmx no tiene estado local y no es un hueco: es la tesis.** Una sola copia
  del dato. Lo que se ahorra en sincronización se paga en latencia.

## ⚠️ Errores frecuentes

- **Confundir el valor inicial con el estado.** `inicial` es una propiedad;
  cambiarla después del primer render no hace nada en casi ninguna de las ocho.
- **Desestructurar `props` en Solid** — otra vez, y aquí duele más: el valor
  inicial se congela y el componente arranca siempre igual.
- **Subir el estado «por si acaso».** Si nadie más lo necesita, subirlo solo
  añade propiedades que atravesar. La clase 088 explica cuándo sí.
- **Poner la regla en el manejador del botón.** Funciona con un botón. Con dos
  sitios que cambian el mismo estado, la regla se aplica distinto en cada uno.
- **Olvidar `state: true` en Lit.** Sin él, el estado tiene puente con un
  atributo y cualquiera puede escribirlo desde el HTML.

## ✅ Verificación

```bash
node scripts/run-class.mjs 084
```

Y para ver la primitiva que declara cada una:

```bash
curl -s http://127.0.0.1:4100/estado.json
```

## 🧪 Reto de transferencia

1. **Quita la regla** de `siguiente()` y ponla dentro del manejador del botón.
   Luego añade un segundo botón que también cambie el estado y mira cuántas
   veces has tenido que escribirla.
2. **Busca en tu proyecto un estado que esté demasiado arriba.** Un dato que
   viaja tres niveles hacia abajo y que solo usa el último. Bajarlo es casi
   siempre una mejora.
3. **Cuenta las copias.** En tu aplicación, ¿cuántos datos existen a la vez en el
   servidor y en el cliente? Esa cifra es lo que htmx se ahorra y lo que tú
   mantienes sincronizado.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué cuesta cada primitiva
- [Clase 083](../083-propiedades-y-eventos/README.md) — cuando el dato es del padre
- [Clase 088](../088-estado-compartido/README.md) — cuando deja de ser local
- [Clase 092](../092-los-tres-modelos-de-reactividad/README.md) — por qué unas redibujan el componente y otras el hueco
- [Índice de la parte 6](../README.md)

## Fuentes

- [@banks-porcello-learning-react] Banks, A.; Porcello, E. *Learning React*, 2.ª ed. O'Reilly Media, 2020. ISBN 9781492051725 — <https://openlibrary.org/isbn/9781492051725>
- [@vue-reactivity] *Reactivity in Depth*. Vue.js — <https://vuejs.org/guide/extras/reactivity-in-depth.html>
- [@solid-reactivity] *Intro to Reactivity*. SolidJS — <https://docs.solidjs.com/concepts/intro-to-reactivity>
- [@mdn-web-docs] *MDN Web Docs*. Mozilla — <https://developer.mozilla.org/>
- [@osmani-js-design-patterns] Osmani, Addy. *Learning JavaScript Design Patterns*, 2.ª ed. O'Reilly Media, 2023. ISBN 9781098139872 — <https://openlibrary.org/isbn/9781098139872>
