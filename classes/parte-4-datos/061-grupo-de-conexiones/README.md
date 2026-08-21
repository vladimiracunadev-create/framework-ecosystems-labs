# Clase 061 — Grupo de conexiones

> [⬅️ 060](../060-cuando-salir-del-orm/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [062 ➡️](../062-cache-de-lectura/README.md)
>
> Parte **4 — Datos** · Nivel **🔴 avanzado** · Pista **`datos`**
>
> ✅ **Clase construida** — 2 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Entender **el recurso escaso** que hay detrás de cada consulta, y qué pasa cuando
se acaba.

## 🎬 Por qué el elenco es de dos

El grupo de conexiones **no es del ORM: es del controlador**. Prisma y Entity
Framework Core aparecían en el elenco original de esta clase y se han quitado por
una razón concreta y verificable:

| ORM | Grupo | ¿Se puede observar? |
| --- | --- | --- |
| SQLAlchemy | `QueuePool` propio | **sí**: `size()`, `checkedout()` |
| Hibernate (Spring Boot) | HikariCP | **sí**: `HikariPoolMXBean` |
| Prisma | del motor de consultas, `connection_limit` | no expone el número prestado |
| EF Core con SQLite | del proveedor, sin ajustes | no |

Meterlos igualmente habría exigido **simular** el grupo con un semáforo, y una
simulación no enseña el comportamiento real — enseña el que le programaste. Es la
misma decisión que toma cada clase de este laboratorio: **el elenco es la lista de
frameworks para los que el problema existe de verdad.**

## 🧩 La situación

Un grupo de **dos** conexiones. Tres peticiones a la vez. Y una fuga.

## 🌐 Las implementaciones

[SQLAlchemy con `QueuePool`](implementaciones/sqlalchemy/) e
[Hibernate con HikariCP](implementaciones/hibernate/). Las dos exponen el número
de conexiones prestadas en cada momento, y las dos fallan por el mismo sitio
cuando se acaban.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /grupo` | `tamano: 2`, `en_uso: 0` |
| `GET /consulta` | `ok` |
| `GET /grupo` | `en_uso: 0` — **prestada, no regalada** |
| `GET /tres-a-la-vez` | `completadas: 3`, **`espero_alguna: true`** |
| `GET /agotar` | **`503 GRUPO_AGOTADO`** |
| `GET /grupo` | `en_uso: 0` — se recuperó solo |
| `GET /fugar` | `fugadas: 1` |
| `GET /grupo` | **`en_uso: 1`** — y ahí se queda |

## 📖 Por qué existe el grupo

Abrir una conexión no es abrir un archivo. Es un saludo TCP, una autenticación,
a veces una negociación TLS, y **memoria reservada en el servidor de base de
datos** para esa sesión. Decenas de milisegundos, y un coste que se paga también
al otro lado.

Por eso se reutilizan. El grupo mantiene unas cuantas abiertas y te **presta**
una mientras la necesitas.

Y de ahí salen las tres propiedades que definen esta clase:

1. **Son finitas.** Siempre. El número por omisión es pequeño.
2. **Hay que devolverlas.** Si no, el grupo encoge para siempre.
3. **Cuando no queda ninguna, alguien espera.** Y la espera tiene que tener fin.

## ⚠️ Esperar sin límite es peor que fallar

```python
pool_timeout=1     # SQLAlchemy
```

```properties
spring.datasource.hikari.connection-timeout=1000
```

Sin ese límite, una petición que no consigue conexión **se queda colgada**. Y
mientras espera **retiene su propio hilo**, que también es un recurso finito.

El resultado es un fallo en cascada: la base va lenta → las peticiones esperan →
los hilos se agotan → el servidor deja de aceptar peticiones nuevas, incluida la
de comprobación de salud. Nygard le puso nombre: los recursos integrados —hilos,
conexiones, sockets— se agotan en cadena, y el sistema deja de responder mucho
antes de que la base de datos se caiga [@nygard-release-it].

Un `503` a tiempo, en cambio, **libera el hilo**, le dice al cliente que
reintente y deja el servicio contestando.

## ⚠️ La fuga

```python
fugadas.append(motor.connect())   # pedida y nunca devuelta
```

Es el fallo más difícil de encontrar de esta clase, porque **no hay error**. No
falla nada, no se registra nada. El grupo simplemente tiene una conexión menos, y
el síntoma llega horas después: «la aplicación se cuelga por las tardes».

Las causas habituales son tres, y las tres son omisiones:

- Una excepción entre pedir y devolver, sin `finally`.
- Un `Connection` obtenido a mano y no cerrado.
- Un resultado en flujo cuya conexión se cierra al terminar de leerlo — y nadie
  termina de leerlo.

La defensa está en el lenguaje, no en la disciplina: `with` en Python,
*try-with-resources* en Java, `using` en C#. **Si el préstamo no está dentro de un
bloque, es una fuga esperando a ocurrir.**

Y HikariCP sabe avisar: `leakDetectionThreshold` registra un aviso cuando una
conexión lleva demasiado tiempo fuera. Vale la pena tenerlo puesto.

## 🔬 Qué tamaño debe tener el grupo

La intuición dice «más grande, más rápido». Es falsa.

Cada conexión activa es trabajo real en el servidor de base de datos, que tiene
un número limitado de núcleos y discos. Pasado cierto punto, más conexiones solo
añaden **contención**: el mismo trabajo repartido en más piezas que se pelean.

Dos observaciones prácticas:

- El límite útil lo marca **el servidor**, no tu aplicación. Si tienes diez
  instancias con veinte conexiones cada una, le estás pidiendo doscientas
  sesiones a la base — y ese número suele estar por encima de lo que acepta.
- **La cola es información.** Si `en_uso` roza el máximo de forma sostenida, el
  problema no es el tamaño del grupo: son las consultas, que tardan demasiado y
  retienen su conexión más de lo debido.

De ahí que el dato que hay que vigilar no sea el tamaño, sino **cuánto tiempo se
espera para conseguir una**.

## 🔬 Comparación

| | SQLAlchemy | Hibernate (HikariCP) |
| --- | --- | --- |
| Tamaño | `pool_size` + `max_overflow` | `maximum-pool-size` |
| Espera máxima | `pool_timeout` | `connection-timeout` |
| Prestadas ahora | `pool.checkedout()` | `getActiveConnections()` |
| Detección de fugas | `pool_pre_ping`, registro | `leakDetectionThreshold` |
| Al agotarse | `TimeoutError` | `SQLTransientConnectionException` |

La diferencia de diseño que merece atención es `max_overflow`: SQLAlchemy separa
**el tamaño estable** del **colchón temporal**. Un grupo de cinco con diez de
desbordamiento mantiene cinco abiertas y abre hasta diez más en un pico,
cerrándolas después. Hikari tiene un solo número, y la elasticidad la da
`minimum-idle`.

## ⚠️ Errores frecuentes

- **No poner límite de espera.** Convierte lentitud en caída.
- **Pedir una conexión fuera de un bloque con cierre garantizado.**
- **Agrandar el grupo ante la contención.** Casi siempre empeora.
- **No contar las instancias.** El límite es del servidor, no del proceso.
- **Hacer llamadas de red con una conexión prestada.** La retiene durante toda
  la espera, para nada.
- **Abrir la conexión antes de necesitarla.** Sobre todo antes de validar la
  entrada: una petición inválida no debería consumir el recurso escaso.

## ✅ Verificación

```bash
node scripts/run-class.mjs 061
```

## 🧪 Reto de transferencia

Llama a `/fugar` dos veces y después a `/consulta`. Con el grupo de dos, la
segunda fuga lo deja a cero y **la consulta tarda un segundo y falla** — sin que
nada en el código de `/consulta` haya cambiado. Ese salto entre «funciona» y «no
funciona» sin ninguna modificación es la forma exacta en que este fallo se vive
en producción.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 051 — Conectar a una base de datos](../051-conectar-a-una-base-de-datos/README.md)
- [Clase 032 — Tiempos de espera](../../parte-2-la-tuberia/032-tiempos-de-espera/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@gregg-systems-performance] Gregg, Brendan. *Systems Performance*, 2.ª ed. Addison-Wesley, 2020. ISBN 9780136820154 — <https://openlibrary.org/isbn/9780136820154>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
