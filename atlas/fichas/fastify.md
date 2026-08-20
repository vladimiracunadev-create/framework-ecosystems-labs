# 🚅 Fastify — 2016

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Fastify se propuso mejorar dos cosas concretas de [Express](express.md):
**validación y serialización derivadas de esquema**, y un **sistema de plugins con
encapsulamiento explícito**.

| | |
|---|---|
| **Aparición** | 2016 |
| **Clasificación** | `web-framework` |
| **Ecosistema** | Node.js |
| **Licencia** | `MIT` |
| **Gobierno** | OpenJS Foundation |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://fastify.dev/docs/latest/> |

---

## 💡 El esquema como fuente

```javascript
app.post("/tasks", {
  schema: {
    body: { type: "object", required: ["title"],
            properties: { title: { type: "string", maxLength: 120 } } },
    response: { 201: { type: "object",
                       properties: { id: { type: "string" }, title: { type: "string" } } } },
  },
}, async (peticion, respuesta) => { /* ... */ });
```

Del mismo esquema salen tres cosas [@json-schema]:

1. **Validación** de la entrada, sin escribirla.
2. **Serialización** de la salida, que además **filtra**: lo que no está en el
   esquema no se envía.
3. **Documentación** OpenAPI, con un complemento.

La segunda es la más valiosa y la menos comentada: **filtrar la respuesta por
esquema impide la filtración accidental de campos internos** — exactamente el
fallo que la [ficha de Eloquent](eloquent.md) describe cuando se serializa el
modelo entero. Aquí el valor por omisión es seguro.

## 🧩 Plugins con encapsulamiento

En [Express](express.md), un middleware registrado afecta a todo lo que viene
después. En Fastify, un plugin crea un **contexto propio**: lo que registra
dentro no se filtra fuera salvo que se declare.

Eso ataca directamente el riesgo que el
[módulo 02](../../curriculum/02-arquitectura-de-frameworks.md) señala en las
cadenas de middleware: **el orden y el alcance son invisibles desde el código de
negocio**. Con encapsulamiento explícito, el alcance sí se ve.

## ⚖️ Frente a Express

| | Express | Fastify |
| --- | --- | --- |
| Validación | Eliges biblioteca | Desde esquema, integrada |
| Serialización | `JSON.stringify` completo | **Filtrada por esquema** |
| Plugins | Middleware global | Contextos encapsulados |
| Ecosistema | El mayor | Menor, pero sólido |
| Curva | Mínima | Algo mayor |

## 🎓 Las dos lecciones

**1. Filtrar la salida por esquema convierte la seguridad en el valor por
omisión.** Es mejor que recordar excluir campos.

**2. Encapsular el alcance de un plugin hace visible lo que en una cadena global
es invisible.** Menos sorpresas al diagnosticar.

## 🔗 Enlaces

- Documentación oficial: <https://fastify.dev/docs/latest/>
- [Ficha de Express](express.md) · [Ficha de NestJS](nestjs.md) · [Ficha de Hono](hono.md)
- [Módulo 05](../../curriculum/05-backend-y-api.md)

## Fuentes

- [@json-schema] JSON Schema Specification — <https://json-schema.org/specification>
- [@casciaro-node-patterns] Casciaro, Mario; Mammino, Luciano. *Node.js Design Patterns*, 3.ª ed. Packt Publishing, 2020. ISBN 9781839214110 — <https://openlibrary.org/isbn/9781839214110>
