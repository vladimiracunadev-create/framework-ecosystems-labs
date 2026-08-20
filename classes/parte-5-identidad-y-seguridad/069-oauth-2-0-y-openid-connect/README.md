# Clase 069 — OAuth 2.0 y OpenID Connect

> [⬅️ 068](../068-contrasenas-bien-guardadas/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [070 ➡️](../070-autorizacion-por-rol/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🔴 avanzado** · Pista **`backend`** (Backend y API)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Delegar la identidad sin manejar credenciales ajenas.

## 🧩 La situación

El flujo de código de autorización con PKCE, paso a paso.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | `web-framework` | Node.js | `implementaciones/express/` |
| [FastAPI](../../../atlas/fichas/fastapi.md) | `web-framework` | Python | `implementaciones/fastapi/` |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `application-framework` | JVM | `implementaciones/spring-boot/` |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `web-framework` | .NET | `implementaciones/aspnet-core/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 069
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 5](../README.md)
