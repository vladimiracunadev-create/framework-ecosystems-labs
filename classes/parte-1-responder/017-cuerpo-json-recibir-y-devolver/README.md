# Clase 017 — Cuerpo JSON: recibir y devolver

> [⬅️ 016](../016-cabeceras-leer-y-escribir/README.md) · [📚 Parte 1](../README.md) · [🎓 Clases](../../README.md) · [018 ➡️](../018-negociacion-de-contenido/README.md)
>
> Parte **1 — Responder** · Nivel **🟢 introductorio** · Pista **`backend`**
>
> ✅ **Clase construida** — 10 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Deserializar la entrada y serializar la salida **sin sorpresas**, y distinguir
dos fallos que casi todo el mundo mezcla: el cuerpo que **no se puede leer** y el
cuerpo que **se lee pero no sirve**.

## 📚 Resultados de aprendizaje

1. Recibir y devolver JSON en diez frameworks.
2. Justificar por qué `400` y `422` son errores distintos.
3. Reconocer qué frameworks analizan el cuerpo por omisión y cuáles no.

## 🧩 La situación

`POST /tareas` con `{"titulo":"leer el módulo 05"}` responde `201` con el recurso
creado.

- Cuerpo ilegible (`{esto no es json`) → **400**, «cuerpo JSON mal formado».
- Cuerpo legible sin `titulo` → **422**, «titulo es obligatorio».

## 📖 400 frente a 422

La distinción está en el estándar y no es cosmética [@rfc9110]:

| Código | Qué dice | Ejemplo |
| --- | --- | --- |
| **400 Bad Request** | No pude **interpretar** lo que enviaste | JSON con una llave sin cerrar |
| **422 Unprocessable Content** | Lo interpreté bien; su **contenido** no vale | JSON válido sin el campo obligatorio |

Por qué importa al cliente: ante un **400**, reintentar con el mismo cuerpo no
tiene sentido — está roto. Ante un **422**, el cliente sabe que su formato es
correcto y que le falta un dato concreto. Son dos acciones correctivas distintas,
y devolver 400 para ambos las borra.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `{"titulo":"leer el módulo 05"}` | `201` · `{"id":"1","titulo":"...","completada":false}` |
| cualquiera válida | `content-type: application/json` |
| `{esto no es json` | `400` · `{"error":"cuerpo JSON mal formado"}` |
| `{"otra_cosa":1}` | `422` · `{"error":"titulo es obligatorio"}` |
| `{"titulo":""}` | `422` |
| válida | `completada` es el booleano `false`, no la cadena `"false"` |

El último caso parece trivial y no lo es: **algunos serializadores convierten
booleanos y números a texto** si el modelo está mal declarado. El cliente que
haga `if (tarea.completada)` verá `"false"` como verdadero.

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
PORT=3000 java -jar target/clase-017-1.0.0.jar --server.port=3000
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
| `Clase017.csproj` | proyecto de .NET: el marco de destino y las dependencias |
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

Diez frameworks, y una distinción que casi ninguno respeta por omisión: **`400`
para el cuerpo ilegible, `422` para el legible pero incompleto**. Léelas mirando
cuánto código hace falta para recuperar esa diferencia.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — analizar no viene puesto

```javascript
app.use(express.json());
```

```javascript
app.use((error, peticion, respuesta, siguiente) => {
  if (error instanceof SyntaxError) {
    return respuesta.status(400).json({ error: "cuerpo JSON mal formado" });
  }
  siguiente(error);
});
```

**Sin esa primera línea, `peticion.body` es `undefined`.** Es coherente con su
filosofía de framework mínimo y es la causa del error más frecuente de quien
empieza: un cuerpo indefinido sin explicación.

Y sin el manejador del final, un JSON mal formado produce **una página HTML de
error**. Un cliente que espere JSON se atraganta con el `<!DOCTYPE`.

### Fastify · [`fastify/server.mjs`](implementaciones/fastify/server.mjs) — analizar sí viene puesto

```javascript
const app = Fastify();
```

```javascript
app.setErrorHandler((error, peticion, respuesta) => {
  if (error.statusCode === 400) {
    return respuesta.code(400).send({ error: "cuerpo JSON mal formado" });
  }
```

Comportamiento **opuesto con la misma API**: JSON analizado y `400` automático si
está roto. Solo hay que reescribir el formato del error.

Es el mejor recordatorio del programa de que **parecerse en la superficie no es
comportarse igual** — la conclusión que la clase 011 ya adelantaba sobre estos
dos.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — el modelo es el contrato

```python
class Cuerpo(BaseModel):
    titulo: str = Field(min_length=1)
```

```python
@app.post("/tareas", status_code=status.HTTP_201_CREATED)
def crear(cuerpo: Cuerpo) -> dict[str, object]:
    return {"id": "1", "titulo": cuerpo.titulo, "completada": False}
```

El manejador **no valida nada**: recibe un objeto que ya cumple. Es el código más
corto de los diez.

Y aun así hizo falta más, por una razón que enseña:

```python
@app.exception_handler(RequestValidationError)
async def validacion(peticion: Request, error: RequestValidationError) -> JSONResponse:
    for detalle in error.errors():
        if detalle.get("type") == "json_invalid":
            return JSONResponse({"error": "cuerpo JSON mal formado"}, status_code=400)
    return JSONResponse({"error": "titulo es obligatorio"}, status_code=422)
```

**FastAPI devuelve `422` para los dos casos**, porque trata el JSON ilegible y el
incompleto como el mismo tipo de fallo: la petición no valida. Es defendible, y
borra la distinción que este contrato mide.

El manejador mira el tipo de error de Pydantic —`json_invalid`— y los separa.
**El framework más declarativo de los diez necesitó código extra para cumplir el
estándar con precisión.**

### Flask · [`flask/app.py`](implementaciones/flask/app.py)

```python
    cuerpo = request.get_json(silent=True)
    if cuerpo is None:
        return jsonify(error="cuerpo JSON mal formado"), 400
```

`silent=True` devuelve `None` en vez de lanzar, y eso es lo que permite decidir el
código de estado. Sin él, Flask emitiría su propio `400`.

### Django · [`django/app.py`](implementaciones/django/app.py)

```python
    try:
        cuerpo = json.loads(peticion.body or b"")
    except ValueError:
        return JsonResponse({"error": "cuerpo JSON mal formado"}, status=400)
```

Django **no analiza JSON**: `peticion.body` son los bytes crudos. Es la
implementación más explícita, y la que deja ver que analizar el cuerpo es una
decisión y no un hecho.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — dos caminos, dos excepciones

```java
    public ResponseEntity<Map<String, Object>> crear(@RequestBody Map<String, Object> cuerpo) {
        Object titulo = cuerpo.get("titulo");
        if (!(titulo instanceof String texto) || texto.isEmpty()) {
```

```java
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> ilegible() {
        return ResponseEntity.badRequest().body(Map.of("error", "cuerpo JSON mal formado"));
    }
```

**Spring separa los dos casos con excepciones distintas**, y eso hace natural
darles respuestas distintas: `HttpMessageNotReadableException` es el cuerpo
ilegible, y lo que llega al método ya es legible por definición.

Es el reparto más limpio del elenco. Sin el manejador, el `400` sale igualmente
pero con el formato de error de Spring.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — lectura manual a propósito

```csharp
        cuerpo = await JsonSerializer.DeserializeAsync<JsonElement>(peticion.Body);
    }
    catch (JsonException)
    {
        return Results.Json(new { error = "cuerpo JSON mal formado" }, statusCode: 400);
    }
```

Con enlace automático a un tipo, ASP.NET Core devuelve **`400` en ambos casos** —
el error simétrico al de FastAPI. Leer el cuerpo a mano recupera la distinción.

Los dos frameworks más «tipados» del elenco pierden el matiz por caminos
opuestos: uno lo llama todo validación, el otro lo llama todo petición mala.

### Laravel · [`laravel/routes/api.php`](implementaciones/laravel/routes/api.php)

```php
    $cuerpo = json_decode($peticion->getContent(), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return response()->json(['error' => 'cuerpo JSON mal formado'], 400);
    }
```

### Rails · [`rails/config.ru`](implementaciones/rails/config.ru)

```ruby
    cuerpo = JSON.parse(request.raw_post.presence || "null")
```

```ruby
  rescue JSON::ParserError
    render json: { error: "cuerpo JSON mal formado" }, status: :bad_request
```

### Gin · [`gin/main.go`](implementaciones/gin/main.go)

```go
		crudo, _ := io.ReadAll(c.Request.Body)

		var cuerpo map[string]any
		if err := json.Unmarshal(crudo, &cuerpo); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "cuerpo JSON mal formado"})
			return
		}
```

**Los tres hacen lo mismo por la misma razón**: sus ayudantes de alto nivel
—`$peticion->json()`, el analizador de Rails, `c.ShouldBindJSON`— **confunden el
cuerpo ilegible con el cuerpo vacío**. Ir al contenido crudo es la única forma de
distinguirlos.

Que tres frameworks de tres ecosistemas distintos tengan exactamente el mismo
atajo y exactamente la misma pérdida de información dice algo: **la comodidad
suele costar un matiz**, y el matiz solo se echa de menos cuando un contrato lo
exige.

## 🔬 Comparación

| Framework | ¿Analiza por omisión? | ¿Distingue 400 de 422 solo? | Código extra |
| --- | --- | --- | --- |
| Fastify | **sí** | sí, 400 automático | manejador de errores |
| Spring Boot | sí | **sí**, excepciones distintas | un manejador |
| Express | **no** | no | middleware + manejador |
| FastAPI | sí | **no**, 422 para ambos | manejador que los separa |
| Flask | con `get_json` | con `silent=True` | ninguno |
| Django | no | manual | ninguno |
| ASP.NET Core | sí, con enlace | **no**, 400 para ambos | lectura manual |
| Laravel | sí | no | lectura cruda |
| Rails | sí | no | lectura cruda |
| Gin | con enlace | no | lectura cruda |

La conclusión más útil de esta tabla no es cuál gana:

**Casi ningún framework distingue por sí solo estos dos errores.** Ocho de diez
necesitan código explícito. Los valores por omisión están pensados para el caso
normal —«algo va mal con la petición»— y esa simplificación es razonable hasta
que tu API tiene clientes que necesitan saber si reintentar.

Que sea **trabajo tuyo** es exactamente lo que había que aprender.

## ⚠️ Errores frecuentes

- **Olvidar `express.json()`.** `peticion.body` indefinido sin ninguna pista.
- **Devolver HTML al fallar el análisis.** El cliente esperaba JSON.
- **Usar 400 para todo.** El cliente pierde la información de si reintentar.
- **Serializar booleanos como cadenas.** `"false"` es verdadero en casi todos los
  lenguajes del cliente.
- **Aceptar cuerpos sin límite de tamaño.** La clase 033 lo trata; sin límite, un
  cuerpo enorme agota la memoria.

## ✅ Verificación

```bash
node scripts/run-class.mjs 017
```

## 🧪 Reto de transferencia

Haz que la respuesta incluya `creada`, con la fecha en formato ISO 8601 y zona
UTC. Compara cómo serializa fechas cada framework por omisión: vas a encontrar al
menos tres formatos distintos, y esa divergencia es una de las causas más comunes
de que un cliente rompa al cambiar de servidor.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 040 — Errores por campo con RFC 9457](../../parte-3-validacion-y-contrato/040-errores-por-campo-con-rfc-9457/README.md)
- [Módulo 05 — Backend y API](../../../curriculum/05-backend-y-api.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@rfc8259] Bray, T. *The JavaScript Object Notation (JSON) Data Interchange Format*, RFC 8259, IETF, 2017 — <https://www.rfc-editor.org/rfc/rfc8259>
- [@jin-sahni-designing-web-apis] Jin, Brenda; Sahni, Saurabh; Shevat, Amir. *Designing Web APIs*. O'Reilly Media, 2018. ISBN 9781492026921 — <https://openlibrary.org/isbn/9781492026921>
