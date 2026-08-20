# Clase 018 — Negociación de contenido

> [⬅️ 017](../017-cuerpo-json-recibir-y-devolver/README.md) · [📚 Parte 1](../README.md) · [🎓 Clases](../../README.md) · [019 ➡️](../019-redirecciones/README.md)
>
> Parte **1 — Responder** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Servir la representación que el cliente pide, y **declararlo** para que ninguna
caché sirva la equivocada.

## 🧩 La situación

`GET /tareas/1` devuelve JSON si el cliente pide `application/json` y HTML si
pide `text/html`. Si pide algo que no sabes servir, **406**. Y en todos los casos
la respuesta lleva `Vary: Accept`.

## 📖 Por qué `Vary` no es opcional

Una caché guarda respuestas indexadas por URL. Si dos clientes piden
`/tareas/1` y uno quiere JSON y el otro HTML, **la caché serviría al segundo lo
que guardó del primero**.

`Vary: Accept` le dice a la caché que esa URL tiene varias representaciones y que
debe guardarlas por separado según la cabecera `Accept` [@rfc9111]. Sin ella, la
negociación funciona en desarrollo —donde no hay caché— y falla en producción.

Es un fallo especialmente desagradable porque **es intermitente**: depende de
quién pidió primero.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `accept: application/json` | `200` · `content-type: application/json` |
| `accept: text/html` | `200` · `content-type: text/html` |
| cualquiera | `vary` contiene `accept` |
| `accept: application/pdf` | `406` |
| `accept: */*` | `200` · JSON (la representación por omisión) |

## 🌐 Las implementaciones

### Express — negociación incorporada

```javascript
respuesta.format({
  "application/json": () => respuesta.json(tarea),
  "text/html": () => respuesta.type("text/html").send(`<h1>${tarea.titulo}</h1>`),
  default: () => respuesta.status(406).json({ error: "no puedo servir ese tipo" }),
});
```

`format` hace tres cosas a la vez: elige según `Accept`, **emite `Vary`
automáticamente** y llama a `default` si nada encaja. Es de las pocas veces en
que Express trae resuelto algo no trivial.

### FastAPI — negociación a mano

```python
def preferido(accept: str) -> str | None:
    """Elige el primer tipo admitido según el orden y la calidad declarados."""
```

Starlette **no negocia**: expone la cabecera y deja la decisión a la aplicación.
Por eso esta implementación es la más larga con diferencia — hay que analizar los
valores de calidad (`q=`) y los comodines a mano.

Es una decisión coherente con su diseño de capa mínima, y es trabajo que en
Express y Spring viene hecho.

### Spring Boot — dos métodos, misma ruta

```java
@GetMapping(value = "/tareas/1", produces = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<Map<String, String>> json() { ... }

@GetMapping(value = "/tareas/1", produces = MediaType.TEXT_HTML_VALUE)
public ResponseEntity<String> html() { ... }
```

**El enfoque más declarativo de los cuatro.** Cada método declara qué sabe
producir y Spring elige; si ninguno encaja, emite el 406 por su cuenta. El
`Vary`, en cambio, hay que ponerlo.

### ASP.NET Core — decisión explícita

```csharp
if (accept.Contains("application/json") || accept.Contains("*/*")) { ... }
```

Las API mínimas no negocian. Los controladores MVC de ASP.NET Core sí tienen
formateadores de salida configurables, pero eso ya es otra capa.

## 🔬 Comparación

| Framework | ¿Negocia solo? | ¿`Vary` automático? | ¿406 automático? |
| --- | --- | --- | --- |
| Express | **sí**, con `format` | **sí** | sí, con `default` |
| Spring Boot | **sí**, con `produces` | no | **sí** |
| FastAPI | no | no | no |
| ASP.NET Core | no en API mínimas | no | no |

Dos de cuatro negocian y **solo uno emite `Vary` por su cuenta**. Es la cabecera
que más se olvida del programa, y la que produce el fallo más difícil de
reproducir.

## ⚠️ Errores frecuentes

- **Olvidar `Vary: Accept`.** Funciona sin caché y falla con ella.
- **Ignorar los valores de calidad.** `Accept: text/html;q=0.9, application/json`
  prefiere JSON aunque HTML aparezca antes.
- **Tratar `*/*` como error.** Casi todos los clientes lo envían; significa
  «dame lo que quieras».
- **Devolver 200 con un tipo que el cliente no pidió.** El 406 existe para eso.

## ✅ Verificación

```bash
node scripts/run-class.mjs 018
```

## 🧪 Reto de transferencia

Añade `text/csv` como tercera representación y comprueba qué implementación
necesita menos cambios. La respuesta te dice cuál escala mejor cuando el número
de formatos crece.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 048 — ETags y caché condicional](../../parte-3-validacion-y-contrato/048-etags-y-cache-condicional/README.md)
- [Módulo 01 — HTTP, eventos y contratos](../../../curriculum/01-http-eventos-y-contratos.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@rfc9111] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Caching*, RFC 9111, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9111>
- [@grigorik-hpbn] Grigorik, Ilya. *High Performance Browser Networking*. O'Reilly Media, 2013. ISBN 9781449344764 — <https://openlibrary.org/isbn/9781449344764>
