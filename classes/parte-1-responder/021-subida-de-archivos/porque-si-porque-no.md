# Por qué sí y por qué no — Subida de archivos

> [⬅️ Clase 021](README.md) · [📚 Parte 1](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | El límite lo aplica el contenedor **antes** de tu código: la defensa no depende de que la escribas | Invisible en el controlador: quien lo lee no ve que hay un límite | Buscar el ajuste en otro archivo para entender el comportamiento |
| [Express](../../../atlas/fichas/express.md) | El límite está junto a la ruta, a la vista | Necesita biblioteca externa, y el 413 exige manejador de errores | Una dependencia más y su mantenimiento |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Starlette vuelca a disco los cuerpos grandes por su cuenta | El límite lo escribes tú, en un bucle | Código explícito que se puede olvidar |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Acceso tipado al formulario y a sus archivos | Comprueba **después** de leer: la protección real está en el servidor | Configurar Kestrel además del manejador |

## 🧭 Dónde debe estar la defensa

La tabla ordena los cuatro por una sola pregunta: **¿qué pasa si a quien escribe
el manejador se le olvida el límite?**

- **Spring Boot**: no pasa nada malo. El contenedor corta igual.
- **Express y FastAPI**: pasa lo peor. Sin la opción o sin el bucle, no hay tope.
- **ASP.NET Core**: depende del servidor que tengas delante.

Esa es la diferencia entre una defensa **en profundidad** y una defensa que
depende de la memoria de una persona. Adkins y sus coautores lo formulan como
poner los controles en la capa donde no se pueden saltar por descuido
[@adkins-building-secure-reliable]: la capa de plataforma es mejor sitio que el
manejador.

**La conclusión práctica no es «usa Spring».** Es que si tu framework no aplica
el límite por debajo, **debes ponerlo tú y verificarlo con una prueba**. El caso
de 413 de [`contrato.json`](contrato.json) existe por eso: es la única forma de
saber que el límite sigue ahí después del próximo refactor.

## Fuentes

- [@adkins-building-secure-reliable] Adkins, Heather; Beyer, Betsy; Blankinship, Paul; Lewandowski, Piotr; Oprea, Ana; Stubblefield, Adam. *Building Secure and Reliable Systems*. O'Reilly Media, 2020. ISBN 9781492083122 — <https://openlibrary.org/isbn/9781492083122>
