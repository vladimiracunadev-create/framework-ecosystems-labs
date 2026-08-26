# Por qué sí y por qué no — Eventos de dominio

> [⬅️ Clase 113](README.md) · [📚 Parte 8](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | Quince líneas y el bus entero se lee de un vistazo | Nada del framework: la protección del emisor la pones tú | Acordarse del `try` dentro del bucle |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Lo mismo, y un diccionario de listas es idiomático | Lo mismo | Lo mismo |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Lo trae de serie, y los consumidores se descubren solos | Síncrono, en la transacción, y una excepción rompe la petición | Conocer dos trampas que nadie espera |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | El contenedor lo hace natural, con dependencias por consumidor | Hay que registrarlo en el arranque, no basta con escribirlo | Un sitio más donde acordarse de dar de alta cosas |

## 🧭 Lo que este contrato no puede probar

- **Que el fallo se recupere.** Las cuatro implementaciones capturan y siguen, y
  las cuatro declaran que el fallo se pierde. Reintentarlo pide que el evento
  esté guardado antes de publicarse, y eso es una tabla y una decisión de
  arquitectura.
- **La transacción.** La trampa más cara de Spring —que el consumidor corre
  dentro de la transacción de quien publica— necesita una base de datos para
  verse, y esta clase no la tiene.
- **Un consumidor asíncrono.** Todo aquí es síncrono y antes de contestar.
  Combinar esta clase con la 110 —que el consumidor encole en lugar de trabajar—
  es lo que hace falta en producción y no está montado.
- **El orden entre consumidores.** Aquí van en orden de registro. Si dos
  consumidores dependen del orden, el bus deja de ser un bus y hay un problema de
  diseño escondido.

## 💡 Lo que hay que llevarse

Lo primero es que **un bus de eventos no es infraestructura**. Son quince líneas
en tres de los cuatro frameworks, y cero en Spring. Lo que cambia no es la
tecnología: es la dirección de las llamadas. El alta deja de llamar al correo y
pasa a anunciar lo que pasó; quien tenga algo que hacer con eso, que se apunte.
Y a partir de ahí, añadir la quinta reacción no toca el alta.

Lo segundo es la línea que decide si esto vale: **el `try` dentro del bucle de
publicar**. Sin él, el primer consumidor que reviente deja sin ejecutar a los
siguientes y devuelve el error a quien publicó —es decir, rompe un alta que ya
estaba hecha por culpa de un correo—. Es exactamente el problema que el
desacoplamiento venía a resolver, reaparecido por la puerta de atrás.

Lo tercero son las dos trampas de Spring, que son la contrapartida de traerlo de
serie: **es síncrono y dentro de la misma transacción**, y **una excepción del
consumidor sube hasta quien publicó**. Las dos pueden ser lo que quieres —que el
correo no salga si la transacción se deshace es una buena propiedad— y ninguna es
lo que la gente espera por defecto de algo que se llama bus de eventos.

Y lo cuarto, el agujero que las cuatro dejan y las cuatro declaran: **el fallo se
pierde**. Capturar y seguir es lo mínimo correcto y no es suficiente. Para que un
consumidor que falla se pueda reintentar, el evento tiene que estar guardado
antes de publicarse —en la misma transacción que el alta, idealmente— y alguien
tiene que releerlo después. Ese patrón tiene nombre y es la pieza que convierte
esta clase en algo de producción; combinarlo con la idempotencia de la clase 112
es lo que hace que reintentar no duplique.

## Fuentes

- [@hohpe-woolf-eip] Hohpe, Gregor; Woolf, Bobby. *Enterprise Integration Patterns*. Addison-Wesley, 2003. ISBN 9780321200686 — <https://openlibrary.org/isbn/9780321200686>
- [@evans-ddd] Evans, Eric. *Domain-Driven Design*. Addison-Wesley, 2003. ISBN 9780321125217 — <https://openlibrary.org/isbn/9780321125217>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
