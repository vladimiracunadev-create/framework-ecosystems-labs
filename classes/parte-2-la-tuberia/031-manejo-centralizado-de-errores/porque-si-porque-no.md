# Por qué sí y por qué no — Manejo centralizado de errores

> [⬅️ Clase 031](README.md) · [📚 Parte 2](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `@RestControllerAdvice` con un método por excepción: se lee como una tabla | El formato por omisión es el suyo, y hay que sustituirlo | Una clase más, y saber que existe |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Un manejador por tipo, muy legible | Sus errores de validación llegan como 422 aunque el cuerpo sea ilegible | Separar los casos a mano — clase 017 |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `ProblemDetails` incorporado: el formato estándar viene de fábrica | El despacho por tipo se hace a mano | Un `is` por familia de error |
| [Express](../../../atlas/fichas/express.md) | Control total del formato | **Firma mágica de cuatro argumentos** y responde HTML por omisión | Quitar un parámetro lo desactiva sin aviso |

## 🧭 Lo que de verdad separa a los cuatro

**El despacho por tipo.** Spring y FastAPI permiten declarar un manejador por
familia de error; Express y ASP.NET obligan a comprobar el tipo dentro de uno
solo.

Con dos familias da igual. Con ocho —validación, no encontrado, conflicto,
permiso, dependencia caída, plazo agotado, cupo, formato— la diferencia es entre
una tabla legible y un `if` de cuarenta líneas que nadie quiere tocar.

## 🔒 La decisión que no es de framework

**Qué se le cuenta al cliente.** Ninguno de los cuatro lo decide por ti, y es la
parte que más importa:

| | Al cliente | Al registro |
| --- | --- | --- |
| Error de negocio | qué pasó y qué hacer | lo mismo |
| Error no previsto | «error interno» y un código | mensaje, traza y contexto |

Contar de más filtra rutas, nombres de tablas y fragmentos de consulta — material
de reconocimiento que OWASP lista entre los fallos de configuración
[@owasp-top10]. Contar de menos —un 500 sin código ni identificador— deja al
usuario sin nada que reportar y a ti sin nada que buscar.

El punto medio es el que aplican las cuatro implementaciones: **respuesta genérica
con un código estable, y todo el detalle dentro**. Añadirle el identificador de
correlación de la clase 030 cierra el círculo: el usuario te da un identificador,
tú encuentras la traza completa.

## Fuentes

- [@owasp-top10] *OWASP Top 10*, OWASP Foundation — <https://owasp.org/www-project-top-ten/>
