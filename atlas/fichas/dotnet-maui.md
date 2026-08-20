# 🧵🟦 .NET MAUI — 2022

> [⬅️ Atlas](../README.md) · [🟦 Ecosistema .NET](../ecosistemas/dotnet.md) · [🗂️ Índice](../frameworks.md)

.NET MAUI es el sucesor de Xamarin.Forms: **un solo proyecto** para móvil y
escritorio, con **componentes nativos de cada plataforma** en lugar de dibujo
propio.

| | |
|---|---|
| **Aparición** | 2022 |
| **Clasificación** | `ui-framework` |
| **Ecosistema** | .NET (C#) |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://learn.microsoft.com/dotnet/maui/> |

---

## 💡 Un proyecto, controles nativos

La diferencia visible con [Xamarin](xamarin.md) es estructural: un único proyecto
con carpetas por plataforma, en lugar de un proyecto por destino más uno
compartido. Reduce fricción de configuración, que era la queja más repetida.

Y la decisión de fondo es la que importa: MAUI **traduce sus controles a los
nativos de cada sistema**. Un botón es un botón del sistema.

| | Consecuencia |
| --- | --- |
| Aspecto | El de cada plataforma, no uniforme |
| **Accesibilidad** | **Se hereda del sistema** |
| Componentes nuevos del sistema | Aparecen al actualizar |
| Diferencias entre plataformas | Hay que tratarlas |

La segunda fila es la ventaja decisiva frente a [Avalonia](avalonia.md) o
[Flutter](flutter.md): cuando la interfaz es nativa, **el lector de pantalla la
entiende sin que nadie reimplemente nada** [@wcag-quickref].

## ⚖️ Lo que hay que declarar

**1. Es reciente.** Menos recorrido que Flutter o React Native en móvil, y menos
ecosistema de componentes de terceros. El
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) lo puntúa como
madurez demostrada.

**2. Las diferencias de plataforma no desaparecen.** «Un proyecto» no significa
«un comportamiento»: sigue habiendo dos sistemas con reglas distintas, y hay que
probar en ambos.

**3. La razón principal para elegirlo es el equipo.** Si la organización ya es
.NET y quiere reutilizar dominio y personas, MAUI compite bien. Si no, Flutter y
React Native tienen más ecosistema.

## 🎓 Las dos lecciones

**1. Usar controles nativos hereda la accesibilidad del sistema.** Es la ventaja
que más pesa y la que menos aparece en las comparativas.

**2. La continuidad de equipo y de lenguaje es un criterio legítimo.** El módulo
11 lo llama capacidades del equipo, y en multiplataforma suele decidir.

## 🔗 Enlaces

- Documentación oficial: <https://learn.microsoft.com/dotnet/maui/>
- [Ficha de Xamarin](xamarin.md) · [Ficha de Avalonia](avalonia.md) · [Ficha de React Native](react-native.md)
- [Módulo 09](../../curriculum/09-movil-escritorio-y-offline.md)

## Fuentes

- [@wcag-quickref] *How to Meet WCAG (Quick Reference)*, W3C — <https://www.w3.org/WAI/WCAG22/quickref/>
