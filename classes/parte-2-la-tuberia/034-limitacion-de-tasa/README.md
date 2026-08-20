# Clase 034 — Limitación de tasa

> [⬅️ 033](../033-limite-de-tamano-del-cuerpo/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [035 ➡️](../035-cabeceras-de-seguridad/README.md)
>
> Parte **2 — La tubería: middleware, filtros e interceptores** · Nivel **🔴 avanzado** · Pista **`backend`** (Backend y API)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Proteger el servicio del uso excesivo, legítimo o no.

## 🧩 La situación

Superado el cupo responde 429 con Retry-After; el cupo se repone con el tiempo.

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
node scripts/run-class.mjs 034
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 2](../README.md)
