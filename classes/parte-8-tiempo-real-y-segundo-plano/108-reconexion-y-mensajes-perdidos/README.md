# Clase 108 — Reconexión y mensajes perdidos

> [⬅️ Clase 107](../107-websocket/README.md) · [📚 Parte 8](../README.md) · [🎓 Clases](../../README.md) · [109 ➡️](../109-estado-de-conexion-con-varias-instancias/README.md)
>
> Parte **8 — Tiempo real y segundo plano** · Nivel **🔴 avanzado** · Pista **`tiempo-real`** (Tiempo real y segundo plano)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

La clase 107 dejó una conexión abierta y no dijo qué pasa cuando se cae. **Y se
cae**: un móvil que cambia de antena, un portátil que se suspende, un
intermediario que corta lo que lleva un minuto callado, un despliegue.

Y hay dos problemas debajo, que se confunden constantemente:

1. **Volver a conectar.** El fácil.
2. **No perderse nada.** El difícil, y **reconectar no lo resuelve**.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Escribir una espera creciente** y decir por qué reintentar cada segundo tumba
  al servidor que se acaba de levantar.
- **Reanudar sin pérdidas** con un historial numerado y un «por dónde iba».
- **Reconocer el fallo silencioso**: reconectar bien y perder mensajes sin que
  nada dé error.
- **Saber qué te regala tu biblioteca** y, sobre todo, qué no.

## 🧩 La situación

Tres mensajes con la conexión abierta. **Un corte de verdad**: se cierra el
socket. Dos mensajes más con nadie escuchando. Una espera creciente. Y una
reconexión que dice «yo iba por el 3».

La suma tiene que dar exactamente `1,2,3,4,5`. Ni uno menos, ni uno repetido.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /` | la portada dice dónde está su canal y por dónde se reanuda |
| 2 | `GET /reconexion.json` | con la conexión abierta llegan los tres primeros |
| 3 | `GET /reconexion.json` | **al reconectar llegan justo los dos que faltaban** |
| 4 | `GET /reconexion.json` | ni perdidos ni duplicados: la suma da `1,2,3,4,5` |
| 5 | `GET /reconexion.json` | la espera crece: 100, 200, 400 |
| 6 | `GET /reconexion.json` | quién reconecta, cómo se reanuda y qué falta |

El caso 4 es el que separa esta clase de una demostración de reconexión:

```json
        "json_contiene": {
          "ni_perdidos_ni_duplicados": true,
          "ninguno_repetido": true
        }
```

Reconectar sin historial pasa los casos 2 y 5 y falla el 4 en silencio. Es
exactamente lo que pasa en producción.

<!-- generado: fichas -->

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Express** | framework web de Node.js (JavaScript) | 2010 | MIT | OpenJS Foundation |
| **FastAPI** | framework web de Python (Python) | 2018 | MIT | proyecto independiente |
| **Spring Boot** | framework de aplicación de JVM (Java) | 2014 | Apache-2.0 | Broadcom/VMware y colaboradores |
| **Socket.IO** | realtime-library de Node.js (JavaScript) | 2010 | MIT | proyecto independiente |

### 🔧 Express

Definió el modelo de middleware encadenado que copiaron casi todos los frameworks de Node.js. Minimalista no significa biblioteca: posee el bucle de peticiones.

- **Documentación oficial:** <https://expressjs.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `express ^5.1.0, ws ^8.18.0`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node server.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

### 🔧 FastAPI

Deriva validación, serialización y documentación OpenAPI de las anotaciones de tipo. Demostró que el tipado opcional de Python podía ser infraestructura, no adorno.

- **Documentación oficial:** <https://fastapi.tiangolo.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `fastapi==0.121.3, uvicorn==0.40.0, httpx==0.28.1, websockets==16.0`
- **Necesita en el PATH:** `python`

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 python -m uvicorn main:app --host 127.0.0.1 --port 3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `main.py` | código Python |
| `requirements.txt` | dependencias de Python, una por línea, con versión fijada |

### 🔧 Spring Boot

Autoconfiguración y servidor incrustado sobre Spring. Convirtió un framework famoso por su configuración XML en uno de arranque inmediato.

- **Documentación oficial:** <https://spring.io/projects/spring-boot>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web, spring-boot-starter-websocket`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-108-1.0.0.jar --server.port=3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `pom.xml` | manifiesto de Maven: el proyecto, su Java, sus dependencias y cómo se empaqueta |
| `src/main/java/labs/Aplicacion.java` | código Java |

### 🔧 Socket.IO

Abstrae el tiempo real con reconexión y respaldo automáticos. Popularizó los eventos bidireccionales antes de que WebSocket fuera universal.

- **Documentación oficial:** <https://socket.io/docs/v4/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `express ^5.1.0, socket.io ^4.8.1, socket.io-client ^4.8.1`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node server.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

### Express · los dos problemas, separados

[`express/server.mjs`](implementaciones/express/server.mjs):

```javascript
 *   1. **Volver a conectar.** Es el fácil, y se resuelve con espera creciente:
 *      100, 200, 400, 800… Si todo el mundo reintenta cada segundo, el servidor
 *      que se acaba de caer se vuelve a caer al levantarse.
 *   2. **No perderse nada.** Es el difícil, y no lo resuelve reconectar: mientras
 *      no había conexión, el servidor siguió teniendo cosas que decir. Hace falta
 *      que los mensajes tengan número y que el cliente diga por cuál iba.
```

```javascript
 * Lo segundo es exactamente lo que la clase 106 traía de regalo con
 * `Last-Event-ID`. Aquí hay que escribirlo.
```

El historial, con la decisión que trae detrás:

```javascript
 * Sin él, reconectar sirve para volver a estar en línea y no para recuperar lo
 * que pasó mientras tanto. Aquí es una lista en memoria; en un sistema real es
 * una tabla o un registro de eventos, y su tamaño es una decisión —cuánto hacia
 * atrás se puede reanudar— que hay que tomar a propósito.
```

Lo que falta para producción, dicho donde se define la política:

```javascript
 * Falta una cosa que un cliente serio sí hace y aquí no: **ruido**. Si mil
 * clientes se cayeron a la vez, con esta tabla los mil reintentan a la vez, y a
 * los 100 milisegundos exactos. Sumar un azar de hasta el propio intervalo es lo
 * que evita esa avalancha, y se llama fluctuación.
```

**Y un fallo real, encontrado construyendo esta clase:**

```javascript
 * El detalle que costó una tarde: **el recolector de mensajes se engancha antes
 * de que la conexión se abra**, no después. Al reanudar, el servidor manda el
 * historial en cuanto acepta la conexión, y si el cliente espera al evento de
 * apertura para ponerse a escuchar, esos primeros mensajes ya han pasado. Es un
 * fallo real de los clientes escritos deprisa y aquí se vio en el acto: la
 * reanudación devolvía una lista vacía.
```

### FastAPI · escribirlo a mano tiene una ventaja

[`fastapi/main.py`](implementaciones/fastapi/main.py):

```python
La ventaja de escribirlo a mano es que se ve. El historial, el número de cada
mensaje y el «por dónde iba» están en veinte líneas, y entenderlas es entender
por qué la clase 106 salía gratis: `Last-Event-ID` es exactamente esto, ya hecho.
```

Y la reanudación, que son cuatro líneas:

```python
    # LA REANUDACIÓN. El cliente dice por cuál iba y el servidor le manda lo que
    # se perdió, en orden, antes de nada más.
    desde = int(conexion.query_params.get("desde", 0))
    for mensaje in [m for m in HISTORIAL if m["id"] > desde]:
        await conexion.send_text(json.dumps(mensaje))
```

### Spring Boot · lo mismo, y la puerta a delegarlo

[`spring-boot/src/main/java/labs/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java):

```java
 * Spring no reconecta por ti —eso es del cliente— y no guarda historial. Lo que
 * si tiene, y conviene saberlo porque cambia la conversacion, es la capa STOMP
 * con un intermediario de mensajes detras: con RabbitMQ o ActiveMQ, la
 * durabilidad y el «por donde iba» dejan de ser codigo de la aplicacion y pasan
 * a ser configuracion de la cola.
```

```java
 * Aqui se escribe a mano, como en las otras tres, por dos motivos: para que la
 * comparacion sea de la misma cosa, y porque **las veinte lineas de abajo son
 * exactamente lo que un intermediario de mensajes hace por dentro**. Entenderlas
 * es lo que permite elegir despues con criterio.
```

### Socket.IO · resuelve uno de los dos, y el otro falla peor

[`socketio/server.mjs`](implementaciones/socketio/server.mjs) — **este es el
párrafo de la clase:**

```javascript
 *   - **Volver a conectar**: lo hace solo. Espera creciente, con fluctuación, con
 *     un tope, y sin escribir una línea. Es lo que en las otras tres
 *     implementaciones ocupa veinte.
 *   - **No perderse nada**: no lo hace. Y su forma de fallar es peor que no
 *     hacerlo, porque la reconexión automática da la sensación de que todo va
 *     bien: se reconecta solo, no hay ningún error en ninguna consola, y los
 *     mensajes de mientras no están.
```

Con la alternativa de la casa y su límite:

```javascript
  // La alternativa de la casa es `connectionStateRecovery` en las opciones del
  // servidor: guarda los mensajes de los últimos dos minutos y los reenvía sola
  // al reconectar. Es mejor que esto para lo que cubre, y hay que saber que su
  // ventana es de tiempo y no de mensajes: una desconexión larga sigue
  // perdiendo.
```

## 🔬 Comparación

| | ¿Reconecta solo? | ¿Reanuda sin pérdidas? | Qué ofrece la casa |
| --- | :---: | :---: | --- |
| **Express** (`ws`) | ❌ | ❌ | nada: las dos cosas a mano |
| **FastAPI** | ❌ | ❌ | nada: las dos cosas a mano |
| **Spring Boot** | ❌ | ❌ | STOMP con intermediario de mensajes |
| **Socket.IO** | ✅ con fluctuación y tope | ❌ | `connectionStateRecovery`, con ventana de tiempo |

Y el resultado, idéntico en los cuatro porque las cuatro escriben lo mismo:

```text
antes del corte: 1, 2, 3   ·   durante: 4 y 5 con nadie escuchando
al reconectar desde el 3:  4, 5      →  1,2,3,4,5
```

Cuatro lecturas:

- **Ninguno de los cuatro resuelve el problema difícil.** Reanudar sin pérdidas
  es código de la aplicación en los cuatro: un historial numerado y un «por dónde
  iba». Veinte líneas, y hay que escribirlas.
- **Socket.IO regala el problema fácil, y eso empeora el difícil.** Reconectar
  solo está muy bien, y hace que perder mensajes no dé ningún error: se
  reconecta, no hay avisos, y falta lo de en medio. Un fallo que no se nota es
  peor que uno que se nota.
- **La clase 106 traía esto de serie.** `Last-Event-ID` es exactamente el «por
  dónde iba» de esta clase, puesto por el navegador sin que nadie lo programe. Si
  la aplicación no necesita la otra dirección, ahí hay una clase entera de trabajo
  que no hay que hacer.
- **La decisión que hay que tomar a propósito es el tamaño del historial.** Cuánto
  hacia atrás se puede reanudar. Nadie la toma, y entonces es «lo que quepa en
  memoria», que es un número que cambia con la carga.

## ⚠️ Errores frecuentes

- **Reconectar cada segundo.** Mil clientes reintentando a la vez tumban al
  servidor que acaba de levantarse. La espera tiene que crecer.
- **Espera creciente sin fluctuación.** Los mil clientes que se cayeron a la vez
  reintentan a la vez, a los 100 milisegundos exactos. Hay que sumar un azar.
- **Creer que reconectar es suficiente.** Es el fallo central de esta clase:
  vuelve la conexión, no vuelven los mensajes, y nada da error.
- **Engancharse a escuchar después de abrir.** El servidor manda el historial en
  cuanto acepta la conexión. Un cliente que espere al evento de apertura para
  ponerse a escuchar se pierde justo lo que venía a recuperar.
- **No decidir el tamaño del historial.** Sin decisión, es «lo que quepa», y una
  desconexión larga se salta el hueco sin avisar.

## ✅ Verificación

```bash
node scripts/run-class.mjs 108
```

Cada implementación monta el corte de verdad y publica lo que recibió en cada
tramo. Para verlo tú:

```bash
curl -s http://127.0.0.1:4100/reconexion.json
```

## 🧪 Reto de transferencia

1. **Corta la red y mira.** Con tu aplicación en tiempo real abierta, desactiva
   la red diez segundos y vuelve a activarla. Si la interfaz vuelve a estar viva
   pero le falta lo de en medio, tienes este fallo.
2. **Busca tu «por dónde iba».** Si tus mensajes no tienen número o identificador
   ordenable, no hay reanudación posible. Añadirlo después significa perder
   durante todo el tiempo en que no estuvo.
3. **Mira tu política de reintento.** Si es un número fijo, calcula qué pasa
   cuando se caen todos tus clientes a la vez y reintentan a la vez.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 106](../106-eventos-enviados-por-el-servidor/README.md) — donde esto venía de regalo
- [Clase 107](../107-websocket/README.md) — la conexión que aquí se corta
- [Clase 112](../112-reintentos-e-idempotencia/README.md) — reintentar sin causar daño, del otro lado
- [Índice de la parte 8](../README.md)

## Fuentes

- [@rfc6455] *RFC 6455 — The WebSocket Protocol*. IETF — <https://www.rfc-editor.org/rfc/rfc6455>
- [@socketio-docs] *Socket.IO — Documentación oficial* — <https://socket.io/docs/v4/>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
