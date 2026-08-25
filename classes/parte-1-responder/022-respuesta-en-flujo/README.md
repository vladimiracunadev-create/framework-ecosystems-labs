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
