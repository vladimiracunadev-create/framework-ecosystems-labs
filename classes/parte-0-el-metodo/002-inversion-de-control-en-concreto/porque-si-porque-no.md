# Por qué sí y por qué no — Inversión de control, en concreto

> [⬅️ Clase 002](README.md) · [📚 Parte 0](../README.md)

La inversión de control no es una característica que se elija: viene con el
framework. Lo que sí se elige es **cuánta**, y esta tabla ordena el elenco por
ese eje.

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | La inversión mínima que sigue siendo útil: registras funciones y ahí acaba la magia. Todo el camino entre la petición y tu función se puede leer en tu propio archivo, y cualquiera con dos días de JavaScript entiende `app.get("/x", f)`. | Cuando quieres que el framework haga más: construir objetos, resolver dependencias, aplicar reglas transversales por convención. Nada de eso viene, así que lo montas tú y acabas escribiendo un contenedor peor. | Que el framework no puede ayudarte con lo que no sabe. Sin registro central de piezas, no hay nadie a quien preguntar «¿quién depende de qué?». |
| [FastAPI](../../../atlas/fichas/fastapi.md) | La inversión llega hasta el arranque —tú declaras, otro ejecuta— y hasta los argumentos: el sistema de `Depends` construye lo que tu función pide. Es mucha potencia con muy poca ceremonia, y la firma de la función queda como documentación ejecutable. | Cuando el equipo no conoce el mecanismo: una firma con tres `Annotated[..., Depends(...)]` es densa, y lo que ocurre antes de entrar en la función deja de ser evidente. | Un arranque en dos piezas —aplicación y servidor— que hay que entender para desplegar, y un modelo de dependencias que es fácil de usar y difícil de depurar cuando falla. |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Cuando el sistema es grande y dura años: el contenedor conoce todas las piezas, así que puede aplicar seguridad, transacciones, métricas y trazas sin que cada persona se acuerde. La estructura no depende de la disciplina individual. | Para algo pequeño. Y cuando lo que hace falta se sale de lo previsto: entender el orden de la autoconfiguración es una habilidad en sí misma, y hasta ese día era invisible. | **El silencio.** Si tu clase queda fuera del ámbito de exploración, no hay error: la ruta simplemente no existe. Menos código que escribir, y fallos que no gritan. |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | El mejor equilibrio del elenco para quien está aprendiendo el mecanismo: hay contenedor completo, y aun así **las dos fases están escritas** —`Build` y `Run`—, así que el momento en que el control cambia de manos se ve en el archivo. | Cuando quieres arrancar con lo mínimo: incluso una API mínima arrastra un contenedor de servicios y su configuración, y hay que saber qué es un *scope* antes de tener un problema de *scopes*. | Un vocabulario propio —servicios, esquemas, políticas, opciones— que hay que aprender antes de poder leer el `Program.cs` de otro. |

## La pregunta que decide

**¿Cuánto quieres que ocurra entre que llega la petición y entra tu función?**

Poco: la depuración es leer tu archivo. Mucho: el framework aplica por su
cuenta reglas que de otro modo alguien tendría que recordar en cada endpoint —
y la que se olvida es la que acaba en el informe de seguridad.

No hay respuesta general. Hay una respuesta por producto, por equipo y por
horizonte, y ponerle números a eso es lo que hace la clase 006.

## Lo que esta clase deja pendiente a propósito

Que el framework llame a tu función obliga a que sepa **construirla y darle lo
que necesita**. Ese es el contenedor de inversión de control, y tiene su propia
clase: la [036](../../parte-2-la-tuberia/036-inyeccion-de-dependencias/README.md).

Aquí solo se ha demostrado el hecho: registrar no es llamar, y quien llama es
él.
