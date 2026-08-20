# Clase 047 — Idempotencia

> [⬅️ 046](../046-filtrado-y-ordenacion/README.md) · [📚 Parte 3](../README.md) · [🎓 Clases](../../README.md) · [048 ➡️](../048-etags-y-cache-condicional/README.md)
>
> Parte **3 — Validación y contrato** · Nivel **🔴 avanzado** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Hacer que **reintentar no duplique**, en una operación que por naturaleza no es
idempotente. La clase 014 explicó que `POST` no lo es; esta lo arregla.

## 🧩 El problema, en concreto

Un cliente envía `POST /pagos`. La respuesta se pierde por un corte de red. **El
cliente no sabe si el pago se hizo.**

Sus dos opciones son igual de malas:

- **Reintentar** → posible cobro doble.
- **No reintentar** → posible pago que no se hizo.

No hay forma de resolverlo desde el cliente. **Tiene que resolverlo el servidor**,
y la herramienta es una clave que el cliente genera y repite en el reintento.

## 🧩 La situación

Tres peticiones `POST` idénticas con la misma clave de idempotencia crean **una
sola tarea**. Sin clave, cada `POST` crea otra.

## 📖 Cómo funciona

```text
POST /tareas
Idempotency-Key: abc-123
```

- **Primera vez con esa clave** → se ejecuta, se guarda la respuesta.
- **Otra vez con la misma clave** → se devuelve **la misma respuesta**, sin
  ejecutar nada.

Lo importante es qué se devuelve: **el mismo código y el mismo cuerpo**, no un
409 ni un «ya existe». Para el cliente, el reintento tiene que ser
indistinguible del primer intento — esa es toda la propuesta.

Y la cabecera `Idempotent-Replay: true` permite distinguirlo a quien quiera
saberlo, sin obligar a nadie.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `POST` con clave `abc-123` | `201` · `id: "1"` |
| **el mismo** otra vez | `201` · `id: "1"` — sin crear otra |
| igual | `idempotent-replay: true` |
| `GET /tareas` tras tres envíos | `total: 1` |
| `POST` con clave `def-456` | `201` · `id: "2"` |
| `POST` **sin clave** | `201` · `id: "3"` |

El cuarto caso es la prueba real: **tres peticiones idénticas, una sola tarea**.
Y el último confirma que sin clave, `POST` vuelve a comportarse como `POST` — la
idempotencia es opcional y la pide el cliente.

## 🌐 Las implementaciones

Las cuatro guardan la respuesta emitida indexada por la clave, y la devuelven tal
cual en el reintento. La diferencia está en **cómo escriben en ese registro**, y
no es un detalle de estilo.

### El detalle que separa una implementación correcta de una que parece correcta

```java
// Spring — atómico
Map<String, String> creada = respuestas.computeIfAbsent(clave, k -> crear(texto));
```

```csharp
// ASP.NET Core — atómico
var creada = respuestas.GetOrAdd(clave, _ => Crear(titulo));
```

Frente a la versión ingenua:

```javascript
if (!respuestas.has(clave)) {      // ← dos peticiones pueden estar aquí a la vez
  respuestas.set(clave, crear());  // ← y las dos crean
}
```

**Entre comprobar y escribir hay un hueco.** Dos reintentos simultáneos —que es
justo lo que pasa cuando un cliente reintenta agresivamente— pueden pasar los dos
por el `if` antes de que ninguno escriba, y crear dos veces.

Es exactamente el fallo que la idempotencia venía a cerrar, reproducido dentro de
su implementación. Y solo aparece bajo concurrencia, así que las pruebas
secuenciales no lo ven.

En una base de datos, la forma correcta es una **restricción de unicidad sobre la
clave**: el segundo intento falla al insertar y se recupera la respuesta
guardada. La atomicidad la garantiza el motor, no tu código.

## 🔬 Comparación

| Framework | Escritura en el registro | ¿Segura con reintentos simultáneos? |
| --- | --- | --- |
| Spring Boot | `computeIfAbsent` | **sí**, atómica |
| ASP.NET Core | `GetOrAdd` | **sí**, atómica |
| FastAPI | asignación en un diccionario | dentro de un proceso |
| Express | asignación en un mapa | dentro de un proceso |

Los dos de abajo no tienen carrera **dentro del proceso** porque el modelo es de
un solo hilo. Esa protección desaparece con varios trabajadores, que es lo normal
en producción.

## ⚠️ Lo que este código no resuelve

```javascript
const respuestas = new Map();
```

Un mapa en memoria. Con dos instancias, **cada una tiene su propio registro** y un
reintento que caiga en la otra crea un duplicado.

Es la misma conclusión que la clase 034 con los cupos: **el estado que tiene que
ser único no puede vivir en el proceso**. En producción va a un almacén
compartido, con caducidad —24 horas es lo habitual— porque guardar todas las
claves para siempre no es viable.

Y hay una decisión más que este código no toma: **qué hacer si llega la misma
clave con un cuerpo distinto**. Lo correcto es responder `422`: la clave promete
que es el mismo intento, y un cuerpo distinto dice que no lo es. Devolver la
respuesta antigua sería mentir.

## 🧭 Cuándo hace falta

No siempre. La pregunta es **qué cuesta un duplicado**:

| Operación | Duplicado | ¿Hace falta? |
| --- | --- | --- |
| Cobrar | dinero real | **sí** |
| Enviar un correo | dos correos | sí |
| Crear un pedido | dos pedidos | sí |
| Registrar una métrica | ruido | no |
| Crear un borrador | uno de más | probablemente no |

Y hay una alternativa más barata cuando encaja: **hacer la operación idempotente
por diseño**. `PUT /tareas/{id}` con el identificador generado por el cliente no
necesita claves — repetirlo escribe lo mismo. Es la lección de la clase 014, y
cuando se puede aplicar, evita toda esta maquinaria.

## ⚠️ Errores frecuentes

- **Comprobar y escribir sin atomicidad.** El fallo dentro de la solución.
- **Devolver 409 en el reintento.** El cliente no puede distinguir su reintento
  de un conflicto real.
- **Guardar solo «ya se hizo» y no la respuesta.** El cliente reintenta y no
  recibe los datos que necesitaba.
- **Claves sin caducidad.** El registro crece sin límite.
- **Aceptar la misma clave con otro cuerpo.**
- **Estado en memoria con varias instancias.**

## ✅ Verificación

```bash
node scripts/run-class.mjs 047
```

## 🧪 Reto de transferencia

Añade el caso «misma clave, cuerpo distinto → 422» al contrato e impleméntalo en
las cuatro. Requiere guardar también un resumen del cuerpo junto a la respuesta,
y es lo que convierte esta implementación en una utilizable de verdad.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 014 — Verbos HTTP y su semántica](../../parte-1-responder/014-verbos-http-y-su-semantica/README.md)
- [Clase 112 — Reintentos e idempotencia](../../parte-8-tiempo-real-y-segundo-plano/112-reintentos-e-idempotencia/README.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
