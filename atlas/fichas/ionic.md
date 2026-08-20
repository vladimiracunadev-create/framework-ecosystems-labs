# 💙 Ionic — 2013

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Ionic aporta lo que a [Cordova](cordova.md) le faltaba: **componentes con aspecto
y comportamiento nativos**, construidos con tecnología web. Y desde su versión 4
lo hace con **componentes web estándar**, lo que lo vuelve agnóstico del framework
de interfaz.

| | |
|---|---|
| **Aparición** | 2013 |
| **Clasificación** | `ui-toolkit` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://ionicframework.com/docs> |

---

## 💡 Componentes web como capa de independencia

Ionic reescribió sus componentes como **componentes web** —el estándar del
navegador, ver la [ficha de Lit](lit.md)—. La consecuencia es la que el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) valora: los mismos
componentes funcionan con React, Vue, Angular o sin framework.

Es un movimiento poco común: **desacoplarse del framework de interfaz** en lugar
de atarse a uno. Para un producto con vida larga, eso significa que cambiar de
framework no obliga a cambiar de biblioteca de componentes.

## 🎨 Adaptación por plataforma

Ionic ajusta el aspecto y el comportamiento de sus componentes según el sistema
—transiciones, tipografía, posición de los controles—. No son los componentes del
sistema, y se acercan a ellos.

Con la consecuencia que la [ficha de Flutter](flutter.md) señala: **la
accesibilidad hay que verificarla**, porque no se hereda del sistema como
ocurriría con controles nativos [@wcag-quickref].

## ⚖️ Su lugar

Con [Capacitor](capacitor.md) para el acceso al dispositivo e Ionic para la
interfaz, un equipo web publica en móvil sin aprender dos plataformas nativas.
Es una propuesta coherente, y sigue siendo la web dentro de una aplicación — con
el compromiso que el
[módulo 09](../../curriculum/09-movil-escritorio-y-offline.md) obliga a declarar.

## 🎓 Las dos lecciones

**1. Apoyarse en el estándar desacopla del framework.** Los componentes web
sobreviven a las modas de la capa de arriba.

**2. Parecerse a lo nativo no es heredarlo.** El aspecto se puede imitar; la
accesibilidad hay que implementarla y comprobarla.

## 🔗 Enlaces

- Documentación oficial: <https://ionicframework.com/docs>
- [Ficha de Capacitor](capacitor.md) · [Ficha de Lit](lit.md) · [Ficha de Cordova](cordova.md)
- [Módulo 09](../../curriculum/09-movil-escritorio-y-offline.md)

## Fuentes

- [@wcag-quickref] *How to Meet WCAG (Quick Reference)*, W3C — <https://www.w3.org/WAI/WCAG22/quickref/>
