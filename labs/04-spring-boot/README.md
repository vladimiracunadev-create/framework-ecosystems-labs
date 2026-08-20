# Laboratorio 04 — Spring Boot

Framework estructurado sobre la JVM, con contenedor de dependencias. Casi todo el
comportamiento por omisión es razonable; el trabajo está en traducirlo al
contrato.

```bash
node scripts/run-acceptance.mjs spring-boot --prepare
```

Requiere JDK 21 y Maven.

## Traductor único de excepciones

El `@RestControllerAdvice` es el equivalente al middleware final de Express y al
manejador de excepciones de FastAPI: un único punto donde las excepciones del
framework se convierten en el sobre del contrato.

| Excepción de Spring | Se traduce a |
| --- | --- |
| `HttpRequestMethodNotSupportedException` | `405` con `Allow` |
| `HttpMediaTypeNotSupportedException` | `415` `UNSUPPORTED_MEDIA_TYPE` |
| `NoHandlerFoundException`, `NoResourceFoundException` | `404` `ROUTE_NOT_FOUND` |
| cualquier otra | `500` sin detalle |

Olvidar una excepción no produce un error visible: produce una respuesta con el
formato interno del framework, que es peor, porque parece que funciona.

## Por qué el cuerpo se recibe como texto

El contrato fija el **orden** de las comprobaciones: tamaño, clave de
idempotencia, análisis, conflicto y validación. El enlace automático de modelo
analizaría el cuerpo antes de que la clave de idempotencia se hubiera mirado
siquiera, así que aquí se recibe como `String` y se analiza a mano.

Es el compromiso central del laboratorio: **el enlace automático es cómodo hasta
que el contrato exige un orden distinto del suyo.**

## Desviación declarada

El límite de 64 KiB se comprueba **después** de que el contenedor haya leído el
cuerpo, no mientras llega como en la referencia. El código de respuesta es el
mismo y la prueba de aceptación pasa; la protección de memoria, no es la misma.

Está declarada en [`ACCEPTANCE.md`](../../contracts/taskflow/ACCEPTANCE.md)
porque una desviación declarada es información sobre el ecosistema y una
desviación silenciosa es un fallo de la comparación.
