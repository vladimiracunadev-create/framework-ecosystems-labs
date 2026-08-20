# Clase 007 — Cómo se mide (y cómo se miente) el rendimiento

> [⬅️ 006](../006-coste-total-aprender-mantener-contratar-salir/README.md) · [📚 Parte 0](../README.md) · [🎓 Clases](../../README.md) · [008 ➡️](../008-leer-la-documentacion-oficial-y-el-codigo-fuente/README.md)
>
> Parte **0 — El método: qué es un framework y cómo se compara** · Nivel **🟡 intermedio** · Pista **`backend`** (Backend y API)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Leer una comparativa de rendimiento sin creérsela.

## 🧩 La situación

La misma medición hecha bien y hecha mal sobre dos implementaciones del contrato.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | `web-framework` | Node.js | `implementaciones/express/` |
| [Fastify](../../../atlas/fichas/fastify.md) | `web-framework` | Node.js | `implementaciones/fastify/` |
| [Gin](../../../atlas/fichas/gin.md) | `web-framework` | Go | `implementaciones/gin/` |
| [axum](../../../atlas/fichas/axum.md) | `web-framework` | Rust | `implementaciones/axum/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 007
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 0](../README.md)
