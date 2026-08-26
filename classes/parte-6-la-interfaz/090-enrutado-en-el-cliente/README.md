# Clase 090 — Enrutado en el cliente

> [⬅️ 089](../089-estado-del-servidor-en-el-cliente/README.md) · [📚 Parte 6](../README.md) · [🎓 Clases](../../README.md) · [091 ➡️](../091-accesibilidad-del-componente/README.md)
>
> Parte **6 — La interfaz: del HTML del servidor al componente** · Nivel **🟡 intermedio** · Pista **`frontend`** (Interfaz y componentes)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

**La dirección es estado.** Un enrutador de cliente no es más que una tabla y una
función que empareja — y como las dos cosas son lógica pura, se pueden ejecutar
en el servidor.

Por eso esta clase se puede verificar entera sin navegador: pedir `/tareas/42` y
comprobar que sale el detalle con su parámetro **es exactamente lo que hace el
enrutador del cliente**, solo que en otro proceso.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Escribir un emparejador de rutas** y entender por qué el orden de la tabla
  importa.
- **Explicar** por qué una ruta que no existe debe responder 404 y no una página
  en blanco.
- **Distinguir** los cuatro modelos: biblioteca elegida, biblioteca oficial,
  enrutador en el framework y rutas por directorios.
- **Ver** por qué la misma tabla sirve en el servidor y en el cliente, y qué abre
  eso.

## 🧩 La situación

Cuatro direcciones: la raíz, un listado, un formulario nuevo y un detalle con
identificador.

Dos de ellas empiezan igual —`/tareas/nueva` y `/tareas/:id`— y ahí está la
trampa: si el orden se invierte, «nueva» se convierte en un identificador y el
formulario deja de existir.

Es el mismo problema de la clase 012 en el servidor, con una diferencia: aquí,
en tres de los cuatro, **el orden lo decides tú**.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /` | la raíz lleva a inicio |
| 2 | `GET /tareas/42` | el detalle, con `data-id="42"` |
| 3 | `GET /tareas/nueva` | **la literal gana a la del parámetro** |
| 4 | `GET /no-existe` | **404**, no una página en blanco |
| 5 | `GET /emparejar?patron=/tareas/:id&ruta=/tareas/42` | los parámetros salen de la dirección |
| 6 | `GET /emparejar?patron=/tareas/:id&ruta=/tareas` | y no empareja de más |
| 7 | `GET /rutas.json` | la tabla, leída del archivo |

**El caso 4 merece una nota**, porque es el error más extendido de las
aplicaciones de una sola página: el servidor devuelve el mismo HTML para
cualquier dirección, el enrutador del cliente no encuentra nada, y el usuario ve
una página vacía **con un 200**. Los buscadores la indexan como válida.

Un enrutador que se respete tiene una entrada para lo que no existe, y el
servidor que lo acompaña devuelve 404.

<!-- generado: fichas -->

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **React** | biblioteca de interfaz de JavaScript/TypeScript (JavaScript) | 2013 | MIT | Meta y colaboradores |
| **Vue** | framework de interfaz de JavaScript/TypeScript (JavaScript) | 2014 | MIT | proyecto independiente |
| **Angular** | framework de interfaz de TypeScript (TypeScript) | 2016 | MIT | Google y colaboradores |
| **Svelte** | framework de interfaz de JavaScript/TypeScript (JavaScript) | 2016 | MIT | proyecto independiente |

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
| `enrutador.mjs` | código JavaScript (módulo ES) |
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
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `enrutador.mjs` | código JavaScript (módulo ES) |
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
| `src/enrutador.ts` | código TypeScript |
| `src/main.ts` | código TypeScript |
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
| `Pantalla.svelte` | componente de Svelte |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `enrutador.mjs` | código JavaScript (módulo ES) |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Tres comparten el mismo enrutador —
[`enrutador.mjs`](implementaciones/react/enrutador.mjs)— y Angular lo reescribe
en TypeScript.

```javascript
 * Eso es todo. React Router, Vue Router, el enrutador de Angular y el de
 * SvelteKit añaden navegación sin recarga, carga perezosa, guardias y
 * transiciones — pero por debajo, lo que deciden qué se pinta son estas veinte
 * líneas.
```

**El orden, que es la trampa de la clase:**

```javascript
export const RUTAS = [
  { patron: "/", pantalla: "inicio" },
  { patron: "/tareas", pantalla: "listado" },
  { patron: "/tareas/nueva", pantalla: "nueva" },
  { patron: "/tareas/:id", pantalla: "detalle" },
];
```

```javascript
 * `/tareas/nueva` va ANTES que `/tareas/:id`, porque si no, «nueva» se comería
 * el hueco del identificador y siempre ganaría el detalle. Es la misma decisión
 * que la clase 012 tomó en el servidor, con la diferencia de que allí algunos
 * frameworks ordenan por especificidad y aquí lo ordenas tú.
```

**El emparejador, y la línea que evita el fallo silencioso:**

```javascript
  // Distinto número de segmentos es «no coincide». Sin esta línea, `/tareas`
  // emparejaría con `/tareas/:id` y el parámetro llegaría vacío.
  if (esperados.length !== recibidos.length) return { coincide: false, parametros: {} };
```

### React · [`react/server.mjs`](implementaciones/react/server.mjs)

```javascript
 * En React Router esto se escribiría como `<Route path="/tareas/:id"
 * element={<Detalle />} />` y el parámetro se leería con `useParams()`. La
 * mecánica es la misma: la tabla dice qué componente, el emparejador dice con
 * qué datos.
```

Y la simetría que hace posible todo lo demás:

```javascript
  // CUALQUIER OTRA DIRECCIÓN PASA POR EL ENRUTADOR.
  //
  // En un cliente, esto lo hace el navegador sin pedir nada al servidor. Aquí lo
  // hace el servidor con la misma tabla — y esa simetría es la que permite que
  // una aplicación renderice en los dos sitios.
```

```javascript
        biblioteca_habitual: "React Router, o el enrutador de un metaframework",
        viene_en_el_nucleo: false,
```

### Vue · [`vue/server.mjs`](implementaciones/vue/server.mjs)

```javascript
 * La diferencia de ecosistema es que Vue Router es **oficial**: lo mantiene el
 * mismo equipo, la documentación lo da por hecho y no hay dos opciones
 * compitiendo. Es una decisión menos que tomar, y una dependencia igual de real.
```

Con un detalle de comportamiento que conviene saber:

```javascript
        el_orden_lo_decide: "Vue Router ordena por especificidad, no por el orden de la tabla",
```

**Vue Router no depende de cómo ordenes la tabla**: pone las literales por delante
solo. Es la misma diferencia que la clase 005 encontró entre Spring y Express.

### Angular · [`angular/src/enrutador.ts`](implementaciones/angular/src/enrutador.ts)

**El único de los cuatro con enrutador en el framework:**

```typescript
 * En Angular esa tabla existe de verdad y tiene un tipo: `Routes`, del paquete
 * `@angular/router`, que **viene en el framework**. Es el único de los cuatro
 * que no obliga a elegir biblioteca.
```

Y con la tabla real escrita al lado, para que se vea el parecido:

```typescript
 *   const rutas: Routes = [
 *     { path: "", component: Inicio },
 *     { path: "tareas/nueva", component: Nueva },
 *     { path: "tareas/:id", component: Detalle },
 *     { path: "**", component: NoEncontrada },
 *   ];
```

```typescript
 * Aquí se reescribe la lógica a mano para que el emparejamiento se vea, que es
 * lo que la clase enseña. Y hay una diferencia de comportamiento que sí importa:
 * **el enrutador de Angular empareja en orden**, como esta versión, así que
 * poner `tareas/:id` antes que `tareas/nueva` rompe la aplicación igual.
```

Y un detalle de plantilla que resuelve el caso de la pantalla sin identificador —
[`angular/src/main.ts`](implementaciones/angular/src/main.ts):

```typescript
    // `[attr.data-id]` con `null` NO escribe el atributo, que es justo lo que se
    // quiere: la pantalla de inicio no tiene identificador.
```

### Svelte · [`svelte/Pantalla.svelte`](implementaciones/svelte/Pantalla.svelte)

```svelte
  // En SvelteKit no hay tabla que escribir: **las rutas son directorios**.
  // `src/routes/tareas/[id]/+page.svelte` es la ruta `/tareas/:id`, y el
  // parámetro llega en `data`. Es la convención sobre la configuración llevada
  // al enrutado, y es la diferencia más grande con los otros tres.
```

```svelte
  // La tabla de este archivo existe porque la clase no usa SvelteKit: enseña el
  // modelo, no el metaframework. Cómo se comporta el metaframework encima es la
  // parte 7.
```

## 🔬 Comparación

| | Quién trae el enrutador | Quién decide el orden | Dónde vive la tabla |
| --- | --- | --- | --- |
| **React** | una biblioteca que eliges | tú, con el orden de la tabla | en el código |
| **Vue** | Vue Router, **oficial** | el router, por especificidad | en el código |
| **Angular** | **el framework** | tú, con el orden de la tabla | en el código, con tipo |
| **Svelte** | SvelteKit | el framework, por el nombre | **en los directorios** |

Cuatro lecturas:

- **Los cuatro modelos son cuatro respuestas a «cuánto decide el framework».**
  De React —nada— a SvelteKit —todo, incluida la estructura de carpetas—. Es la
  misma escala de la clase 004 aplicada a una pieza concreta.
- **Ordenar por especificidad quita un error entero.** Con Vue Router y con
  SvelteKit, poner `:id` antes que `nueva` no rompe nada. Con React y con
  Angular, sí.
- **Las rutas como directorios eliminan la tabla y crean otra cosa que aprender:**
  qué significa cada corchete, cada paréntesis y cada `+` en un nombre de
  archivo.
- **La tabla vale para los dos lados.** Es lo que permite que la misma
  aplicación se renderice en el servidor y siga funcionando en el cliente, y es
  el puente hacia la parte 7.

## ⚠️ Errores frecuentes

- **Devolver 200 para lo que no existe.** Es el fallo clásico de las
  aplicaciones de una sola página: página vacía, estado 200, y los buscadores la
  indexan.
- **Poner la ruta con parámetro antes que la literal.** En React y en Angular
  eso hace que `/tareas/nueva` abra el detalle de la tarea «nueva».
- **Guardar en el estado lo que ya está en la dirección.** Qué pestaña está
  abierta, qué filtro está puesto: si va en la URL, se puede compartir, marcar y
  recargar. Es estado gratis.
- **Olvidar que la dirección la escribe el usuario.** Un parámetro de ruta es
  entrada externa, con todo lo que eso implica — parte 3.
- **Suponer que el servidor sirve cualquier ruta.** Sin la configuración de
  reserva, `/tareas/42` recargada a pelo da un 404 del servidor web.

## ✅ Verificación

```bash
node scripts/run-class.mjs 090
```

Y para jugar con el emparejador:

```bash
curl -s "http://127.0.0.1:4100/emparejar?patron=/a/:x/b/:y&ruta=/a/1/b/2"
```

## 🧪 Reto de transferencia

1. **Invierte el orden** de `/tareas/nueva` y `/tareas/:id` en la implementación
   de React y ejecuta la clase. El caso 3 se pone en rojo, y ese rojo es un fallo
   real que en producción nadie nota hasta que alguien pulsa «nueva».
2. **Comprueba el 404 de tu aplicación.** Pide una dirección inventada y mira el
   estado de la respuesta, no la pantalla.
3. **Busca estado que debería estar en la dirección.** Filtros, pestañas,
   paginación. Cada uno que muevas a la URL es uno que el usuario puede compartir.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — cuánto decide cada framework
- [Clase 012](../../parte-1-responder/012-rutas-y-parametros-de-ruta/README.md) — el mismo emparejamiento, en el servidor
- [Clase 093](../../parte-7-renderizado-y-fullstack/093-las-cuatro-estrategias-de-renderizado/README.md) — la tabla ejecutándose en los dos lados
- [Índice de la parte 6](../README.md)

## Fuentes

- [@mdn-web-docs] *MDN Web Docs*. Mozilla — <https://developer.mozilla.org/>
- [@patterns-dev] *Patterns.dev — Modern Web App Design Patterns* — <https://www.patterns.dev/>
- [@fielding-rest-dissertation] Fielding, Roy T. *Architectural Styles and the Design of Network-based Software Architectures*. UC Irvine, 2000 — <https://ics.uci.edu/~fielding/pubs/dissertation/top.htm>
