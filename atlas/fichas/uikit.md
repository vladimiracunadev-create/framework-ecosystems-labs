# 📱🍏 UIKit — 2008

> [⬅️ Atlas](../README.md) · [🍎 Plataformas de Apple](../ecosistemas/apple.md) · [🗂️ Índice](../frameworks.md)

UIKit es el modelo **imperativo** anterior a [SwiftUI](swiftui.md): crear vistas,
añadirlas a una jerarquía y mutarlas cuando cambia el estado. Es, en la
plataforma de Apple, lo que [jQuery](jquery.md) representaba en la web — con los
mismos problemas cuando la aplicación crece.

| | |
|---|---|
| **Aparición** | 2008, con el primer kit de desarrollo de iPhone |
| **Clasificación** | `ui-toolkit` |
| **Ecosistema** | Apple (Swift, antes Objective-C) |
| **Licencia** | `NOASSERTION` — propietario |
| **Estado** | 🟢 Activo — sigue siendo necesario |
| **Documentación** | <https://developer.apple.com/documentation/uikit> |

---

## 💡 Mutar la vista

```swift
// El estado vive en la vista, y sincronizarlo es trabajo manual.
etiquetaPendientes.text = "\(pendientes)"
botonCompletar.isEnabled = pendientes > 0
```

Si alguien añade una tercera parte de la interfaz y olvida actualizarla, la
pantalla muestra dos cifras distintas para lo mismo. Es exactamente el **estado
derivado duplicado** que el
[módulo 03](../../curriculum/03-frontend-componentes-y-estado.md) describe, y el
mismo problema que llevó a la web de jQuery a React.

## 🧭 Por qué sigue siendo necesario

Esta es la parte práctica que conviene saber antes de planificar: SwiftUI no
cubre todavía todo lo que cubre UIKit. Capacidades avanzadas de cámara, controles
muy personalizados, comportamientos finos de desplazamiento o integraciones
concretas siguen exigiendo bajar a UIKit, con envoltorios de interoperabilidad.

Eso convierte la migración a SwiftUI en **convivencia de larga duración**, no en
un cambio con fecha. Es la figura estranguladora del
[módulo 10](../../curriculum/10-modernizacion-y-migracion.md) aplicada dentro de
una plataforma, y con la misma advertencia: **hace falta un criterio de retirada
escrito**, o los dos modelos conviven indefinidamente y se paga el doble
mantenimiento.

## 🎓 Las dos lecciones

**1. El mismo problema aparece en plataformas distintas con veinte años de
diferencia.** Mutar la vista a mano no escala, ni en el navegador ni en un
teléfono.

**2. Que exista un sucesor no significa que el antecesor se pueda retirar.** Sin
paridad de capacidades, la convivencia es la situación normal — y hay que
planificarla.

## 🔗 Enlaces

- Documentación oficial: <https://developer.apple.com/documentation/uikit>
- [Ficha de SwiftUI](swiftui.md) — su sucesor · [Ficha de jQuery](jquery.md) — el paralelo en la web
- [Módulo 10](../../curriculum/10-modernizacion-y-migracion.md)

## Fuentes

- [@feathers-legacy-code] Feathers, Michael C. *Working Effectively with Legacy Code*. Prentice Hall, 2004. ISBN 9780131177055 — <https://openlibrary.org/isbn/9780131177055>
