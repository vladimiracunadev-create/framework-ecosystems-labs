# Por qué sí y por qué no — Colas de trabajo

> [⬅️ Clase 110](README.md) · [📚 Parte 8](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | Aplazar es no esperar una promesa: no hay nada que aprender | No es paralelismo, y no hay nada que ayude | Un trabajo que calcule bloquea el servidor |
| [FastAPI](../../../atlas/fichas/fastapi.md) | `BackgroundTasks` es una pieza con nombre y se lee sola | Su nombre invita a confundirla con una cola | Descubrir tarde que no reintenta ni sobrevive |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `@Async` es paralelismo de verdad, con grupo de hilos | Dos trampas que fallan en silencio: el proxy y `@EnableAsync` | Depurar por qué la anotación no hace nada |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `Channel` es una cola de verdad, y está en el lenguaje | Hay que montar el consumidor: más piezas que una anotación | Escribir el `BackgroundService`, que son quince líneas |

## 🧭 Lo que este contrato no puede probar

- **Que la cola sobreviva a un reinicio.** No sobrevive en ninguna de las cuatro,
  y las cuatro lo declaran. Probarlo pediría matar el proceso a media cola, que
  es justo lo que el verificador no hace.
- **El reintento.** Si el trabajo falla, aquí no pasa nada: queda «en curso» para
  siempre. Reintentar sin causar daño es la clase 112.
- **La contrapresión.** Qué pasa cuando se encola más rápido de lo que se
  consume. Con un trabajo cada vez no se ve, y es lo que decide si una cola
  aguanta un pico.
- **El agotamiento del grupo de hilos.** En Spring y en ASP.NET el trabajo
  consume hilos de verdad, y con suficientes trabajos a la vez se acaban. Aquí
  hay uno.

## 💡 Lo que hay que llevarse

Lo primero es la pregunta que hay que hacerle a cada petición lenta: **¿cuánto de
esto tiene que ocurrir antes de contestar?** Casi siempre es menos de lo que
parece. Guardar el pedido tiene que ocurrir; mandar el correo de confirmación,
no. Y separar las dos cosas no es solo una mejora de latencia: es lo que impide
que un proveedor de correo caído convierta un pedido bueno en un error.

Lo segundo es el código de estado, que aquí no es un detalle: **202 significa
«aceptado, todavía no hecho»**, y obliga a contestar la pregunta que viene detrás
—dónde se mira el resultado— con una cabecera `Location`. Un 200 en su lugar
miente, y además deja a quien pide sin sitio donde preguntar.

Lo tercero es lo que ninguna de las cuatro implementaciones es: **una cola**. Son
cuatro formas de aplazar dentro del proceso, y las cuatro pierden lo pendiente si
el proceso muere — cosa que pasa en cada despliegue. La diferencia entre aplazar
y encolar es exactamente esa, y saberla es lo que evita descubrirla el día que se
pierden doscientos correos.

Y lo cuarto, una distinción que separa a los ecosistemas y no se ve en el código:
**en Node y en Python aplazar no es paralelizar**. El trabajo corre en el mismo
bucle que atiende las peticiones. Sirve perfectamente para lo que consiste en
esperar —una consulta, una llamada de red— y no sirve para nada que consuma
procesador, porque eso bloquea el servidor igual que si estuviera dentro de la
petición. En Spring y en ASP.NET sí hay hilos de verdad, y a cambio hay un grupo
que se puede agotar. No hay una opción gratis: hay dos formas de quedarse sin
recursos.

## Fuentes

- [@rfc9110] *RFC 9110 — HTTP Semantics*. IETF — <https://www.rfc-editor.org/rfc/rfc9110>
- [@hohpe-woolf-eip] Hohpe, Gregor; Woolf, Bobby. *Enterprise Integration Patterns*. Addison-Wesley, 2003. ISBN 9780321200686 — <https://openlibrary.org/isbn/9780321200686>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
