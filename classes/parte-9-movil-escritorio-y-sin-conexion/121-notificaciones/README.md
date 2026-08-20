# Clase 121 — Notificaciones

> [⬅️ 120](../120-escritorio-incrustar-el-motor-o-heredarlo/README.md) · [📚 Parte 9](../README.md) · [🎓 Clases](../../README.md) · [122 ➡️](../122-distribucion-y-actualizacion/README.md)
>
> Parte **9 — Móvil, escritorio y sin conexión** · Nivel **🟡 intermedio** · Pista **`movil`** (Móvil y escritorio)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Avisar al usuario cuando la aplicación no está delante.

## 🧩 La situación

Una notificación local mostrada y atendida al pulsarla.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [React Native](../../../atlas/fichas/react-native.md) | `ui-framework` | JavaScript/TypeScript | `implementaciones/react-native/` |
| [Flutter](../../../atlas/fichas/flutter.md) | `ui-sdk` | Dart | `implementaciones/flutter/` |
| [Capacitor](../../../atlas/fichas/capacitor.md) | `runtime-bridge` | JavaScript/TypeScript | `implementaciones/capacitor/` |
| [Electron](../../../atlas/fichas/electron.md) | `desktop-runtime` | JavaScript/TypeScript | `implementaciones/electron/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 121
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 9](../README.md)
