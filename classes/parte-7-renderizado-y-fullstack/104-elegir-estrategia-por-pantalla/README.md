# Clase 104 — Elegir estrategia por pantalla

> [⬅️ 103](../103-hipermedia-como-alternativa/README.md) · [📚 Parte 7](../README.md) · [🎓 Clases](../../README.md)
>
> Parte **7 — Renderizado y full-stack** · Nivel **🔴 avanzado** · Pista **`fullstack`** (Full-stack y renderizado)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Aplicar criterio por vista en lugar de una regla para toda la aplicación.

## 🧩 La situación

Tres pantallas del mismo producto con tres estrategias justificadas.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Next.js](../../../atlas/fichas/nextjs.md) | `react-metaframework` | JavaScript/TypeScript | `implementaciones/nextjs/` |
| [Nuxt](../../../atlas/fichas/nuxt.md) | `vue-metaframework` | JavaScript/TypeScript | `implementaciones/nuxt/` |
| [SvelteKit](../../../atlas/fichas/sveltekit.md) | `svelte-metaframework` | JavaScript/TypeScript | `implementaciones/sveltekit/` |
| [Remix](../../../atlas/fichas/remix.md) | `react-metaframework` | JavaScript/TypeScript | `implementaciones/remix/` |
| [Astro](../../../atlas/fichas/astro.md) | `web-metaframework` | JavaScript/TypeScript | `implementaciones/astro/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 104
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 7](../README.md)
