# 🐦 Flutter — 2017

> [⬅️ Atlas](../README.md) · [🎯 Ecosistema Dart](../ecosistemas/dart.md) · [🗂️ Índice](../frameworks.md)

Flutter toma la decisión más radical del catálogo en interfaces multiplataforma:
**no usa los componentes del sistema operativo**. Dibuja cada píxel con su propio
motor gráfico, igual que un videojuego. Todo lo bueno y todo lo malo de Flutter
sale de ahí.

> **🎯 Por qué está en este programa**
>
> Porque es **la columna opuesta a React Native** en la comparación del
> [módulo 09](../../curriculum/09-movil-escritorio-y-offline.md): dibujar propio
> frente a usar componentes nativos. Es el compromiso multiplataforma en su forma
> más nítida, y ninguna de las dos columnas gana en abstracto.

| | |
|---|---|
| **Aparición** | 2017, desarrollado por Google |
| **Clasificación** | `ui-sdk` |
| **Ecosistema** | Dart |
| **Licencia** | `BSD-3-Clause` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.flutter.dev/> |

---

## 💡 Cómo funciona por dentro

La arquitectura tiene tres capas, y entenderlas explica todo lo demás
[@flutter-architecture]:

```
┌─────────────────────────────────────────┐
│  Widgets (Dart)  — tu código            │  Composición declarativa
├─────────────────────────────────────────┤
│  Motor (C++)     — dibujo y texto       │  Rasteriza CADA píxel
├─────────────────────────────────────────┤
│  Sistema operativo — lienzo y eventos   │  Solo aporta superficie y entrada
└─────────────────────────────────────────┘
```

Al sistema operativo se le pide **una superficie donde dibujar** y los eventos de
entrada. Nada más. Los botones, las listas y los campos de texto los pinta
Flutter.

```dart
// Todo es un widget, y los widgets se componen.
class PanelTareas extends StatelessWidget {
  final List<Tarea> tareas;
  const PanelTareas({super.key, required this.tareas});

  @override
  Widget build(BuildContext context) {
    final pendientes = tareas.where((t) => !t.done).length;  // derivado, no guardado
    return Column(children: [
      Text('Pendientes: $pendientes'),
      Expanded(child: ListView(children: tareas.map((t) => Text(t.title)).toList())),
    ]);
  }
}
```

Es el mismo modelo declarativo de React —`vista = f(estado)`— once años después y
en otra plataforma [@windmill-flutter]. Esa repetición es una de las tesis del
[Atlas](../README.md): las ideas de arquitectura de interfaz **viajan entre
plataformas**.

## ⚖️ El compromiso, con las dos columnas

| | Flutter (dibuja propio) | React Native (componentes nativos) |
| --- | --- | --- |
| Aspecto | Idéntico en todas las plataformas | El de cada sistema |
| Componente nuevo del sistema | **No aparece** hasta que Flutter lo implemente | Aparece solo |
| Control del píxel | Total | Limitado a lo que expone el sistema |
| Accesibilidad | Depende de que Flutter la reimplemente bien | Hereda la del sistema |
| Tamaño mínimo | Mayor: el motor va dentro | Menor |
| Animaciones | Muy consistentes | Dependen de la plataforma |

**La fila de accesibilidad es la más importante y la que menos se discute.**
Cuando no usas los componentes del sistema, el lector de pantalla no los reconoce
solos: el framework tiene que exponer un árbol de accesibilidad equivalente.
Flutter lo hace, y aun así el
[módulo 03](../../curriculum/03-frontend-componentes-y-estado.md) obliga a lo
mismo que en la web: **verificarlo con un lector real**, no darlo por supuesto.

## 🧬 El lenguaje al servicio del framework

Flutter es el único caso del catálogo donde **el framework moldeó el lenguaje**.
Dart existía desde 2011 y había fracasado en su objetivo original —sustituir a
JavaScript—. Flutter le dio una razón de ser, y a cambio Dart incorporó lo que
Flutter necesitaba: compilación en dos modos —rápida en desarrollo para la
recarga en caliente, anticipada en producción—, recolección de basura ajustada a
objetos de vida muy corta, y nulabilidad comprobada en compilación.

La relación completa está en la [página del ecosistema](../ecosistemas/dart.md), y
es la razón de que Dart tenga una entrada propia en el Atlas.

## 🧭 Lo que hay que declarar antes de elegirlo

**1. Un lenguaje más para el equipo.** Dart se aprende rápido y sigue siendo un
lenguaje que probablemente nadie del equipo usa en otro sitio. El
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) pide separar «lo
que sabemos» de «lo que podemos aprender», y aquí esa distinción tiene coste.

**2. La estrategia de salida es cara.** El código de interfaz no se reutiliza
fuera de Flutter. Lo que sobrevive a una migración es el dominio — **si está
separado**, que es la regla del
[módulo 02](../../curriculum/02-arquitectura-de-frameworks.md).

**3. La web es un destino distinto.** Flutter compila a web, pero el resultado es
un lienzo dibujado, no un documento HTML. Eso afecta a la indexación, a la
selección de texto y a la accesibilidad de forma que hay que evaluar caso por
caso, no asumir.

## 🎓 Las tres lecciones

**1. Dibujar propio compra consistencia y vende herencia.** No heredas los
cambios de la plataforma —ni los buenos ni los malos—, y eso es una decisión de
producto, no técnica.

**2. La accesibilidad es la fila que decide en interfaces no nativas.** Si el
framework no la reimplementa bien, la pagas tú en cada componente.

**3. Las ideas de interfaz viajan.** El modelo declarativo de React aparece en
Flutter, en SwiftUI y en Jetpack Compose. Reconocerlo abarata aprender la
siguiente plataforma.

## 🔗 Enlaces

- Documentación oficial: <https://docs.flutter.dev/>
- [Ficha de React Native](react-native.md) — la otra columna
- [Ecosistema Dart](../ecosistemas/dart.md) · [Módulo 09](../../curriculum/09-movil-escritorio-y-offline.md)

## Fuentes

- [@windmill-flutter] Windmill, Eric. *Flutter in Action*. Manning Publications, 2019. ISBN 9781617296147 — <https://openlibrary.org/isbn/9781617296147>
- [@flutter-architecture] *Flutter Architectural Overview*, Google — Flutter — <https://docs.flutter.dev/resources/architectural-overview>
