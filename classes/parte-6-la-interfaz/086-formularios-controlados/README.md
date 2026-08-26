# Clase 086 — Formularios controlados

> [⬅️ 085](../085-listas-y-claves/README.md) · [📚 Parte 6](../README.md) · [🎓 Clases](../../README.md) · [087 ➡️](../087-efectos-y-ciclo-de-vida/README.md)
>
> Parte **6 — La interfaz: del HTML del servidor al componente** · Nivel **🟡 intermedio** · Pista **`frontend`** (Interfaz y componentes)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

**¿Quién es el dueño del valor de un campo?** El estado del componente, o el
`<input>` del navegador.

Es la única pregunta de esta clase, y de su respuesta salen todas las demás: si
se puede validar mientras se escribe, si dos campos pueden depender uno del
otro, y cuánto código hace falta para un formulario de tres líneas.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Escribir un campo controlado** en cuatro tecnologías, con su normalización y
  su límite.
- **Decidir** cuándo un campo no controlado es la opción correcta — que lo es más
  a menudo de lo que parece.
- **Explicar** en qué se convierte `v-model` y por qué no es magia.
- **Situar** dónde encaja una regla de validación, y por qué el atajo cómodo
  quita ese sitio.

## 🧩 La situación

Un campo de texto con dos reglas: **todo en minúsculas** y **diez caracteres como
mucho**.

Con un `<input>` normal, esas reglas se aplican *después* — el usuario ve
aparecer la letra y luego desaparecer. Con un campo controlado se aplican
*antes*: la letra no llega a existir.

La diferencia entre las dos experiencias cabe en quién guarda el valor.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /?texto=hola` | el campo controlado lleva el valor del estado |
| 2 | `GET /?texto=` | con el estado vacío, no queda texto |
| 3 | `GET /no-controlado?texto=hola` | el valor inicial, sin vínculo |
| 4 | `GET /cambio?desde=hol&tecla=A` | cada tecla pasa por el estado y **se normaliza** |
| 5 | `GET /cambio?desde=1234567890&tecla=x` | **el límite se aplica antes de escribir** |
| 6 | `GET /formulario.json` | cómo se ata aquí, leído del archivo |

Una nota sobre el caso 2 que salió al escribirlo, y que se parece a la de la
clase 082: **React escribe `value=""` y Vue deja el atributo desnudo —`value`—**.
Las dos formas son HTML válido y significan lo mismo. El contrato comprueba que
no quede texto, en lugar de exigir una de las dos escrituras.

**Y lo que no se comprueba:** teclear. Ver la letra aparecer necesita un
navegador, y eso es la clase 128. Lo que se verifica es lo que decide el diseño —
quién lleva el valor en el marcado y qué produce la función de cambio.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Formulario controlado**](../../../glosario/README.md#formulario-controlado) | Un campo cuyo valor lo dicta el estado del componente en lugar del DOM. Da control total sobre lo que se puede escribir, y obliga a que cada pulsación pase por el estado. |

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
| `Campo.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `reglas.mjs` | código JavaScript (módulo ES) |
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
| `Campo.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `reglas.mjs` | código JavaScript (módulo ES) |
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
| `Campo.svelte` | componente de Svelte |
| `CampoNoControlado.svelte` | componente de Svelte |
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
| `Campo.mjs` | código JavaScript (módulo ES) |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `reglas.mjs` | código JavaScript (módulo ES) |
| `server.mjs` | código JavaScript (módulo ES) |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Los cuatro comparten la misma regla — [`reglas.mjs`](implementaciones/react/reglas.mjs),
idéntico en las cuatro:

```javascript
export const LIMITE = 10;

export function siguiente(valorActual, tecla) {
  const propuesto = `${valorActual}${tecla}`.toLowerCase();
  return propuesto.length > LIMITE ? valorActual : propuesto;
}
```

```javascript
 * Es el corazón de un campo controlado: cada pulsación no escribe en el campo,
 * **produce un valor nuevo** que pasa por aquí antes de volver a la pantalla.
```

Y el detalle que separa una experiencia buena de una mala:

```javascript
 * «Antes de escribir» no es un detalle de estilo. Un límite aplicado después
 * deja que el usuario vea el carácter aparecer y desaparecer; aplicado antes, el
 * carácter no llega a existir.
```

### React · [`react/Campo.mjs`](implementaciones/react/Campo.mjs)

```javascript
export function CampoControlado({ texto = "", alEscribir = () => {} }) {
  return h("input", {
    "data-campo": "controlado",
    value: texto,
    onChange: (evento) => alEscribir(siguiente(texto, evento.target.value.slice(-1))),
  });
}
```

```javascript
 * `value` atado a una variable convierte al `<input>` en una pantalla: no
 * guarda nada, muestra lo que el estado diga. Si `onChange` no llamara al
 * asignador, el campo **no cambiaría al escribir** — y ese es el clásico
 * «mi input no me deja teclear» de quien empieza con React.
```

**Y el no controlado, que no es peor:**

```javascript
export function CampoNoControlado({ texto = "" }) {
  return h("input", { "data-campo": "no-controlado", defaultValue: texto });
}
```

```javascript
 * No es peor: es el comportamiento de un formulario de HTML de siempre, y para
 * un formulario que solo se lee al enviar es más simple y más rápido.
```

### Vue · [`vue/Campo.mjs`](implementaciones/vue/Campo.mjs)

```javascript
 * En una plantilla se escribe `<input v-model="texto">` y ya está: el campo lee
 * del estado y lo escribe al teclear. Es la diferencia más visible con React, y
 * es la razón de que los formularios de Vue tengan fama de cómodos.
 *
 * Aquí, desde una función de render, se ve **en qué se convierte ese atajo**:
 * exactamente lo mismo que escribe React a mano — un `value` y un manejador.
 * `v-model` no añade magia: quita la mitad de las teclas.
```

```javascript
    return h("input", {
      "data-campo": "controlado",
      value: this.texto,
      onInput: (evento) => this.alEscribir(siguiente(this.texto, evento.target.value.slice(-1))),
    });
```

**Y el precio del atajo, que es el contenido de esta clase:**

```javascript
 * Y tiene una consecuencia práctica que conviene conocer: con `v-model` puro no
 * hay sitio donde meter la normalización. Para eso están los modificadores
 * —`v-model.trim`, `.number`— y, cuando no bastan, hay que abrir el atajo en sus
 * dos mitades como está aquí.
```

### Svelte · [`svelte/Campo.svelte`](implementaciones/svelte/Campo.svelte)

```svelte
  // Y en Svelte 5 es más que azúcar sintáctico: con `$bindable()`, un componente
  // puede declarar que una de sus propiedades es de DOS DIRECCIONES, y el padre
  // se ata a ella con `bind:`. Ninguno de los otros tres deja que la propiedad
  // misma sea bidireccional.
```

```svelte
  // Aquí no se usa el atajo a propósito: escribir las dos mitades —`value` y
  // `oninput`— es lo que deja ver dónde encaja la normalización. Con
  // `bind:value` puro no hay hueco donde meterla, igual que con `v-model`.
```

`$bindable()` es el único mecanismo de los cuatro que rompe la regla de la clase
083 —datos abajo, avisos arriba— **a propósito y de forma declarada**. Para un
campo de formulario, esa excepción se defiende sola.

### SolidJS · [`solid/Campo.mjs`](implementaciones/solid/Campo.mjs)

```javascript
export function CampoControlado(props) {
  const texto = () => props.texto ?? "";
  return ssr(['<input data-campo="controlado" value="', '">'], escape(texto()));
}
```

Se parece a React y por debajo no se parece en nada:

```javascript
 * Y esa es la diferencia de fondo con React, aunque el código se parezca. En
 * React, cada tecla vuelve a ejecutar el componente entero y el `<input>` se
 * compara con su versión anterior. En Solid, el componente se ejecutó una vez:
 * lo que hay atado al estado es **el atributo**, y cambiarlo escribe
 * directamente en el nodo.
 *
 * Por eso Solid no sufre el problema clásico del cursor que salta al principio
 * del campo: no reemplaza el elemento, le cambia una propiedad.
```

## 🔬 Comparación

| | Atajo bidireccional | Dónde encaja la normalización | Coste por tecla |
| --- | --- | --- | --- |
| **React** | ❌ ninguno | en el manejador, siempre visible | el componente se vuelve a ejecutar |
| **Vue** | ✅ `v-model` | en un modificador, o abriendo el atajo | se actualiza el nodo atado |
| **Svelte** | ✅ `bind:value` y `$bindable()` | abriendo el atajo | el código compilado toca el nodo |
| **SolidJS** | ❌ ninguno | en el manejador, siempre visible | se escribe un atributo |

Tres lecturas:

- **El atajo cómodo quita el sitio donde va la regla.** `v-model` y `bind:value`
  ahorran teclas en el noventa por ciento de los campos, y en el diez por ciento
  restante hay que deshacerlos. Saber en qué caso estás es la decisión.
- **React y Solid escriben lo mismo y hacen cosas distintas.** El primero
  reconcilia el elemento; el segundo escribe el atributo. De ahí viene el
  problema del cursor, que solo existe en el modelo de árbol virtual.
- **`$bindable()` es la única propiedad de dos direcciones del elenco**, y Svelte
  la marca explícitamente. Romper la regla declarándolo es muy distinto a
  romperla sin decirlo.

## ⚠️ Errores frecuentes

- **`value` sin manejador en React.** El campo queda congelado y no deja
  teclear. Es el primer tropiezo de casi todo el mundo.
- **Controlar todos los campos «por si acaso».** Un formulario de veinte campos
  que solo se lee al enviar no necesita veinte estados: necesita un `<form>`.
- **Aplicar el límite después.** Recortar en el `submit` en lugar de en el
  cambio deja que el usuario escriba cosas que luego desaparecen.
- **Creer que `v-model` es magia.** Es `value` más `onInput`. Saberlo es lo que
  permite abrirlo cuando hace falta.
- **Normalizar en el render en lugar de en el cambio.** Poner
  `value={texto.toLowerCase()}` funciona a medias: el estado sigue teniendo
  mayúsculas y el día que se envía, se envía mal.

## ✅ Verificación

```bash
node scripts/run-class.mjs 086
```

Y para ver el atajo que declara cada uno:

```bash
curl -s http://127.0.0.1:4100/formulario.json
```

## 🧪 Reto de transferencia

1. **Quita el manejador** de la implementación de React y ejecuta la clase. El
   caso 1 sigue en verde —el marcado no cambia— y el campo está roto. Es la misma
   lección que la clase 085: el HTML correcto no garantiza nada.
2. **Cuenta los campos de tu formulario más grande** y decide cuántos necesitan
   estar controlados de verdad. Casi siempre son menos de los que lo están.
3. **Escribe la regla «diez caracteres» con `v-model` puro.** Verás que no hay
   dónde ponerla sin abrir el atajo, y esa es la conclusión de la clase.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — cuándo compensa controlar
- [Clase 083](../083-propiedades-y-eventos/README.md) — la regla que `$bindable()` rompe a propósito
- [Clase 084](../084-estado-local/README.md) — el estado que gobierna el campo
- [Clase 039](../../parte-3-validacion-y-contrato/039-validar-la-entrada/README.md) — la misma validación, del otro lado
- [Índice de la parte 6](../README.md)

## Fuentes

- [@silver-form-design-patterns] Silver, Adam. *Form Design Patterns*. Smashing Magazine, 2018. ISBN 9783945749456 — <https://openlibrary.org/isbn/9783945749456>
- [@banks-porcello-learning-react] Banks, A.; Porcello, E. *Learning React*, 2.ª ed. O'Reilly Media, 2020. ISBN 9781492051725 — <https://openlibrary.org/isbn/9781492051725>
- [@vue-reactivity] *Reactivity in Depth*. Vue.js — <https://vuejs.org/guide/extras/reactivity-in-depth.html>
- [@mdn-web-docs] *MDN Web Docs*. Mozilla — <https://developer.mozilla.org/>
