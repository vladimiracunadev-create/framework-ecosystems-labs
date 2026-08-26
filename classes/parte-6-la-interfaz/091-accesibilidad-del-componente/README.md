# Clase 091 — Accesibilidad del componente

> [⬅️ 090](../090-enrutado-en-el-cliente/README.md) · [📚 Parte 6](../README.md) · [🎓 Clases](../../README.md) · [092 ➡️](../092-los-tres-modelos-de-reactividad/README.md)
>
> Parte **6 — La interfaz: del HTML del servidor al componente** · Nivel **🟡 intermedio** · Pista **`frontend`** (Interfaz y componentes)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Dos versiones del mismo control que **se ven exactamente igual**: una la puede
usar todo el mundo y la otra no.

Y una idea que cambia cómo se aborda el problema: **la accesibilidad de un
componente está sobre todo en el marcado**, y el marcado es justo lo que un
servidor produce. Así que aquí se puede auditar de verdad.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Escribir un control accesible** con elementos nativos y estado expuesto en
  cuatro tecnologías.
- **Auditar tu propio marcado** con cinco reglas que no necesitan navegador.
- **Explicar** por qué usar un `<div>` como botón rompe cuatro cosas a la vez.
- **Saber** qué pone tu framework y qué sigue siendo tuyo — que es casi todo.

## 🧩 La situación

Un botón que abre un panel, y un campo con su etiqueta.

La primera versión usa `<button>`, asocia la `<label>` con `for` y expone el
estado con `aria-expanded`. La segunda usa un `<div>` con una clase que lo pinta
igual, un texto suelto encima del campo, y el estado solo en el color.

**En la pantalla son indistinguibles.** Ninguna prueba de render las separa.
Ningún compilador da error — salvo uno de los cuatro, y esa es la sorpresa de la
clase.

Para quien navega con teclado, el segundo botón **no existe**.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /accesible` | `<button>`, `aria-expanded`, `<label for>` |
| 2 | `GET /inaccesible` | nada de eso, y se ve igual |
| 3 | `GET /auditar?version=accesible` | **las cinco reglas pasan** |
| 4 | `GET /auditar?version=inaccesible` | **las cinco fallan** |
| 5 | `GET /accesible?abierto=si` | el estado en el marcado, no en el color |
| 6 | `GET /accesibilidad.json` | qué pone el framework y qué es tuyo |

**La auditoría no es un adorno: es el contenido.** Cinco reglas comprobables
sobre el HTML que sale, sin navegador. Y la clase dice desde el principio lo que
eso no es: pasar las cinco significa **no cometer los cinco errores más
comunes**, que es un suelo y no un techo.

<!-- generado: fichas -->

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
| `Control.mjs` | código JavaScript (módulo ES) |
| `auditor.mjs` | código JavaScript (módulo ES) |
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
| `Control.mjs` | código JavaScript (módulo ES) |
| `auditor.mjs` | código JavaScript (módulo ES) |
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
| `ControlAccesible.svelte` | componente de Svelte |
| `ControlInaccesible.svelte` | componente de Svelte |
| `auditor.mjs` | código JavaScript (módulo ES) |
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
| `Control.mjs` | código JavaScript (módulo ES) |
| `auditor.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las cuatro comparten el auditor —
[`auditor.mjs`](implementaciones/react/auditor.mjs), idéntico en las cuatro:

```javascript
 * No son las únicas ni las más difíciles: son las que un servidor puede
 * verificar sin navegador, y por eso están aquí. Una auditoría de verdad usa
 * axe-core sobre el DOM renderizado y mira además contraste, orden del foco y lo
 * que anuncia un lector de pantalla.
 *
 * Decirlo importa: **pasar estas cinco no significa que el componente sea
 * accesible**. Significa que no comete los cinco errores más comunes, que es un
 * suelo, no un techo.
```

**Las cinco reglas, con su porqué:**

```javascript
    id: "elemento-nativo",
    dice: "un control interactivo es un <button> o un <a>, no un <div>",
    por_que:
      "el elemento nativo trae gratis el foco con teclado, la activación con Enter y Espacio, y el papel correcto para un lector de pantalla",
```

```javascript
    id: "estado-expuesto",
    dice: "si algo se abre y se cierra, el marcado lo dice",
    por_que:
      "el color y la flecha son información visual: aria-expanded es la misma información para quien no la ve",
```

Y la que comprueba de verdad la asociación, no solo que exista una etiqueta:

```javascript
    comprobar: (html) => {
      const etiqueta = html.match(/<label[^>]*for="([^"]+)"/);
      return Boolean(etiqueta) && new RegExp(`id="${etiqueta[1]}"`).test(html);
    },
```

Se audita **la salida**, no el código —
[`react/server.mjs`](implementaciones/react/server.mjs):

```javascript
    // Se audita EL MARCADO QUE SALE, no el código que lo produce. Es la única
    // forma honesta: lo que llega al navegador es lo que importa.
```

### React · [`react/Control.mjs`](implementaciones/react/Control.mjs)

```javascript
 * Fíjate en lo poco que hay: un `<button>` en lugar de un `<div>`, una `<label>`
 * con `htmlFor`, y un `aria-expanded`. Tres decisiones, y la diferencia entre un
 * componente que puede usar todo el mundo y uno que no.
```

Y la trampa propia del ecosistema:

```javascript
 * `htmlFor` es el nombre que React le da a `for`, porque `for` es palabra
 * reservada en JavaScript. Es de las pocas veces que React cambia el nombre de
 * un atributo del HTML, y por eso se olvida tanto.
```

**La versión inaccesible, con el aviso que resume la clase:**

```javascript
 * Nada de esto da error. Ninguna prueba de render lo detecta. En la pantalla es
 * indistinguible — y para quien navega con teclado, el botón no existe.
```

### Vue · [`vue/Control.mjs`](implementaciones/vue/Control.mjs)

```javascript
 * Vue tiene aquí una ventaja pequeña y real frente a React: **los atributos se
 * escriben como en HTML**. `for` es `for`, `class` es `class`. No hay que
 * recordar ningún renombrado, y eso quita una fuente de olvidos.
```

Y una trampa que no tiene ninguno de los otros tres:

```javascript
 * Y hay una trampa propia de Vue que merece señalarse: `v-if` quita el elemento
 * del árbol y `v-show` solo lo oculta con CSS. Para un lector de pantalla no es
 * lo mismo — lo que sigue en el árbol se puede leer aunque no se vea, salvo que
 * lleve `hidden` o `aria-hidden`.
```

### Svelte · [`svelte/ControlAccesible.svelte`](implementaciones/svelte/ControlAccesible.svelte) — el único que avisa

```svelte
  // Svelte es el único de los cuatro cuyo COMPILADOR avisa de problemas de
  // accesibilidad. Escribir un `<div>` con `on:click` y sin papel produce un
  // aviso de compilación —`a11y_click_events_have_key_events`— sin instalar
  // nada.
```

**Y no es una afirmación: se demuestra.** El servidor guarda los avisos que el
compilador devolvió y los publica —
[`svelte/server.mjs`](implementaciones/svelte/server.mjs):

```javascript
 * Aquí está lo que ninguna de las otras tres implementaciones puede enseñar: el
 * compilador de Svelte **devuelve una lista de avisos**, y entre ellos están los
 * de accesibilidad. No hay que instalar un verificador ni configurar nada.
 *
 * Se guardan y se publican en `/accesibilidad.json`, así que la clase no afirma
 * que Svelte avise: lo demuestra con lo que el compilador devolvió.
```

Ejecutando la clase, la respuesta real:

```
avisos_al_compilar_la_accesible:   []
avisos_al_compilar_la_inaccesible: ["a11y_click_events_have_key_events",
                                    "a11y_no_static_element_interactions"]
```

Con su límite dicho:

```javascript
        limite_de_los_avisos:
          "cubren lo que se puede deducir del marcado estático; el contraste y el orden del foco siguen fuera",
```

### SolidJS · [`solid/Control.mjs`](implementaciones/solid/Control.mjs)

```javascript
 * Y hay una cosa que Solid hace mejor sin proponérselo: como no reemplaza
 * elementos al actualizar —cambia atributos— **el foco no se pierde** cuando
 * algo cambia cerca. En un modelo de árbol virtual, reemplazar el elemento
 * enfocado lo saca del foco, y ese fallo es sutil y frecuente.
```

Es una ventaja de accesibilidad que **no viene de haber pensado en
accesibilidad**: sale del modelo de actualización. Merece la pena verlo, porque
así funcionan la mayoría de las ventajas reales.

## 🔬 Comparación

| | Atributos como en HTML | Avisa el compilador | Verificador | Ventaja del modelo |
| --- | :---: | :---: | --- | --- |
| **React** | ❌ (`htmlFor`, `className`) | ❌ | `eslint-plugin-jsx-a11y` | — |
| **Vue** | ✅ | ❌ | `eslint-plugin-vuejs-accessibility` | — |
| **Svelte** | ✅ | **✅ en la caja** | los propios avisos | — |
| **SolidJS** | ✅ | ❌ | `eslint-plugin-solid` | **no pierde el foco al actualizar** |

Tres lecturas:

- **Ninguno de los cuatro te hace accesible.** Los cuatro dejan escribir el
  `<div>` con clic sin protestar en tiempo de ejecución, y los cuatro producen
  exactamente el mismo HTML roto.
- **Que el aviso venga en la caja cambia cuánta gente lo ve.** Los verificadores
  de los otros tres existen y son buenos; la diferencia es que hay que saber que
  existen, instalarlos y configurarlos. Svelte avisa el primer día.
- **La mejor ventaja de accesibilidad de esta clase es un efecto secundario.**
  Solid conserva el foco porque no reemplaza nodos, no porque nadie lo diseñara
  para eso.

## ⚠️ Errores frecuentes

- **Usar `<div onClick>` como botón.** Rompe cuatro cosas a la vez: no recibe
  foco, no se activa con teclado, no tiene papel y no aparece en la lista de
  controles de un lector.
- **Poner la etiqueta al lado sin asociarla.** Un `<span>` encima del campo se ve
  igual y no dice nada. Además, pulsar una etiqueta asociada enfoca el campo — se
  pierde también eso.
- **Expresar el estado solo con color.** Abierto, seleccionado, con error: si la
  única señal es visual, hay quien no la recibe. `aria-expanded`,
  `aria-selected`, `aria-invalid`.
- **`tabindex="-1"` en un control que hay que poder usar.** Lo saca del recorrido
  del teclado. Su uso legítimo es otro: enfocar algo por código sin meterlo en el
  recorrido.
- **Creer que un componente de biblioteca es accesible por serlo.** Los buenos lo
  son; muchos no. Auditar el marcado que producen es la única forma de saberlo.

## ✅ Verificación

```bash
node scripts/run-class.mjs 091
```

Y la auditoría de las dos versiones, con el servidor levantado:

```bash
curl -s "http://127.0.0.1:4100/auditar?version=inaccesible"
```

## 🧪 Reto de transferencia

1. **Pasa el auditor por tu propio marcado.** Copia
   [`auditor.mjs`](implementaciones/react/auditor.mjs) y dale el HTML de una de
   tus pantallas. Las cinco reglas son de las que más se incumplen.
2. **Navega tu aplicación solo con el teclado.** Tabulador, Enter, Espacio,
   Escape. Lo que no puedas hacer es lo que alguien no puede hacer nunca.
3. **Instala el verificador de tu ecosistema** y mira cuántos avisos salen el
   primer día. Ese número es la deuda que la clase 006 no sabía medir.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué pone cada uno y qué sigue faltando
- [Clase 082](../082-el-primer-componente/README.md) — el marcado que cada tecnología produce
- [Clase 086](../086-formularios-controlados/README.md) — el campo, del otro lado
- [Clase 128](../../parte-10-calidad-y-operacion/128-pruebas-de-extremo-a-extremo/README.md) — auditar con un navegador de verdad
- [Índice de la parte 6](../README.md)

## Fuentes

- [@mdn-web-docs] *MDN Web Docs*. Mozilla — <https://developer.mozilla.org/>
- [@silver-form-design-patterns] Silver, Adam. *Form Design Patterns*. Smashing Magazine, 2018. ISBN 9783945749456 — <https://openlibrary.org/isbn/9783945749456>
- [@norman-design-everyday-things] Norman, Don. *The Design of Everyday Things*, ed. revisada. Basic Books, 2013. ISBN 9780465050659 — <https://openlibrary.org/isbn/9780465050659>
- [@tidwell-designing-interfaces] Tidwell, J.; Brewer, C.; Valencia, A. *Designing Interfaces*, 3.ª ed. O'Reilly Media, 2020. ISBN 9781492051961 — <https://openlibrary.org/isbn/9781492051961>
