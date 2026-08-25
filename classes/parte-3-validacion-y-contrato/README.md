# Parte 3 — Validación y contrato

> [⬅️ Parte 2](../parte-2-la-tuberia/README.md) · [🎓 Todas las clases](../README.md) · [📖 Glosario](../../glosario/README.md) · [Parte 4 ➡️](../parte-4-datos/README.md)

**Desde comprobar un campo hasta publicar una API que no rompe a quien la consume.**

**Clases 39 a 50** · 12 en total · 12 construidas · 12 tecnologías en juego.

## 🧭 De qué va esta parte

Una API es una promesa. Doce clases sobre **cómo se escribe esa promesa, cómo se comprueba y cómo se cambia sin romper a quien confiaba en ella**.

Empieza por lo evidente —validar lo que entra— y llega a lo que casi nadie hace bien: publicar el error con una forma estándar, derivar la documentación del código en lugar de escribirla aparte, y versionar sin abandonar a los clientes anteriores.

Es la parte donde el tipado deja de ser una preferencia estética y se convierte en infraestructura: un esquema bien escrito valida la entrada, genera la documentación y tipa el código, y las tres cosas no pueden discrepar.

## 🎒 Qué da por sabido

- Las partes 1 y 2: códigos de estado, cuerpo JSON y capas transversales.
- Que el contrato se escribe antes que las implementaciones (clase 003).

## 🎯 Qué sabrás hacer al terminarla

- Validar una entrada devolviendo **todos** los errores por campo, no el primero.
- Responder con `application/problem+json` según RFC 9457, y explicar por qué un «datos inválidos» impide construir una interfaz accesible.
- Escribir un esquema una vez y usarlo para validar, documentar y tipar.
- Paginar por desplazamiento y por cursor, y decir cuándo cada uno es el correcto.
- Hacer idempotente una operación que no lo es por naturaleza, y saber por qué eso es la condición para poder reintentar.
- Distinguir un cambio compatible de uno que rompe, y publicar el segundo sin coordinar despliegues.

## 🧵 Por qué en este orden

Las cuatro primeras construyen la validación: rechazar (039), informar bien (040), declarar la forma (041) y reutilizar esa declaración (042).

Las cuatro siguientes son la vida pública de la API: documentarla (043), versionarla (044), paginarla (045) y filtrarla (046).

Las cuatro últimas son sobre confianza: idempotencia (047), caché condicional (048), el contrato como prueba (049) y qué rompe a quién (050).

## 📚 Las clases

| # | Clase | Qué resuelve | Nivel | Estado |
| --- | --- | --- | --- | --- |
| [039](039-validar-la-entrada/README.md) | [Validar la entrada](039-validar-la-entrada/README.md) | Rechazar lo inválido antes de que llegue a la lógica. | 🟢 introductorio | ✅ Construida |
| [040](040-errores-por-campo-con-rfc-9457/README.md) | [Errores por campo con RFC 9457](040-errores-por-campo-con-rfc-9457/README.md) | Decir exactamente qué campo falló y por qué, en formato estándar. | 🟡 intermedio | ✅ Construida |
| [041](041-esquemas/README.md) | [Esquemas](041-esquemas/README.md) | Declarar la forma de los datos en lugar de comprobarla a mano. | 🟡 intermedio | ✅ Construida |
| [042](042-un-esquema-tres-usos/README.md) | [Un esquema, tres usos](042-un-esquema-tres-usos/README.md) | Derivar validación, tipos y documentación de una sola declaración. | 🟡 intermedio | ✅ Construida |
| [043](043-documentacion-generada/README.md) | [Documentación generada](043-documentacion-generada/README.md) | Publicar una descripción de la API que no puede mentir. | 🟡 intermedio | ✅ Construida |
| [044](044-versionado-de-api/README.md) | [Versionado de API](044-versionado-de-api/README.md) | Evolucionar sin romper a quien ya te consume. | 🔴 avanzado | ✅ Construida |
| [045](045-paginacion/README.md) | [Paginación](045-paginacion/README.md) | Devolver muchos elementos sin devolverlos todos. | 🟡 intermedio | ✅ Construida |
| [046](046-filtrado-y-ordenacion/README.md) | [Filtrado y ordenación](046-filtrado-y-ordenacion/README.md) | Aceptar criterios del cliente sin abrir un agujero. | 🟡 intermedio | ✅ Construida |
| [047](047-idempotencia/README.md) | [Idempotencia](047-idempotencia/README.md) | Hacer que reintentar no duplique. | 🔴 avanzado | ✅ Construida |
| [048](048-etags-y-cache-condicional/README.md) | [ETags y caché condicional](048-etags-y-cache-condicional/README.md) | Ahorrar ancho de banda y evitar sobrescrituras ciegas. | 🔴 avanzado | ✅ Construida |
| [049](049-el-contrato-como-prueba/README.md) | [El contrato como prueba](049-el-contrato-como-prueba/README.md) | Ejecutar la misma batería contra cualquier implementación. | 🟡 intermedio | ✅ Construida |
| [050](050-que-rompe-a-quien/README.md) | [Qué rompe a quién](050-que-rompe-a-quien/README.md) | Clasificar un cambio como compatible o incompatible antes de publicarlo. | 🔴 avanzado | ✅ Construida |

## 🎬 Las tecnologías que aparecen

Entre paréntesis, en cuántas clases de esta parte interviene cada una. **Estar aquí no es una recomendación**: es que el problema de esa clase existe de verdad para esa tecnología.

| Ecosistema | Tecnologías |
| --- | --- |
| **Python** | [FastAPI](../../atlas/fichas/fastapi.md) (12), [Django](../../atlas/fichas/django.md) (1), [Flask](../../atlas/fichas/flask.md) (1) |
| **Node.js** | [Express](../../atlas/fichas/express.md) (11), [Fastify](../../atlas/fichas/fastify.md) (1) |
| **.NET** | [ASP.NET Core](../../atlas/fichas/aspnet-core.md) (12) |
| **JVM** | [Spring Boot](../../atlas/fichas/spring-boot.md) (12) |
| **Bun/TypeScript** | [Elysia](../../atlas/fichas/elysia.md) (1) |
| **Go** | [Gin](../../atlas/fichas/gin.md) (1) |
| **PHP** | [Laravel](../../atlas/fichas/laravel.md) (1) |
| **Node.js/TypeScript** | [NestJS](../../atlas/fichas/nestjs.md) (1) |
| **Ruby** | [Ruby on Rails](../../atlas/fichas/rails.md) (1) |

## 📖 Las palabras que esta parte define

[**Validación**](../../glosario/README.md#validación) · [**RFC 9457**](../../glosario/README.md#rfc-9457) · [**Esquema**](../../glosario/README.md#esquema) · [**OpenAPI**](../../glosario/README.md#openapi) · [**Versionado de API**](../../glosario/README.md#versionado-de-api) · [**Paginación**](../../glosario/README.md#paginación) · [**Filtrado**](../../glosario/README.md#filtrado) · [**Idempotencia**](../../glosario/README.md#idempotencia) · [**Caché condicional**](../../glosario/README.md#caché-condicional) · [**Cambio incompatible**](../../glosario/README.md#cambio-incompatible)

Todas, con su definición, en el [glosario](../../glosario/README.md).

## ✅ Cómo se ejecuta una clase de esta parte

```bash
node scripts/run-class.mjs 039
```

El verificador arranca cada implementación, la somete a su `contrato.json` y **declara cuáles omitió** por no encontrar su cadena de herramientas. Si te faltan cadenas, `node scripts/doctor.mjs` dice cuáles y cómo se instalan.

## ➡️ Y después

La parte 4 baja al almacenamiento: de escribir SQL a mano a un dominio que no sabe que existe una base de datos.
