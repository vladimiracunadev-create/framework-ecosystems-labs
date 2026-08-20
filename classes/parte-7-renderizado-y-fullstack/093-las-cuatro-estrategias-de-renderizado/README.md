# Clase 093 — Las cuatro estrategias de renderizado

> [📚 Parte 7](../README.md) · [🎓 Clases](../../README.md) · [094 ➡️](../094-hidratacion/README.md)
>
> Parte **7 — Renderizado y full-stack** · Nivel **🟡 intermedio** · Pista **`fullstack`** (Full-stack y renderizado)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Situar cliente, servidor, estático y revalidación en un mismo eje.

## 🧩 La situación

La misma pantalla servida con las cuatro estrategias y medida en cada una.

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
node scripts/run-class.mjs 093
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 7](../README.md)
