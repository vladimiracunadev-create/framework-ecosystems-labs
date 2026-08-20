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
    properties: { limite: { type: "integer", minimum: 1, maximum: 100, default: 20 } },
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

```python
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
app.MapGet("/tareas", (int? limite) =>
{
    var valor = limite ?? 20;
    ...
});
```

El `int?` anulable es el truco: si el texto no se puede convertir, el valor llega
nulo en lugar de reventar. Distinguir «ausente» de «inválido» exigiría mirar la
colección de consulta directamente.

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
