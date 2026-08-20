# 💡 Lit — 2021

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Lit es **la apuesta por la plataforma en lugar de por el framework**. No inventa
un modelo de componentes: usa el que el navegador ya trae —los componentes web—
y añade encima la capa mínima que los hace cómodos de escribir.

Su ficha es la ocasión para hablar de una pregunta que el Atlas plantea una y
otra vez: **¿qué pasa cuando la plataforma absorbe lo que hacían las
bibliotecas?**

> **🎯 Por qué está en este programa**
>
> Porque un componente web **sobrevive al framework que lo creó**
> ([módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)). Es una
> estrategia de salida incorporada al artefacto: el botón que escribas hoy seguirá
> funcionando dentro de React, Vue o Angular dentro de diez años, porque lo que
> entiende es el navegador.

| | |
|---|---|
| **Aparición** | 2021 (sucesor de Polymer, 2013) |
| **Clasificación** | `web-components-library` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `BSD-3-Clause` |
| **Gobierno** | Google |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://lit.dev/docs/> |

---

## 🧱 Qué son los componentes web

Son tres normas del navegador que, juntas, permiten definir elementos propios
[@mdn-web-components]:

| Pieza | Qué aporta |
| --- | --- |
| **Elementos personalizados** | Registrar `<mi-boton>` y darle comportamiento |
| **DOM en la sombra** | Encapsular marcado y estilos: el CSS de fuera no entra |
| **Plantillas** | Marcado inerte, reutilizable, que no se ejecuta hasta usarse |

Existen desde hace más de una década y su adopción ha sido lenta. La razón es
instructiva: **la norma resolvió el encapsulamiento y no resolvió la
reactividad**. Escribir componentes web a pelo exige actualizar el DOM a mano —el
problema que jQuery dejó abierto en 2010.

Lit es exactamente la capa que faltaba [@farrell-web-components]:

```javascript
import { LitElement, html, css } from "lit";

class PanelTareas extends LitElement {
  static styles = css`p { margin: 0 }`;            // encapsulado: no se escapa
  static properties = { tareas: { type: Array } }; // cambiar esto vuelve a pintar

  render() {
    const pendientes = this.tareas.filter((t) => !t.done).length; // derivado
    return html`<p>Pendientes: ${pendientes}</p>`;
  }
}
customElements.define("panel-tareas", PanelTareas);
```

```html
<!-- Y se usa como cualquier etiqueta, desde cualquier framework o sin ninguno -->
<panel-tareas></panel-tareas>
```

## ⚖️ El compromiso

### Se gana

**Independencia de framework.** El mismo componente funciona en React, Vue,
Angular, un sitio estático o una página de WordPress. Para una organización con
varios frontends y un sistema de diseño compartido, eso resuelve un problema
caro y real [@frost-atomic-design].

**Encapsulamiento de estilos de verdad.** El DOM en la sombra impide que el CSS
de la página altere el interior del componente. Ningún framework ofrece eso: lo
ofrece el navegador.

**Longevidad.** Depende de normas del navegador, no de la hoja de ruta de un
proyecto.

### Se paga

**1. El encapsulamiento corta en los dos sentidos.** Los estilos globales
—incluidos los de un sistema de diseño o los de un modo oscuro— no entran solos.
Hay que exponer puntos de personalización explícitos.

**2. La accesibilidad se complica.** Referencias entre elementos —etiqueta y
control, descripción y campo— **no cruzan la frontera del DOM en la sombra** sin
cuidado. Es un problema conocido y una fuente frecuente de componentes que
parecen accesibles y no lo son.

**3. Ecosistema pequeño.** Menos componentes de terceros, menos ejemplos, menos
personas con experiencia que en React o Vue.

## 🧭 Cuándo tiene sentido

**Tiene sentido** para un sistema de diseño que deben consumir varios equipos con
frameworks distintos, para componentes con vida larga que no quieren atarse a una
hoja de ruta ajena, y para incrustar interfaz en páginas que no controlas.

**No tiene sentido** como framework de una aplicación completa: Lit no trae
enrutado, ni gestión de datos, ni renderizado en servidor equivalente al de un
metaframework.

## 🎓 Las tres lecciones

**1. Apostar por la plataforma es una estrategia de salida.** Lo que depende de
una norma del navegador sobrevive a los frameworks. Es exactamente lo que el
módulo 11 busca al preguntar qué quedaría inservible.

**2. Una norma sin ergonomía no se adopta.** Los componentes web existían desde
2013 y no despegaron hasta que Lit añadió la reactividad que faltaba. La lección
vale para cualquier estándar.

**3. El encapsulamiento tiene un coste en accesibilidad.** Aislar el interior
también aísla las relaciones que las tecnologías de asistencia necesitan seguir.
Hay que verificarlo, no suponerlo.

## 🔗 Enlaces

- Documentación oficial: <https://lit.dev/docs/>
- [Ficha de React](react.md) · [Ficha de Vue](vue.md)
- [Módulo 03](../../curriculum/03-frontend-componentes-y-estado.md) · [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@farrell-web-components] Farrell, Ben. *Web Components in Action*. Manning, 2019. ISBN 9781617295775 — <https://openlibrary.org/isbn/9781617295775>
- [@frost-atomic-design] Frost, Brad. *Atomic Design*. Brad Frost, 2016. ISBN 9780998296609 — <https://openlibrary.org/isbn/9780998296609>
- [@mdn-web-components] *Web Components*, Mozilla — <https://developer.mozilla.org/en-US/docs/Web/API/Web_components>
