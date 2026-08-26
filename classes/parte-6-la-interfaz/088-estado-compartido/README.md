# Clase 088 — Estado compartido

> [⬅️ 087](../087-efectos-y-ciclo-de-vida/README.md) · [📚 Parte 6](../README.md) · [🎓 Clases](../../README.md) · [089 ➡️](../089-estado-del-servidor-en-el-cliente/README.md)
>
> Parte **6 — La interfaz: del HTML del servidor al componente** · Nivel **🟡 intermedio** · Pista **`frontend`** (Interfaz y componentes)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Cuando el dato lo necesitan **dos ramas del árbol** y pasarlo hacia abajo deja de
tener sentido.

La clase 084 dijo dónde vive un dato que es de uno solo. Esta es la continuación
incómoda: qué hacer cuando es de varios, y cuánto cuesta cada respuesta.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Reconocer la perforación de propiedades** y ponerle número en tu propio
  código.
- **Elegir** entre subir el estado, usar un contexto o traer un almacén, sabiendo
  qué se paga en cada caso.
- **Explicar** qué pierde un componente cuando lee de un almacén en lugar de
  recibir propiedades.
- **Saber** por qué en Solid el contexto no tiene el problema de rendimiento que
  tiene en React.

## 🧩 La situación

El nombre del usuario entra en la pantalla y lo pinta el nieto, **tres niveles
más abajo**.

Los dos niveles intermedios lo aceptan y no lo usan. Solo lo pasan.

Con un nivel eso es correcto. Con dos, incómodo. Con cinco y tres datos
distintos, cualquier cambio toca quince firmas — y ninguno de esos quince
componentes tenía nada que ver con el usuario.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /por-propiedades?usuario=Ana` | el dato llega al nieto atravesando tres niveles |
| 2 | `GET /por-almacen?usuario=Ana` | **el mismo resultado, sin atravesar nada** |
| 3 | `GET /dos-ramas?usuario=Ana` | dos ramas leen el mismo almacén |
| 4 | `GET /escribir?usuario=Ana&nuevo=Beto` | escribir una vez lo cambia en las dos |
| 5 | `GET /coste.json` | **el precio, contado en el archivo** |

**El caso 2 es el que hay que leer dos veces.** Las dos pantallas son
indistinguibles: mismo HTML, mismo nieto, mismo nombre. La diferencia no está en
la salida — está en cuántos componentes tuvieron que enterarse.

Y por eso el caso 5 no es decorativo: **cuenta cuántas firmas aceptan el dato sin
usarlo**, leyendo el archivo. Es la única forma de convertir «esto es incómodo»
en un argumento con número.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Estado compartido**](../../../glosario/README.md#estado-compartido) | Estado que necesitan varios componentes que no son padre e hijo. Se resuelve subiéndolo al ancestro común, con un contexto o con un almacén externo — y cada opción cambia qué se vuelve a pintar. |

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
| `PorAlmacen.mjs` | código JavaScript (módulo ES) |
| `PorPropiedades.mjs` | código JavaScript (módulo ES) |
| `almacen.mjs` | código JavaScript (módulo ES) |
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
| `PorAlmacen.mjs` | código JavaScript (módulo ES) |
| `PorPropiedades.mjs` | código JavaScript (módulo ES) |
| `almacen.mjs` | código JavaScript (módulo ES) |
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
| `MedioPorAlmacen.svelte` | componente de Svelte |
| `MedioPorPropiedades.svelte` | componente de Svelte |
| `NietoPorAlmacen.svelte` | componente de Svelte |
| `NietoPorPropiedades.svelte` | componente de Svelte |
| `PorAlmacen.svelte` | componente de Svelte |
| `PorPropiedades.svelte` | componente de Svelte |
| `RamaPorAlmacen.svelte` | componente de Svelte |
| `RamaPorPropiedades.svelte` | componente de Svelte |

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
| `PorAlmacen.mjs` | código JavaScript (módulo ES) |
| `PorPropiedades.mjs` | código JavaScript (módulo ES) |
| `almacen.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Los cuatro comparten el mismo almacén mínimo —
[`almacen.mjs`](implementaciones/react/almacen.mjs), idéntico en las cuatro:

```javascript
const estado = { usuario: "sin usuario" };

export function leer() {
  return estado.usuario;
}

export function escribir(valor) {
  estado.usuario = valor;
  return estado.usuario;
}
```

```javascript
 * Deliberadamente pequeño: un objeto, un lector y un escritor. La mayoría de las
 * bibliotecas de estado compartido —Redux, Zustand, Pinia, Nanostores— son esto
 * más suscripciones, herramientas de depuración y convenciones.
```

Y el aviso que acompaña a la comodidad:

```javascript
 * Y el precio, que hay que decirlo: el componente que lee del almacén ya no es
 * una función de sus propiedades. Depende de algo de fuera, así que probarlo
 * exige preparar ese algo.
```

### React · [`react/PorPropiedades.mjs`](implementaciones/react/PorPropiedades.mjs)

```javascript
/** NIVEL INTERMEDIO. Recibe `usuario` y no lo usa: solo lo pasa. */
export function Medio({ usuario }) {
  return h("div", { "data-nivel": "medio" }, h(Nieto, { usuario }));
}
```

```javascript
 * Eso tiene un nombre —*prop drilling*, perforación de propiedades— y no es un
 * problema de estilo: es un problema de acoplamiento. Cada componente
 * intermedio queda atado a un dato que no le importa, así que no se puede mover
 * ni reutilizar sin arrastrarlo.
```

**Y la versión sin perforar** —
[`react/PorAlmacen.mjs`](implementaciones/react/PorAlmacen.mjs):

```javascript
/** NIVEL INTERMEDIO. No acepta nada: no sabe que hay un usuario. */
export function Medio() {
  return h("div", { "data-nivel": "medio" }, h(Nieto));
}
```

Dos líneas contra dos líneas, y la segunda no menciona al usuario. **Eso es todo
el cambio**, y es exactamente lo que hace que el componente se pueda mover a otra
pantalla sin arrastrar nada.

**El coste, contado sobre el texto** —
[`react/server.mjs`](implementaciones/react/server.mjs):

```javascript
      // Se cuenta sobre el texto: cuántas firmas aceptan `usuario`. Si alguien
      // añade un nivel intermedio, este número sube solo.
      firmas_que_aceptan_el_dato: (fuente.match(/\(\{ usuario \}\)/g) ?? []).length,
```

### Vue · [`vue/PorPropiedades.mjs`](implementaciones/vue/PorPropiedades.mjs)

```javascript
 * `Medio` y `Rama` declaran `usuario` en sus `props` y no lo usan: solo lo
 * pasan. En Vue eso se ve incluso más que en React, porque las propiedades se
 * declaran explícitamente — la lista de lo que un componente acepta está
 * escrita, y ahí aparece un dato que no le sirve de nada.
```

Y el atajo que conviene conocer **antes** de traer una biblioteca:

```javascript
 * Vue tiene además un atajo para esto que conviene conocer antes de saltar a un
 * almacén: `provide` / `inject`. Un ancestro provee un valor y cualquier
 * descendiente lo inyecta, sin tocar los niveles intermedios. Es el equivalente
 * del contexto de React, y resuelve el problema sin traer una biblioteca.
```

### Svelte · [`svelte/PorPropiedades.svelte`](implementaciones/svelte/PorPropiedades.svelte)

```svelte
  // Cada `.svelte` intermedio declara `usuario` en su `$props()` y lo único que
  // hace con él es pasarlo al siguiente. En Svelte eso se ve archivo por
  // archivo, que es lo peor de todo: el coste está repartido y no se nota hasta
  // que hay que cambiar el nombre del dato en cuatro sitios.
```

```svelte
  // Svelte tiene su propio atajo antes de llegar a un almacén: `setContext` y
  // `getContext`. Y a diferencia de React o Vue, tiene además ALMACENES EN LA
  // BIBLIOTECA ESTÁNDAR —`writable`, `readable`— así que compartir estado no
  // exige traer nada de fuera.
```

Y aquí sale algo que las otras tres no enseñan —
[`svelte/server.mjs`](implementaciones/svelte/server.mjs):

```javascript
 * Cada `.svelte` se compila por separado y las importaciones entre ellos hay que
 * reescribirlas: el original importa `./Rama.svelte` y el compilado necesita
 * `./Rama.compilada.mjs`. Es exactamente lo que hace la herramienta de
 * construcción de un proyecto real, y aquí está a la vista.
```

### SolidJS · [`solid/PorPropiedades.mjs`](implementaciones/solid/PorPropiedades.mjs)

```javascript
 * `Medio` y `Rama` reciben `props` con un `usuario` que no leen: solo lo
 * reenvían. En Solid esto tiene un matiz propio que conviene decir — como las
 * propiedades son accesos perezosos, **reenviarlas no cuesta nada**: el valor no
 * se lee hasta abajo del todo.
 *
 * Así que el coste aquí no es de rendimiento, es de acoplamiento: los niveles
 * intermedios siguen atados a un dato que no les importa, y eso no lo arregla
 * ninguna optimización.
```

**Y la diferencia con React que más importa** —
[`solid/PorAlmacen.mjs`](implementaciones/solid/PorAlmacen.mjs):

```javascript
 * En Solid el almacén compartido tiene una ventaja que en React no existe: como
 * la reactividad es fina, **escribir en el almacén solo redibuja los sitios que
 * lo leyeron**. No hay que envolver nada en memorias ni preocuparse de que la
 * mitad del árbol se vuelva a renderizar.
 *
 * En React, un contexto que cambia hace que se vuelvan a ejecutar todos los
 * componentes que lo consumen —y sus hijos— salvo que uno lo evite a mano. Es la
 * queja clásica sobre el contexto de React, y aquí simplemente no aparece.
```

## 🔬 Comparación

| | Atajo sin biblioteca | Almacén en la biblioteca estándar | Coste de reenviar |
| --- | --- | :---: | --- |
| **React** | `useContext` | ❌ | ninguno, pero acopla |
| **Vue** | `provide` / `inject` | ❌ | ninguno, y la lista de `props` lo delata |
| **Svelte** | `setContext` / `getContext` | **✅ `writable`** | ninguno, repartido por archivos |
| **SolidJS** | `createContext` | ✅ `createStore` | **cero de verdad**: son accesos perezosos |

Cuatro lecturas:

- **Los cuatro tienen un contexto y casi nadie lo usa.** Se salta directamente a
  una biblioteca de estado global cuando el contexto habría bastado. La pregunta
  antes de traer Redux o Pinia es si el dato lo necesita **una rama** o **la
  aplicación entera**.
- **Svelte y Solid traen almacén en la caja.** Uno menos que instalar, mantener y
  actualizar — que es la dimensión «mantener» de la clase 006.
- **El problema de rendimiento del contexto es solo de React**, y viene de su
  modelo: al cambiar el valor se reejecutan los consumidores y sus hijos. En los
  otros tres la reactividad es fina y el problema no existe.
- **Ningún almacén arregla el acoplamiento, lo mueve.** Antes estaba en las
  firmas de los intermedios; ahora está en que el nieto depende de un módulo
  global.

## ⚠️ Errores frecuentes

- **Traer una biblioteca de estado global para un dato de una pantalla.** El
  contexto del framework resuelve la mayoría de los casos y no añade
  dependencias.
- **Subir el estado al ancestro común «por si acaso».** Si el ancestro común es
  la raíz, acabas de convertir un dato local en global.
- **Meterlo todo en un almacén.** Cuando cualquiera puede escribir desde
  cualquier sitio, «¿quién cambió esto?» vuelve a no tener respuesta — que es
  justo lo que la clase 083 evitaba.
- **Olvidar que el componente deja de ser puro.** Un componente que lee de un
  almacén no se puede probar pasándole propiedades: hay que preparar el almacén
  antes.
- **Envolverlo todo en memorias en React para arreglar el contexto.** Antes de
  eso, comprueba si el contexto está demasiado arriba o si lleva demasiadas
  cosas juntas.

## ✅ Verificación

```bash
node scripts/run-class.mjs 088
```

Y el número que convierte la molestia en argumento:

```bash
curl -s http://127.0.0.1:4100/coste.json
```

## 🧪 Reto de transferencia

1. **Busca en tu proyecto la propiedad que más lejos viaja.** Cuenta cuántos
   componentes la aceptan sin usarla. Ese número decide si mueves el dato.
2. **Prueba primero el contexto del framework.** Antes de instalar nada, mira si
   `useContext`, `provide`/`inject`, `getContext` o `createContext` resuelven el
   caso.
3. **Escribe la lista de quién puede escribir** en tu almacén global. Si la lista
   es «cualquiera», la clase 083 tiene algo que decirte.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — cuándo compensa cada respuesta
- [Clase 083](../083-propiedades-y-eventos/README.md) — la regla que un almacén global relaja
- [Clase 084](../084-estado-local/README.md) — cuando el dato es de uno solo
- [Clase 089](../089-estado-del-servidor-en-el-cliente/README.md) — el estado que ni siquiera es tuyo
- [Índice de la parte 6](../README.md)

## Fuentes

- [@osmani-js-design-patterns] Osmani, Addy. *Learning JavaScript Design Patterns*, 2.ª ed. O'Reilly Media, 2023. ISBN 9781098139872 — <https://openlibrary.org/isbn/9781098139872>
- [@banks-porcello-learning-react] Banks, A.; Porcello, E. *Learning React*, 2.ª ed. O'Reilly Media, 2020. ISBN 9781492051725 — <https://openlibrary.org/isbn/9781492051725>
- [@vue-reactivity] *Reactivity in Depth*. Vue.js — <https://vuejs.org/guide/extras/reactivity-in-depth.html>
- [@solid-reactivity] *Intro to Reactivity*. SolidJS — <https://docs.solidjs.com/concepts/intro-to-reactivity>
