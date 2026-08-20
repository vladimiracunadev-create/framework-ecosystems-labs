# 🌀 chi — 2015

> [⬅️ Atlas](../README.md) · [🐹 Ecosistema Go](../ecosistemas/go.md) · [🗂️ Índice](../frameworks.md)

chi es lo más cercano a **no usar framework** manteniendo enrutado con
parámetros. Su decisión de diseño es total: **compatible con las interfaces de la
biblioteca estándar**, de principio a fin.

| | |
|---|---|
| **Aparición** | 2015 |
| **Clasificación** | `routing-library` |
| **Ecosistema** | Go |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://go-chi.io/> |

---

## 💡 Compatible con lo estándar, de verdad

Un manejador de chi **es** un manejador estándar de Go. Un middleware de chi **es**
un envoltorio estándar. Eso tiene una consecuencia que casi ningún framework del
Atlas puede ofrecer:

> **Puedes quitar chi y quedarte con tu código.** Los manejadores siguen siendo
> válidos; solo pierdes el enrutado con parámetros.

Es la estrategia de salida más limpia del catálogo, y viene incorporada al
diseño. El [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) pregunta
qué quedaría inservible al sustituir el framework: aquí, prácticamente nada.

## 🧩 Interfaces pequeñas

La razón de que esto sea posible es del lenguaje: en Go una interfaz se satisface
**implícitamente** —basta con tener los métodos— y la del manejador HTTP tiene un
solo método. Cuando el punto de acuerdo es tan pequeño, la interoperabilidad
aparece sola [@donovan-kernighan-go].

Compáralo con los estándares PSR de PHP —ver la [ficha de Slim](slim.md)—: allí
la interoperabilidad exigió que proyectos rivales acordaran interfaces por
escrito. Aquí la produce el diseño del lenguaje.

## ⚖️ Lo que no trae

Nada más. Ni validación, ni serialización tipada, ni documentación del contrato,
ni inyección. Es el extremo explícito del eje del
[módulo 02](../../curriculum/02-arquitectura-de-frameworks.md), con el riesgo
correspondiente que enseña el
[laboratorio 02](../../labs/02-express-api/README.md): **se falla por omisión**.

## 🎓 Las dos lecciones

**1. Compatible con lo estándar es la mejor estrategia de salida posible.**
Adoptar y abandonar cuestan casi lo mismo: poco.

**2. Interfaces pequeñas producen interoperabilidad sin acuerdos.** Es una lección
de diseño de API que trasciende a Go.

## 🔗 Enlaces

- Documentación oficial: <https://go-chi.io/>
- [Ficha de Gin](gin.md) · [Ficha de Slim](slim.md) — interoperabilidad por acuerdo
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@donovan-kernighan-go] Donovan, Alan A. A.; Kernighan, Brian W. *The Go Programming Language*. Addison-Wesley, 2016. ISBN 9780134190440 — <https://openlibrary.org/isbn/9780134190440>
