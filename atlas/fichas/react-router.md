# 🧭 React Router — 2014

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

React Router fue **el enrutador de facto del ecosistema React durante una
década**, y hoy es también metaframework tras su fusión con [Remix](remix.md).

Su ficha existe para explicar algo que el
[módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md) señala desde la
primera hora: **React no trae enrutado**, y eso obliga a una decisión que muchas
comparativas ignoran.

| | |
|---|---|
| **Aparición** | 2014 |
| **Clasificación** | `routing-library` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://reactrouter.com/> |

---

## 💡 Lo que resuelve el enrutado en el cliente

Que la URL represente el estado de la aplicación. Suena menor y sostiene tres
cosas que los usuarios dan por hechas:

1. **Enlazar** a una vista concreta y compartir esa dirección.
2. **Atrás y adelante** del navegador funcionando.
3. **Recargar** y volver al mismo sitio.

Es exactamente lo que [ASP.NET Web Forms](aspnet-webforms.md) rompía en 2002 —la
URL no representaba lo que se veía— y lo que las primeras aplicaciones de página
única volvieron a romper una década después, hasta que los enrutadores lo
arreglaron.

## 📜 Un historial de cambios que enseña

React Router cambió su API de forma significativa varias veces en su historia, y
esa es la parte instructiva para el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md).

Como enseña la [ficha de Ember](ember.md), lo que erosiona la confianza no son
los defectos técnicos sino **la sensación de que el suelo se mueve**. La pregunta
que el módulo 11 obliga a hacer —«¿qué pasó la última vez que hubo una versión
mayor?»— tiene aquí varias respuestas consultables, y leerlas antes de adoptar es
más informativo que cualquier comparativa.

## 🧭 De biblioteca a metaframework

Con la fusión con Remix, React Router pasó de resolver una pieza a ofrecer también
carga de datos, acciones y renderizado en servidor. Es un cambio de categoría en
el sentido del módulo 00: **lo que era una biblioteca ahora también es un
metaframework**, y compararlo con lo que era antes ya no es lo mismo.

## 🎓 Las dos lecciones

**1. Que la URL represente el estado es una propiedad de producto.** Compartir un
enlace y volver atrás no son detalles técnicos.

**2. El historial de cambios de API predice el futuro mejor que las
funcionalidades.** Es el indicador de salud que el módulo 11 sitúa por delante de
la popularidad.

## 🔗 Enlaces

- Documentación oficial: <https://reactrouter.com/>
- [Ficha de Remix](remix.md) · [Ficha de React](react.md) · [Ficha de Ember](ember.md)
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@banks-porcello-learning-react] Banks, Alex; Porcello, Eve. *Learning React*, 2.ª ed. O'Reilly Media, 2020. ISBN 9781492051725 — <https://openlibrary.org/isbn/9781492051725>
