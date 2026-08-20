# 🎨 Avalonia — 2020

> [⬅️ Atlas](../README.md) · [🟦 Ecosistema .NET](../ecosistemas/dotnet.md) · [🗂️ Índice](../frameworks.md)

Avalonia lleva el modelo de [WPF](wpf.md) fuera de Windows, **dibujando su propia
interfaz** en todas las plataformas. Es la misma decisión estructural que toman
[Flutter](flutter.md) y [Kivy](kivy.md), en otro ecosistema más.

| | |
|---|---|
| **Aparición** | 2020 (versión 0.10 estable; el proyecto es anterior) |
| **Clasificación** | `ui-framework` |
| **Ecosistema** | .NET (C#) |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.avaloniaui.net/> |

---

## 💡 El modelo de WPF, multiplataforma

Marcado declarativo, enlace de datos, modelo-vista-vista-modelo y estilos: quien
conoce WPF reconoce Avalonia de inmediato. La diferencia es que aquí **no depende
del sistema de ventanas de Windows**.

Eso resuelve el techo que la [ficha de WPF](wpf.md) señala como su dimensión de
salida, y lo hace conservando el modelo — lo que convierte la migración en
mecánica y no en conceptual, la distinción que enseña la
[ficha de Laminas](laminas.md).

## ⚖️ El compromiso de dibujar propio

El mismo de siempre, y conviene repetirlo porque no cambia entre ecosistemas:

| | Consecuencia |
| --- | --- |
| Aspecto | Igual en todas partes, y **distinto del sistema** |
| Componentes nuevos del sistema | No aparecen solos |
| **Accesibilidad** | Depende de que el framework la reimplemente y hay que verificarla |
| Tamaño | Mayor: el motor de dibujo va incluido |

La fila de accesibilidad es la que decide en muchos contextos —administración
pública, empresas con requisitos— y es la que menos aparece en las comparativas
[@wcag-quickref].

## 🧭 Frente a .NET MAUI

| | Avalonia | [.NET MAUI](dotnet-maui.md) |
| --- | --- | --- |
| Interfaz | Dibujo propio | Componentes nativos por plataforma |
| Origen | Comunidad, inspirado en WPF | Microsoft, sucesor de Xamarin |
| Destinos | Escritorio, móvil, web | Móvil y escritorio |
| Aspecto | Uniforme | El de cada sistema |

Es la misma disyuntiva que [Flutter](flutter.md) frente a
[React Native](react-native.md), dentro de .NET. Que la elección se repita
idéntica en tres ecosistemas confirma que es estructural.

## 🎓 Las dos lecciones

**1. Conservar el modelo hace mecánica la migración.** Avalonia pudo heredar a los
equipos de WPF porque no les pidió reaprender.

**2. El compromiso multiplataforma se repite en todos los ecosistemas.** Dibujar
propio o usar lo nativo es una elección estructural, no una preferencia.

## 🔗 Enlaces

- Documentación oficial: <https://docs.avaloniaui.net/>
- [Ficha de WPF](wpf.md) · [Ficha de .NET MAUI](dotnet-maui.md) · [Ficha de Flutter](flutter.md)
- [Módulo 09](../../curriculum/09-movil-escritorio-y-offline.md)

## Fuentes

- [@wcag-quickref] *How to Meet WCAG (Quick Reference)*, W3C — <https://www.w3.org/WAI/WCAG22/quickref/>
