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

## 🌐 Las implementaciones

Las cuatro comparten estructura: una excepción propia para los errores de
negocio, un punto único de conversión, y dos tratos distintos según de qué error
se trate. El código completo está en [`implementaciones/`](implementaciones/).

### Dónde vive el manejador

```javascript
// Express — se reconoce por tener CUATRO argumentos. Firma mágica.
app.use((error, peticion, respuesta, siguiente) => { ... });
```

```python
# FastAPI — un manejador por tipo de excepción
@app.exception_handler(ErrorDeNegocio)
async def negocio(peticion, error): ...

@app.exception_handler(Exception)
async def no_controlado(peticion, error): ...
```

```java
// Spring Boot — @RestControllerAdvice aplica a TODOS los controladores
@RestControllerAdvice
public static class Errores {
    @ExceptionHandler(ErrorDeNegocio.class) ...
    @ExceptionHandler(Exception.class) ...
}
```

```csharp
// ASP.NET Core — una tubería aparte para el camino de error
app.UseExceptionHandler(rama => rama.Run(async contexto => { ... }));
```

**Cuatro mecanismos, la misma idea:** un punto único donde una excepción se
convierte en respuesta, y ningún manejador de ruta tiene que saberlo.

La firma de cuatro argumentos de Express es la más peculiar: no hay nada en el
código que diga «esto es un manejador de errores» salvo el número de parámetros.
Quitar el `siguiente` que no usas **lo convierte en middleware normal** y deja de
capturar errores, sin ningún aviso.

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
