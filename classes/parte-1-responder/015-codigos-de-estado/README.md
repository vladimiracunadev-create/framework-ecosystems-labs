# Clase 015 — Códigos de estado

> [⬅️ 014](../014-verbos-http-y-su-semantica/README.md) · [📚 Parte 1](../README.md) · [🎓 Clases](../../README.md) · [016 ➡️](../016-cabeceras-leer-y-escribir/README.md)
>
> Parte **1 — Responder** · Nivel **🟢 introductorio** · Pista **`backend`**
>
> ✅ **Clase construida** — 10 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Devolver el código que **describe lo que pasó**, no siempre 200. Y con él, lo que
ese código obliga a acompañar: un `201` sin `Location` está incompleto, y un `204`
con cuerpo está mal.

## 📚 Resultados de aprendizaje

1. Emitir `201`, `204` y `404` con lo que cada uno exige.
2. Explicar por qué un `200` con `{"error": ...}` dentro es un antipatrón.
3. Reconocer qué frameworks hacen difícil equivocarse y cuáles te dejan.

## 🧩 La situación

- `POST /tareas` crea → **201** con `Location` apuntando al recurso nuevo.
- `DELETE /tareas/101` borra → **204** con el cuerpo vacío.
- `DELETE` de algo inexistente → **404**, no 204.
- `GET` de lo borrado → **404**.

El tercer caso es el que separa el código descuidado del correcto: **borrar lo que
no existe no es un éxito**. Es tentador devolver 204 «porque el resultado final es
el mismo», y con eso el cliente pierde la información de que su identificador era
falso.

## 📖 Los tres códigos, y qué arrastra cada uno

| Código | Significa | Obliga a |
| --- | --- | --- |
| **201 Created** | Se creó un recurso | `Location` con su ruta [@rfc9110] |
| **204 No Content** | Fue bien, no hay nada que devolver | Cuerpo **vacío** |
| **404 Not Found** | No existe ese recurso | Nada, y conviene explicar |

**Por qué el `Location` no es opcional:** sin él, el cliente que acaba de crear
algo no sabe dónde está. Tiene que adivinar la ruta a partir del identificador que
le devolviste, y esa adivinanza acopla al cliente con tu esquema de URL. Con
`Location`, el servidor lo dice.

**Por qué el cuerpo del `204` debe estar vacío:** el estándar dice que no hay
contenido, así que un intermediario puede no reenviarlo. Si metes datos ahí, unos
clientes los verán y otros no.

## ❌ El antipatrón que esta clase persigue

```json
HTTP/1.1 200 OK
{"exito": false, "error": "no existe"}
```

Un `200` diciendo que algo falló. Es cómodo para quien escribe el servidor y caro
para todos los demás: **la infraestructura mira el código, no el cuerpo**. Una
caché guardará ese error como si fuera una respuesta buena; un panel de métricas
contará una petición correcta; un cliente que comprueba `res.ok` seguirá adelante
con datos que no existen.

Richardson y Amundsen lo señalan como una de las formas más comunes de tirar a la
basura lo que HTTP ya te da [@richardson-amundsen-restful].

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `POST /tareas` `{"titulo":"nueva"}` | `201` · `{"id":"100"}` |
| `POST /tareas` `{"titulo":"otra"}` | `201` · `location: /tareas/101` |
| `GET /tareas/101` | `200` · `{"id":"101","titulo":"otra"}` |
| `DELETE /tareas/101` | `204` · cuerpo vacío |
| `GET /tareas/101` | `404` |
| `DELETE /tareas/no-existe` | `404` · `{"error":"no existe"}` |

El tercer caso comprueba algo que suele quedarse sin probar: **que la ruta del
`Location` funciona de verdad**.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Código de estado**](../../../glosario/README.md#código-de-estado) | El número de tres cifras de la respuesta. `2xx` salió bien, `3xx` está en otro sitio, `4xx` se equivocó el cliente, `5xx` se equivocó el servidor. La frontera entre `4xx` y `5xx` dice de quién es el problema, y por tanto quién tiene que arreglarlo. |

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
PORT=3000 java -jar target/clase-015-1.0.0.jar --server.port=3000
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
| `Clase015.csproj` | proyecto de .NET: el marco de destino y las dependencias |
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
composer,install,--no-interaction,--quiet php,-r,@unlink(sys_get_temp_dir().'/clase-015-laravel.json');
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
respuesta.status(201).location(`/tareas/${id}`).json({ id });
...
respuesta.status(204).end();
```

Encadenado y explícito. `end()` en lugar de `json()` para el 204: es lo que
garantiza que no salga cuerpo.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

```python
return JSONResponse(
    {"id": identificador},
    status_code=201,
    headers={"location": f"/tareas/{identificador}"},
)
```

El código y la cabecera van juntos en la misma llamada. Para el borrado,
`Response(status_code=204)` sin argumento de contenido.

### Fastify · [`fastify/server.mjs`](implementaciones/fastify/server.mjs)

```javascript
  respuesta.code(201).header("location", `/tareas/${id}`).send({ id });
```

```javascript
  respuesta.code(204).send();
```

Lo mismo que Express con otros nombres: `code` en vez de `status`, `header` en
vez de `location`. **Nada ata el código a la cabecera**, así que la corrección
depende de escribirlas las dos.

`send()` sin argumento para el 204 cumple el mismo papel que el `end()` de
Express: un `send({})` ahí serían dos bytes que el código prohíbe.

### Flask · [`flask/app.py`](implementaciones/flask/app.py)

```python
    return jsonify(id=identificador), 201, {"Location": f"/tareas/{identificador}"}
```

```python
    return "", 204
```

La tupla de Flask —`(cuerpo, estado, cabeceras)`— es la forma más compacta del
elenco de emitir un `201` completo: las tres piezas en una línea, sin construir
ninguna respuesta.

Y el `204` se escribe `return "", 204`. Es breve, y es también el sitio donde es
más fácil equivocarse: `return jsonify({}), 204` compila igual de bien y emite un
cuerpo que el código de estado prohíbe.

### Django · [`django/app.py`](implementaciones/django/app.py)

```python
    respuesta = JsonResponse({"id": identificador}, status=201)
    respuesta["Location"] = f"/tareas/{identificador}"
    return respuesta
```

```python
        del tareas[id]
        return HttpResponse(status=204)
```

Django es el único de los seis que **construye la respuesta y luego la
modifica**: `JsonResponse` primero, la cabecera después, con la sintaxis de un
diccionario. Es más pasos y tiene una ventaja — la respuesta es un objeto que se
puede pasar por capas y seguir tocando, que es la base de cómo funcionan sus
middleware (clase 026).

Y `HttpResponse(status=204)` en lugar de `JsonResponse`: la clase base no
serializa nada, así que no hay cuerpo que emitir por accidente.

```python
    if peticion.method != "POST":
        return HttpResponse(status=405)
```

Además, Django enruta por camino y **el despacho por método lo escribes tú**. El
`405` es explícito, no accidental — y esa línea es la que en los otros cinco
frameworks emite el enrutador sin que nadie la vea.

### Spring Boot · [`spring-boot/.../Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
return ResponseEntity.created(URI.create("/tareas/" + id)).body(Map.of("id", id));
...
return ResponseEntity.noContent().build();
```

**Aquí el tipo te protege.** `ResponseEntity.created(uri)` exige la URI: no
existe forma de emitir un 201 sin `Location` usando ese método. Y `noContent()`
no acepta cuerpo — `build()` es lo único que puedes llamar después.

Es el mejor ejemplo del programa de una API diseñada para que el error correcto
sea el fácil.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
    return Results.Created($"/tareas/{id}", new { id });

app.MapDelete("/tareas/{id}", (string id) =>
    tareas.TryRemove(id, out _)
        ? Results.NoContent()
        : Results.Json(new { error = "no existe" }, statusCode: 404));
```

Misma idea que en Spring: `Results.Created` pide la ruta como primer argumento —
no hay forma de emitir el 201 con ese método y olvidarse del `Location`— y
`Results.NoContent()` no admite contenido.

Y el borrado enseña de paso el otro reparto de esta clase: `TryRemove` devuelve
si había algo, y **esa respuesta booleana es la que decide entre 204 y 404**. El
código de estado no describe lo que quiso hacer el cliente, describe lo que
encontró el servidor.

### Laravel · [`laravel/routes/api.php`](implementaciones/laravel/routes/api.php)

```php
return response()->json(['id' => $id], 201)->header('Location', '/tareas/' . $id);
...
return response()->noContent();
```

El `Location` va **suelto**: nada obliga a ponerlo. `noContent()` sí garantiza el
204 vacío.

### Rails · [`rails/config.ru`](implementaciones/rails/config.ru)

```ruby
response.headers["Location"] = "/tareas/#{id}"
render json: { id: id }, status: :created
...
head :no_content
```

Rails acepta el **nombre** del código además del número: `:created`,
`:no_content`, `:not_found`. Es más legible que `201` y menos propenso a un
número tecleado mal. `head` emite estado y cabeceras sin cuerpo, por definición.

### Gin · [`gin/main.go`](implementaciones/gin/main.go)

```go
c.Header("Location", "/tareas/"+id)
c.JSON(http.StatusCreated, gin.H{"id": id})
...
c.Status(http.StatusNoContent)
```

`http.StatusCreated` es una constante de la biblioteca estándar: no se teclea el
número. Y `c.Status` frente a `c.JSON` es la diferencia entre un 204 correcto y
uno con cuerpo.

### Flask y Django

```python
return jsonify(id=identificador), 201, {"Location": f"/tareas/{identificador}"}
```

Flask devuelve la tupla `(cuerpo, código, cabeceras)`: compacto y sin ninguna
comprobación. Django construye la respuesta y le asigna la cabecera después. En
ambos, olvidar el `Location` no produce ningún aviso.

## 🔬 Comparación

| Framework | ¿Fuerza el `Location` en el 201? | ¿Impide cuerpo en el 204? | Códigos por nombre |
| --- | --- | --- | --- |
| Spring Boot | **sí**, el método lo exige | **sí**, `build()` no acepta cuerpo | no |
| ASP.NET Core | **sí**, es el primer argumento | **sí** | no |
| Rails | no | sí, con `head` | **sí** (`:created`) |
| Gin | no | sí, con `Status` | constantes |
| Express | no | sí, con `end()` | no |
| Fastify | no | sí | no |
| FastAPI | no | sí | no |
| Laravel | no | sí, con `noContent()` | no |
| Flask | no | sí | no |
| Django | no | sí | no |

**Dos frameworks de diez hacen imposible el error más común.** Spring Boot y
ASP.NET Core no te dejan emitir un 201 sin decir dónde quedó el recurso, porque el
método que emite ese código pide la URI. En los otros ocho, el `Location` es una
línea que se puede olvidar — y se olvida.

Esto es diseño de API aplicado a la propia API del framework: **hacer que lo
correcto sea lo fácil y lo incorrecto, imposible**. Es el principio que Ousterhout
resume como esconder la complejidad detrás de interfaces que no admiten mal uso
[@ousterhout-philosophy].

Y una observación honesta: que Spring te obligue aquí **no lo hace mejor
framework**. Es una decisión de diseño con un coste —más ceremonia— que en esta
clase concreta paga.

## ✅ Verificación

```bash
node scripts/run-class.mjs 015
```

## ⚠️ Errores frecuentes

- **`200` con un error dentro.** La infraestructura mira el código, no el cuerpo.
- **`201` sin `Location`.** El cliente tiene que adivinar la ruta.
- **`204` con cuerpo.** Unos intermediarios lo reenvían y otros no.
- **`404` para «no autorizado».** A veces es deliberado, para no revelar que el
  recurso existe; si no es deliberado, es un diagnóstico peor. La clase 071 lo
  trata.
- **`500` por un error del cliente.** Culpa al servidor de algo que no hizo.

## 🧪 Reto de transferencia

Añade `PUT /tareas/:id` que responda **201 con `Location`** si crea y **200** si
sustituye una existente. Es una distinción que el estándar permite y casi nadie
implementa. Añade los casos y verifica en las diez.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 040 — Errores por campo con RFC 9457](../../parte-3-validacion-y-contrato/040-errores-por-campo-con-rfc-9457/README.md)
- [Módulo 01 — HTTP, eventos y contratos](../../../curriculum/01-http-eventos-y-contratos.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@richardson-amundsen-restful] Richardson, Leonard; Amundsen, Mike. *RESTful Web APIs*. O'Reilly Media, 2013. ISBN 9781449358068 — <https://openlibrary.org/isbn/9781449358068>
- [@ousterhout-philosophy] Ousterhout, John. *A Philosophy of Software Design*. Yaknyam Press, 2018. ISBN 9781732102200 — <https://openlibrary.org/isbn/9781732102200>
