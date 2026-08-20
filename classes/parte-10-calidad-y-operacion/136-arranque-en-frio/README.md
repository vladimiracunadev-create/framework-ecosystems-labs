# Clase 136 — Arranque en frío

> [⬅️ 135](../135-empaquetado-y-despliegue/README.md) · [📚 Parte 10](../README.md) · [🎓 Clases](../../README.md) · [137 ➡️](../137-medir-antes-de-optimizar/README.md)
>
> Parte **10 — Calidad, rendimiento y operación** · Nivel **🔴 avanzado** · Pista **`plataforma`** (Plataforma y operación)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Medir lo que tarda en estar listo y por qué.

## 🧩 La situación

El tiempo hasta la primera respuesta, medido en cada framework.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | `web-framework` | Node.js | `implementaciones/express/` |
| [FastAPI](../../../atlas/fichas/fastapi.md) | `web-framework` | Python | `implementaciones/fastapi/` |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `application-framework` | JVM | `implementaciones/spring-boot/` |
| [Quarkus](../../../atlas/fichas/quarkus.md) | `application-framework` | JVM | `implementaciones/quarkus/` |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `web-framework` | .NET | `implementaciones/aspnet-core/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 136
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 10](../README.md)
