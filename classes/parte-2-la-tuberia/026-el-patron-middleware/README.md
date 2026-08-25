# Clase 026 — El patrón middleware

> [⬅️ 025](../../parte-1-responder/025-que-hace-tu-framework-con-el-socket/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [027 ➡️](../027-el-orden-importa/README.md)
>
> Parte **2 — La tubería** · Nivel **🟢 introductorio** · Pista **`backend`**
>
> ✅ **Clase construida** — 10 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Reconocer **la misma idea con cinco nombres distintos**, y entender por qué todos
los frameworks de servidor acabaron adoptándola.

## 📖 Un patrón con muchos nombres

| Framework | Cómo lo llama | Cómo continúa la cadena |
| --- | --- | --- |
| Express | middleware | `siguiente()` |
| Fastify | gancho (`onRequest`) | por fase, sin llamada explícita |
| FastAPI | middleware | `await siguiente(peticion)` |
| Flask | ganchos (`after_request`) | por fase |
| Django | middleware | `siguiente(peticion)` |
| Spring Boot | **filtro** / interceptor | `cadena.doFilter(...)` |
| ASP.NET Core | middleware | `await siguiente()` |
| Laravel | middleware | `$siguiente($peticion)` |
| Rails | middleware de Rack | `@app.call(env)` |
| Gin | middleware | `c.Next()` |

Debajo de los diez está la **cadena de responsabilidad** del catálogo de patrones
[@gof-design-patterns]: una serie de objetos que reciben una petición y deciden
si la atienden o la pasan al siguiente.

## 🧩 La situación

Una capa intermedia añade `x-capa: intermedia` a **todas** las respuestas: a `/a`,
a `/b` y también al 404 de una ruta que no existe. Ninguna de las rutas sabe que
esa capa existe.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /a` | `200` · `{"ruta":"a"}` · `x-capa: intermedia` |
| `GET /b` | `200` · `{"ruta":"b"}` · `x-capa: intermedia` |
| `GET /no-existe` | `404` · **también** `x-capa: intermedia` |
| `GET /tampoco` | `404` · `{"error":"no existe"}` |

**El tercer caso es el importante.** Si el 404 lleva la cabecera, la capa se
ejecutó **antes del enrutado** — que es lo que distingue una capa de la tubería
de un decorador de ruta. Y es lo que hace que la autenticación, el registro y la
correlación puedan cubrir rutas que aún no existen.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Middleware**](../../../glosario/README.md#middleware) *(Capa, Filtro, Interceptor)* | Una pieza que envuelve al manejador: recibe la petición, hace su parte y llama —o no— a la siguiente. La cadena se recorre hacia dentro y se deshace hacia fuera. Cada ecosistema le da un nombre distinto y el mecanismo es el mismo. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Express** | framework web de Node.js (JavaScript) | 2010 | MIT | OpenJS Foundation |
| **Fastify** | framework web de Node.js (JavaScript/TypeScript) | 2016 | MIT | OpenJS Foundation |
| **FastAPI** | framework web de Python (Python) | 2018 | MIT | proyecto independiente |
| **Flask** | framework web de Python (Python) | 2010 | BSD-3-Clause | Pallets Projects |
| **Django** | framework web de Python (Python) | 2005 | BSD-3-Clause | Django Software Foundation |
| **Spring Boot** | framework de aplicación de JVM (Java) | 2014 | Apache-2.0 | Broadcom/VMware y colaboradores |
| **ASP.NET Core** | framework web de .NET (C#) | 2016 | MIT | Microsoft y .NET Foundation |
| **Laravel** | full-stack-framework de PHP (PHP) | 2011 | MIT | proyecto independiente |
| **Ruby on Rails** | full-stack-framework de Ruby (Ruby) | 2004 | MIT | proyecto independiente |
| **Gin** | framework web de Go (Go) | 2014 | MIT | proyecto independiente |

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

### 🔧 Fastify

Validación y serialización derivadas de JSON Schema, con un sistema de plugins con encapsulamiento explícito.

- **Documentación oficial:** <https://fastify.dev/docs/latest/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `fastify ^5.6.1`
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

### 🔧 Flask

Microframework que dejó a la persona elegir ORM, validación y estructura. El contrapunto exacto de Django dentro del mismo lenguaje.

- **Documentación oficial:** <https://flask.palletsprojects.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `flask==3.1.2`
- **Necesita en el PATH:** `python`

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 python app.py
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `app.py` | código Python |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `requirements.txt` | dependencias de Python, una por línea, con versión fijada |

### 🔧 Django

Baterías incluidas: ORM, migraciones, panel de administración, autenticación y formularios. Su panel generado sigue siendo un argumento decisivo para productos internos.

- **Documentación oficial:** <https://docs.djangoproject.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `django==5.2.8`
- **Necesita en el PATH:** `python`

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 python app.py
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `app.py` | código Python |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
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
PORT=3000 java -jar target/clase-026-1.0.0.jar --server.port=3000
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
| `Clase026.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

### 🔧 Laravel

El framework más usado de PHP: ORM Eloquent, migraciones, colas, programación de tareas, pruebas y un ecosistema comercial propio. Redefinió lo que se espera de la experiencia de desarrollo en el lenguaje.

- **Documentación oficial:** <https://laravel.com/docs>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `php ^8.2, laravel/framework ^12.0`
- **Necesita en el PATH:** `php`, `composer`

Preparar sus dependencias, dentro de su directorio:

```bash
composer install --no-interaction --quiet
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 php -S 127.0.0.1:3000 -t public
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `bootstrap/app.php` | arranque de Laravel: qué grupo de rutas, qué capas y qué manejo de errores |
| `bootstrap/providers.php` | código PHP |
| `composer.json` | manifiesto de Composer: la versión de PHP y las bibliotecas del proyecto |
| `config/app.php` | código PHP |
| `config/cache.php` | código PHP |
| `config/session.php` | código PHP |
| `config/view.php` | código PHP |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

### 🔧 Ruby on Rails

Origen de «convención sobre configuración» y de las migraciones de base de datos tal como se entienden hoy. Casi todos los frameworks completos posteriores citan su influencia.

- **Documentación oficial:** <https://guides.rubyonrails.org/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `rails ~> 8.0, puma ~> 6.4`
- **Necesita en el PATH:** `ruby`, `bundle`

Preparar sus dependencias, dentro de su directorio:

```bash
bundle install --quiet
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 bundle exec puma -b tcp://127.0.0.1:3000 config.ru
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `.bundle/config` | archivo del proyecto |
| `config.ru` | punto de entrada de Rack, el estándar de servidores de Ruby |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Gemfile` | dependencias de Ruby |

### 🔧 Gin

El framework HTTP más usado de Go: enrutado rápido y middleware, sobre la biblioteca estándar.

- **Documentación oficial:** <https://gin-gonic.com/en/docs/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `Go 1.24, github.com/gin-gonic/gin v1.11.0`
- **Necesita en el PATH:** `go`

Preparar sus dependencias, dentro de su directorio:

```bash
go mod tidy
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 go run main.go
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `go.mod` | módulo de Go: su nombre, la versión del lenguaje y sus dependencias |
| `main.go` | código Go |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Diez frameworks, **cuatro formas distintas del mismo patrón**: una cadena con
llamada explícita, un objeto que envuelve a otro, una fábrica que se ejecuta una
vez, y ganchos con nombre por fase.

### La forma más desnuda · Rails, con Rack · [`rails/config.ru`](implementaciones/rails/config.ru)

```ruby
class Capa
  def initialize(app)
    @app = app
  end

  def call(env)
    estado, cabeceras, cuerpo = @app.call(env)
    cabeceras["x-capa"] = "intermedia"
    [estado, cabeceras, cuerpo]
  end
end
```

```ruby
  config.middleware.use Capa
```

**Un objeto que envuelve a otro y responde a `call`. Eso es todo el patrón.**

Rails no inventó nada aquí: hereda Rack entero, y Rack es la especificación
mínima del patrón en Ruby. Empieza por este bloque aunque no sepas Ruby — los
otros nueve son variaciones sobre estas nueve líneas.

Fíjate en que la respuesta es **una tupla que se desarma y se rearma**: estado,
cabeceras y cuerpo. No hay objeto respuesta con métodos; hay tres valores.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — la referencia

```javascript
app.use((peticion, respuesta, siguiente) => {
  respuesta.set("x-capa", "intermedia");
  siguiente();
});
```

`siguiente()` es explícito y obligatorio. **Sin esa llamada la cadena se detiene y
la petición se queda colgada** — es la fuente número uno de peticiones que nunca
responden en Express, y no produce ningún error: produce silencio.

```javascript
app.use((peticion, respuesta) => respuesta.status(404).json({ error: "no existe" }));
```

Y el 404 es otra capa, la última. En Express **todo es la misma cadena**: las
rutas, las capas y el error final.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

```python
@app.middleware("http")
async def capa(peticion: Request, siguiente):
    respuesta = await siguiente(peticion)
    respuesta.headers["x-capa"] = "intermedia"
    return respuesta
```

`await siguiente(peticion)` es el `next()` de Express con otro nombre — y con una
diferencia que ya apareció en la clase 028: **devuelve la respuesta** en vez de
modificar una que ya existe.

### Django · [`django/app.py`](implementaciones/django/app.py) — una fábrica, no una función

```python
def capa(siguiente):
    def procesar(peticion):
        respuesta = siguiente(peticion)
        respuesta["X-Capa"] = "intermedia"
        return respuesta

    return procesar
```

```python
    MIDDLEWARE=[f"{__name__}.capa"],
```

Dos funciones anidadas, y la razón es concreta: **la externa se ejecuta una vez
al arrancar** y la interna en cada petición.

Ese hueco entre las dos es el sitio correcto para el trabajo caro de
inicialización —abrir un fichero de configuración, compilar una expresión
regular, montar un cliente HTTP— que no debe repetirse en cada petición. Ninguno
de los otros nueve lo ofrece tan claramente.

Y el registro es **una cadena de texto** con la ruta al objeto, no una
referencia: Django lo resuelve al arrancar.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — filtro

```java
    public static class Capa implements Filter {
        @Override
        public void doFilter(ServletRequest peticion, ServletResponse respuesta, FilterChain cadena)
                throws IOException, ServletException {
            ((HttpServletResponse) respuesta).setHeader("X-Capa", "intermedia");
            cadena.doFilter(peticion, respuesta);
        }
    }
```

En el mundo de los servlets el patrón se llama **filtro**, y `cadena.doFilter` es
el `siguiente()` de Express. Existe desde mucho antes que Express — la
especificación de Servlet lo trae desde 2000.

Spring tiene además **interceptores**, que actúan más adentro: después del
enrutado y sabiendo qué método va a ejecutarse. La clase 038 compara las dos
alturas.

### Laravel · [`laravel/bootstrap/app.php`](implementaciones/laravel/bootstrap/app.php) — una clase con `handle`

```php
class Capa
{
    public function handle(Request $peticion, Closure $siguiente)
    {
        $respuesta = $siguiente($peticion);
        $respuesta->headers->set('X-Capa', 'intermedia');

        return $respuesta;
    }
}
```

```php
        $middleware->append(Capa::class);
```

**Laravel no acepta una función anónima aquí**, y el motivo es práctico: al
registrar la capa por su nombre de clase, el contenedor puede construirla
inyectándole dependencias (clase 036) y reutilizarla por nombre en grupos de
rutas.

Al montar esta implementación, pasar una función anónima produjo un error de tipo
directo. La restricción es deliberada, no un descuido.

### Fastify · [`fastify/server.mjs`](implementaciones/fastify/server.mjs) — ganchos por fase, no una cadena

```javascript
app.addHook("onRequest", async (peticion, respuesta) => {
  respuesta.header("x-capa", "intermedia");
});
```

**Fastify no usa la cadena de Express.** Usa ganchos con nombre, uno por fase del
ciclo: `onRequest`, `preHandler`, `onSend`, `onResponse`.

No hay `siguiente()` que olvidar —y por tanto no existe la petición colgada de
Express— y a cambio hay que **saber en qué fase entra cada cosa**. Se cambia un
error frecuente por una decisión que hay que aprender.

Es además una decisión con consecuencias medibles: sin cadena que recorrer, el
coste por petición es menor.

### Flask · [`flask/app.py`](implementaciones/flask/app.py) — ganchos también

```python
@app.after_request
def capa(respuesta):
    respuesta.headers["X-Capa"] = "intermedia"
    return respuesta
```

Flask está en el mismo grupo que Fastify: **no tiene middleware propio, tiene
ganchos por fase**. `after_request` se ejecuta con la respuesta ya construida —
incluida la de un 404, que es lo que este contrato exige.

Por debajo sí hay middleware WSGI, que es el equivalente de Rack en Python. Los
ganchos son la capa cómoda por encima.

### Gin · [`gin/main.go`](implementaciones/gin/main.go) — `Next()` en medio

```go
	motor.Use(func(c *gin.Context) {
		c.Header("X-Capa", "intermedia")
		c.Next()
	})
```

Lo interesante de Gin es que **`Next()` está en medio**: lo que escribas después
se ejecuta al volver, con la respuesta ya generada.

Es la forma más visual del elenco de ver que **la cadena se recorre hacia dentro
y se deshace hacia fuera** — la propiedad que la clase 027 mide y que la 029
aprovecha para registrar el estado final.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
app.Use(async (contexto, siguiente) =>
{
    contexto.Response.Headers["X-Capa"] = "intermedia";
    await siguiente();
});
```

Igual que Express. Y un tropiezo real que quedó documentado en el propio archivo:

```csharp
app.MapFallback(() => Results.Json(new { error = "no existe" }, statusCode: 404));
```

`MapFallback` y **no** `app.Run(manejador)`. En ASP.NET Core, `Run` registra una
capa **terminal**, que corta la tubería **antes** de llegar al enrutado — con
ella, incluso `/a` y `/b` respondían 404.

`MapFallback` registra una ruta comodín, que se evalúa después de las demás. Dos
métodos con nombres parecidos y comportamientos opuestos: el tipo de detalle que
solo se aprende rompiéndolo.

## 🔬 Comparación

| Framework | Modelo | ¿Se puede olvidar continuar? | Registro |
| --- | --- | --- | --- |
| Express | cadena con `siguiente()` | **sí**, y cuelga la petición | `app.use` |
| Gin | cadena con `Next()` | sí | `motor.Use` |
| ASP.NET Core | cadena con `siguiente()` | sí | `app.Use` |
| Laravel | cadena, clase con `handle` | sí | lista de capas |
| Rails | Rack, objeto con `call` | sí | `config.middleware.use` |
| Spring Boot | filtro con `doFilter` | sí | componente descubierto |
| Django | fábrica de función | sí | lista en `MIDDLEWARE` |
| FastAPI | cadena con `await siguiente` | sí | decorador |
| Fastify | **ganchos por fase** | **no**: no hay cadena | `addHook` |
| Flask | **ganchos por fase** | **no** | decorador |

**Ocho de diez usan la cadena y dos usan ganchos.** La diferencia no es
cosmética:

- **Con cadena**, la capa decide si continúa. Eso permite la terminación
  temprana de la clase 028 —cortar y responder— y permite envolver la ejecución
  para medirla.
- **Con ganchos**, la capa no puede cortar tan naturalmente y a cambio **no se
  puede olvidar continuar**, que es un error real y frecuente.

## ⚠️ Errores frecuentes

- **Olvidar `siguiente()`.** La petición se queda colgada hasta que expire.
- **Llamar a `siguiente()` dos veces.** Comportamiento indefinido.
- **Escribir en la respuesta después de continuar** sin comprobar si ya se envió.
- **Poner una capa cara antes de la que rechaza.** Autenticar antes de limitar la
  tasa significa autenticar peticiones que ibas a rechazar.
- **Suponer que el orden de registro es el de ejecución.** En Spring y en
  Starlette no lo es — clase 027.

## ✅ Verificación

```bash
node scripts/run-class.mjs 026
```

## 🧪 Reto de transferencia

Añade una segunda capa que mida la duración de la petición y la emita en
`server-timing`. Después decide dónde registrarla **respecto a la primera**, y
justifica el orden. La clase 027 te dará el criterio.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 027 — El orden importa](../027-el-orden-importa/README.md)
- [Módulo 02 — Arquitectura de frameworks](../../../curriculum/02-arquitectura-de-frameworks.md)

## Fuentes

- [@gof-design-patterns] Gamma, Erich; Helm, Richard; Johnson, Ralph; Vlissides, John. *Design Patterns*. Addison-Wesley, 1994. ISBN 9780201633610 — <https://openlibrary.org/isbn/9780201633610>
- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@casciaro-node-patterns] Casciaro, Mario; Mammino, Luciano. *Node.js Design Patterns*, 3.ª ed. Packt, 2020. ISBN 9781839214110 — <https://openlibrary.org/isbn/9781839214110>
