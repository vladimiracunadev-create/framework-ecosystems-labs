# 🦊 Elysia — 2022

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Elysia es el framework HTTP pensado para [Bun](bun.md), y su aportación
interesante no es la velocidad: es que **el esquema de validación y el tipo de
TypeScript son la misma declaración**.

| | |
|---|---|
| **Aparición** | 2022 |
| **Clasificación** | `web-framework` |
| **Ecosistema** | Bun / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://elysiajs.com/> |

---

## 💡 Un esquema, tres usos

```typescript
app.post("/tareas", ({ body }) => crear(body), {
  body: t.Object({
    titulo: t.String({ maxLength: 120 }),
    completada: t.Optional(t.Boolean()),
  }),
});
```

De esa única declaración salen:

1. **La validación en tiempo de ejecución** — la petición que no encaja se rechaza
   antes de llegar a tu código.
2. **El tipo de `body`** — el editor ya sabe qué campos hay.
3. **La documentación OpenAPI** — generada del mismo esquema [@openapi-spec].

Es exactamente el argumento del
[módulo 05](../../curriculum/05-backend-y-api.md) y de la
[ficha de FastAPI](fastapi.md): **una sola fuente de verdad para el contrato**.
Cuando validación, tipos y documentación se escriben por separado, divergen; la
documentación miente y nadie lo nota hasta que un cliente falla.

Que ambos frameworks —uno en Python, otro en TypeScript— hayan llegado a la misma
solución no es casualidad: es la convergencia que el
[Atlas](../README.md) documenta una y otra vez.

## ⚖️ Atado a Bun

Elysia aprovecha las API de Bun, y eso significa que **elegir Elysia es elegir
Bun**. La [ficha de Bun](bun.md) plantea la pregunta que corresponde: qué pasa si
el runtime pierde impulso.

[Hono](hono.md) toma la decisión contraria —API web estándar, funciona en varios
runtimes— y paga con menos integración.

## 🎓 Las dos lecciones

**1. Un esquema que sirve de validación, tipo y documentación elimina la
divergencia por construcción.** No es comodidad: es corrección.

**2. Atarse al runtime da integración y quita salidas.** Es un compromiso legítimo
si lo declaras.

## 🔗 Enlaces

- Documentación oficial: <https://elysiajs.com/>
- [Ficha de Bun](bun.md) · [Ficha de Hono](hono.md) · [Ficha de FastAPI](fastapi.md)
- [Módulo 05](../../curriculum/05-backend-y-api.md)

## Fuentes

- [@openapi-spec] *OpenAPI Specification* v3.1, OpenAPI Initiative — <https://spec.openapis.org/oas/v3.1.0.html>
