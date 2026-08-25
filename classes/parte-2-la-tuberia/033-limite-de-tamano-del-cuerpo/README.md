# Clase 033 — Límite de tamaño del cuerpo

> [⬅️ 032](../032-tiempos-de-espera/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [034 ➡️](../034-limitacion-de-tasa/README.md)
>
> Parte **2 — La tubería** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Rechazar lo excesivo **antes de leerlo entero**. Es el mismo principio de la
clase 021 aplicado a cualquier cuerpo, no solo a los archivos.

## 🧩 La situación

Un cuerpo pequeño se acepta con 201. Uno por encima de 1 KB responde **413**. Y
el servicio sigue en pie después del rechazo.

## 📖 Dos comprobaciones, no una

Un cuerpo grande se puede rechazar en dos momentos, y hacen falta los dos:

**1. Por la cabecera `Content-Length`.** Si el cliente declara 50 MB y tu tope es
1 KB, se rechaza **sin leer un solo byte**. Es la comprobación barata.

**2. Durante la lectura.** Un cliente puede **omitir** `Content-Length` y enviar
el cuerpo troceado. Entonces no hay nada que declarar y el tope hay que aplicarlo
contando lo que llega.

Confiar solo en la primera deja la puerta abierta: basta con no declarar el
tamaño. Es un caso claro de por qué **una comprobación sobre datos que controla el
cliente no puede ser la única**.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| cuerpo pequeño | `201` |
| cuerpo mayor que 1 KB | `413` |
| cuerpo pequeño otra vez | `201` — el servicio sigue |

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
PORT=3000 java -jar target/clase-033-1.0.0.jar --server.port=3000
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
| `Clase033.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las cuatro rechazan por encima de 1 KB y **lo hacen en capas distintas**: una en
el servidor, una en el analizador y dos en el propio código. **Dónde vive el
límite es lo que decide si se puede olvidar.**

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — en el servidor

```csharp
constructor.WebHost.ConfigureKestrel(opciones =>
{
    opciones.Limits.MaxRequestBodySize = 1024;
});
```

```csharp
    catch (Microsoft.AspNetCore.Http.BadHttpRequestException)
    {
        return Results.Json(
            new { type = "about:blank", title = "cuerpo demasiado grande",
                  status = 413, code = "CUERPO_EXCEDIDO" },
            statusCode: 413, contentType: "application/problem+json");
    }
```

**La defensa está por debajo de tu código.** Kestrel corta antes de que el
manejador exista y lanza una excepción que aquí se traduce a `413`.

Es el modelo más robusto de los cuatro por un motivo simple: **no depende de que
nadie se acuerde**. Una ruta nueva nace protegida, y una ruta que olvide el
`catch` responderá con el formato equivocado pero seguirá estando defendida.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — en el analizador

```javascript
app.use(express.json({ limit: "1kb" }));
```

```javascript
app.use((error, peticion, respuesta, siguiente) => {
  if (error?.type === "entity.too.large") {
    return respuesta.status(413).type("application/problem+json").json({
```

Una opción en la capa que analiza el JSON. El límite se comprueba **mientras se
recibe**: Express lee `Content-Length` y, si excede, corta sin leer el cuerpo; si
la cabecera no viene, corta al superar el tope durante la lectura.

Y otra vez el manejador de errores de la clase 031: **sin él, el formato del
error no es el tuyo**. El límite funcionaría, y la respuesta la escribiría
Express.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — las dos comprobaciones, a mano

```python
    declarada = peticion.headers.get("content-length")
    if declarada is not None and declarada.isdigit() and int(declarada) > LIMITE:
```

```python
    crudo = await peticion.body()
    if len(crudo) > LIMITE:
```

Starlette no trae límite de cuerpo, así que las dos comprobaciones son
explícitas. Es más código y **es la implementación donde mejor se ve el
mecanismo** — porque son *dos* y no una, y la razón de que hagan falta las dos
no es evidente:

1. **La cabecera primero**, porque rechazar por `Content-Length` evita leer un
   solo byte. Es la barata.
2. **Lo leído después**, porque un cliente puede **omitir `Content-Length`** y
   enviar el cuerpo troceado. Un atacante lo hará.

Quien implemente solo la primera tiene una defensa que se salta escribiendo una
cabecera de menos. Es el fallo que esta clase existe para enseñar.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — el hueco que conviene conocer

```java
        if (peticion.getContentLengthLong() > LIMITE) {
            throw new CuerpoExcedido();
        }
```

```java
        @ExceptionHandler(CuerpoExcedido.class)
        public ResponseEntity<Map<String, Object>> excedido() {
```

**Spring trae límite para multipart y no para cuerpos JSON corrientes.**
`spring.servlet.multipart.max-file-size` es el que usa la clase 021; para un
`POST` con JSON no hay equivalente. Hay que ponerlo, o delegarlo en el contenedor
o en el servidor de entrada.

Es un hueco fácil de pasar por alto **precisamente porque el de multipart sí
existe**: quien lo configuró una vez para archivos supone razonablemente que
cubre todo.

Y de paso, un valor por omisión que el propio código documenta:

```java
    @org.springframework.web.bind.annotation.ResponseStatus(
            org.springframework.http.HttpStatus.CREATED)
```

Sin `@ResponseStatus`, un `@PostMapping` que devuelve un valor responde `200` y
no `201`. La clase 003 ya lo había medido; aquí vuelve a aparecer.

## 🔬 Comparación

| Framework | Dónde vive | ¿Antes de tu código? | ¿Cubre sin `Content-Length`? |
| --- | --- | --- | --- |
| ASP.NET Core | servidor (Kestrel) | **sí** | sí |
| Express | opción del analizador | sí | sí |
| FastAPI | tu capa + tu manejador | no | sí, si lo escribes |
| Spring Boot | tu código (para JSON) | no | **no**, si solo miras la cabecera |

La columna del medio es la que decide en un incidente: **si la defensa está por
debajo, no se puede olvidar**. Adkins y sus coautores llaman a eso poner el
control en la capa donde no se puede saltar por descuido
[@adkins-building-secure-reliable].

## 🧭 Qué límite poner

No hay número universal, y hay un criterio: **el mayor cuerpo legítimo de tu API,
más un margen**.

Un tope demasiado alto no protege. Uno demasiado bajo rompe casos reales y, lo
que es peor, **rompe en producción con datos grandes** que en desarrollo no
existían.

Y conviene tenerlo por ruta cuando difieren mucho: 1 KB para crear una tarea y
10 MB para subir un adjunto es más sensato que 10 MB para todo.

## ⚠️ Errores frecuentes

- **Fiarse solo de `Content-Length`.** El cliente puede no enviarlo.
- **Leer entero y medir después.** El daño ya está hecho.
- **Devolver 400 en lugar de 413.** El cliente no sabe que el problema es el
  tamaño.
- **Un solo límite para toda la API.** O protege poco o rompe algo.
- **Poner el límite solo en la aplicación** cuando hay un servidor de entrada
  delante que acepta cualquier cosa.

## ✅ Verificación

```bash
node scripts/run-class.mjs 033
```

## 🧪 Reto de transferencia

Envía un cuerpo grande **sin `Content-Length`**, usando codificación troceada, y
comprueba cuáles de las cuatro implementaciones lo rechazan igual. Es el caso que
distingue una defensa real de una comprobación de cortesía.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 021 — Subida de archivos](../../parte-1-responder/021-subida-de-archivos/README.md)
- [Módulo 07 — Identidad y seguridad](../../../curriculum/07-identidad-y-seguridad.md)

## Fuentes

- [@adkins-building-secure-reliable] Adkins, Heather; Beyer, Betsy; Blankinship, Paul; Lewandowski, Piotr; Oprea, Ana; Stubblefield, Adam. *Building Secure and Reliable Systems*. O'Reilly Media, 2020. ISBN 9781492083122 — <https://openlibrary.org/isbn/9781492083122>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@owasp-asvs] *OWASP Application Security Verification Standard*, OWASP Foundation — <https://owasp.org/www-project-application-security-verification-standard/>
