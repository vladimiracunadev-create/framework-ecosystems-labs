# Clase 036 — Inyección de dependencias

> [⬅️ 035](../035-cabeceras-de-seguridad/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [037 ➡️](../037-ciclo-de-vida-de-los-objetos/README.md)
>
> Parte **2 — La tubería: middleware, filtros e interceptores** · Nivel **🟡 intermedio** · Pista **`backend`** (Backend y API)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Recibir las colaboraciones en lugar de construirlas.

## 🧩 La situación

El mismo manejador funciona con una dependencia real y con una falsa, sin tocar su código.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [NestJS](../../../atlas/fichas/nestjs.md) | `application-framework` | Node.js/TypeScript | `implementaciones/nestjs/` |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `application-framework` | JVM | `implementaciones/spring-boot/` |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `web-framework` | .NET | `implementaciones/aspnet-core/` |
| [FastAPI](../../../atlas/fichas/fastapi.md) | `web-framework` | Python | `implementaciones/fastapi/` |
| [Laravel](../../../atlas/fichas/laravel.md) | `full-stack-framework` | PHP | `implementaciones/laravel/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 036
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 2](../README.md)
