# 📗 VitePress — 2020

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

VitePress es el generador de documentación del ecosistema Vue: Markdown entrando,
sitio estático saliendo, con [Vite](vite.md) por debajo. Su tesis es la contraria
a la de [Docusaurus](docusaurus.md): **cuanto menos framework, mejor**.

| | |
|---|---|
| **Aparición** | 2020 |
| **Clasificación** | `static-site-generator` |
| **Ecosistema** | Vue |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://vitepress.dev/> |

---

## 💡 HTML estático con hidratación mínima

VitePress genera HTML en la compilación y envía al navegador solo el JavaScript
necesario para la navegación y los componentes interactivos que hayas puesto.

Es el mismo razonamiento que la [ficha de Astro](astro.md) desarrolla: **la
documentación es texto**, y el texto no necesita un framework de interfaz vivo
para leerse. La consecuencia es un sitio que carga rápido incluso en conexiones
malas y en teléfonos modestos, que es lo que el
[módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md) mide con las
métricas de experiencia [@webdev-vitals].

Y como es Vue, un bloque de Markdown puede incluir un componente cuando el
contenido lo pide — una demostración interactiva, una calculadora, un ejemplo
manipulable.

## ⚖️ Cuándo elegir cuál

| | VitePress | Docusaurus |
| --- | --- | --- |
| **Framework** | Vue | React |
| **Peso** | Mínimo | Sitio React completo |
| **Versionado** | Manual | Integrado |
| **Traducción** | Básica | Integrada |

Si necesitas versiones y traducción, Docusaurus las trae. Si necesitas un sitio de
documentación rápido y ligero, VitePress hace menos y lo hace con menos.

## 🎓 Las dos lecciones

**1. Para contenido, menos JavaScript es mejor producto.** La velocidad percibida
es una característica, no un detalle.

**2. Elegir generador es elegir qué problemas quieres tener resueltos.** Ninguno
gana en abstracto.

## 🔗 Enlaces

- Documentación oficial: <https://vitepress.dev/>
- [Ficha de Docusaurus](docusaurus.md) · [Ficha de Astro](astro.md) · [Ficha de Vite](vite.md)
- [Módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md)

## Fuentes

- [@webdev-vitals] *Web Vitals*, Google — web.dev — <https://web.dev/articles/vitals>
