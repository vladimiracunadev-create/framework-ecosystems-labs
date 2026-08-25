# Clase 030 — Identificador de correlación

> [⬅️ 029](../029-registro-de-peticiones/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [031 ➡️](../031-manejo-centralizado-de-errores/README.md)
>
> Parte **2 — La tubería** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Poder seguir **una petición concreta** a través de varios servicios y varios
registros. Es la diferencia entre «el sistema falló» y «esta petición falló aquí».

## 🧩 La situación

Si el cliente envía `x-request-id`, se **respeta**. Si no lo envía, se **genera**
uno. En ambos casos se devuelve en la respuesta.

Las dos mitades importan:

- **Respetarlo** permite que el identificador atraviese servicios: el que crea la
  petición inicial lo propaga a todos los que llama, y una sola búsqueda reúne
  las líneas de todos.
- **Generarlo** garantiza que ninguna petición se quede sin rastro, incluso si el
  cliente no colabora.

Y devolverlo al cliente permite que un usuario que informa de un error **te dé el
identificador** de su petición concreta.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| con `x-request-id: abc-123` | `{"correlacion":"abc-123","generado":false}` |
| igual | `x-request-id: abc-123` en la respuesta |
| sin cabecera | `{"generado":true}` y un identificador nuevo |

El tercer caso usa comparación **parcial**: el identificador generado es
aleatorio y exigirlo exacto sería pedir que se prediga lo impredecible. El
verificador tiene una aserción para eso.

## 🔒 El detalle de seguridad que casi nadie pone

```javascript
peticion.correlacion = entrante && entrante.length <= 128 ? entrante : randomUUID();
```

Ese límite de longitud no es adorno. **El identificador lo controla el cliente y
acaba en tus registros**, así que sin tope es una vía directa para inflarlos: un
atacante envía identificadores de un megabyte y llena el disco de registro.

Merece tratarse igual que cualquier otra entrada del usuario: **validar antes de
usar**. La misma regla que la clase 013 aplicaba a un número.

En un sistema real conviene además no aceptar caracteres de control, para que un
identificador no pueda inyectar saltos de línea en un registro de texto y
falsificar entradas.

## 🌐 Las implementaciones — el código a la vista

Las cuatro hacen lo mismo en tres gestos: **respetar** el identificador que
llega, **generar** uno si falta y **devolverlo** en la respuesta. Lo que separa
al elenco es si el framework además lo propaga al registro por su cuenta.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs)

```javascript
app.use((peticion, respuesta, siguiente) => {
  const entrante = peticion.get("x-request-id");
  peticion.correlacion = entrante && entrante.length <= 128 ? entrante : randomUUID();
  respuesta.set("x-request-id", peticion.correlacion);
  siguiente();
});
```

Cinco líneas y las tres decisiones dentro. Las dos mitades importan por motivos
distintos: **respetarlo** permite seguir una petición a través de varios
servicios; **generarlo** garantiza que ninguna se quede sin rastro.

El `length <= 128` no es adorno defensivo: **el identificador entra en los
registros y lo controla el cliente**. Sin tope, es una vía directa para inflarlos
— y quien paga el almacenamiento de registros sabe lo que eso significa.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

```python
    entrante = peticion.headers.get("x-request-id")
    correlacion = entrante if entrante and len(entrante) <= 128 else str(uuid.uuid4())
    peticion.state.correlacion = correlacion

    respuesta = await siguiente(peticion)
    respuesta.headers["x-request-id"] = correlacion
    return respuesta
```

Idéntico en intención. Y una diferencia estructural obligada: **la cabecera se
pone después del `await`**, porque hasta entonces la respuesta no existe. En
Express se pone antes, sobre un objeto que ya está.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
    var entrante = contexto.Request.Headers["X-Request-Id"].FirstOrDefault();
    var correlacion = !string.IsNullOrEmpty(entrante) && entrante.Length <= 128
        ? entrante
        : Guid.NewGuid().ToString();

    contexto.Items["correlacion"] = correlacion;
    contexto.Response.Headers["X-Request-Id"] = correlacion;
```

`FirstOrDefault()` porque **una cabecera puede venir repetida**: `Headers[...]`
devuelve una colección, no una cadena. Es el único de los cuatro donde el tipo
recuerda ese hecho de HTTP en vez de esconderlo.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — y lo que aporta de más

```java
            String correlacion = (entrante != null && !entrante.isEmpty() && entrante.length() <= 128)
                    ? entrante
                    : UUID.randomUUID().toString();

            p.setAttribute("correlacion", correlacion);
            ((HttpServletResponse) respuesta).setHeader("X-Request-Id", correlacion);
```

Hasta aquí, lo mismo que los otros tres. Lo que sigue no lo tiene ninguno:

```java
            MDC.put("correlacion", correlacion);
            try {
                cadena.doFilter(peticion, respuesta);
            } finally {
                MDC.remove("correlacion");
            }
```

**El contexto de diagnóstico.** A partir de ese `put`, toda línea de registro
emitida en ese hilo lleva el identificador **sin que ningún método tenga que
pasarlo como argumento**. Es la diferencia entre propagar el contexto a mano por
veinte funciones y tenerlo implícito.

**Y el `finally` es obligatorio.** El hilo vuelve al grupo y se reutiliza: sin la
limpieza, la petición siguiente hereda el identificador de la anterior y el
registro miente **de la peor forma posible** — atribuyendo eventos a la petición
equivocada, que es peor que no tener identificador.

Es el mismo riesgo que el estado global de la clase 027 con otra cara: aquí el
estado no es una variable del módulo, es una variable **atada al hilo** que
sobrevive a la petición.

En Node y en Python el equivalente existe —el almacenamiento local asíncrono—
y resuelve el mismo problema para modelos sin hilos. No está en estas
implementaciones a propósito: lo que la clase compara es lo que cada framework
trae puesto, y en tres de los cuatro esto hay que traerlo.

## 🔬 Comparación

| Framework | Almacén | Propagación automática al registro |
| --- | --- | --- |
| Spring Boot | atributo + contexto de diagnóstico | **sí**, con limpieza obligatoria |
| ASP.NET Core | `contexto.Items` + ámbitos de registro | sí, con ámbitos |
| FastAPI | `peticion.state` | no de serie |
| Express | propiedad en `peticion` | no de serie |

Los dos de arriba lo traen; los dos de abajo lo montan con almacenamiento local
asíncrono. **Ninguno lo activa por omisión.**

## 🌍 El estándar que conviene conocer

Esta clase usa `x-request-id` por ser lo más extendido. El estándar del W3C para
esto es **`traceparent`**, y es lo que usa OpenTelemetry
[@opentelemetry-docs]: lleva identificador de traza, identificador de tramo y
banderas, y permite reconstruir el árbol completo de llamadas, no solo agruparlas.

La clase 132 lo desarrolla. Para empezar, `x-request-id` resuelve el 80 % del
problema con el 10 % del trabajo.

## ⚠️ Errores frecuentes

- **Aceptar el identificador del cliente sin límite ni validación.**
- **No limpiar el contexto del hilo.** La petición siguiente hereda el
  identificador.
- **Generarlo y no devolverlo.** El usuario no puede decirte cuál fue su petición.
- **No propagarlo a los servicios que llamas.** Se pierde en el primer salto.
- **Usar el identificador de sesión como correlación.** Mete un dato sensible en
  todos los registros.

## ✅ Verificación

```bash
node scripts/run-class.mjs 030
```

## 🧪 Reto de transferencia

Haz que la implementación de Express propague el identificador a **todas** sus
líneas de registro sin pasarlo como argumento, usando `AsyncLocalStorage`. Es el
equivalente del contexto de diagnóstico de Spring, y entender por qué hace falta
un mecanismo especial en un modelo asíncrono es el objetivo.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 132 — Trazas](../../parte-10-calidad-y-operacion/132-trazas/README.md)
- [Módulo 08 — Calidad, rendimiento y operación](../../../curriculum/08-calidad-rendimiento-y-operacion.md)

## Fuentes

- [@opentelemetry-docs] *OpenTelemetry Documentation*, CNCF — <https://opentelemetry.io/docs/>
- [@majors-observability] Majors, Charity; Fong-Jones, Liz; Miranda, George. *Observability Engineering*. O'Reilly Media, 2022. ISBN 9781492076445 — <https://openlibrary.org/isbn/9781492076445>
- [@newman-building-microservices] Newman, Sam. *Building Microservices*, 2.ª ed. O'Reilly Media, 2021. ISBN 9781492034025 — <https://openlibrary.org/isbn/9781492034025>
