# 🦴 Backbone.js — 2010

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Backbone es la primera estructura ampliamente adoptada para **separar el modelo
de la vista en el navegador**. Hoy casi nadie lo elige, y sin embargo su ficha es
de las más útiles del Atlas: es donde el problema que resolverían React, Vue y
Angular queda **enunciado por primera vez con claridad**.

> **🎯 Por qué está en este programa**
>
> Porque enseña el problema **antes** de que existiera la solución que hoy damos
> por hecha. Leer Backbone es ver a alguien describir con precisión el dolor —la
> vista y los datos se desincronizan— y proponer la primera respuesta razonable:
> **eventos**. Es el paso intermedio entre jQuery y `vista = f(estado)`, y sin él
> el [módulo 03](../../curriculum/03-frontend-componentes-y-estado.md) cuenta una
> historia con un salto.

| | |
|---|---|
| **Aparición** | 2010, creado por Jeremy Ashkenas |
| **Clasificación** | `mv-library` — biblioteca, no framework |
| **Ecosistema** | JavaScript |
| **Licencia** | `MIT` |
| **Estado** | 🟡 Mantenimiento |
| **Documentación** | <https://backbonejs.org/> |

---

## 📜 El problema que enunció

Con jQuery, el estado de la aplicación vivía **dentro del documento**: el número
que se mostraba en pantalla *era* el estado. Funcionaba hasta que ese mismo dato
aparecía en dos sitios.

Backbone lo dijo sin rodeos en su propia documentación: cuando la aplicación
guarda los datos en el DOM, no hay una fuente de verdad y la sincronización acaba
siendo trabajo manual repartido por todo el código
[@backbone-why].

Su propuesta tenía tres piezas:

```javascript
// 1. El modelo es el dueño del dato, y avisa cuando cambia
const Tarea = Backbone.Model.extend({ defaults: { title: "", done: false } });

// 2. La colección agrupa modelos y también avisa
const Tareas = Backbone.Collection.extend({ model: Tarea, url: "/tasks" });

// 3. La vista ESCUCHA al modelo y se vuelve a pintar cuando toca
const VistaTarea = Backbone.View.extend({
  initialize() { this.listenTo(this.model, "change", this.render); },
  render() { this.$el.html(this.model.get("title")); return this; },
});
```

La idea central —**el dato avisa, la vista reacciona**— es la que sigue viva en
todo lo que vino después. Cambió el mecanismo, no el principio.

## ⚖️ Por qué no bastó

Backbone resolvió *de dónde sale el dato* y dejó abierto *cómo se pinta*. El
`render` seguía siendo trabajo manual, y ahí aparecían dos problemas que hoy
suenan familiares [@osmani-backbone]:

**1. Volver a pintar entero era caro; pintar solo lo que cambió era propenso a
error.** No había una capa que calculara la diferencia, así que cada equipo
escribía la suya, con sus propios fallos.

**2. La vista se suscribía al modelo, y había que acordarse de desuscribirse.**
Una vista destruida que seguía escuchando era una fuga de memoria y una fuente de
errores fantasma. `listenTo` existía precisamente para mitigarlo, lo que dice
mucho de la frecuencia del problema.

React llegó tres años después con una respuesta que eliminaba las dos: **no te
suscribas y no pintes a mano — describe la interfaz entera y yo calculo el
cambio**. La suscripción explícita desaparecía, y con ella su clase de errores.

## 🧬 Lo que sobrevivió

| Idea de Backbone | Dónde está hoy |
| --- | --- |
| El modelo es la fuente de verdad, no el DOM | Todo el frontend moderno |
| El dato notifica sus cambios | Señales en Vue, Solid, Svelte, Angular |
| Colección con sincronización remota | Bibliotecas de caché de datos de servidor |
| Enrutado en el cliente | Enrutadores de todos los frameworks |
| Separar responsabilidades en el navegador | El concepto entero de componente |

Backbone «murió» del mismo modo que jQuery: **su diagnóstico era correcto y otros
lo resolvieron mejor**. Eso no lo convierte en un error histórico; lo convierte en
el primer paso de una escalera.

## 🎓 Las tres lecciones

**1. Enunciar bien un problema ya es media solución.** Backbone no acertó con la
respuesta definitiva, pero fue quien puso el dedo en la llaga: el DOM no puede ser
tu base de datos.

**2. Las suscripciones manuales se olvidan.** Cualquier API que te obligue a
liberar recursos a mano generará fugas. Los modelos posteriores ganaron sobre
todo por **eliminar la obligación**, no por ser más rápidos.

**3. Una biblioteca puede ser influyente y quedar obsoleta a la vez.** Confundir
esas dos cosas lleva a descartar la historia del campo, que es justo lo que este
Atlas intenta evitar.

## 🔗 Enlaces

- Documentación oficial: <https://backbonejs.org/>
- [Ficha de jQuery](jquery.md) — de dónde venía · [Ficha de React](react.md) — hacia dónde fue
- [Módulo 03](../../curriculum/03-frontend-componentes-y-estado.md) — estado derivado y fuente de verdad

## Fuentes

- [@osmani-backbone] Osmani, Addy. *Developing Backbone.js Applications*. O'Reilly Media, 2012. ISBN 9781449328252 — <https://openlibrary.org/isbn/9781449328252>
- [@backbone-why] *Why Backbone?*, Backbone.js — <https://backbonejs.org/#FAQ-why-backbone>
