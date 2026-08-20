# Clase 017 — Cuerpo JSON: recibir y devolver

> [⬅️ 016](../016-cabeceras-leer-y-escribir/README.md) · [📚 Parte 1](../README.md) · [🎓 Clases](../../README.md) · [018 ➡️](../018-negociacion-de-contenido/README.md)
>
> Parte **1 — Responder** · Nivel **🟢 introductorio** · Pista **`backend`**
>
> ✅ **Clase construida** — 10 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Deserializar la entrada y serializar la salida **sin sorpresas**, y distinguir
dos fallos que casi todo el mundo mezcla: el cuerpo que **no se puede leer** y el
cuerpo que **se lee pero no sirve**.

## 📚 Resultados de aprendizaje

1. Recibir y devolver JSON en diez frameworks.
2. Justificar por qué `400` y `422` son errores distintos.
3. Reconocer qué frameworks analizan el cuerpo por omisión y cuáles no.

## 🧩 La situación

`POST /tareas` con `{"titulo":"leer el módulo 05"}` responde `201` con el recurso
creado.

- Cuerpo ilegible (`{esto no es json`) → **400**, «cuerpo JSON mal formado».
- Cuerpo legible sin `titulo` → **422**, «titulo es obligatorio».

## 📖 400 frente a 422

La distinción está en el estándar y no es cosmética [@rfc9110]:

| Código | Qué dice | Ejemplo |
| --- | --- | --- |
| **400 Bad Request** | No pude **interpretar** lo que enviaste | JSON con una llave sin cerrar |
| **422 Unprocessable Content** | Lo interpreté bien; su **contenido** no vale | JSON válido sin el campo obligatorio |

Por qué importa al cliente: ante un **400**, reintentar con el mismo cuerpo no
tiene sentido — está roto. Ante un **422**, el cliente sabe que su formato es
correcto y que le falta un dato concreto. Son dos acciones correctivas distintas,
y devolver 400 para ambos las borra.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `{"titulo":"leer el módulo 05"}` | `201` · `{"id":"1","titulo":"...","completada":false}` |
| cualquiera válida | `content-type: application/json` |
| `{esto no es json` | `400` · `{"error":"cuerpo JSON mal formado"}` |
| `{"otra_cosa":1}` | `422` · `{"error":"titulo es obligatorio"}` |
| `{"titulo":""}` | `422` |
| válida | `completada` es el booleano `false`, no la cadena `"false"` |

El último caso parece trivial y no lo es: **algunos serializadores convierten
booleanos y números a texto** si el modelo está mal declarado. El cliente que
haga `if (tarea.completada)` verá `"false"` como verdadero.

## 🌐 Las implementaciones

### Express — analizar no viene puesto

```javascript
app.use(express.json());   // sin esta línea, peticion.body es undefined
```

Express **no analiza el cuerpo por omisión**. Es coherente con su filosofía de
framework mínimo, y es la causa del error más frecuente de quien empieza:
`peticion.body` indefinido sin explicación.

Y hay un segundo detalle: sin el manejador de errores del final, un JSON mal
formado produce **una página HTML de error**, no JSON. Un cliente que espere JSON
se atraganta con el `<!DOCTYPE`.

### Fastify — analizar sí viene puesto

```javascript
const app = Fastify();   // JSON analizado, y 400 automático si está roto
```

Comportamiento opuesto con la misma API. Es un buen recordatorio de que
**parecerse en la superficie no es comportarse igual**.

### FastAPI — el modelo es el contrato

```python
class Cuerpo(BaseModel):
    titulo: str = Field(min_length=1)

@app.post("/tareas", status_code=201)
def crear(cuerpo: Cuerpo) -> dict[str, object]:
    return {"id": "1", "titulo": cuerpo.titulo, "completada": False}
```

El manejador **no valida nada**: recibe un objeto que ya cumple. Pero hubo que
añadir un manejador de excepciones, y la razón enseña algo:

> FastAPI devuelve **422 para los dos casos** —JSON ilegible y JSON incompleto—
> porque los trata a ambos como fallos de validación de la petición.

Es defendible y borra la distinción del contrato. El manejador mira el tipo de
error de Pydantic y separa uno de otro. **El framework más declarativo de los
diez necesitó código extra para cumplir el estándar con precisión.**

### Spring Boot — dos caminos, dos excepciones

```java
@ExceptionHandler(HttpMessageNotReadableException.class)
public ResponseEntity<Map<String, String>> ilegible() { ... }
```

Spring separa los dos casos con excepciones distintas, lo que hace natural darles
respuestas distintas. Sin el manejador, el 400 sale con el formato de error de
Spring y no con el del contrato.

### ASP.NET Core — lectura manual a propósito

```csharp
cuerpo = await JsonSerializer.DeserializeAsync<JsonElement>(peticion.Body);
```

Con enlace automático a un tipo, ASP.NET Core devuelve **400 en ambos casos**,
igual que FastAPI con el opuesto. Leer el cuerpo a mano recupera la distinción.

### Laravel, Rails y Gin — leer el contenido crudo

```php
$cuerpo = json_decode($peticion->getContent(), true);
if (json_last_error() !== JSON_ERROR_NONE) { /* 400 */ }
```

Los tres hacen lo mismo por la misma razón: sus ayudantes de alto nivel
(`$peticion->json()`, el analizador de Rails, `c.ShouldBindJSON`) **confunden el
cuerpo ilegible con el cuerpo vacío**. Ir al contenido crudo es la única forma de
distinguirlos.

## 🔬 Comparación

| Framework | ¿Analiza por omisión? | ¿Distingue 400 de 422 solo? | Código extra |
| --- | --- | --- | --- |
| Fastify | **sí** | sí, 400 automático | manejador de errores |
| Spring Boot | sí | **sí**, excepciones distintas | un manejador |
| Express | **no** | no | middleware + manejador |
| FastAPI | sí | **no**, 422 para ambos | manejador que los separa |
| Flask | con `get_json` | con `silent=True` | ninguno |
| Django | no | manual | ninguno |
| ASP.NET Core | sí, con enlace | **no**, 400 para ambos | lectura manual |
| Laravel | sí | no | lectura cruda |
| Rails | sí | no | lectura cruda |
| Gin | con enlace | no | lectura cruda |

La conclusión más útil de esta tabla no es cuál gana:

**Casi ningún framework distingue por sí solo estos dos errores.** Ocho de diez
necesitan código explícito. Los valores por omisión están pensados para el caso
normal —«algo va mal con la petición»— y esa simplificación es razonable hasta
que tu API tiene clientes que necesitan saber si reintentar.

Que sea **trabajo tuyo** es exactamente lo que había que aprender.

## ⚠️ Errores frecuentes

- **Olvidar `express.json()`.** `peticion.body` indefinido sin ninguna pista.
- **Devolver HTML al fallar el análisis.** El cliente esperaba JSON.
- **Usar 400 para todo.** El cliente pierde la información de si reintentar.
- **Serializar booleanos como cadenas.** `"false"` es verdadero en casi todos los
  lenguajes del cliente.
- **Aceptar cuerpos sin límite de tamaño.** La clase 033 lo trata; sin límite, un
  cuerpo enorme agota la memoria.

## ✅ Verificación

```bash
node scripts/run-class.mjs 017
```

## 🧪 Reto de transferencia

Haz que la respuesta incluya `creada`, con la fecha en formato ISO 8601 y zona
UTC. Compara cómo serializa fechas cada framework por omisión: vas a encontrar al
menos tres formatos distintos, y esa divergencia es una de las causas más comunes
de que un cliente rompa al cambiar de servidor.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 040 — Errores por campo con RFC 9457](../../parte-3-validacion-y-contrato/040-errores-por-campo-con-rfc-9457/README.md)
- [Módulo 05 — Backend y API](../../../curriculum/05-backend-y-api.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@rfc8259] Bray, T. *The JavaScript Object Notation (JSON) Data Interchange Format*, RFC 8259, IETF, 2017 — <https://www.rfc-editor.org/rfc/rfc8259>
- [@jin-sahni-designing-web-apis] Jin, Brenda; Sahni, Saurabh; Shevat, Amir. *Designing Web APIs*. O'Reilly Media, 2018. ISBN 9781492026921 — <https://openlibrary.org/isbn/9781492026921>
