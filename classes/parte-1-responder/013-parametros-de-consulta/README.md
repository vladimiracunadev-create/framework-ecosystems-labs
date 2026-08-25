# Clase 013 — Parámetros de consulta

> [⬅️ 012](../012-rutas-y-parametros-de-ruta/README.md) · [📚 Parte 1](../README.md) · [🎓 Clases](../../README.md) · [014 ➡️](../014-verbos-http-y-su-semantica/README.md)
>
> Parte **1 — Responder** · Nivel **🟢 introductorio** · Pista **`backend`**
>
> ✅ **Clase construida** — 10 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Leer la cadena de consulta, aplicar un valor por omisión y **rechazar lo
inválido**. Es la primera clase donde el framework tiene que decir que no, y
donde se ve quién valida por ti y quién te deja solo.

## 📚 Resultados de aprendizaje

1. Distinguir «no vino el parámetro» de «vino mal».
2. Explicar por qué un valor ausente y un valor inválido merecen respuestas
   distintas.
3. Reconocer conversiones silenciosas que devuelven un número donde no lo había.

## 🧩 La situación

`GET /tareas?limite=5` usa 5. Sin parámetro, usa 20. Fuera del rango 1–100, o si
no es un número, responde **422**.

La distinción del medio es la que se hace mal continuamente: **ausente no es
inválido**. Si el cliente no pidió límite, aplicas el tuyo; si pidió `abc`, se
equivocó y hay que decírselo. Confundirlas convierte un error del cliente en un
comportamiento silencioso.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `?limite=5` | `200` · `{"limite":5}` |
| *(sin parámetro)* | `200` · `{"limite":20}` |
| `?limite=100` | `200` · `{"limite":100}` |
| `?limite=abc` | `422` |
| `?limite=0` | `422` |
| `?limite=101` | `422` |

Se usa **422** y no 400 siguiendo la semántica del estándar [@rfc9110]: la
petición está bien formada —el servidor la entendió— pero su contenido no es
procesable. Un 400 diría que ni siquiera se pudo interpretar.

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
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web, spring-boot-starter-validation`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-013-1.0.0.jar --server.port=3000
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
| `Clase013.csproj` | proyecto de .NET: el marco de destino y las dependencias |
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

## 🌐 Las implementaciones

### Express · [`express/server.mjs`](implementaciones/express/server.mjs)

```javascript
const bruto = peticion.query.limite;
const limite = bruto === undefined ? POR_OMISION : Number(bruto);
if (!Number.isInteger(limite) || limite < 1 || limite > 100) {
  return respuesta.status(422).json({ error: "limite debe ser un entero entre 1 y 100" });
}
```

Todo manual, y con una trampa de JavaScript a la vista: `Number("")` es `0`, no
`NaN`. Por eso se comprueba `undefined` antes y se usa `Number.isInteger`, que
rechaza tanto `NaN` como los decimales.

### Fastify · [`fastify/server.mjs`](implementaciones/fastify/server.mjs)

```javascript
const esquema = {
  querystring: {
    type: "object",
    properties: { limite: { type: "integer", minimum: 1, maximum: 100, default: POR_OMISION } },
  },
};

app.get("/tareas", { schema: esquema }, (peticion, respuesta) => {
  respuesta.send({ limite: peticion.query.limite });
});
```

**El manejador no valida nada**: recibe el valor ya comprobado y convertido. El
esquema declara el tipo, el rango y el valor por omisión en un solo sitio.

Es la diferencia real entre Fastify y Express, y no es de rendimiento: es de
dónde vive la regla. La [ficha de Fastify](../../../atlas/fichas/fastify.md) lo
desarrolla.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

```python
@app.get("/tareas")
def listar(limite: int = Query(default=20, ge=1, le=100)) -> dict[str, int]:
    return {"limite": limite}
```

**Una línea**, y contiene el tipo, el valor por omisión y los dos límites. Si algo
no encaja, la función no llega a ejecutarse. Es el ejemplo más claro del programa
de lo que significa que la firma sea el contrato.

### Flask · [`flask/app.py`](implementaciones/flask/app.py)

```python
bruto = request.args.get("limite")
if bruto is None:
    return jsonify(limite=POR_OMISION)

try:
    limite = int(bruto)
except ValueError:
    return jsonify(error="..."), 422
```

Este código nació de un fallo real al construir la clase. La primera versión era:

```python no-extracto
limite = request.args.get("limite", default=POR_OMISION, type=int)
```

Parece correcto y **no lo es**: cuando `type=int` no puede convertir, Flask
devuelve el **valor por omisión**, no `None`. Con `?limite=abc` la respuesta era
`200` y `20` — el cliente se equivocó y el servidor le contestó como si no
hubiera pedido nada.

El verificador lo detectó al primer intento. Es exactamente el tipo de fallo que
esta clase existe para enseñar: **una conversión silenciosa que convierte un
error en un valor plausible**.

### Django · [`django/app.py`](implementaciones/django/app.py)

```python
bruto = peticion.GET.get("limite")
if bruto is None:
    return JsonResponse({"limite": POR_OMISION})
try:
    limite = int(bruto)
except ValueError:
    return JsonResponse({"error": "..."}, status=422)
```

Django deja `request.GET` como texto puro. Su capa de validación son los
formularios y los serializadores, que llegan en la clase 039.

### Spring Boot · [`spring-boot/.../Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
@GetMapping("/tareas")
public Map<String, Integer> listar(
        @RequestParam(name = "limite", defaultValue = "20") @Min(1) @Max(100) int limite) {
    return Map.of("limite", limite);
}
```

Declarativo como FastAPI, con una diferencia importante: **el código de error por
omisión no es el que queremos**. Spring devuelve 500 ante una violación de
restricción y 400 ante un tipo incompatible, así que hay un manejador de
excepciones que los traduce a 422. Sin él, un error del cliente se reportaría como
error del servidor — que es mentir en la respuesta.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
app.MapGet("/tareas", (HttpRequest peticion) =>
{
    if (!peticion.Query.TryGetValue("limite", out var crudo) || string.IsNullOrEmpty(crudo))
    {
        return Results.Json(new { limite = 20 });
    }

    if (!int.TryParse(crudo, out var limite) || limite < 1 || limite > 100)
    {
        return Results.Json(
            new { error = "limite debe ser un entero entre 1 y 100" }, statusCode: 422);
    }

    return Results.Json(new { limite });
});
```

Lo tentador aquí era declarar el parámetro como `int? limite` y dejar que el
enlace automático hiciera el trabajo:

```csharp no-extracto
app.MapGet("/tareas", (int? limite) => { /* … */ });
```

**No sirve para este contrato.** Con enlace automático, un texto no convertible
produce un `400` **del framework**, antes de entrar al manejador — y esta clase
distingue el `400` («no te entiendo») del `422` («te entiendo y no vale»). Para
poder decidir ese matiz hay que leer de `peticion.Query` a mano.

Es la primera aparición de una tensión que vuelve en la clase 040: **cuanto más
hace el framework por ti, menos control tienes sobre el mensaje de error**.

### Laravel · [`laravel/routes/web.php`](implementaciones/laravel/routes/web.php)

```php
if (!ctype_digit((string) $bruto)) {
    return response()->json(['error' => '...'], 422);
}
$limite = (int) $bruto;
```

`ctype_digit` sobre la cadena original, y no `(int)` directo, por la misma razón
que en Flask: **`(int) "abc"` es `0` en PHP**, sin aviso. Comprobar antes de
convertir es la única forma de no aceptar basura como cero.

En un proyecto real esto sería `$peticion->validate([...])`, que llega en la
clase 039.

### Rails · [`rails/config.ru`](implementaciones/rails/config.ru)

```ruby
limite = Integer(bruto, exception: false)
if limite.nil? || limite < 1 || limite > 100
```

`Integer(..., exception: false)` devuelve `nil` cuando no puede. La alternativa
tentadora, `bruto.to_i`, convierte `"12abc"` en `12` y `"abc"` en `0` **sin
avisar**: es la misma trampa que Flask y PHP, en un tercer lenguaje.

### Gin · [`gin/main.go`](implementaciones/gin/main.go)

```go
limite, err := strconv.Atoi(bruto)
if err != nil || limite < 1 || limite > 100 {
```

Go obliga a mirar el error: `strconv.Atoi` devuelve dos valores y el compilador no
te deja ignorar el segundo si vas a usar el primero. **La trampa silenciosa que
tienen Flask, PHP y Ruby aquí no puede existir.**

## 🔬 Comparación

| Framework | Líneas de validación | ¿Quién valida? | Trampa del lenguaje |
| --- | --- | --- | --- |
| FastAPI | 1 | el framework | — |
| Fastify | 4 (esquema) | el framework | — |
| Spring Boot | 2 + manejador | el framework | el código de error por omisión miente |
| ASP.NET Core | 4 | el framework convierte, tú validas | — |
| Express | 4 | tú | `Number("")` es `0` |
| Django | 7 | tú | — |
| Flask | 8 | tú | **`type=int` devuelve el valor por omisión al fallar** |
| Laravel | 8 | tú | `(int) "abc"` es `0` |
| Rails | 6 | tú | `to_i` convierte `"abc"` en `0` |
| Gin | 4 | tú | ninguna: el error es obligatorio |

Dos conclusiones que la tabla sostiene:

**1. Declarar la regla una vez es mejor que comprobarla en cada sitio.** FastAPI
y Fastify no son más cortos por casualidad: la regla vive en la firma o en el
esquema, así que no se puede olvidar en el sexto manejador.

**2. Cuatro de estos lenguajes convierten texto inválido en un número sin
avisar.** Flask, PHP, Ruby y —parcialmente— JavaScript. Go es el único que lo
hace imposible. Ninguna de esas trampas es culpa del framework, y todas se
manifiestan **a través** del framework, que es donde te las encuentras.

## ✅ Verificación

```bash
node scripts/run-class.mjs 013
```

## ⚠️ Errores frecuentes

- **Confundir ausente con inválido.** Son dos respuestas distintas.
- **Convertir antes de comprobar.** `(int)`, `to_i` y `Number()` mienten con
  entradas malas.
- **Fiarse de `type=int` en Flask.** Devuelve el valor por omisión, no `None`.
- **Devolver 500 ante un error del cliente.** Es lo que hace Spring sin el
  manejador de excepciones.
- **No poner un máximo.** `?limite=1000000` sin tope es una invitación a tumbar
  el servicio — el argumento de resiliencia de Nygard [@nygard-release-it].

## 🧪 Reto de transferencia

Añade un segundo parámetro `desde` que acepte una fecha en formato ISO y responda
422 si no lo es. Compara cuánto código hace falta en FastAPI frente a Express.
Añade los casos al contrato y verifica.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 039 — Validar la entrada](../../parte-3-validacion-y-contrato/039-validar-la-entrada/README.md)
- [Módulo 05 — Backend y API](../../../curriculum/05-backend-y-api.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
