# 🔀 ASP.NET MVC — 2009

> [⬅️ Atlas](../README.md) · [🟦 Ecosistema .NET](../ecosistemas/dotnet.md) · [🗂️ Índice](../frameworks.md)

ASP.NET MVC fue **la corrección explícita de [Web Forms](aspnet-webforms.md)**:
rutas, verbos, vistas sin estado y control del marcado generado. Microsoft
adoptó el patrón que el resto del campo ya usaba, y publicó buena parte del
código bajo licencia abierta.

| | |
|---|---|
| **Aparición** | 2009 |
| **Clasificación** | `web-framework` |
| **Ecosistema** | .NET Framework (C#) |
| **Licencia** | `Apache-2.0` |
| **Estado** | ⚪ Histórico — continuado en [ASP.NET Core](aspnet-core.md) |
| **Documentación** | <https://learn.microsoft.com/aspnet/mvc/> |

---

## 📜 Qué corrigió, punto por punto

| Problema de Web Forms | Corrección en MVC |
| --- | --- |
| El estado de vista viajaba en cada envío | **Sin estado**: cada petición se basta a sí misma |
| Casi todo era `POST` | Verbos HTTP con su semántica |
| La URL no representaba el estado | Rutas explícitas y enlazables |
| El marcado lo generaba el control | La vista controla el HTML |
| Ciclo de vida de página con muchas fases | Petición → controlador → vista |
| Difícil de probar | Controladores probables sin servidor |

La última fila es la que más importa para el
[módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md): **un
controlador que recibe sus dependencias se puede probar sin levantar nada**, y en
Web Forms eso era prácticamente imposible.

## 🧭 Un paso intermedio necesario

MVC no fue el destino: fue el puente. Siguió atado a Windows y al .NET Framework,
y [ASP.NET Core](aspnet-core.md) lo reemplazó siete años después con una
reescritura multiplataforma.

Pero el paso intermedio importó: **cambió el modelo mental de una comunidad
entera** antes de cambiar la plataforma. Migrar de Web Forms a MVC y después a
Core resultó mucho más viable que saltar directamente, y esa es una lección de
secuenciación del [módulo 10](../../curriculum/10-modernizacion-y-migracion.md).

## 🎓 Las dos lecciones

**1. Un paso intermedio puede ser lo que hace posible el salto grande.** Cambiar
primero el modelo mental y después la plataforma reduce el riesgo de ambas cosas.

**2. Adoptar el patrón del resto del campo no es rendirse.** Es reconocer que la
convergencia trae ecosistema, ejemplos y personas formadas.

## 🔗 Enlaces

- Documentación oficial: <https://learn.microsoft.com/aspnet/mvc/>
- [Ficha de ASP.NET Web Forms](aspnet-webforms.md) · [Ficha de ASP.NET Core](aspnet-core.md)
- [Módulo 10](../../curriculum/10-modernizacion-y-migracion.md)

## Fuentes

- [@freeman-pro-aspnet-core] Freeman, Adam. *Pro ASP.NET Core 7*. Manning Publications, 2023. ISBN 9781633437821 — <https://openlibrary.org/isbn/9781633437821>
