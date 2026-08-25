# Clase 085 — Listas y claves

> [⬅️ 084](../084-estado-local/README.md) · [📚 Parte 6](../README.md) · [🎓 Clases](../../README.md) · [086 ➡️](../086-formularios-controlados/README.md)
>
> Parte **6 — La interfaz: del HTML del servidor al componente** · Nivel **🟡 intermedio** · Pista **`frontend`** (Interfaz y estado)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Renderizar una colección y entender por qué la identidad importa.

## 🧩 La situación

Reordenar la lista conserva el estado de cada elemento.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [React](../../../atlas/fichas/react.md) | `ui-library` | JavaScript/TypeScript | `implementaciones/react/` |
| [Vue](../../../atlas/fichas/vue.md) | `ui-framework` | JavaScript/TypeScript | `implementaciones/vue/` |
| [Svelte](../../../atlas/fichas/svelte.md) | `ui-framework` | JavaScript/TypeScript | `implementaciones/svelte/` |
| [SolidJS](../../../atlas/fichas/solid.md) | `ui-library` | JavaScript/TypeScript | `implementaciones/solid/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 085
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 6](../README.md)
