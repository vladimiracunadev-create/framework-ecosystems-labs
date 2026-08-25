# Clase 047 — Idempotencia

> [⬅️ 046](../046-filtrado-y-ordenacion/README.md) · [📚 Parte 3](../README.md) · [🎓 Clases](../../README.md) · [048 ➡️](../048-etags-y-cache-condicional/README.md)
>
> Parte **3 — Validación y contrato** · Nivel **🔴 avanzado** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Hacer que **reintentar no duplique**, en una operación que por naturaleza no es
idempotente. La clase 014 explicó que `POST` no lo es; esta lo arregla.

## 🧩 El problema, en concreto

Un cliente envía `POST /pagos`. La respuesta se pierde por un corte de red. **El
cliente no sabe si el pago se hizo.**

Sus dos opciones son igual de malas:

- **Reintentar** → posible cobro doble.
- **No reintentar** → posible pago que no se hizo.

No hay forma de resolverlo desde el cliente. **Tiene que resolverlo el servidor**,
y la herramienta es una clave que el cliente genera y repite en el reintento.

## 🧩 La situación

Tres peticiones `POST` idénticas con la misma clave de idempotencia crean **una
sola tarea**. Sin clave, cada `POST` crea otra.

## 📖 Cómo funciona

```text
POST /tareas
Idempotency-Key: abc-123
```

- **Primera vez con esa clave** → se ejecuta, se guarda la respuesta.
- **Otra vez con la misma clave** → se devuelve **la misma respuesta**, sin
  ejecutar nada.

Lo importante es qué se devuelve: **el mismo código y el mismo cuerpo**, no un
409 ni un «ya existe». Para el cliente, el reintento tiene que ser
indistinguible del primer intento — esa es toda la propuesta.

Y la cabecera `Idempotent-Replay: true` permite distinguirlo a quien quiera
saberlo, sin obligar a nadie.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `POST` con clave `abc-123` | `201` · `id: "1"` |
| **el mismo** otra vez | `201` · `id: "1"` — sin crear otra |
| igual | `idempotent-replay: true` |
| `GET /tareas` tras tres envíos | `total: 1` |
| `POST` con clave `def-456` | `201` · `id: "2"` |
| `POST` **sin clave** | `201` · `id: "3"` |

El cuarto caso es la prueba real: **tres peticiones idénticas, una sola tarea**.
Y el último confirma que sin clave, `POST` vuelve a comportarse como `POST` — la
idempotencia es opcional y la pide el cliente.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Idempotencia**](../../../glosario/README.md#idempotencia) | Que repetir la misma petición produzca el mismo estado final. `PUT` y `DELETE` lo son por definición; `POST` no. La idempotencia **viene de lo que hace el código**, no del verbo: un `PUT` que acumule en vez de reemplazar rompe la promesa. |

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
PORT=3000 java -jar target/clase-047-1.0.0.jar --server.port=3000
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
| `Clase047.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las cuatro guardan **la respuesta emitida** indexada por la clave y la devuelven
tal cual en el reintento. La diferencia está en **cómo escriben en ese registro**,
y no es un detalle de estilo: es la diferencia entre una implementación correcta y
una que lo parece.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — el mecanismo, a la vista

```javascript
const respuestas = new Map();
```

```javascript
  const clave = peticion.get("idempotency-key");

  // Sin clave, POST se comporta como POST: cada llamada crea otra.
  if (!clave) {
    const creada = crear(peticion.body?.titulo);
    return respuesta.status(201).json(creada);
  }
```

**Sin clave, `POST` se comporta como `POST`.** La idempotencia no se impone: la
pide el cliente, porque es él quien sabe si va a reintentar.

```javascript
  const previa = respuestas.get(clave);
  if (previa) {
    // Se devuelve LA MISMA respuesta, con el mismo código y el mismo cuerpo.
    // Y se declara que fue un reenvío: el cliente puede distinguirlo si quiere.
    return respuesta.status(previa.estado).set("idempotent-replay", "true").json(previa.cuerpo);
  }
```

Lo que se guarda es **la respuesta completa** —código y cuerpo—, no solo un
«ya se hizo». Un reintento tiene que recibir exactamente lo mismo que la primera
vez, incluido el identificador generado; si recibiera un `200` vacío, el cliente
que perdió la primera respuesta seguiría sin saber qué se creó.

Y `Idempotent-Replay: true` es cortesía útil: el cliente puede distinguir el
reenvío si le sirve, y puede ignorarlo si no.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

```python
def crear_tarea(
    cuerpo: Cuerpo,
    idempotency_key: Annotated[str | None, Header()] = None,
) -> JSONResponse:
```

```python
    tarea = crear(cuerpo.titulo)
    respuestas[idempotency_key] = {"estado": 201, "cuerpo": tarea}
```

La misma estructura. Y **la misma carencia deliberada** que Express: entre el
`respuestas.get` y el `respuestas[...] =` hay un hueco. Es la versión ingenua, y
está aquí para poder compararla con las dos siguientes.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — atómico

```java
        Map<String, String> creada = respuestas.computeIfAbsent(clave, k -> crear(texto));
```

Una línea, y cierra el hueco. `computeIfAbsent` sobre un `ConcurrentHashMap`
**comprueba y escribe como una sola operación**: dos peticiones simultáneas con
la misma clave no pueden crear dos tareas.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — atómico

```csharp
    var creada = respuestas.GetOrAdd(clave, _ => Crear(titulo));
```

El equivalente exacto en .NET. Mismo nombre distinto, misma garantía.

### El hueco, y por qué importa aquí más que en ningún otro sitio

La versión ingenua es esta:

```javascript no-extracto
if (!respuestas.has(clave)) {      // ← dos peticiones pueden estar aquí a la vez
  respuestas.set(clave, crear());  // ← y las dos crean
}
```

**Entre comprobar y escribir hay un hueco.** Dos reintentos simultáneos —que es
exactamente lo que pasa cuando un cliente reintenta agresivamente, o cuando un
temporizador de red dispara mientras la primera petición todavía viaja— pueden
pasar los dos por el `if` antes de que ninguno escriba, y crear dos veces.

Es el fallo que la idempotencia venía a cerrar, **reproducido dentro de su propia
implementación**. Y solo aparece bajo concurrencia, así que ninguna prueba
secuencial lo ve — el contrato de esta clase tampoco.

En una base de datos la forma correcta no es ninguna de las cuatro: es una
**restricción de unicidad sobre la clave**. El segundo intento falla al insertar,
se captura ese fallo y se recupera la respuesta guardada. **La atomicidad la
garantiza el motor**, que es el único que puede garantizarla cuando hay varias
instancias del proceso.

Y esa es también la limitación que las cuatro comparten:

```javascript
// Clave de idempotencia → respuesta ya emitida. En producción esto vive en un
```

El registro vive **en memoria del proceso**. Con dos instancias detrás de un
balanceador, cada una tiene el suyo y la garantía desaparece — el mismo problema
que la limitación de tasa de la clase 034, y con la misma solución: un almacén
compartido con caducidad.

## 🔬 Comparación

| Framework | Escritura en el registro | ¿Segura con reintentos simultáneos? |
| --- | --- | --- |
| Spring Boot | `computeIfAbsent` | **sí**, atómica |
| ASP.NET Core | `GetOrAdd` | **sí**, atómica |
| FastAPI | asignación en un diccionario | dentro de un proceso |
| Express | asignación en un mapa | dentro de un proceso |

Los dos de abajo no tienen carrera **dentro del proceso** porque el modelo es de
un solo hilo. Esa protección desaparece con varios trabajadores, que es lo normal
en producción.

## ⚠️ Lo que este código no resuelve

```javascript
const respuestas = new Map();
```

Un mapa en memoria. Con dos instancias, **cada una tiene su propio registro** y un
reintento que caiga en la otra crea un duplicado.

Es la misma conclusión que la clase 034 con los cupos: **el estado que tiene que
ser único no puede vivir en el proceso**. En producción va a un almacén
compartido, con caducidad —24 horas es lo habitual— porque guardar todas las
claves para siempre no es viable.

Y hay una decisión más que este código no toma: **qué hacer si llega la misma
clave con un cuerpo distinto**. Lo correcto es responder `422`: la clave promete
que es el mismo intento, y un cuerpo distinto dice que no lo es. Devolver la
respuesta antigua sería mentir.

## 🧭 Cuándo hace falta

No siempre. La pregunta es **qué cuesta un duplicado**:

| Operación | Duplicado | ¿Hace falta? |
| --- | --- | --- |
| Cobrar | dinero real | **sí** |
| Enviar un correo | dos correos | sí |
| Crear un pedido | dos pedidos | sí |
| Registrar una métrica | ruido | no |
| Crear un borrador | uno de más | probablemente no |

Y hay una alternativa más barata cuando encaja: **hacer la operación idempotente
por diseño**. `PUT /tareas/{id}` con el identificador generado por el cliente no
necesita claves — repetirlo escribe lo mismo. Es la lección de la clase 014, y
cuando se puede aplicar, evita toda esta maquinaria.

## ⚠️ Errores frecuentes

- **Comprobar y escribir sin atomicidad.** El fallo dentro de la solución.
- **Devolver 409 en el reintento.** El cliente no puede distinguir su reintento
  de un conflicto real.
- **Guardar solo «ya se hizo» y no la respuesta.** El cliente reintenta y no
  recibe los datos que necesitaba.
- **Claves sin caducidad.** El registro crece sin límite.
- **Aceptar la misma clave con otro cuerpo.**
- **Estado en memoria con varias instancias.**

## ✅ Verificación

```bash
node scripts/run-class.mjs 047
```

## 🧪 Reto de transferencia

Añade el caso «misma clave, cuerpo distinto → 422» al contrato e impleméntalo en
las cuatro. Requiere guardar también un resumen del cuerpo junto a la respuesta,
y es lo que convierte esta implementación en una utilizable de verdad.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 014 — Verbos HTTP y su semántica](../../parte-1-responder/014-verbos-http-y-su-semantica/README.md)
- [Clase 112 — Reintentos e idempotencia](../../parte-8-tiempo-real-y-segundo-plano/112-reintentos-e-idempotencia/README.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
