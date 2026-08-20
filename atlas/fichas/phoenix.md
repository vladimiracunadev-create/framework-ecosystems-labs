# 🔥 Phoenix — 2014

> [⬅️ Atlas](../README.md) · [💜 Ecosistema BEAM](../ecosistemas/beam.md) · [🗂️ Índice](../frameworks.md)

Phoenix parece, en la superficie, un framework web convencional: enrutado,
controladores, vistas, contextos, ORM. Su diferencia no está en la API sino
debajo: **la concurrencia y la tolerancia a fallos las pone la máquina virtual**,
no el framework.

Esa es la razón de su ficha. Phoenix es el argumento más fuerte del Atlas a favor
de una idea que el [módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md)
insiste en enseñar el primer día: **el runtime no es un detalle de instalación**.

> **🎯 Por qué está en este programa**
>
> **Porque LiveView solo es viable sobre esta plataforma.** Mantener una conexión
> abierta y con estado por cada usuario es carísimo en casi todos los ecosistemas
> y barato en la BEAM. El resultado es que **una propiedad del runtime terminó
> determinando la arquitectura de la interfaz** — el ejemplo más limpio del
> catálogo de esa relación.

| | |
|---|---|
| **Aparición** | 2014, creado por Chris McCord |
| **Clasificación** | `full-stack-framework` |
| **Ecosistema** | BEAM (Elixir) |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://hexdocs.pm/phoenix/overview.html> |

---

## 🧬 De dónde viene la plataforma

Elixir se ejecuta sobre la BEAM, la máquina virtual creada por Ericsson en los
años ochenta para centralitas telefónicas. Ese origen no es anecdótico: fija
todas las propiedades que Phoenix hereda [@thomas-programming-elixir].

| Propiedad de la BEAM | De dónde viene | Qué permite en Phoenix |
| --- | --- | --- |
| **Procesos ligeros** aislados, cientos de miles por nodo | Cada llamada telefónica era un proceso | Una conexión por usuario deja de ser un problema de arquitectura |
| **Aislamiento total de memoria** entre procesos | Un fallo no podía tumbar la centralita | Una petición que falla no arrastra a las demás |
| **Árboles de supervisión** | Reiniciar la parte rota, no el sistema | Recuperación como primitiva, no como capa añadida |
| **Paso de mensajes**, sin memoria compartida | Concurrencia sin cerrojos | Desaparece una clase entera de errores de concurrencia |
| **Distribución entre nodos** integrada | Centralitas en red | Difusión entre servidores sin infraestructura extra |

La cultura que produce es distinta: en lugar de intentar evitar todo fallo, se
**deja fallar** el proceso afectado y se supervisa su reinicio. Es una postura
de diseño, no una resignación.

## 💡 Phoenix: lo convencional y lo que no

La parte convencional es deliberada. Phoenix toma prestado de Rails lo que
funcionaba —enrutado explícito, generadores, migraciones— y añade una idea propia
que merece atención: los **contextos**.

```elixir
# El enrutado no tiene sorpresas
scope "/", MiAppWeb do
  get "/tareas", TareaController, :index
  post "/tareas", TareaController, :create
end
```

Un contexto es un módulo que agrupa las operaciones de una parte del dominio y
**es la única puerta de entrada a ella**. Los controladores no tocan el ORM: hablan
con el contexto. Es el mismo objetivo que persigue el
[módulo 06](../../curriculum/06-persistencia-y-dominio.md) al separar transporte,
dominio y persistencia, pero **impuesto por los generadores del framework** en
lugar de dejado a la disciplina del equipo [@mccord-tate-programming-phoenix].

Que la estructura correcta sea la que el framework genera por omisión es una
decisión de diseño muy poco frecuente y de mucho valor.

## ⚡ LiveView: la consecuencia interesante

LiveView (2019) mantiene el **estado de la interfaz en el servidor** y envía por
WebSocket únicamente las diferencias del HTML. El navegador ejecuta una biblioteca
pequeña que aplica esos cambios, y nada más.

```
Navegador                          Servidor (un proceso por usuario)
    │                                        │
    │──── clic en «completar» ──────────────►│  actualiza el estado
    │                                        │  vuelve a renderizar
    │◄─── solo lo que cambió del HTML ───────│
```

**Lo que se elimina:** el modelo de datos duplicado, la capa de serialización, la
plantilla en el cliente, la sincronización, y buena parte de la API que existía
solo para alimentar al frontend.

**Lo que se paga:** cada interacción cruza la red, y el servidor guarda estado por
usuario conectado. La primera parte es una restricción real —no sirve para un
editor de texto ni para funcionamiento sin conexión—. La segunda **sería
prohibitiva en casi cualquier otro ecosistema** y aquí no lo es.

### La comparación que conviene tener presente

| Enfoque | Dónde vive el estado | Qué viaja | Requisito de plataforma |
| --- | --- | --- | --- |
| Aplicación de página única | Navegador | JSON | JavaScript en el cliente |
| htmx / Turbo | Servidor | Fragmentos de HTML por petición | Ninguno especial |
| **LiveView** | Servidor | Diferencias de HTML por WebSocket | Conexión con estado barata |

Las tres resuelven el mismo problema del
[módulo 04](../../curriculum/04-fullstack-y-renderizado.md). La tercera solo está
disponible si elegiste esta plataforma, y esa decisión se toma **antes** que la
del framework.

## ⚖️ Lo que hay que declarar antes de elegirlo

**1. El personal es la restricción real.** Elixir es un lenguaje funcional con
paso de mensajes y sin objetos mutables. Es aprendible y no es la experiencia
previa de la mayoría. El [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)
pide separar «lo que el equipo sabe hoy» de «lo que puede aprender», y aquí esa
distinción decide el proyecto.

**2. El ecosistema es más pequeño.** Menos bibliotecas, menos respuestas
publicadas, menos gente disponible. A cambio: menos rotación de tecnologías y
documentación más consistente.

**3. LiveView cambia el modelo de operación.** Con estado por conexión, un
reinicio del servidor no es transparente y el reparto de carga debe mantener la
afinidad de sesión. Son requisitos operativos del
[módulo 12](../../curriculum/12-producto-final.md) que no aparecen con un backend
sin estado.

## 🎓 Las tres lecciones

**1. El runtime es una decisión de arquitectura, no de instalación.** LiveView no
es una idea que a otros no se les ocurriera: es una idea que en otras plataformas
no sale rentable. Elegir plataforma es elegir qué arquitecturas están sobre la
mesa.

**2. Que la estructura correcta sea la que se genera por omisión es un valor
enorme.** Los contextos de Phoenix consiguen por convención lo que en otros
frameworks depende de que el equipo mantenga la disciplina durante años.

**3. «Dejar que falle» es una estrategia de fiabilidad, no una rendición.** El
aislamiento entre procesos y la supervisión producen sistemas que se recuperan
solos de fallos que en otros entornos exigen intervención.

## 🔗 Enlaces

- Documentación oficial: <https://hexdocs.pm/phoenix/overview.html>
- [Ecosistema BEAM](../ecosistemas/beam.md) · [Ficha de htmx](htmx.md) — la misma apuesta, otra plataforma
- [Módulo 04](../../curriculum/04-fullstack-y-renderizado.md) — dónde vive el estado y qué viaja por la red

## Fuentes

- [@mccord-tate-programming-phoenix] McCord, Chris; Tate, Bruce; Valim, José. *Programming Phoenix*. Pragmatic Bookshelf, 2016. ISBN 9781680501452 — <https://openlibrary.org/isbn/9781680501452>
- [@thomas-programming-elixir] Thomas, Dave. *Programming Elixir*. Pragmatic Bookshelf, 2014. ISBN 9781937785581 — <https://openlibrary.org/isbn/9781937785581>
