# Clase 032 — Tiempos de espera

> [⬅️ 031](../031-manejo-centralizado-de-errores/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [033 ➡️](../033-limite-de-tamano-del-cuerpo/README.md)
>
> Parte **2 — La tubería** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Impedir que una petición lenta retenga un recurso **para siempre**, y ver la
diferencia entre *dejar de esperar* y *cancelar el trabajo*.

## 🧩 La situación

`GET /rapido` responde al instante. `GET /lento` tarda cuatro veces más que el
plazo y responde **504**. Y el servicio sigue atendiendo después del corte.

## 📖 Por qué esto es lo más importante de la parte 2

Sin plazo, una dependencia lenta **te tumba a ti**.

La secuencia es siempre la misma: la base de datos se pone lenta → tus peticiones
esperan → cada una retiene un recurso —hilo, conexión, memoria— → el grupo de
recursos se agota → **dejas de responder incluso a lo que no toca la base de
datos**.

Nygard lo describe como el mecanismo de fallo en cascada, y su recomendación es
tajante: **toda llamada que puede tardar debe tener un plazo**
[@nygard-release-it]. No hay excepción razonable, porque «esto siempre es rápido»
deja de ser cierto exactamente el día que importa.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /rapido` | `200` |
| `GET /lento` | `504` |
| `GET /rapido` otra vez | `200` — el servicio sigue en pie |

El tercer caso no es de adorno: comprueba que **el corte no dejó el servicio
tocado**, que es lo que ocurre cuando el plazo se implementa mal.

## 🌐 Las implementaciones — el código a la vista

Las cuatro imponen el mismo plazo y **no hacen lo mismo por debajo**. La
distinción es **dejar de esperar frente a cancelar de verdad**, y es el contenido
de la clase.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — dejar de esperar

```javascript
app.use((peticion, respuesta, siguiente) => {
  const temporizador = setTimeout(() => {
    if (respuesta.headersSent) return;
    respuesta.status(504).type("application/problem+json").json({
      type: "about:blank",
      title: "el servidor tardó demasiado",
      status: 504,
      code: "TIEMPO_AGOTADO",
    });
  }, LIMITE_MS);
```

```javascript
  respuesta.on("finish", () => clearTimeout(temporizador));
  respuesta.on("close", () => clearTimeout(temporizador));
```

**El manejador lento sigue corriendo.** El temporizador responde `504` y el
trabajo continúa hasta terminar, gastando lo que gaste. Se deja de esperar; no se
cancela nada.

Y los dos `clearTimeout` no son opcionales: sin ellos **cada petición deja un
temporizador vivo** hasta que expire. Con tráfico real es una fuga de memoria
lenta, de las que solo se notan a los días. Hacen falta los dos eventos porque
una conexión abortada por el cliente emite `close` y no `finish`.

```javascript
  if (!respuesta.headersSent) respuesta.json({ ok: true, tarde: true });
```

Y el manejador, al terminar tarde, tiene que **comprobar antes de escribir**: la
respuesta ya salió, y escribir otra vez rompe el protocolo. Es el residuo
inevitable de no cancelar.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — cancelar de verdad

```python
        return await asyncio.wait_for(siguiente(peticion), timeout=LIMITE)
    except (asyncio.TimeoutError, TimeoutError):
```

`wait_for` **cancela la corrutina** al agotarse el plazo: el trabajo deja de
consumir recursos, no solo deja de esperarse. Es la diferencia importante, y sale
gratis por el modelo asíncrono de Python.

Nada de comprobar si la respuesta ya salió: no hay nadie corriendo detrás.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — cancelación cooperativa

```csharp
constructor.Services.AddRequestTimeouts(opciones =>
{
    opciones.DefaultPolicy = new Microsoft.AspNetCore.Http.Timeouts.RequestTimeoutPolicy
    {
        Timeout = TimeSpan.FromMilliseconds(300),
        TimeoutStatusCode = 504,
    };
});
```

```csharp
app.MapGet("/lento", async (CancellationToken cancelacion) =>
{
    await Task.Delay(1200, cancelacion);
    return Results.Json(new { ok = true, tarde = true });
});
```

.NET pasa un **testigo de cancelación** que el manejador recibe y propaga a todo
lo que llame. Es cooperativo: el trabajo se entera y decide parar — y un código
que ignore el testigo seguirá corriendo, igual que en Express.

Es el modelo más honesto de los cuatro porque **hace explícito que cancelar
requiere colaboración**. El testigo está en la firma; ignorarlo es una decisión
visible.

El código no captura la cancelación a propósito, y el comentario del archivo
explica por qué: devolver un resultado ahí produciría un `200` y pisaría el `504`
que el middleware iba a emitir. **Dejar que la excepción suba es lo correcto.**

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — y solo si el manejador es asíncrono

```java
    public CompletableFuture<ResponseEntity<Map<String, Object>>> lento() {
        return CompletableFuture
                .supplyAsync(() -> {
```

```java
                .completeOnTimeout(plazoAgotado(), LIMITE_MS, TimeUnit.MILLISECONDS);
```

Aquí está la limitación importante del elenco: **el plazo solo aplica si el
manejador es asíncrono**. Devolver un futuro cede el hilo del contenedor y
permite imponer el límite; un manejador síncrono **bloquea su hilo y no hay plazo
que valga**.

Es la consecuencia directa del modelo de un hilo por petición: no se puede
interrumpir un hilo bloqueado sin riesgo, así que el framework no lo intenta.

Y el `completeOnTimeout` en lugar del plazo global de Spring salió de **dos
intentos fallidos en integración continua**, y queda escrito en el propio
archivo: con `spring.mvc.async.request-timeout`, la excepción que Spring lanza al
agotarse depende de la versión y de dónde se detecte —hay al menos dos clases
distintas—, y un `@ExceptionHandler` que no acierte con la correcta devuelve
`500` en lugar de `504`.

`completeOnTimeout` elimina la ambigüedad: al vencer el plazo **el futuro se
completa con el valor que le das**. No hay excepción que traducir ni pieza
intermedia que adivinar.

Lo que no hace, y conviene saberlo: **el trabajo de fondo sigue corriendo**. Mismo
comportamiento que Express, contrario al de FastAPI.

## 🔬 Comparación

| Framework | ¿Cancela el trabajo? | Cobertura | Riesgo |
| --- | --- | --- | --- |
| FastAPI | **sí**, cancela la corrutina | todas las rutas | ninguno relevante |
| ASP.NET Core | cooperativo, con testigo | todas las rutas | si ignoras el testigo, no cancela |
| Express | **no**, solo responde antes | todas las rutas | fuga si olvidas limpiar el temporizador |
| Spring Boot | sí, en asíncronos | **solo manejadores asíncronos** | un manejador síncrono queda sin plazo |

## 🧭 Y el plazo que de verdad te salva

El de esta clase protege **tu servicio de sus propios manejadores lentos**. El que
evita las cascadas es otro: **el plazo de cada llamada que tú haces** — a la base
de datos, a otro servicio, a una cola.

Sin ese, el plazo de la petición corta la respuesta y la llamada de abajo sigue
ocupando su conexión. La clase 112 lo trata junto a los reintentos, y la regla es
que **el plazo de arriba debe ser mayor que el de abajo**: al revés, cortas la
petición mientras la dependencia todavía trabaja.

## ⚠️ Errores frecuentes

- **No limpiar el temporizador.** Fuga de memoria lenta.
- **Escribir en una respuesta ya enviada.** De ahí el `headersSent`.
- **Plazo en la petición y no en las llamadas salientes.** No evita la cascada.
- **Plazos invertidos**: el de arriba menor que el de abajo.
- **Un manejador síncrono en Spring**, creyendo que el plazo aplica.
- **Plazo demasiado corto.** Cortas peticiones legítimas y el cliente reintenta,
  que empeora justo lo que querías evitar.

## ✅ Verificación

```bash
node scripts/run-class.mjs 032
```

## 🧪 Reto de transferencia

Añade a `/lento` una llamada HTTP saliente **con su propio plazo**, menor que el
de la petición. Comprueba que al agotarse el de la llamada obtienes un error
distinto del 504 — y explica cuál de los dos le dice más al que opera el sistema.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 112 — Reintentos e idempotencia](../../parte-8-tiempo-real-y-segundo-plano/112-reintentos-e-idempotencia/README.md)
- [Módulo 08 — Calidad, rendimiento y operación](../../../curriculum/08-calidad-rendimiento-y-operacion.md)

## Fuentes

- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@beyer-sre] Beyer, Betsy; Jones, Chris; Petoff, Jennifer; Murphy, Niall Richard. *Site Reliability Engineering*. O'Reilly Media, 2016. ISBN 9781491929124 — <https://openlibrary.org/isbn/9781491929124>
