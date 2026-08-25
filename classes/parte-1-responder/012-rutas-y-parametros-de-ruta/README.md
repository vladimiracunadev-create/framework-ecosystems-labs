# Clase 012 — Rutas y parámetros de ruta

> [⬅️ 011](../011-levantar-un-servidor-y-responder/README.md) · [📚 Parte 1](../README.md) · [🎓 Clases](../../README.md) · [013 ➡️](../013-parametros-de-consulta/README.md)
>
> Parte **1 — Responder** · Nivel **🟢 introductorio** · Pista **`backend`**
>
> ✅ **Clase construida** — 10 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Extraer del camino la parte variable. Es la operación más frecuente de cualquier
API y donde aparece la primera decisión de diseño real: **qué tanto sabe el
enrutador sobre el valor que extrae**.

## 📚 Resultados de aprendizaje

1. Declarar un segmento con nombre en diez frameworks.
2. Explicar por qué el valor llega como texto y quién lo convierte.
3. Reconocer qué frameworks pueden rechazar un segmento mal formado **antes** de
   llegar a tu código, y qué se gana con eso.

## 🧩 La situación

`GET /tareas/42` devuelve `{"id":"42"}`. `GET /tareas/abc-123` devuelve
`{"id":"abc-123"}`. `GET /tareas` no coincide con nada y responde 404.

El tercer caso importa más de lo que parece: **una ruta con segmento obligatorio
no coincide cuando el segmento falta**. No es un error que tú manejes; es que la
ruta no aplica.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /tareas/42` | `200` · `{"id":"42"}` |
| `GET /tareas/abc-123` | `200` · `{"id":"abc-123"}` |
| `GET /tareas/1` | `content-type: application/json` |
| `GET /tareas/con%20espacio` | `200` · `{"id":"con espacio"}` |
| `GET /tareas` | `404` |

El cuarto caso es el que separa una implementación correcta de una a medias:
**el valor llega decodificado**. `%20` es un espacio, y los diez frameworks lo
resuelven sin que se lo pidas, porque lo exige el estándar de URI [@rfc9110].

Especificación ejecutable en [`contrato.json`](contrato.json).

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
PORT=3000 java -jar target/clase-012-1.0.0.jar --server.port=3000
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
| `Clase012.csproj` | proyecto de .NET: el marco de destino y las dependencias |
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

## 🌐 Las implementaciones

### Express · [`express/server.mjs`](implementaciones/express/server.mjs)

```javascript
app.get("/tareas/:id", (peticion, respuesta) => {
  respuesta.json({ id: peticion.params.id });
});
```

`:id` es la sintaxis más extendida —Express la popularizó y la copiaron muchos—.
El valor siempre es texto: Express no sabe ni pregunta qué tipo esperas.

### Fastify · [`fastify/server.mjs`](implementaciones/fastify/server.mjs)

```javascript
app.get("/tareas/:id", (peticion, respuesta) => {
  respuesta.send({ id: peticion.params.id });
});
```

Sintaxis idéntica. La diferencia aparece en la clase 013, cuando entran los
esquemas.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

```python
@app.get("/tareas/{id}")
def obtener(id: str) -> dict[str, str]:
    return {"id": id}
```

Aquí pasa algo que no ocurre en Express: **el nombre del segmento y el del
argumento se emparejan, y la anotación de tipo se aplica**. Si escribieras
`id: int`, FastAPI convertiría `"42"` a `42` y respondería 422 ante `"abc-123"`
sin que tú escribas una línea de validación.

En esta clase se declara `str` a propósito, para que el contrato sea el mismo
que en los demás. Pero **ese es el punto**: el framework puede saber más.

### Flask · [`flask/app.py`](implementaciones/flask/app.py)

```python
@app.get("/tareas/<id>")
def obtener(id: str):
    return jsonify(id=id)
```

Flask tiene convertidores en la propia ruta: `<int:id>`, `<uuid:id>`,
`<path:resto>`. La anotación de Python no hace nada aquí — decora, no valida.

### Django · [`django/app.py`](implementaciones/django/app.py)

```python
urlpatterns = [path("tareas/<str:id>", obtener)]
```

`<str:id>` declara nombre y convertidor a la vez. Con `<int:id>`, una petición a
`/tareas/abc` **no coincidiría con esta ruta** y Django devolvería 404 — no 422.
Es una distinción fina y correcta: si el convertidor no aplica, la ruta no es
esa.

### Spring Boot · [`spring-boot/.../Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
@GetMapping("/tareas/{id}")
public Map<String, String> obtener(@PathVariable("id") String id) {
    return Map.of("id", id);
}
```

El nombre va explícito en la anotación por una razón concreta: **los nombres de
los parámetros se pierden al compilar** salvo que se active la opción de
conservarlos. Escribirlo evita depender de la configuración del compilador.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
app.MapGet("/tareas/{id}", (string id) => Results.Json(new { id }));
```

El emparejamiento es por nombre, como en FastAPI, y el tipo del parámetro dirige
la conversión: con `(int id)`, `/tareas/abc` daría 400 automáticamente.

### Laravel · [`laravel/routes/web.php`](implementaciones/laravel/routes/web.php)

```php
Route::get('/tareas/{id}', function (string $id) {
    return response()->json(['id' => $id]);
});
```

Laravel inyecta los segmentos **por orden de aparición**, no por nombre. Con dos
segmentos, cambiarlos de sitio en la URL cambia qué recibe cada argumento aunque
los nombres coincidan.

### Rails · [`rails/config.ru`](implementaciones/rails/config.ru)

```ruby
get "/tareas/:id" => "tareas#mostrar"

def mostrar
  render json: { id: params[:id] }
end
```

Rails mete en `params` **los segmentos de ruta, la cadena de consulta y el cuerpo
a la vez**. Es cómodo y tiene un coste de seguridad: si no distingues de dónde
viene cada valor, un cliente puede colar por la cadena de consulta algo que
esperabas de la ruta. La clase 070 vuelve sobre esto.

### Gin · [`gin/main.go`](implementaciones/gin/main.go)

```go
motor.GET("/tareas/:id", func(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"id": c.Param("id")})
})
```

Gin usa un árbol de prefijos comprimido, así que emparejar no se vuelve más lento
por tener más rutas registradas. Es una de las razones de su reputación de
rapidez.

## 🔬 Comparación

| Framework | Sintaxis | ¿Puede validar el tipo en la ruta? | Si no valida |
| --- | --- | --- | --- |
| Express | `:id` | no | tú conviertes |
| Fastify | `:id` | con esquema | tú conviertes |
| FastAPI | `{id}` + anotación | **sí**, por el tipo del argumento | 422 automático |
| Flask | `<int:id>` | **sí**, por convertidor | 404 si no coincide |
| Django | `<int:id>` | **sí**, por convertidor | 404 si no coincide |
| Spring Boot | `{id}` + `@PathVariable` | **sí**, por el tipo | 400 automático |
| ASP.NET Core | `{id}` + tipo | **sí**, por el tipo | 400 automático |
| Laravel | `{id}` | con restricción `where` | tú conviertes |
| Rails | `:id` | con restricción `constraints` | tú conviertes |
| Gin | `:id` | no | tú conviertes |

La columna del medio revela el eje real de esta clase, y no es «cuál es mejor»:

**Los frameworks tipados usan el tipo que ya escribiste.** En FastAPI, Spring
Boot y ASP.NET Core la validación es un efecto secundario de declarar el tipo del
argumento — información que ibas a escribir de todas formas.

**Y la respuesta al fallo no es la misma.** Flask y Django devuelven **404**: si
el convertidor no aplica, esa ruta no es la tuya. FastAPI y Spring devuelven
**422/400**: la ruta era la correcta y el valor está mal. Las dos lecturas son
defendibles y afectan al cliente, así que conviene elegir a conciencia.

## ✅ Verificación

```bash
node scripts/run-class.mjs 012
```

## ⚠️ Errores frecuentes

- **Suponer que el valor llega convertido.** Sin tipo declarado es texto: `"42"`,
  no `42`. Comparar con `===` contra un número falla en silencio.
- **Decodificar a mano lo que ya viene decodificado.** Aplicar un decodificador
  de URI otra vez corrompe cualquier `%` legítimo del valor.
- **Confiar en el orden en Laravel** cuando hay más de un segmento.
- **En Rails, leer de `params` sin saber de dónde vino el dato.**
- **Poner la ruta genérica antes que la específica.** `/tareas/:id` registrada
  antes que `/tareas/nuevas` captura también `nuevas`.

## 🧪 Reto de transferencia

Cambia **una** implementación para que el identificador solo acepte dígitos, y
decide si el fallo es 404 o 422. Añade el caso a `contrato.json` y ejecuta: las
otras nueve deben fallar. Después argumenta tu elección de código en
[`porque-si-porque-no.md`](porque-si-porque-no.md).

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 013 — Parámetros de consulta](../013-parametros-de-consulta/README.md)
- [Módulo 05 — Backend y API](../../../curriculum/05-backend-y-api.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@richardson-amundsen-restful] Richardson, Leonard; Amundsen, Mike. *RESTful Web APIs*. O'Reilly Media, 2013. ISBN 9781449358068 — <https://openlibrary.org/isbn/9781449358068>
