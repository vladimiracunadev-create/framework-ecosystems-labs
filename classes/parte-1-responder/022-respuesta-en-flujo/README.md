# Clase 022 — Respuesta en flujo

> [⬅️ 021](../021-subida-de-archivos/README.md) · [📚 Parte 1](../README.md) · [🎓 Clases](../../README.md) · [023 ➡️](../023-compresion/README.md)
>
> Parte **1 — Responder** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Enviar la respuesta **a trozos**, sin construirla entera antes. Es la base de la
descarga de archivos grandes, de los eventos enviados por el servidor (clase 106)
y del HTML en flujo de los metaframeworks (clase 100).

## 📖 Qué cambia exactamente

| | Respuesta normal | Respuesta en flujo |
| --- | --- | --- |
| **Memoria** | todo el contenido a la vez | un trozo cada vez |
| **`Content-Length`** | se conoce y se declara | **no se declara** |
| **Codificación** | tamaño fijo | troceada |
| **Primer byte** | cuando está todo listo | en cuanto hay algo |

La fila del medio es la que verifica el contrato: **la ausencia de
`Content-Length` es la señal observable de que la respuesta es un flujo**. El
servidor no sabe cuánto va a enviar cuando empieza, así que no puede declararlo.

Y la fila de abajo es la razón de ser: el usuario ve algo antes. En una descarga
de 200 MB la diferencia entre construir y transmitir es la diferencia entre
esperar un minuto mirando una pantalla vacía y ver la barra de progreso al
instante.

## 🧩 La situación

`GET /flujo` devuelve tres líneas —`uno`, `dos`, `tres`— **separadas en el
tiempo**, sin construir la respuesta entera antes de empezar a enviarla.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /flujo` | `200` · cuerpo `uno\ndos\ntres` |
| igual | `content-type: text/plain` |
| igual | **sin** `content-length` |

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Respuesta en flujo**](../../../glosario/README.md#respuesta-en-flujo) *(Streaming)* | Enviar la respuesta a trozos, sin conocer su tamaño total de antemano. Se consigue omitiendo `Content-Length`, lo que activa la codificación troceada. En modelos de un hilo por petición exige mecanismos propios para no retener el hilo. |
| [**Codificación troceada**](../../../glosario/README.md#codificación-troceada) *(Chunked transfer encoding)* | La forma en que HTTP/1.1 envía un cuerpo sin declarar su longitud: en trozos, cada uno precedido por su tamaño. Es lo que permite que el cliente empiece a leer antes de que el servidor sepa cuánto va a enviar. |
| [**Bucle de eventos**](../../../glosario/README.md#bucle-de-eventos) *(Event loop)* | El modelo de concurrencia de Node.js y de Python asíncrono: **un solo hilo** que atiende muchas peticiones intercalando el trabajo mientras espera. Nada se bloquea salvo que tú lo bloquees — y si lo bloqueas, se paran todas. |
| [**Un hilo por petición**](../../../glosario/README.md#un-hilo-por-petición) | El modelo de concurrencia de la JVM y de .NET: cada petición ocupa un hilo del grupo mientras dura. Simple de razonar, y el grupo es finito — doscientas peticiones lentas simultáneas agotan un servidor de doscientos hilos. |

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
- **Versión que ejecuta esta clase:** `fastapi==0.121.3, uvicorn==0.40.0`
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
PORT=3000 java -jar target/clase-022-1.0.0.jar --server.port=3000
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
| `Clase022.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Los cuatro envían tres trozos separados en el tiempo. Lo que cambia es **quién
espera mientras tanto** — y esa es una diferencia de modelo de ejecución, no de
API.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs)

```javascript
  respuesta.type("text/plain");
  respuesta.setHeader("cache-control", "no-store");
  for (const trozo of ["uno\n", "dos\n", "tres\n"]) {
    respuesta.write(trozo);
    await esperar(50);
  }
  respuesta.end();
```

`write` varias veces y `end` al final. Lo que hace que esto sea un flujo y no
una respuesta partida es lo que **no** está: **sin `Content-Length`**, Node pasa
a codificación troceada por su cuenta y el cliente empieza a leer antes de que
el servidor sepa cuánto va a enviar en total [@rfc9112].

Y el `await` dentro del bucle no bloquea nada: el bucle de eventos atiende otras
peticiones durante los 50 ms.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

```python
async def trozos() -> AsyncIterator[bytes]:
    for texto in ("uno\n", "dos\n", "tres\n"):
        yield texto.encode()
        await asyncio.sleep(0.05)
```

```python
    return StreamingResponse(
        trozos(), media_type="text/plain", headers={"cache-control": "no-store"}
    )
```

**El enfoque más limpio de los cuatro.** La respuesta se declara como un
generador asíncrono: nada se acumula en memoria, y —lo que más importa— **el
código que produce los datos no sabe nada de HTTP**.

Esa separación tiene una consecuencia práctica inmediata: `trozos()` se puede
probar sola, sin servidor y sin cliente. Es la misma idea que la clase 065
aplica a la persistencia.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
    @GetMapping(value = "/flujo", produces = MediaType.TEXT_PLAIN_VALUE)
    public StreamingResponseBody flujo(HttpServletResponse respuesta) {
```

```java
        respuesta.setContentType("text/plain");
        respuesta.setHeader("Cache-Control", "no-store");
        return salida -> {
            for (String trozo : new String[] { "uno\n", "dos\n", "tres\n" }) {
                salida.write(trozo.getBytes());
                salida.flush();
```

`StreamingResponseBody` **libera el hilo del contenedor** mientras se escribe.
Sin él, un flujo de diez minutos retendría un hilo del grupo durante diez
minutos — y el grupo es finito.

Es la manifestación más clara del modelo **un hilo por petición**: en un
servidor con 200 hilos, 200 flujos lentos simultáneos agotan el servidor entero.
El [módulo 02](../../../curriculum/02-arquitectura-de-frameworks.md) compara ese
modelo con el basado en eventos que usan las dos implementaciones anteriores.

Y un detalle que el propio código documenta y que se descubrió montándolo: el
`produces` de la anotación **no llega a fijar la cabecera** cuando el cuerpo se
escribe directamente en el flujo de salida. Hay que ponerla a mano.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
        await respuesta.Body.WriteAsync(Encoding.UTF8.GetBytes(trozo));
        await respuesta.Body.FlushAsync();
        await Task.Delay(50);
```

**El `FlushAsync` no es opcional.** Sin él, el búfer podría acumular los tres
trozos y enviarlos juntos al final: la respuesta sería idéntica y ya no sería un
flujo.

Y eso lleva a la limitación de este contrato, que conviene decir en voz alta:
**mide el resultado, no el comportamiento temporal**. Un servidor que enviara
los tres trozos de golpe pasaría los mismos casos. Comprobar que el primer trozo
llega antes que el tercero exigiría un cliente que lea a trozos y mida
instantes — y ese cliente no existe en este verificador.

Lo que sí queda probado: la respuesta va troceada y sin `Content-Length`, que es
la condición necesaria. Que además llegue escalonada está **declarado, no
medido**.

## 🔬 Comparación

| Framework | Cómo se expresa | ¿Vaciado explícito? | Coste de un flujo largo |
| --- | --- | --- | --- |
| FastAPI | generador asíncrono | no | una corrutina |
| Express | `write` + `end` | no | una devolución de llamada |
| ASP.NET Core | escritura + vaciado | **sí** | una tarea |
| Spring Boot | `StreamingResponseBody` | sí | un hilo, si no se usa |

La columna de la derecha es la que decide en producción: **el coste de mantener
mil flujos abiertos** no es el mismo en un modelo de eventos que en uno de un
hilo por petición.

## ⚠️ Errores frecuentes

- **Poner `Content-Length` a mano.** Rompe el troceado.
- **Olvidar el vaciado.** El framework junta los trozos y ya no es un flujo.
- **Construir la lista entera antes de emitirla.** Es la forma más común de
  «hacer streaming» sin hacerlo: el generador se materializa y se pierde todo.
- **No manejar la desconexión del cliente.** Si el cliente cierra, seguir
  produciendo es trabajo tirado.
- **Un flujo largo en un modelo de un hilo por petición** sin la abstracción que
  libera el hilo.

## ✅ Verificación

```bash
node scripts/run-class.mjs 022
```

## 🧪 Reto de transferencia

Convierte `/flujo` en un punto de **eventos enviados por el servidor**:
`content-type: text/event-stream` y cada trozo con el formato `data: ...\n\n`.
Es la clase 106, y desde aquí son diez líneas.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 106 — Eventos enviados por el servidor](../../parte-8-tiempo-real-y-segundo-plano/106-eventos-enviados-por-el-servidor/README.md)
- [Módulo 02 — Arquitectura de frameworks](../../../curriculum/02-arquitectura-de-frameworks.md)

## Fuentes

- [@rfc9112] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP/1.1*, RFC 9112, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9112>
- [@grigorik-hpbn] Grigorik, Ilya. *High Performance Browser Networking*. O'Reilly Media, 2013. ISBN 9781449344764 — <https://openlibrary.org/isbn/9781449344764>
