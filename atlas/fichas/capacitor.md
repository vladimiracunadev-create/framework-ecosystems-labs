# ⚡📱 Capacitor — 2019

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Capacitor es el sucesor de [Cordova](cordova.md), con una diferencia de enfoque
importante: **los proyectos nativos se tratan como código propio del repositorio**,
no como algo que la herramienta genera y regenera.

| | |
|---|---|
| **Aparición** | 2019, creado por el equipo de Ionic |
| **Clasificación** | `runtime-bridge` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://capacitorjs.com/docs> |

---

## 💡 Los proyectos nativos, versionados

En Cordova, las carpetas de iOS y Android eran artefactos generados: modificarlas
a mano era frágil porque una regeneración las sobrescribía.

Capacitor las trata como **parte del repositorio**. Se pueden abrir en las
herramientas nativas, modificar y versionar. La consecuencia práctica: cuando
hace falta código nativo específico, **no se lucha contra la herramienta**.

Es la diferencia entre una abstracción que **oculta** y una que **envuelve**. La
segunda deja una salida hacia abajo, que es la propiedad que la
[ficha de SQLAlchemy](sqlalchemy.md) destaca en el mundo de los ORM: sin salida
hacia abajo, el día que se complica el caso se abandona la herramienta.

## ⚖️ Sigue siendo una web dentro de una aplicación

El compromiso de fondo es el de Cordova: la interfaz es una página web. Con
motores modernos y componentes cuidados —[Ionic](ionic.md)— la distancia se ha
reducido mucho, y sigue existiendo.

La decisión del [módulo 09](../../curriculum/09-movil-escritorio-y-offline.md) no
cambia: **qué capacidad del dispositivo necesitas, con qué frecuencia actualizas y
cuántas plataformas mantienes**.

## 🎓 Las dos lecciones

**1. Una abstracción con salida hacia abajo aguanta los casos difíciles.** La que
oculta se abandona cuando aparece el primero.

**2. Tratar el código generado como código propio elimina una clase de fricción.**
Es una decisión de herramientas con efecto diario.

## 🔗 Enlaces

- Documentación oficial: <https://capacitorjs.com/docs>
- [Ficha de Cordova](cordova.md) · [Ficha de Ionic](ionic.md)
- [Módulo 09](../../curriculum/09-movil-escritorio-y-offline.md)

## Fuentes

- [@ater-pwa] Ater, Tal. *Building Progressive Web Apps*. O'Reilly Media, 2017. ISBN 9781491961650 — <https://openlibrary.org/isbn/9781491961650>
