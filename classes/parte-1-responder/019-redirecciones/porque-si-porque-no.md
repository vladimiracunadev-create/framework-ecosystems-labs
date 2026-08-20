# Por qué sí y por qué no — Redirecciones

> [⬅️ Clase 019](README.md) · [📚 Parte 1](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `permanent` y `preserveMethod` nombran los dos ejes: el código se lee solo | Hay que conocer la firma | Nada relevante |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Constantes con nombre (`TEMPORARY_REDIRECT`) en vez de números | No hay atajo: se construye la respuesta entera | Un ayudante propio para no repetirse |
| [Express](../../../atlas/fichas/express.md) | `redirect(codigo, destino)` es corto y directo | El número exige conocer la tabla | Quien lee tiene que saber qué es un 307 |
| [FastAPI](../../../atlas/fichas/fastapi.md) | `RedirectResponse` explícito y componible | Igual: el número no explica nada | Igual |

## 🧭 Lo que de verdad decide aquí

**Ninguno de los cuatro te protege del error caro**, que es publicar un `301`
antes de tiempo. Esa decisión no es de código: es de operación.

La regla que sí funciona:

1. **Empieza temporal.** `302` o `307` mientras el cambio no esté consolidado.
2. **Mide.** Comprueba que el destino responde y que nadie se rompió.
3. **Pasa a permanente** solo cuando estés seguro, y sabiendo que es una decisión
   difícil de revertir porque **la corrección no llega a quien ya guardó el
   salto**.

Ese patrón —cambiar de forma reversible, medir, consolidar— es el mismo que
gobierna la migración por higuera estranguladora de la clase 140, y el que
Humble y Farley formulan como despliegue de bajo riesgo
[@humble-farley-continuous-delivery]. Una redirección permanente es, en la
práctica, un despliegue en el navegador de tus usuarios: **desplegar algo que no
puedes retirar es lo que hay que evitar**.

## Fuentes

- [@humble-farley-continuous-delivery] Humble, Jez; Farley, David. *Continuous Delivery*. Addison-Wesley, 2010. ISBN 9780321601919 — <https://openlibrary.org/isbn/9780321601919>
