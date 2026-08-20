# Por qué sí y por qué no — Respuesta en flujo

> [⬅️ Clase 022](README.md) · [📚 Parte 1](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Generador asíncrono: el productor de datos no sabe nada de HTTP y se prueba solo | Exige entender el modelo asíncrono de Python | Un `await` bloqueante dentro del generador congela el bucle de eventos |
| [Express](../../../atlas/fichas/express.md) | `write`/`end` es lo más directo que existe | Sin abstracción: la lógica de producción y la de envío se mezclan | Código menos separable |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `StreamingResponseBody` libera el hilo del contenedor durante el envío | Sin esa abstracción, un flujo largo retiene un hilo del grupo | Recordar usarla, o agotar el grupo |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Control total del búfer y del momento de vaciar | **El vaciado es tuyo**: sin él no hay flujo, y el cuerpo es idéntico | Un fallo silencioso que ninguna prueba de contenido detecta |

## 🧭 El eje real: qué cuesta mantener mil flujos abiertos

Un flujo no es una petición rápida: es una conexión abierta durante segundos o
minutos. Mil conexiones así cuestan cosas distintas según el modelo:

| Modelo | Coste por flujo abierto | Frameworks |
| --- | --- | --- |
| Bucle de eventos | una corrutina o devolución de llamada: kilobytes | FastAPI, Express |
| Un hilo por petición | un hilo entero: megabytes de pila | Spring Boot sin la abstracción |
| Tareas asíncronas | una tarea: barato | ASP.NET Core |

Por eso `StreamingResponseBody` existe: **devuelve Spring Boot al terreno
barato**. Sin ella, un servidor con 200 hilos atiende 200 flujos lentos y deja de
responder a todo lo demás — el patrón que Nygard describe como agotamiento del
grupo de recursos [@nygard-release-it].

Es también la razón de que Node y Python ganaran terreno en aplicaciones de
tiempo real antes de que la JVM tuviera respuesta. El
[módulo 02](../../../curriculum/02-arquitectura-de-frameworks.md) desarrolla esa
comparación con el detalle que aquí solo se apunta.

## ⚠️ El fallo que ninguna prueba de contenido detecta

**ASP.NET Core sin `FlushAsync` produce el mismo cuerpo.** El contrato pasa, el
usuario espera hasta el final, y nada en el sistema avisa.

Verificar el comportamiento temporal exigiría un cliente que lea a trozos y mida
el instante de llegada de cada uno. No está en este contrato, y saber que **este
contrato no lo cubre** es parte de la clase: una prueba verde delimita lo que
comprobó, no lo que funciona.

## Fuentes

- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
