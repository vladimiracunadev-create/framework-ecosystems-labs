# Clase 092 — Los tres modelos de reactividad

> [⬅️ 091](../091-accesibilidad-del-componente/README.md) · [📚 Parte 6](../README.md) · [🎓 Clases](../../README.md) · [Parte 7 ➡️](../../parte-7-renderizado-y-fullstack/README.md)
>
> Parte **6 — La interfaz: del HTML del servidor al componente** · Nivel **🔴 avanzado** · Pista **`frontend`** (Interfaz y componentes)
>
> ✅ **Clase construida** — 8 implementaciones verificadas contra [`contrato.json`](contrato.json).

> 🎓 **Última clase de la parte 6.** Vuelven las ocho tecnologías de la 082 para
> responder a la pregunta que estaba debajo de todas las anteriores.

## 🎯 Objetivo

Un dato ha cambiado. **¿Qué se vuelve a pintar?**

Solo hay tres respuestas conocidas, y las ocho tecnologías del elenco caen en
una de ellas. La comparación honesta no es cuál va más rápido: es **dónde pone
cada una el trabajo** y qué se paga por ello.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Situar** cualquier tecnología de interfaz en uno de los tres modelos, sin
  haberla usado.
- **Explicar** por qué React necesita `useMemo` y Solid no.
- **Predecir** dónde se va a notar el modelo de tu framework cuando la
  aplicación crezca.
- **Reconocer** que «sin reactividad en el cliente» es una postura, no una
  carencia.

## 🧩 La situación

Dos valores independientes, `a` y `b`. Cambia `a`.

La respuesta correcta —lo que idealmente debería recalcularse— es **uno**. Cada
modelo se acerca o no a esa respuesta, y la distancia es exactamente lo que se
paga.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /modelo` | a cuál de los tres pertenece |
| 2 | `GET /medir?cambia=a` | qué pasa al cambiar uno de dos valores |
| 3 | `GET /modelos.json` | los tres modelos, con lo que gana y paga cada uno |

**Donde las primitivas de verdad se pueden ejecutar en Node, se mide.** React,
Vue, Solid y Angular traen sistemas reactivos que funcionan fuera del navegador,
así que sus números salen de ejecutarlos.

**Donde no se puede, se declara `medido: false` con el motivo.** Svelte, Lit y
Alpine necesitan el navegador para su ciclo de actualización, y **inventar un
número ahí sería peor que no tenerlo** — la misma regla que la clase 006 aplicó
al coste de contratar.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Reactividad**](../../../glosario/README.md#reactividad) | Cómo un framework se entera de que algo cambió para volver a pintar. Hay tres modelos: comparar el resultado (DOM virtual), observar el dato (señales) o compilar las dependencias (compilador). Deciden el rendimiento y el estilo del código. |
| [**DOM virtual**](../../../glosario/README.md#dom-virtual) | Pintar en una estructura en memoria, compararla con la anterior y aplicar solo las diferencias al DOM real. Simplifica el modelo mental a cambio de un coste de comparación en cada actualización. |
| [**Señal**](../../../glosario/README.md#señal) *(Signal)* | Un valor que sabe quién lo está leyendo, así que al cambiar puede avisar exactamente a lo que depende de él. Evita la comparación del DOM virtual y devuelve la reactividad al dato. |

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
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `modelos.mjs` | código JavaScript (módulo ES) |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

### 🔧 Vue

Adopción progresiva: sirve como etiqueta en una página existente o como framework completo. Su reactividad fina influyó en toda la generación siguiente.

- **Documentación oficial:** <https://vuejs.org/guide/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `vue ^3.5.0, @vue/server-renderer ^3.5.0, @vue/reactivity ^3.5.0`
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
| `modelos.mjs` | código JavaScript (módulo ES) |
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
| `src/modelos.ts` | código TypeScript |
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
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `modelos.mjs` | código JavaScript (módulo ES) |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `reactivo.svelte.js` | código JavaScript |
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
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `modelos.mjs` | código JavaScript (módulo ES) |
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
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `modelos.mjs` | código JavaScript (módulo ES) |
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
| `modelos.mjs` | código JavaScript (módulo ES) |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
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
| `modelos.mjs` | código JavaScript (módulo ES) |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `server.mjs` | código JavaScript (módulo ES) |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las ocho comparten la descripción de los tres modelos —
[`modelos.mjs`](implementaciones/react/modelos.mjs):

```javascript
 * Todas las tecnologías de interfaz resuelven la misma pregunta —«un dato ha
 * cambiado, ¿qué hay que volver a pintar?»— y solo hay tres respuestas
 * conocidas. Las ocho del elenco caen en una de ellas.
 *
 * La comparación honesta no es cuál va más rápido: es **dónde pone cada uno el
 * trabajo** y qué se paga por ello.
```

Y el experimento:

```javascript
 * Independientes a propósito: nada de lo que se calcula con `a` depende de `b`.
 * Así, cuando cambia `a`, la pregunta «¿cuánto se recalcula?» tiene una
 * respuesta correcta —uno— y cada modelo se acerca o no a ella.
```

### React — árbol virtual · [`react/server.mjs`](implementaciones/react/server.mjs)

```javascript
 * React sí se puede ejecutar en Node, así que esto no es una simulación: se
 * renderiza el árbol dos veces con `a` distinto y se cuenta cuántas veces se
 * ejecutó CADA componente.
```

```javascript
      ejecuciones_del_que_cambia: cuenta.a - trasPrimero.a,
      ejecuciones_del_que_no_cambia: cuenta.b - trasPrimero.b,
```

**Resultado medido: `1` y `1`.**

```javascript
      lectura:
        "el componente que NO lee el valor cambiado se vuelve a ejecutar igual: por eso existen React.memo, useMemo y useCallback",
```

### SolidJS — reactividad fina · [`solid/server.mjs`](implementaciones/solid/server.mjs)

**Resultado medido: `1` y `0`.** Y para conseguirlo salió un hallazgo que merece
la clase entera:

```javascript
 * Importar `solid-js` en Node resuelve la condición «server» y trae una versión
 * del sistema reactivo **con las actualizaciones desactivadas**: las señales se
 * pueden leer, pero escribir en una no propaga nada.
 *
 * Y tiene todo el sentido: en el servidor se renderiza una vez y se manda el
 * texto. Nada va a cambiar después, así que llevar el motor de propagación sería
 * peso muerto. Es la misma lógica por la que el efecto de la clase 087 tampoco
 * corre aquí.
```

```javascript
const solid = await import("solid-js/dist/solid.js");
```

```javascript
 * Para medir el modelo de verdad hay que pedir el motor del CLIENTE
 * explícitamente. Escribir esta ruta a mano no es lo que se hace en un proyecto
 * —ahí lo elige el empaquetador— pero es lo que permite que esta clase mida en
 * lugar de afirmar.
```

**El mismo paquete trae dos motores**, y el del servidor no reacciona. Eso no
sale en ninguna comparativa y explica más de un desconcierto.

### Vue — reactividad fina · [`vue/server.mjs`](implementaciones/vue/server.mjs)

**Resultado medido: `1` y `0`.** Y con la ventaja de poder verlo desnudo:

```javascript
 * `@vue/reactivity` funciona sin componentes, sin plantillas y sin navegador. Se
 * puede usar en un servidor, en un proceso por lotes o en otro framework — y de
 * hecho hay quien lo hace.
```

```javascript
 * A diferencia de Solid, aquí no hay dos motores: el mismo paquete reacciona en
 * Node igual que en el navegador.
```

Con un matiz que la clase no se salta:

```javascript
      matiz:
        "Vue es fino para SABER qué cambió y de grano grueso para APLICARLO: marca el componente como sucio y vuelve a ejecutar su render, no el de sus hijos",
```

### Angular — reactividad fina, y su propio pasado · [`angular/src/main.ts`](implementaciones/angular/src/main.ts)

**Resultado medido: `1` y `0`.**

```typescript
 * Durante diez años el modelo fue **detección de cambios por revisión**: Zone.js
 * parcheaba `setTimeout`, `addEventListener` y las peticiones de red para saber
 * cuándo algo pudo haber cambiado, y entonces Angular revisaba el árbol entero
 * comparando valores.
 *
 * No es árbol virtual —no construye un árbol nuevo— pero paga lo mismo: trabajo
 * proporcional al tamaño de la aplicación, no al del cambio.
```

```typescript
 * La transición no ha terminado: la mayoría del código de Angular en producción
 * sigue usando el modelo antiguo, y los dos conviven en la misma versión.
```

### Svelte — reactividad fina compilada · [`svelte/reactivo.svelte.js`](implementaciones/svelte/reactivo.svelte.js)

**`medido: false`**, y con una evidencia distinta a cambio.

```javascript
 * Svelte 5 permite usar `$state` y `$effect` en archivos normales, siempre que
 * lleven la extensión `.svelte.js` — porque hay que compilarlos igual que un
 * componente. Es la señal más clara de que en Svelte la reactividad **no es una
 * biblioteca, es sintaxis**: sin compilador, este archivo no es JavaScript
 * válido.
```

Por qué no se mide, dicho sin rodeos —
[`svelte/server.mjs`](implementaciones/svelte/server.mjs):

```javascript
 * Los efectos de Svelte necesitan el planificador del navegador: fuera de él no
 * se ejecutan nunca. No es una limitación de este laboratorio — es el mismo
 * hecho que la clase 087 verificó contando, y vale igual para `$effect` que para
 * `onMount`.
 *
 * Inventar un número aquí sería peor que no tenerlo, así que la respuesta lleva
 * `medido: false` con el motivo. Es la regla que la clase 006 aplicó al coste de
 * contratar.
```

Y la evidencia que sí se puede dar:

```javascript
 * `$state` se convierte en llamadas al seguimiento —`state`, `get`, `set`— que
 * el compilador escribe una a una. En el original no aparece ninguna: ahí solo
 * hay una variable con una runa delante.
```

Ejecutándolo, el compilador escribió `$.state`, `$.get`, `$.set`,
`$.user_effect` dos veces y `$.effect_root`. **Ninguna de esas llamadas está en
el archivo original.** Esa es la tesis de Svelte hecha visible.

### Lit — fina a nivel de propiedad · [`lit/server.mjs`](implementaciones/lit/server.mjs)

**`medido: false`**, con el modelo descrito por su forma:

```javascript
 * Cuando una propiedad reactiva cambia, Lit marca el elemento como sucio y
 * vuelve a evaluar SU plantilla entera. Después compara hueco por hueco y toca
 * solo los que cambiaron.
 *
 * Es un punto intermedio real entre los otros dos: más fino que el árbol virtual
 * —no reconstruye un árbol ni recorre hijos— y más grueso que las señales de
 * Solid o Vue, que no vuelven a evaluar nada que no dependa del valor.
```

### Alpine.js — el motor de Vue en atributos · [`alpinejs/server.mjs`](implementaciones/alpinejs/server.mjs)

**`medido: false`**, y con la mejor explicación posible de por qué no hace falta:

```javascript
 * No es una casualidad ni un parecido: Alpine construye su reactividad sobre
 * `@vue/reactivity`, el mismo paquete que la implementación de Vue de esta clase
 * usa para medir. Los objetos de `x-data` se envuelven en un proxy reactivo y
 * cada expresión de un atributo se convierte en un efecto.
 *
 * Así que el modelo de Alpine ya está medido en esta clase — en la carpeta de al
 * lado. Lo que cambia es dónde se declara: allí en un archivo, aquí en un
 * atributo del HTML.
```

### htmx — el tercer modelo · [`htmx/server.mjs`](implementaciones/htmx/server.mjs)

```javascript
 * Las otras siete tecnologías responden a «un dato ha cambiado, ¿qué se vuelve a
 * pintar?» con un mecanismo de seguimiento. htmx responde con otra pregunta:
 * **¿por qué hay un dato en el cliente?**
```

```javascript
 * Si el estado vive en el servidor, cambiarlo es una petición y actualizar la
 * pantalla es sustituir un trozo de HTML. No hay árbol que comparar, ni señales
 * que suscribir, ni efectos que agrupar. El código de reactividad de una
 * aplicación de htmx **es cero líneas**.
```

Y por eso su medida es de otra especie:

```javascript
      unidad_de_medida_distinta:
        "aquí no se cuentan reejecuciones sino PETICIONES: no hay nada que reejecutar en el cliente",
```

## 🔬 Comparación

| | Modelo | Cambia `a`: se recalcula el de `a` | …y el de `b` | ¿Medido? |
| --- | --- | :---: | :---: | :---: |
| **React** | árbol virtual | 1 | **1** | ✅ |
| **Vue** | reactividad fina | 1 | **0** | ✅ |
| **Angular** | reactividad fina (señales) | 1 | **0** | ✅ |
| **SolidJS** | reactividad fina | 1 | **0** | ✅ |
| **Svelte** | reactividad fina compilada | — | — | ❌ necesita navegador |
| **Lit** | fina a nivel de propiedad | — | — | ❌ necesita navegador |
| **Alpine.js** | reactividad fina (motor de Vue) | — | — | ❌ necesita navegador |
| **htmx** | sin reactividad en el cliente | 0 peticiones | 0 peticiones | ✅ otra unidad |

**El `1` frente al `0` de la columna de la derecha es la clase entera.** No es una
diferencia de velocidad: es una diferencia de modelo, y explica de dónde salen
`React.memo`, `useMemo` y `useCallback` — herramientas que en los otros tres
simplemente no existen porque no hacen falta.

Y tres cosas más que se leen de la tabla:

- **Cinco de las ocho son reactividad fina.** El modelo ganó, incluido en
  Angular, que tardó diez años en llegar. React es hoy el que queda solo con el
  árbol virtual entre los grandes.
- **Compilar no es un cuarto modelo.** Svelte hace reactividad fina; lo que
  cambia es **quién escribe el seguimiento** — un compilador en lugar de un
  motor. Por eso no viaja motor al navegador.
- **htmx no está peor colocado: está en otra pregunta.** Cero líneas de código
  reactivo y cero valores duplicados, a cambio de una ida y vuelta por cambio.

## ⚠️ Errores frecuentes

- **Creer que fino significa rápido.** Significa proporcional al cambio. Con un
  árbol pequeño, el árbol virtual va perfectamente bien y el modelo mental es
  más simple.
- **Envolverlo todo en `useMemo`.** Cada envoltorio tiene su coste y su lista de
  dependencias, con los errores de la clase 087. Primero mide, después envuelve.
- **Desestructurar propiedades o señales.** En Solid y en Vue, leer fuera del
  sitio rompe la suscripción. Es el error que la clase 083 ya señaló y sigue
  siendo el más caro.
- **Creer que las señales de Angular quitan Zone.js.** Conviven: la mayoría del
  código en producción sigue con la revisión del árbol.
- **Comparar modelos con un «hola mundo».** Con dos componentes no se nota
  ninguna diferencia. El modelo se paga en listas grandes y árboles profundos —
  y medirlo bien es la clase 007.

## ✅ Verificación

```bash
node scripts/run-class.mjs 092
```

Y la medida que sostiene la comparación:

```bash
curl -s "http://127.0.0.1:4100/medir?cambia=a"
```

## 🧪 Reto de transferencia

1. **Ejecuta `/medir` en las ocho** y anota los pares. Los cuatro medidos
   cuentan la historia; los tres no medidos explican por qué no se puede contar
   todo desde un servidor.
2. **Busca los `useMemo` de tu proyecto** y pregúntate cuál sigue haciendo falta.
   Muchos se ponen por costumbre y no por medida.
3. **Escribe el mismo experimento** con tu framework y una lista de mil
   elementos. Ahí el modelo deja de ser teoría — y la clase 007 dice cómo medirlo
   sin engañarte.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué se paga por cada modelo
- [Clase 084](../084-estado-local/README.md) — las primitivas que aquí se miden
- [Clase 087](../087-efectos-y-ciclo-de-vida/README.md) — por qué el navegador hace falta para lo demás
- [Clase 007](../../parte-0-el-metodo/007-como-se-mide-y-como-se-miente-el-rendimiento/README.md) — cómo medir esto sin mentirte
- [Parte 7 ➡️](../../parte-7-renderizado-y-fullstack/README.md) — dónde se ejecuta todo esto

## Fuentes

- [@solid-reactivity] *Intro to Reactivity*. SolidJS — <https://docs.solidjs.com/concepts/intro-to-reactivity>
- [@vue-reactivity] *Reactivity in Depth*. Vue.js — <https://vuejs.org/guide/extras/reactivity-in-depth.html>
- [@react-server-components] *React Server Components*. Meta — <https://react.dev/reference/rsc/server-components>
- [@patterns-dev] *Patterns.dev — Modern Web App Design Patterns* — <https://www.patterns.dev/>
- [@osmani-js-design-patterns] Osmani, Addy. *Learning JavaScript Design Patterns*, 2.ª ed. O'Reilly Media, 2023. ISBN 9781098139872 — <https://openlibrary.org/isbn/9781098139872>
