# Clase 040 — Errores por campo con RFC 9457

> [⬅️ 039](../039-validar-la-entrada/README.md) · [📚 Parte 3](../README.md) · [🎓 Clases](../../README.md) · [041 ➡️](../041-esquemas/README.md)
>
> Parte **3 — Validación y contrato** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Decir **qué campo falló y por qué**, en formato estándar, y **todos a la vez**.

## 🧩 La situación

Un cuerpo con dos campos mal produce **un solo 422 con los dos errores dentro**,
cada uno con su campo y su código estable.

## 📖 Por qué todos a la vez

Un servidor que informa solo del primer error obliga a un viaje por campo. Con un
formulario de cinco campos mal rellenados: cinco envíos, cinco esperas, y una
persona que corrige a ciegas.

Es un fallo de producto más que de código, y se arregla en el servidor:
**acumular** en lugar de devolver al primer fallo.

## 📖 El formato, y por qué `code` importa más que `title`

```json
{
  "type": "about:blank",
  "title": "la entrada no es válida",
  "status": 422,
  "code": "VALIDACION",
  "errors": [
    { "campo": "titulo", "codigo": "REQUERIDO", "detalle": "no puede estar vacío" },
    { "campo": "prioridad", "codigo": "VALOR", "detalle": "debe ser 1, 2 o 3" }
  ]
}
```

`type`, `title` y `status` son del estándar [@rfc9457]; `code` y `errors` son
extensiones, que el propio estándar contempla.

La distinción clave está entre `title`/`detalle` y `code`/`codigo`:

| Campo | Para quién | ¿Estable? |
| --- | --- | --- |
| `title`, `detalle` | personas | **no**: cambia de redacción y de idioma |
| `code`, `codigo` | programas | **sí**: es el contrato |

Un cliente que hace `if (error.detalle === "no puede estar vacío")` se rompe en
cuanto alguien mejora la frase o traduce la API. Con `codigo === "REQUERIDO"`, no.

## 🔍 Lo que el contrato de esta clase decidió no comprobar

La primera versión exigía también el texto de `detalle`. **FastAPI falló**, y con
razón: Pydantic redacta sus mensajes en inglés —«String should have at least 1
character»— y traducirlos uno a uno sería reescribir la biblioteca.

La conclusión es la misma que enseña el estándar: **el texto legible es de cada
framework; el código es del contrato**. El contrato comprueba ahora `campo` y
`codigo`, y deja que cada implementación redacte el detalle en sus palabras.

Fue necesaria una aserción nueva en el verificador —comparación por
subconjunto— para poder exigir parte de un objeto sin exigirlo entero.

## 🧮 El contrato

| Cuerpo | Respuesta |
| --- | --- |
| `{"titulo":"válida"}` | `201` |
| `{"titulo":""}` | `422` en `application/problem+json` |
| igual | `errors[0]` = campo `titulo`, código `REQUERIDO` |
| título de 129 caracteres | código `LONGITUD` — **no** `REQUERIDO` |
| `{"titulo":"","prioridad":9}` | **dos** errores, en orden |

El cuarto caso separa dos motivos que suelen colapsarse en «inválido». Un cliente
que recibe `LONGITUD` puede recortar; uno que recibe «inválido» solo puede
adivinar.

## 🌐 Las implementaciones

### FastAPI — los errores ya vienen acumulados

```python
for detalle in error.errors():
    ubicacion = [str(x) for x in detalle["loc"] if x != "body"]
    errores.append({"campo": ".".join(ubicacion) or "cuerpo",
                    "codigo": CODIGOS.get(detalle["type"], "INVALIDO")})
```

Pydantic devuelve **todos** los errores con su ubicación exacta y un tipo
identificable. Lo único que hay que hacer es traducir su vocabulario al tuyo — el
diccionario `CODIGOS` de cinco entradas.

Para estructuras anidadas, `loc` da la ruta completa: `("body","items",0,"nombre")`
se convierte en `items.0.nombre`. Ningún otro de los cuatro lo da tan hecho.

### Spring Boot — y la limitación de las anotaciones estándar

```java
@NotBlank(message = "REQUERIDO|no puede estar vacio")
```

`getFieldErrors()` devuelve todos los campos que fallaron. Pero las anotaciones
de validación estándar **solo tienen un hueco para el mensaje**: no hay un campo
para un código de error.

De ahí el apaño de codificarlo dentro del propio mensaje. Funciona y es feo, y
decirlo importa: en un proyecto real se define una anotación propia con su campo
de código, que es más trabajo del que parece.

### Express y ASP.NET Core — acumular a mano

```javascript
const errores = [];
if (...) errores.push({ campo: "titulo", codigo: "REQUERIDO", ... });
if (...) errores.push({ campo: "prioridad", codigo: "VALOR", ... });
```

Sin mecanismo que acumule por ti, el patrón es explícito: **una lista, y `push`
en lugar de `return`**. Es la diferencia de una letra entre informar de un error e
informar de todos, y es el error más común de esta clase.

## 🔬 Comparación

| Framework | ¿Acumula solo? | ¿Ubicación anidada? | Código estable |
| --- | --- | --- | --- |
| FastAPI | **sí** | **sí**, ruta completa | traduciendo el tipo |
| Spring Boot | **sí** | sí, por campo | dentro del mensaje |
| ASP.NET Core | con `Validator` | limitada | a mano |
| Express | no | no | a mano |

## ⚠️ Errores frecuentes

- **Devolver solo el primer error.** Un viaje por campo.
- **Comparar el texto legible en el cliente.** Se rompe al reescribir la frase.
- **Un solo código para todo.** «Inválido» no le dice al cliente qué corregir.
- **Filtrar el nombre interno del campo.** `usr_tbl_ttl` le dice al atacante cómo
  se llama tu columna.
- **Usar 400 en vez de 422.** El cuerpo se entendió: lo que falla es su contenido.

## ✅ Verificación

```bash
node scripts/run-class.mjs 040
```

## 🧪 Reto de transferencia

Acepta un array de tareas y devuelve errores con la posición dentro:
`errors[0].campo === "tareas.2.titulo"`. En FastAPI sale casi solo; en los otros
tres hay que construir la ruta. Compara cuánto código cuesta en cada uno.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 031 — Manejo centralizado de errores](../../parte-2-la-tuberia/031-manejo-centralizado-de-errores/README.md)
- [Módulo 05 — Backend y API](../../../curriculum/05-backend-y-api.md)

## Fuentes

- [@rfc9457] Nottingham, M.; Wilde, E.; Dalal, S. *Problem Details for HTTP APIs*, RFC 9457, IETF, 2023 — <https://www.rfc-editor.org/rfc/rfc9457>
- [@jin-sahni-designing-web-apis] Jin, Brenda; Sahni, Saurabh; Shevat, Amir. *Designing Web APIs*. O'Reilly Media, 2018. ISBN 9781492026921 — <https://openlibrary.org/isbn/9781492026921>
- [@geewax-api-design-patterns] Geewax, JJ. *API Design Patterns*. Manning, 2021. ISBN 9781617295850 — <https://openlibrary.org/isbn/9781617295850>
