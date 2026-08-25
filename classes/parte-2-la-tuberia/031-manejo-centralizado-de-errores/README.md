# Clase 031 — Manejo centralizado de errores

> [⬅️ 030](../030-identificador-de-correlacion/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [032 ➡️](../032-tiempos-de-espera/README.md)
>
> Parte **2 — La tubería** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Convertir **cualquier** excepción en una respuesta del contrato, y hacerlo en un
solo sitio. Con una distinción que es de seguridad: lo que se cuenta al cliente
no es lo que se registra dentro.

## 🧩 La situación

- `GET /roto` lanza una excepción con un mensaje que contiene `secreto=abc123`.
  El cliente recibe **500 genérico**; el mensaje real solo va al registro.
- `GET /negocio` lanza un error de negocio. El cliente recibe **409 con el motivo
  concreto y un código de error**.

## 📖 Dos clases de error, dos tratos

| | Error de negocio | Error no previsto |
| --- | --- | --- |
| **Qué es** | una regla del dominio que no se cumple | un fallo del programa |
| **Quién puede arreglarlo** | el cliente | tú |
| **Qué se le dice** | qué pasó y qué hacer | «error interno» |
| **Código** | 4xx | 500 |

La razón de no contar el error interno es concreta: **el mensaje de una excepción
suele llevar información del sistema**. Rutas del disco, nombres de tablas,
fragmentos de consulta, cadenas de conexión. Todo eso es material de partida para
quien busca una vía de entrada, y OWASP lo clasifica como fuga por mensajes de
error [@owasp-top10].

Por eso el contrato comprueba explícitamente que **el mensaje interno no aparece
en la respuesta**.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /ok` | `200` · `{"ok":true}` |
| `GET /roto` | `500` en `application/problem+json` |
| igual | `{"title":"error interno","code":"ERROR_INTERNO"}` — **sin el mensaje real** |
| `GET /negocio` | `409` con el motivo concreto y su código |

El tercer caso es el que importa: comprueba que **el mensaje interno no llega al
cliente**.

## 📖 El formato: RFC 9457

Los cuatro responden con `application/problem+json`, el formato estándar para
errores de HTTP [@rfc9457]:

```json
{
  "type": "about:blank",
  "title": "la tarea ya estaba completada",
  "status": 409,
  "code": "TAREA_YA_COMPLETADA"
}
```

`type`, `title` y `status` son del estándar; `code` es una extensión, y es la que
de verdad usa el cliente: **una cadena estable que se puede comparar**. El
`title` está para las personas y puede cambiar de redacción o de idioma; el
`code`, no.

La clase 040 lo lleva más lejos con errores por campo.

## 🌐 Las implementaciones — el código a la vista

Las cuatro comparten estructura: una excepción propia para los errores de
negocio, **un punto único de conversión**, y dos tratos distintos según de qué
error se trate. Ningún manejador de ruta sabe que ese punto existe.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — la firma mágica

```javascript
app.get("/roto", () => {
  throw new Error("referencia interna: secreto=abc123");
});
```

```javascript
app.use((error, peticion, respuesta, siguiente) => {
  if (error instanceof ErrorDeNegocio) {
    return respuesta.status(error.estado).type("application/problem+json").json({
      type: "about:blank",
      title: error.message,
      status: error.estado,
      code: error.codigo,
    });
  }
```

```javascript
  console.error("error no controlado:", error.message);
  respuesta.status(500).type("application/problem+json").json({
    type: "about:blank",
    title: "error interno",
    status: 500,
    code: "ERROR_INTERNO",
  });
```

**Un manejador de errores en Express se reconoce por tener cuatro argumentos.**
No hay nada más que lo declare: ni un nombre, ni un registro distinto, ni un
tipo.

Y de ahí sale el fallo más silencioso de esta clase: **quitar el `siguiente` que
no usas lo convierte en middleware normal** y deja de capturar errores, sin
ningún aviso. Un linter que sugiera eliminar parámetros sin usar puede romper el
manejo de errores de una aplicación entera.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — un manejador por tipo

```python
@app.exception_handler(ErrorDeNegocio)
async def negocio(peticion: Request, error: ErrorDeNegocio) -> JSONResponse:
```

```python
@app.exception_handler(Exception)
async def no_controlado(peticion: Request, error: Exception) -> JSONResponse:
```

**El despacho lo hace el tipo**, no un `if`. Es la diferencia de fondo con
Express: aquí no hay una función que reciba todo y clasifique — hay una función
por familia de error, y quien elige es el framework.

Añadir un tercer tipo de error es añadir un manejador, sin tocar los otros dos.
En Express es añadir una rama a un `if` que ya existe.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — un consejo para todos los controladores

```java
        @ExceptionHandler(ErrorDeNegocio.class)
        public ResponseEntity<Map<String, Object>> negocio(ErrorDeNegocio error) {
            return problema(error.getMessage(), error.estado, error.codigo);
        }
```

```java
        @ExceptionHandler(Exception.class)
        public ResponseEntity<Map<String, Object>> noControlado(Exception error) {
            System.err.println("error no controlado: " + error.getMessage());
            return problema("error interno", 500, "ERROR_INTERNO");
        }
```

Mismo despacho por tipo que FastAPI, envuelto en `@RestControllerAdvice`: una
clase aparte que **aplica a todos los controladores de la aplicación** sin que
ninguno la mencione.

Es la versión más declarativa del elenco, y la que mejor separa: el manejo de
errores es una pieza con su propio archivo, no un apéndice del arranque.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — una tubería aparte

```csharp
app.UseExceptionHandler(rama => rama.Run(async contexto =>
{
    var caracteristica = contexto.Features.Get<IExceptionHandlerFeature>();

    if (caracteristica?.Error is ErrorDeNegocio negocio)
    {
```

El modelo más distinto de los cuatro: **el camino de error es otra tubería**. La
excepción no se pasa como argumento — se recupera de una *característica* del
contexto, que es el mecanismo con el que ASP.NET Core comunica datos entre
middleware.

Y un tropiezo real que el propio código documenta:

```csharp
        contexto.Response.StatusCode = negocio.Estado;
        contexto.Response.ContentType = tipo;
        await contexto.Response.WriteAsync(JsonSerializer.Serialize(new
```

`WriteAsJsonAsync` —el atajo natural— **reescribe el `content-type` a
`application/json`** y pisa el `application/problem+json` que se acaba de poner.
Para conservarlo hay que serializar y escribir el texto a mano. Es exactamente el
tipo de detalle que solo aparece cuando un contrato comprueba la cabecera.

### Lo que las cuatro hacen igual, y es lo más importante

```javascript
  console.error("error no controlado:", error.message);
```

**El mensaje real se registra dentro; al cliente va uno genérico.** Un error no
previsto puede llevar rutas del sistema de archivos, fragmentos de consulta SQL o
un secreto en el mensaje — y devolverlo es una fuga de información, no una
cortesía.

El error de negocio sí lleva su mensaje, porque es un mensaje **escrito para el
cliente**. Esa es la distinción que la clase mide, y por eso el contrato
comprueba que `/roto` **no** contiene la cadena `secreto=abc123`.

Los cuatro responden además `application/problem+json` con la forma de RFC 9457
[@rfc9457], que la clase 040 desarrolla campo a campo.

## 🔬 Comparación

| Framework | Selección por tipo | ¿Formato por omisión aceptable? |
| --- | --- | --- |
| Spring Boot | **sí**, un método por excepción | no: es el suyo, no el tuyo |
| FastAPI | **sí**, un manejador por tipo | no |
| ASP.NET Core | manual, comprobando el tipo | trae `ProblemDetails`, se acerca |
| Express | manual, con `instanceof` | no: página HTML |

Los dos de arriba **despachan por tipo**, que es lo que permite tener tantos
manejadores como familias de error sin un `if` creciente. Los dos de abajo lo
hacen a mano, y con tres tipos de error ya se nota.

## ⚠️ Errores frecuentes

- **Devolver el mensaje de la excepción al cliente.** Fuga de información.
- **Registrar el error y no responder.** La petición se cuelga.
- **Responder 200 con un error dentro.** La clase 015 explica por qué es caro.
- **Capturar `Exception` en cada manejador.** Es lo que este mecanismo evita.
- **Registrar el manejador de errores antes que las capas** que debe cubrir.
- **Perder el identificador de correlación en el error.** Es cuando más falta
  hace: sin él, el 500 que ve el usuario no se puede unir a la línea del registro.

## ✅ Verificación

```bash
node scripts/run-class.mjs 031
```

## 🧪 Reto de transferencia

Añade el identificador de correlación de la clase 030 al cuerpo del error, como
campo `instance`, y compruébalo en el contrato. Con eso, el usuario que informa
del fallo te da el identificador y encuentras su línea en el registro sin
buscarla.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 040 — Errores por campo con RFC 9457](../../parte-3-validacion-y-contrato/040-errores-por-campo-con-rfc-9457/README.md)
- [Módulo 05 — Backend y API](../../../curriculum/05-backend-y-api.md)

## Fuentes

- [@rfc9457] Nottingham, M.; Wilde, E.; Dalal, S. *Problem Details for HTTP APIs*, RFC 9457, IETF, 2023 — <https://www.rfc-editor.org/rfc/rfc9457>
- [@owasp-top10] *OWASP Top 10*, OWASP Foundation — <https://owasp.org/www-project-top-ten/>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
