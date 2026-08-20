# Clase 077 — Política de seguridad de contenido

> [⬅️ 076](../076-auditoria/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [078 ➡️](../078-dependencias-vulnerables/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🔴 avanzado** · Pista **`frontend`** (Interfaz y estado)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Limitar lo que el navegador acepta ejecutar.

## 🧩 La situación

Con la política activa, un script en línea no se ejecuta.

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
node scripts/run-class.mjs 077
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 5](../README.md)
