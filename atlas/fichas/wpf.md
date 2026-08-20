# 🪟 WPF — 2006

> [⬅️ Atlas](../README.md) · [🟦 Ecosistema .NET](../ecosistemas/dotnet.md) · [🗂️ Índice](../frameworks.md)

WPF introdujo el **enlace de datos declarativo** y popularizó el patrón
modelo-vista-vista-modelo, dos ideas que después migraron a la web y hoy están en
todas partes bajo otros nombres.

| | |
|---|---|
| **Aparición** | 2006, con .NET Framework 3.0 |
| **Clasificación** | `ui-framework` — escritorio |
| **Ecosistema** | .NET (C#), Windows |
| **Licencia** | `MIT` (desde su apertura) |
| **Estado** | 🟡 Mantenimiento |
| **Documentación** | <https://learn.microsoft.com/dotnet/desktop/wpf/> |

---

## 💡 El enlace declarativo, antes que en la web

```xml
<!-- La vista declara de qué dato depende. Nadie escribe "actualiza la etiqueta". -->
<TextBlock Text="{Binding Pendientes}" />
<Button Content="Completar" IsEnabled="{Binding PuedeCompletar}" />
```

En 2006 eso era nuevo. Es exactamente lo que [Knockout](knockout.md) llevaría al
navegador en 2010 —de hecho, su autor venía del mundo .NET— y lo que
[AngularJS](angularjs.md) popularizaría después.

El patrón que lo acompaña, **modelo-vista-vista-modelo**, separa la vista de un
objeto que expone el estado ya preparado para mostrarse. Es la misma idea que el
[módulo 03](../../curriculum/03-frontend-componentes-y-estado.md) llama estado
derivado: **calculado, no guardado dos veces**.

## 🧬 El camino de la idea

```
WPF (2006) ──► Knockout (2010) ──► AngularJS (2010) ──► Vue (2014) ──► señales (2023)
```

Esa cadena es una de las más nítidas del [Atlas](../README.md), y va **del
escritorio a la web**, no al revés. Quien crea que el enlace declarativo nació con
los frameworks de JavaScript se pierde de dónde venía.

## ⚖️ Su estado hoy

WPF sigue mantenido y atado a Windows. Para escritorio multiplataforma en .NET,
[Avalonia](avalonia.md) recoge su modelo fuera de Windows y
[.NET MAUI](dotnet-maui.md) cubre móvil y escritorio.

Sigue habiendo muchísimo software empresarial en WPF, con el mismo estatus que
[Web Forms](aspnet-webforms.md): «mantenimiento» significa que no se elige para
empezar, no que esté apagado — el terreno del
[módulo 10](../../curriculum/10-modernizacion-y-migracion.md).

## 🎓 Las dos lecciones

**1. Las ideas de interfaz viajan del escritorio a la web y de vuelta.** El
enlace declarativo es un ejemplo con fechas.

**2. Un framework atado a un sistema operativo tiene techo.** Es una dimensión de
la estrategia de salida del
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md), no un defecto.

## 🔗 Enlaces

- Documentación oficial: <https://learn.microsoft.com/dotnet/desktop/wpf/>
- [Ficha de Avalonia](avalonia.md) · [Ficha de Knockout](knockout.md) · [Ficha de Blazor](blazor.md)
- [Módulo 03](../../curriculum/03-frontend-componentes-y-estado.md)

## Fuentes

- [@tidwell-designing-interfaces] Tidwell, Jenifer. *Designing Interfaces: Patterns for Effective Interaction Design*. O'Reilly Media, 2005. ISBN 9780596008031 — <https://openlibrary.org/isbn/9780596008031>
