# Por qué sí y por qué no — Identificador de correlación

> [⬅️ Clase 030](README.md) · [📚 Parte 2](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | El contexto de diagnóstico propaga el identificador a todo el registro sin argumentos | **Hay que limpiarlo**, o el hilo reutilizado lo hereda | Un `finally` que si se olvida corrompe los registros |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Ámbitos de registro incorporados y `Activity` para trazas del estándar | Dos mecanismos que conviven | Saber cuál usar |
| [FastAPI](../../../atlas/fichas/fastapi.md) | `peticion.state` es simple y explícito | Propagar al registro exige almacenamiento local asíncrono | Montarlo a mano |
| [Express](../../../atlas/fichas/express.md) | Una propiedad en la petición y listo | Igual: propagar es cosa tuya | Igual |

## 🧭 Empieza por aquí, no por las trazas

La correlación es **el paso más barato con más retorno** de toda la parte 2. Diez
líneas de código convierten «algo falló» en «esta petición falló, aquí está su
recorrido completo».

Las trazas distribuidas de la clase 132 dan mucho más —árbol de llamadas,
duración por tramo, visualización— y cuestan mucho más: un recolector, un
almacén, un panel y su mantenimiento.

**El orden sensato es: correlación primero, trazas cuando el sistema lo pida.**
Newman lo plantea igual al hablar de qué hace falta para operar varios servicios:
lo primero es poder seguir una petición [@newman-building-microservices].

## ⚠️ El fallo que arruina un registro

**No limpiar el contexto del hilo.**

En Spring, el hilo vuelve al grupo al terminar la petición y se reutiliza. Sin el
`finally` que borra el identificador, la petición siguiente **hereda el de la
anterior**.

El resultado es peor que no tener correlación: los registros parecen correctos,
agrupan eventos que no van juntos, y quien investiga un incidente sigue un rastro
falso durante horas.

Es el mismo tipo de fallo que el estado global de la clase 027 —estado que
sobrevive a la petición— con la agravante de que aquí **no rompe nada**: solo
miente. Un fallo que rompe se arregla; uno que miente se cree.

## Fuentes

- [@newman-building-microservices] Newman, Sam. *Building Microservices*, 2.ª ed. O'Reilly Media, 2021. ISBN 9781492034025 — <https://openlibrary.org/isbn/9781492034025>
