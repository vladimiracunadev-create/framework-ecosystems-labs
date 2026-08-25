# Clase 023 — Compresión

> [⬅️ 022](../022-respuesta-en-flujo/README.md) · [📚 Parte 1](../README.md) · [🎓 Clases](../../README.md) · [024 ➡️](../024-cors/README.md)
>
> Parte **1 — Responder** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Comprimir **cuando compensa**, y no cuando no. Es la primera clase donde la
decisión correcta no es «activarlo siempre».

## 📖 Las tres condiciones

Comprimir cuesta CPU en el servidor y en el cliente. Sale a cuenta cuando se
cumplen las tres:

**1. El cliente lo admite.** Lo dice en `Accept-Encoding`. Comprimir sin que lo
pida produce una respuesta que no puede leer.

**2. La respuesta es lo bastante grande.** Comprimir 20 bytes gasta CPU y puede
**agrandar** el resultado: los formatos de compresión añaden cabecera propia. Por
eso los cuatro frameworks tienen un umbral, y por eso el contrato comprueba que
una respuesta corta **no** se comprime.

**3. El contenido comprime.** El texto se reduce muchísimo. Un JPEG, un PNG o un
vídeo ya vienen comprimidos: pasarlos otra vez es CPU tirada. Por eso la
configuración lista tipos concretos y no aplica a todo.

## ⚠️ Y una cuarta condición, de seguridad

Comprimir **mezclando** contenido secreto con contenido que controla un atacante
permite deducir el secreto por el tamaño de la respuesta. Es la familia de
ataques que llevó a desaconsejar la compresión de respuestas HTTPS que contienen
credenciales.

Por eso ASP.NET Core trae `EnableForHttps` **desactivado por omisión** y hay que
activarlo a conciencia. De los cuatro, es el único que toma esa precaución por
ti; en esta clase se sirve por HTTP y se activa explícitamente.

## 🧩 La situación

`GET /grande` devuelve unos 7 KB de texto y `GET /pequeno` devuelve cinco letras.
El primero se comprime si el cliente lo admite; el segundo **no**, aunque lo
admita, porque comprimirlo saldría más caro que enviarlo.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `/grande` con `accept-encoding: gzip` | `content-encoding: gzip` |
| igual | `vary` contiene `accept-encoding` |
| `/grande` con `accept-encoding: identity` | **sin** `content-encoding` |
| `/pequeno` con `accept-encoding: gzip` | **sin** `content-encoding` |

El `Vary` importa por la misma razón que en la clase 018: sin él, una caché
puede servir la respuesta comprimida a un cliente que no admite compresión.

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
- **Versión que ejecuta esta clase:** `express ^5.1.0, compression ^1.8.1`
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
PORT=3000 java -jar target/clase-023-1.0.0.jar --server.port=3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `pom.xml` | manifiesto de Maven: el proyecto, su Java, sus dependencias y cómo se empaqueta |
| `src/main/java/labs/Aplicacion.java` | código Java |
| `src/main/resources/application.properties` | configuración de Spring Boot: lo que se ajusta sin tocar el código |

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
| `Clase023.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Los cuatro comprimen la respuesta grande y dejan la pequeña en paz. Lo que
cambia es **dónde vive la decisión** y **quién trae el umbral**.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — biblioteca externa

```javascript
app.use(compression({ threshold: 1024 }));
```

Una dependencia más, como en la clase 021 con las subidas: Express no comprime
por su cuenta.

`threshold` es el parámetro que da sentido a la clase: **por debajo de ese
tamaño no se comprime**, porque comprimir veinte bytes cuesta CPU y puede
**agrandar** la respuesta — la cabecera del formato gzip ocupa más que lo que se
ahorra.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — capa incorporada

```python
app.add_middleware(GZipMiddleware, minimum_size=1024)
```

El mismo umbral con otro nombre, y **sin dependencia externa**: viene en
Starlette. Además el middleware añade `Vary: Accept-Encoding` por su cuenta, que
es la cabecera sin la cual una caché intermedia serviría bytes comprimidos a un
cliente que no los pidió [@rfc9111].

### Spring Boot · [`spring-boot/…/application.properties`](implementaciones/spring-boot/src/main/resources/application.properties) — configuración, no código

```properties
server.compression.enabled=true
server.compression.min-response-size=1024
server.compression.mime-types=text/plain,text/html,application/json
```

**El único de los cuatro donde activar la compresión no toca el código.** El
manejador es idéntico al de una aplicación sin compresión:

```java
    @GetMapping(value = "/grande", produces = MediaType.TEXT_PLAIN_VALUE)
    public String grande() {
        return LARGO;
    }
```

La ventaja es concreta y operativa: se activa o desactiva **por entorno sin
recompilar**. Es lo que se quiere cuando hay un servidor de entrada —un
balanceador, un CDN— que ya comprime, y hacerlo dos veces sería desperdicio de
CPU sin ganancia.

Fíjate también en `mime-types`: la lista es explícita. Comprimir un JPEG o un
ZIP es gastar CPU para no ahorrar nada, porque ya están comprimidos.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — servicio, capa y dos precauciones

```csharp
constructor.Services.AddResponseCompression(opciones =>
{
    opciones.EnableForHttps = false;
    opciones.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] { "text/plain" });
});
```

Dos decisiones que los otros tres no obligan a tomar.

**`EnableForHttps = false` es el valor por omisión de .NET, y tiene motivo.**
Comprimir sobre TLS abre la puerta a ataques que deducen el contenido a partir
del tamaño de la respuesta comprimida —la familia de BREACH—. Aquí se sirve por
HTTP en un laboratorio, así que la línea solo hace explícito lo que ya era.

Y la segunda, que es la diferencia real del elenco:

```csharp
app.UseWhen(
    contexto => contexto.Request.Path != "/pequeno",
    rama => rama.UseResponseCompression());
```

**La compresión de .NET no tiene umbral de tamaño.** Comprime todo lo que
coincida con los tipos declarados, por pequeño que sea. El umbral hay que
traerlo de fuera — y aquí se hace derivando la tubería, que es la primera
aparición en el programa de un middleware condicional (clase 027).

Es un ejemplo limpio de algo que se repetirá: **lo que un framework no trae no
siempre es una carencia; a veces es una decisión que te devuelve**. Aquí la
decisión devuelta cuesta tres líneas y hay que saber que existe.

## 🔬 Comparación

| Framework | Dónde se activa | Umbral | Tipos configurables | Precaución de HTTPS |
| --- | --- | --- | --- | --- |
| Spring Boot | configuración | sí | sí | no |
| FastAPI | código, una línea | sí | no (todo lo comprimible) | no |
| Express | código, biblioteca | sí | por función filtro | no |
| ASP.NET Core | código, dos pasos | por proveedor | sí | **sí** |

## 🧭 La pregunta que precede a todas

**¿Quién comprime en tu despliegue?**

Si tienes un servidor de entrada o una red de distribución delante, probablemente
ya comprime. Hacerlo dos veces no rompe nada y gasta CPU dos veces para nada.

En ese caso lo correcto es **desactivarlo en la aplicación**, y esa decisión es
de arquitectura, no de código. Es la clase de pregunta que el
[módulo 08](../../../curriculum/08-calidad-rendimiento-y-operacion.md) enseña a
hacerse antes de tocar una configuración de rendimiento: medir dónde está el
trabajo antes de moverlo.

## ⚠️ Errores frecuentes

- **Comprimir sin umbral.** Respuestas pequeñas más grandes que sin comprimir.
- **Comprimir imágenes y vídeo.** Ya vienen comprimidos.
- **Olvidar `Vary: Accept-Encoding`.** La caché sirve lo comprimido a quien no
  puede leerlo.
- **Comprimir respuestas con secretos sobre HTTPS** junto a contenido que el
  atacante controla.
- **Comprimir dos veces**, en la aplicación y en el servidor de entrada.

## ✅ Verificación

```bash
node scripts/run-class.mjs 023
```

## 🧪 Reto de transferencia

Añade Brotli como segunda codificación y comprueba que se elige cuando el cliente
envía `accept-encoding: br, gzip`. Compara los tamaños resultantes: la diferencia
respecto a gzip explica por qué se adoptó.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 137 — Medir antes de optimizar](../../parte-10-calidad-y-operacion/137-medir-antes-de-optimizar/README.md)
- [Módulo 08 — Calidad, rendimiento y operación](../../../curriculum/08-calidad-rendimiento-y-operacion.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@grigorik-hpbn] Grigorik, Ilya. *High Performance Browser Networking*. O'Reilly Media, 2013. ISBN 9781449344764 — <https://openlibrary.org/isbn/9781449344764>
- [@wagner-web-performance] Wagner, Jeremy. *Web Performance in Action*. Manning, 2016. ISBN 9781617293771 — <https://openlibrary.org/isbn/9781617293771>
