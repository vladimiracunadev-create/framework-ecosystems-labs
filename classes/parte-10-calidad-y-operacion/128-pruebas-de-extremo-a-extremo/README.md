# Clase 128 — Pruebas de extremo a extremo

> [⬅️ 127](../127-integracion-con-base-real/README.md) · [📚 Parte 10](../README.md) · [🎓 Clases](../../README.md) · [129 ➡️](../129-pruebas-de-contrato/README.md)
>
> Parte **10 — Calidad, rendimiento y operación** · Nivel **🔴 avanzado** · Pista **`frontend`** (Interfaz y estado)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Probar el recorrido completo sin que sea inestable.

## 🧩 La situación

Un recorrido de alta y consulta, estable en diez ejecuciones seguidas.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [React](../../../atlas/fichas/react.md) | `ui-library` | JavaScript/TypeScript | `implementaciones/react/` |
| [Vue](../../../atlas/fichas/vue.md) | `web-framework` | JavaScript/TypeScript | `implementaciones/vue/` |
| [Svelte](../../../atlas/fichas/svelte.md) | `ui-framework` | JavaScript/TypeScript | `implementaciones/svelte/` |
| [SolidJS](../../../atlas/fichas/solid.md) | `ui-library` | JavaScript/TypeScript | `implementaciones/solid/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 128
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 10](../README.md)
