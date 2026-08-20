# Clase 120 — Escritorio: incrustar el motor o heredarlo

> [⬅️ 119](../119-sincronizacion-y-conflictos/README.md) · [📚 Parte 9](../README.md) · [🎓 Clases](../../README.md) · [121 ➡️](../121-notificaciones/README.md)
>
> Parte **9 — Móvil, escritorio y sin conexión** · Nivel **🟡 intermedio** · Pista **`movil`** (Móvil y escritorio)
>
> 🚧 **Clase en esqueleto.** El contrato y el elenco están fijados; la prosa y
> las implementaciones se escriben en una pasada posterior. Lo que hay aquí ya
> es exacto: no se ampliará con relleno.

## 🎯 Objetivo

Comparar el coste de llevar el navegador contra usar el del sistema.

## 🧩 La situación

La misma aplicación empaquetada con ambas estrategias, medida en tamaño y memoria.

## 🎬 Elenco

Los frameworks para los que este problema tiene sentido. Cada uno lo resolverá a
su manera, y esa diferencia es el contenido de la clase.

| Framework | Categoría | Ecosistema | Implementación |
| --- | --- | --- | --- |
| [Electron](../../../atlas/fichas/electron.md) | `desktop-runtime` | JavaScript/TypeScript | `implementaciones/electron/` |
| [Tauri](../../../atlas/fichas/tauri.md) | `desktop-runtime` | Rust | `implementaciones/tauri/` |
| [Avalonia](../../../atlas/fichas/avalonia.md) | `ui-framework` | .NET | `implementaciones/avalonia/` |
| [WPF](../../../atlas/fichas/wpf.md) | `ui-framework` | .NET | `implementaciones/wpf/` |
| [Qt](../../../atlas/fichas/qt.md) | `ui-framework` | C++ | `implementaciones/qt/` |

## ✅ Verificación

```bash
node scripts/run-class.mjs 120
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta las
implementaciones que encuentre y declara las que omitió.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde esta solución es natural y dónde es forzada
- [Índice de la parte 9](../README.md)
