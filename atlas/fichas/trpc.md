# 🔗 tRPC — 2020

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

tRPC elimina la capa de esquema entre cliente y servidor: **el tipo del servidor
llega al cliente por inferencia de TypeScript**, sin generar nada. Es potente y
tiene un límite que conviene entender antes de adoptarlo.

| | |
|---|---|
| **Aparición** | 2020 |
| **Clasificación** | `rpc-framework` |
| **Ecosistema** | TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://trpc.io/docs> |

---

## 💡 Sin generación de código

```typescript
// servidor
export const router = t.router({
  crearTarea: t.procedure.input(esquemaTarea).mutation(({ input }) => crear(input)),
});
export type Router = typeof router;

// cliente
const tarea = await cliente.crearTarea.mutate({ titulo: "Leer el módulo 03" });
//    ^ el tipo de `tarea` viene del servidor, sin paso intermedio
```

Cambias el servidor y **el cliente deja de compilar en el mismo momento**. Es lo
que el [módulo 05](../../curriculum/05-backend-y-api.md) persigue —romper
pronto y en voz alta— logrado sin OpenAPI ni GraphQL ni generadores.

## ⚖️ Dónde se acaba

Todo eso depende de una condición: **cliente y servidor comparten el mismo
repositorio y el mismo lenguaje**. Fuera de esa condición, tRPC no aplica.

| Situación | ¿Sirve? |
| --- | --- |
| Monorepo TypeScript, un equipo | ✅ Encaja perfectamente |
| Cliente móvil nativo | ❌ No hay tipos que compartir |
| API pública para terceros | ❌ Necesitas contrato publicado |
| Consumidores en otros lenguajes | ❌ |

Por eso el contrato del programa —[`contracts/taskflow/openapi.yaml`](../../contracts/taskflow/openapi.yaml)—
está en OpenAPI y no en tRPC: cinco implementaciones en cinco lenguajes distintos
necesitan un contrato **independiente del lenguaje** [@openapi-spec]. Es
literalmente el caso que tRPC no cubre.

Y hay un matiz de acoplamiento que Richardson y Amundsen subrayan
[@richardson-amundsen-restful]: en RPC el cliente llama a procedimientos del
servidor; el acoplamiento es de firma, no de recurso. Cuando el servidor cambia,
todos los clientes cambian. Dentro de un monorepo eso es una ventaja —lo ves al
compilar—; entre organizaciones distintas es un problema.

## 🎓 Las dos lecciones

**1. Compartir tipos elimina toda una clase de errores sin generar código.** Es la
integración más estrecha posible, y funciona.

**2. Esa estrechez es la condición de uso.** Un contrato entre organizaciones
tiene que ser independiente del lenguaje.

## 🔗 Enlaces

- Documentación oficial: <https://trpc.io/docs>
- [Ficha de Next.js](nextjs.md)
- [Módulo 05](../../curriculum/05-backend-y-api.md)

## Fuentes

- [@richardson-amundsen-restful] Richardson, Leonard; Amundsen, Mike. *RESTful Web APIs*. O'Reilly Media, 2013. ISBN 9781449358068 — <https://openlibrary.org/isbn/9781449358068>
- [@openapi-spec] *OpenAPI Specification* v3.1, OpenAPI Initiative — <https://spec.openapis.org/oas/v3.1.0.html>
