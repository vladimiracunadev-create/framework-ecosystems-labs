# Clase 123 — Una base de código, cuántas plataformas

> [⬅️ 122](../122-distribucion-y-actualizacion/README.md) · [📚 Parte 9](../README.md) · [🎓 Clases](../../README.md)
>
> Parte **9 — Móvil, escritorio y sin conexión** · Nivel **🔴 avanzado** · Pista **`movil`** (Móvil y escritorio)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Decidir qué se comparte y qué no.

## 🧩 La situación

Reparto explícito entre lógica compartida e interfaz por plataforma.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Flutter](../../../atlas/fichas/flutter.md) | `ui-sdk` | Dart | `implementaciones/flutter/` |
| [React Native](../../../atlas/fichas/react-native.md) | `ui-framework` | JavaScript/TypeScript | `implementaciones/react-native/` |
| [Compose Multiplatform](../../../atlas/fichas/compose-multiplatform.md) | `ui-toolkit` | Kotlin | `implementaciones/compose-multiplatform/` |
| [.NET MAUI](../../../atlas/fichas/dotnet-maui.md) | `ui-framework` | .NET | `implementaciones/dotnet-maui/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 123
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 9](../README.md)
