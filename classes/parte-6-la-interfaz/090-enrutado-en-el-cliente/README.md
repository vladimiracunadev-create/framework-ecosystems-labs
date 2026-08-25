# Clase 090 — Enrutado en el cliente

> [⬅️ 089](../089-estado-del-servidor-en-el-cliente/README.md) · [📚 Parte 6](../README.md) · [🎓 Clases](../../README.md) · [091 ➡️](../091-accesibilidad-del-componente/README.md)
>
> Parte **6 — La interfaz: del HTML del servidor al componente** · Nivel **🟡 intermedio** · Pista **`frontend`** (Interfaz y estado)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Cambiar de vista sin recargar y sin romper el navegador.

## 🧩 La situación

Navegación, atrás y enlace directo funcionan igual.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [React](../../../atlas/fichas/react.md) | `ui-library` | JavaScript/TypeScript | `implementaciones/react/` |
| [Vue](../../../atlas/fichas/vue.md) | `ui-framework` | JavaScript/TypeScript | `implementaciones/vue/` |
| [Angular](../../../atlas/fichas/angular.md) | `ui-framework` | TypeScript | `implementaciones/angular/` |
| [Svelte](../../../atlas/fichas/svelte.md) | `ui-framework` | JavaScript/TypeScript | `implementaciones/svelte/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 090
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 6](../README.md)
