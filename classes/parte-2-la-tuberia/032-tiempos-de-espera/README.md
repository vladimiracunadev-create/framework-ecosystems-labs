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

## 🌐 Las implementaciones

Las cuatro imponen el mismo plazo y **no hacen lo mismo por debajo**. Esa
diferencia —dejar de esperar frente a cancelar de verdad— es el contenido de la
clase, y los fragmentos de abajo la muestran.

### Dejar de esperar frente a cancelar

Esta es la distinción que separa las cuatro implementaciones.

### Express — un temporizador que responde antes

```javascript
const temporizador = setTimeout(() => {
  if (respuesta.headersSent) return;
  respuesta.status(504).json({ ... });
}, LIMITE_MS);

respuesta.on("finish", () => clearTimeout(temporizador));
```

**El manejador lento sigue corriendo.** El temporizador responde 504 y el trabajo
continúa hasta terminar, gastando lo que gaste. Se deja de esperar; no se cancela
nada.

Y fíjate en `clearTimeout`: sin él, **cada petición deja un temporizador vivo**
hasta que expire. Con tráfico real es una fuga de memoria lenta, de las que solo
se notan a los días.

### FastAPI — cancelación de verdad

```python
return await asyncio.wait_for(siguiente(peticion), timeout=LIMITE)
```

`wait_for` **cancela la corrutina** al agotarse el plazo. El trabajo deja de
consumir recursos, no solo deja de esperarse. Es la diferencia importante, y sale
gratis por el modelo asíncrono de Python.

### ASP.NET Core — cancelación cooperativa

```csharp
app.MapGet("/lento", async (CancellationToken cancelacion) =>
{
    try { await Task.Delay(1200, cancelacion); }
    catch (OperationCanceledException) { return Results.Empty; }
    ...
});
```

.NET pasa un **testigo de cancelación** que el manejador recibe y propaga. Es
cooperativo: el trabajo se entera y decide parar. Un código que ignore el testigo
seguirá corriendo, igual que en Express.

Es el modelo más honesto de los cuatro: **hace explícito que cancelar requiere
colaboración**.

### Spring Boot — solo para manejadores asíncronos

```java
@GetMapping("/lento")
public Callable<Map<String, Object>> lento() { ... }
```

Y aquí está la limitación importante: **el plazo solo aplica si el manejador es
asíncrono**. Devolver `Callable` cede el hilo del contenedor y permite al
despachador imponer el límite.

Un manejador síncrono **bloquea su hilo y no hay plazo que valga**. Es la
consecuencia directa del modelo de un hilo por petición: no se puede interrumpir
un hilo bloqueado sin riesgo, así que el framework no lo intenta.

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
