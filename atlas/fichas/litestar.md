# 🌠 Litestar — 2021

> [⬅️ Atlas](../README.md) · [🐍 Ecosistema Python](../ecosistemas/python.md) · [🗂️ Índice](../frameworks.md)

Litestar nació como alternativa a [FastAPI](fastapi.md) con dos diferencias
deliberadas: **inyección de dependencias por capas** y **controladores de clase**
para organizar aplicaciones grandes.

| | |
|---|---|
| **Aparición** | 2021 (antes llamado Starlite) |
| **Clasificación** | `web-framework` |
| **Ecosistema** | Python |
| **Licencia** | `MIT` |
| **Estado** | 🌊 Emergente |
| **Documentación** | <https://docs.litestar.dev/> |

---

## 💡 Estructura para lo grande

FastAPI organiza por funciones y enrutadores. Litestar añade controladores de
clase y **dependencias declaradas por capas** —aplicación, enrutador,
controlador, ruta— con resolución en cascada.

Es el patrón del [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md)
llevado a Python con más estructura, y responde al mismo problema que
[NestJS](nestjs.md) resolvió en Node.js: **cuando la aplicación crece y el equipo
rota, la convención ahorra decisiones repetidas**.

## ⚖️ Lo que hay que declarar

**1. Es emergente.** Ecosistema pequeño, menos recorrido, menos personas. El
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) lo puntúa como
**madurez demostrada**, junto a la estrategia de salida — que aquí es razonable,
porque comparte la interfaz común del ecosistema Python que describe la
[ficha de Starlette](starlette.md).

**2. Cambió de nombre.** El proyecto se llamaba Starlite. Los cambios de identidad
fragmentan la documentación y las respuestas publicadas durante un tiempo, y es
un coste real de adopción.

**3. Compite con una opción muy establecida.** La pregunta del módulo 11 no es
cuál es mejor en abstracto, sino si la estructura adicional resuelve un problema
que tengas hoy.

## 🎓 Las dos lecciones

**1. Más estructura se amortiza con rotación de equipo**, no con tamaño de
código. Es la misma conclusión que en NestJS y en Spring.

**2. Lo emergente se puntúa, no se descarta.** Madurez y estrategia de salida son
dimensiones de la matriz; el entusiasmo y el rechazo automático no lo son.

## 🔗 Enlaces

- Documentación oficial: <https://docs.litestar.dev/>
- [Ficha de FastAPI](fastapi.md) · [Ficha de NestJS](nestjs.md) · [Ficha de Starlette](starlette.md)
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@lubanovic-fastapi] Lubanovic, Bill. *FastAPI: Modern Python Web Development*. O'Reilly Media, 2023. ISBN 9781098135508 — <https://openlibrary.org/isbn/9781098135508>
