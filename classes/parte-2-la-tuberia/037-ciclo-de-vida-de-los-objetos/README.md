# Clase 037 — Ciclo de vida de los objetos

> [⬅️ 036](../036-inyeccion-de-dependencias/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [038 ➡️](../038-middleware-decorador-y-aspecto/README.md)
>
> Parte **2 — La tubería: middleware, filtros e interceptores** · Nivel **🔴 avanzado** · Pista **`backend`** (Backend y API)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Elegir entre única instancia, por petición o por uso, y ver la diferencia.

## 🧩 La situación

Un contador por ámbito revela cuántas instancias se crearon en cada caso.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [NestJS](../../../atlas/fichas/nestjs.md) | `application-framework` | Node.js/TypeScript | `implementaciones/nestjs/` |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `application-framework` | JVM | `implementaciones/spring-boot/` |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `web-framework` | .NET | `implementaciones/aspnet-core/` |
| [Laravel](../../../atlas/fichas/laravel.md) | `full-stack-framework` | PHP | `implementaciones/laravel/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 037
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 2](../README.md)
