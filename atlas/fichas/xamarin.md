# 📲 Xamarin — 2011

> [⬅️ Atlas](../README.md) · [🟦 Ecosistema .NET](../ecosistemas/dotnet.md) · [🗂️ Índice](../frameworks.md)

Xamarin permitió escribir aplicaciones móviles **nativas en C#**, compartiendo la
lógica entre iOS y Android. Su relevo por [.NET MAUI](dotnet-maui.md) es una
migración reciente y bien documentada, y por eso está en el Atlas.

| | |
|---|---|
| **Aparición** | 2011 (continuación de Mono para móvil) |
| **Clasificación** | `ui-framework` |
| **Ecosistema** | .NET (C#) |
| **Licencia** | `MIT` |
| **Estado** | ⚪ Histórico — continuado como .NET MAUI |
| **Documentación** | <https://learn.microsoft.com/xamarin/> |

---

## 💡 Dos niveles de compartición

Xamarin ofrecía dos formas de trabajar, y la distinción sigue siendo válida hoy
en cualquier tecnología multiplataforma:

| | Qué se comparte | Cuándo encaja |
| --- | --- | --- |
| **Xamarin nativo** | Solo la lógica; la interfaz se escribe por plataforma | Cuando la interfaz debe ser específica |
| **Xamarin.Forms** | También la interfaz, con abstracciones comunes | Cuando la interfaz es estándar |

Esa tabla es el reparto por capas que la
[ficha de Compose Multiplatform](compose-multiplatform.md) describe, y su lección
central se repite: **compartir el dominio es la parte barata y de mayor retorno**,
y no necesita ningún framework multiplataforma — solo separarlo, como pide el
[módulo 02](../../curriculum/02-arquitectura-de-frameworks.md).

## 🔄 La transición a MAUI

Microsoft anunció el fin de soporte con antelación y publicó guía de migración.
La continuidad fue alta: MAUI es la evolución de Xamarin.Forms con un solo
proyecto en lugar de varios.

Comparado con los otros grandes casos del catálogo:

| | Aviso | Compatibilidad | Herramienta |
| --- | --- | --- | --- |
| [AngularJS](angularjs.md) → Angular | Años | **Ninguna** | Puente de convivencia |
| [Zend](zend-framework.md) → Laminas | Sí | Alta | Reescritura automática |
| **Xamarin → MAUI** | Sí, con fecha | Media-alta | Guía y asistente |

La conclusión del [módulo 10](../../curriculum/10-modernizacion-y-migracion.md) es
la misma en los tres: **el aviso con fecha y la herramienta son lo que determina
si una migración se hace o se pospone**.

## 🎓 Las dos lecciones

**1. Compartir lógica y compartir interfaz son decisiones separadas.** La primera
casi siempre compensa; la segunda depende del producto.

**2. Un fin de vida anunciado con fecha y herramienta es un final digno.** Lo
contrario —silencio y abandono— es lo que hay que temer al evaluar un proyecto.

## 🔗 Enlaces

- Documentación oficial: <https://learn.microsoft.com/xamarin/>
- [Ficha de .NET MAUI](dotnet-maui.md) — su continuación · [Ficha de Compose Multiplatform](compose-multiplatform.md)
- [Módulo 10](../../curriculum/10-modernizacion-y-migracion.md)

## Fuentes

- [@endoflife-date] *endoflife.date — Release and support calendars* — <https://endoflife.date/>
