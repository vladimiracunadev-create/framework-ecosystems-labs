# Clase 103 — Hipermedia como alternativa

> [⬅️ 102](../102-presupuesto-de-javascript/README.md) · [📚 Parte 7](../README.md) · [🎓 Clases](../../README.md) · [104 ➡️](../104-elegir-estrategia-por-pantalla/README.md)
>
> Parte **7 — Renderizado y full-stack** · Nivel **🔴 avanzado** · Pista **`fullstack`** (Full-stack y renderizado)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Resolver el mismo caso enviando HTML en lugar de estado.

## 🧩 La situación

La misma interacción con fragmentos de HTML del servidor.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [htmx](../../../atlas/fichas/htmx.md) | `hypermedia-library` | JavaScript | `implementaciones/htmx/` |
| [Turbo (Hotwire)](../../../atlas/fichas/hotwire-turbo.md) | `hypermedia-library` | JavaScript | `implementaciones/hotwire-turbo/` |
| [Phoenix LiveView](../../../atlas/fichas/phoenix-liveview.md) | `realtime-ui-framework` | BEAM | `implementaciones/phoenix-liveview/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 103
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 7](../README.md)
