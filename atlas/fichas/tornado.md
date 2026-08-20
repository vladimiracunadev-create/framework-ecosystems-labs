# 🌪️ Tornado — 2009

> [⬅️ Atlas](../README.md) · [🐍 Ecosistema Python](../ecosistemas/python.md) · [🗂️ Índice](../frameworks.md)

Tornado trajo la **entrada/salida no bloqueante a Python** años antes de que el
lenguaje tuviera sintaxis para ello. Nació en FriendFeed para sostener conexiones
de larga duración —lo que hoy llamaríamos tiempo real— cuando el modelo dominante
seguía siendo un hilo por petición.

| | |
|---|---|
| **Aparición** | 2009, publicado por Facebook tras adquirir FriendFeed |
| **Clasificación** | `web-framework` con bucle de eventos propio |
| **Ecosistema** | Python |
| **Licencia** | `Apache-2.0` |
| **Estado** | 🟡 Mantenimiento |
| **Documentación** | <https://www.tornadoweb.org/en/stable/> |

---

## 💡 Un bucle de eventos antes de que el lenguaje lo tuviera

Tornado implementó su propio bucle de eventos y su propio modelo de corrutinas
con generadores, porque Python no ofrecía nada equivalente. Cuando el lenguaje
incorporó su propia biblioteca asíncrona y la sintaxis `async`/`await`, Tornado
tuvo que **convivir con la alternativa oficial** y acabó integrándose con ella.

Ese es el patrón que enseña esta ficha, y aparece una y otra vez en el
[Atlas](../README.md): **una biblioteca resuelve una carencia del lenguaje; el
lenguaje la incorpora; la biblioteca pierde su razón de ser**. Es exactamente lo
que le pasó a [jQuery](jquery.md) con el navegador.

## ⚖️ Su lugar hoy

Los frameworks asíncronos posteriores —[Starlette](starlette.md),
[FastAPI](fastapi.md), [Sanic](sanic.md), [Litestar](litestar.md)— se apoyan en
la infraestructura asíncrona del propio lenguaje y en una interfaz común de
servidor. Tornado, con su modelo propio, quedó fuera de ese ecosistema
compartido.

Sigue en producción en muchos sitios, con soporte de correcciones: «mantenimiento»
no es «apagado», y esa distinción es la que importa para quien tiene un sistema
corriendo [@ramalho-fluent-python].

## 🎓 Las dos lecciones

**1. Adelantarse al lenguaje tiene fecha de caducidad.** Cuando la plataforma
incorpora la solución, la biblioteca que la anticipó pierde su motivo.

**2. Quedar fuera de la interfaz común del ecosistema es más costoso que ser
lento.** El aislamiento técnico se paga en integraciones que no existen.

## 🔗 Enlaces

- Documentación oficial: <https://www.tornadoweb.org/en/stable/>
- [Ficha de FastAPI](fastapi.md) · [Ficha de jQuery](jquery.md) — el mismo patrón
- [Ecosistema Python](../ecosistemas/python.md)

## Fuentes

- [@ramalho-fluent-python] Ramalho, Luciano. *Fluent Python*, 2.ª ed. O'Reilly Media, 2021. ISBN 9781492056355 — <https://openlibrary.org/isbn/9781492056355>
