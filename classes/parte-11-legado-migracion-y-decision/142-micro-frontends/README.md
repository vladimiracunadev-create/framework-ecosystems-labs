# Clase 142 — Micro-frontends

> [⬅️ 141](../141-dos-frameworks-conviviendo/README.md) · [📚 Parte 11](../README.md) · [🎓 Clases](../../README.md) · [143 ➡️](../143-migrar-datos-sin-parar/README.md)
>
> Parte **11 — Legado, migración y decisión** · Nivel **🔴 avanzado** · Pista **`frontend`** (Interfaz y estado)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Repartir una interfaz entre equipos, con sus costes.

## 🧩 La situación

Dos fragmentos desplegados por separado componiendo una pantalla.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [React](../../../atlas/fichas/react.md) | `ui-library` | JavaScript/TypeScript | `implementaciones/react/` |
| [Vue](../../../atlas/fichas/vue.md) | `web-framework` | JavaScript/TypeScript | `implementaciones/vue/` |
| [Angular](../../../atlas/fichas/angular.md) | `web-framework` | TypeScript | `implementaciones/angular/` |
| [Lit](../../../atlas/fichas/lit.md) | `web-components-library` | JavaScript/TypeScript | `implementaciones/lit/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 142
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 11](../README.md)
