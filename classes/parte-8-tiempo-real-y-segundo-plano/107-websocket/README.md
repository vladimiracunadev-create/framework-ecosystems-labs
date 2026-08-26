# Clase 107 — WebSocket

> [⬅️ Clase 106](../106-eventos-enviados-por-el-servidor/README.md) · [📚 Parte 8](../README.md) · [🎓 Clases](../../README.md) · [108 ➡️](../108-reconexion-y-mensajes-perdidos/README.md)
>
> Parte **8 — Tiempo real y segundo plano** · Nivel **🔴 avanzado** · Pista **`tiempo-real`** (Tiempo real y segundo plano)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

> 👥 **El elenco se recortó, y conviene decir por qué.** El manifiesto declaraba
> también Phoenix LiveView. Su modelo de canales es una de las mejores respuestas
> que existen a esta pregunta, y necesita otro tiempo de ejecución —la máquina
> virtual de Erlang— que este laboratorio no tiene montado. Antes que escribir
> código que nadie de este repositorio puede ejecutar, se saca del elenco y se
> dice: la clase 009 explica por qué eso se hace así aquí.

## 🎯 Objetivo

La clase 106 dejó una carencia clara: un flujo de eventos solo va del servidor al
cliente. Cuando hace falta la otra dirección **sobre la misma conexión**, aparece
esto.

Y aparece con un precio que hay que poner delante: **deja de ser HTTP**. Y esa
frase no es retórica — se demuestra en esta misma clase, porque el verificador de
esta obra no puede leer nada de lo que pasa después del apretón de manos.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Explicar el apretón de manos** y comprobarlo con un socket TCP y veinte
  líneas.
- **Distinguir un WebSocket de lo que se monta encima** —Socket.IO, STOMP— y
  saber qué se compra y qué se pierde.
- **Nombrar dónde vive la lista de conexiones**, que es la pregunta que hace
  estallar la clase 109.
- **Decir en voz alta qué deja de funcionar** cuando una conexión deja de ser
  HTTP.

## 🧩 La situación

Un canal. Alguien manda «hola», recibe «eco: hola» por la misma conexión, y **un
segundo cliente recibe «difusion: hola»** sin haber pedido nada.

Ese segundo cliente es la razón de que esta clase exista: es lo que un flujo de
eventos no puede hacer sin que el servidor guarde una lista de conexiones
abiertas.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /` | la portada dice dónde está su canal |
| 2 | `GET /ws.json` | **101 y el `accept` del RFC**, calculado bien |
| 3 | `GET /ws.json` | un mensaje va y otro vuelve |
| 4 | `GET /ws.json` | **un segundo cliente recibe lo que dijo el primero** |
| 5 | `GET /ws.json` | los dos sentidos, sobre la misma conexión |
| 6 | `GET /ws.json` | dónde monta cada uno su canal y quién guarda las conexiones |

**El caso 2 es el único que se puede comprobar desde fuera, y por eso es el más
valioso:**

```json
        "json_contiene": {
          "apreton_de_manos": "101",
          "accept_recibido": "s3pPLMBiTxaQ9kYGzzhZRbK+xOo=",
          "accept_es_correcto": true
        }
```

Esa cadena no es un valor cualquiera: es la respuesta que el RFC 6455 obliga a
dar a la clave de ejemplo `dGhlIHNhbXBsZSBub25jZQ==`. Sale igual en los cuatro
frameworks porque **no es de ninguno**.

Y hay algo que este contrato no puede hacer y que enseña más que lo que puede:
**no puede abrir un WebSocket**. La biblioteca de HTTP de Node rechaza la
cabecera `Connection: Upgrade`, y con razón. Por eso los casos 3, 4 y 5 los
comprueba cada implementación abriendo dos clientes de verdad y publicando
literalmente lo que recibió cada uno.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**WebSocket**](../../../glosario/README.md#websocket) | Un canal bidireccional que empieza como una petición HTTP y cambia de protocolo. Da más y cuesta más: la reconexión, el estado de la conexión y el reparto entre instancias son tuyos. |

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
PORT=3000 java -jar target/clase-107-1.0.0.jar --server.port=3000
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

### Express · una biblioteca enganchada al servidor

[`express/server.mjs`](implementaciones/express/server.mjs) — el precio, delante:

```javascript
 * Y aparece con un precio que conviene poner delante: **deja de ser HTTP**. La
 * conexión empieza como una petición normal y a partir del 101 el protocolo es
 * otro. Eso significa que tus intermediarios tienen que saber de esto, que tu
 * autenticación por cabecera solo vale para el apretón inicial, y que ninguna
 * herramienta de HTTP —incluido el verificador de esta obra— puede leer lo que
 * pasa después.
```

Y cómo se monta, que ya es una diferencia:

```javascript
 * `ws` no es un framework: es una biblioteca que se engancha al servidor HTTP
 * que ya existe. Express ni se entera de que esto está aquí, y esa es una
 * diferencia real con Socket.IO —que sí monta lo suyo— y con Spring, que integra
 * el WebSocket en su propio contenedor.
```

**El apretón, explicado donde se hace:**

```javascript
 * Es la única parte del protocolo que se puede comprobar con herramientas de
 * HTTP, y merece verla: el cliente manda una clave al azar en
 * `Sec-WebSocket-Key` y el servidor devuelve, en `Sec-WebSocket-Accept`, el
 * SHA-1 de esa clave concatenada con una cadena fija que está escrita en el RFC.
```

```javascript
 * Esa cadena fija no es un secreto ni una protección: existe para que un
 * servidor que no sepa de WebSocket no pueda contestar por accidente algo que
 * parezca correcto. Con la clave de ejemplo del RFC 6455, la respuesta correcta
 * es siempre la misma, y por eso el contrato la puede exigir literal.
```

Y la difusión, con el aviso de la clase 109 ya puesto:

```javascript
    // Y LA DIFUSIÓN: a todos los demás. Es lo que un flujo de eventos no puede
    // hacer sin que el servidor guarde una lista de conexiones abiertas... que
    // es exactamente lo que hay aquí, en `canal.clients`.
```

### FastAPI · un manejador que no devuelve nada

[`fastapi/main.py`](implementaciones/fastapi/main.py):

```python
FastAPI trae el WebSocket incorporado —viene de Starlette— y el decorador se
parece tanto al de una ruta normal que oculta lo que de verdad cambia: el
manejador **no devuelve nada**. Se queda dentro de un bucle mientras la conexión
viva, y ahí está el precio: mientras dure, hay una tarea ocupada.
```

```python
Lo que no trae es la difusión. La lista de conexiones abiertas hay que llevarla a
mano —el conjunto `SALA` de abajo— y esa lista es exactamente lo que la clase 109
demuestra que se rompe en cuanto hay dos instancias del servidor.
```

Con la cuenta del `accept` escrita para que se vea —

```python
    SHA-1 de la clave concatenada con la cadena fija, en base64. Con la clave de
    ejemplo del RFC la respuesta es siempre la misma, y por eso el contrato la
    puede exigir literal.
```

### Spring Boot · una pieza del framework, no una biblioteca

[`spring-boot/src/main/java/labs/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java):

```java
 * Spring es el unico de los cuatro donde el WebSocket es una PIEZA DEL
 * FRAMEWORK y no una biblioteca enganchada al servidor: se registra en la
 * configuracion, recibe inyeccion de dependencias, y los interceptores del
 * apreton pueden leer la sesion HTTP para saber quien se esta conectando. Eso
 * ultimo resuelve de serie el problema mas incomodo de esta tecnologia —la
 * autenticacion solo existe en el apreton— y en los otros tres hay que montarlo.
```

Y por qué no usa STOMP, que sería su camino cómodo:

```java
 * Y trae ademas una capa mas arriba, STOMP, con destinos, suscripciones y
 * `@MessageMapping`. No se usa aqui a proposito: STOMP es a WebSocket lo que
 * Socket.IO es a WebSocket, y esta clase quiere ensenar el protocolo, no la capa
 * de encima. La comparacion entre las dos capas la hace Socket.IO en el elenco.
```

### Socket.IO · la capa de encima, con su factura

[`socketio/server.mjs`](implementaciones/socketio/server.mjs):

```javascript
 * Está en el elenco de esta clase precisamente por eso. Usa WebSocket cuando
 * puede y se cae a HTTP largo cuando no, tiene su propio formato de mensaje
 * encima del de WebSocket, y añade tres cosas que `ws` no da y que casi todo el
 * mundo acaba escribiendo a mano:
 *
 *   - **eventos con nombre**, en lugar de un canal de texto donde uno se inventa
 *     el formato;
 *   - **salas**, que es la difusión a un subconjunto sin llevar la lista uno
 *     mismo;
 *   - **reconexión con espera creciente**, que es la clase 108 entera.
```

**Y la factura, dicha antes y no después:**

```javascript
 * El precio es igual de concreto: el cliente tiene que ser Socket.IO. Un
 * `new WebSocket(...)` del navegador no habla con esto, y ningún cliente de otro
 * lenguaje tampoco salvo que exista un puerto de la biblioteca. Se cambia
 * interoperabilidad por comodidad, y conviene saberlo antes y no después.
```

Con el primer síntoma visible de esa capa:

```javascript
 * Que la ruta cambie es el primer síntoma de lo que se ha comprado: esto ya no
 * es «un WebSocket en tal sitio», es «un Socket.IO».
```

## 🔬 Comparación

| | Cómo se monta | Ruta del canal | Quién guarda las conexiones |
| --- | --- | --- | --- |
| **Express** | biblioteca `ws` enganchada al servidor HTTP | `/ws` | tú, en `canal.clients` |
| **FastAPI** | decorador de Starlette, con un bucle dentro | `/ws` | tú, en un conjunto del proceso |
| **Spring Boot** | manejador registrado en la configuración | `/ws` | tú, en un conjunto del proceso |
| **Socket.IO** | monta su propia ruta con parámetros | `/socket.io/?EIO=4&…` | la biblioteca, con salas |

Y el apretón, idéntico en los cuatro:

```text
101  ·  Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

Cuatro lecturas:

- **El apretón es del estándar y sale igual en los cuatro.** Es lo único de esta
  clase que se puede comprobar desde fuera, y comprobarlo dice más de lo que
  parece: un servidor que devuelva ese valor implementa el protocolo de verdad.
- **Tres de los cuatro te dejan la lista de conexiones a ti.** Un conjunto en
  memoria del proceso. Funciona perfectamente con una instancia, y la clase 109
  lo rompe con dos.
- **Spring es el único donde esto es del framework.** Se registra en la
  configuración, recibe inyección de dependencias, y el interceptor del apretón
  puede leer la sesión HTTP. Eso último resuelve de serie el problema más
  incómodo: la autenticación solo existe en el apretón.
- **Socket.IO no es un WebSocket, y la ruta lo delata.** Añade eventos con
  nombre, salas y reconexión, que es media clase 108. A cambio, el cliente tiene
  que ser Socket.IO — y eso es lo que hay que decidir el primer día.

## ⚠️ Errores frecuentes

- **Autenticar solo en el apretón y creer que basta.** Las cabeceras viajan una
  vez. Si la sesión caduca a los diez minutos, la conexión sigue abierta. Hay que
  comprobar la autorización por mensaje, o cerrar la conexión al caducar.
- **Guardar la lista de conexiones en memoria del proceso.** Funciona hasta la
  segunda instancia. Es la clase 109 entera, y el fallo es exactamente este.
- **Suponer que un intermediario lo va a dejar pasar.** Un proxy que no sepa de
  esto corta el apretón. Y muchos cortan la conexión si no ve tráfico durante un
  minuto: hay que mandar `ping` de vez en cuando.
- **Elegir WebSocket cuando solo hace falta una dirección.** Todo lo que se
  pierde —herramientas, intermediarios, autenticación por cabecera, reanudación
  de serie— se pierde a cambio de una dirección que no se usa. La clase 106 es
  más barata.
- **Adoptar Socket.IO sin mirar quién va a ser el cliente.** Un dispositivo
  empotrado, un servicio en otro lenguaje o un `curl` no van a poder hablar con
  él.

## ✅ Verificación

```bash
node scripts/run-class.mjs 107
```

Para hacer el apretón tú, sin ninguna biblioteca —esto es lo que hace la clase
por dentro:

```bash
printf 'GET /ws HTTP/1.1\r\nHost: 127.0.0.1:4100\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\nSec-WebSocket-Version: 13\r\n\r\n' | nc 127.0.0.1 4100
```

Si la respuesta trae `s3pPLMBiTxaQ9kYGzzhZRbK+xOo=`, el servidor implementa el
protocolo correctamente.

## 🧪 Reto de transferencia

1. **Cuenta tus conexiones abiertas en la hora punta.** Ese número, multiplicado
   por lo que ocupe cada una en tu modelo de servidor, es lo que esta tecnología
   te va a costar.
2. **Comprueba qué pasa cuando caduca la sesión.** Con la conexión abierta,
   invalida la sesión y manda un mensaje. Si sigue funcionando, tienes un
   problema de autorización que ninguna prueba de HTTP va a encontrar.
3. **Busca dónde guardas la lista de conexiones.** Si la respuesta es «en una
   variable», la clase 109 es para ti.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 106](../106-eventos-enviados-por-el-servidor/README.md) — cuando basta una dirección
- [Clase 108](../108-reconexion-y-mensajes-perdidos/README.md) — sobrevivir a un corte
- [Clase 109](../109-estado-de-conexion-con-varias-instancias/README.md) — cuando el servidor no es uno solo
- [Índice de la parte 8](../README.md)

## Fuentes

- [@rfc6455] *RFC 6455 — The WebSocket Protocol*. IETF — <https://www.rfc-editor.org/rfc/rfc6455>
- [@mdn-web-docs] *MDN Web Docs* — <https://developer.mozilla.org/>
- [@socketio-docs] *Socket.IO — Documentación oficial* — <https://socket.io/docs/v4/>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
