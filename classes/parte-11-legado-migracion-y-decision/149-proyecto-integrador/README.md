# Clase 149 — Proyecto integrador

> [⬅️ 148](../148-como-se-abandona-un-framework/README.md) · [📚 Parte 11](../README.md) · [🎓 Clases](../../README.md)
>
> Parte **11 — Legado, migración y decisión** · Nivel **🔴 avanzado** · Pista **`fullstack`** (Full-stack y renderizado)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Construir y defender un producto completo con las decisiones justificadas.

## 🧩 La situación

El contrato completo cumplido en dos ecosistemas distintos, con su defensa escrita.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Next.js](../../../atlas/fichas/nextjs.md) | `react-metaframework` | JavaScript/TypeScript | `implementaciones/nextjs/` |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `application-framework` | JVM | `implementaciones/spring-boot/` |
| [FastAPI](../../../atlas/fichas/fastapi.md) | `web-framework` | Python | `implementaciones/fastapi/` |
| [React](../../../atlas/fichas/react.md) | `ui-library` | JavaScript/TypeScript | `implementaciones/react/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 149
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 11](../README.md)
