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
