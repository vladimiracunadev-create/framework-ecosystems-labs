# 🌿 Leptos — 2022

> [⬅️ Atlas](../README.md) · [🦀 Ecosistema Rust](../ecosistemas/rust.md) · [🗂️ Índice](../frameworks.md)

Leptos lleva a Rust la **reactividad de grano fino** —el modelo de
[SolidJS](solid.md) y de las señales— en lugar del árbol virtual que usa
[Yew](yew.md). Y añade **funciones de servidor**: código que se escribe junto al
componente y se ejecuta en el servidor.

| | |
|---|---|
| **Aparición** | 2022 |
| **Clasificación** | `ui-framework` |
| **Ecosistema** | Rust (WebAssembly y servidor) |
| **Licencia** | `MIT` |
| **Estado** | 🌊 Emergente |
| **Documentación** | <https://book.leptos.dev/> |

---

## 💡 Señales en Rust

El mismo mecanismo que la [ficha de Knockout](knockout.md) describe para 2010:
un valor que registra quién lo lee y avisa solo a esos lectores. Aquí con una
ventaja del lenguaje: **el sistema de propiedad de Rust hace explícito quién
posee cada dato**, y muchos errores de estado compartido son de compilación
[@blandy-programming-rust].

Para un framework de interfaz, evitar el árbol virtual importa especialmente en
WebAssembly: como explica la [ficha de Yew](yew.md), **cada cruce hacia el
documento tiene coste**. Actualizar solo lo que cambió reduce esos cruces, en
lugar de comparar árboles y aplicar diferencias.

Es un caso donde la elección de modelo de reactividad **no es estética**: viene
impuesta por una restricción de la plataforma.

## 🔀 Funciones de servidor

```rust
// Se escribe junto al componente; se ejecuta en el servidor.
// El framework genera la llamada de red y la serialización.
#[server]
async fn crear_tarea(titulo: String) -> Result<Tarea, ServerFnError> { /* ... */ }
```

Es la misma idea que los componentes de servidor de [React](react.md) y las
acciones de los metaframeworks: **borrar la frontera visible entre cliente y
servidor** conservando su separación real.

El aviso del [módulo 05](../../curriculum/05-backend-y-api.md) sigue en pie y aquí
importa más: aunque la frontera sea invisible en el código, **existe**, y todo lo
que la cruza es entrada no fiable que hay que validar en el servidor.

## ⚖️ Lo que hay que declarar

Es emergente: ecosistema pequeño, menos recorrido, herramientas de depuración
limitadas. Y arrastra el compromiso de todo Rust en el navegador — tamaño del
binario y ciclo de compilación lento.

El [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) lo puntúa como
madurez demostrada, no como objeción.

## 🎓 Las dos lecciones

**1. La restricción de la plataforma puede decidir el modelo de reactividad.** En
WebAssembly, minimizar cruces al documento favorece las señales sobre el árbol
virtual.

**2. Una frontera invisible en el código sigue siendo una frontera de
confianza.** Las funciones de servidor son cómodas y no eximen de validar.

## 🔗 Enlaces

- Documentación oficial: <https://book.leptos.dev/>
- [Ficha de Yew](yew.md) · [Ficha de SolidJS](solid.md) · [Ficha de React](react.md)
- [Módulo 05](../../curriculum/05-backend-y-api.md)

## Fuentes

- [@blandy-programming-rust] Blandy, Jim; Orendorff, Jason. *Programming Rust*, 2.ª ed. O'Reilly Media, 2021. ISBN 9781492052593 — <https://openlibrary.org/isbn/9781492052593>
