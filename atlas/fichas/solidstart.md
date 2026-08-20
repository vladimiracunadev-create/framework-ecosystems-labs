# 🧩 SolidStart — 2022

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

SolidStart es el metaframework de [Solid](solid.md): enrutado, renderizado en el
servidor, acciones de formulario y despliegue en varios destinos gracias a
[Nitro](nitro.md).

| | |
|---|---|
| **Aparición** | 2022 |
| **Clasificación** | `meta-framework` |
| **Ecosistema** | Solid |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.solidjs.com/solid-start> |

---

## 💡 La reactividad fina también en el servidor

Solid actualiza exactamente los nodos que dependen de un valor, sin volver a
ejecutar el componente — la [ficha de Solid](solid.md) lo explica en detalle
[@solid-reactivity]. SolidStart lleva ese modelo al ciclo completo: **el servidor
genera el HTML, el cliente engancha las dependencias y a partir de ahí cada cambio
toca solo lo que debe**.

```jsx
export const route = {
  preload: () => cargarTareas(),
};

export default function Tareas() {
  const tareas = createAsync(() => cargarTareas());
  return <For each={tareas()}>{(t) => <li>{t.titulo}</li>}</For>;
}
```

El patrón de `preload` es el que la [ficha de Remix](remix.md) defiende: **empezar
a cargar los datos al navegar, no al montar el componente**, para evitar la cadena
de peticiones en cascada.

## 🔄 Todos convergen

SolidStart, [SvelteKit](sveltekit.md), [Nuxt](nuxt.md), [Remix](remix.md) y
[Next.js](nextjs.md) llegaron a la misma lista de piezas: enrutado por archivos,
carga de datos junto a la ruta, acciones de formulario que funcionan sin
JavaScript y despliegue en varios entornos.

Que cinco equipos independientes converjan así es la señal que el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) enseña a leer:
**el problema está bien entendido y la diferencia entre opciones se ha reducido**.
Lo que queda para decidir es el modelo de reactividad de abajo, el tamaño del
ecosistema y el destino de despliegue.

## ⚖️ Lo que hay que pesar

Solid es técnicamente sólido y su ecosistema es mucho menor que el de React. La
pregunta del módulo 11 no cambia: **quién mantiene esto dentro de cinco años y a
quién puedes contratar** que ya lo conozca.

## 🎓 Las dos lecciones

**1. Cargar los datos al navegar evita la cascada de peticiones.** Es una decisión
de arquitectura, no una optimización tardía.

**2. Cuando las opciones convergen, la decisión se mueve al ecosistema.** Las
capacidades ya no distinguen; las personas y el mantenimiento, sí.

## 🔗 Enlaces

- Documentación oficial: <https://docs.solidjs.com/solid-start>
- [Ficha de Solid](solid.md) · [Ficha de Nitro](nitro.md) · [Ficha de SvelteKit](sveltekit.md)
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@solid-reactivity] *Solid — Reactivity Basics*, SolidJS — <https://docs.solidjs.com/concepts/intro-to-reactivity>
