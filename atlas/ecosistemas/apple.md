# 🍎 Plataformas de Apple

> [⬅️ Atlas](../README.md) · [🗂️ Índice](../frameworks.md) · [🧭 Taxonomía](../../docs/TAXONOMY.md)

**Dos entradas, y el único ecosistema del Atlas sin código abierto.** UIKit y
SwiftUI no son proyectos que puedas bifurcar, auditar ni mantener si su
propietario cambia de opinión. Eso no los hace peores: los hace **el caso donde
la estrategia de salida del [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)
es más difícil de escribir y, por tanto, más necesaria**.

## Por qué este ecosistema es como es

| Condición de la plataforma | Consecuencia en sus frameworks |
| --- | --- |
| **Un solo proveedor**, sin implementaciones alternativas | No hay «cambiar de proveedor»; la salida es reescribir para otra plataforma |
| Ciclo anual atado a las **versiones del sistema operativo** | Las capacidades nuevas exigen que el usuario actualice su dispositivo |
| **Distribución por tienda** con revisión | El ritmo de publicación no lo decides tú |
| Documentación oficial **exhaustiva**, sin fuente pública | La única fuente autorizada es la del fabricante |
| Herramientas y hardware **específicos** para desarrollar | Barrera de entrada material, no solo de conocimiento |

## El mismo cambio de paradigma, una década después

**UIKit** (2008) es imperativo: creas vistas, las añades a una jerarquía y las
mutas cuando cambia el estado. Es exactamente el modelo que jQuery representaba
en la web, con los mismos problemas cuando la aplicación crece — vista y datos
que se desincronizan.

**SwiftUI** (2019) es declarativo: describes la interfaz en función del estado y
el framework calcula el cambio. Es React, once años después, en otra plataforma.

Esa repetición es una de las tesis del Atlas: **las ideas de arquitectura de
interfaz no pertenecen a un lenguaje ni a una plataforma**. Viajan. Quien
entendió el cambio en la web lo reconoce inmediatamente aquí, y viceversa — que
es justo lo que el [módulo 03](../../curriculum/03-frontend-componentes-y-estado.md)
quiere producir.

## Lo que hay que declarar antes de elegir

Si un producto se construye sobre estas plataformas, el registro de decisión del
módulo 11 debe contestar tres preguntas que en otros ecosistemas son opcionales:

1. **¿Qué parte del código sobrevive** si mañana hay que llevar el producto a
   otra plataforma? Si la respuesta es «solo el dominio», ese dominio tiene que
   estar realmente separado — la regla del
   [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md).
2. **¿Qué pasa si una capacidad se retira** o cambia de comportamiento en la
   próxima versión anual del sistema?
3. **¿Cuál es el coste de mantener dos implementaciones** si el producto también
   debe existir en Android o en web?

## Las 2 tecnologías

<!-- generado:tabla-ecosistema apple -->
| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**UIKit**](../fichas/uikit.md) | `ui-toolkit` | 2008 | 🏛️ Clásico | 🟢 activo | `NOASSERTION` | [oficial](https://developer.apple.com/documentation/uikit) |
| [**SwiftUI**](../fichas/swiftui.md) | `ui-toolkit` | 2019 | 🟢 Vigente | 🟢 activo | `NOASSERTION` | [oficial](https://developer.apple.com/documentation/swiftui) |
<!-- fin -->

## Qué aportó cada una

<!-- generado:notas-ecosistema apple -->
- **UIKit** — El modelo imperativo anterior a SwiftUI, todavía necesario para capacidades que SwiftUI no cubre.
- **SwiftUI** — Interfaz declarativa para las plataformas de Apple. No es de código abierto: la estrategia de salida es especialmente relevante aquí.
<!-- fin -->
