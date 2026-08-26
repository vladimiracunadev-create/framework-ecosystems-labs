# Clase 087 — Efectos y ciclo de vida

> [⬅️ 086](../086-formularios-controlados/README.md) · [📚 Parte 6](../README.md) · [🎓 Clases](../../README.md) · [088 ➡️](../088-estado-compartido/README.md)
>
> Parte **6 — La interfaz: del HTML del servidor al componente** · Nivel **🟡 intermedio** · Pista **`frontend`** (Interfaz y componentes)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Lo que ocurre **alrededor** del render: suscribirse a algo, cargar datos,
arrancar un temporizador — y limpiarlo todo al terminar.

Y el hecho que más consecuencias tiene y menos se sabe: **un efecto no se
ejecuta al renderizar en el servidor**. Esta clase lo comprueba contando.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Declarar un efecto con su limpieza** en cuatro tecnologías.
- **Explicar** por qué una página que carga sus datos en un efecto sale vacía del
  servidor.
- **Distinguir** ciclo de vida de reacción a un cambio, que React junta y las
  otras tres separan.
- **Reconocer** los dos errores clásicos de la lista de dependencias, y por qué
  tres de los cuatro no pueden cometerlos.

## 🧩 La situación

Un componente que al montarse carga algo. En el navegador funciona: aparece «sin
cargar» un instante y luego el dato.

En el servidor, ese instante **es todo lo que hay**. El HTML sale con «sin
cargar» dentro, y el usuario lo ve hasta que el JavaScript arranca y el efecto
por fin corre.

Ese parpadeo es la causa número uno de páginas que se ven mal el primer segundo,
y la razón de que exista la parte 7 entera.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /` | la página se renderiza con el estado inicial |
| 2 | `GET /ciclo` | **`efectos_ejecutados: 0`** |
| 3 | `GET /ciclo` | y `limpiezas_ejecutadas: 0` |
| 4 | `GET /debe-repetirse?antes=1,dos&despues=1,tres` | se repite si algo cambió |
| 5 | `GET /debe-repetirse?antes=1,dos&despues=1,dos` | **no** se repite si son iguales |
| 6 | `GET /efecto.json` | cómo se declara aquí, leído del archivo |

**Esta clase aprovecha el servidor en lugar de sufrirlo.** Un efecto no devuelve
nada y no aparece en el HTML: por definición, lo que hace ocurre fuera. Así que
para meterlo en un contrato hay que dejar una marca — y esa marca es un contador
que el efecto incrementa.

Después de renderizar, ese contador sigue en cero. **Eso es el caso 2**, y es la
demostración más directa que se puede dar de que un efecto no corre en el
servidor.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Efecto**](../../../glosario/README.md#efecto) | Trabajo que ocurre fuera del renderizado: pedir datos, suscribirse, tocar el DOM. Su parte difícil no es lanzarlo: es **limpiarlo** cuando el componente desaparece o sus dependencias cambian. |

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
| `Reloj.mjs` | código JavaScript (módulo ES) |
| `contadores.mjs` | código JavaScript (módulo ES) |
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
| `Reloj.mjs` | código JavaScript (módulo ES) |
| `contadores.mjs` | código JavaScript (módulo ES) |
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
| `Reloj.svelte` | componente de Svelte |
| `contadores.mjs` | código JavaScript (módulo ES) |
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
| `Reloj.mjs` | código JavaScript (módulo ES) |
| `contadores.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Los cuatro comparten los contadores —
[`contadores.mjs`](implementaciones/react/contadores.mjs), idéntico en las
cuatro:

```javascript
 * Un efecto no devuelve nada y no aparece en el HTML: por definición, lo que
 * hace ocurre fuera. Así que para poder comprobarlo por contrato hay que dejar
 * una marca, y estos contadores son esa marca.
 *
 * No es un apaño del laboratorio: es exactamente lo que se hace al depurar un
 * efecto que no se sabe si corre — un `console.log` con una cuenta.
```

Y la comparación de dependencias, escrita tal y como la hace React:

```javascript
export function debeRepetirse(antes, despues) {
  if (antes === null) return true;
  if (antes.length !== despues.length) return true;
  return antes.some((valor, i) => !Object.is(valor, despues[i]));
}
```

```javascript
 * Superficial y con `Object.is`: se comparan los elementos de la lista uno a
 * uno, sin mirar dentro. De ahí sale el error más común con efectos — poner un
 * objeto o un array literal en las dependencias, que es distinto en cada render
 * aunque su contenido sea igual, y hace que el efecto se repita siempre.
```

### React · [`react/Reloj.mjs`](implementaciones/react/Reloj.mjs)

```javascript
  useEffect(() => {
    cuenta.efecto += 1;
    ponerDato("cargado en el navegador");

    return () => {
      cuenta.limpieza += 1;
    };
  }, [etiqueta]);
```

```javascript
 * `useEffect` está pensado para lo que ocurre DESPUÉS de que el navegador pinte:
 * suscribirse a algo, medir un elemento, arrancar un temporizador. En el
 * servidor no hay nada de eso, así que React no lo ejecuta.
 *
 * La consecuencia práctica es la que sorprende: si los datos se cargan en un
 * efecto, **el HTML del servidor sale vacío** y el usuario ve «sin cargar» hasta
 * que el JavaScript arranca. Es la causa número uno de páginas que parpadean, y
 * la razón de que existan los metaframeworks de la parte 7.
```

Y una decisión de React que confunde a mucha gente, declarada en su respuesta:

```javascript
      nota:
        "React ejecuta el efecto dos veces seguidas en desarrollo con el modo estricto, a propósito: es la forma de descubrir que falta la limpieza",
```

### Vue · [`vue/Reloj.mjs`](implementaciones/vue/Reloj.mjs)

```javascript
 * Donde React tiene un solo `useEffect` con una lista de dependencias, Vue tiene
 * dos herramientas distintas y cada una dice para qué es:
 *
 *   - `onMounted` / `onUnmounted`: el ciclo de vida. Ocurre una vez.
 *   - `watch`: reaccionar a que un dato concreto cambió.
```

```javascript
 * Esa separación evita el error más común de `useEffect` —usarlo para lo que no
 * es— y a cambio obliga a saber cuál toca. Quien viene de React suele buscar el
 * equivalente de `useEffect` y encuentra dos, y esa es exactamente la pregunta
 * que hay que hacerse: ¿esto es ciclo de vida o es reaccionar a un cambio?
```

Y lo que sí corre en el servidor, marcado en el propio código:

```javascript
    // `setup` SÍ corre en el servidor: es donde se prepara el componente.
    cuenta.render += 1;
```

### Svelte · [`svelte/Reloj.svelte`](implementaciones/svelte/Reloj.svelte)

```svelte
  onMount(() => {
    cuenta.efecto += 1;
    dato = "cargado en el navegador";

    // LA LIMPIEZA: la función devuelta se ejecuta al destruir el componente.
    return () => {
      cuenta.limpieza += 1;
    };
  });
```

```svelte
  // `$effect` deduce sus dependencias LEYÉNDOLAS: no hay lista que mantener, y
  // por tanto no existe el error de olvidar una. A cambio, tampoco se puede
  // mentir sobre cuáles son — que es lo que la lista de React permite hacer.
```

### SolidJS · [`solid/Reloj.mjs`](implementaciones/solid/Reloj.mjs)

```javascript
 * `createEffect` corre después de que el componente se haya montado y **vuelve a
 * correr solo cuando cambia algo que leyó**. No hay lista de dependencias: la
 * suscripción se establece al leer la señal, igual que en el render.
 *
 * Eso quita de golpe dos errores clásicos de React: la dependencia olvidada —no
 * hay lista— y el efecto que se repite siempre porque en las dependencias hay un
 * objeto literal.
```

```javascript
  onCleanup(() => {
    cuenta.limpieza += 1;
  });
```

## 🔬 Comparación

| | Ciclo de vida | Reaccionar a un cambio | ¿Lista de dependencias? |
| --- | --- | --- | :---: |
| **React** | `useEffect` con `[]` | `useEffect` con dependencias | **✅ a mano** |
| **Vue** | `onMounted` / `onUnmounted` | `watch` / `watchEffect` | ❌ |
| **Svelte** | `onMount` | `$effect` | ❌ |
| **SolidJS** | `onMount` / `onCleanup` | `createEffect` | ❌ |

Y lo que los cuatro tienen en común, verificado:

| | ¿Corre el efecto en el servidor? | Qué sí corre |
| --- | :---: | --- |
| **React** | ❌ | el cuerpo del componente |
| **Vue** | ❌ | `setup` y el render |
| **Svelte** | ❌ | el cuerpo del `<script>` |
| **SolidJS** | ❌ | el cuerpo del componente |

Tres lecturas:

- **Ninguno ejecuta efectos en el servidor, y los cuatro sí ejecutan el cuerpo.**
  De ahí sale la regla práctica: lo que tenga que estar en el HTML inicial no
  puede vivir en un efecto.
- **React es el único con lista de dependencias**, y esa lista es la fuente de
  sus dos errores clásicos: olvidar una —el efecto usa un valor viejo— y meter un
  literal —el efecto se repite siempre. Los otros tres no pueden cometerlos
  porque deducen las dependencias.
- **Tener lista también tiene una ventaja, y conviene decirla:** se puede
  *mentir* a propósito. «Este efecto solo al montar, aunque lea otras cosas» es
  una necesidad real, y con dependencias deducidas hay que dar rodeos para
  conseguirlo.

## ⚠️ Errores frecuentes

- **Cargar datos en un efecto y esperar que salgan del servidor.** No salen. Si
  el dato tiene que estar en el HTML inicial, hay que traerlo antes de
  renderizar — parte 7.
- **Olvidar la limpieza.** Un temporizador o una suscripción sin limpiar
  sobreviven al componente. React ejecuta el efecto dos veces en desarrollo
  precisamente para que se note.
- **Meter un objeto literal en las dependencias.** `[{ id }]` es un objeto nuevo
  en cada render, así que el efecto se repite siempre. La comparación es
  superficial, con `Object.is`.
- **Usar un efecto para derivar un valor.** Si algo se puede calcular a partir del
  estado, se calcula al renderizar — no se guarda en otro estado desde un efecto.
- **Confundir «montar» con «renderizar».** El render puede ocurrir en el servidor;
  montar, no. Los nombres de las tres tecnologías que no son React lo dicen:
  `onMounted`, `onMount`.

## ✅ Verificación

```bash
node scripts/run-class.mjs 087
```

Y el caso que más enseña, con el servidor levantado:

```bash
curl -s http://127.0.0.1:4100/ciclo
```

## 🧪 Reto de transferencia

1. **Mueve la carga de datos** de un efecto al cuerpo del componente en tu
   proyecto y mira qué se rompe. Lo que se rompa es la razón de que estuviera en
   el efecto.
2. **Busca un efecto sin limpieza** que arranque un temporizador o una
   suscripción. Móntalo y desmóntalo diez veces y mira la memoria.
3. **Cuenta las dependencias mentidas.** Si tu proyecto usa React, busca los
   comentarios que desactivan el verificador de dependencias. Cada uno es una
   decisión que alguien tomó y que conviene revisar.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué gana y qué paga cada modelo
- [Clase 084](../084-estado-local/README.md) — el estado que el efecto cambia
- [Clase 093](../../parte-7-renderizado-y-fullstack/093-las-cuatro-estrategias-de-renderizado/README.md) — traer los datos antes de renderizar
- [Índice de la parte 6](../README.md)

## Fuentes

- [@banks-porcello-learning-react] Banks, A.; Porcello, E. *Learning React*, 2.ª ed. O'Reilly Media, 2020. ISBN 9781492051725 — <https://openlibrary.org/isbn/9781492051725>
- [@vue-reactivity] *Reactivity in Depth*. Vue.js — <https://vuejs.org/guide/extras/reactivity-in-depth.html>
- [@solid-reactivity] *Intro to Reactivity*. SolidJS — <https://docs.solidjs.com/concepts/intro-to-reactivity>
- [@mdn-web-docs] *MDN Web Docs*. Mozilla — <https://developer.mozilla.org/>
