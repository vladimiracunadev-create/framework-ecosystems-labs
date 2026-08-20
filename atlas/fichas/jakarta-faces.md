# 📜 Jakarta Faces (JSF) — 2004

> [⬅️ Atlas](../README.md) · [☕ Ecosistema JVM](../ecosistemas/jvm.md) · [🗂️ Índice](../frameworks.md)

Jakarta Faces está en el Atlas por un motivo de **gobierno**, no de API: es una
**especificación con varias implementaciones**, no un proyecto único. Ese modelo
casi no existe fuera de la JVM y cambia por completo el análisis del
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md).

| | |
|---|---|
| **Aparición** | 2004 (como JavaServer Faces) |
| **Clasificación** | `component-framework` — componentes con estado en servidor |
| **Ecosistema** | JVM (Java) |
| **Licencia** | `EPL-2.0` |
| **Gobierno** | Eclipse Foundation, por proceso de especificación |
| **Estado** | 🟡 Mantenimiento |
| **Documentación** | <https://jakarta.ee/specifications/faces/> |

---

## 🏛️ Especificación frente a proyecto

| | Proyecto único (Spring Boot) | Especificación (Faces) |
| --- | --- | --- |
| Quién decide | El proyecto y su patrocinador | Un comité con varias partes |
| Ritmo | Rápido | Lento |
| Cambiar de proveedor | Reescribir | **Cambiar la implementación** |
| Riesgo | Dependencia de un patrocinador | Estancamiento, diseño por comité |

Esa tercera fila es el argumento entero. Si tu implementación deja de mantenerse,
**cambias de implementación y el código sigue funcionando**. En un producto con
horizonte de veinte años —banca, administración— eso vale más que cualquier
comodidad de API.

Ninguna columna es mejor: la pregunta del módulo 11 es **cuál de los dos riesgos
puedes asumir** y durante cuántos años.

## 💡 Componentes con estado en servidor

Faces mantiene el árbol de componentes y su estado **en el servidor**, y la
página se reconstruye entre peticiones. Es el mismo modelo que
[ASP.NET Web Forms](aspnet-webforms.md), y con los mismos costes: el estado hay
que guardarlo o transportarlo, y el ciclo de vida de la petición tiene muchas
fases que hay que conocer para diagnosticar.

Y es también el mismo modelo que hoy reaparece —con el estado explícito y una
conexión persistente— en [Phoenix LiveView](phoenix-liveview.md) y en Blazor. La
idea no era mala; el mecanismo de 2004 sí tenía un coste que el de 2019 no tiene.

## ⚖️ Por qué está en mantenimiento

El ritmo de las especificaciones no compite con el de los proyectos. Mientras
Faces avanzaba por comité, el resto del campo se movió al modelo de aplicación de
página única y después a los enfoques híbridos.

Sigue en producción en muchísimos sitios, y esa realidad es exactamente el
terreno del [módulo 10](../../curriculum/10-modernizacion-y-migracion.md):
«mantenimiento» no significa «apagado».

## 🎓 Las tres lecciones

**1. El modelo de gobierno es una dimensión de la decisión.** Especificación o
proyecto no es un detalle: determina qué pasa si tu proveedor desaparece.

**2. Lo que protege de la dependencia también frena la evolución.** El comité que
garantiza portabilidad es el que impide moverse rápido.

**3. Los componentes con estado en servidor volvieron.** Faces, Web Forms,
LiveView y Blazor son la misma familia, separada por veinte años y por el coste
del transporte.

## 🔗 Enlaces

- Documentación oficial: <https://jakarta.ee/specifications/faces/>
- [Ficha de ASP.NET Web Forms](aspnet-webforms.md) · [Ficha de Phoenix LiveView](phoenix-liveview.md)
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@bass-software-architecture-practice] Bass, Len; Clements, Paul; Kazman, Rick. *Software Architecture in Practice*, 4.ª ed. Pearson Education, 2021. ISBN 9780136886099 — <https://openlibrary.org/isbn/9780136886099>
