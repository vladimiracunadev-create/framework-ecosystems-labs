# ✨ Stimulus — 2018

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Stimulus es deliberadamente pequeño. Su propuesta: **el HTML ya existe y lo genera
el servidor; JavaScript solo lo anima**. Es el complemento de
[Turbo](hotwire-turbo.md) y el opuesto exacto de un framework que construye la
página desde datos.

| | |
|---|---|
| **Aparición** | 2018, creado por Basecamp |
| **Clasificación** | `ui-library` |
| **Ecosistema** | JavaScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://stimulus.hotwired.dev/handbook/introduction> |

---

## 💡 El HTML dice qué hace

```html
<div data-controller="contador" data-contador-maximo-value="10">
  <button data-action="click->contador#incrementar">+1</button>
  <span data-contador-target="salida">0</span>
</div>
```

```javascript
export default class extends Controller {
  static targets = ["salida"];
  static values = { maximo: Number };

  incrementar() {
    this.salidaTarget.textContent = Math.min(+this.salidaTarget.textContent + 1, this.maximoValue);
  }
}
```

Lo notable es **dónde vive la información**: leyendo el HTML sabes qué
comportamiento tiene ese bloque, qué elementos usa y con qué parámetros. No hay
que buscar en un archivo aparte qué se enganchó a ese `div`.

Es la misma idea que la [ficha de Alpine.js](alpinejs.md) desarrolla —comportamiento
declarado junto al marcado— con una diferencia: Stimulus saca la lógica a una
clase, así que el HTML declara **qué** y el JavaScript define **cómo**.

## 🧭 Lo que no hace, a propósito

No renderiza. No mantiene un estado global. No hay DOM virtual ni reactividad. Si
el contenido cambia, lo genera el servidor y Turbo lo sustituye.

Esa renuncia es la que hace que **funcione con lo que el servidor ya genera**: se
puede añadir a una aplicación existente sin reescribir nada, que es exactamente la
propiedad que el [módulo 10](../../curriculum/10-modernizacion-y-migracion.md) busca en
una estrategia de modernización incremental.

Y marca su límite: una interfaz con estado compartido entre muchas regiones, o con
mucha lógica en el cliente, no encaja. Ahí el
[módulo 03](../../curriculum/03-frontend-componentes-y-estado.md) pide un framework con
modelo de estado propio.

## 🎓 Las dos lecciones

**1. Un comportamiento declarado en el HTML se encuentra leyendo el HTML.** Menos
indirección es menos carga cognitiva [@sweller-cognitive-load-theory].

**2. Una biblioteca que no renderiza se puede añadir a lo que ya existe.** Es la
condición para modernizar sin reescribir.

## 🔗 Enlaces

- Documentación oficial: <https://stimulus.hotwired.dev/handbook/introduction>
- [Ficha de Turbo](hotwire-turbo.md) · [Ficha de Alpine.js](alpinejs.md)
- [Módulo 10](../../curriculum/10-modernizacion-y-migracion.md)

## Fuentes

- [@sweller-cognitive-load-theory] Sweller, John; Ayres, Paul; Kalyuga, Slava. *Cognitive Load Theory*. Springer, 2011. ISBN 9781441981257 — <https://openlibrary.org/isbn/9781441981257>
