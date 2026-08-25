# Parte 0 — El método: qué es un framework y cómo se compara

> [🎓 Todas las clases](../README.md) · [📖 Glosario](../../glosario/README.md) · [Parte 1 ➡️](../parte-1-responder/README.md)

**Antes de escribir una línea: qué hace un framework que una biblioteca no hace, y cómo se compara sin caer en la guerra de religiones.**

**Clases 1 a 10** · 10 en total · 6 construidas · 16 tecnologías en juego.

## 🧭 De qué va esta parte

Esta parte no enseña ningún framework. Enseña **a compararlos**, que es una habilidad distinta y más duradera: los frameworks de dentro de diez años no existen todavía, y el criterio para elegirlos sí se puede aprender hoy.

Diez clases para responder tres preguntas que casi nadie se hace antes de elegir. **Qué es exactamente un framework** —y por qué la respuesta no tiene nada que ver con el tamaño—. **Qué hace comparable una comparación** —y por qué un «hola mundo» no compara nada—. Y **qué cuesta** un framework más allá de las líneas que se escriben el primer día.

Es la parte más corta en código y la que más decide sobre el resto. Todo lo que viene después —149 clases con el mismo contrato en varios ecosistemas— es la aplicación repetida del método que se fija aquí.

## 🎒 Qué da por sabido

- Haber escrito y ejecutado algún programa, en cualquier lenguaje.
- Saber abrir una terminal y ejecutar un comando (está en [conocimientos previos](../../empezar/conocimientos-previos.md)).
- Tener Node.js instalado; el resto de cadenas se pueden añadir después ([`empezar/`](../../empezar/README.md)).

## 🎯 Qué sabrás hacer al terminarla

- Señalar en un archivo concreto la línea donde se invierte el control, y explicar por qué eso convierte a una biblioteca en un framework.
- Escribir un contrato ejecutable antes de mirar ninguna implementación, y defender por qué no se adapta a ninguna.
- Clasificar una tecnología antes de compararla, para no comparar una biblioteca de interfaz con un metaframework.
- Leer una comparativa de rendimiento y decir qué le falta para poder creérsela.
- Poner número a las cuatro dimensiones del coste de un framework: aprenderlo, mantenerlo, contratar quien lo sepa y salir de él.

## 🧵 Por qué en este orden

Las tres primeras clases construyen la definición y la herramienta: qué es un framework (001), cómo se demuestra con un número (002) y qué hace que dos implementaciones sean comparables (003).

Las tres siguientes enseñan a no engañarse: clasificar antes de comparar (004), distinguir código idiomático de código traducido (005) y contar lo que no se ve en el editor (006).

Y las cuatro últimas son de método: leer una medición sin creérsela (007), ir a la fuente primaria en vez de al tutorial (008), aceptar que no todos resuelven todo (009) y saber leer una clase de este programa (010).

## 📚 Las clases

| # | Clase | Qué resuelve | Nivel | Estado |
| --- | --- | --- | --- | --- |
| [001](001-que-hace-un-framework-que-una-biblioteca-no-hace/README.md) | [Qué hace un framework que una biblioteca no hace](001-que-hace-un-framework-que-una-biblioteca-no-hace/README.md) | Distinguir biblioteca de framework por quién llama a quién. | 🟢 introductorio | ✅ Construida |
| [002](002-inversion-de-control-en-concreto/README.md) | [Inversión de control, en concreto](002-inversion-de-control-en-concreto/README.md) | Ver la inversión de control en el código, no en el diagrama. | 🟢 introductorio | ✅ Construida |
| [003](003-el-contrato-como-unidad-de-comparacion/README.md) | [El contrato como unidad de comparación](003-el-contrato-como-unidad-de-comparacion/README.md) | Entender por qué comparar frameworks exige fijar antes el comportamiento. | 🟢 introductorio | ✅ Construida |
| [004](004-taxonomia-que-compite-de-verdad-con-que/README.md) | [Taxonomía: qué compite de verdad con qué](004-taxonomia-que-compite-de-verdad-con-que/README.md) | Clasificar antes de comparar, para no comparar cosas de categorías distintas. | 🟢 introductorio | ✅ Construida |
| [005](005-idiomatico-frente-a-traducido/README.md) | [Idiomático frente a traducido](005-idiomatico-frente-a-traducido/README.md) | Reconocer cuándo un código es el de otro framework disfrazado. | 🟢 introductorio | ✅ Construida |
| [006](006-coste-total-aprender-mantener-contratar-salir/README.md) | [Coste total: aprender, mantener, contratar, salir](006-coste-total-aprender-mantener-contratar-salir/README.md) | Poner número a lo que un framework cuesta más allá del código. | 🟢 introductorio | ✅ Construida |
| [007](007-como-se-mide-y-como-se-miente-el-rendimiento/README.md) | [Cómo se mide (y cómo se miente) el rendimiento](007-como-se-mide-y-como-se-miente-el-rendimiento/README.md) | Leer una comparativa de rendimiento sin creérsela. | 🟡 intermedio | 🚧 Esqueleto |
| [008](008-leer-la-documentacion-oficial-y-el-codigo-fuente/README.md) | [Leer la documentación oficial y el código fuente](008-leer-la-documentacion-oficial-y-el-codigo-fuente/README.md) | Encontrar la respuesta en la fuente primaria antes que en un tutorial. | 🟢 introductorio | 🚧 Esqueleto |
| [009](009-el-elenco-por-que-no-todos-resuelven-todo/README.md) | [El elenco: por qué no todos resuelven todo](009-el-elenco-por-que-no-todos-resuelven-todo/README.md) | Aceptar que los frameworks no son intercambiables como los lenguajes. | 🟢 introductorio | 🚧 Esqueleto |
| [010](010-el-metodo-de-esta-obra/README.md) | [El método de esta obra](010-el-metodo-de-esta-obra/README.md) | Saber leer una clase: contrato, implementaciones, comparación y decisión. | 🟢 introductorio | 🚧 Esqueleto |

## 🎬 Las tecnologías que aparecen

Entre paréntesis, en cuántas clases de esta parte interviene cada una. **Estar aquí no es una recomendación**: es que el problema de esa clase existe de verdad para esa tecnología.

| Ecosistema | Tecnologías |
| --- | --- |
| **JavaScript/TypeScript** | [Prisma ORM](../../atlas/fichas/prisma.md) (2), [React](../../atlas/fichas/react.md) (2), [Next.js](../../atlas/fichas/nextjs.md) (1) |
| **Node.js** | [Express](../../atlas/fichas/express.md) (10), [Fastify](../../atlas/fichas/fastify.md) (1) |
| **Python** | [FastAPI](../../atlas/fichas/fastapi.md) (5), [Flask](../../atlas/fichas/flask.md) (1) |
| **JVM** | [Spring Boot](../../atlas/fichas/spring-boot.md) (5) |
| **.NET** | [ASP.NET Core](../../atlas/fichas/aspnet-core.md) (2) |
| **Node.js/TypeScript** | [NestJS](../../atlas/fichas/nestjs.md) (2) |
| **Rust** | [axum](../../atlas/fichas/axum.md) (1) |
| **Dart** | [Flutter](../../atlas/fichas/flutter.md) (1) |
| **Go** | [Gin](../../atlas/fichas/gin.md) (1) |
| **PHP** | [Laravel](../../atlas/fichas/laravel.md) (1) |
| **JavaScript** | [Node.js](../../atlas/fichas/nodejs.md) (1) |
| **Ruby** | [Ruby on Rails](../../atlas/fichas/rails.md) (1) |

## 📖 Las palabras que esta parte define

[**Framework**](../../glosario/README.md#framework) · [**Biblioteca**](../../glosario/README.md#biblioteca) · [**Método plantilla**](../../glosario/README.md#método-plantilla) · [**Runtime**](../../glosario/README.md#runtime) · [**Manifiesto**](../../glosario/README.md#manifiesto) · [**Dependencia**](../../glosario/README.md#dependencia) · [**Inversión de control**](../../glosario/README.md#inversión-de-control) · [**Contrato**](../../glosario/README.md#contrato) · [**Metaframework**](../../glosario/README.md#metaframework) · [**Taxonomía**](../../glosario/README.md#taxonomía) · [**Categoría de catálogo**](../../glosario/README.md#categoría-de-catálogo) · [**Alternativa real**](../../glosario/README.md#alternativa-real) · [**Convención**](../../glosario/README.md#convención) · [**Idiomático**](../../glosario/README.md#idiomático) · [**Coste total**](../../glosario/README.md#coste-total) · [**Percentil**](../../glosario/README.md#percentil) · [**Elenco**](../../glosario/README.md#elenco) · [**Verde honesto**](../../glosario/README.md#verde-honesto)

Todas, con su definición, en el [glosario](../../glosario/README.md).

## ✅ Cómo se ejecuta una clase de esta parte

```bash
node scripts/run-class.mjs 001
```

El verificador arranca cada implementación, la somete a su `contrato.json` y **declara cuáles omitió** por no encontrar su cadena de herramientas. Si te faltan cadenas, `node scripts/doctor.mjs` dice cuáles y cómo se instalan.

## ➡️ Y después

La parte 1 baja al suelo: un proceso que escucha en un puerto y responde. A partir de ahí, cada clase aplica el método de esta parte a un problema concreto.
