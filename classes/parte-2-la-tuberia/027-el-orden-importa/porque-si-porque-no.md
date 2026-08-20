# Por qué sí y por qué no — El orden importa

> [⬅️ Clase 027](README.md) · [📚 Parte 2](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Orden de registro = orden de ejecución, sin excepciones | Ninguna ayuda si te equivocas al ordenar | Leer con cuidado; el compilador no opina |
| [Express](../../../atlas/fichas/express.md) | Igual de predecible, y el registro está a la vista | El orden se dispersa si las capas se registran en varios archivos | Reconstruir el orden mentalmente |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | El orden es **explícito**: un número, no una deducción | Verboso, y olvidarlo deja el orden indefinido | Un `setOrder` por capa |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Registro mínimo, un decorador por capa | **El orden de ejecución es el inverso al de registro** | Una trampa real para quien viene de Express |

## 🧭 Lo que hay que llevarse

**El orden no es un detalle de estilo: es comportamiento.** Autenticar antes o
después de limitar la tasa cambia cuánta CPU gastas en peticiones que vas a
rechazar. Comprimir antes o después de cachear cambia qué puedes servir y a quién.

Y por eso la decisión de Spring —obligar a declarar el número— es más defendible
de lo que parece a primera vista: **convierte en explícito algo que en los otros
tres es implícito**, y lo implícito se rompe cuando alguien mueve un archivo.

## 🔒 El hallazgo que cambió la clase

La primera versión guardaba la traza en una variable del módulo, y el contrato
destapó que **la traza de una petición aparecía en la respuesta de la siguiente**.

En este laboratorio era una lista de cadenas. En una aplicación real, ese mismo
error con el usuario autenticado significa **servirle a alguien los datos de
otro** — una de las formas más frecuentes de fallo de control de acceso según
OWASP [@owasp-top10].

La defensa está en los cuatro frameworks y se llama igual en todos: **almacén por
petición**. `peticion.state`, `contexto.Items`, atributos de la petición, una
propiedad en el objeto. Nace y muere con la petición, y por eso no se filtra.

La regla práctica: **si el dato pertenece a una petición, vive en la petición**.
Nunca en el módulo.

## Fuentes

- [@owasp-top10] *OWASP Top 10*, OWASP Foundation — <https://owasp.org/www-project-top-ten/>
