# Clase 073 — XSS y escapado

> [⬅️ 072](../072-csrf/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [074 ➡️](../074-inyeccion-sql/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🟡 intermedio** · Pista **`frontend`** (Interfaz y estado)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Ver qué escapa el framework por omisión y qué no.

## 🧩 La situación

El mismo texto peligroso renderizado seguro y, deliberadamente, inseguro.

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
node scripts/run-class.mjs 073
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 5](../README.md)
