# Framework Ecosystems Labs

[![CI](https://github.com/vladimiracunadev-create/framework-ecosystems-labs/actions/workflows/ci.yml/badge.svg)](https://github.com/vladimiracunadev-create/framework-ecosystems-labs/actions/workflows/ci.yml)
[![Aceptación](https://github.com/vladimiracunadev-create/framework-ecosystems-labs/actions/workflows/acceptance.yml/badge.svg)](https://github.com/vladimiracunadev-create/framework-ecosystems-labs/actions/workflows/acceptance.yml)
[![Pages](https://github.com/vladimiracunadev-create/framework-ecosystems-labs/actions/workflows/pages.yml/badge.svg)](https://github.com/vladimiracunadev-create/framework-ecosystems-labs/actions/workflows/pages.yml)
[![Fuentes verificadas](https://img.shields.io/badge/fuentes-205%20verificadas-0b5fd0)](docs/BIBLIOGRAPHY.md)
[![Atlas](https://img.shields.io/badge/atlas-138%20tecnolog%C3%ADas-7b3fe4)](atlas/README.md)
[![Licencia](https://img.shields.io/badge/licencia-MIT-informational)](LICENSE)

**Programa comparativo de 180 horas para aprender a entender, comparar y elegir
bibliotecas, frameworks y plataformas de desarrollo.** La unidad de comparación
no es un «Hola mundo»: es el mismo contrato funcional, con las mismas pruebas de
aceptación y los mismos atributos de calidad, implementado en distintos
ecosistemas.

📖 **Sitio del programa:** <https://vladimiracunadev-create.github.io/framework-ecosystems-labs/>

## 🚀 Empezar aquí

El programa cubre **de la instalación al nivel experto**, y empieza por una
máquina vacía: [**`empezar/`**](empezar/README.md) instala las ocho cadenas de
herramientas, explica [los seis conocimientos previos](empezar/conocimientos-previos.md)
que el resto da por sabidos —terminal, puertos, HTTP, JSON, dependencias y
git— y lleva hasta el primer contrato en verde.

```bash
node scripts/doctor.mjs   # qué cadenas tienes y cuánto del laboratorio puedes ejecutar hoy
```

El informe dice **cuántas de las 340 implementaciones puedes ejecutar en tu
máquina**, cuáles no y con qué comando exacto se recupera cada una. No hace
falta instalarlas todas: lo que no se ejecute en local se ejecuta en la
integración continua, y una implementación omitida se declara omitida.

| Nivel | Dónde | Qué sabes hacer al salir |
| --- | --- | --- |
| Instalación | [`empezar/`](empezar/README.md) | Ejecutar el laboratorio y leer su informe |
| Fundamentos | [Parte 0](classes/parte-0-el-metodo/README.md) · [módulo 00](curriculum/00-taxonomia-y-diagnostico.md) | Distinguir biblioteca de framework y qué hace comparable una comparación |
| Básico 🟢 | [Partes 1–3](classes/README.md) | Responder, encadenar, validar y contratar |
| Intermedio 🟡 | [Partes 4–7](classes/README.md) | Persistir, autenticar, renderizar donde toque |
| Avanzado 🔴 | [Partes 8–10](classes/README.md) | Tiempo real, móvil y escritorio, calidad y operación |
| Experto | [Parte 11](classes/parte-11-legado-migracion-y-decision/README.md) · [módulos 11–12](curriculum/README.md) | Migrar sin parar, elegir con criterio declarado y saber salir |

---

## La regla que gobierna este repositorio

> **Ninguna afirmación del programa procede de una fuente difusa.**

Todo lo que aquí se enseña se apoya en un libro, un artículo con revisión por
pares, una norma o la documentación oficial de quien mantiene la tecnología. Y no
es una intención declarada: es una comprobación automática que deja el
repositorio en rojo.

| | |
| --- | ---: |
| Fuentes en el registro | **205** |
| Libros, con ISBN-13 validado contra [Open Library](https://openlibrary.org/) | **94** |
| Artículos, con DOI contrastado en [Crossref](https://www.crossref.org/) | **7** |
| Normas de IETF, W3C, WHATWG, TC39, NIST, OWASP y OpenSSF | **32** |
| Documentación oficial, fuentes primarias y referencias de autor | **72** |
| Fuentes citadas al menos una vez en el texto | **205 / 205** |

```bash
node scripts/verify-sources.mjs   # sin red: determinista y reproducible
node scripts/refresh-sources.mjs  # con red: contrasta con los catálogos públicos
```

`verify-sources.mjs` falla si una cita apunta a una fuente inexistente, si una
lección cita menos de cuatro, si un libro no tiene ISBN válido, si un artículo no
tiene DOI, si una lección omite alguna de las doce secciones obligatorias, o si
alguna entrada del registro **no se cita en ningún texto** — la bibliografía
decorativa también es un fallo.

Y `verify-contract.mjs` cierra el otro flanco: comprueba que cada código del
catálogo de errores se ejercita en las pruebas, que las cinco implementaciones
pueden emitirlo, y que **todo extracto del contrato citado en una lección
coincide literalmente con el contrato**. Esa última comprobación existe por un
fallo real: el currículo enseñaba un formato de error que el contrato canónico no
cumplía, y nada lo detectaba.

Detalle completo en [`sources/README.md`](sources/README.md) y
[`docs/BIBLIOGRAPHY.md`](docs/BIBLIOGRAPHY.md).

## Propósito

Al finalizar, una persona podrá:

- diferenciar lenguaje, runtime, biblioteca, framework, metaframework, SDK, ORM y plataforma;
- reconocer inversión de control, convenciones, composición y extensibilidad;
- construir frontend, API, full stack, móvil y escritorio con patrones transferibles;
- comparar routing, estado, validación, persistencia, seguridad, pruebas y despliegue;
- elegir un framework según producto, equipo, riesgo y ciclo de vida;
- migrar sistemas heredados de forma incremental;
- evaluar dependencia, mantenimiento, licencias y cadena de suministro;
- demostrar la misma funcionalidad mediante pruebas compartidas.

## Principio central

```text
mismo dominio + mismo contrato + mismas pruebas + entornos declarados
```

Cambiar requisitos para favorecer una tecnología invalida la comparación. Y aquí
no es una consigna: **el mismo examen se ejecuta contra los cinco ecosistemas**.

| Implementación | Ecosistema | Pruebas de aceptación |
| --- | --- | --- |
| [Referencia sin framework](labs/01-http-contract/README.md) | Node.js, sin dependencias | 20 / 20 |
| [Express](labs/02-express-api/README.md) | Node.js | 20 / 20 |
| [FastAPI](labs/03-fastapi/README.md) | Python | 20 / 20 |
| [Spring Boot](labs/04-spring-boot/README.md) | JVM | 20 / 20 · una desviación declarada |
| [ASP.NET Core](labs/05-aspnet-core/README.md) | .NET | 20 / 20 |

```bash
node scripts/run-acceptance.mjs reference-node   # sin instalar nada
node scripts/run-acceptance.mjs express --prepare
```

Los 20 casos viven en
[`contracts/taskflow/acceptance.test.mjs`](contracts/taskflow/acceptance.test.mjs)
y solo hablan HTTP: se lanzan sin adaptador contra cualquier implementación, en
cualquier lenguaje. Los errores siguen RFC 9457 con `errors[]` por campo, porque
un `422` que solo dice «datos inválidos» impide construir una interfaz accesible.

Las desviaciones que una implementación necesita están **declaradas** en
[`ACCEPTANCE.md`](contracts/taskflow/ACCEPTANCE.md). Una desviación declarada es
información sobre el ecosistema; una silenciosa es un fallo de la comparación.

## 🗺️ El Atlas — cada lenguaje tiene sus frameworks

El programa tiene **dos capas**. El núcleo implementa un contrato en cinco
ecosistemas y lo verifica en cada entrega. El [**Atlas**](atlas/README.md) sitúa
**138 tecnologías** en su ecosistema y en su era, porque nadie aprende 138
frameworks pero cualquiera puede aprender ocho ideas y verlas repetirse durante
veinte años con nombres distintos.

| Ecosistema | Tecnologías | Qué lo caracteriza |
| --- | ---: | --- |
| [JavaScript y TypeScript](atlas/ecosistemas/javascript.md) | 64 | El único que corre en cliente y servidor |
| [JVM](atlas/ecosistemas/jvm.md) | 14 | Especificaciones con varias implementaciones |
| [PHP](atlas/ecosistemas/php.md) | 12 | Nació dentro del servidor web |
| [Python](atlas/ecosistemas/python.md) | 12 | De «baterías incluidas» al tipo como contrato |
| [.NET](atlas/ecosistemas/dotnet.md) | 10 | Un proveedor marca el ritmo |
| [Go](atlas/ecosistemas/go.md) | 7 | La biblioteca estándar hace opcional el framework |
| [Rust](atlas/ecosistemas/rust.md) | 6 | El compilador es parte del diseño |
| [Ruby](atlas/ecosistemas/ruby.md) | 5 | Origen de las convenciones que todos copiaron |
| [BEAM](atlas/ecosistemas/beam.md), [Apple](atlas/ecosistemas/apple.md), [Dart](atlas/ecosistemas/dart.md), [nativo](atlas/ecosistemas/nativo.md), [plataformas](atlas/ecosistemas/cloud.md) | 8 | Casos donde el runtime decide la arquitectura |

Incluye la **genealogía** —quién viene de quién— y las **cinco eras** del campo,
de «el servidor lo hace todo» a las islas y el regreso del hipermedia.

Y **[138 fichas a fondo](atlas/fichas/README.md)** —una por cada tecnología del
catálogo, sin excepciones—, cada una con sus fuentes: de qué problema nació, qué
idea aportó, qué dejó abierto y qué lección deja para decidir hoy.

Una muestra de lo que se aprende leyéndolas:

| Ficha | Lo que enseña |
| --- | --- |
| [Web Forms](atlas/fichas/aspnet-webforms.md) · [Struts](atlas/fichas/struts.md) | Ocultar HTTP tiene techo · una corrección publicada no protege hasta aplicarla |
| [Rails](atlas/fichas/rails.md) · [Django](atlas/fichas/django.md) · [Laravel](atlas/fichas/laravel.md) | El origen de las convenciones y qué se paga por ellas |
| [jQuery](atlas/fichas/jquery.md) · [AngularJS](atlas/fichas/angularjs.md) · [React](atlas/fichas/react.md) · [Vue](atlas/fichas/vue.md) | Cómo el estado se mudó al navegador, y a qué precio |
| [Astro](atlas/fichas/astro.md) · [htmx](atlas/fichas/htmx.md) | El péndulo vuelve, esta vez con teoría |
| [Spring Boot](atlas/fichas/spring-boot.md) · [Express](atlas/fichas/express.md) · [NestJS](atlas/fichas/nestjs.md) · [Phoenix](atlas/fichas/phoenix.md) | Inversión de control, middleware y cuando el runtime decide la arquitectura |
| [Flutter](atlas/fichas/flutter.md) · [React Native](atlas/fichas/react-native.md) · [Electron](atlas/fichas/electron.md) · [Tauri](atlas/fichas/tauri.md) | Dibujar propio o usar lo nativo; incrustar el motor o heredarlo |
| [Node.js](atlas/fichas/nodejs.md) · [Vite](atlas/fichas/vite.md) · [Kubernetes](atlas/fichas/kubernetes.md) | Lo que no es un framework y aun así decide tu arquitectura |

Cada entrada declara clasificación, era, estado, licencia SPDX y documentación
oficial. `node scripts/refresh-catalog.mjs` contrasta los 138 enlaces y los
identificadores de licencia con su fuente.

## 🎓 Las clases — el mismo problema en todos los frameworks

Un módulo enseña un tema. **Una clase plantea un problema y lo resuelve en todos
los frameworks a la vez**, con el código a la vista y un contrato ejecutable que
los obliga a comportarse igual.

**[149 clases en 12 partes](classes/README.md)**, de lo más simple —levantar un
servidor— a lo más avanzado —migrar sin parar, elegir y saber salir.

| Parte | Tema | Clases |
| --- | --- | ---: |
| [0](classes/parte-0-el-metodo/README.md) | El método: qué es un framework y cómo se compara | 10 |
| [1](classes/parte-1-responder/README.md) | Responder: lo primero que hace cualquier framework | 15 |
| [2](classes/parte-2-la-tuberia/README.md) | La tubería: middleware, filtros e interceptores | 13 |
| [3](classes/parte-3-validacion-y-contrato/README.md) | Validación y contrato | 12 |
| [4](classes/parte-4-datos/README.md) | Datos: del SQL a mano al dominio limpio | 15 |
| [5](classes/parte-5-identidad-y-seguridad/README.md) | Identidad y seguridad | 13 |
| [6](classes/parte-6-la-interfaz/README.md) | La interfaz: del HTML del servidor al componente | 14 |
| [7](classes/parte-7-renderizado-y-fullstack/README.md) | Renderizado y full-stack | 12 |
| [8](classes/parte-8-tiempo-real-y-segundo-plano/README.md) | Tiempo real y trabajo en segundo plano | 9 |
| [9](classes/parte-9-movil-escritorio-y-sin-conexion/README.md) | Móvil, escritorio y sin conexión | 10 |
| [10](classes/parte-10-calidad-y-operacion/README.md) | Calidad, rendimiento y operación | 14 |
| [11](classes/parte-11-legado-migracion-y-decision/README.md) | Legado, migración y decisión | 12 |

### Los elencos

Los lenguajes son intercambiables: cualquiera suma dos números. **Los frameworks
no.** Spring Boot no implementa una clase de reactividad en el cliente y React no
implementa una de migraciones de base de datos. Por eso cada clase declara su
**elenco**: los frameworks para los que ese problema tiene sentido. En total, 53
tecnologías del catálogo aparecen en algún elenco.

### Un resultado verde que se puede creer

```bash
node scripts/run-class.mjs 011
```

El verificador arranca cada implementación, la somete al contrato y **declara
cuáles omitió** por falta de cadena de herramientas:

```text
  ✔ fastapi              4 casos
  ✔ flask                4 casos
  ✔ laravel              4 casos
  ⊘ spring-boot          falta la herramienta `mvn`
  ⊘ gin                  falta la herramienta `go`

RESUMEN: 3 verificadas · 0 con fallo · 7 omitidas por falta de herramientas
```

Un informe que dijera «todo bien» sin haber ejecutado siete de diez estaría
mintiendo. Distinguir *verificado* de *omitido* es lo que hace creíble el verde.

## El programa

| Módulo | Tema | Nivel | Horas | Fuentes |
| --- | --- | --- | ---: | ---: |
| [00](curriculum/00-taxonomia-y-diagnostico.md) | Taxonomía y diagnóstico | introductorio | 6 | 9 |
| [01](curriculum/01-http-eventos-y-contratos.md) | HTTP, eventos y contratos | introductorio | 16 | 15 |
| [02](curriculum/02-arquitectura-de-frameworks.md) | Arquitectura de frameworks | intermedio | 14 | 5 |
| [03](curriculum/03-frontend-componentes-y-estado.md) | Frontend, componentes y estado | intermedio | 18 | 8 |
| [04](curriculum/04-fullstack-y-renderizado.md) | Full stack y renderizado | intermedio | 14 | 6 |
| [05](curriculum/05-backend-y-api.md) | Backend y API | intermedio | 20 | 8 |
| [06](curriculum/06-persistencia-y-dominio.md) | Persistencia y dominio | intermedio | 14 | 8 |
| [07](curriculum/07-identidad-y-seguridad.md) | Identidad y seguridad | avanzado | 16 | 12 |
| [08](curriculum/08-calidad-rendimiento-y-operacion.md) | Calidad, rendimiento y operación | avanzado | 16 | 15 |
| [09](curriculum/09-movil-escritorio-y-offline.md) | Móvil, escritorio y offline | avanzado | 12 | 6 |
| [10](curriculum/10-modernizacion-y-migracion.md) | Modernización y migración | avanzado | 14 | 6 |
| [11](curriculum/11-seleccion-y-sostenibilidad.md) | Selección y sostenibilidad | avanzado | 10 | 10 |
| [12](curriculum/12-producto-final.md) | Producto final | avanzado | 10 | 8 |

Rutas frontend, backend, full stack y modernización en
[`curriculum/README.md`](curriculum/README.md).

### Anatomía de un módulo

Los trece siguen el mismo contrato de doce secciones, y la validación lo exige:

`Prerrequisitos` · `Objetivos observables` · `Concepto independiente del
framework` · `Anatomía comparada` · `Implementación mínima` · `Pruebas
compartidas` · `Seguridad y accesibilidad` · `Errores frecuentes y diagnóstico` ·
`Comprobación de recuerdo` · `Reto de transferencia` · `Criterios de evaluación`
· `Fuentes`

Por qué esas doce y en ese orden: [`docs/LEARNING-MODEL.md`](docs/LEARNING-MODEL.md),
donde cada decisión pedagógica se apoya en su propia fuente.

## Empezar

Requiere Node.js 22 o superior. **Sin instalar dependencias:**

```bash
node scripts/doctor.mjs                          # qué puedes ejecutar en esta máquina
node scripts/validate-repository.mjs             # estructura, catálogo, enlaces
node scripts/verify-sources.mjs                  # trazabilidad de las citas
node scripts/verify-contract.mjs                 # contrato ↔ lecciones ↔ código
node --test labs/01-http-contract/reference-node/server.test.mjs
node scripts/run-acceptance.mjs reference-node   # el contrato, de punta a punta
node scripts/generate-atlas.mjs --check           # el Atlas coincide con el catálogo
node scripts/generate-site.mjs                   # genera site/ (no se versiona)
```

Con pnpm, que es el único gestor admitido para JavaScript y TypeScript:

```bash
corepack enable
pnpm check
```

## Estructura

```text
empezar/          Prólogo: instalación, conocimientos previos y primer verde
atlas/            Atlas: ecosistemas, genealogía y fichas a fondo
catalog/          Registro de 138 tecnologías con era, estado y licencia
classes/          149 clases: el mismo problema resuelto en todos los frameworks
contracts/        Dominio y contrato TaskFlow compartido
curriculum/       Los 13 módulos del programa
docs/             Taxonomía, arquitectura, selección, seguridad, modelo pedagógico
labs/             Implementaciones y comparaciones ejecutables
projects/         Productos canónicos y proyecto final
assessments/      Diagnóstico y rúbricas
sources/          Registro bibliográfico verificable y su política
templates/        Plantillas de lección, framework y decisión
scripts/          Validaciones, ejecutor de aceptación y generador del sitio
```

## Cobertura de «todos los frameworks»

- **Núcleo ejecutable:** cinco implementaciones del mismo contrato, probadas en CI.
- **Atlas:** 138 tecnologías en 13 ecosistemas, con genealogía y eras.
- **Fichas a fondo:** casos donde la historia enseña más que la documentación.
- **Plantillas:** incorporación consistente de nuevos ecosistemas.

Estar en el catálogo no equivale a una recomendación ni a dominio profesional. Y
el número de estrellas o descargas **no aparece en ninguna entrada**, porque no
responde a ninguna de las preguntas del módulo 11.

## Proyectos canónicos

Plataforma educativa · comercio electrónico · libro contable y pagos · red social
· panel de agentes y automatizaciones. Cada uno con un atributo de calidad
dominante distinto, en [`projects/canonical-products.md`](projects/canonical-products.md).

## Qué NO promete este programa

- **No garantiza dominio profesional.** Demuestra criterio y capacidad de
  comparar; la competencia se adquiere operando sistemas reales durante meses.
- **No declara ganadores.** No hay un framework mejor: hay uno mejor para un
  producto, un equipo y un horizonte declarados.
- **No es neutral.** Privilegia la comparación honesta y el diagnóstico sobre la
  velocidad de entrega inicial. El sesgo es deliberado y está declarado.

## IA y mantenimiento

[`PROMPT_MAESTRO.md`](PROMPT_MAESTRO.md) define cómo una IA debe investigar,
implementar, probar y documentar cambios sin degradar el repositorio. La regla de
fuentes se le aplica igual que a una persona.

## Licencia

MIT. Los frameworks, nombres y marcas conservan sus licencias y titulares. El
repositorio **no redistribuye** libros ni artículos protegidos: cita, remite y
explica.
