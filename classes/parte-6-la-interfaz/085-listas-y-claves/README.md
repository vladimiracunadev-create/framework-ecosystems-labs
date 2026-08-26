# Clase 085 — Listas y claves

> [⬅️ 084](../084-estado-local/README.md) · [📚 Parte 6](../README.md) · [🎓 Clases](../../README.md) · [086 ➡️](../086-formularios-controlados/README.md)
>
> Parte **6 — La interfaz: del HTML del servidor al componente** · Nivel **🟡 intermedio** · Pista **`frontend`** (Interfaz y componentes)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Pintar una colección, y entender **qué pasa cuando el framework no sabe cuál es
cuál**.

La clave de una lista es la respuesta a una pregunta que el framework se hace en
cada actualización: *este elemento de ahora, ¿es el mismo que aquel de antes?*
Contestarla mal no rompe el HTML — mueve el estado de sitio.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Escribir una lista** con identidad estable en cuatro tecnologías.
- **Explicar** por qué el índice del array es la peor clave posible, y por qué
  parece funcionar.
- **Saber** cuál de los cuatro te avisa, cuál te grita y cuál no dice nada.
- **Reconocer** que Solid no tiene claves, y por qué eso mueve el error a otro
  sitio en lugar de eliminarlo.

## 🧩 La situación

Tres frutas en una lista. Se invierte el orden.

El HTML resultante es correcto en los dos casos —el contrato lo comprueba— y
aun así puede haber un fallo grave: si cada `<li>` tuviera una casilla marcada o
un campo a medio escribir, **el contenido se movería y el estado se quedaría**.

Ese fallo no está en el HTML, está en cómo el framework decide qué elemento es
cuál. Y esa decisión la tomas tú al escribir —o no escribir— la clave.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /` | la lista en orden, con su clave en el marcado |
| 2 | `GET /?orden=invertido` | la clave viaja con su elemento |
| 3 | `GET /?vacia=si` | una lista vacía no es un error |
| 4 | `GET /claves-repetidas` | **¿avisa el framework si dos comparten clave?** |
| 5 | `GET /sin-clave` | **¿se puede omitir, y avisa alguien?** |
| 6 | `GET /lista.json` | cómo se escribe aquí, leído del archivo |

**Los casos 4 y 5 no comprueban un resultado: comprueban si el framework habla.**
Los avisos de clave no son excepciones — se escriben en la consola y se pierden.
Interceptar la consola durante el render es la única forma de meterlos en un
contrato, y ese aviso es lo que separa un fallo que se caza en desarrollo de uno
que llega a producción.

**Y lo que no se comprueba:** el fallo en sí. Reordenar y ver el estado quedarse
atrás necesita un navegador, y eso es la clase 128. Lo que se verifica aquí es
todo lo que decide si ese fallo llega a existir.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Clave de lista**](../../../glosario/README.md#clave-de-lista) *(Key)* | El identificador estable que se le da a cada elemento de una lista para que el framework sepa cuál es cuál al actualizar. Usar el índice como clave produce errores visibles al reordenar o insertar. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **React** | biblioteca de interfaz de JavaScript/TypeScript (JavaScript) | 2013 | MIT | Meta y colaboradores |
| **Vue** | framework de interfaz de JavaScript/TypeScript (JavaScript) | 2014 | MIT | proyecto independiente |
| **Svelte** | framework de interfaz de JavaScript/TypeScript (JavaScript) | 2016 | MIT | proyecto independiente |
| **SolidJS** | biblioteca de interfaz de JavaScript/TypeScript (JavaScript) | 2018 | MIT | proyecto independiente |

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
| `Lista.mjs` | código JavaScript (módulo ES) |
| `datos.mjs` | código JavaScript (módulo ES) |
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
| `Lista.mjs` | código JavaScript (módulo ES) |
| `datos.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
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
| `Lista.svelte` | componente de Svelte |
| `ListaSinClave.svelte` | componente de Svelte |
| `datos.mjs` | código JavaScript (módulo ES) |
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
| `Lista.mjs` | código JavaScript (módulo ES) |
| `datos.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Los cuatro comparten los mismos datos —
[`datos.mjs`](implementaciones/react/datos.mjs), idéntico en las cuatro:

```javascript
export const FRUTAS = [
  { id: "a1", nombre: "Aguacate" },
  { id: "b2", nombre: "Berenjena" },
  { id: "c3", nombre: "Calabaza" },
];
```

```javascript
 * Cada fruta tiene un `id` que **no depende de su posición**. Esa es la única
 * condición que una clave tiene que cumplir: identificar al elemento, no al
 * hueco donde está hoy.
```

### React · [`react/Lista.mjs`](implementaciones/react/Lista.mjs)

```javascript
    elementos.map((fruta) =>
      h("li", { key: fruta.id, "data-clave": fruta.id }, fruta.nombre),
    ),
```

Y la explicación de por qué hay dos atributos donde parece que sobra uno:

```javascript
 * `key` no aparece en el HTML resultante. No es para el navegador — es para
 * React, que la usa al comparar el árbol anterior con el nuevo y decidir qué
 * elementos son «el mismo de antes» y cuáles son nuevos.
 *
 * Por eso `data-clave` está aparte: el contrato necesita VER la identidad en el
 * marcado, y `key` no se ve. Es una diferencia que confunde a mucha gente al
 * inspeccionar el DOM y no encontrarla.
```

**Y el error más común, explicado por su causa:**

```javascript
 * Y por eso usar el índice como clave es un error tan común: el índice
 * identifica el HUECO, no el elemento. Al reordenar, el hueco 0 sigue siendo el
 * hueco 0 y React cree que nada cambió de sitio — así que mueve el contenido y
 * deja el estado local donde estaba.
```

**El hallazgo de esta clase está en lo que React captura y lo que no** —
[`react/server.mjs`](implementaciones/react/server.mjs):

```javascript
 * Los avisos de clave no son excepciones: se escriben en la consola y se
 * pierden. Interceptarla durante el render es la única forma de comprobar por
 * contrato si el framework protesta — y esa protesta es lo que separa un fallo
 * que se detecta en desarrollo de uno que llega a producción.
```

Ejecutando la clase, la respuesta real:

- `GET /sin-clave` → **`el_framework_avisa: true`**, con el texto
  *«Each child in a list should have a unique "key" prop»*.
- `GET /claves-repetidas` → **`el_framework_avisa: false`**.

**React caza la clave que falta y no caza la clave repetida.** Y de las dos, la
repetida es la peor: la que falta produce un aviso ruidoso que alguien acaba
leyendo; la repetida no dice nada y empareja mal en silencio.

### Vue · [`vue/Lista.mjs`](implementaciones/vue/Lista.mjs)

```javascript
      this.elementos.map((fruta) =>
        h("li", { key: fruta.id, "data-clave": fruta.id }, fruta.nombre),
      ),
```

```javascript
 * Vue tiene aquí una regla de estilo que merece conocerse porque su verificador
 * la impone: `v-for` sin `key` es un ERROR de linter en la configuración
 * recomendada. No es el framework quien obliga, es la herramienta — y en la
 * práctica funciona igual de bien.
```

Y eso se ve al ejecutar: `el_framework_avisa: false` en los dos casos. **Vue no
dice nada en tiempo de ejecución**; quien protesta es el verificador de estilo,
antes de que el código llegue a ejecutarse. Es una defensa distinta —más
temprana y más fácil de desactivar.

### Svelte · [`svelte/Lista.svelte`](implementaciones/svelte/Lista.svelte)

**La clave es parte de la sintaxis del bucle:**

```svelte
  {#each elementos as fruta (fruta.id)}
```

```svelte
  // Es la forma más visible de las ocho: no es un atributo perdido entre otros,
  // es parte de la estructura del bucle, y quien lee el archivo la ve sí o sí.
```

Y como Svelte compila, la diferencia entre tener clave y no tenerla **se puede
medir** — [`svelte/server.mjs`](implementaciones/svelte/server.mjs):

```javascript
      // La diferencia no está en el HTML: está en el código generado. Contarlo
      // es la única forma de enseñar que el compilador produce DOS bucles
      // distintos según haya clave o no.
```

Ejecutando: **21 líneas generadas con clave frente a 18 sin ella**. El HTML es
idéntico; lo que cambia es el código de actualización — uno que sobrescribe por
posición y otro que mueve nodos.

Y en el navegador Svelte es el más duro de los cuatro: dos claves iguales no son
un aviso, son **una excepción en tiempo de ejecución**.

### SolidJS · [`solid/Lista.mjs`](implementaciones/solid/Lista.mjs)

**Aquí no hay claves, y no es un olvido:**

```javascript
 * `<For>` —el componente que se usa para listas— identifica cada elemento **por
 * su referencia**, no por una clave que tú escribas. Si el objeto es el mismo
 * objeto, es el mismo elemento; si es otro, es otro.
```

```javascript
 *   - no se puede equivocar uno escribiendo la clave, porque no hay clave;
 *   - pero sí se puede equivocar creando objetos nuevos en cada render — y ahí
 *     Solid piensa que la lista entera cambió, aunque los datos sean iguales.
 *
 * El error cambia de sitio: de «puse mal la clave» a «recreé los objetos».
```

Y la decisión que sustituye a escribir o no la clave:

```javascript
 * (Existe `<Index>` para el caso contrario: cuando lo que importa es la
 * posición y no el elemento. Elegir entre los dos es la decisión que en las
 * otras siete se toma escribiendo o no una clave.)
```

Por eso su respuesta al caso de claves repetidas es distinta a las tres
anteriores — [`solid/server.mjs`](implementaciones/solid/server.mjs):

```javascript
      // No hay nada que avisar: la identidad es la referencia del objeto, y dos
      // objetos distintos son distintos aunque su `id` coincida.
```

## 🔬 Comparación

| | Cómo se escribe | ¿Avisa si falta? | ¿Avisa si se repite? | Quién defiende |
| --- | --- | :---: | :---: | --- |
| **React** | `key` en el elemento | **✅ sí** | ❌ no | el framework, en la consola |
| **Vue** | `:key` junto a `v-for` | ❌ no | ❌ no | el verificador de estilo, antes de ejecutar |
| **Svelte** | `(fruta.id)` en el `#each` | ❌ no | **✅ excepción** | el framework, en el navegador |
| **SolidJS** | no hay clave | — | — | el modelo: identidad por referencia |

Cuatro lecturas:

- **Nadie caza las dos.** React caza la que falta; Svelte, la repetida. Vue no
  caza ninguna en ejecución y a cambio la caza antes, en el editor. Los tres
  enfoques dejan un hueco distinto.
- **La clave que se repite es peor que la que falta**, y es justo la que menos
  se detecta. Falta una clave: aviso ruidoso. Se repite una clave: silencio y
  emparejamiento incorrecto.
- **Svelte hace la clave visible en la sintaxis** y eso vale más que cualquier
  aviso: un atributo entre ocho se pasa por alto; un paréntesis en la línea del
  bucle, no.
- **Solid quita el problema y crea otro.** Sin claves no hay claves mal puestas,
  pero sí objetos recreados sin necesidad — y ese error tampoco avisa.

## ⚠️ Errores frecuentes

- **Usar el índice como clave.** Funciona perfectamente mientras la lista no se
  reordene, y por eso llega a producción. El día que se ordena por otra columna,
  el estado se queda donde estaba.
- **Usar `Math.random()` o la fecha.** Cada render produce claves nuevas, así que
  el framework recrea la lista entera. Es lento y pierde el estado en cada
  actualización.
- **Creer que `key` se ve en el DOM.** No se escribe en el HTML: es una
  instrucción para el algoritmo. Buscarla en el inspector no la encuentra.
- **Confundir la clave con un identificador de negocio.** Solo tiene que ser
  única y estable **dentro de esa lista**. El identificador de la base de datos
  sirve casi siempre, pero no es un requisito.
- **Recrear los objetos en cada render en Solid.** Sin claves, la identidad es la
  referencia: un `.map()` que devuelve objetos nuevos hace que Solid redibuje
  todo.

## ✅ Verificación

```bash
node scripts/run-class.mjs 085
```

Y para ver quién avisa y quién calla:

```bash
curl -s http://127.0.0.1:4100/sin-clave
```

## 🧪 Reto de transferencia

1. **Cambia la clave por el índice** en una implementación. Los seis casos siguen
   en verde — porque el HTML no cambia. Esa es exactamente la razón de que el
   error sobreviva a las revisiones.
2. **Busca en tu proyecto un `key={index}`.** Si la lista se ordena, se filtra o
   se puede borrar un elemento del medio, tienes un fallo esperando.
3. **Ejecuta `/sin-clave` en las cuatro** y compara qué dice cada una. La tabla
   de arriba sale de ahí, y comprobarla tú es medio ejercicio.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué defiende cada uno y dónde deja el hueco
- [Clase 084](../084-estado-local/README.md) — el estado que se queda atrás al reordenar
- [Clase 092](../092-los-tres-modelos-de-reactividad/README.md) — por qué unos comparan árboles y otros no
- [Clase 128](../../parte-10-calidad-y-operacion/128-pruebas-de-extremo-a-extremo/README.md) — donde el fallo de reordenar sí se puede ver
- [Índice de la parte 6](../README.md)

## Fuentes

- [@banks-porcello-learning-react] Banks, A.; Porcello, E. *Learning React*, 2.ª ed. O'Reilly Media, 2020. ISBN 9781492051725 — <https://openlibrary.org/isbn/9781492051725>
- [@vue-reactivity] *Reactivity in Depth*. Vue.js — <https://vuejs.org/guide/extras/reactivity-in-depth.html>
- [@solid-reactivity] *Intro to Reactivity*. SolidJS — <https://docs.solidjs.com/concepts/intro-to-reactivity>
- [@mdn-web-docs] *MDN Web Docs*. Mozilla — <https://developer.mozilla.org/>
