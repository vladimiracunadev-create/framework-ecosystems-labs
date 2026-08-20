# Clase 004 — Taxonomía: qué compite de verdad con qué

> [⬅️ 003](../003-el-contrato-como-unidad-de-comparacion/README.md) · [📚 Parte 0](../README.md) · [🎓 Clases](../../README.md) · [005 ➡️](../005-idiomatico-frente-a-traducido/README.md)
>
> Parte **0 — El método: qué es un framework y cómo se compara** · Nivel **🟢 introductorio** · Pista **`backend`** (Backend y API)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Clasificar antes de comparar, para no comparar cosas de categorías distintas.

## 🧩 La situación

Situar cinco piezas del catálogo en su categoría y justificar contra qué compite cada una.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | `web-framework` | Node.js | `implementaciones/express/` |
| [NestJS](../../../atlas/fichas/nestjs.md) | `application-framework` | Node.js/TypeScript | `implementaciones/nestjs/` |
| [React](../../../atlas/fichas/react.md) | `ui-library` | JavaScript/TypeScript | `implementaciones/react/` |
| [Next.js](../../../atlas/fichas/nextjs.md) | `react-metaframework` | JavaScript/TypeScript | `implementaciones/nextjs/` |
| [Prisma ORM](../../../atlas/fichas/prisma.md) | `orm` | JavaScript/TypeScript | `implementaciones/prisma/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 004
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 0](../README.md)
