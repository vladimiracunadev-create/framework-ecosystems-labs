# Clase 114 — La misma pantalla en móvil

> [📚 Parte 9](../README.md) · [🎓 Clases](../../README.md) · [115 ➡️](../115-dibujar-propio-o-usar-lo-nativo/README.md)
>
> Parte **9 — Móvil, escritorio y sin conexión** · Nivel **🟡 intermedio** · Pista **`movil`** (Móvil y escritorio)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Construir una lista con detalle en cada aproximación multiplataforma.

## 🧩 La situación

La misma lista y su detalle, navegable, en cada framework del elenco.

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
node scripts/run-class.mjs 114
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 9](../README.md)
