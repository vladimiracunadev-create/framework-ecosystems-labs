# Clase 009 — El elenco: por qué no todos resuelven todo

> [⬅️ 008](../008-leer-la-documentacion-oficial-y-el-codigo-fuente/README.md) · [📚 Parte 0](../README.md) · [🎓 Clases](../../README.md) · [010 ➡️](../010-el-metodo-de-esta-obra/README.md)
>
> Parte **0 — El método: qué es un framework y cómo se compara** · Nivel **🟢 introductorio** · Pista **`backend`** (Backend y API)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Aceptar que los frameworks no son intercambiables como los lenguajes.

## 🧩 La situación

Clasificar diez problemas y decir qué elenco puede resolverlos y cuál no.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | `web-framework` | Node.js | `implementaciones/express/` |
| [React](../../../atlas/fichas/react.md) | `ui-library` | JavaScript/TypeScript | `implementaciones/react/` |
| [Prisma ORM](../../../atlas/fichas/prisma.md) | `orm` | JavaScript/TypeScript | `implementaciones/prisma/` |
| [Flutter](../../../atlas/fichas/flutter.md) | `ui-sdk` | Dart | `implementaciones/flutter/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 009
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 0](../README.md)
