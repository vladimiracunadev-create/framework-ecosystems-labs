# Clase 106 — Eventos enviados por el servidor

> [⬅️ Clase 105](../105-sondeo/README.md) · [📚 Parte 8](../README.md) · [🎓 Clases](../../README.md) · [107 ➡️](../107-websocket/README.md)
>
> Parte **8 — Tiempo real y segundo plano** · Nivel **🟡 intermedio** · Pista **`tiempo-real`** (Tiempo real y segundo plano)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Dejar de preguntar. La petición se queda abierta y el servidor escribe cuando
tiene algo.

Y lo mejor de esta tecnología no es eso —eso lo hacen todas las de esta parte—
sino que **no hay protocolo nuevo**: es una respuesta HTTP que no termina, con un
formato de texto de cuatro reglas. Se verifica con las mismas herramientas que
cualquier otra respuesta, y por eso esta clase va antes que la de WebSocket.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Escribir un flujo de eventos** en los cuatro, con su formato correcto.
- **Reanudar tras un corte** usando `Last-Event-ID`, que el navegador manda solo.
- **Reconocer el fallo clásico**: el intermediario que guarda la respuesta en un
  buffer y no entrega nada.
- **Decir qué cuesta** una conexión abierta por cliente en cada modelo de
  servidor.

## 🧩 La situación

Tres pedidos que hay que entregar según llegan. Cada uno con su número de orden,
porque ese número es lo único que permite reanudar.

Y una segunda conexión que dice «yo ya tengo hasta el 2»: el servidor le manda el
3 y nada más.

## 🧮 El contrato

| # | Petición | Qué comprueba |
| --- | --- | --- |
| 1 | `GET /eventos` | `text/event-stream`, `retry:`, y los tres eventos |
| 2 | `GET /eventos` | cada evento acaba en **una línea en blanco** |
| 3 | `GET /eventos` con `Last-Event-ID: 2` | **continúa por el 3**, y no repite el 1 |
| 4 | `GET /eventos` con `Last-Event-ID: 3` | y si no hay nada nuevo, no manda nada |
| 5 | `GET /sse.json` | tres eventos recibidos, y bytes de verdad |
| 6 | `GET /sse.json` | cómo lo escribe cada uno y cuál es su fallo clásico |

El caso 2 comprueba la regla que más se olvida, y lo hace de la forma más literal
posible:

```json
        "cuerpo_contiene": ["data: {\"id\":1,\"cliente\":\"Ada\",\"importe\":32}\n\n"]
```

Sin esa línea en blanco, el navegador se queda esperando el resto del bloque y no
entrega nada. Todo parece funcionar y no llega ni un evento.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Eventos enviados por el servidor**](../../../glosario/README.md#eventos-enviados-por-el-servidor) *(SSE)* | Un canal HTTP de una sola dirección por el que el servidor empuja mensajes. Reconecta solo y reanuda desde el último identificador recibido, y no necesita otro protocolo. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Express** | framework web de Node.js (JavaScript) | 2010 | MIT | OpenJS Foundation |
| **FastAPI** | framework web de Python (Python) | 2018 | MIT | proyecto independiente |
| **Spring Boot** | framework de aplicación de JVM (Java) | 2014 | Apache-2.0 | Broadcom/VMware y colaboradores |
| **ASP.NET Core** | framework web de .NET (C#) | 2016 | MIT | Microsoft y .NET Foundation |

### 🔧 Express

Definió el modelo de middleware encadenado que copiaron casi todos los frameworks de Node.js. Minimalista no significa biblioteca: posee el bucle de peticiones.

- **Documentación oficial:** <https://expressjs.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `express ^5.1.0`
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
- **Versión que ejecuta esta clase:** `fastapi==0.121.3, uvicorn==0.40.0, httpx==0.28.1`
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
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-106-1.0.0.jar --server.port=3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `pom.xml` | manifiesto de Maven: el proyecto, su Java, sus dependencias y cómo se empaqueta |
| `src/main/java/labs/Aplicacion.java` | código Java |

### 🔧 ASP.NET Core

Reescritura multiplataforma y de código abierto de la pila web de Microsoft. Sus API mínimas trajeron el estilo de los microframeworks al ecosistema .NET.

- **Documentación oficial:** <https://learn.microsoft.com/aspnet/core/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `net10.0`
- **Necesita en el PATH:** `dotnet`

Preparar sus dependencias, dentro de su directorio:

```bash
dotnet build -c Release --nologo -v quiet
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 dotnet run -c Release --no-build --urls http://127.0.0.1:3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `Clase106.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

### Express · el formato a la vista

[`express/server.mjs`](implementaciones/express/server.mjs) — el encuadre:

```javascript
 * La clase 105 preguntaba cada cierto tiempo. Aquí se deja de preguntar: la
 * petición se queda abierta y el servidor escribe cuando tiene algo. No hay
 * protocolo nuevo, ni negociación, ni biblioteca en el cliente: es una respuesta
 * HTTP que no termina, con un formato de texto de cuatro reglas.
```

**Y lo que trae de regalo, que es la mitad de la clase siguiente:**

```javascript
 * Y trae de serie lo que en la clase 108 costará escribir a mano con WebSocket:
 * **el navegador reconecta solo, y dice por dónde iba**. Si cada evento lleva un
 * `id:`, al reconectar manda `Last-Event-ID` con el último que recibió, y el
 * servidor puede continuar desde ahí. Eso está en el estándar, no en una
 * biblioteca.
```

El formato, con el error número uno señalado:

```javascript
 * Cada evento es un bloque de líneas `campo: valor` terminado en **una línea en
 * blanco**. Esa línea en blanco es lo que lo separa del siguiente, y olvidarla es
 * el error número uno: el navegador se queda esperando y no entrega nada.
```

Y la cabecera que no está en ningún tutorial y hace falta en producción:

```javascript
  // Falta una cuarta que no se ve aquí y que hace falta detrás de un proxy
  // inverso: `X-Accel-Buffering: no`. Sin ella, nginx guarda la respuesta en un
  // buffer y no entrega nada hasta que se llena. Es el fallo clásico de esta
  // tecnologia y solo aparece en produccion.
```

Con la honestidad sobre el final del flujo:

```javascript
  // Este flujo se cierra a propósito cuando se acaban los eventos, para que el
  // contrato pueda leerlo entero. Un flujo real se queda abierto y manda un
  // comentario —`: latido\n\n`— cada treinta segundos para que ningún
  // intermediario lo dé por muerto.
```

### FastAPI · un flujo es una función que devuelve trozos

[`fastapi/main.py`](implementaciones/fastapi/main.py):

```python
FastAPI trae `StreamingResponse`, que recibe un generador y va escribiendo lo
que este produzca. Es la forma más directa de las cuatro y la que mejor enseña
qué es un flujo: **una función que devuelve trozos en lugar de un valor**.
```

```python
El detalle que hay que mirar es `media_type`: sin `text/event-stream`, esto sería
una descarga larga y no un flujo de eventos. El formato del texto es el mismo;
lo que cambia es que el navegador lo interprete.
```

### Spring Boot · tres formas de hacerlo, y una diferencia de escala

[`spring-boot/src/main/java/labs/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java):

```java
 *   - `SseEmitter`, del modelo de servlets, que entrega el objeto a otro hilo
 *     para que vaya emitiendo. Es la mas conocida y **ocupa un hilo por
 *     cliente**, que es exactamente lo que no se quiere con mil conexiones
 *     abiertas.
 *   - `Flux<ServerSentEvent>`, del modelo reactivo, que no ocupa hilo mientras
 *     no haya nada que mandar. Es la buena para escala y trae WebFlux entero
 *     detras.
```

Y por qué esta implementación usa la tercera:

```java
 * Aqui se usa `StreamingResponseBody`, que es la tercera: escribir el texto a
 * mano. No es la mas idiomatica y es la que deja ver **que el formato son cuatro
 * reglas y ninguna magia**, que es lo que esta clase quiere ensenar. Las otras
 * dos producen exactamente los mismos bytes.
```

### ASP.NET Core · la llamada que se olvida

[`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs):

```csharp
// Aquí no hay un tipo `SseResult` ni nada parecido: se escribe en
// `Response.Body` y se vacía el buffer a mano con `FlushAsync`. Esa llamada es la
// que más importa de todo el archivo, y es la que se olvida: sin ella, el
// servidor acumula los tres eventos y los manda juntos al cerrar, con lo que el
// flujo deja de ser un flujo y pasa a ser una descarga lenta.
```

```csharp
// El resto —el formato de cuatro reglas, la reanudación con `Last-Event-ID`— es
// idéntico en los cuatro frameworks, porque no es del framework: es del estándar.
```

## 🔬 Comparación

| | Cómo se escribe el flujo | Qué cuesta una conexión abierta |
| --- | --- | --- |
| **Express** | `res.write(...)` en el manejador | nada de hilo: un socket y un cierre pendiente |
| **FastAPI** | `StreamingResponse` con un generador | un trabajador de uvicorn ocupado mientras dure |
| **Spring Boot** | `StreamingResponseBody` — o `SseEmitter`, o `Flux` | **un hilo por cliente** en el modelo de servlets |
| **ASP.NET Core** | `Response.WriteAsync` + `FlushAsync` | nada de hilo: el modelo asíncrono libera mientras espera |

Y el flujo, que es idéntico en los cuatro porque no es de ninguno:

```text
retry: 2000

id: 1
event: pedido
data: {"id":1,"cliente":"Ada","importe":32}
```

211 bytes para los tres eventos, en los cuatro.

Cuatro lecturas:

- **El formato no es de nadie, y eso es la ventaja principal.** Los cuatro
  producen los mismos bytes, y cualquier cliente que entienda el estándar los
  lee. No hay biblioteca en el navegador: `EventSource` está en el navegador
  desde hace quince años.
- **La reanudación viene de serie.** `Last-Event-ID` lo manda el navegador solo,
  sin que nadie lo programe. La clase 108 escribe esto mismo a mano para
  WebSocket y ocupa una clase entera.
- **Lo que cuesta una conexión abierta depende del modelo de servidor, no del
  protocolo.** En Spring con servlets es un hilo por cliente; en los otros tres,
  un socket. Es la diferencia entre aguantar cien conexiones y aguantar diez mil,
  y no se ve en el código de esta clase.
- **El fallo clásico está fuera de la aplicación.** Un proxy inverso con buffer
  convierte un flujo en una descarga, y funciona perfectamente en local. Las
  cuatro implementaciones mandan `X-Accel-Buffering: no` por eso.

## ⚠️ Errores frecuentes

- **Olvidar la línea en blanco.** El navegador espera el resto del bloque y no
  entrega nada. Es el error número uno y no da ningún aviso.
- **Olvidar vaciar el buffer.** En ASP.NET sin `FlushAsync`, en Python sin
  generador: los eventos se acumulan y llegan juntos al final.
- **No poner `id:`.** Sin él no hay reanudación posible: el navegador reconecta y
  vuelve a recibirlo todo, o se pierde lo de en medio.
- **Un flujo sin latido.** Un intermediario que no ve tráfico durante un minuto
  corta la conexión. Un comentario —`: latido`— cada treinta segundos lo evita.
- **Usarlo para mandar cosas al servidor.** No se puede: es de una sola
  dirección. Se puede combinar con peticiones normales, y eso suele bastar; si no
  basta, es la clase 107.

## ✅ Verificación

```bash
node scripts/run-class.mjs 106
```

Para verlo tú, con cualquiera arrancada —`-N` desactiva el buffer de `curl`, que
si no hace exactamente lo que hace el proxy del fallo clásico:

```bash
curl -N http://127.0.0.1:4100/eventos
```

Y la reanudación, que es lo que hay que probar antes de fiarse:

```bash
curl -N -H "Last-Event-ID: 2" http://127.0.0.1:4100/eventos
```

## 🧪 Reto de transferencia

1. **Busca tus sondeos y quédate con uno.** El que más peticiones genere. Pásalo
   a un flujo de eventos y compara el número de peticiones por minuto.
2. **Comprueba tu proxy antes de celebrar.** Despliega el flujo detrás de lo que
   tengas delante y mira si llega en tiempo real o de golpe. Es donde falla.
3. **Pon `id:` desde el principio.** Añadirlo después significa reanudar mal
   durante todo el tiempo en que no estuvo.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué postura tiene cada uno
- [Clase 105](../105-sondeo/README.md) — lo que se deja atrás
- [Clase 107](../107-websocket/README.md) — cuando hace falta la otra dirección
- [Clase 108](../108-reconexion-y-mensajes-perdidos/README.md) — esta reanudación, escrita a mano
- [Índice de la parte 8](../README.md)

## Fuentes

- [@whatwg-html] *HTML Living Standard*. WHATWG — <https://html.spec.whatwg.org/>
- [@rfc9110] *RFC 9110 — HTTP Semantics*. IETF — <https://www.rfc-editor.org/rfc/rfc9110>
- [@mdn-web-docs] *MDN Web Docs* — <https://developer.mozilla.org/>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
