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

## 🌐 Las implementaciones

```javascript
// Express
const recibido = peticion.get("x-peticion") ?? "(ninguna)";
respuesta.set("x-respuesta", "servida").set("cache-control", "no-store");
```

```python
# FastAPI — el guion bajo del argumento es el guion medio de la cabecera
@app.get("/eco")
def eco(x_peticion: Annotated[str, Header()] = "(ninguna)") -> JSONResponse:
```

FastAPI es el único de los diez donde la cabecera entra **por la firma**, con su
valor por omisión declarado ahí mismo. En los demás se lee del diccionario.

```java
// Spring Boot
@RequestHeader(name = "X-Peticion", required = false, defaultValue = "(ninguna)") String recibido
```

```ruby
# Rails — Rack conserva la convención antigua por debajo
recibido = request.headers["X-Peticion"] || "(ninguna)"
```

```go
// Gin — cadena vacía, no nulo, cuando la cabecera no viene
recibido := c.GetHeader("X-Peticion")
if recibido == "" { recibido = "(ninguna)" }
```

El detalle de Gin importa: en Go **no hay valor nulo para una cadena**, así que
«ausente» y «presente pero vacía» se confunden. Si esa distinción fuera parte de
tu contrato, habría que consultar el mapa de cabeceras directamente.

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
