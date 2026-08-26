# Clase 109 — Estado de conexión con varias instancias

> [⬅️ Clase 108](../108-reconexion-y-mensajes-perdidos/README.md) · [📚 Parte 8](../README.md) · [🎓 Clases](../../README.md) · [110 ➡️](../110-colas-de-trabajo/README.md)
>
> Parte **8 — Tiempo real y segundo plano** · Nivel **🔴 avanzado** · Pista **`tiempo-real`** (Tiempo real y segundo plano)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Las clases 107 y 108 guardaron la lista de conexiones abiertas **en una
variable**. Con un servidor funciona perfectamente.

Con dos —que es lo que hay en cuanto se pone un balanceador delante, o se
despliega sin cortar el servicio— **la mitad de la gente deja de enterarse de la
mitad de las cosas**. Y falla de la peor manera posible: sin ningún error, con
los dos servidores sanos, y sin reproducirse nunca en pruebas.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Reconocer el fallo** antes de tenerlo: si tu lista de conexiones es una
  variable, ya lo tienes.
- **Ver el reparto por dentro**: lo que un intermediario de mensajes hace, escrito
  en diez líneas.
- **Nombrar la respuesta de fábrica** de tu ecosistema —adaptador, intermediario
  de mensajes— y saber qué te ahorra.
- **Explicar los dos límites** del reparto directo: crece al cuadrado y pierde lo
  de un par caído.

## 🧩 La situación

Dos instancias, **A** y **B**, con dos listas de conexiones separadas. Alguien
conectado a la **B**. Un mensaje publicado siempre en la **A**.

Se publica dos veces: sin reparto y con él. Mismo código, misma conexión, mismo
mensaje. Lo único que cambia es si las instancias se hablan.

> **Lo único simplificado, y está declarado en las cuatro implementaciones:** las
> dos instancias comparten proceso. En producción serían dos máquinas. Lo que las
> separa —su estado en memoria— está separado de verdad, y el reparto entre ellas
> va por HTTP, no tocando una variable.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /` | la portada dice qué instancia es y quiénes son las demás |
| 2 | `GET /instancias.json` | hay dos, y el estado de conexión es local |
| 3 | `GET /instancias.json` | **sin reparto, el otro no se entera** |
| 4 | `GET /instancias.json` | con reparto, el mismo mensaje llega, entregado por **B** |
| 5 | `GET /instancias.json` | dónde guarda cada uno su lista y cómo difunde |
| 6 | `GET /instancias.json` | qué haría falta para llevarlo a producción |

El caso 3 es el único de esta obra que **exige que algo falle**:

```json
        "json_contiene": { "sin_bus_recibio_el_otro": false }
```

Sin él, una implementación que compartiera la lista entre las dos instancias
pasaría el caso 4 y la clase no enseñaría nada. El problema hay que demostrarlo
antes que la solución.

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
PORT=3000 java -jar target/clase-109-1.0.0.jar --server.port=3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `pom.xml` | manifiesto de Maven: el proyecto, su Java, sus dependencias y cómo se empaqueta |
| `src/main/java/labs/Aplicacion.java` | código Java |
| `src/main/java/otra/InstanciaB.java` | código Java |

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

### Express · el fallo, dicho con todas las letras

[`express/server.mjs`](implementaciones/express/server.mjs):

```javascript
 * Y falla de la peor manera posible: **no da ningún error**. Los dos servidores
 * están sanos, las conexiones están abiertas, los mensajes se entregan… a quien
 * está conectado al mismo sitio. En pruebas, con una instancia, no se reproduce
 * nunca.
```

Y lo que aquí está simplificado, declarado antes de que nadie pregunte:

```javascript
 * Este archivo levanta DOS servidores, en dos puertos, con **dos listas de
 * conexiones separadas**. Comparten proceso, y en producción serían dos
 * procesos o dos máquinas: eso es lo único que aquí está simplificado, y no
 * afecta a lo que la clase mide, porque lo que separa a las dos instancias —el
 * estado en memoria de cada una— está separado de verdad.
```

**Y los dos límites del reparto directo, que son el motivo de que existan los
intermediarios de mensajes:**

```javascript
    // Este reparto por HTTP a cada par es la versión más simple que funciona, y
    // tiene dos límites que hay que saber: crece al cuadrado con el número de
    // instancias, y si un par está caído su gente se pierde el mensaje sin que
    // nadie se entere. Un intermediario de mensajes —Redis, NATS, RabbitMQ—
    // resuelve las dos cosas, y por eso todos los frameworks acaban recomendando
    // uno.
```

### FastAPI · dos uvicorn, dos conjuntos

[`fastapi/main.py`](implementaciones/fastapi/main.py):

```python
    Es uvicorn de verdad, con su propio socket en su propio puerto: lo único que
    comparte con la primera es el proceso.
```

Y la ruta del reparto, que es lo que hace que se vea:

```python
    # La ruta que usa el reparto entre instancias. Es una ruta normal, y por eso
    # se ve lo que el reparto es de verdad: **una petición más**.
```

### Socket.IO · el único con respuesta de fábrica, y se llama adaptador

[`socketio/server.mjs`](implementaciones/socketio/server.mjs):

```javascript
 * Se llama adaptador. Se le pone uno —el de Redis es el habitual— y a partir de
 * ahí `io.emit` llega a todos los conectados a todas las instancias, sin cambiar
 * una línea del código de la aplicación. Es exactamente el reparto que las otras
 * tres implementaciones escriben a mano, resuelto por debajo.
```

**Y por qué no se usa aquí, dicho sin excusas:**

```javascript
 * No se usa aquí por un motivo declarado: **haría falta un Redis**, y este
 * laboratorio no monta infraestructura para una clase. Lo que se hace en su
 * lugar es el reparto explícito, que es lo que el adaptador hace por dentro, y
 * así se ve. Lo que hay que llevarse no es la técnica: es que **la pregunta
 * existe y tiene una respuesta con nombre**, y que ignorarla es el fallo de esta
 * clase.
```

Con la línea que desaparecería:

```javascript
    // Con un adaptador puesto, esta llamada NO existiría: `io.emit` de arriba ya
    // habría llegado a las dos instancias. Verla escrita es ver lo que el
    // adaptador hace.
```

### Spring Boot · dos contextos, y una lección sobre el escaneo

[`spring-boot/src/main/java/labs/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java):

```java
 * Spring tiene una respuesta de fabrica para esto y merece nombrarla: con la
 * capa STOMP y un intermediario de mensajes de verdad detras —RabbitMQ,
 * ActiveMQ—, el reparto entre instancias deja de ser codigo de la aplicacion y
 * pasa a ser configuracion. Es lo mismo que el adaptador de Socket.IO, en el
 * mundo de la JVM.
```

**Y un detalle de Spring que se paga caro y aquí sale a la primera** —
[`otra/InstanciaB.java`](implementaciones/spring-boot/src/main/java/otra/InstanciaB.java):

```java
 * Si estuviera en `labs`, el escaneo de componentes de la primera instancia la
 * encontraria y registraria sus rutas y su manejador TAMBIEN en el contexto A.
 * Las dos aplicaciones acabarian con dos mapeos de `/interno` y Spring se
 * negaria a arrancar.
 *
 * Que un paquete decida qué acaba dentro de qué contexto es la cara incomoda del
 * escaneo automatico: es comodo hasta que hay dos aplicaciones en la misma
 * maquina virtual.
```

Y lo que de verdad separa a las dos instancias:

```java
 * Lo importante de este archivo es lo que NO comparte con el otro: `SALA_B` es
 * una lista distinta de `SALA_A`. Esa separacion es todo el problema de la
 * clase. Un mensaje entregado a la sala de la instancia A no llega a nadie de la
 * B, por muy sanos que esten los dos servidores.
```

## 🔬 Comparación

| | Dónde está la lista | Respuesta de fábrica |
| --- | --- | --- |
| **Express** (`ws`) | `canal.clients` de cada proceso | ninguna |
| **FastAPI** | un conjunto de cada proceso | ninguna |
| **Spring Boot** | un conjunto de cada contexto | STOMP con intermediario de mensajes |
| **Socket.IO** | el registro de cada proceso | **adaptador**, y el de Redis es el habitual |

Y el resultado, idéntico en los cuatro:

```text
sin reparto:  quien está en B no recibe nada
con reparto:  «hola a todos», entregado por B
```

Cuatro lecturas:

- **El problema es de todos y la solución no.** Los cuatro guardan el estado de
  conexión en una variable del proceso, porque es lo natural. Solo dos tienen una
  respuesta de fábrica, y las dos consisten en lo mismo: sacar el reparto fuera
  de la aplicación.
- **El reparto directo funciona y no escala.** Diez líneas y ya avisas a tus
  pares. Con tres instancias son seis conexiones; con diez, noventa. Y si un par
  está caído, su gente se pierde el mensaje sin que nadie se entere.
- **Nombrar la respuesta vale más que implementarla.** «Adaptador» en Socket.IO,
  «intermediario de mensajes» en Spring. Saber que la pregunta tiene nombre es lo
  que impide llegar a producción sin habérsela hecho.
- **Este fallo no se reproduce en pruebas.** En local hay una instancia. El error
  aparece el día que se escala, y el síntoma —«a veces no me llegan los avisos»—
  no apunta a ninguna parte.

## ⚠️ Errores frecuentes

- **Probar con una instancia.** El fallo no existe con una. Hay que levantar dos
  y conectar a la segunda para verlo.
- **Fijar la sesión al servidor para evitarlo.** Que un cliente vuelva siempre a
  la misma instancia arregla el síntoma y estropea el despliegue: al reiniciar
  esa instancia, esos clientes se quedan sin nada.
- **Repartir en directo con muchas instancias.** Diez instancias son noventa
  conexiones de reparto y ningún sitio donde mirar cuándo falla una.
- **Creer que un almacén compartido de sesiones lo resuelve.** Guardar quién está
  conectado en Redis no reparte nada: la conexión física sigue estando en un
  proceso concreto. Lo que hace falta es un canal de mensajes, no un almacén.
- **Descubrirlo al escalar.** Es la decisión más barata de tomar el primer día y
  la más cara de retrofitar el día del pico.

## ✅ Verificación

```bash
node scripts/run-class.mjs 109
```

Cada implementación levanta sus dos instancias y publica el mismo mensaje dos
veces. Para verlo tú:

```bash
curl -s http://127.0.0.1:4100/instancias.json
```

## 🧪 Reto de transferencia

1. **Levanta dos instancias de tu aplicación.** Con dos puertos y un cliente en
   cada una. Manda algo por una y mira si llega a la otra. Es media hora y
   contesta la pregunta más cara de esta parte.
2. **Busca dónde guardas la lista.** Si es una variable, un mapa o un conjunto,
   ya sabes lo que va a pasar.
3. **Pon nombre a tu respuesta.** Adaptador, intermediario de mensajes, canal de
   publicación. Escríbelo en la documentación del proyecto antes de necesitarlo.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 107](../107-websocket/README.md) — donde apareció la lista de conexiones
- [Clase 108](../108-reconexion-y-mensajes-perdidos/README.md) — el otro fallo silencioso de esta parte
- [Clase 113](../113-eventos-de-dominio/README.md) — desacoplar quién emite de quién reacciona
- [Índice de la parte 8](../README.md)

## Fuentes

- [@socketio-docs] *Socket.IO — Documentación oficial* — <https://socket.io/docs/v4/>
- [@rfc6455] *RFC 6455 — The WebSocket Protocol*. IETF — <https://www.rfc-editor.org/rfc/rfc6455>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
