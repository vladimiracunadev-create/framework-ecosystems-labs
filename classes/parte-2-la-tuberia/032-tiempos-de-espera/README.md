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

<!-- generado: fichas -->

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
PORT=3000 java -jar target/clase-032-1.0.0.jar --server.port=3000
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
| `Clase032.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

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
