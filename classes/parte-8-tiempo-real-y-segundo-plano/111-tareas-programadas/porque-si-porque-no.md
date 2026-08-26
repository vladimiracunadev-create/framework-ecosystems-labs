# Por qué sí y por qué no — Tareas programadas

> [⬅️ Clase 111](README.md) · [📚 Parte 8](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | Un temporizador es un temporizador: nada que aprender | Ni calendario ni cerrojo: las dos cosas de fuera | Elegir y mantener dos dependencias más |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Deja la decisión abierta, y aquí eso se agradece | No hay programador ninguno en el framework | Escoger entre APScheduler y Celery beat el primer día |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `@Scheduled` con calendario: lo más completo de los cuatro | Lo cómodo que es invita a no preguntarse lo del cerrojo | Añadir ShedLock o Quartz, que nadie recuerda hasta el fallo |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `PeriodicTimer` no solapa tics dentro de la instancia | «Cada tanto», no «los martes a las tres» | Hangfire o Quartz.NET para calendarios de verdad |

## 🧭 Lo que este contrato no puede probar

- **Dos procesos de verdad.** Los dos programadores viven en el mismo proceso y
  comparten el cerrojo a propósito, porque es lo que en producción sería una
  tabla o una clave de Redis. Lo que falta es la red entre ellos, con su latencia
  y sus caídas.
- **Qué pasa si el dueño del cerrojo se muere.** La caducidad está puesta y
  declarada; matar a la instancia a medias y comprobar que la siguiente recoge el
  turno pide un banco de pruebas que este contrato no monta.
- **Una expresión de calendario.** Aquí se dispara cada cien milisegundos. Que
  «los martes a las tres» funcione con cambios de hora y zonas horarias es un
  problema entero y distinto.
- **Un cerrojo que caduque antes de tiempo.** El fallo más sutil de esta clase
  —caducidad más corta que la tarea— se explica y no se reproduce.

## 💡 Lo que hay que llevarse

Lo primero es la brecha, y es la más constante de esta parte entera: **los cuatro
frameworks resuelven programar y ninguno resuelve no duplicar**. Programar es la
mitad fácil y es la que todos enseñan; la mitad difícil se queda para una
biblioteca de terceros con nombre propio —ShedLock, Hangfire, Celery beat— que
hay que conocer y añadir.

Lo segundo es que este fallo **no se reproduce en pruebas**, porque en pruebas
hay una instancia. Y aparece aunque nadie haya escalado nada: un despliegue sin
corte arranca la nueva antes de parar la vieja, y durante ese minuto hay dos
temporizadores. Si la tarea de ese minuto era cobrar, se cobró dos veces.

Lo tercero es la propiedad del cerrojo que se olvida siempre: **tiene que
caducar**, y la caducidad tiene que ser mayor que lo que tarda la tarea en su
peor día. Sin caducidad, una instancia que muera con el turno cogido deja la
tarea parada para siempre —y eso es peor que la duplicación, porque no falla:
simplemente deja de pasar, y nadie se entera hasta que preguntan por el informe
que no llegó—. Con una caducidad demasiado corta, la segunda instancia coge el
turno a mitad de la tarea y vuelve la duplicación.

Y lo cuarto, que es la pregunta que ahorra la mitad del trabajo: **¿pasa algo si
esto se ejecuta dos veces?** Para muchas tareas la respuesta es que no —recalcular
un agregado, limpiar temporales— y entonces no hace falta cerrojo ninguno. La
clase 112 lleva esa idea hasta el final: lo que se puede repetir sin daño no hay
que protegerlo de la repetición.

## Fuentes

- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@spring-boot-docs] *Spring Boot — Documentación oficial* — <https://spring.io/projects/spring-boot>
