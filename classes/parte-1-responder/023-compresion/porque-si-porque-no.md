# Por qué sí y por qué no — Compresión

> [⬅️ Clase 023](README.md) · [📚 Parte 1](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Configuración pura: se activa o desactiva por entorno sin recompilar | Invisible en el código; hay que saber que existe el ajuste | Buscar en las propiedades para entender el comportamiento |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Una línea y funciona | No distingue tipos: comprime todo lo que pase del umbral | CPU gastada en contenido ya comprimido |
| [Express](../../../atlas/fichas/express.md) | Función filtro para decidir caso a caso | Dependencia externa | Una biblioteca más que mantener |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | **Desactiva la compresión sobre HTTPS por omisión**, por seguridad | Dos pasos y más ceremonia | Verbosidad, a cambio de una precaución que los otros tres no toman |

## 🧭 La decisión que precede al framework

**Antes de elegir cómo comprimir, decide si debes comprimir aquí.** Si hay un
servidor de entrada o una red de distribución delante, probablemente ya lo hace,
y hacerlo dos veces gasta CPU sin ganar nada.

Esa es una decisión de arquitectura, no de framework, y va antes que las cuatro
filas de arriba.

## 🔒 La fila que merece atención

De los cuatro, **solo ASP.NET Core desactiva la compresión sobre HTTPS por
omisión**. La razón es real: comprimir en la misma respuesta un secreto y
contenido que un atacante controla permite deducir el secreto observando el
tamaño resultante.

No significa que los otros tres sean inseguros — significa que la precaución es
tuya. Y es un ejemplo excelente del criterio del
[módulo 11](../../../curriculum/11-seleccion-y-sostenibilidad.md): **los valores
por omisión de un framework codifican las prioridades de quien lo escribió**. Uno
priorizó la seguridad y tres priorizaron que funcione a la primera. Ninguna de
las dos es incorrecta, y conviene saber cuál te tocó.

Adkins y sus coautores llaman a esto valores por omisión seguros: la
configuración inicial debe ser la prudente, porque es la que se queda
[@adkins-building-secure-reliable].

## Fuentes

- [@adkins-building-secure-reliable] Adkins, Heather; Beyer, Betsy; Blankinship, Paul; Lewandowski, Piotr; Oprea, Ana; Stubblefield, Adam. *Building Secure and Reliable Systems*. O'Reilly Media, 2020. ISBN 9781492083122 — <https://openlibrary.org/isbn/9781492083122>
