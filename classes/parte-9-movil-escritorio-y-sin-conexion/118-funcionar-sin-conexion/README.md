# Clase 118 — Funcionar sin conexión

> [⬅️ 117](../117-almacenamiento-local/README.md) · [📚 Parte 9](../README.md) · [🎓 Clases](../../README.md) · [119 ➡️](../119-sincronizacion-y-conflictos/README.md)
>
> Parte **9 — Móvil, escritorio y sin conexión** · Nivel **🔴 avanzado** · Pista **`movil`** (Móvil y escritorio)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Seguir siendo útil cuando no hay red.

## 🧩 La situación

Las operaciones se encolan sin red y se aplican al recuperarla.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [React Native](../../../atlas/fichas/react-native.md) | `ui-framework` | JavaScript/TypeScript | `implementaciones/react-native/` |
| [Flutter](../../../atlas/fichas/flutter.md) | `ui-sdk` | Dart | `implementaciones/flutter/` |
| [Capacitor](../../../atlas/fichas/capacitor.md) | `runtime-bridge` | JavaScript/TypeScript | `implementaciones/capacitor/` |
| [SvelteKit](../../../atlas/fichas/sveltekit.md) | `svelte-metaframework` | JavaScript/TypeScript | `implementaciones/sveltekit/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 118
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 9](../README.md)
