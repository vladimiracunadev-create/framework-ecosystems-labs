# Clase 013 — Parámetros de consulta

> [⬅️ 012](../012-rutas-y-parametros-de-ruta/README.md) · [📚 Parte 1](../README.md) · [🎓 Clases](../../README.md) · [014 ➡️](../014-verbos-http-y-su-semantica/README.md)
>
> Parte **1 — Responder: lo primero que hace cualquier framework** · Nivel **🟢 introductorio** · Pista **`backend`** (Backend y API)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Leer la cadena de consulta y aplicar valores por omisión.

## 🧩 La situación

GET /tareas?limite=5 usa 5; sin parámetro usa el valor por omisión 20.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | `web-framework` | Node.js | `implementaciones/express/` |
| [Fastify](../../../atlas/fichas/fastify.md) | `web-framework` | Node.js | `implementaciones/fastify/` |
| [FastAPI](../../../atlas/fichas/fastapi.md) | `web-framework` | Python | `implementaciones/fastapi/` |
| [Flask](../../../atlas/fichas/flask.md) | `web-framework` | Python | `implementaciones/flask/` |
| [Django](../../../atlas/fichas/django.md) | `web-framework` | Python | `implementaciones/django/` |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `application-framework` | JVM | `implementaciones/spring-boot/` |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `web-framework` | .NET | `implementaciones/aspnet-core/` |
| [Laravel](../../../atlas/fichas/laravel.md) | `full-stack-framework` | PHP | `implementaciones/laravel/` |
| [Ruby on Rails](../../../atlas/fichas/rails.md) | `full-stack-framework` | Ruby | `implementaciones/rails/` |
| [Gin](../../../atlas/fichas/gin.md) | `web-framework` | Go | `implementaciones/gin/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 013
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 1](../README.md)
