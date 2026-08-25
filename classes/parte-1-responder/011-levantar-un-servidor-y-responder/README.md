# Clase 011 — Levantar un servidor y responder

> [📚 Parte 1](../README.md) · [🎓 Clases](../../README.md) · [012 ➡️](../012-rutas-y-parametros-de-ruta/README.md)
>
> Parte **1 — Responder: lo primero que hace cualquier framework** · Nivel **🟢 introductorio** · Pista **`backend`** (Backend y API)
>
> ✅ **Clase construida** — 10 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Arrancar un proceso que escucha en un puerto y devuelve una respuesta. Es el
programa más pequeño que se puede escribir con un framework de servidor, y por
eso es el mejor sitio para ver **qué decide el framework por ti antes de que
escribas nada**.

## 📚 Resultados de aprendizaje

Al terminar podrás:

1. Escribir el servidor mínimo en diez frameworks de seis ecosistemas distintos.
2. Explicar qué es un **controlador frontal** y por qué PHP y Java lo usan.
3. Justificar por qué decir «hola» cuesta tres líneas en Express y quince
   archivos en Laravel — y por qué eso no significa que Express sea mejor.

## 🧩 La situación

Un proceso escucha en un puerto. Cuando llega `GET /`, responde el texto `hola`
con el tipo de contenido `text/plain`. Cualquier otra ruta responde 404.

Parece trivial. No lo es: en esas cuatro condiciones ya están metidas tres
decisiones que el framework toma por ti —cómo se emparejan las rutas, qué tipo de
contenido se pone por omisión y qué pasa cuando nada coincide— y los diez
frameworks de abajo las toman de forma distinta.

## 🧮 El contrato

| Petición | Respuesta esperada |
| --- | --- |
| `GET /` | `200` |
| `GET /` | cuerpo exactamente `hola` |
| `GET /` | `content-type: text/plain` |
| `GET /no-existe` | `404` |

La especificación ejecutable está en [`contrato.json`](contrato.json). Las cuatro
condiciones se comprueban contra **cada** implementación: eso es lo que hace que
la comparación signifique algo.

Los códigos `200` y `404` y la cabecera `content-type` no son convenciones de
este programa: están definidos en el estándar de HTTP semántico
[@rfc9110], y el tipo `text/plain` en el registro de tipos de medio.

<!-- generado: fichas -->

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
PORT=3000 java -jar target/clase-011-1.0.0.jar --server.port=3000
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
| `Clase011.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

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
| `Gemfile` | dependencias de Ruby |
| `config.ru` | punto de entrada de Rack, el estándar de servidores de Ruby |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

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

Mismo contrato, forma idiomática en cada framework. Cada bloque es el archivo
real del directorio [`implementaciones/`](implementaciones/).

### Express · [`express/server.mjs`](implementaciones/express/server.mjs)

```javascript
import express from "express";

const app = express();

app.get("/", (peticion, respuesta) => {
  respuesta.type("text/plain").send("hola");
});

app.listen(Number(process.env.PORT ?? 3000));
```

Tres líneas útiles. El 404 no está escrito en ningún sitio: Express lo emite
cuando ninguna ruta coincide. Es la primera muestra de la **inversión de
control** que la [ficha de Express](../../../atlas/fichas/express.md) describe —
tú registras manejadores, el framework decide cuándo llamarlos y qué hacer si
ninguno aplica.

### Fastify · [`fastify/server.mjs`](implementaciones/fastify/server.mjs)

```javascript
import Fastify from "fastify";

const app = Fastify();

app.get("/", (peticion, respuesta) => {
  respuesta.type("text/plain").send("hola");
});

await app.listen({ port: Number(process.env.PORT ?? 3000), host: "127.0.0.1" });
```

Casi idéntico a Express, y esa semejanza es deliberada: Fastify compite en el
mismo nicho y no quería obligar a reaprender. La diferencia está debajo —
compilación de esquemas y serialización optimizada—, no en la superficie. Es un
buen recordatorio del [módulo 11](../../../curriculum/11-seleccion-y-sostenibilidad.md):
**dos frameworks que se escriben igual pueden comportarse muy distinto bajo
carga**.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

```python
from fastapi import FastAPI
from fastapi.responses import PlainTextResponse

app = FastAPI()


@app.get("/", response_class=PlainTextResponse)
def raiz() -> str:
    return "hola"
```

Aquí aparece algo que en Express no existe: **el objeto de aplicación no arranca
solo**. FastAPI declara la aplicación y un servidor externo —Uvicorn— la ejecuta.
La frontera se llama ASGI y es la razón de que la receta de arranque diga
`uvicorn main:app` en lugar de `python main.py`.

Esa separación entre *aplicación* y *servidor* es el patrón de todo el ecosistema
Python y no un capricho de FastAPI: la [ficha de Flask](../../../atlas/fichas/flask.md)
cuenta de dónde viene.

### Flask · [`flask/app.py`](implementaciones/flask/app.py)

```python
import os

from flask import Flask, Response

app = Flask(__name__)


@app.get("/")
def raiz() -> Response:
    return Response("hola", mimetype="text/plain")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", 3000)))
```

Flask sí trae un servidor de desarrollo incorporado, y su propia documentación
advierte de que **no es para producción**. Esa advertencia es la clase entera en
una frase: el servidor de desarrollo y el de producción son piezas distintas, y
confundirlas es un error clásico de despliegue.

### Django · [`django/app.py`](implementaciones/django/app.py)

```python
settings.configure(
    DEBUG=False,
    ALLOWED_HOSTS=["127.0.0.1", "localhost"],
    ROOT_URLCONF=__name__,
    SECRET_KEY="clase-011-no-es-un-secreto-real",
    MIDDLEWARE=[],
)


def raiz(peticion):
    return HttpResponse("hola", content_type="text/plain")


urlpatterns = [path("", raiz)]
```

Django normalmente se genera con un comando que crea una docena de archivos.
Aquí está en uno solo, a propósito, para que se vea **qué exige de verdad**:
configuración explícita antes de nada. Ni siquiera puede importar sus propios
módulos sin que `settings` esté resuelto.

Eso no es burocracia: es la consecuencia de que Django traiga baterías incluidas
—ORM, administración, autenticación— y necesite saber cómo configurarlas antes de
cargarlas. La [ficha de Django](../../../atlas/fichas/django.md) desarrolla ese
compromiso.

### Spring Boot · [`spring-boot/src/main/java/labs/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
@SpringBootApplication
@RestController
public class Aplicacion {

    @GetMapping(value = "/", produces = MediaType.TEXT_PLAIN_VALUE)
    public String raiz() {
        return "hola";
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
```

Las anotaciones no son azúcar: **son la configuración**. `@SpringBootApplication`
dispara el descubrimiento de componentes y la autoconfiguración, que examina lo
que hay en el classpath y decide qué levantar. Con `spring-boot-starter-web`
presente, monta un servidor incrustado sin que tú lo pidas.

Es el grado más alto de «el framework decide» de toda esta clase, y la
contrapartida está en el [módulo 02](../../../curriculum/02-arquitectura-de-frameworks.md):
cuando la autoconfiguración acierta, no escribes nada; cuando se equivoca, tienes
que entender un mecanismo que hasta ese momento era invisible.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

app.MapGet("/", () => Results.Text("hola", "text/plain"));

app.Run();
```

Cuatro líneas, y el contraste con Spring Boot es instructivo: **la misma
plataforma empresarial, la ceremonia opuesta**. ASP.NET Core llegó a las API
mínimas después de años de plantillas con veinte archivos, y la
[ficha de ASP.NET Core](../../../atlas/fichas/aspnet-core.md) cuenta esa
corrección de rumbo.

Fíjate en `constructor` y `app`: son dos fases explícitas —configurar y ejecutar—
que en Express están fundidas. Esa separación es la que permite registrar
servicios antes de que exista la aplicación.

### Laravel · [`laravel/public/index.php`](implementaciones/laravel/public/index.php)

```php
require __DIR__ . '/../vendor/autoload.php';

/** @var Illuminate\Foundation\Application $app */
$app = require_once __DIR__ . '/../bootstrap/app.php';

$app->handleRequest(Illuminate\Http\Request::capture());
```

Y la ruta, en [`laravel/routes/web.php`](implementaciones/laravel/routes/web.php):

```php
Route::get('/', function () {
    return response('hola', 200)->header('Content-Type', 'text/plain');
});
```

Laravel es la implementación **más larga de las diez**, y merece la pena entender
por qué en lugar de despacharlo como «PHP pesado».

`public/index.php` es un **controlador frontal**: el único archivo que el
servidor web expone, mientras el resto del código queda fuera de la raíz pública.
Fowler lo describe como el patrón que centraliza el manejo de peticiones
[@fowler-poeaa], y en PHP tiene además una razón de seguridad muy concreta —
históricamente cada `.php` del disco era una puerta de entrada.

Pero lo que de verdad enseña esta implementación es lo que hubo que **declarar**
para que funcionara. Al montarla, decir «hola» falló tres veces seguidas:

| Fallo | Causa real |
| --- | --- |
| `Target [ExceptionHandler] is not instantiable` | Faltaba registrar el manejador de excepciones |
| `bootstrap/cache directory must be present` | Faltaba un directorio de escritura |
| `Database file at path [...] does not exist` | El grupo `web` incluye la capa de sesión, y la sesión iba por omisión a base de datos |

Ninguno de los tres tiene que ver con responder «hola». Los tres vienen de que
**Laravel asume un producto completo**: sesiones, base de datos, vistas, caché. Su
instalador genera todo eso, y por eso nadie los ve. Aquí, sin instalador, salen a
la superficie — que es exactamente lo que esta clase quería mostrar.

La lección no es «Laravel es pesado». Es que **la comodidad de un framework
completo se paga en supuestos**, y esos supuestos solo se notan cuando te sales
del camino marcado. La [ficha de Laravel](../../../atlas/fichas/laravel.md)
explica por qué ese trato compensa en el caso para el que fue diseñado.

### Ruby on Rails · [`rails/config.ru`](implementaciones/rails/config.ru)

```ruby
class Aplicacion < Rails::Application
  config.root = __dir__
  config.eager_load = false
  config.secret_key_base = "clase-011-no-es-un-secreto-real"

  routes.append do
    get "/" => "raiz#mostrar"
  end
end

class RaizController < ActionController::Base
  def mostrar
    render plain: "hola"
  end
end
```

`get "/" => "raiz#mostrar"` es **convención pura**: la cadena `"raiz#mostrar"` se
resuelve a la clase `RaizController` y su método `mostrar` sin que nadie los haya
conectado explícitamente. Nada en el código dice dónde está esa clase; Rails lo
deduce del nombre.

Ese acuerdo es la aportación histórica que la
[ficha de Rails](../../../atlas/fichas/rails.md) documenta, y su coste está en la
misma frase: **si no conoces la convención, el código es ilegible**. En Express
ves la función que se ejecuta; aquí ves una cadena de texto.

### Gin · [`gin/main.go`](implementaciones/gin/main.go)

```go
motor := gin.New()

motor.GET("/", func(c *gin.Context) {
	c.Data(http.StatusOK, "text/plain; charset=utf-8", []byte("hola"))
})

_ = motor.Run("127.0.0.1:" + puerto)
```

Go tiene servidor HTTP en su biblioteca estándar, así que Gin **no aporta el
servidor**: aporta enrutado rápido y utilidades. Es la relación más honesta de
las diez entre lenguaje y framework, y explica por qué en Go los frameworks son
más pequeños que en cualquier otro ecosistema — no tienen que traer lo que ya
viene puesto. La [ficha de Gin](../../../atlas/fichas/gin.md) lo desarrolla.

## 🔬 Comparación

| Framework | Líneas útiles | ¿Trae servidor? | ¿404 automático? | Configuración previa |
| --- | --- | --- | --- | --- |
| Express | 3 | sí | sí | ninguna |
| Fastify | 3 | sí | sí | ninguna |
| Gin | 3 | usa la del lenguaje | sí | ninguna |
| ASP.NET Core | 4 | sí | sí | ninguna |
| Flask | 4 | de desarrollo | sí | ninguna |
| FastAPI | 4 | no (ASGI) | sí | servidor externo |
| Spring Boot | 6 | incrustado | sí | dependencia de arranque |
| Rails | 8 | no (Rack) | sí | clave secreta |
| Django | 9 | de desarrollo | sí | `settings` completo |
| Laravel | 12 + 5 archivos | no (PHP-FPM o similar) | sí | sesión, caché, directorios |

Dos lecturas de esta tabla, y la segunda importa más que la primera:

**1. Menos líneas no es mejor framework.** Es *menos supuestos declarados*.
Express no te pregunta por la sesión porque no tiene sesiones; Laravel te
pregunta porque las trae. La columna de la derecha no mide burocracia: mide
**cuánto producto viene incluido**.

**2. Los diez emiten 404 sin que se lo pidas.** Es el comportamiento más
compartido de la tabla, y viene de que todos implementan el mismo estándar
[@rfc9110]. Cuando algo aparece igual en diez frameworks de seis ecosistemas, casi
siempre es que lo dicta la especificación, no el gusto de nadie.

## ✅ Verificación

```bash
node scripts/run-class.mjs 011
```

Salida real en una máquina sin JDK con Maven, sin .NET, sin Ruby y sin Go:

```text
Clase 011 — Levantar un servidor y responder
  ⊘ express              entorno no preparado: pnpm no ejecutable
  ⊘ fastify              entorno no preparado: pnpm no ejecutable
  ✔ fastapi              4 casos
  ✔ flask                4 casos
  ⊘ django               entorno no preparado: No module named 'django'
  ⊘ spring-boot          falta la herramienta `mvn`
  ⊘ aspnet-core          falta la herramienta `dotnet`
  ✔ laravel              4 casos
  ⊘ rails                falta la herramienta `ruby`
  ⊘ gin                  falta la herramienta `go`

RESUMEN: 3 verificadas · 0 con fallo · 7 omitidas por falta de herramientas
```

**Ese informe es el formato correcto.** Un verificador que dijera solo «todo
bien» estaría mintiendo: no ejecutó siete de las diez. Distinguir *verificado* de
*omitido* es lo que permite creerse el verde — el mismo principio que
Nygard aplica a la instrumentación de sistemas en producción
[@nygard-release-it].

## ⚠️ Errores frecuentes

- **Usar el servidor de desarrollo en producción.** Flask y Django lo advierten
  en su documentación; el aviso se ignora con frecuencia.
- **Confiar en el `content-type` por omisión.** Varios frameworks devuelven
  `text/html` si no lo dices, y el contrato de esta clase falla por eso.
- **Escuchar en `0.0.0.0` sin querer.** Expone el proceso a la red local. Aquí
  todas las implementaciones se atan a `127.0.0.1` a propósito.
- **Confundir «pocas líneas» con «poco framework».** Spring Boot cabe en seis
  líneas y levanta un contenedor de inversión de control completo.

## 🧪 Reto de transferencia

Añade a **una** de las diez implementaciones una segunda ruta `GET /salud` que
responda `200` con el cuerpo `{"estado":"ok"}` y `content-type: application/json`.
Después amplía [`contrato.json`](contrato.json) con esos casos y ejecuta el
verificador: debe fallar en las otras nueve. **Ese fallo es el objetivo** — es la
prueba de que el contrato manda sobre las implementaciones y no al revés.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde cada framework es la elección natural
- [Clase 012 — Rutas y parámetros de ruta](../012-rutas-y-parametros-de-ruta/README.md)
- [Módulo 01 — HTTP, eventos y contratos](../../../curriculum/01-http-eventos-y-contratos.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
