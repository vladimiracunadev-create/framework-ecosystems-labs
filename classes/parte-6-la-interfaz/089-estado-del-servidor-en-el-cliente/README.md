# Clase 089 — Estado del servidor en el cliente

> [⬅️ 088](../088-estado-compartido/README.md) · [📚 Parte 6](../README.md) · [🎓 Clases](../../README.md) · [090 ➡️](../090-enrutado-en-el-cliente/README.md)
>
> Parte **6 — La interfaz: del HTML del servidor al componente** · Nivel **🟡 intermedio** · Pista **`frontend`** (Interfaz y componentes)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Un dato que **no es tuyo**: vive en el servidor, lo cambia otra gente, y tú solo
tienes una copia que envejece.

Las clases 084 y 088 hablaron de estado propio. Este es de otra especie, y
tratarlo como si fuera propio es el error más caro de una aplicación moderna.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Distinguir** estado de interfaz de estado del servidor, y por qué mezclarlos
  duele.
- **Implementar** las cuatro ideas de una caché de consultas: clave, marca de
  tiempo, obsolescencia e invalidación.
- **Explicar** por qué «obsoleto» no es «borrado», y qué gana el usuario con esa
  distinción.
- **Elegir** la biblioteca de tu ecosistema sabiendo qué problema resuelve.

## 🧩 La situación

Una pantalla pide la lista de usuarios. Después otra pantalla la pide otra vez.
Y luego el usuario vuelve a la primera.

¿Tres peticiones? ¿Una? ¿Y si el dato cambió entre medias?

Guardarlo en un `useState` parece la respuesta obvia y crea el problema: **ahora
hay dos verdades**, la del servidor y la tuya, y nadie avisa cuando se separan.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /reiniciar` | el contador de peticiones a cero |
| 2 | `GET /datos?clave=usuarios` | la primera va a la fuente: **1 petición** |
| 3 | `GET /datos?clave=usuarios` | **la segunda no: sale de la caché, sigue en 1** |
| 4 | `GET /datos?clave=pedidos` | otra clave es otra entrada |
| 5 | `GET /datos?clave=usuarios&envejecer=si` | **se sirve lo viejo Y se vuelve a pedir** |
| 6 | `GET /invalidar?clave=usuarios` | borra una y no toca las demás |
| 7 | `GET /cache.json` | qué biblioteca lo resuelve en este ecosistema |

**El contador de peticiones es la medida entera de esta clase.** Si sube cuando
no debía, la caché no sirve; si no sube cuando debía, el dato se queda viejo para
siempre.

Y el caso 5 es el que merece leerse dos veces: la respuesta trae
`se_devolvio_lo_viejo: true` **y** `se_pidio_de_nuevo: true`. Las dos cosas a la
vez — eso es «obsoleto mientras se revalida», y es la diferencia entre una
pantalla que parpadea con un «cargando» y una que no.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Estado del servidor**](../../../glosario/README.md#estado-del-servidor) | Datos que viven en el servidor y de los que el cliente guarda una copia. No es estado local: es una **caché**, y sus problemas son de caché — frescura, invalidación, reintentos y peticiones duplicadas. |

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
| `cache.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |
| `servidor-comun.mjs` | código JavaScript (módulo ES) |

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
| `cache.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |
| `servidor-comun.mjs` | código JavaScript (módulo ES) |

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
| `Panel.svelte` | componente de Svelte |
| `cache.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |
| `servidor-comun.mjs` | código JavaScript (módulo ES) |

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
| `cache.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |
| `servidor-comun.mjs` | código JavaScript (módulo ES) |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las cuatro comparten la caché —
[`cache.mjs`](implementaciones/react/cache.mjs), idéntica en las cuatro— porque
**es lógica pura y no depende del framework**. Lo que cambia es cómo la consume
un componente y qué biblioteca la implementa en cada ecosistema.

```javascript
 * TanStack Query, SWR, Pinia Colada, svelte-query — todas las bibliotecas que
 * resuelven esto implementan las mismas cuatro ideas, y aquí están escritas para
 * que se vean sin capas encima:
 *
 *   1. una CLAVE identifica la consulta;
 *   2. la respuesta se guarda con una MARCA DE TIEMPO;
 *   3. pasado un plazo la entrada está OBSOLETA — que no es lo mismo que borrada;
 *   4. y se puede INVALIDAR a mano cuando algo cambió.
```

**La idea que sostiene todo lo demás:**

```javascript
 * La idea que sostiene todo lo demás: **el estado del servidor no es estado de
 * la interfaz**. No es tuyo, no lo controlas, y en cuanto lo copias en el
 * cliente tienes dos verdades. Lo que estas bibliotecas hacen no es guardarlo:
 * es gestionar el desfase.
```

**Obsoleto no es borrado:**

```javascript
 * Una entrada obsoleta **se sigue devolviendo**: el usuario ve el dato viejo al
 * instante y la actualización llega después. Es lo que la industria llama
 * «obsoleto mientras se revalida», y es la diferencia entre una pantalla que
 * parpadea con un cargando y una que no.
```

Y el código que lo hace:

```javascript
  if (estaObsoleta({ ...entrada, momento }, ahora)) {
    const fresco = pedirALaFuente(clave);
    entradas.set(clave, { dato: fresco, momento: ahora });
    return {
      origen: "cache-obsoleta",
      dato: entrada.dato,
      dato_fresco: fresco,
      se_devolvio_lo_viejo: true,
      se_pidio_de_nuevo: true,
    };
  }
```

Con una honestidad que el laboratorio se debe —
[`cache.mjs`](implementaciones/react/cache.mjs):

```javascript
  // `envejecer` empuja la marca de tiempo hacia atrás para poder comprobar el
  // caso sin esperar treinta segundos. Es lo mismo que hace un reloj falso en
  // una prueba, y decirlo es parte del trato.
```

Y las rutas también se comparten, por el mismo motivo —
[`servidor-comun.mjs`](implementaciones/react/servidor-comun.mjs):

```javascript
 * Compartir esto es honesto: si cada implementación escribiera su propia versión
 * de las mismas rutas, la comparación mediría mi capacidad de repetirme.
```

### React · [`react/server.mjs`](implementaciones/react/server.mjs)

```javascript
function Panel({ clave }) {
  const { dato, origen } = leer(clave);
  return h("div", { "data-panel": clave, "data-origen": origen }, dato);
}
```

```javascript
 * En un proyecto real esto sería `useQuery(["usuarios"], traerUsuarios)` de
 * TanStack Query: la clave, la función que trae el dato, y el gancho devuelve
 * `{ data, isLoading, isStale }`.
```

Y el origen de esa biblioteca, que explica el problema mejor que cualquier
descripción:

```javascript
  nota:
    "TanStack Query nació precisamente de contar cuánto código se repetía para esto en cada proyecto de React: cargando, error, reintentos, caché y revalidación",
```

### Vue · [`vue/server.mjs`](implementaciones/vue/server.mjs)

```javascript
 * Es el error que esta clase quiere evitar. Un almacén guarda estado propio; una
 * caché de consultas gestiona estado ajeno. Meter lo segundo en el primero
 * significa escribir a mano la obsolescencia, la revalidación y la invalidación
 * — que es exactamente lo que Pinia Colada existe para no tener que escribir.
```

Es la trampa específica del ecosistema de Vue: **Pinia ya está instalado**, así
que el estado del servidor acaba dentro sin que nadie lo decida.

### SolidJS · [`solid/server.mjs`](implementaciones/solid/server.mjs)

```javascript
 * Solid es el único de los cuatro con una primitiva para esto **en el núcleo**:
 * `createResource`. No es una caché completa —no tiene claves ni invalidación
 * global— pero sí resuelve la parte que todo el mundo escribe mal: cargando,
 * error, y que la petición se cancele si la fuente cambia antes de terminar.
```

```javascript
 * Para lo demás está `@tanstack/solid-query`, que es la misma biblioteca de
 * React adaptada. Y ahí hay una lección de la parte 0: **las ideas viajan entre
 * ecosistemas mucho más que el código**.
```

### Svelte · [`svelte/Panel.svelte`](implementaciones/svelte/Panel.svelte)

```svelte
  // La diferencia de ecosistema aquí es que SvelteKit resuelve gran parte de
  // esto SIN biblioteca de caché: si el dato se carga en el servidor antes de
  // renderizar, no hay estado del servidor viviendo en el cliente que gestionar.
```

**Esa es la salida más limpia de todas**, y es la que abre la parte 7: el problema
más fácil de resolver es el que no llega a existir.

## 🔬 Comparación

| | Qué trae el núcleo | Biblioteca habitual | Trampa del ecosistema |
| --- | --- | --- | --- |
| **React** | nada | TanStack Query, SWR | guardar la respuesta en `useState` |
| **Vue** | nada | Pinia Colada, TanStack Query | meterlo en Pinia porque ya está |
| **Svelte** | nada | `@tanstack/svelte-query` | — SvelteKit lo evita cargando en el servidor |
| **SolidJS** | **`createResource`** | `@tanstack/solid-query` | creer que `createResource` es una caché completa |

Tres lecturas:

- **Ninguno de los cuatro trae una caché de consultas de verdad**, y los cuatro
  la necesitan. Es la señal más clara de que este problema es del patrón, no del
  framework.
- **La misma biblioteca sirve para los cuatro.** TanStack Query tiene adaptador
  para React, Vue, Svelte y Solid. Las ideas —clave, obsolescencia,
  invalidación— son las mismas; lo que cambia es cómo se suscribe cada uno.
- **La mejor solución es no tener el problema.** Si el dato se carga en el
  servidor antes de renderizar, no hay copia en el cliente que envejezca. Es la
  parte 7 entera, y por eso esta clase la precede.

## ⚠️ Errores frecuentes

- **Guardar la respuesta en el estado del componente.** Convierte un dato ajeno
  en propio: nadie avisa de que envejeció y hay que sincronizarlo a mano.
- **Meterlo en el almacén global.** El almacén guarda estado propio. Para el
  ajeno hay que escribir obsolescencia y revalidación, que es justo lo que las
  bibliotecas de consultas traen hechas.
- **Confundir obsoleto con borrado.** Borrar la entrada obliga a mostrar un
  «cargando»; marcarla obsoleta permite enseñar lo viejo mientras llega lo nuevo.
- **Usar una clave que no identifica la consulta.** Si dos consultas distintas
  comparten clave, se pisan — es la clase 085 aplicada a los datos.
- **No invalidar después de escribir.** Si se crea un usuario y no se invalida la
  lista, la pantalla sigue enseñando la de antes. La clase 062 lo cuenta desde el
  otro lado.

## ✅ Verificación

```bash
node scripts/run-class.mjs 089
```

Y la secuencia que enseña la caché entera:

```bash
curl -s "http://127.0.0.1:4100/datos?clave=usuarios&envejecer=si"
```

## 🧪 Reto de transferencia

1. **Cuenta las peticiones repetidas** de tu aplicación en la pestaña de red,
   navegando entre dos pantallas que usan el mismo dato. Ese número es lo que una
   caché de consultas se ahorra.
2. **Busca un `useState` que guarde una respuesta.** Pregúntate quién avisa
   cuando ese dato cambia en el servidor. Si la respuesta es «nadie», es este
   problema.
3. **Escribe la lista de claves** de tu aplicación. Si dos consultas distintas
   pueden producir la misma clave, tienes el fallo de la clase 085 con datos.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué resuelve cada ecosistema y qué deja fuera
- [Clase 062](../../parte-4-datos/062-cache-de-lectura/README.md) — la misma caché, en el servidor
- [Clase 088](../088-estado-compartido/README.md) — el estado que sí es tuyo
- [Clase 093](../../parte-7-renderizado-y-fullstack/093-las-cuatro-estrategias-de-renderizado/README.md) — cómo no tener este problema
- [Índice de la parte 6](../README.md)

## Fuentes

- [@osmani-js-design-patterns] Osmani, Addy. *Learning JavaScript Design Patterns*, 2.ª ed. O'Reilly Media, 2023. ISBN 9781098139872 — <https://openlibrary.org/isbn/9781098139872>
- [@patterns-dev] *Patterns.dev — Modern Web App Design Patterns* — <https://www.patterns.dev/>
- [@mdn-web-docs] *MDN Web Docs*. Mozilla — <https://developer.mozilla.org/>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
