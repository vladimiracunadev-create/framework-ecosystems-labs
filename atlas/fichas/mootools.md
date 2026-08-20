# 🌙 MooTools — 2006

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

MooTools fue el competidor directo de [jQuery](jquery.md), con un diseño que
muchos consideraban más elegante: un sistema de clases coherente y una API
uniforme. Perdió, y **su derrota es la lección**.

| | |
|---|---|
| **Aparición** | 2006 |
| **Clasificación** | `dom-library` |
| **Ecosistema** | JavaScript |
| **Licencia** | `MIT` |
| **Estado** | ⚪ Histórico |
| **Documentación** | <https://mootools.net/> |

---

## ⚖️ Por qué perdió

No fue por calidad técnica. Fueron tres factores que el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) puntúa
explícitamente:

**1. El ecosistema de complementos.** jQuery tenía muchísimos más. Para quien
necesitaba un carrusel, un selector de fecha o una tabla ordenable, esa
diferencia decidía el proyecto.

**2. Extendía los prototipos nativos**, como [Prototype](prototype-js.md), con las
mismas consecuencias de colisión e incompatibilidad.

**3. Documentación y comunidad.** jQuery era más fácil de empezar y tenía más
respuestas publicadas.

## 🧭 Lo que enseña para decidir

MooTools es el caso que justifica que el módulo 11 puntúe **el ecosistema y la
disponibilidad de personas** como dimensiones propias, y no como accesorios de la
calidad técnica.

Un framework mejor diseñado y con menos ecosistema **es peor elección** para la
mayoría de los productos, porque cada pieza que falta hay que construirla y
mantenerla. Reconocer eso no es cinismo: es contar el coste total.

Y una segunda lección, más incómoda: **la elegancia de la API no es un criterio
de la matriz**. Es agradable, y no responde a ninguna de las preguntas sobre
producto, equipo, riesgo o ciclo de vida.

## 🎓 Las dos lecciones

**1. El ecosistema es una dimensión de la decisión, no un accesorio.** Lo que no
existe, lo construyes tú.

**2. Elegancia no es criterio.** Debe ceder ante ajuste al producto, seguridad,
operación y capacidades del equipo.

## 🔗 Enlaces

- Documentación oficial: <https://mootools.net/>
- [Ficha de jQuery](jquery.md) · [Ficha de Prototype](prototype-js.md)
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@bibeault-jquery-in-action] Bibeault, Bear; Katz, Yehuda. *jQuery in Action*. Manning, 2008. ISBN 9781933988351 — <https://openlibrary.org/isbn/9781933988351>
