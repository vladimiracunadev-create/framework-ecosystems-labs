# 🍏 SwiftUI — 2019

> [⬅️ Atlas](../README.md) · [🍎 Plataformas de Apple](../ecosistemas/apple.md) · [🗂️ Índice](../frameworks.md)

SwiftUI es **React, once años después, en las plataformas de Apple**: describir la
interfaz en función del estado y dejar que el framework calcule el cambio.

Y es el único framework del catálogo, junto a [UIKit](uikit.md), **sin código
abierto**, lo que convierte su estrategia de salida en la más difícil de escribir.

| | |
|---|---|
| **Aparición** | 2019 |
| **Clasificación** | `ui-toolkit` |
| **Ecosistema** | Apple (Swift) |
| **Licencia** | `NOASSERTION` — propietario |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://developer.apple.com/documentation/swiftui> |

---

## 💡 El mismo modelo, otra plataforma

```swift
struct PanelTareas: View {
    let tareas: [Tarea]

    var body: some View {
        let pendientes = tareas.filter { !$0.done }.count   // derivado, no guardado
        VStack {
            Text("Pendientes: \(pendientes)")
            Button("Completar") { }.disabled(pendientes == 0)
        }
    }
}
```

Es exactamente el patrón del
[módulo 03](../../curriculum/03-frontend-componentes-y-estado.md): estado derivado
que se calcula, restricción visible en lugar de error posterior, y una función de
estado a interfaz.

Quien entendió el cambio en la web lo reconoce aquí de inmediato, y viceversa.
Esa transferencia es el objetivo del programa.

## ⚖️ Lo que hay que declarar antes de elegirlo

**1. No es de código abierto.** No se puede bifurcar, ni auditar, ni mantener si
el proveedor cambia de opinión. El
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) pregunta qué parte
del código quedaría inservible al sustituirlo: aquí, **toda la interfaz**. Lo que
sobrevive es el dominio, **si está separado** —la regla del
[módulo 02](../../curriculum/02-arquitectura-de-frameworks.md).

**2. Las capacidades nuevas exigen sistemas nuevos.** SwiftUI evoluciona con las
versiones anuales del sistema operativo, así que el conjunto de funciones
disponibles depende de la versión mínima que soporte tu aplicación.

**3. Convive con UIKit, y hay que saberlo.** Para capacidades que SwiftUI aún no
cubre se usan envoltorios sobre [UIKit](uikit.md). Es convivencia real y
duradera, no un puente temporal — la figura estranguladora del
[módulo 10](../../curriculum/10-modernizacion-y-migracion.md) aplicada dentro de
una plataforma.

## 🎓 Las dos lecciones

**1. El modelo declarativo no pertenece a la web.** React, SwiftUI, Compose,
Flutter: la misma idea en cuatro plataformas y una década de diferencia.

**2. Sin código abierto, la estrategia de salida es reescribir.** No es una razón
para descartarlo —es la plataforma— sino para separar el dominio con disciplina.

## 🔗 Enlaces

- Documentación oficial: <https://developer.apple.com/documentation/swiftui>
- [Ficha de UIKit](uikit.md) · [Ficha de React](react.md) · [Ficha de Jetpack Compose](jetpack-compose.md)
- [Módulo 03](../../curriculum/03-frontend-componentes-y-estado.md)

## Fuentes

- [@martin-clean-architecture] Martin, Robert C. *Clean Architecture*. Pearson, 2017. ISBN 9780134494166 — <https://openlibrary.org/isbn/9780134494166>
