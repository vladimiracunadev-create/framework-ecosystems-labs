# 🅰️📐 Analog — 2022

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Analog es el metaframework de [Angular](angular.md): enrutado por archivos,
renderizado en el servidor, generación estática y rutas de API, sobre
[Vite](vite.md) y [Nitro](nitro.md).

| | |
|---|---|
| **Aparición** | 2022 |
| **Clasificación** | `meta-framework` |
| **Ecosistema** | Angular |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://analogjs.org/docs> |

---

## 📜 El hueco que llena

Angular tenía renderizado en el servidor, y no tenía la **experiencia integrada**
que [Next.js](nextjs.md) o [Nuxt](nuxt.md) llevaban años ofreciendo: enrutado por
archivos, rutas de API en el mismo proyecto, contenido en Markdown, despliegue en
varios destinos con una sola configuración.

Analog trae eso a Angular. Y es significativo que naciera **en la comunidad y no en
Google**: el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) enseña a preguntar
quién sostiene una pieza, y un proyecto comunitario dentro de un ecosistema
corporativo tiene un perfil de riesgo particular — la coordinación con la hoja de
ruta del framework base no está garantizada.

## 💡 Angular moderno debajo

Analog llega en el momento en que Angular se ha modernizado: componentes
independientes sin módulos, señales para el estado, control de flujo en la
plantilla. La [ficha de Angular](angular.md) cuenta esa evolución
[@angular-signals].

Sobre esa base, Analog quita la fricción de configuración que quedaba. Y usa Vite
—no el sistema de compilación tradicional de Angular—, con la ganancia en tiempo
de arranque que la [ficha de Vite](vite.md) documenta [@vite-why].

## 🔄 La pieza compartida

Igual que [Nuxt](nuxt.md) y [SolidStart](solidstart.md), Analog despliega gracias a
Nitro. **La capa de despliegue se ha vuelto infraestructura común entre
ecosistemas rivales**, que es una convergencia notable: los frameworks compiten en
la capa de arriba y comparten la de abajo.

## 🎓 Las dos lecciones

**1. Un ecosistema maduro acaba pidiendo su metaframework.** El conjunto de piezas
—enrutado, datos, despliegue— es el mismo en todos.

**2. Quién mantiene una pieza importa tanto como lo que hace.** Un proyecto
comunitario sobre un framework corporativo tiene un riesgo de coordinación real.

## 🔗 Enlaces

- Documentación oficial: <https://analogjs.org/docs>
- [Ficha de Angular](angular.md) · [Ficha de Nitro](nitro.md) · [Ficha de Vite](vite.md)
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@angular-signals] *Angular Signals*, Angular — <https://angular.dev/guide/signals>
- [@vite-why] *Why Vite*, Vite — <https://vite.dev/guide/why>
