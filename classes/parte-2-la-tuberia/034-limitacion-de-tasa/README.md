# Clase 034 — Limitación de tasa

> [⬅️ 033](../033-limite-de-tamano-del-cuerpo/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [035 ➡️](../035-cabeceras-de-seguridad/README.md)
>
> Parte **2 — La tubería** · Nivel **🔴 avanzado** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Proteger el servicio del uso excesivo —**legítimo o no**— y decirle al cliente
cuándo puede volver.

## 🧩 La situación

Tres peticiones pasan. La cuarta responde **429** con `Retry-After`. Y cada
respuesta informa del cupo, del consumo restante y de cuándo se repone.

## 📖 Legítimo o no: la distinción importa

Se habla de limitación de tasa como defensa contra abusos, y **la mayoría de las
veces frena a clientes bien intencionados**: un bucle mal escrito, una
sincronización que se dispara, un reintento sin espera creciente.

De ahí que las cabeceras informativas no sean cortesía. Un cliente que ve
`ratelimit-remaining: 1` puede reducir el ritmo **antes** de que lo corten. Uno
que solo recibe un 429 seco no sabe qué hizo mal.

Y `Retry-After` es lo más importante de la respuesta: sin ella, el cliente
reintenta de inmediato y **multiplica la carga que provocó el corte**. Es la
espiral que Nygard describe cuando los reintentos no están amortiguados
[@nygard-release-it].

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| 1.ª, 2.ª, 3.ª | `200` |
| 4.ª | `429` |
| igual | `retry-after` presente |

## 📖 El algoritmo, en una frase

Las cuatro implementaciones usan un **cubo con ventana fija**: cada cliente tiene
N fichas, se gasta una por petición y se reponen todas al empezar la ventana
siguiente.

Es el más simple y tiene un defecto conocido: **el efecto borde**. Con un cupo de
100 por minuto, un cliente puede gastar 100 al final de un minuto y 100 al
principio del siguiente — 200 en dos segundos.

Las alternativas resuelven eso a cambio de complejidad:

| Algoritmo | Idea | Coste |
| --- | --- | --- |
| Ventana fija | fichas que se reponen de golpe | mínimo; efecto borde |
| Ventana deslizante | cuenta los últimos 60 segundos reales | más memoria |
| Cubo con goteo | las fichas se reponen gradualmente | permite ráfagas controladas |

Para casi todo, la ventana fija basta. Merece la pena saber por qué podría no
bastar.

## ⚠️ El problema que este código no resuelve

```javascript
const cubos = new Map();
```

**Un mapa en memoria del proceso.** Con dos instancias del servicio, cada una
tiene su propio cubo y el cupo real es el doble del declarado. Con diez, diez
veces.

No es un defecto de estas implementaciones: es la propiedad que define el
problema. **La limitación de tasa necesita estado compartido**, y por eso en un
despliegue real vive en un almacén externo o en el servidor de entrada, no en el
proceso de aplicación.

Es la misma conclusión de la clase 109 sobre el estado de conexión: **cuando el
estado tiene que ser único y hay varias instancias, el estado sale del proceso**.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Limitación de tasa**](../../../glosario/README.md#limitación-de-tasa) *(Rate limiting)* | Poner un tope de peticiones por cliente y ventana de tiempo. Su respuesta `429` debe llevar `Retry-After`: sin ella el cliente reintenta en bucle, que es lo que se quería evitar. Con varias instancias, el estado tiene que ser compartido. |

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
PORT=3000 java -jar target/clase-034-1.0.0.jar --server.port=3000
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
| `Clase034.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Tres montan el cubo a mano —para que el algoritmo se vea— y **una usa lo que trae
la plataforma**. Y las cuatro comparten el mismo problema de fondo, que la clase
declara en vez de esconder.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — el algoritmo, a la vista

```javascript
function consumir(clave) {
  const ahora = Date.now();
  const cubo = cubos.get(clave) ?? { restantes: CUPO, reinicio: ahora + VENTANA_MS };
  if (ahora >= cubo.reinicio) {
    cubo.restantes = CUPO;
    cubo.reinicio = ahora + VENTANA_MS;
  }
  const permitido = cubo.restantes > 0;
  if (permitido) cubo.restantes -= 1;
  cubos.set(clave, cubo);
  return { permitido, ...cubo };
}
```

Diez líneas y el algoritmo entero: **ventana fija con reinicio**. Cada clave
tiene un cupo y un instante de reinicio; al pasar ese instante el cupo vuelve a
llenarse.

```javascript
  respuesta.set("ratelimit-limit", String(CUPO));
  respuesta.set("ratelimit-remaining", String(restantes));
  respuesta.set("ratelimit-reset", String(segundos));
```

```javascript
    return respuesta
      .status(429)
      .set("retry-after", String(segundos))
```

Las tres cabeceras `RateLimit-*` **en todas las respuestas**, no solo en el
rechazo: es lo que permite a un cliente educado bajar el ritmo *antes* de que le
corten.

Y `Retry-After` **no es opcional**: sin ella el cliente no sabe cuándo volver y
reintenta en bucle, que es exactamente lo que se quería evitar. Un limitador que
provoca más tráfico del que ahorra está mal montado.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — el mismo cubo

```python
def consumir(clave: str) -> tuple[bool, int, int]:
    ahora = time.time()
    cubo = cubos.setdefault(clave, {"restantes": CUPO, "reinicio": ahora + VENTANA})
    if ahora >= cubo["reinicio"]:
        cubo["restantes"] = CUPO
        cubo["reinicio"] = ahora + VENTANA
    permitido = cubo["restantes"] > 0
    if permitido:
        cubo["restantes"] -= 1
```

Traducción directa. La función es **independiente del framework** —recibe una
clave y devuelve una decisión—, así que se puede probar sin servidor.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — el mismo cubo, con candado

```java
        private final ConcurrentHashMap<String, Cubo> cubos = new ConcurrentHashMap<>();
```

```java
            synchronized (cubo) {
                long ahora = Instant.now().toEpochMilli();
                if (ahora >= cubo.reinicio) {
                    cubo.restantes = CUPO;
                    cubo.reinicio = ahora + VENTANA_MS;
                }
                permitido = cubo.restantes > 0;
                if (permitido) {
                    cubo.restantes--;
                }
```

Mismo algoritmo, **y dos piezas de concurrencia que en Node y Python no hacen
falta**: el mapa concurrente para el registro de cubos y el `synchronized` para
la lectura-modificación-escritura de cada cubo.

No es estilo: **un `HashMap` normal aquí sería un fallo de concurrencia**, y sin
el bloque sincronizado dos peticiones simultáneas podrían leer `restantes = 1`
las dos y pasar las dos. Es la tercera vez en la parte 2 que el modelo de
ejecución de la JVM obliga a escribir algo que los otros no necesitan.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — viene en la plataforma

```csharp
constructor.Services.AddRateLimiter(opciones =>
{
    opciones.RejectionStatusCode = 429;
    opciones.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(contexto =>
        RateLimitPartition.GetFixedWindowLimiter(
            contexto.Connection.RemoteIpAddress?.ToString() ?? "anonimo",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 3,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
            }));
```

```csharp
    opciones.OnRejected = async (contexto, cancelacion) =>
    {
        contexto.HttpContext.Response.Headers.RetryAfter = "60";
```

**El único de los cuatro que no necesita ni biblioteca externa ni código
propio.** `System.Threading.RateLimiting` es biblioteca estándar y trae varios
algoritmos —ventana fija, ventana deslizante, cubo de fichas, concurrencia— con
particionado por clave.

`QueueLimit = 0` es una decisión declarada: la alternativa sería **encolar** las
peticiones que exceden en lugar de rechazarlas. Encolar suena más amable y
convierte un `429` inmediato en una espera indefinida, que suele ser peor.

### El problema que las cuatro comparten

```javascript
const cubos = new Map();
```

**El estado vive en el proceso.** Con dos instancias detrás de un balanceador,
cada una tiene su propio cubo y el cupo real es el doble del declarado; con diez,
diez veces.

Ninguno de los cuatro frameworks resuelve esto, y no es un descuido: hace falta
un **almacén compartido** —Redis es lo habitual— y eso ya no es una decisión del
framework sino de la arquitectura. La versión de .NET tiene exactamente el mismo
límite que las tres escritas a mano.

Queda declarado aquí porque es la diferencia entre una clase que enseña el
algoritmo y una que hace creer que el problema está resuelto.

## 🔬 Comparación

| Framework | ¿Incorporado? | Algoritmos | Estado |
| --- | --- | --- | --- |
| ASP.NET Core | **sí**, en la biblioteca estándar | cuatro, con particionado | por proceso |
| Express | no, con biblioteca | según la biblioteca | por proceso o externo |
| FastAPI | no | el que escribas | por proceso |
| Spring Boot | no en Boot a secas | según la pieza que añadas | por proceso o externo |

La última columna es la misma en las cuatro, y es la que importa: **ninguno
resuelve el estado compartido**. Ese problema no es del framework.

## 🔑 Por qué clave limitar

| Clave | Cuándo | Problema |
| --- | --- | --- |
| Dirección IP | clientes anónimos | una oficina entera comparte IP |
| Identificador de usuario | clientes autenticados | no protege el inicio de sesión |
| Clave de API | integraciones | hay que emitirlas |
| IP + ruta | proteger un punto caro | más estado |

La combinación habitual: **por IP en lo público, por usuario en lo autenticado, y
un límite más estricto en el inicio de sesión** — que es el punto donde la
limitación de tasa deja de ser rendimiento y pasa a ser seguridad, porque frena
el ensayo de contraseñas [@owasp-asvs].

## ⚠️ Errores frecuentes

- **429 sin `Retry-After`.** El cliente reintenta de inmediato.
- **Estado en memoria con varias instancias.** El cupo real es N veces el
  declarado.
- **Limitar por IP detrás de un servidor de entrada** sin leer la cabecera
  correcta: todas las peticiones parecen venir de la misma IP.
- **Fiarse de `X-Forwarded-For` sin validar.** La pone el cliente.
- **El mismo cupo para todo.** El inicio de sesión necesita uno mucho más
  estricto.
- **Limitar y no medir.** Sin métricas no sabes si estás cortando abuso o
  clientes.

## ✅ Verificación

```bash
node scripts/run-class.mjs 034
```

## 🧪 Reto de transferencia

Cambia una implementación a **ventana deslizante** y demuestra con dos peticiones
en el borde de la ventana que la de ventana fija deja pasar el doble. Es el
experimento que justifica la complejidad extra.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 109 — Estado de conexión con varias instancias](../../parte-8-tiempo-real-y-segundo-plano/109-estado-de-conexion-con-varias-instancias/README.md)
- [Módulo 08 — Calidad, rendimiento y operación](../../../curriculum/08-calidad-rendimiento-y-operacion.md)

## Fuentes

- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@owasp-asvs] *OWASP Application Security Verification Standard*, OWASP Foundation — <https://owasp.org/www-project-application-security-verification-standard/>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
