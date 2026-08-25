# Clase 014 — Verbos HTTP y su semántica

> [⬅️ 013](../013-parametros-de-consulta/README.md) · [📚 Parte 1](../README.md) · [🎓 Clases](../../README.md) · [015 ➡️](../015-codigos-de-estado/README.md)
>
> Parte **1 — Responder** · Nivel **🟢 introductorio** · Pista **`backend`**
>
> ✅ **Clase construida** — 10 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Elegir el verbo correcto y **respetar lo que promete**. Un verbo HTTP no es una
etiqueta: es un contrato con toda la infraestructura de la red.

## 📚 Resultados de aprendizaje

1. Definir *seguro* e *idempotente* sin confundirlos.
2. Explicar qué hacen los intermediarios de la red confiando en esas promesas.
3. Verificar la idempotencia con una prueba en lugar de afirmarla.

## 🧩 La situación

- `GET /tareas/1` lee. Repetirlo devuelve lo mismo.
- `PUT /tareas/1` sustituye la tarea entera. **Repetirlo deja el mismo estado.**
- `POST /tareas` crea. **Repetirlo crea otra.**

El contrato lo comprueba **repitiendo llamadas y mirando el estado después**, que
es la única forma honesta de verificar una promesa de este tipo.

## 📖 Las dos propiedades

El estándar las define con precisión [@rfc9110]:

| Propiedad | Qué promete | Verbos |
| --- | --- | --- |
| **Seguro** | No cambia el estado del servidor | GET, HEAD, OPTIONS |
| **Idempotente** | Repetirlo tiene el mismo efecto que hacerlo una vez | GET, HEAD, PUT, DELETE, OPTIONS |

Todo verbo seguro es idempotente; lo contrario no. **PUT es idempotente y no
seguro**: cambia el estado, pero repetirlo no lo cambia más.

**Por qué importa, en concreto:**

- Un navegador **precarga** enlaces `GET` porque son seguros. Si tu `GET /borrar`
  borra, el navegador borrará solo al pasar el ratón por encima.
- Un cliente **reintenta** una petición idempotente cuando la red falla. Si tu
  `PUT` no lo es, el reintento duplica.
- Una caché **guarda** respuestas de peticiones seguras [@rfc9111]. Si tu `GET`
  tiene efectos, se ejecutan una vez y la caché sirve el resultado siempre.

Nada de esto lo comprueba tu framework. **Son promesas que tú haces y que la
infraestructura cree**, y ahí está el riesgo real.

## 🧮 El contrato

| Petición | Respuesta | Qué demuestra |
| --- | --- | --- |
| `GET /tareas/1` | `200` `{"id":"1","titulo":"original"}` | lee |
| `GET /tareas/1` otra vez | idéntico | es seguro |
| `PUT /tareas/1` `{"titulo":"sustituido"}` | `200` con el nuevo | sustituye |
| `PUT /tareas/1` otra vez, igual | `200` idéntico | es idempotente |
| `GET /tareas/1` | `{"titulo":"sustituido"}` | dos PUT = un PUT |
| `POST /tareas` `{"titulo":"primera"}` | `201` `{"id":"nueva-1","altas":1}` | crea |
| `POST /tareas` otra vez, igual | `201` `{"id":"nueva-2","altas":2}` | **no** es idempotente |

El contador `altas` está en la respuesta a propósito: hace visible que el segundo
POST creó **otro** recurso y no reutilizó el primero.

## 🌐 Las implementaciones

Las diez comparten estructura. Los fragmentos destacan lo que cada framework hace
distinto.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs)

```javascript
app.put("/tareas/:id", (peticion, respuesta) => {
  const tarea = { id: peticion.params.id, titulo: peticion.body?.titulo ?? "" };
  tareas.set(peticion.params.id, tarea);   // sustituye entero: idempotente
  respuesta.json(tarea);
});

app.post("/tareas", (peticion, respuesta) => {
  altas += 1;                               // cada llamada crea otro
  ...
});
```

La idempotencia del `PUT` **viene de escribir el recurso entero**, no del verbo.
Si dentro hicieras `titulo += ...`, el verbo seguiría diciendo PUT y la promesa
sería falsa.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

```python
@app.put("/tareas/{id}")
def sustituir(id: str, cuerpo: Cuerpo) -> Response:
    tareas[id] = {"id": id, "titulo": cuerpo.titulo}
    return JSONResponse(tareas[id])
```

El cuerpo llega como modelo validado. Un JSON que no encaje se rechaza con 422
antes de entrar — la clase 040 lo trabaja.

### Fastify · [`fastify/server.mjs`](implementaciones/fastify/server.mjs)

```javascript
app.put("/tareas/:id", (peticion, respuesta) => {
  const tarea = { id: peticion.params.id, titulo: peticion.body?.titulo ?? "" };
  tareas.set(peticion.params.id, tarea);
  respuesta.send(tarea);
});
```

```javascript
app.post("/tareas", (peticion, respuesta) => {
  altas += 1;
  const id = `nueva-${altas}`;
  tareas.set(id, { id, titulo: peticion.body?.titulo ?? "" });
  respuesta.code(201).header("location", `/tareas/${id}`).send({ id, altas });
});
```

Casi indistinguible de Express, y con una diferencia que conviene notar:
`peticion.body` llega **ya parseado sin declarar nada**. Express necesita
`app.use(express.json())`; Fastify trae el analizador de JSON puesto y solo
pide declararlo cuando el tipo de contenido es otro.

### Flask · [`flask/app.py`](implementaciones/flask/app.py)

```python
@app.put("/tareas/<id>")
def sustituir(id: str):
    cuerpo = request.get_json(silent=True) or {}
    tareas[id] = {"id": id, "titulo": cuerpo.get("titulo", "")}
    return jsonify(tareas[id])
```

```python
    return jsonify(id=identificador, altas=altas), 201, {"Location": f"/tareas/{identificador}"}
```

Un decorador por verbo, como FastAPI. Y una firma de retorno propia de Flask que
merece la pena conocer: **devolver una tupla** `(cuerpo, estado, cabeceras)` es
la forma corta de construir una respuesta completa sin instanciar nada.

`get_json(silent=True)` es la parte defensiva: sin `silent`, un cuerpo que no sea
JSON válido levanta una excepción y se convierte en un `400` del framework, antes
de que esta función pueda decidir nada.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
app.MapPut("/tareas/{id}", (string id, Cuerpo? cuerpo) =>
{
    var tarea = new { id, titulo = cuerpo?.Titulo ?? "" };
    tareas[id] = tarea;
    return Results.Json(tarea);
});
```

```csharp
app.MapPost("/tareas", (Cuerpo? cuerpo) =>
{
    var n = Interlocked.Increment(ref altas);
    var id = $"nueva-{n}";
    tareas[id] = new { id, titulo = cuerpo?.Titulo ?? "" };
    return Results.Created($"/tareas/{id}", new { id, altas = n });
});
```

Un método por verbo, y dos detalles del modelo de ejecución: `ConcurrentDictionary`
e `Interlocked.Increment`, porque .NET atiende en varios hilos. Es la misma
observación que en Gin más abajo, con otra solución — **estructuras concurrentes
en lugar de un candado explícito**.

Y `Results.Created($"/tareas/{id}", …)` vuelve a atar el `201` con su `Location`
por construcción, como en la clase 003.

### Django · [`django/app.py`](implementaciones/django/app.py)

```python
@csrf_exempt
def por_id(peticion, id):
    if peticion.method == "GET": ...
    if peticion.method == "PUT": ...
    return HttpResponse(status=405)
```

Django enruta por camino y **tú despachas por método**. Es más verboso y tiene una
ventaja: el `405` para métodos no admitidos es explícito, no accidental.

El `@csrf_exempt` es necesario porque Django protege por omisión toda petición que
cambia estado. Esa protección se estudia en la clase 072; aquí se desactiva para
aislar el tema.

### Spring Boot · [`spring-boot/.../Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
@PutMapping("/tareas/{id}")
public Map<String, String> sustituir(@PathVariable("id") String id,
        @RequestBody(required = false) Map<String, Object> cuerpo) { ... }
```

Una anotación por verbo. El `405` sale solo cuando el camino coincide y el método
no.

### Laravel · [`laravel/routes/api.php`](implementaciones/laravel/routes/api.php)

```php
Route::put('/tareas/{id}', function (Request $peticion, string $id) { ... });
```

Dos detalles que costaron dos intentos y que enseñan más que el código:

**1. Rutas `api`, no `web`.** El grupo `web` aplica sesión y comprobación de
falsificación, que **rechaza cualquier PUT o POST sin testigo**. Para una API con
clientes que usan token, ese grupo estorba; para un formulario de navegador es
justo lo que protege. Elegir mal el grupo da un 419 desconcertante.

**2. El estado vive en un archivo.** El servidor de desarrollo de PHP atiende cada
petición en un **proceso nuevo**, así que una variable en memoria se pierde entre
llamadas. No es cosa de Laravel: es el modelo de ejecución de PHP, y explica por
qué en ese ecosistema la sesión y la caché son infraestructura y no una variable.

### Rails · [`rails/config.ru`](implementaciones/rails/config.ru)

```ruby
class TareasController < ActionController::Base
  skip_forgery_protection
  ...
end
```

Mismo asunto que en Django: Rails protege por omisión, y hay que desactivarlo
explícitamente para una API sin sesión. **Que los tres frameworks completos
—Django, Rails y Laravel— lo traigan puesto no es casualidad**: los tres nacieron
sirviendo formularios de navegador.

### Gin · [`gin/main.go`](implementaciones/gin/main.go)

```go
var mu sync.Mutex
...
mu.Lock()
defer mu.Unlock()
```

El único de los diez donde el acceso concurrente se protege explícitamente. Gin
atiende peticiones en gorutinas distintas sobre el mismo mapa, y en Go escribir un
mapa desde dos gorutinas a la vez **aborta el proceso**. Node y Python tienen un
único hilo de ejecución para esto; Java y .NET usan estructuras concurrentes.

Es una diferencia de modelo de concurrencia que asoma en la clase más simple donde
hay estado compartido.

## 🔬 Comparación

| Framework | Rutas por verbo | Protección de falsificación por omisión | Estado compartido |
| --- | --- | --- | --- |
| Express | `app.put(...)` | no | un hilo |
| Fastify | `app.put(...)` | no | un hilo |
| FastAPI | `@app.put(...)` | no | un hilo |
| Flask | `@app.put(...)` | no | un hilo |
| Django | despacho manual | **sí** | un proceso |
| Spring Boot | `@PutMapping` | con Security | concurrente |
| ASP.NET Core | `MapPut` | con antifalsificación | concurrente |
| Laravel | `Route::put` | **sí** en `web` | **proceso por petición** |
| Rails | `put "..."` | **sí** | un proceso |
| Gin | `motor.PUT` | no | **exclusión mutua obligatoria** |

Lo que revela la tabla, y que no se ve mirando un framework solo:

**Los frameworks completos protegen; los micro no.** Django, Rails y Laravel
bloquean por omisión las peticiones que cambian estado. No es una manía: es que
nacieron sirviendo formularios, donde esa protección es imprescindible. Al montar
una API hay que desactivarla a conciencia — y saber que la desactivas.

**El modelo de concurrencia se cuela hasta aquí.** La misma clase, en Go, exige un
cerrojo que en Node no hace falta. La clase 037 vuelve sobre esto con el ciclo de
vida de los objetos.

## ✅ Verificación

```bash
node scripts/run-class.mjs 014
```

## ⚠️ Errores frecuentes

- **Un `GET` que cambia estado.** El navegador lo precargará y la caché lo
  servirá sin llegar a tu servidor.
- **Un `PUT` que acumula en vez de sustituir.** Rompe la promesa de idempotencia
  sin que nada avise.
- **Usar `POST` para todo.** Funciona, y renuncia a los reintentos seguros y a la
  caché.
- **Desactivar la protección de falsificación «para que funcione»** sin entender
  qué protegía. Correcto en una API con token; peligroso en un formulario.
- **Suponer que `DELETE` repetido debe dar 404.** Es idempotente en efecto, no en
  código de respuesta: 204 la primera vez y 404 después es correcto.

## 🧪 Reto de transferencia

Añade `PATCH /tareas/:id` que modifique **solo** el campo enviado. Después
responde con evidencia del contrato: ¿es idempotente tu `PATCH`? Depende de lo que
hagas dentro — y esa es la lección. Añade los casos y verifica.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 047 — Idempotencia](../../parte-3-validacion-y-contrato/047-idempotencia/README.md)
- [Módulo 01 — HTTP, eventos y contratos](../../../curriculum/01-http-eventos-y-contratos.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@rfc9111] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Caching*, RFC 9111, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9111>
- [@richardson-amundsen-restful] Richardson, Leonard; Amundsen, Mike. *RESTful Web APIs*. O'Reilly Media, 2013. ISBN 9781449358068 — <https://openlibrary.org/isbn/9781449358068>
