# Clase 116 — Acceso al dispositivo

> [⬅️ 115](../115-dibujar-propio-o-usar-lo-nativo/README.md) · [📚 Parte 9](../README.md) · [🎓 Clases](../../README.md) · [117 ➡️](../117-almacenamiento-local/README.md)
>
> Parte **9 — Móvil, escritorio y sin conexión** · Nivel **🟡 intermedio** · Pista **`movil`** (Móvil y escritorio)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Pedir un permiso y usar una capacidad del sistema.

## 🧩 La situación

Lectura de una capacidad del dispositivo con permiso concedido y denegado.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [React Native](../../../atlas/fichas/react-native.md) | `ui-framework` | JavaScript/TypeScript | `implementaciones/react-native/` |
| [Flutter](../../../atlas/fichas/flutter.md) | `ui-sdk` | Dart | `implementaciones/flutter/` |
| [Capacitor](../../../atlas/fichas/capacitor.md) | `runtime-bridge` | JavaScript/TypeScript | `implementaciones/capacitor/` |
| [.NET MAUI](../../../atlas/fichas/dotnet-maui.md) | `ui-framework` | .NET | `implementaciones/dotnet-maui/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 116
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 9](../README.md)
