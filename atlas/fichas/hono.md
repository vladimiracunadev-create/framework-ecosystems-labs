# 🔥 Hono — 2021

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Hono está construido sobre **las API estándar de la web** —`Request`, `Response`,
`fetch`— en lugar de sobre las API propias de Node.js. Esa decisión le permite
ejecutarse en Node, Deno, Bun y entornos de borde **sin adaptador**.

| | |
|---|---|
| **Aparición** | 2021 |
| **Clasificación** | `web-framework` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🌊 Emergente |
| **Documentación** | <https://hono.dev/docs/> |

---

## 💡 Los estándares como capa de portabilidad

```javascript
// Request y Response son los mismos objetos que usa fetch en el navegador.
app.post("/tasks", async (c) => {
  const entrada = await c.req.json();
  return c.json({ id: "t1", title: entrada.title }, 201);
});
```

Node.js definió sus propias abstracciones de petición y respuesta en 2009, antes
de que la plataforma web tuviera las suyas. [Deno](deno.md), [Bun](bun.md) y los
entornos de borde nacieron después y adoptaron las del estándar.

Hono apuesta por esas últimas, y el resultado es que **el mismo código corre en
varios runtimes**. Es la misma estrategia de portabilidad que representa la
interfaz común del ecosistema Python —ver la
[ficha de Starlette](starlette.md)— resuelta aquí apoyándose en la plataforma web.

Para el [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md), es una
estrategia de salida fuerte: **cambiar de runtime deja de ser una reescritura**.

## ⚖️ Lo que hay que declarar

**1. Es emergente.** Menos recorrido y menos ecosistema que Express o Fastify.

**2. La portabilidad no es total.** Cada runtime tiene capacidades distintas
—sistema de archivos, procesos, límites de tiempo—, y el código que las usa no es
portable aunque el framework lo sea.

**3. Los entornos de borde imponen restricciones.** Tiempo de ejecución limitado,
sin estado entre peticiones, sin acceso a disco. Encajan para transformaciones y
enrutado, no para todo.

## 🎓 Las dos lecciones

**1. Apoyarse en el estándar produce portabilidad.** Las API propias son cómodas
y atan; las estándar son un contrato compartido.

**2. Portabilidad del framework no es portabilidad de la aplicación.** Lo que usa
capacidades específicas del entorno sigue sin moverse.

## 🔗 Enlaces

- Documentación oficial: <https://hono.dev/docs/>
- [Ficha de Express](express.md) · [Ficha de Deno](deno.md) · [Ficha de Bun](bun.md)
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@whatwg-fetch] Fetch Standard, WHATWG — <https://fetch.spec.whatwg.org/>
