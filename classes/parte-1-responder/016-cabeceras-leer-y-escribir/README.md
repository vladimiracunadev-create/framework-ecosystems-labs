# Clase 016 — Cabeceras: leer y escribir

> [⬅️ 015](../015-codigos-de-estado/README.md) · [📚 Parte 1](../README.md) · [🎓 Clases](../../README.md) · [017 ➡️](../017-cuerpo-json-recibir-y-devolver/README.md)
>
> Parte **1 — Responder** · Nivel **🟢 introductorio** · Pista **`backend`**
>
> ✅ **Clase construida** — 10 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Usar las cabeceras como **parte del contrato**, no como decoración. Y descubrir
que el framework a veces reescribe lo que tú pusiste.

## 📚 Resultados de aprendizaje

1. Leer una cabecera de petición con valor por omisión, en diez frameworks.
2. Explicar por qué el nombre no distingue mayúsculas y quién lo normaliza.
3. Reconocer las cabeceras que son **listas de directivas** y por qué no se
   comparan como cadenas.

## 🧩 La situación

`GET /eco` con `x-peticion: hola` devuelve `{"recibido":"hola"}`. Sin esa
cabecera, devuelve `"(ninguna)"`. La respuesta lleva siempre `x-respuesta:
servida` y una directiva `no-store` en `cache-control`.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `x-peticion: hola` | `{"recibido":"hola"}` |
| `X-PETICION: MAYUS` | `{"recibido":"MAYUS"}` |
| *(sin cabecera)* | `{"recibido":"(ninguna)"}` |
| cualquiera | `x-respuesta: servida` |
| cualquiera | `cache-control` **contiene** `no-store` |

El segundo caso comprueba algo que exige el estándar [@rfc9110]: **los nombres de
cabecera no distinguen mayúsculas de minúsculas**. Los diez frameworks lo
resuelven, y varios normalizan a minúsculas al recibir.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Cabecera**](../../../glosario/README.md#cabecera) | Metadato de una petición o una respuesta: qué formato lleva el cuerpo, quién eres, qué aceptas de vuelta, cuánto se puede cachear. Los nombres no distinguen mayúsculas, y una misma cabecera puede venir repetida. |

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
PORT=3000 java -jar target/clase-016-1.0.0.jar --server.port=3000
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
| `Clase016.csproj` | proyecto de .NET: el marco de destino y las dependencias |
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

Diez frameworks leyendo una cabecera y escribiendo dos. Es de las clases más
simples del programa, y por eso deja ver con claridad una escala: **de dónde sale
la cabecera** — de la firma, de un diccionario o de un objeto de petición.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — por la firma

```python
@app.get("/eco")
def eco(x_peticion: Annotated[str, Header()] = "(ninguna)") -> JSONResponse:
    return JSONResponse(
        {"recibido": x_peticion},
        headers={"x-respuesta": "servida", "cache-control": "no-store"},
    )
```

**El único de los diez donde la cabecera entra por la firma**, con su valor por
omisión declarado ahí mismo. En los otros nueve se lee de un diccionario dentro
del cuerpo de la función.

Y una conversión que hay que conocer: `Header` traduce el **guion bajo del
argumento en guion medio del nombre real**, porque `x-peticion` no es un
identificador válido en Python. Es azúcar con una regla detrás.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs)

```javascript
  const recibido = peticion.get("x-peticion") ?? "(ninguna)";
  respuesta
    .set("x-respuesta", "servida")
    .set("cache-control", "no-store")
    .json({ recibido });
```

`peticion.get(...)` en minúsculas, y funcionaría igual en mayúsculas: **los
nombres de cabecera no distinguen mayúsculas** por exigencia del estándar
[@rfc9110], y los frameworks las normalizan a minúsculas al recibirlas.

### Fastify · [`fastify/server.mjs`](implementaciones/fastify/server.mjs)

```javascript
  const recibido = peticion.headers["x-peticion"] ?? "(ninguna)";
  respuesta
    .header("x-respuesta", "servida")
    .header("cache-control", "no-store")
    .send({ recibido });
```

Un **diccionario plano** en lugar del método `get`. Y eso sí obliga a escribir el
nombre en minúsculas: `peticion.headers["X-Peticion"]` devolvería `undefined`.
Es la diferencia entre normalizar en la API y normalizar solo al recibir.

### Flask · [`flask/app.py`](implementaciones/flask/app.py)

```python
    recibido = request.headers.get("X-Peticion", "(ninguna)")
    respuesta = jsonify(recibido=recibido)
    respuesta.headers["X-Respuesta"] = "servida"
    respuesta.headers["Cache-Control"] = "no-store"
```

Werkzeug trae un diccionario que **sí ignora mayúsculas**, así que aquí `X-Peticion`
y `x-peticion` dan lo mismo. Tres bibliotecas y tres criterios distintos sobre la
misma regla del estándar.

### Django · [`django/app.py`](implementaciones/django/app.py)

```python
    recibido = peticion.headers.get("X-Peticion", "(ninguna)")
    respuesta = JsonResponse({"recibido": recibido})
    respuesta["X-Respuesta"] = "servida"
    respuesta["Cache-Control"] = "no-store"
```

`peticion.headers` normaliza el nombre — y merece la pena saber lo que sustituyó:
el diccionario `META` de toda la vida, donde la misma cabecera se llamaba
`HTTP_X_PETICION`, en mayúsculas y con guion bajo. Ese formato viene de CGI y
sobrevive por debajo en varios ecosistemas.

Y la respuesta se indexa **como un diccionario**: `respuesta["X-Respuesta"]`, sin
método intermedio.

### Rails · [`rails/config.ru`](implementaciones/rails/config.ru)

```ruby
    recibido = request.headers["X-Peticion"] || "(ninguna)"
    response.headers["X-Respuesta"] = "servida"
    response.headers["Cache-Control"] = "no-store"
```

Rack conserva por debajo la misma convención antigua que Django: `HTTP_` delante
y guiones bajos. `request.headers` es la capa que la esconde.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
    public ResponseEntity<Map<String, String>> eco(
            @RequestHeader(name = "X-Peticion", required = false,
                    defaultValue = "(ninguna)") String recibido) {
```

Declarativo como FastAPI y **más explícito**: `required` y `defaultValue` son dos
opciones separadas, así que se puede pedir una cabecera obligatoria sin valor por
omisión y obtener un `400` automático si falta.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
    var recibido = peticion.Headers["X-Peticion"].FirstOrDefault() ?? "(ninguna)";
    respuesta.Headers["X-Respuesta"] = "servida";
    respuesta.Headers.CacheControl = "no-store";
```

`FirstOrDefault()` otra vez, como en la clase 030: **una cabecera puede venir
repetida**, y el tipo de .NET lo recuerda en lugar de esconderlo.

Y `Headers.CacheControl` frente a `Headers["X-Respuesta"]`: las cabeceras
estándar tienen **propiedad con nombre** y las propias van por índice. El
compilador protege las que conoce.

### Laravel · [`laravel/routes/api.php`](implementaciones/laravel/routes/api.php)

```php
    $respuesta->headers->set('X-Respuesta', 'servida');
    $respuesta->headers->set('Cache-Control', 'no-store', true);
```

El tercer argumento `true` de `set` significa **reemplazar** en lugar de añadir —
y hace falta precisamente aquí, porque Laravel pone su propio `Cache-Control` por
omisión. Sin él, la respuesta llevaría las dos directivas y el contrato fallaría.

Es un ejemplo pequeño de algo que reaparece en toda la parte: **un framework
completo trae valores puestos, y salirse de ellos es un gesto explícito**.

### Gin · [`gin/main.go`](implementaciones/gin/main.go)

```go
		recibido := c.GetHeader("X-Peticion")
		if recibido == "" {
			recibido = "(ninguna)"
		}
```

El detalle de Gin importa y no es de Gin: **en Go no hay valor nulo para una
cadena**, así que «ausente» y «presente pero vacía» se confunden en el mismo `""`.

Si esa distinción fuera parte de tu contrato —y a veces lo es: una cabecera vacía
puede significar algo distinto a no enviarla— habría que consultar el mapa de
cabeceras directamente en lugar de usar el ayudante.

## 🔍 Lo que esta clase destapó

La implementación de Laravel falló al verificar, con este mensaje:

```text
✘ laravel  cabecera cache-control: "no-store, private", esperada "no-store"
```

Laravel —a través de Symfony— **añade `private` por su cuenta**. No es un fallo:
es un valor por omisión prudente que evita que una respuesta personal acabe en
una caché compartida.

Lo interesante es la conclusión: **la aserción estaba mal, no el framework**.
`Cache-Control` es una **lista de directivas separadas por comas** [@rfc9111], y
su orden no significa nada. Compararla como cadena mide la normalización del
framework, no el comportamiento.

Por eso el verificador tiene ahora dos formas de comprobar una cabecera:

| Aserción | Cuándo se usa | Ejemplo |
| --- | --- | --- |
| `cabeceras` | valor único | `content-type` |
| `cabeceras_contienen` | lista de directivas | `cache-control`, `vary`, `allow` |

Es una lección sobre pruebas más que sobre frameworks: **una aserción demasiado
estricta produce fallos falsos**, y los fallos falsos entrenan al equipo a
ignorar el rojo.

## 🔬 Comparación

| Framework | Lectura | ¿Valor por omisión declarativo? | Normalización propia |
| --- | --- | --- | --- |
| FastAPI | por la firma | **sí** | no |
| Spring Boot | por anotación | **sí** | no |
| Express | `peticion.get()` | no | no |
| Fastify | `peticion.headers[...]` | no | no |
| Flask | `request.headers.get()` | con argumento | no |
| Django | `peticion.headers.get()` | con argumento | no |
| ASP.NET Core | colección de cabeceras | no | no |
| Laravel | `$peticion->header()` | con argumento | **sí**, en `Cache-Control` |
| Rails | `request.headers[...]` | no | añade varias de seguridad |
| Gin | `c.GetHeader()` | no (cadena vacía) | no |

## ⚠️ Errores frecuentes

- **Comparar el nombre distinguiendo mayúsculas.** `headers["X-Peticion"]` sobre
  un diccionario ya normalizado a minúsculas devuelve nada.
- **Comparar `Cache-Control` como cadena.** Es una lista.
- **Confundir ausente con vacía** en lenguajes sin valor nulo para cadenas.
- **Confiar en cabeceras de petición sin validarlas.** `X-Forwarded-For` y
  compañía las pone el cliente, y se pueden falsificar.
- **Inventar cabeceras propias sin necesidad.** Si el estándar ya tiene una,
  usarla gana interoperabilidad gratis.

## ✅ Verificación

```bash
node scripts/run-class.mjs 016
```

## 🧪 Reto de transferencia

Haz que `/eco` acepte **varias** cabeceras `x-peticion` y devuelva todos sus
valores en un array. HTTP lo permite, y los diez frameworks lo exponen de forma
distinta: algunos concatenan con comas y otros dan una lista.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 048 — ETags y caché condicional](../../parte-3-validacion-y-contrato/048-etags-y-cache-condicional/README.md)
- [Módulo 01 — HTTP, eventos y contratos](../../../curriculum/01-http-eventos-y-contratos.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@rfc9111] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Caching*, RFC 9111, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9111>
- [@grigorik-hpbn] Grigorik, Ilya. *High Performance Browser Networking*. O'Reilly Media, 2013. ISBN 9781449344764 — <https://openlibrary.org/isbn/9781449344764>
