# Clase 042 — Un esquema, tres usos

> [⬅️ 041](../041-esquemas/README.md) · [📚 Parte 3](../README.md) · [🎓 Clases](../../README.md) · [043 ➡️](../043-documentacion-generada/README.md)
>
> Parte **3 — Validación y contrato** · Nivel **🟡 intermedio** · Pista **`backend`** (Backend y API)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Derivar validación, tipos y documentación de una sola declaración.

## 🧩 La situación

Cambiar el esquema cambia a la vez la validación y la documentación publicada.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [FastAPI](../../../atlas/fichas/fastapi.md) | `web-framework` | Python | `implementaciones/fastapi/` |
| [NestJS](../../../atlas/fichas/nestjs.md) | `application-framework` | Node.js/TypeScript | `implementaciones/nestjs/` |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `application-framework` | JVM | `implementaciones/spring-boot/` |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `web-framework` | .NET | `implementaciones/aspnet-core/` |
| [Elysia](../../../atlas/fichas/elysia.md) | `web-framework` | Bun/TypeScript | `implementaciones/elysia/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 042
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 3](../README.md)
