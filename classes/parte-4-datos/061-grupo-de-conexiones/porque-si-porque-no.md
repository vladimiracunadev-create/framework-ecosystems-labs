# Por qué sí y por qué no — Grupo de conexiones

> [⬅️ Clase 061](README.md) · [📚 Parte 4](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [SQLAlchemy](../../../atlas/fichas/sqlalchemy.md) | Separa tamaño estable y colchón: `pool_size` + `max_overflow` | Dos números que interactúan, y el segundo se olvida | Un límite real que no es el que creías |
| [Hibernate](../../../atlas/fichas/hibernate.md) con HikariCP | Valores por omisión sensatos y detección de fugas incorporada | Está puesto sin que nadie lo pida: se hereda sin conocerlo | Descubrirlo el día que falla |

## 🧭 Lo que este contrato no puede probar

Conviene decirlo, porque la clase mide de verdad y hay cosas que no mide:

- **El tamaño correcto.** Depende del servidor de base de datos, del número de
  instancias y de cuánto tardan tus consultas. No hay número universal.
- **Las conexiones muertas.** Un cortafuegos que cierra sesiones inactivas deja
  en el grupo conexiones que parecen buenas y fallan al usarse. La defensa es
  `pool_pre_ping` en SQLAlchemy o `keepaliveTime` en Hikari, y comprobarlo pide
  un servidor de verdad — no SQLite.
- **La reconexión.** Cuando la base se reinicia, el grupo entero queda inválido.
  Cómo se recupera es la diferencia entre un minuto de errores y una hora.

Las tres necesitan una base cliente-servidor, y por eso quedan fuera. Decirlo es
parte del trato: **un verde aquí significa lo que se probó, no «todo bien»**.

## 💡 Lo que hay que llevarse

El grupo de conexiones es el ejemplo más limpio de una idea que aparece en todo
el laboratorio: **hay un recurso finito debajo de una abstracción cómoda**.

`tareas.count()` no parece pedir nada prestado. Y pide una de las dos conexiones
que hay, la retiene mientras dura, y la devuelve. Multiplicado por la carga real,
ese préstamo invisible es el cuello de botella de la mayoría de los servicios que
hablan con una base de datos.

Nygard resume la defensa en una frase que vale para conexiones, hilos, sockets y
memoria: **todo recurso integrado necesita un límite y un plazo**
[@nygard-release-it]. Sin límite se agota; sin plazo, agotarse deja de ser un
error y pasa a ser una parada.

## Fuentes

- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@gregg-systems-performance] Gregg, Brendan. *Systems Performance*, 2.ª ed. Addison-Wesley, 2020. ISBN 9780136820154 — <https://openlibrary.org/isbn/9780136820154>
