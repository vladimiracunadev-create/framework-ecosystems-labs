# 🧬 Prototype — 2005

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Prototype es anterior a [jQuery](jquery.md) y enseñó al ecosistema una lección por
la vía dura: **modificar los objetos globales del lenguaje rompe la
interoperabilidad entre bibliotecas**.

| | |
|---|---|
| **Aparición** | 2005, creado por Sam Stephenson (junto a Rails) |
| **Clasificación** | `dom-library` |
| **Ecosistema** | JavaScript |
| **Licencia** | `MIT` |
| **Estado** | ⚪ Histórico |
| **Documentación** | <https://github.com/prototypejs/prototype> |

---

## ⚠️ Extender los prototipos nativos

Prototype añadía métodos a los objetos base del lenguaje: `Array`, `String`,
`Object`. Escribir `[1,2,3].each(...)` funcionaba porque la biblioteca había
añadido `each` a **todos los arreglos del programa**.

Cómodo, y con dos consecuencias graves:

**1. Colisiones entre bibliotecas.** Dos bibliotecas que añaden un método con el
mismo nombre y distinto comportamiento producen fallos imposibles de atribuir.
Fue la causa de que Prototype y otras bibliotecas no pudieran convivir.

**2. Ruptura al evolucionar el lenguaje.** Cuando el estándar añadió sus propios
métodos con nombres parecidos, el código que dependía de los de Prototype se
comportó de forma distinta según el orden de carga [@tc39-ecma262].

jQuery hizo lo contrario: **envolver en lugar de extender**. `$(elemento)` crea un
objeto propio y no toca nada global. Esa decisión, más que ninguna otra, explica
por qué jQuery pudo convivir con todo lo demás.

## 🎓 Las dos lecciones

**1. No modifiques lo que no es tuyo.** El espacio de nombres global es
compartido, y una biblioteca que lo altera impone su decisión a todo el programa.

**2. Envolver es más seguro que extender.** Es un principio de diseño de API que
va mucho más allá de JavaScript: el mismo razonamiento sostiene el
encapsulamiento del [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md).

## 🔗 Enlaces

- Repositorio oficial: <https://github.com/prototypejs/prototype>
- [Ficha de jQuery](jquery.md) — quien hizo lo contrario · [Ficha de MooTools](mootools.md)
- [Ecosistema JavaScript](../ecosistemas/javascript.md)

## Fuentes

- [@tc39-ecma262] *ECMAScript Language Specification*, Ecma International — TC39 — <https://tc39.es/ecma262/>
- [@flanagan-javascript-definitive] Flanagan, David. *JavaScript: The Definitive Guide*, 7.ª ed. O'Reilly Media, 2020. ISBN 9781491952023 — <https://openlibrary.org/isbn/9781491952023>
