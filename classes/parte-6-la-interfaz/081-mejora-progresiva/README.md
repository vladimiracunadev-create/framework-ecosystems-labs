# Clase 081 — Mejora progresiva

> [⬅️ 080](../080-formularios-que-funcionan-sin-javascript/README.md) · [📚 Parte 6](../README.md) · [🎓 Clases](../../README.md) · [082 ➡️](../082-el-primer-componente/README.md)
>
> Parte **6 — La interfaz: del HTML del servidor al componente** · Nivel **🟡 intermedio** · Pista **`frontend`** (Interfaz y estado)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Añadir comportamiento sin romper el caso base.

## 🧩 La situación

El mismo formulario funciona sin JavaScript y mejor con él.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [htmx](../../../atlas/fichas/htmx.md) | `hypermedia-library` | JavaScript | `implementaciones/htmx/` |
| [Alpine.js](../../../atlas/fichas/alpinejs.md) | `dom-library` | JavaScript | `implementaciones/alpinejs/` |
| [Svelte](../../../atlas/fichas/svelte.md) | `ui-framework` | JavaScript/TypeScript | `implementaciones/svelte/` |
| [React](../../../atlas/fichas/react.md) | `ui-library` | JavaScript/TypeScript | `implementaciones/react/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 081
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 6](../README.md)
