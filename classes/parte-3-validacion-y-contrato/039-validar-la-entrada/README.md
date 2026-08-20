# Clase 039 — Validar la entrada

> [📚 Parte 3](../README.md) · [🎓 Clases](../../README.md) · [040 ➡️](../040-errores-por-campo-con-rfc-9457/README.md)
>
> Parte **3 — Validación y contrato** · Nivel **🟢 introductorio** · Pista **`backend`** (Backend y API)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Rechazar lo inválido antes de que llegue a la lógica.

## 🧩 La situación

Título vacío responde 422, título de 200 caracteres responde 422, válido responde 201.

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
node scripts/run-class.mjs 039
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 3](../README.md)
