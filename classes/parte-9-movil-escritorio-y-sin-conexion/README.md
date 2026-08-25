# Parte 9 — Móvil, escritorio y sin conexión

> [⬅️ Parte 8](../parte-8-tiempo-real-y-segundo-plano/README.md) · [🎓 Todas las clases](../README.md) · [📖 Glosario](../../glosario/README.md) · [Parte 10 ➡️](../parte-10-calidad-y-operacion/README.md)

**Salir del navegador: una base de código, varias plataformas, y la red que deja de estar garantizada.**

**Clases 114 a 123** · 10 en total · 0 construidas · 13 tecnologías en juego.

## 🧭 De qué va esta parte

Diez clases sobre lo que cambia cuando la aplicación **no vive en una pestaña**.

Móvil y escritorio comparten una pregunta de fondo: ¿dibujas tú los controles o usas los del sistema? Las dos respuestas tienen nombre, defensores y consecuencias medibles en apariencia, rendimiento y tamaño del artefacto.

Y una vez fuera del navegador aparece el problema más difícil de la parte: **funcionar sin conexión**. No es una funcionalidad que se añade: cambia el modelo de datos entero, porque el estado local pasa a ser una fuente y el servidor, un par con el que hay que reconciliar.

## 🎒 Qué da por sabido

- La parte 6, porque casi todos estos frameworks son componentes con otro destino.
- La parte 8, porque sincronizar es trabajo en segundo plano con conflictos.

## 🎯 Qué sabrás hacer al terminarla

- Llevar la misma pantalla a un móvil con dos enfoques distintos y comparar lo que se paga.
- Elegir entre dibujar propio y usar lo nativo con un criterio declarado.
- Guardar datos en el dispositivo y decidir qué es caché y qué es fuente.
- Hacer que la aplicación funcione sin red y sincronice después.
- Resolver un conflicto de sincronización con una política explícita, no con «el último que escribe».
- Distribuir y actualizar una aplicación que no está en un servidor tuyo.

## 🧵 Por qué en este orden

Las tres primeras son la pantalla: llevarla al móvil (114), la decisión de fondo (115) y el acceso al dispositivo (116).

Las tres del medio son el problema difícil: almacenamiento local, funcionar sin conexión y sincronizar.

Las cuatro últimas son escritorio y distribución: incrustar o heredar el motor, notificaciones, actualización y cuántas plataformas caben en una base de código.

## 📚 Las clases

| # | Clase | Qué resuelve | Nivel | Estado |
| --- | --- | --- | --- | --- |
| [114](114-la-misma-pantalla-en-movil/README.md) | [La misma pantalla en móvil](114-la-misma-pantalla-en-movil/README.md) | Construir una lista con detalle en cada aproximación multiplataforma. | 🟡 intermedio | 🚧 Esqueleto |
| [115](115-dibujar-propio-o-usar-lo-nativo/README.md) | [Dibujar propio o usar lo nativo](115-dibujar-propio-o-usar-lo-nativo/README.md) | Entender qué se gana y qué se pierde con cada decisión de renderizado. | 🔴 avanzado | 🚧 Esqueleto |
| [116](116-acceso-al-dispositivo/README.md) | [Acceso al dispositivo](116-acceso-al-dispositivo/README.md) | Pedir un permiso y usar una capacidad del sistema. | 🟡 intermedio | 🚧 Esqueleto |
| [117](117-almacenamiento-local/README.md) | [Almacenamiento local](117-almacenamiento-local/README.md) | Guardar datos en el dispositivo y recuperarlos tras reiniciar. | 🟡 intermedio | 🚧 Esqueleto |
| [118](118-funcionar-sin-conexion/README.md) | [Funcionar sin conexión](118-funcionar-sin-conexion/README.md) | Seguir siendo útil cuando no hay red. | 🔴 avanzado | 🚧 Esqueleto |
| [119](119-sincronizacion-y-conflictos/README.md) | [Sincronización y conflictos](119-sincronizacion-y-conflictos/README.md) | Resolver dos cambios sobre el mismo dato. | 🔴 avanzado | 🚧 Esqueleto |
| [120](120-escritorio-incrustar-el-motor-o-heredarlo/README.md) | [Escritorio: incrustar el motor o heredarlo](120-escritorio-incrustar-el-motor-o-heredarlo/README.md) | Comparar el coste de llevar el navegador contra usar el del sistema. | 🟡 intermedio | 🚧 Esqueleto |
| [121](121-notificaciones/README.md) | [Notificaciones](121-notificaciones/README.md) | Avisar al usuario cuando la aplicación no está delante. | 🟡 intermedio | 🚧 Esqueleto |
| [122](122-distribucion-y-actualizacion/README.md) | [Distribución y actualización](122-distribucion-y-actualizacion/README.md) | Entender por qué actualizar no es desplegar. | 🔴 avanzado | 🚧 Esqueleto |
| [123](123-una-base-de-codigo-cuantas-plataformas/README.md) | [Una base de código, cuántas plataformas](123-una-base-de-codigo-cuantas-plataformas/README.md) | Decidir qué se comparte y qué no. | 🔴 avanzado | 🚧 Esqueleto |

## 🎬 Las tecnologías que aparecen

Entre paréntesis, en cuántas clases de esta parte interviene cada una. **Estar aquí no es una recomendación**: es que el problema de esa clase existe de verdad para esa tecnología.

| Ecosistema | Tecnologías |
| --- | --- |
| **JavaScript/TypeScript** | [React Native](../../atlas/fichas/react-native.md) (9), [Capacitor](../../atlas/fichas/capacitor.md) (5), [Electron](../../atlas/fichas/electron.md) (3), [Ionic](../../atlas/fichas/ionic.md) (3), [SvelteKit](../../atlas/fichas/sveltekit.md) (1) |
| **.NET** | [.NET MAUI](../../atlas/fichas/dotnet-maui.md) (5), [Avalonia](../../atlas/fichas/avalonia.md) (1), [WPF](../../atlas/fichas/wpf.md) (1) |
| **Dart** | [Flutter](../../atlas/fichas/flutter.md) (9) |
| **Apple** | [SwiftUI](../../atlas/fichas/swiftui.md) (3) |
| **Rust** | [Tauri](../../atlas/fichas/tauri.md) (2) |
| **Kotlin** | [Compose Multiplatform](../../atlas/fichas/compose-multiplatform.md) (1) |
| **C++** | [Qt](../../atlas/fichas/qt.md) (1) |

## 📖 Las palabras que esta parte define

[**Sin conexión primero**](../../glosario/README.md#sin-conexión-primero) · [**Conflicto**](../../glosario/README.md#conflicto) · [**Sincronización**](../../glosario/README.md#sincronización)

Todas, con su definición, en el [glosario](../../glosario/README.md).

## ✅ Cómo se ejecuta una clase de esta parte

```bash
node scripts/run-class.mjs 114
```

El verificador arranca cada implementación, la somete a su `contrato.json` y **declara cuáles omitió** por no encontrar su cadena de herramientas. Si te faltan cadenas, `node scripts/doctor.mjs` dice cuáles y cómo se instalan.

## ➡️ Y después

La parte 10 pone todo lo anterior en producción y lo mide.
