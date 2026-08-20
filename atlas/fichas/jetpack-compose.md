# 🤖 Jetpack Compose — 2021

> [⬅️ Atlas](../README.md) · [☕ Ecosistema JVM](../ecosistemas/jvm.md) · [🗂️ Índice](../frameworks.md)

Jetpack Compose es **el mismo cambio de paradigma que vivió la web, una década
después, en Android**: pasar de mutar vistas a describir la interfaz en función
del estado.

> **🎯 Por qué está en este programa**
>
> Porque demuestra que el modelo declarativo **no es propiedad de la web**
> ([módulo 03](../../curriculum/03-frontend-componentes-y-estado.md)). React
> (2013), SwiftUI (2019), Compose (2021) y Flutter (2017) son la misma idea en
> cuatro plataformas. Reconocerla abarata aprender la siguiente.

| | |
|---|---|
| **Aparición** | 2021, desarrollado por Google |
| **Clasificación** | `ui-toolkit` |
| **Ecosistema** | Android (Kotlin) |
| **Licencia** | `Apache-2.0` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://developer.android.com/compose> |

---

## 📜 Lo que sustituye

El modelo anterior de Android era imperativo: la interfaz se declaraba en XML, se
buscaba cada vista por su identificador y se mutaba desde el código.

```kotlin
// Antes: buscar y mutar. Sincronizar vista y datos era trabajo manual.
findViewById<TextView>(R.id.contador).text = pendientes.toString()

// Compose: describir. El estado cambia y la función se vuelve a ejecutar.
@Composable
fun PanelTareas(tareas: List<Tarea>) {
    val pendientes = tareas.count { !it.done }   // derivado, no guardado
    Column {
        Text("Pendientes: $pendientes")
        Button(onClick = { /* ... */ }, enabled = pendientes > 0) { Text("Completar") }
    }
}
```

Es exactamente el problema del **estado derivado duplicado** que el módulo 03
describe en la web, con la misma solución: si puede calcularse, no se guarda.

## 🧬 La misma idea, cuatro plataformas

| | Año | Plataforma | Mecanismo de actualización |
| --- | ---: | --- | --- |
| React | 2013 | Web | Árbol virtual y comparación |
| Flutter | 2017 | Multiplataforma | Árbol de widgets y comparación |
| SwiftUI | 2019 | Apple | Diferencias sobre un árbol declarativo |
| **Compose** | 2021 | Android, y más | **Recomposición selectiva** por lectura de estado |

Compose es de los cuatro el que más se parece a las **señales**: no vuelve a
ejecutar todo, sino las funciones que leyeron el estado que cambió. Es la misma
idea que Knockout tenía en 2010 —ver la [ficha de Knockout](knockout.md)— aplicada
a una interfaz nativa.

## ⚖️ Lo que hay que declarar

**1. Convivencia larga con el sistema anterior.** Compose y el modelo de vistas
XML coexisten en la misma aplicación. Es la figura estranguladora del
[módulo 10](../../curriculum/10-modernizacion-y-migracion.md) hecha bien: se migra
pantalla a pantalla, no de golpe.

**2. Modelo mental nuevo.** Recomposición, estado recordado y efectos secundarios
controlados exigen desaprender el modelo imperativo. Es la parte cara de la
migración, y no aparece en las estimaciones.

**3. Multiplataforma es otra cosa.** Compose para Android y
[Compose Multiplatform](compose-multiplatform.md) comparten modelo pero no
madurez ni alcance. Conviene no confundirlos al decidir.

## 🎓 Las dos lecciones

**1. Las ideas de arquitectura de interfaz viajan entre plataformas.** El
programa entero se apoya en esa observación.

**2. Una plataforma grande puede cambiar de paradigma sin romper.** Google
mantuvo el sistema anterior funcionando y ofreció convivencia. Es el contraste
con [AngularJS](angularjs.md), en una plataforma con muchísimo más código
instalado.

## 🔗 Enlaces

- Documentación oficial: <https://developer.android.com/compose>
- [Ficha de React](react.md) · [Ficha de Flutter](flutter.md) · [Ficha de Knockout](knockout.md)
- [Módulo 03](../../curriculum/03-frontend-componentes-y-estado.md)

## Fuentes

- [@banks-porcello-learning-react] Banks, Alex; Porcello, Eve. *Learning React*, 2.ª ed. O'Reilly Media, 2020. ISBN 9781492051725 — <https://openlibrary.org/isbn/9781492051725>
