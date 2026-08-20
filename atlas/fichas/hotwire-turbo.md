# 🚀 Hotwire Turbo — 2020

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Turbo es la respuesta de Basecamp a la aplicación de página única: **enviar HTML
por el cable** y actualizar solo el fragmento que cambia, sin construir una capa
de estado en el cliente.

| | |
|---|---|
| **Aparición** | 2020 (como sucesor de Turbolinks, 2013) |
| **Clasificación** | `hypermedia-library` |
| **Ecosistema** | JavaScript (agnóstico de servidor) |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://turbo.hotwired.dev/handbook/introduction> |

---

## 💡 Tres piezas

| Pieza | Qué hace |
| --- | --- |
| **Drive** | Intercepta enlaces y formularios: reemplaza el `<body>` sin recargar |
| **Frames** | Marca una región de la página que se actualiza sola |
| **Streams** | El servidor envía fragmentos con instrucciones: *reemplaza*, *añade*, *elimina* |

```html
<turbo-frame id="tarea_42">
  <!-- Solo este bloque se sustituye cuando se envía el formulario de dentro -->
</turbo-frame>
```

Y un Stream, que puede llegar por WebSocket:

```html
<turbo-stream action="append" target="lista-tareas">
  <template><li>Tarea nueva</li></template>
</turbo-stream>
```

Lo importante: **el servidor sigue generando HTML**. No hay JSON, ni modelo de
datos duplicado en el cliente, ni sincronización entre dos representaciones del
mismo estado. Es la tesis de la [ficha de htmx](htmx.md) y la que Gross defiende
en *Hypermedia Systems* [@gross-hypermedia-systems]: el hipermedia ya trae el
mecanismo, y una capa de estado en el cliente es un coste que hay que justificar.

## 🧭 Qué gana y qué cede

**Gana:** una sola fuente de verdad —el servidor—, mucho menos JavaScript que
mantener, y un equipo que no necesita dominar dos modelos de datos. La
[ficha de Rails](rails.md) explica por qué esto encaja tan bien con su cultura:
Turbo nació ahí.

**Cede:** cada interacción necesita el servidor. Sin conexión no hay interacción,
y las interfaces muy interactivas —un editor, un lienzo, arrastrar y soltar
complejo— piden estado local de verdad. Para eso está [Stimulus](stimulus.md), su
compañero: JavaScript pequeño y localizado donde de verdad hace falta.

Esa frontera es la que el
[módulo 03](../../curriculum/03-frontend-componentes-y-estado.md) obliga a dibujar
explícitamente, y la que el
[módulo 09](../../curriculum/09-movil-escritorio-y-offline.md) vuelve a poner
sobre la mesa cuando el requisito es funcionar sin red.

## 🔄 Un patrón que se repite

Turbo (2020), [htmx](htmx.md) (2020), [LiveView](phoenix-liveview.md) (2019) y los
[componentes de servidor de React](react.md) (2023) responden a la misma
observación desde ecosistemas que apenas se hablan: **para muchas aplicaciones, el
cliente con estado completo costó más de lo que dio**.

## 🎓 Las dos lecciones

**1. Enviar HTML elimina la duplicación de estado.** No hay dos copias que
sincronizar porque solo hay una.

**2. La frontera es la latencia y la desconexión.** Donde la interacción tiene que
responder sin servidor, hace falta estado local.

## 🔗 Enlaces

- Documentación oficial: <https://turbo.hotwired.dev/handbook/introduction>
- [Ficha de Stimulus](stimulus.md) · [Ficha de htmx](htmx.md) · [Ficha de Rails](rails.md)
- [Módulo 03](../../curriculum/03-frontend-componentes-y-estado.md)

## Fuentes

- [@gross-hypermedia-systems] Gross, Carson; Stepinski, Adam; Akşimşek, Deniz. *Hypermedia Systems*. Big Sky Software, 2023. ISBN 9798394025952 — <https://openlibrary.org/isbn/9798394025952>
- [@rails-doctrine] *The Rails Doctrine*, David Heinemeier Hansson — <https://rubyonrails.org/doctrine>
