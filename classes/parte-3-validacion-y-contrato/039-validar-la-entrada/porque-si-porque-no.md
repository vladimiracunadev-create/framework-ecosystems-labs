# Por qué sí y por qué no — Validar la entrada

> [⬅️ Clase 039](README.md) · [📚 Parte 3](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [FastAPI](../../../atlas/fichas/fastapi.md) | El tipo **es** la regla; el manejador solo ve datos correctos | Reglas entre campos exigen validadores de modelo | Aprender Pydantic además del framework |
| [Laravel](../../../atlas/fichas/laravel.md) | `validate()` en una línea, con reglas guardables en configuración | Las reglas son cadenas: un error tipográfico falla en ejecución | Sin ayuda del editor sobre los nombres de regla |
| [Django](../../../atlas/fichas/django.md) | El formulario sirve para JSON y para navegador; `strip` de fábrica | Verboso para una API pura | Una clase por forma de entrada |
| [Rails](../../../atlas/fichas/rails.md) | `ActiveModel` da validaciones sin base de datos, y `presence` ya ignora espacios | El modelo tiende a acumular reglas de todo tipo | Un objeto que sabe demasiado |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Anotaciones estándar, ecosistema maduro, reutilizables entre capas | **El enlace ocurre antes que la validación**: un tipo mal da 400 | Aceptar el valor crudo para recuperar el 422 |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Atributos y `Validator` que acumula errores | Mismo problema de enlace previo | Igual |
| [Fastify](../../../atlas/fichas/fastify.md) | El esquema vale para validar, serializar y documentar | **Describe la forma, no el dominio**: no recorta ni conoce reglas propias | Escribir aparte lo que el esquema no expresa |
| [Express](../../../atlas/fichas/express.md), [Flask](../../../atlas/fichas/flask.md) | Control total, cero magia | La regla se repite y se olvida | Disciplina en cada ruta |
| [Gin](../../../atlas/fichas/gin.md) | Etiquetas junto a la estructura, muy compacto | El valor cero de Go obliga a punteros para lo opcional | Una capa de indirección que confunde al principio |

## 🧭 Forma frente a dominio

Es la distinción que ordena toda la parte 3, y esta clase la deja al descubierto.

**La forma** —tipo, longitud, formato, presencia— la describe bien un esquema o un
tipo. Es mecánica, se puede publicar, y el framework la comprueba solo.

**El dominio** —«no vacío tras recortar», «si está completada el título no puede
empezar por TODO», «la fecha de fin no puede ser anterior a la de inicio»— no cabe
en un esquema. Son reglas de tu negocio y viven en tu código.

El fallo de Fastify con `"     "` es exactamente esa frontera: `minLength: 1` es
forma; «no vacío» es dominio. Evans lo plantea como la razón de que el modelo
tenga que expresar las reglas del negocio y no delegarlas en la infraestructura
[@evans-ddd].

La consecuencia práctica: **elige un framework por su capa de forma, y da por
hecho que la de dominio la escribes tú**. Ninguno de los diez te la ahorra.

## ⚠️ Y la validación que nunca sustituye a la otra

La del cliente es comodidad: evita un viaje y mejora la experiencia. **La del
servidor es la única que protege**, porque el cliente lo controla quien envía la
petición.

Cualquiera puede saltarse tu formulario con `curl`. OWASP lo lista entre los
controles que deben existir siempre en el servidor, sin excepción
[@owasp-asvs].

## Fuentes

- [@evans-ddd] Evans, Eric. *Domain-Driven Design*. Addison-Wesley, 2003. ISBN 9780321125217 — <https://openlibrary.org/isbn/9780321125217>
- [@owasp-asvs] *OWASP Application Security Verification Standard*, OWASP Foundation — <https://owasp.org/www-project-application-security-verification-standard/>
