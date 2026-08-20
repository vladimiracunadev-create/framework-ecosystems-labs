# Por qué sí y por qué no — Cuerpo JSON

> [⬅️ Clase 017](README.md) · [📚 Parte 1](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [FastAPI](../../../atlas/fichas/fastapi.md) | El modelo valida antes de entrar; el manejador solo ve datos correctos | Devuelve **422 también para el JSON ilegible** | Un manejador extra para cumplir el estándar con precisión |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Excepciones distintas para los dos fallos: la separación es natural | El formato de error por omisión no es el tuyo | Un manejador para dar tu formato |
| [Fastify](../../../atlas/fichas/fastify.md) | Analiza por omisión y emite 400 ante un cuerpo roto | El mensaje de error hay que darle forma | Un manejador de errores |
| [Express](../../../atlas/fichas/express.md) | Control total del análisis y de los límites | **No analiza por omisión**, y falla con HTML | Middleware más manejador: dos cosas que recordar |
| [Flask](../../../atlas/fichas/flask.md) | `get_json(silent=True)` distingue los dos casos en una línea | Sin validación de esquema | La comprobación de campos, a mano |
| [Django](../../../atlas/fichas/django.md) | Explícito de principio a fin, sin magia | Verboso; su validación real está en otra capa | Más líneas para lo mismo |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Enlace automático muy cómodo para el caso normal | Con enlace, **400 para ambos fallos** | Lectura manual cuando la distinción importa |
| [Laravel](../../../atlas/fichas/laravel.md) | `validate()` resuelve esto en un proyecto real | Sus ayudantes confunden ilegible con vacío | Ir al contenido crudo |
| [Rails](../../../atlas/fichas/rails.md) | Analiza y enruta sin ceremonia | Igual que Laravel | Igual |
| [Gin](../../../atlas/fichas/gin.md) | Enlace a estructura con etiquetas, muy directo | `ShouldBindJSON` no separa los dos fallos | Igual |

## 🧭 El hallazgo de esta clase

**Ocho de diez frameworks no distinguen por sí solos el cuerpo ilegible del
cuerpo incompleto.** No es descuido: sus valores por omisión sirven al caso
normal —«algo va mal con tu petición»— y esa simplificación basta hasta que tu
API tiene clientes que deciden si reintentar.

Merece subrayarse quién falla aquí: **FastAPI, el más declarativo de los diez, y
ASP.NET Core, uno de los más tipados**. Los dos colapsan los dos errores en uno,
por caminos opuestos —uno hacia 422, el otro hacia 400—. Ser declarativo no
garantiza ser preciso: garantiza ser **consistente con la decisión que el
framework tomó por ti**.

De ahí la regla que vale para los diez: **decide tú el contrato de errores y
verifícalo**. Es lo que hace [`contrato.json`](contrato.json), y por eso los ocho
que no lo traen puesto pasan igual — con el código extra que se ve en cada
implementación. La clase 040 lleva esto hasta el formato estándar de RFC 9457
[@rfc9457].

## Fuentes

- [@rfc9457] Nottingham, M.; Wilde, E.; Dalal, S. *Problem Details for HTTP APIs*, RFC 9457, IETF, 2023 — <https://www.rfc-editor.org/rfc/rfc9457>
