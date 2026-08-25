# Clase 024 — CORS

> [⬅️ 023](../023-compresion/README.md) · [📚 Parte 1](../README.md) · [🎓 Clases](../../README.md) · [025 ➡️](../025-que-hace-tu-framework-con-el-socket/README.md)
>
> Parte **1 — Responder** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

**Entender el mecanismo antes de configurarlo.** CORS es la fuente de errores más
copiada-y-pegada de la web, y casi todas las soluciones de internet lo desactivan
en lugar de configurarlo.

## 📖 Qué es CORS y qué no es

**Lo que no es:** una defensa de tu servidor. CORS no impide que nadie llame a tu
API. `curl`, un cliente móvil o un script de servidor la llaman igual, sin
preguntar. Cualquiera puede.

**Lo que es:** una regla que aplica **el navegador** para proteger a *sus*
usuarios. Impide que una página de `atacante.example` lea la respuesta de una
petición hecha a `tubanco.example` con las cookies de la víctima.

La distinción es la clave de la clase: **el permiso lo concede tu servidor y lo
hace cumplir el navegador**. Tu servidor solo dice «este origen puede leer mi
respuesta»; quien obedece es el navegador de la víctima.

De ahí se sigue lo importante: **poner `Access-Control-Allow-Origin: *` no abre
tu API — ya estaba abierta.** Lo que hace es permitir que cualquier página web
lea las respuestas desde el navegador de sus visitantes. Si tu API usa cookies de
sesión, eso sí es grave.

## 📖 La comprobación previa

Antes de ciertas peticiones, el navegador manda un `OPTIONS` preguntando si puede:

```text
OPTIONS /datos
Origin: https://permitido.example
Access-Control-Request-Method: GET
Access-Control-Request-Headers: x-token
```

Y espera una respuesta 2xx con los permisos. Dispara esa comprobación cualquier
petición que no sea «simple»: métodos distintos de GET, HEAD o POST, cabeceras
propias como `x-token`, o `content-type: application/json` [@whatwg-fetch].

**Esa última condición explica el 90 % de los errores de CORS**: enviar JSON ya
obliga a la comprobación previa, así que casi cualquier API moderna la necesita
aunque solo haga `GET`.

`Access-Control-Max-Age` permite al navegador recordar el permiso y ahorrarse la
pregunta durante un tiempo.

## 🧩 La situación

`GET /datos` responde `{"ok":true}`. El servidor autoriza a leer esa respuesta
solo a `https://permitido.example`. Cualquier otro origen recibe **los mismos
datos** y **sin la cabecera de autorización** — y es el navegador quien impide
que la página los lea.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `OPTIONS` con origen permitido | `200` o `204` |
| igual | `access-control-allow-origin: https://permitido.example` |
| `GET` con origen permitido | `200` + la misma cabecera |
| `GET` con origen **no** permitido | `200` o `403`, y **sin** la cabecera |

El último caso es el más instructivo, y destapó una divergencia real entre los
cuatro:

**Express, FastAPI y ASP.NET Core responden 200 y sirven los datos**, sin la
cabecera de autorización. Es la lectura literal de la especificación: el permiso
lo concede el servidor y lo hace cumplir el navegador, así que un origen no
autorizado recibe la respuesta y su navegador le impide leerla.

**Spring Boot responde 403 y no sirve nada.** Su filtro de CORS rechaza la
petición directamente.

Las dos posturas son defendibles. La de Spring añade una barrera para clientes
que sí respetan la cabecera `Origin`; la de los otros tres es más fiel al modelo,
porque un atacante con `curl` simplemente no envía `Origin` y obtiene los datos
en ambos casos.

Por eso el contrato exige **la propiedad de seguridad** —que el origen no
autorizado no reciba la cabecera— y admite los dos códigos. Exigir 200 habría
medido la implementación de Express, no el contrato.

## 🔍 Lo que esta clase destapó

El contrato exigía al principio **exactamente 204** para la comprobación previa.
Express respondía 204 y FastAPI 200, y la implementación de FastAPI aparecía como
rota.

No lo estaba. La especificación de Fetch exige un **estado correcto** —cualquier
2xx— y no uno concreto [@whatwg-fetch]. Las dos cumplen.

Fue la segunda aserción sobre-especificada de esta parte, después de la de
`Cache-Control` en la clase 016. De ahí salió el tercer tipo de aserción del
verificador:

| Aserción | Cuándo | Ejemplo |
| --- | --- | --- |
| `estado` | el estándar fija uno | `201` al crear |
| `estado_en` | el estándar admite varios | 2xx en la comprobación previa |

La lección se repite: **una prueba que exige más de lo que el estándar exige mide
la implementación, no el contrato**, y produce rojos que no significan nada.

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
- **Versión que ejecuta esta clase:** `express ^5.1.0, cors ^2.8.5`
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
PORT=3000 java -jar target/clase-024-1.0.0.jar --server.port=3000
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
| `Clase024.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las cuatro declaran lo mismo —orígenes, métodos, cabeceras y duración— y las
cuatro lo declaran **en una lista explícita**. Esa es la primera lección, y la
que más se incumple fuera de este laboratorio.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs)

```javascript
const PERMITIDOS = new Set(["https://permitido.example"]);
```

```javascript
  cors({
    origin: (origen, devolver) => devolver(null, origen !== undefined && PERMITIDOS.has(origen)),
    methods: ["GET", "POST"],
    allowedHeaders: ["content-type", "x-token"],
    maxAge: 600,
    optionsSuccessStatus: 204,
  }),
```

`origin` como **función** y no como `true`. La diferencia parece cosmética y no
lo es: `origin: true` **refleja cualquier origen** que llegue en la petición —
devuelve en la cabecera lo que le mandaron—, y combinado con credenciales
equivale a no tener defensa ninguna.

`optionsSuccessStatus: 204` está por un detalle histórico: algunos clientes
antiguos no aceptan el `200` con cuerpo vacío que emitiría por omisión.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://permitido.example"],
    allow_methods=["GET", "POST"],
    allow_headers=["content-type", "x-token"],
    max_age=600,
)
```

La forma más directa del elenco: una lista literal. Y una trampa conocida de
este middleware que conviene saber: `allow_origins=["*"]` junto a
`allow_credentials=True` **no funciona** — el estándar lo prohíbe, y Starlette
lo respeta en silencio en vez de fallar. Quien lo escribe cree que abrió todo y
no abrió nada.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
        CorsConfiguration configuracion = new CorsConfiguration();
        configuracion.setAllowedOrigins(List.of("https://permitido.example"));
        configuracion.setAllowedMethods(List.of("GET", "POST"));
        configuracion.setAllowedHeaders(List.of("content-type", "x-token"));
        configuracion.setMaxAge(600L);
```

```java
        UrlBasedCorsConfigurationSource fuente = new UrlBasedCorsConfigurationSource();
        fuente.registerCorsConfiguration("/**", configuracion);
        return new CorsFilter(fuente);
```

Las dos líneas finales son las que importan: la configuración **se registra
contra un patrón de ruta**. Aquí es `/**` porque la aplicación tiene una sola
ruta, y el mecanismo admite tantas configuraciones como patrones.

Es también la implementación que deja más claro **dónde vive CORS**: en un
filtro, antes de los controladores. No es una decisión de la ruta; es una
decisión de la tubería (clase 026).

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
    opciones.AddPolicy("permitidos", politica => politica
        .WithOrigins("https://permitido.example")
        .WithMethods("GET", "POST")
        .WithHeaders("content-type", "x-token")
        .SetPreflightMaxAge(TimeSpan.FromSeconds(600)));
```

```csharp
app.UseCors("permitidos");
```

**Políticas con nombre**, como en la clase 070 con la autorización. La política
se define una vez y las rutas la piden por su nombre — así que puede haber
varias y aplicarse distinta a cada zona.

`SetPreflightMaxAge` con un `TimeSpan` en lugar de un número suelto: el tipo
dice que son segundos, y no hay que recordarlo.

### Lo que separa al elenco

**ASP.NET Core y Spring Boot permiten políticas distintas por ruta.** Express y
FastAPI aplican una configuración a toda la aplicación.

No es un detalle de comodidad: es lo que hace falta cuando **parte de tu API es
pública y parte no**, y es lo que evita la tentación de poner un comodín global
porque una sola ruta lo necesitaba. La configuración más insegura del mundo real
casi siempre empieza siendo la más cómoda.

## 🔬 Comparación

| Framework | Dónde se declara | ¿Políticas por ruta? | Riesgo del camino cómodo |
| --- | --- | --- | --- |
| ASP.NET Core | política con nombre + aplicación | **sí** | registrar y olvidar aplicar |
| Spring Boot | filtro por patrón, o anotación | **sí** | dos configuraciones que se contradicen |
| Express | opciones de la biblioteca | por montaje | `origin: true` refleja cualquier origen |
| FastAPI | capa global | no cómodamente | `allow_origins=["*"]` |

Y una diferencia de comportamiento, no de configuración: ante un origen no
permitido, **Spring Boot responde 403** mientras los otros tres responden 200 sin
la cabecera.

Los dos primeros permiten reglas distintas por ruta, que es lo que hace falta
cuando parte de la API es pública y parte no. Sin esa separación, la tentación es
aplicar la regla más laxa a todo.

## ⚠️ Errores frecuentes

- **`origin: "*"` con credenciales.** El navegador lo rechaza, y con razón: sería
  autorizar a cualquiera a leer respuestas autenticadas.
- **Reflejar el origen recibido sin comprobarlo.** Equivale al comodín, con peor
  aspecto.
- **Creer que CORS protege la API.** No lo hace. La autorización es la clase 070.
- **Olvidar que la comprobación previa necesita atender `OPTIONS`.** Si una capa
  de autenticación intercepta el `OPTIONS` y devuelve 401, CORS falla y el mensaje
  no lo explica.
- **Configurarlo por prueba y error hasta que deje de fallar.** Es cómo se llega
  al comodín.

## ✅ Verificación

```bash
node scripts/run-class.mjs 024
```

## 🧪 Reto de transferencia

Activa las credenciales (`allow_credentials` / `AllowCredentials`) y observa que
el comodín deja de estar permitido. Después explica por qué el navegador impone
esa restricción — está en el contrato de esta clase.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 072 — CSRF](../../parte-5-identidad-y-seguridad/072-csrf/README.md)
- [Módulo 07 — Identidad y seguridad](../../../curriculum/07-identidad-y-seguridad.md)

## Fuentes

- [@whatwg-fetch] *Fetch Standard*, WHATWG — <https://fetch.spec.whatwg.org/>
- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
- [@owasp-cheatsheets] *OWASP Cheat Sheet Series*, OWASP Foundation — <https://cheatsheetseries.owasp.org/>
