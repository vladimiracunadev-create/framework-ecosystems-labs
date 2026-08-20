# 🎯 Dart

> [⬅️ Atlas](../README.md) · [🗂️ Índice](../frameworks.md) · [🧭 Taxonomía](../../docs/TAXONOMY.md)

**Una sola entrada, y la relación más inusual del catálogo entre un lenguaje y un
framework.** Dart nació en 2011 para sustituir a JavaScript en el navegador.
Fracasó en ese objetivo por completo. Años después encontró su razón de existir
sosteniendo **Flutter**, y hoy casi todo el Dart del mundo es Flutter.

## Un lenguaje al servicio de un framework

Es el reverso de lo habitual. En los demás ecosistemas el lenguaje existe primero
y los frameworks aparecen encima; aquí el framework **rescató** al lenguaje y
después lo moldeó:

| Necesidad de Flutter | Qué se añadió a Dart |
| --- | --- |
| Recarga en caliente durante el desarrollo | Compilación *just-in-time* en desarrollo y anticipada para producción |
| Interfaz declarativa sin ruido sintáctico | Constructores, argumentos con nombre y expresiones de colección pensadas para árboles de widgets |
| Sin pausas visibles al animar | Recolección de basura generacional ajustada a objetos de vida muy corta |
| Un solo hilo de interfaz sin bloqueos | Aislados con paso de mensajes, sin memoria compartida |
| Menos errores en tiempo de ejecución | Nulabilidad comprobada en compilación, incorporada en 2021 |

## Qué se lleva y qué se paga con Flutter

Flutter **dibuja su propia interfaz** con su motor gráfico, en lugar de usar los
componentes del sistema operativo. Ese es su compromiso central:

**Se lleva:** el mismo aspecto exacto en todas las plataformas, control total del
píxel, animaciones consistentes, y un solo código para móvil, escritorio y web.

**Se paga:** no hereda automáticamente los cambios de la plataforma —un
componente nuevo del sistema no aparece solo—, la accesibilidad depende de que el
framework la reimplemente bien, y el tamaño mínimo de la aplicación es mayor.

Es la comparación que el [módulo 09](../../curriculum/09-movil-escritorio-y-offline.md)
plantea entre dibujar propio y usar componentes nativos, con React Native en la
otra columna.

## La tecnología

<!-- generado:tabla-ecosistema dart -->
| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| **Flutter** | `ui-sdk` | 2017 | 🟢 Vigente | 🟢 activo | `BSD-3-Clause` | [oficial](https://docs.flutter.dev/) |
<!-- fin -->

## Qué aportó

<!-- generado:notas-ecosistema dart -->
- **Flutter** — Dibuja su propia interfaz en lugar de usar los componentes del sistema: control total del aspecto a cambio de no heredar los cambios de la plataforma.
<!-- fin -->
