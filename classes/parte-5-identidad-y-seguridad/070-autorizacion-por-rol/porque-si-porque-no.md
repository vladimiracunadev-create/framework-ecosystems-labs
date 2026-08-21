# Por qué sí y por qué no — Autorización por rol

> [⬅️ Clase 070](README.md) · [📚 Parte 5](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | Treinta líneas transparentes: se entiende todo porque no hay nada más | Ese middleware es ahora TU producto de seguridad, sin más auditores que tú | Cada regla nueva es código nuevo con bugs posibles |
| [FastAPI](../../../atlas/fichas/fastapi.md) | La regla en la firma de la ruta: la autorización se lee donde se usa | `Depends` compone, pero roles, jerarquías y permisos los modelas tú | Diseñar el modelo de permisos sin guía del framework |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Reglas centrales imposibles de saltarse por olvido; `@PreAuthorize` para el grano fino | La regla vive lejos del código que protege, y la cadena de filtros es opaca hasta que se aprende | La curva de Spring Security, famosa por algo |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Autenticación enchufable + autorización de serie: el reparto de papeles más limpio de los cuatro | No trae esquema Basic ni simple: hasta el caso trivial exige escribir un handler | Entender el pipeline authn/authz antes del primer 401 |

## 🧭 El hallazgo

El mismo reparto que en la 066, más extremo: **los frameworks con opinión
(Spring, ASP.NET) traen la autorización; los minimalistas (Express, FastAPI)
te dan piezas de composición y te desean suerte.**

No es una carencia simétrica. En la sesión (066) lo que faltaba era una
pieza que se instala; aquí lo que falta es un **modelo** — qué es un rol,
cómo se compone con permisos, dónde se declara. Express y FastAPI no opinan,
y la historia de A01 Broken Access Control como riesgo n.º 1 de OWASP
[@owasp-top10] sugiere que los modelos de autorización caseros fallan más
que las piezas instalables.

## ⚖️ Central o declarado en la ruta

Los dos estilos del contrato fallan de forma opuesta:

- **Regla central** (Spring): la ruta nueva queda protegida por
  `anyRequest().authenticated()` aunque nadie piense en ella. Falla cuando
  la regla específica no se añadió — y el genérico era más permisivo.
- **Declarado en la ruta** (los otros tres): el permiso se ve en el code
  review de la ruta. Falla cuando la ruta nueva **no declara nada** — y en
  Express y FastAPI, nada significa abierta.

La defensa contra el segundo fallo se llama denegar por omisión: en ASP.NET,
`FallbackPolicy`; en Express/FastAPI, un middleware global que exige
autenticación salvo lista blanca. Ninguna de las cuatro implementaciones del
laboratorio la incluye — el reto de transferencia de la 071 la hace medible.

## Fuentes

- [@owasp-top10] *OWASP Top 10* (A01: Broken Access Control). OWASP — <https://owasp.org/www-project-top-ten/>
- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (Authorization). OWASP — <https://cheatsheetseries.owasp.org/>
