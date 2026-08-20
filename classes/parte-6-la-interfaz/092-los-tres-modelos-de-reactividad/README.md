# Clase 092 — Los tres modelos de reactividad

> [⬅️ 091](../091-accesibilidad-del-componente/README.md) · [📚 Parte 6](../README.md) · [🎓 Clases](../../README.md)
>
> Parte **6 — La interfaz: del HTML del servidor al componente** · Nivel **🔴 avanzado** · Pista **`frontend`** (Interfaz y estado)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Explicar por qué el mismo cambio actualiza cosas distintas en cada framework.

## 🧩 La situación

El mismo cambio de estado, contando cuánto se vuelve a ejecutar en cada modelo.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [React](../../../atlas/fichas/react.md) | `ui-library` | JavaScript/TypeScript | `implementaciones/react/` |
| [Vue](../../../atlas/fichas/vue.md) | `web-framework` | JavaScript/TypeScript | `implementaciones/vue/` |
| [Angular](../../../atlas/fichas/angular.md) | `web-framework` | TypeScript | `implementaciones/angular/` |
| [Svelte](../../../atlas/fichas/svelte.md) | `ui-framework` | JavaScript/TypeScript | `implementaciones/svelte/` |
| [SolidJS](../../../atlas/fichas/solid.md) | `ui-library` | JavaScript/TypeScript | `implementaciones/solid/` |
| [Lit](../../../atlas/fichas/lit.md) | `web-components-library` | JavaScript/TypeScript | `implementaciones/lit/` |
| [Alpine.js](../../../atlas/fichas/alpinejs.md) | `dom-library` | JavaScript | `implementaciones/alpinejs/` |
| [htmx](../../../atlas/fichas/htmx.md) | `hypermedia-library` | JavaScript | `implementaciones/htmx/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 092
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 6](../README.md)
