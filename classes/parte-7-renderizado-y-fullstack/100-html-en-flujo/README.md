# Clase 100 — HTML en flujo

> [⬅️ 099](../099-la-cascada-de-peticiones/README.md) · [📚 Parte 7](../README.md) · [🎓 Clases](../../README.md) · [101 ➡️](../101-metadatos-y-descubribilidad/README.md)
>
> Parte **7 — Renderizado y full-stack** · Nivel **🔴 avanzado** · Pista **`fullstack`** (Full-stack y renderizado)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Enviar la parte lista sin esperar a la lenta.

## 🧩 La situación

La cabecera llega antes de que la lista termine de cargarse.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Next.js](../../../atlas/fichas/nextjs.md) | `react-metaframework` | JavaScript/TypeScript | `implementaciones/nextjs/` |
| [Remix](../../../atlas/fichas/remix.md) | `react-metaframework` | JavaScript/TypeScript | `implementaciones/remix/` |
| [SvelteKit](../../../atlas/fichas/sveltekit.md) | `svelte-metaframework` | JavaScript/TypeScript | `implementaciones/sveltekit/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 100
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 7](../README.md)
