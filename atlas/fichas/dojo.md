# 🥋 Dojo Toolkit — 2004

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Dojo trajo a la web **módulos, carga asíncrona y componentes de tipo escritorio**
años antes de que el lenguaje tuviera módulos propios. Es la biblioteca más
ambiciosa de su generación.

| | |
|---|---|
| **Aparición** | 2004 |
| **Clasificación** | `ui-toolkit` |
| **Ecosistema** | JavaScript |
| **Licencia** | `BSD-3-Clause` |
| **Gobierno** | OpenJS Foundation |
| **Estado** | 🟡 Mantenimiento |
| **Documentación** | <https://dojotoolkit.org/documentation/> |

---

## 💡 Módulos antes que el lenguaje

JavaScript no tuvo módulos hasta 2015. Dojo definió los suyos en 2004, con carga
asíncrona de dependencias: `define` y `require`, un modelo que después se
formalizó en el ecosistema y que webpack acabó soportando.

También trajo un conjunto de **widgets** de tipo escritorio —tablas con
ordenación, árboles, cuadrículas editables— pensados para aplicaciones internas,
que era el caso de uso más exigente de la época.

## ⚖️ Por qué quedó atrás

**1. El lenguaje lo alcanzó.** Cuando los módulos entraron en el estándar
[@tc39-ecma262], el sistema propio de Dojo pasó de ventaja a peso.

Es el mismo patrón de [jQuery](jquery.md) y de [Tornado](tornado.md): **una
biblioteca resuelve una carencia de la plataforma, la plataforma la incorpora, la
biblioteca pierde su motivo**. Aparece tantas veces en el Atlas que merece
tratarse como regla.

**2. Su tamaño y su curva.** Dojo era grande y exigía aprender su forma de hacer
las cosas. jQuery pedía muchísimo menos para empezar.

## 🎓 Las dos lecciones

**1. Adelantarse a la plataforma tiene fecha de caducidad.** Es un servicio real
mientras dura, y una deuda cuando la plataforma llega.

**2. La barrera de entrada decide adopciones.** Dojo pedía adoptar un mundo;
jQuery, una etiqueta.

## 🔗 Enlaces

- Documentación oficial: <https://dojotoolkit.org/documentation/>
- [Ficha de jQuery](jquery.md) · [Ficha de Ext JS](extjs.md) · [Ficha de Lit](lit.md)
- [Ecosistema JavaScript](../ecosistemas/javascript.md)

## Fuentes

- [@tc39-ecma262] *ECMAScript Language Specification*, Ecma International — TC39 — <https://tc39.es/ecma262/>
