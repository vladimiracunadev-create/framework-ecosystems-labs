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
