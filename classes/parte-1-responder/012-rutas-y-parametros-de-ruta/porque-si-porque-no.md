# Por qué sí y por qué no — Rutas y parámetros de ruta

> [⬅️ Clase 012](README.md) · [📚 Parte 1](../README.md)

La pregunta de esta clase no es qué sintaxis es más bonita: es **cuánto trabajo
hace el enrutador antes de llamarte**.

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | La sintaxis que todos reconocen; cero ceremonia | El valor llega crudo y sin comprobar | La conversión y su validación se repiten en cada manejador |
| [Fastify](../../../atlas/fichas/fastify.md) | Igual de directo, y con esquema opcional que sí valida | Sin esquema es Express | Declarar el esquema, que ya es trabajo de la clase 041 |
| [FastAPI](../../../atlas/fichas/fastapi.md) | La anotación de tipo **es** la validación: no hay código duplicado | Depende de entender el modelo de tipos de Python | Una anotación mal puesta cambia el comportamiento, no solo la documentación |
| [Flask](../../../atlas/fichas/flask.md) | Convertidores en la propia ruta, legibles de un vistazo | El juego de convertidores es corto; lo raro lo escribes tú | Un convertidor propio es una clase más que mantener |
| [Django](../../../atlas/fichas/django.md) | Igual que Flask, con la tabla de rutas centralizada y auditable | Toda la configuración por delante | Ver una ruta obliga a abrir un archivo distinto del manejador |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Conversión por tipo y un sistema de conversores extensible | El nombre hay que repetirlo si no se conservan los parámetros al compilar | Ruido en la anotación, y una trampa si te fías del compilador |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Emparejamiento por nombre y conversión por tipo, muy poco código | Los errores de conversión son 400 genéricos hasta que los personalizas | Un mensaje de error pobre para el cliente si no lo tocas |
| [Laravel](../../../atlas/fichas/laravel.md) | Enlace de modelo: `{tarea}` puede llegar como la fila ya cargada | La inyección es **por orden**, no por nombre | Un error silencioso al reordenar segmentos |
| [Rails](../../../atlas/fichas/rails.md) | `params` unificado: no importa de dónde venga el dato | `params` unificado: **no importa de dónde venga el dato** | Hay que filtrar a conciencia, o un cliente cuela por consulta lo que esperabas de la ruta |
| [Gin](../../../atlas/fichas/gin.md) | Emparejamiento muy rápido y sin coste por número de rutas | Sin conversión ni validación en la ruta | Todo el trabajo de comprobación es tuyo |

## 🧭 El eje que de verdad decide

Dos filas dicen lo mismo con signo opuesto —Rails— y no es un descuido: **la
misma propiedad es la ventaja y el riesgo**. Unificar el origen de los datos hace
el código corto y borra una distinción que la seguridad necesita. Es el patrón
que el [módulo 07](../../../curriculum/07-identidad-y-seguridad.md) trabaja como
confusión de origen de datos, y que OWASP recoge entre los fallos de control de
acceso [@owasp-top10].

Para elegir, la pregunta útil es: **¿quieres que un identificador mal formado
llegue a tu código?**

- **No** → FastAPI, Spring Boot, ASP.NET Core, o Flask y Django con convertidor.
  El manejador solo recibe lo que ya es válido.
- **Da igual** → Express, Gin, Fastify sin esquema. Más simple, y la comprobación
  la escribes tú en cada sitio.

La primera opción escala mejor cuando hay muchas rutas, porque **la validación no
se puede olvidar**: está en la firma. La segunda es más ligera cuando hay pocas y
el equipo es pequeño.

## Fuentes

- [@owasp-top10] *OWASP Top 10*, OWASP Foundation — <https://owasp.org/www-project-top-ten/>
