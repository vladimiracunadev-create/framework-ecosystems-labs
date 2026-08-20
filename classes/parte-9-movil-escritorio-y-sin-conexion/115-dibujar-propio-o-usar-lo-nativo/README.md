# Clase 115 — Dibujar propio o usar lo nativo

> [⬅️ 114](../114-la-misma-pantalla-en-movil/README.md) · [📚 Parte 9](../README.md) · [🎓 Clases](../../README.md) · [116 ➡️](../116-acceso-al-dispositivo/README.md)
>
> Parte **9 — Móvil, escritorio y sin conexión** · Nivel **🔴 avanzado** · Pista **`movil`** (Móvil y escritorio)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Entender qué se gana y qué se pierde con cada decisión de renderizado.

## 🧩 La situación

El mismo control comparado en aspecto, comportamiento y accesibilidad.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [React Native](../../../atlas/fichas/react-native.md) | `ui-framework` | JavaScript/TypeScript | `implementaciones/react-native/` |
| [Flutter](../../../atlas/fichas/flutter.md) | `ui-sdk` | Dart | `implementaciones/flutter/` |
| [Ionic](../../../atlas/fichas/ionic.md) | `ui-toolkit` | JavaScript/TypeScript | `implementaciones/ionic/` |
| [.NET MAUI](../../../atlas/fichas/dotnet-maui.md) | `ui-framework` | .NET | `implementaciones/dotnet-maui/` |
| [SwiftUI](../../../atlas/fichas/swiftui.md) | `ui-toolkit` | Apple | `implementaciones/swiftui/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 115
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 9](../README.md)
