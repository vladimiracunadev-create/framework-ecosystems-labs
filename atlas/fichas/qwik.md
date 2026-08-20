# 🌊 Qwik — 2021

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Qwik ataca el coste que [Astro](astro.md) evita y que los metaframeworks
clásicos aceptan: **la hidratación**. Su propuesta es la más radical de la quinta
era del Atlas — en lugar de reconstruir el estado en el navegador, **reanudarlo**
desde donde lo dejó el servidor.

> **🎯 Por qué está en este programa**
>
> Porque hace visible un coste que el
> [módulo 04](../../curriculum/04-fullstack-y-renderizado.md) enseña a medir y que
> casi nadie mide: **renderizar en el servidor entrega píxeles antes, no
> interactividad antes**. Qwik existe porque alguien tomó ese intervalo en serio.

| | |
|---|---|
| **Aparición** | 2021, creado por Miško Hevery (autor de AngularJS) |
| **Clasificación** | `ui-framework` |
| **Ecosistema** | TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🌊 Emergente |
| **Documentación** | <https://qwik.dev/docs/> |

---

## 📜 El problema: qué hace la hidratación

Cuando una página se renderiza en el servidor y llega al navegador, el HTML ya
está pintado. Pero los manejadores de eventos no existen todavía. Para crearlos,
el framework tiene que:

1. Descargar el paquete de JavaScript de la aplicación.
2. Ejecutarlo entero.
3. **Reconstruir en memoria el árbol de componentes que el servidor ya había
   construido**.
4. Volver a asociar cada manejador a su elemento.

Los pasos 2 y 3 son trabajo **repetido**: el servidor ya lo hizo. Y durante ese
intervalo la página se ve completa y no responde — el fallo característico del
renderizado en servidor mal medido.

## 💡 La idea: reanudar en lugar de reconstruir

Qwik serializa en el propio HTML **el estado y las referencias a los manejadores**,
de modo que el navegador no necesita reconstruir nada. Cuando el usuario hace
clic, se descarga en ese momento **solo el fragmento de código de ese manejador**
[@qwik-resumability].

```
Hidratación clásica          Reanudación (Qwik)
─────────────────────        ──────────────────────────────
HTML llega                   HTML llega, con el estado dentro
Descarga TODO el JS          No descarga nada
Ejecuta TODO                 No ejecuta nada
Reconstruye el árbol         No reconstruye
Ya responde                  Ya responde
                             Al primer clic: descarga ESE manejador
```

La consecuencia es que **la cantidad de JavaScript inicial es casi independiente
del tamaño de la aplicación**. Eso es un cambio de categoría, no una
optimización.

## ⚖️ Lo que se paga

**1. Un modelo mental nuevo.** Para poder trocear el código así, el framework
necesita saber qué puede ejecutarse por separado. Eso impone reglas sobre cómo se
escriben las funciones y qué pueden capturar de su entorno. No es difícil, es
**distinto**, y distinto tiene un coste de aprendizaje que hay que declarar.

**2. Depende fuertemente del compilador.** Como en [Svelte](svelte.md), lo que se
ejecuta no es lo que se escribió, con el mismo efecto sobre el diagnóstico.

**3. Es emergente.** Ecosistema pequeño, menos recorrido demostrado, menos
personas con experiencia. El [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)
no penaliza lo nuevo, pero obliga a puntuar la **madurez demostrada** como una
dimensión más — junto a la estrategia de salida, que aquí conviene tener escrita.

## 🧭 Tres respuestas al mismo exceso

| | Astro | Qwik | htmx |
| --- | --- | --- | --- |
| Diagnóstico | Se envía JavaScript innecesario | La hidratación es cara | El estado no debía salir del servidor |
| Solución | Cero por omisión, islas explícitas | Reanudar en vez de reconstruir | HTML como respuesta |
| Coste | Estado compartido entre islas | Modelo mental nuevo | Latencia por interacción |
| Madurez | Media | Emergente | Media |

Las tres son ramas paralelas de la misma década, no generaciones que se
sustituyen. Presentarlas juntas es una de las funciones del Atlas.

## 🎓 Las tres lecciones

**1. La hidratación es trabajo repetido, y alguien tenía que decirlo.** El
servidor construyó el árbol y el cliente lo reconstruye. Qwik existe porque esa
observación se tomó en serio.

**2. Cambiar la categoría del problema vale más que optimizar dentro de ella.**
Hacer el JavaScript inicial independiente del tamaño de la aplicación no es
«más rápido»: es otra cosa.

**3. Lo emergente se puntúa, no se descarta ni se adopta por entusiasmo.** Madurez
demostrada y estrategia de salida son dimensiones de la matriz, no objeciones.

## 🔗 Enlaces

- Documentación oficial: <https://qwik.dev/docs/>
- [Ficha de Astro](astro.md) · [Ficha de htmx](htmx.md) · [Ficha de AngularJS](angularjs.md) — del mismo autor
- [Módulo 04](../../curriculum/04-fullstack-y-renderizado.md)

## Fuentes

- [@qwik-resumability] *Resumable*, Qwik — <https://qwik.dev/docs/concepts/resumable/>
