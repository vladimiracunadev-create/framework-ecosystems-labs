# Clase 004 — Taxonomía: qué compite de verdad con qué

> [⬅️ 003](../003-el-contrato-como-unidad-de-comparacion/README.md) · [📚 Parte 0](../README.md) · [🎓 Clases](../../README.md) · [005 ➡️](../005-idiomatico-frente-a-traducido/README.md)
>
> Parte **0 — El método: qué es un framework y cómo se compara** · Nivel **🟢 introductorio** · Pista **`backend`** (Backend y API)
>
> ✅ **Clase construida** — 14 afirmaciones verificadas contra [`contrato.json`](contrato.json).

> 🧭 **Esta clase no levanta ningún servidor**, y es la primera del programa que
> no lo hace. Lo que verifica no es un comportamiento: es una **clasificación**.
> Cómo se comprueba eso sin caer en la opinión está explicado abajo, en
> [El contrato](#-el-contrato).

## 🎯 Objetivo

Clasificar **antes** de comparar, para no comparar cosas de categorías
distintas.

La clase 001 dio el criterio que separa biblioteca de framework. Esta lo aplica
a un catálogo entero y añade la pregunta que casi nadie se hace antes de abrir
una comparativa: **¿estas dos cosas ocupan siquiera el mismo hueco?**

Porque «React vs Next.js» aparece cada semana en algún foro, y es como preguntar
si un motor es mejor que un coche.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Situar** una tecnología en su categoría a partir de lo que hace, no de su
  popularidad ni de su tamaño.
- **Distinguir dos preguntas** que se confunden siempre: contra quién compite
  algo y a quién puede sustituir en tu proyecto de hoy.
- **Descartar** una comparativa en cuanto veas que cruza categorías, sin tener
  que leerla entera.
- **Detectar** una clasificación mal hecha en un catálogo ajeno — incluido este,
  que tenía una hasta esta clase.

## 🧩 La situación

Tienes cinco nombres delante y hay que colocarlos:

**Express**, **NestJS**, **React**, **Next.js** y **Prisma**.

Los cinco viven en el mismo lenguaje. Los cinco aparecen en las mismas listas de
«tecnologías que aprender en 2026». Y de los diez pares posibles, **solo uno
compite de verdad**.

El resto son combinaciones: React se usa *dentro* de Next.js, Prisma se usa
*dentro* de Express o de NestJS, y NestJS se apoya en Express por debajo. No son
alternativas: son piezas de distinto tamaño del mismo montaje.

## 🧮 El contrato

Las clases anteriores comprobaban una afirmación levantando un proceso y
haciéndole preguntas por HTTP. Aquí eso no sirve: **«React no compite con
Next.js» no se demuestra abriendo un puerto.**

Y dejarlo en prosa tampoco vale, porque entonces esta clase valdría lo mismo que
cualquier hilo de opiniones — que es justo de lo que el programa quiere salir.

Así que el contrato es de un tipo nuevo, `catalogo`, y pregunta a
[`catalog/frameworks.json`](../../../catalog/frameworks.json): el único sitio
del repositorio donde la clasificación está escrita **una sola vez**, con la
documentación oficial de cada tecnología al lado y una fecha de verificación.

Hay cuatro formas de preguntar, y ninguna más:

| Pregunta | Qué responde |
| --- | --- |
| `{ "tecnologia": "react", "campo": "kind" }` | el valor de un campo |
| `{ "compite_con": "react" }` | quién comparte su **categoría** |
| `{ "alternativa_en": "react" }` | quién comparte categoría **y ecosistema** |
| `{ "cuantas": { "kind": "orm" } }` | cuántas entradas cumplen un filtro |

Las catorce afirmaciones de la clase:

| # | Afirmación | Resultado |
| --- | --- | --- |
| 1 | Express es `web-framework` | valor exacto |
| 2 | NestJS es `application-framework` | valor exacto |
| 3 | React es `ui-library` | valor exacto |
| 4 | Next.js es `react-metaframework` | valor exacto |
| 5 | Prisma es `orm` | valor exacto |
| 6 | React compite con Preact y Solid, **no** con Next.js ni Express | incluye / excluye |
| 7 | Next.js compite con Remix y Gatsby, **no** con React | incluye / excluye |
| 8 | Express compite con Django, Flask, FastAPI, Gin y Fastify | incluye / excluye |
| 9 | En Node, solo Fastify, hapi y Koa pueden ocupar su sitio | lista exacta |
| 10 | NestJS compite con Spring Boot, Quarkus y Micronaut | incluye / excluye |
| 11 | NestJS **no tiene alternativa** en su ecosistema | lista vacía |
| 12 | A Prisma sí: Drizzle y TypeORM | lista exacta |
| 13 | Hay al menos 8 ORM en el catálogo | recuento |
| 14 | Y al menos 25 frameworks de servidor | recuento |

**Si alguien reclasifica una entrada del catálogo, esta clase se pone en rojo.**
Eso no es un inconveniente: es la única forma de que una taxonomía escrita en
prosa no se vuelva mentira sin que nadie se entere.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Metaframework**](../../../glosario/README.md#metaframework) | Un framework construido sobre otro que añade enrutado, renderizado en servidor, carga de datos y empaquetado. Next.js sobre React, Nuxt sobre Vue, SvelteKit sobre Svelte. Compite con otros metaframeworks, no con la biblioteca que lleva dentro. |
| [**Taxonomía**](../../../glosario/README.md#taxonomía) | Clasificar antes de comparar. React y Next.js no compiten: uno es biblioteca de interfaz y el otro un metaframework que la usa. Comparar piezas de categorías distintas produce conclusiones que no significan nada. |
| [**Categoría de catálogo**](../../../glosario/README.md#categoría-de-catálogo) *(kind)* | La etiqueta que dice qué hace una tecnología: `web-framework`, `ui-library`, `orm`, `react-metaframework`… El repositorio usa treinta y siete y las define en `catalog/frameworks.json`, junto a los datos que clasifica. Es la columna «Categoría» de todas las clases, y la que decide si dos tecnologías son comparables. |
| [**Alternativa real**](../../../glosario/README.md#alternativa-real) | Lo que puede ocupar el sitio de una tecnología sin cambiar de lenguaje ni de ecosistema. No es lo mismo que un competidor: NestJS compite con Spring Boot y no tiene ninguna alternativa dentro de Node. Es la cifra que importa cuando la pregunta es «¿y si esto no funciona, qué pongo en su lugar?». |


<!-- fin generado: fichas -->

## 🧰 Las piezas, una por una

Cinco tecnologías, cinco categorías distintas. Para cada una: qué hace
exactamente, qué **no** hace, y contra quién se mide.

### Express — `web-framework`

> **Framework de servidor que posee el bucle de peticiones: encamina, ejecuta tu
> manejador y responde.**

Escuchar en un puerto, leer la petición, decidir qué función la atiende, y
escribir la respuesta. Eso es todo, y es exactamente lo que la clase 001 usó
para definir «framework»: **tu código no llama a Express, Express llama al
tuyo**.

- **Qué no hace:** no toca la base de datos, no genera HTML, no sabe nada de
  componentes ni de estado de interfaz.
- **Ecosistema:** Node.js · **Primera versión:** 2010.
- **Contra quién se mide:** los otros veintiocho frameworks de servidor del
  catálogo — Django, Flask, FastAPI, Gin, Laravel, Spring Boot…
- **Documentación oficial:** <https://expressjs.com/>

### NestJS — `application-framework`

> **Framework de aplicación de servidor: además del transporte, gobierna
> módulos, dependencias y ciclo de vida.**

Aquí está la distinción que más se pasa por alto. NestJS **usa Express por
debajo** —o Fastify, si se lo pides— y encima añade otra capa entera: módulos,
decoradores e inyección de dependencias por constructor.

No es «Express con más cosas»: es un modelo distinto de organizar una
aplicación, importado de Angular y de Spring.

- **Qué no hace:** no reemplaza al framework de transporte. Lo envuelve.
- **Ecosistema:** Node.js/TypeScript · **Primera versión:** 2017.
- **Contra quién se mide:** Spring Boot, Quarkus, Micronaut, Dropwizard — todos
  fuera de su lenguaje.
- **Documentación oficial:** <https://docs.nestjs.com/>

### React — `ui-library`

> **Biblioteca de interfaz: renderiza componentes y nada más. No arranca la
> aplicación ni define su ciclo.**

React no tiene enrutador, no tiene cliente HTTP, no tiene modelo de datos y no
arranca nada. Le das un árbol de componentes y un nodo del documento, y dibuja.
Todo lo demás lo eliges tú — que es precisamente el motivo por el que existen
los metaframeworks de la fila siguiente.

Y no es una opinión de este repositorio: es como se presenta ella misma desde el
primer anuncio público [@react-why] y como sigue estando redactada su
documentación [@banks-porcello-learning-react].

- **Qué no hace:** no es un framework. Tu código la llama; ella no llama al
  tuyo.
- **Ecosistema:** JavaScript/TypeScript · **Primera versión:** 2013.
- **Contra quién se mide:** Preact y SolidJS — las otras dos bibliotecas de
  interfaz del catálogo. Con Vue y Svelte la comparación ya cruza una frontera:
  **esas dos son frameworks**, poseen el ciclo de render.
- **Documentación oficial:** <https://react.dev/>

### Next.js — `react-metaframework`

> **Metaframework construido sobre React: rutas, renderizado en servidor y
> compilación.**

Un metaframework no compite con la biblioteca sobre la que se apoya: **la
incluye**. Next.js trae React dentro y le añade lo que React no tiene —
enrutado, renderizado en el servidor, construcción, convenciones de carpetas
[@nextjs-app-router].

Preguntar «¿React o Next.js?» es preguntar «¿motor o coche?». La pregunta con
sentido es **«¿React solo, o React dentro de un metaframework?»**, y esa sí
tiene respuestas distintas según el proyecto.

- **Qué no hace:** no sustituye a React. No puede funcionar sin ella.
- **Ecosistema:** JavaScript/TypeScript · **Primera versión:** 2016.
- **Contra quién se mide:** Remix y Gatsby, los otros dos metaframeworks de
  React. Y a un nivel más ancho, con Nuxt (Vue) y SvelteKit (Svelte), que hacen
  lo mismo sobre otra base.
- **Documentación oficial:** <https://nextjs.org/docs>

### Prisma ORM — `orm`

> **Mapea entidades a tablas y coordina la persistencia: seguimiento de cambios,
> relaciones y migraciones.**

La quinta pieza no compite con ninguna de las cuatro anteriores porque resuelve
otro problema entero: hablar con la base de datos. Se usa **dentro** de Express,
de NestJS o de Next.js indistintamente.

- **Qué no hace:** no atiende peticiones, no encamina, no dibuja nada.
- **Ecosistema:** JavaScript/TypeScript · **Primera versión:** 2021.
- **Contra quién se mide:** los otros siete ORM del catálogo — Hibernate,
  SQLAlchemy, Entity Framework Core, Eloquent, Active Record, TypeORM, Drizzle.
- **Documentación oficial:** <https://www.prisma.io/docs>

## 🔍 Las dos preguntas que no son la misma

Aquí está el contenido de la clase, y no cabe en un diagrama de cajas.

**Competir** es hacer lo mismo. **Ser alternativa** es poder ocupar su sitio en
tu proyecto de hoy, sin cambiar de lenguaje ni de ecosistema.

Mira lo que responde el catálogo para NestJS:

| Pregunta | Respuesta |
| --- | --- |
| ¿Con quién **compite**? | `dropwizard`, `laminas`, `micronaut`, `quarkus`, `spring-boot`, `spring-framework`, `zend-framework` |
| ¿Qué es **alternativa** en su ecosistema? | *(nada)* |

Siete competidores y **ninguna alternativa**. NestJS hace exactamente lo que
hace Spring Boot, y en un proyecto Java no puedes ponerlo en su lugar. En un
proyecto Node no tiene rival dentro de su categoría: o eliges su modelo, o
bajas a un framework de transporte y lo montas tú.

Ahora Express:

| Pregunta | Respuesta |
| --- | --- |
| ¿Con quién **compite**? | veintiocho frameworks de servidor, de Django a Gin |
| ¿Qué es **alternativa** en su ecosistema? | `fastify`, `hapi`, `koa` |

Veintiocho competidores conceptuales y **tres sustitutos reales**. Esa es la
cifra que importa cuando la pregunta es «¿y si esto no funciona, qué pongo en su
lugar?» — que es la pregunta de la clase 006, y una de las cuatro dimensiones
del coste de un framework.

**Las comparativas suelen responder a la primera pregunta y venderla como
respuesta a la segunda.** De ahí salen las tablas donde Express aparece al lado
de Django: son de la misma categoría, sí, y cambiar de una a otra significa
cambiar de lenguaje, de equipo y de todo lo demás.

## 🐛 Lo que esta clase encontró en su propio catálogo

Vale la pena contarlo porque es el ejercicio de la clase aplicado a este
repositorio, y salió mal la primera vez.

Al escribir el caso 8 —«Express compite con Django, Flask, FastAPI y Gin»— la
respuesta del catálogo incluía también **Vue, Angular, Ember, AngularJS y
Aurelia**.

Las cinco estaban clasificadas como `web-framework`, la misma etiqueta que
Express. Y ese `web-framework` conflaba dos cosas que no tienen nada que ver:
frameworks que **poseen el bucle de peticiones en el servidor** y frameworks que
**poseen el ciclo de render en el navegador**.

El propio catálogo tenía el dato para verlo: los cinco declaraban
`targets: ["web"]` y ninguno declaraba `backend`. Se movieron a `ui-framework`,
que es donde ya estaba Svelte — su competidor directo.

Dos cosas quedan de esto:

1. **Una taxonomía sin definiciones escritas se degrada sola.** El campo `kind`
   decía «ver `docs/TAXONOMY.md`» y ese documento definía las palabras generales
   —biblioteca, framework, metaframework— pero no las treinta y siete etiquetas
   que el catálogo usa de verdad. Ahora cada una tiene su definición **dentro
   del propio catálogo**, junto a los datos que clasifica, y se publica en
   [el atlas](../../../atlas/frameworks.md#por-clasificación).
2. **Una afirmación que no se ejecuta no se sostiene.** El error llevaba ahí
   desde que se escribió el catálogo, en un repositorio que verifica cada
   respuesta HTTP de 74 clases. Lo que no se comprueba, se pudre.

## 🔬 Comparación

| Tecnología | Categoría | Quién llama a quién | Compite con | Alternativas en su ecosistema |
| --- | --- | --- | --- | --- |
| **Express** | `web-framework` | él llama a tu manejador | 28 | 3 |
| **NestJS** | `application-framework` | él construye e invoca tus clases | 7 | 0 |
| **React** | `ui-library` | tu código la llama | 2 | 2 |
| **Next.js** | `react-metaframework` | él llama a tus páginas | 2 | 2 |
| **Prisma** | `orm` | tu código lo llama | 7 | 2 |

Tres observaciones que se leen directamente de la tabla:

- **La columna «quién llama a quién» separa exactamente lo mismo que la columna
  de categoría.** No es casualidad: la clase 001 dio el criterio, y la taxonomía
  es su consecuencia.
- **Una categoría con muchos competidores y pocas alternativas es una categoría
  atada al ecosistema.** Es el caso de los frameworks de servidor: todo el mundo
  tiene el suyo y ninguno cruza de lenguaje.
- **NestJS con cero alternativas es la casilla más incómoda de la tabla.** Salir
  de él dentro de Node significa cambiar de modelo, no de biblioteca.

## ⚠️ Errores frecuentes

- **Comparar por popularidad en lugar de por categoría.** Que dos cosas tengan
  estrellas parecidas no las pone en el mismo hueco.
- **Creer que «minimalista» significa «biblioteca».** Express es minimalista y
  es un framework: posee el bucle de peticiones. El tamaño no clasifica.
- **Tomar «compite con» por «puedo cambiarlo por».** Es la confusión que esta
  clase separa en dos preguntas, y la que produce comparativas inútiles.
- **Comparar un metaframework con su base.** «React vs Next.js», «Vue vs Nuxt»,
  «Svelte vs SvelteKit»: en los tres casos el segundo contiene al primero.
- **Dar por buena la etiqueta heredada.** Una tecnología puede llamarse
  «framework» en su web por costumbre y comportarse como una biblioteca. Manda
  el comportamiento, junto con la autodefinición oficial.

## ✅ Verificación

```bash
node scripts/run-class.mjs 004
```

No hay implementaciones que arrancar ni cadenas de herramientas que instalar:
esta clase se verifica en cualquier máquina con Node.js, en menos de un segundo.

Cada afirmación se contrasta con el catálogo y se declara una por una. El
resumen final dice contra qué fecha de verificación del catálogo se comprobó.

Para tocarlo tú:

```bash
node -e "import('./scripts/lib/preguntas.mjs').then(m=>console.log(m.responder({compite_con:'fastapi'})))"
```

## 🧪 Reto de transferencia

1. **Coge una comparativa** que tengas a mano —un artículo, un vídeo, un hilo— y
   clasifica sus dos protagonistas antes de leerla. Si no comparten categoría,
   ya sabes que la conclusión no significa nada.
2. **Añade tres casos** al contrato de esta clase sobre tecnologías que uses:
   su categoría, sus competidores y sus alternativas reales. Ejecuta y mira si
   el catálogo te da la razón.
3. **Busca la casilla incómoda de tu equipo.** ¿Qué pieza de tu proyecto tiene
   cero alternativas en su ecosistema? Esa es la que hay que mirar dos veces
   antes de que sea tarde: la clase 006 le pone número.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta clasificación es natural y dónde es forzada
- [Atlas: por clasificación](../../../atlas/frameworks.md#por-clasificación) — las 37 categorías con su definición
- [Taxonomía](../../../docs/TAXONOMY.md) — las definiciones operativas del programa
- [Clase 001](../001-que-hace-un-framework-que-una-biblioteca-no-hace/README.md) — el criterio que produce esta taxonomía
- [Clase 006](../006-coste-total-aprender-mantener-contratar-salir/README.md) — qué cuesta salir de la casilla sin alternativas
- [Índice de la parte 0](../README.md)

## Fuentes

- [@react-why] Hunt, Pete. *Why did we build React?*. Meta — <https://legacy.reactjs.org/blog/2013/06/05/why-react.html>
- [@banks-porcello-learning-react] Banks, A.; Porcello, E. *Learning React*, 2.ª ed. O'Reilly Media, 2020. ISBN 9781492051725 — <https://openlibrary.org/isbn/9781492051725>
- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
- [@richards-ford-fundamentals] Richards, M.; Ford, N. *Fundamentals of Software Architecture: An Engineering Approach*. O'Reilly Media, 2020. ISBN 9781492043454 — <https://openlibrary.org/isbn/9781492043454>
- [@ousterhout-philosophy] Ousterhout, John. *A Philosophy of Software Design*, 2.ª ed. Yaknyam Press, 2021. ISBN 9781732102217 — <https://openlibrary.org/isbn/9781732102217>
