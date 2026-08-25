# Clase 003 — El contrato como unidad de comparación

> [⬅️ 002](../002-inversion-de-control-en-concreto/README.md) · [📚 Parte 0](../README.md) · [🎓 Clases](../../README.md) · [004 ➡️](../004-taxonomia-que-compite-de-verdad-con-que/README.md)
>
> Parte **0 — El método: qué es un framework y cómo se compara** · Nivel **🟢 introductorio** · Pista **`backend`** (Backend y API)
>
> ✅ **Clase construida** — 5 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Entender **por qué comparar frameworks exige fijar antes el comportamiento**, y
verlo en el sitio donde se nota: en las líneas que cada implementación escribe
**solo para apartarse de lo que su framework habría hecho por omisión**.

Esta es la clase que justifica el método de todo el programa. Si te saltas una,
que no sea esta.

## 📚 Resultados de aprendizaje

Al terminar podrás:

1. Explicar por qué un «hola mundo» no compara nada.
2. Señalar, en cinco implementaciones, las tres líneas que existen solo por
   culpa del contrato.
3. Distinguir una diferencia **de fondo** entre frameworks de una diferencia
   **de valores por omisión**, que es la mayoría de lo que se discute.

## 🧩 La situación

Una lista de tareas mínima: crear, consultar, borrar. Cinco frameworks, cinco
ecosistemas, **un solo contrato**.

Lo interesante no es que los cinco puedan hacerlo. Es que **los cinco, dejados a
su aire, responderían cosas distintas**:

| Al crear un recurso, por omisión… | | Cuando no existe, por omisión… | |
| --- | --- | --- | --- |
| Express | `200`, sin `Location` | Express | **HTML** con una traza |
| FastAPI | `200`, sin `Location` | FastAPI | JSON, con forma `{"detail": …}` |
| Spring Boot | `200`, sin `Location` | Spring Boot | JSON, con forma `{timestamp, path, error, …}` |
| ASP.NET Core | `200`, sin `Location` | ASP.NET Core | `404` **sin cuerpo** |
| Laravel | `200`, sin `Location` | Laravel | **HTML** — la página que ve un navegador |

Cinco respuestas distintas al mismo hecho. Sin un contrato que las obligue a
coincidir, «comparar» estos cinco frameworks es comparar los gustos de cinco
equipos de mantenedores.

## 🧮 El contrato

| Petición | Respuesta esperada | Por qué está |
| --- | --- | --- |
| `GET /tareas` | `200`, `application/json`, `{"total":0,"tareas":[]}` | la lista vacía **tiene forma** |
| `POST /tareas` con `{"titulo":"comprar pan"}` | `201`, cabecera `Location` con `/tareas/1`, `{"id":"1","titulo":"comprar pan"}` | crear no es leer, y hay que decir **dónde quedó** |
| `GET /tareas/1` | `200`, la misma tarea | la `Location` no mentía |
| `GET /tareas/99` | `404`, `application/json`, `{"error":"no-encontrada"}` | el error también es parte del contrato |
| `DELETE /tareas/1` | `204`, **cuerpo vacío** | «hecho, y no tengo nada que contarte» |
| `GET /tareas` | `200`, `{"total":0,"tareas":[]}` | y de verdad se borró |

La especificación ejecutable está en [`contrato.json`](contrato.json). Los
códigos `201` y `204` y la cabecera `Location` no son convenciones de este
programa: están definidos en el estándar de HTTP semántico [@rfc9110].

**Ninguno de los cinco frameworks cumple este contrato por omisión.** Los cinco
lo cumplen porque alguien escribió las líneas que hacían falta — y ese es
exactamente el contenido de la clase.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Contrato**](../../../glosario/README.md#contrato) | El comportamiento exigido, escrito antes que las implementaciones y **idéntico para todas**. Vive en el `contrato.json` de cada clase y es lo que convierte una comparación en una medición. Adaptarlo a un framework la invalida. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Express** | framework web de Node.js (JavaScript) | 2010 | MIT | OpenJS Foundation |
| **FastAPI** | framework web de Python (Python) | 2018 | MIT | proyecto independiente |
| **Spring Boot** | framework de aplicación de JVM (Java) | 2014 | Apache-2.0 | Broadcom/VMware y colaboradores |
| **ASP.NET Core** | framework web de .NET (C#) | 2016 | MIT | Microsoft y .NET Foundation |
| **Laravel** | full-stack-framework de PHP (PHP) | 2011 | MIT | proyecto independiente |

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
PORT=3000 java -jar target/clase-003-1.0.0.jar --server.port=3000
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
| `Clase003.csproj` | proyecto de .NET: el marco de destino y las dependencias |
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

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

En los cinco archivos, las tres líneas que se apartan de lo que el framework
habría hecho solo están marcadas con un comentario numerado. Búscalas.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs)

```javascript
  respuesta.status(201).location(`/tareas/${id}`).json(tarea);
```

```javascript
  if (!tarea) return respuesta.status(404).json({ error: "no-encontrada" });
```

```javascript
  respuesta.status(204).end();
```

Tres llamadas encadenadas, tres decisiones, **y nada que impida equivocarse**.
`status(201)` y `location(...)` son independientes: se puede emitir el 201 y
olvidar la cabecera, y Express no dirá nada.

El `end()` sin argumento es la tercera: un `json({})` ahí devolvería dos bytes,
y un `204` con cuerpo es una respuesta que ningún cliente sabe interpretar.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

```python
    return JSONResponse(tarea, status_code=201, headers={"Location": f"/tareas/{identificador}"})
```

```python
    if tarea is None:
        return JSONResponse({"error": "no-encontrada"}, status_code=404)
```

```python
    return Response(status_code=204)
```

La segunda línea merece un comentario, porque es el caso más sutil de la clase:
**el 404 de FastAPI ya es JSON**. Lo que no coincide es *la forma*: FastAPI
emite `{"detail": "..."}` y este contrato pide `{"error": "..."}`.

Por eso la implementación construye la respuesta en vez de lanzar
`HTTPException`. Y aquí hay una decisión declarada: *el contrato podría haberse
adaptado a la forma de FastAPI*. No se hizo, y no se hizo a propósito —
adaptar el contrato al framework que estás mirando es exactamente cómo se
falsean las comparaciones.

`Response` pelado en el borrado, y no `JSONResponse`: serializar `null` serían
cuatro bytes que el `204` no admite.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
        return ResponseEntity.created(URI.create("/tareas/" + id)).body(tarea);
```

```java
        if (tarea == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "no-encontrada"));
        }
```

```java
        return ResponseEntity.noContent().build();
```

**Aquí el tipo te protege**, y es la diferencia más interesante del elenco.

`ResponseEntity.created(uri)` **exige la URI como argumento**: no existe forma
de emitir un 201 con ese método y olvidarse del `Location`. Y `noContent()` no
acepta cuerpo — `build()` es lo único que se puede llamar después.

En Express las dos cosas son posibles y hay que acordarse. Aquí no se puede
hacer mal. Es un ejemplo pequeño de una idea grande: **una API bien diseñada
hace que el error correcto sea el fácil**, que es el mismo criterio con el que
la clase 073 juzga los nombres de las puertas al XSS.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
    return Results.Created($"/tareas/{id}", tarea);
```

```csharp
    tareas.TryGetValue(id, out var tarea)
        ? Results.Json(tarea)
        : Results.Json(new { error = "no-encontrada" }, statusCode: 404));
```

```csharp
    return Results.NoContent();
```

La misma protección de tipo que Spring, con una diferencia de omisión que va en
la otra dirección: **el 404 de ASP.NET Core no lleva cuerpo**. No es HTML ni es
JSON de otra forma: no hay nada. Un cliente que espere un objeto con un campo
`error` recibe cero bytes y falla al parsear.

De los cinco valores por omisión, es el que más silenciosamente rompe a quien
consume la API.

### Laravel · [`laravel/routes/api.php`](implementaciones/laravel/routes/api.php)

```php
    return response()->json($tarea, 201)->header('Location', "/tareas/{$id}");
```

```php
    if (! isset($tareas[$id])) {
        return response()->json(['error' => 'no-encontrada'], 404);
    }
```

```php
    return response()->noContent();
```

Como Express: el código y la cabecera van por separado y nada los ata.
`noContent()` sí existe con nombre propio, igual que en Spring.

Pero la línea que de verdad enseña esta implementación no está en las rutas —
está en [`bootstrap/app.php`](implementaciones/laravel/bootstrap/app.php):

```php
    ->withRouting(api: __DIR__ . '/../routes/api.php', apiPrefix: '')
```

**`api:` y no `web:`.** El grupo `web` trae sesión, cookies cifradas y
verificación del testigo CSRF; este contrato envía JSON sin testigo, así que el
grupo `web` respondería `419` a todos los `POST` — y así fue el primer intento.
La diferencia entre los dos grupos *es* la clase 072, convertida en una palabra
de tres letras.

Y hay un segundo detalle propio del ecosistema, en el almacén:

```php
    return __DIR__ . '/../storage/tareas.json';
```

Las otras cuatro implementaciones guardan las tareas en memoria. Laravel no
puede: el servidor embebido de PHP **atiende cada petición en un proceso
nuevo**, y una variable no sobreviviría de una petición a la siguiente. No es
una rareza del laboratorio — es el modelo de ejecución de PHP, y explica por qué
en ese ecosistema la sesión y la caché son piezas de infraestructura desde el
primer día.

## 🔬 Comparación

| | Express | FastAPI | Spring Boot | ASP.NET Core | Laravel |
| --- | --- | --- | --- | --- | --- |
| `201` por omisión | no | no | no | no | no |
| ¿El tipo ata `201` y `Location`? | no | no | **sí** | **sí** | no |
| Forma del `404` por omisión | HTML | JSON, otra forma | JSON, otra forma | **sin cuerpo** | HTML |
| ¿El tipo impide cuerpo en el `204`? | no | no | **sí** | **sí** | no |
| Estado entre peticiones | memoria | memoria | memoria | memoria | **fichero** |
| Líneas fuera de la omisión | 3 | 3 | 3 | 3 | 3 + el grupo de rutas |

**Los cinco necesitan tres líneas.** Eso ya dice algo: en lo que este contrato
mide, los cinco frameworks están mucho más cerca entre sí de lo que sugiere
cualquier discusión sobre ellos.

Donde sí difieren es en **quién impide el error**: dos de los cinco tienen una
API que hace imposible emitir un `201` sin `Location` o un `204` con cuerpo. En
los otros tres, la corrección depende de que quien escribe se acuerde. Esa
distinción —entre lo que el framework *permite* y lo que el framework
*garantiza*— vale más que cualquier comparación de sintaxis.

## 🧠 Por qué esto es el método

Un «hola mundo» no compara nada porque **todos lo hacen bien y ninguno tiene que
apartarse de nada**. La comparación empieza justo donde el comportamiento
exigido se sale del camino que el framework tenía pavimentado.

De ahí las tres reglas que gobiernan las 149 clases:

1. **El contrato se escribe antes que las implementaciones.** Al revés, el
   contrato acaba describiendo lo que ya hacía la primera que escribiste.
2. **El contrato no se adapta a ningún framework.** Si se adapta, deja de medir
   y pasa a describir. El `{"error": …}` de esta clase es deliberadamente
   distinto del `{"detail": …}` de FastAPI por eso.
3. **Cambiar el contrato para que uno pase es invalidar la comparación.** Salvo
   que el contrato estuviera equivocado — y entonces se cambia para todos, y se
   dice por qué.

Fielding formuló la idea general para HTTP: lo que se acuerda es la interfaz
uniforme, no la implementación detrás [@fielding-rest-dissertation]. Un contrato
ejecutable es esa idea escrita de forma que una máquina pueda comprobarla — y
la razón de que la comprobación tenga que ser **la misma prueba**, sin
adaptadores, es la de siempre: dos suites de pruebas distintas no comparan dos
frameworks, comparan dos suites [@meszaros-xunit].

## ⚠️ Errores frecuentes

- **Comparar «hola mundo».** Mide cuánta ceremonia hay para arrancar y nada
  más. La clase 011 lo hace a propósito, y por eso su conclusión es sobre
  arranque, no sobre calidad.
- **Escribir el contrato después de la primera implementación.** Sale un
  contrato con la forma de esa implementación, y las otras cuatro «fallan» por
  ser distintas y no por ser peores.
- **Ceder cuando un framework no encaja.** Aflojar el `201` a «`2xx`» para que
  pase uno es dejar de medir la parte interesante.
- **No ceder cuando el contrato está mal.** Si el contrato exige algo que el
  estándar no exige, el equivocado es el contrato. Se corrige **para los
  cinco**, y se explica.
- **Confundir un valor por omisión con una limitación.** Que el `404` de
  Express sea HTML no significa que Express no sepa devolver JSON: significa
  que su omisión está pensada para un navegador.

## ✅ Verificación

```bash
node scripts/run-class.mjs 003
```

Salida real en una máquina sin JDK con Maven y sin .NET:

```text
Clase 003 — El contrato como unidad de comparación
  ✔ express              6 casos
  ✔ fastapi              6 casos
  ⊘ spring-boot          falta la herramienta `mvn`
  ⊘ aspnet-core          falta la herramienta `dotnet`
  ✔ laravel              6 casos

RESUMEN: 3 verificadas · 0 con fallo · 2 omitidas por falta de herramientas
```

## 🧪 Reto de transferencia

Quita el `.location(...)` de la implementación de Express y vuelve a ejecutar.
Falla el segundo caso, como debe.

Ahora intenta hacer lo mismo en Spring Boot: quita el argumento de
`ResponseEntity.created(...)`. **No compila.** El fallo llega antes, sin
ejecutar nada y sin contrato.

Escribe en dos frases qué prefieres para un equipo de ocho personas y por qué.
No hay respuesta correcta; hay respuesta declarada, que es lo que el módulo 11
pide.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — qué contrato conviene a cada situación
- [Clase 002 — Inversión de control, en concreto](../002-inversion-de-control-en-concreto/README.md)
- [Clase 040 — Errores por campo con RFC 9457](../../parte-3-validacion-y-contrato/040-errores-por-campo-con-rfc-9457/README.md) — el contrato del error, en serio
- [Módulo 01 — HTTP, eventos y contratos](../../../curriculum/01-http-eventos-y-contratos.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@fielding-rest-dissertation] Fielding, Roy T. *Architectural Styles and the Design of Network-based Software Architectures*. UC Irvine, 2000 — <https://ics.uci.edu/~fielding/pubs/dissertation/top.htm>
- [@meszaros-xunit] Meszaros, Gerard. *xUnit Test Patterns: Refactoring Test Code*. Addison-Wesley, 2007. ISBN 9780131495050 — <https://openlibrary.org/isbn/9780131495050>
