# ⚡💜 Phoenix LiveView — 2019

> [⬅️ Atlas](../README.md) · [💜 Ecosistema BEAM](../ecosistemas/beam.md) · [🗂️ Índice](../frameworks.md)

LiveView mantiene **el estado de la interfaz en el servidor** y envía por WebSocket
solo las diferencias del HTML. El navegador ejecuta una biblioteca pequeña que
aplica los cambios, y nada más.

Es la alternativa más completa del catálogo a la aplicación de página única, y
**solo es viable sobre la [BEAM](../ecosistemas/beam.md)**.

| | |
|---|---|
| **Aparición** | 2019, creado por Chris McCord |
| **Clasificación** | `realtime-ui-framework` |
| **Ecosistema** | BEAM (Elixir) |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://hexdocs.pm/phoenix_live_view/> |

---

## 💡 Cómo funciona

```
Navegador                          Servidor: UN PROCESO por usuario conectado
    │                                        │
    │──── clic en «completar» ──────────────►│  actualiza su estado
    │                                        │  vuelve a renderizar la plantilla
    │◄─── solo las diferencias del HTML ─────│  y compara con lo anterior
```

**Lo que desaparece:** el modelo de datos duplicado en el cliente, la capa de
serialización, la plantilla en el navegador, la sincronización, y buena parte de
la API que existía solo para alimentar al frontend.

**Lo que aparece:** un proceso con estado por usuario conectado, y una interacción
que cruza la red.

## 🧬 Por qué solo aquí

Mantener una conexión abierta y con estado por usuario es carísimo en la mayoría
de los ecosistemas. En la BEAM, los procesos son ligeros y aislados por diseño
—herencia de su origen en telefonía— y cientos de miles por nodo son viables
[@thomas-programming-elixir], [@mccord-tate-programming-phoenix].

Es el caso más nítido del catálogo de una idea que el
[módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md) insiste en enseñar:
**el runtime no es un detalle de instalación**. Determina qué arquitecturas están
sobre la mesa.

## ⚖️ Los límites, dichos claro

| Encaja | No encaja |
| --- | --- |
| Paneles, formularios, listados, tiempo real | Editores de texto o dibujo: la latencia se nota en cada pulsación |
| Interacción que puede permitirse un viaje de red | Funcionamiento sin conexión, con cola de operaciones |
| Un solo cliente: el navegador | Cuando además hay una aplicación móvil nativa que necesita datos |

Y dos requisitos operativos que no aparecen con un backend sin estado, y que el
[módulo 12](../../curriculum/12-producto-final.md) obliga a declarar: un reinicio
del servidor **no es transparente**, y el reparto de carga necesita afinidad de
conexión.

## 🧭 Tres formas de resolver lo mismo

| | Página única | [htmx](htmx.md) / Turbo | **LiveView** |
| --- | --- | --- | --- |
| Estado | Navegador | Servidor | Servidor |
| Qué viaja | JSON | Fragmentos de HTML | Diferencias de HTML |
| Transporte | Peticiones | Peticiones | WebSocket persistente |
| Requisito | JavaScript en el cliente | Ninguno especial | Conexión con estado barata |

## 🎓 Las dos lecciones

**1. Una propiedad del runtime puede determinar la arquitectura de la interfaz.**
LiveView no es una idea que a otros no se les ocurriera: es una que en otras
plataformas no sale rentable.

**2. Quitar el estado del cliente elimina una clase entera de errores** —la
sincronización— y añade otra: la dependencia de la conexión. Es un intercambio,
no una victoria.

## 🔗 Enlaces

- Documentación oficial: <https://hexdocs.pm/phoenix_live_view/>
- [Ficha de Phoenix](phoenix.md) · [Ficha de htmx](htmx.md) · [Ficha de Jakarta Faces](jakarta-faces.md)
- [Módulo 04](../../curriculum/04-fullstack-y-renderizado.md)

## Fuentes

- [@mccord-tate-programming-phoenix] McCord, Chris; Tate, Bruce; Valim, José. *Programming Phoenix*. Pragmatic Bookshelf, 2016. ISBN 9781680501452 — <https://openlibrary.org/isbn/9781680501452>
- [@thomas-programming-elixir] Thomas, Dave. *Programming Elixir*. Pragmatic Bookshelf, 2014. ISBN 9781937785581 — <https://openlibrary.org/isbn/9781937785581>
