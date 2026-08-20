# 🐝 Beego — 2012

> [⬅️ Atlas](../README.md) · [🐹 Ecosistema Go](../ecosistemas/go.md) · [🗂️ Índice](../frameworks.md)

Beego es el framework **más atípico del ecosistema Go**: completo, con ORM,
caché, tareas programadas y generación de andamiaje, en una comunidad que suele
preferir bibliotecas pequeñas y composición explícita.

| | |
|---|---|
| **Aparición** | 2012 |
| **Clasificación** | `full-stack-framework` |
| **Ecosistema** | Go |
| **Licencia** | `Apache-2.0` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://beego.me/docs/intro/> |

---

## 🧭 Ir contra la cultura del ecosistema

Go tiene una cultura explícita contra la magia: sin reflexión innecesaria, sin
contenedores de dependencias, sin convenciones ocultas. Beego trae precisamente
lo contrario —convenciones, ORM, generadores— y por eso su recepción fue tibia
pese a ser técnicamente sólido.

Es una observación útil para el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md): **la cultura de un
ecosistema es una dimensión real de adopción**. Un framework que va contra las
expectativas de su comunidad encuentra menos ayuda, menos ejemplos y menos
integraciones, aunque su diseño sea bueno.

## 💡 Lo que ofrece

Enrutado con anotaciones en comentarios, ORM propio, caché, sesiones, tareas
programadas y una herramienta de generación de código. Para quien viene de
[Rails](rails.md), [Django](django.md) o [Laravel](laravel.md), el paquete es
reconocible.

Y con el mismo compromiso del
[módulo 02](../../curriculum/02-arquitectura-de-frameworks.md): velocidad inicial
a cambio de comportamiento implícito, en un lenguaje donde lo implícito es
culturalmente sospechoso.

## 🎓 Las dos lecciones

**1. La cultura del ecosistema condiciona la adopción tanto como el diseño.** El
módulo 11 lo puntúa como capacidades y expectativas del equipo.

**2. «Todo incluido» significa cosas distintas según el lenguaje.** En PHP o
Python es lo esperado; en Go es una elección que hay que justificar.

## 🔗 Enlaces

- Documentación oficial: <https://beego.me/docs/intro/>
- [Ficha de Gin](gin.md) · [Ficha de chi](chi.md) — la corriente principal del ecosistema
- [Ecosistema Go](../ecosistemas/go.md)

## Fuentes

- [@donovan-kernighan-go] Donovan, Alan A. A.; Kernighan, Brian W. *The Go Programming Language*. Addison-Wesley, 2016. ISBN 9780134190440 — <https://openlibrary.org/isbn/9780134190440>
