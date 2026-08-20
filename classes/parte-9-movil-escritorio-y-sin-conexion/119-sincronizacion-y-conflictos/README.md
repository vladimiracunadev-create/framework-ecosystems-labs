# Clase 119 — Sincronización y conflictos

> [⬅️ 118](../118-funcionar-sin-conexion/README.md) · [📚 Parte 9](../README.md) · [🎓 Clases](../../README.md) · [120 ➡️](../120-escritorio-incrustar-el-motor-o-heredarlo/README.md)
>
> Parte **9 — Móvil, escritorio y sin conexión** · Nivel **🔴 avanzado** · Pista **`movil`** (Móvil y escritorio)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Resolver dos cambios sobre el mismo dato.

## 🧩 La situación

Dos ediciones concurrentes se resuelven con una política declarada.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [React Native](../../../atlas/fichas/react-native.md) | `ui-framework` | JavaScript/TypeScript | `implementaciones/react-native/` |
| [Flutter](../../../atlas/fichas/flutter.md) | `ui-sdk` | Dart | `implementaciones/flutter/` |
| [Capacitor](../../../atlas/fichas/capacitor.md) | `runtime-bridge` | JavaScript/TypeScript | `implementaciones/capacitor/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 119
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 9](../README.md)
