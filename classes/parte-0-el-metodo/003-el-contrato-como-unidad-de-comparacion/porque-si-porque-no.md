# Por qué sí y por qué no — El contrato como unidad de comparación

> [⬅️ Clase 003](README.md) · [📚 Parte 0](../README.md)

Esta clase no elige framework: elige **método**. Aun así, el ejercicio deja una
tabla útil, porque lo que cada framework hace por omisión dice para quién está
pensado.

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | Cumplir el contrato cuesta tres llamadas encadenadas y se lee de un vistazo. Nada se interpone entre lo que escribes y lo que sale por el cable, así que depurar una respuesta es leer una línea. | Cuando el equipo crece: nada ata el `201` a su `Location` ni impide un cuerpo en el `204`, y la corrección depende de que cada persona se acuerde en cada endpoint. | Su `404` por omisión es **HTML con una traza**. Está pensado para un navegador, y en una API es una respuesta que ningún cliente sabe leer — y que además filtra rutas del código. |
| [FastAPI](../../../atlas/fichas/fastapi.md) | La omisión más cercana a una API moderna del elenco: el error ya es JSON y el código de estado se declara en el decorador, sin construir la respuesta a mano. | Cuando el formato de error tiene que ser uno concreto —el de la empresa, o el `application/problem+json` de la clase 040—: su `{"detail": …}` está en todas partes y salirse obliga a un manejador propio. | Una convención de error muy presente. Es buena, y es **suya**: cuanto más te apoyas en ella, más se nota el día que un consumidor externo pide otra. |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | **El tipo impide el error**: `created(uri)` no deja emitir un 201 sin `Location`, y `noContent()` no admite cuerpo. Para un equipo grande, eso vale más que cualquier convención escrita en un documento. | Para un servicio pequeño: `ResponseEntity<Map<String, String>>` es mucha ceremonia para devolver dos campos, y el arranque completo es desproporcionado. | Verbosidad, y un `404` por omisión con **su propia forma** —`timestamp`, `path`, `error`—, que es informativa en desarrollo y es más de lo que quieres publicar. |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | La misma protección de tipo que Spring con la mitad de ceremonia: `Results.Created(uri, valor)` y `Results.NoContent()` en API mínimas. Es el mejor equilibrio del elenco entre concisión y garantías. | Cuando no quieres su vocabulario: servicios, resultados tipados y opciones hay que conocerlos antes de leer un `Program.cs` ajeno. | Su `404` por omisión **no lleva cuerpo**. Es el valor que más silenciosamente rompe a un cliente: no es un formato distinto, es cero bytes. |
| [Laravel](../../../atlas/fichas/laravel.md) | Cuando el producto es una aplicación web completa: el grupo `web` trae sesión, cookies cifradas y CSRF puestos, y para una API el grupo `api` los quita. La decisión se toma **una vez, en un sitio**, y no ruta a ruta. | Para un servicio pequeño y sin estado: arrastra una estructura de proyecto que solo compensa si vas a usarla. Y su `404` por omisión es la página HTML de un sitio web. | Que la palabra `web` o `api` en `bootstrap/app.php` decide más que cualquier línea de las rutas. Elegir mal ahí produce un `419` en todos los `POST` y un rato de desconcierto. |

## La pregunta que decide

Para el método, no para el framework: **¿qué comportamiento vas a exigir antes
de mirar ninguna implementación?**

Si no puedes responder eso, cualquier comparación que hagas después describirá
lo que los frameworks hacen, no lo que tú necesitas. Y describir no es decidir.

## Cuándo el contrato está mal

Ceder para que un framework pase invalida la comparación. Pero hay un caso en
que el contrato es el equivocado, y conviene saber distinguirlo:

- **Exige algo que el estándar no exige.** Si HTTP admite dos códigos para el
  mismo hecho, elegir uno mide la preferencia de quien escribió el contrato.
  Este repositorio tiene un campo para eso —`estado_en`— y se usa, por ejemplo,
  en la respuesta a una comprobación previa de CORS.
- **Describe una creencia y no un comportamiento.** Le pasó a la clase 056:
  exigía «exactamente 2 consultas» a la carga anticipada, y Hibernate y EF Core
  la resuelven con **una** unión. El contrato no describía un fallo de esos
  frameworks; describía una idea equivocada de quien lo escribió. Se cambió para
  medir el **crecimiento**, que no depende de la estrategia.

En los dos casos se corrige **para todos** y se explica en la clase. Lo que no
se hace nunca es aflojarlo para uno.
