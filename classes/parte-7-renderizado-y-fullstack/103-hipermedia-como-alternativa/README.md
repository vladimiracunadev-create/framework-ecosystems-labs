# Clase 103 — Hipermedia como alternativa

> [⬅️ Clase 102](../102-presupuesto-de-javascript/README.md) · [📚 Parte 7](../README.md) · [🎓 Clases](../../README.md) · [104 ➡️](../104-elegir-estrategia-por-pantalla/README.md)
>
> Parte **7 — Renderizado y full-stack** · Nivel **🔴 avanzado** · Pista **`fullstack`** (Renderizado y full-stack)
>
> ✅ **Clase construida** — 2 implementaciones verificadas contra [`contrato.json`](contrato.json).

> 👥 **El elenco se recortó, y conviene decir por qué.** El manifiesto declaraba
> también Phoenix LiveView. Es la tercera respuesta a esta pregunta y es
> excelente, pero su mecanismo no es este: mantiene una conexión abierta y manda
> diferencias del árbol, no fragmentos de HTML por HTTP. Eso es la parte 8 —clases
> 106 a 109—, y meterlo aquí obligaría a comparar dos cosas distintas con el mismo
> contrato. La clase 009 explica por qué eso no se hace en esta obra.

## 🎯 Objetivo

Las nueve clases anteriores de esta parte dan por hecho que hay estado de
interfaz en el navegador y discuten cuánto cuesta mantenerlo. Esta pregunta lo
contrario: **¿y si no hubiera?**

La respuesta de la hipermedia es que el servidor devuelva HTML y el navegador lo
coloque. Sin estado duplicado, sin sincronización, sin serializar nada. Y esta
clase demuestra la parte que casi nunca se enseña: **es la misma ruta la que
contesta a los dos**.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Escribir una escritura que conteste de dos formas** —documento o fragmento—
  sin duplicar la lógica.
- **Distinguir las dos escuelas**: el cliente decide dónde va el fragmento, o lo
  decide el servidor.
- **Poner el coste sobre la mesa**: una ida y vuelta por interacción, y qué
  pantallas no se lo pueden permitir.
- **Comparar el peso de este modelo** con el suelo de los cinco metaframeworks de
  la clase 102.

## 🧩 La situación

La misma lista de tres tareas y el mismo formulario de las clases 098 y 102. Un
servidor de Node **sin framework**, porque parte del argumento es que aquí el
servidor no tiene que saber nada especial.

Y dos peticiones al mismo `POST /tareas`: una diciendo que sabe colocar
fragmentos, otra sin decir nada.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /` | un documento completo con su formulario de verdad |
| 2 | `POST /tareas` con la cabecera de la biblioteca | **un fragmento**, no un documento ni un JSON |
| 3 | `GET /tareas` | y la tarea queda |
| 4 | `POST /tareas` **sin** la cabecera | **303 a `/tareas`**: el formulario funciona igual |
| 5 | `GET /hipermedia.json` | HTML del servidor, sin estado duplicado |
| 6 | `GET /hipermedia.json` | quién decide dónde va el fragmento, y cuánto pesa |

**Los casos 2 y 4 juntos son la clase.** La misma ruta, la misma escritura, dos
formas de contestar:

```json
        "cuerpo_contiene": ["<li>sacar la basura</li>"],
        "cuerpo_no_contiene": ["<html", "<form", "{"]
```

Ese `"{"` en la lista de lo que no puede aparecer es deliberado: **la respuesta
tampoco es JSON**. Si lo fuera, habría que convertirlo a HTML en algún sitio, y
ese sitio sería estado de interfaz en el cliente.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Hipermedia**](../../../glosario/README.md#hipermedia) | La alternativa en que el servidor devuelve **HTML** en lugar de datos y el cliente solo lo inserta. Reduce el JavaScript a una biblioteca pequeña y devuelve el renderizado al servidor. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **htmx** | hypermedia-library de JavaScript (JavaScript) | 2020 | BSD-2-Clause | proyecto independiente |
| **Turbo (Hotwire)** | hypermedia-library de JavaScript (JavaScript) | 2021 | MIT | proyecto independiente |

### 🔧 htmx

Devuelve el estado al servidor: el HTML es la respuesta y los atributos deciden qué fragmento se reemplaza. Demuestra que la evolución del campo no es una línea recta hacia el cliente.

- **Documentación oficial:** <https://htmx.org/docs/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `htmx.org ^2.0.4`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node servidor.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `servidor.mjs` | código JavaScript (módulo ES) |

### 🔧 Turbo (Hotwire)

Navegación y actualizaciones parciales sin escribir JavaScript de aplicación. La estrategia de Rails frente a la aplicación de página única.

- **Documentación oficial:** <https://turbo.hotwired.dev/handbook/introduction>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `@hotwired/turbo ^8.0.12`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node servidor.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `servidor.mjs` | código JavaScript (módulo ES) |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

### htmx · el programa está en los atributos

[`htmx/servidor.mjs`](implementaciones/htmx/servidor.mjs) — y el argumento de
fondo, en la cabecera del archivo:

```javascript
 * Y de ahí sale lo que esta clase quiere enseñar: no hay estado de la interfaz
 * en el navegador. No hay una lista de tareas en memoria del cliente que haya
 * que mantener sincronizada con la del servidor, porque solo hay una lista y
 * está en el servidor. El problema de la clase 089 —estado del servidor en el
 * cliente— aquí no existe. No se resuelve mejor: no llega a plantearse.
```

Los tres atributos que son todo el programa:

```javascript
      \`hx-post\` dice a dónde; \`hx-target\` dice dónde poner lo que vuelva;
      \`hx-swap\` dice cómo. Tres atributos y ni una línea de JavaScript propio.
```

Y la mejora progresiva, que aquí sale gratis:

```javascript
      Fíjate en que sigue siendo un \`<form method="post">\` de verdad: si htmx no
      llega a cargarse, el navegador lo envía él solo y el servidor responde con
      una redirección. Es la mejora progresiva de la clase 081, y aquí no cuesta
      nada porque el camino sin JavaScript es el que ya estaba.
```

**Y la parte que hay que llevarse a cualquier proyecto**, en el manejador del
POST:

```javascript
    // No son dos implementaciones: es la misma escritura con dos formas de
    // contestar, y esa es la propuesta entera de la hipermedia.
    if (peticion.headers["hx-request"] === "true") {
```

### Hotwire Turbo · el programa está en la respuesta

[`hotwire-turbo/servidor.mjs`](implementaciones/hotwire-turbo/servidor.mjs):

```javascript
 * Turbo viene del mundo de Rails y se nota en su forma de pensar: el servidor no
 * devuelve HTML suelto, devuelve **instrucciones con HTML dentro**. Un
 * `<turbo-stream action="append" target="lista">` dice qué hacer y dónde, y el
 * marcado va en un `<template>` dentro.
```

**Y aquí está la diferencia que no es de sintaxis:**

```javascript
 * Esa es la diferencia de fondo con htmx, y no es de sintaxis: **cambia quién
 * decide dónde va el fragmento**. En htmx lo decide el marcado del cliente, con
 * `hx-target`. Aquí lo decide el servidor, en la respuesta. Con una pantalla da
 * igual; con una escritura que tiene que tocar tres sitios a la vez —la lista, el
 * contador y el aviso—, Turbo manda tres instrucciones en una respuesta y htmx
 * necesita que el cliente las haya previsto.
```

Con la consecuencia en el marcado, que es el reverso exacto:

```javascript
      Turbo intercepta TODOS los formularios y TODOS los enlaces de la pagina en
      cuanto se carga. No hay nada que declarar en el marcado: el formulario es
      un formulario normal, y lo que decide el comportamiento es lo que el
      servidor conteste.
```

```javascript
      Es la postura opuesta a la de htmx y tiene la misma consecuencia en las dos
      direcciones: aqui no se puede olvidar un atributo, y tampoco se puede
      excluir un formulario sin decirlo explicitamente.
```

Y una observación sobre cómo se identifica cada uno que vale más de lo que
parece:

```javascript
    // Turbo anuncia lo que sabe leer en `Accept`, que es donde el estandar dice
    // que se anuncia. htmx se inventa una cabecera propia. Las dos funcionan; la
    // de Turbo es la que un intermediario o una cache entienden sin que nadie
    // se lo explique.
```

## 🔬 Comparación

| | htmx | Hotwire Turbo |
| --- | --- | --- |
| Qué devuelve el servidor | HTML desnudo | `<turbo-stream>` con HTML dentro |
| Quién decide dónde va | **el cliente**, con `hx-target` | **el servidor**, en la respuesta |
| Cómo se declara | atributos en el marcado | nada: intercepta todo |
| Cómo se identifica | cabecera propia `HX-Request` | `Accept: text/vnd.turbo-stream.html` |
| Tamaño del archivo | 51,2 kB | 217,0 kB |
| **Comprimido** | **16,6 kB** | **46,0 kB** |

Y el mismo número puesto al lado del de la clase 102, que es donde significa
algo:

| | comprimido |
| --- | ---: |
| Astro (con una isla) | 10,0 kB |
| **htmx** | **16,6 kB** |
| SvelteKit | 32,2 kB |
| **Hotwire Turbo** | **46,0 kB** |
| Nuxt | 72,2 kB |
| Remix | 83,9 kB |
| Next.js | 238,9 kB |

Cuatro lecturas:

- **Los dos consiguen lo mismo y por caminos opuestos.** htmx pone el programa
  en el marcado y no toca nada que no se le diga; Turbo no pone nada en el
  marcado y toca todo salvo que se le excluya. Ninguna de las dos es más
  declarativa: son declarativas en sitios distintos.
- **La diferencia se paga cuando una escritura toca varios sitios.** Añadir una
  tarea que además actualiza un contador y enseña un aviso son tres cambios en
  la página. Turbo los manda en una respuesta; htmx necesita que el cliente los
  haya previsto, o varias peticiones.
- **htmx pesa menos que SvelteKit y Turbo pesa más.** Eso ya desmonta la idea de
  que hipermedia significa «ligero»: significa «sin estado duplicado», que es
  otra cosa. Lo que se ahorra no son bytes de biblioteca, es el código que uno
  escribe.
- **La cabecera de Turbo es la correcta y la de htmx es la cómoda.** `Accept` es
  donde el estándar dice que un cliente anuncia qué sabe leer, y una caché o un
  intermediario lo entienden sin que nadie se lo explique. Una cabecera propia
  funciona igual y no la entiende nadie más.

## ⚠️ Errores frecuentes

- **Devolver JSON y convertirlo a HTML en el cliente.** En cuanto se hace eso,
  hay una plantilla en el navegador, hay estado, y se ha vuelto a la parte 6 con
  peores herramientas. El contrato lo prohíbe explícitamente.
- **Duplicar la escritura para los dos casos.** Es lo que esta clase demuestra
  que no hace falta: la misma ruta, un `if` sobre una cabecera, dos respuestas.
- **Olvidar que hay una ida y vuelta por interacción.** Un filtro que se escribe
  letra a letra, un editor de texto, un arrastrar y soltar: ahí la latencia se
  ve, y este modelo no es la respuesta. Es honesto decirlo antes que después.
- **Escapar mal el HTML del fragmento.** Aquí el servidor construye HTML con
  texto de quien escribe. Sin escapar, es la clase 076 otra vez y con la puerta
  más abierta que nunca.
- **Creer que esto sustituye a un framework.** Sustituye al estado de interfaz.
  El enrutado, la validación, las sesiones y todo lo de las partes 1 a 5 siguen
  haciendo falta igual.

## ✅ Verificación

```bash
node scripts/run-class.mjs 103
```

Para verlo tú, la demostración de una línea —la misma ruta, dos respuestas:

```bash
curl -s -X POST -H "HX-Request: true" -d "texto=probar" http://127.0.0.1:4100/tareas
```

Quítale la cabecera y repítelo: sale un `303` en lugar de un `<li>`.

## 🧪 Reto de transferencia

1. **Cuenta tu estado duplicado.** En tu pantalla más compleja, mira cuántas
   estructuras del cliente son una copia de algo que ya está en el servidor. Ese
   número es lo que este modelo borra.
2. **Elige una pantalla que sí encaje.** Un panel de administración con
   formularios y tablas es el caso ideal. Un editor con arrastrar y soltar no lo
   es. Saber cuál es cuál vale más que la técnica.
3. **Prueba el `if` de la cabecera en tu proyecto actual.** Aunque no adoptes
   nada más: una ruta que sepa contestar un fragmento a quien lo pida es
   compatible con lo que ya tienes.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 089](../../parte-6-la-interfaz/089-estado-del-servidor-en-el-cliente/README.md) — el problema que aquí no se plantea
- [Clase 092](../../parte-6-la-interfaz/092-los-tres-modelos-de-reactividad/README.md) — dónde encaja htmx entre los modelos
- [Clase 098](../098-acciones-de-formulario/README.md) — la misma escritura en los cinco metaframeworks
- [Clase 102](../102-presupuesto-de-javascript/README.md) — de dónde salen los números de la comparación
- [Índice de la parte 7](../README.md)

## Fuentes

- [@htmx-docs] *htmx — Documentación oficial* — <https://htmx.org/docs/>
- [@hotwire-turbo-handbook] *Turbo Handbook*. Hotwired — <https://turbo.hotwired.dev/handbook/introduction>
- [@fielding-rest-dissertation] Fielding, Roy T. *Architectural Styles and the Design of Network-based Software Architectures*. Universidad de California, Irvine, 2000 — <https://ics.uci.edu/~fielding/pubs/dissertation/top.htm>
- [@htmx-essays] *htmx Essays* — <https://htmx.org/essays/>
- [@patterns-dev] *Patterns.dev — Modern Web App Design Patterns* — <https://www.patterns.dev/>
