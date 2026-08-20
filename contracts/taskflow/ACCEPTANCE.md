# Pruebas de aceptación de TaskFlow

Este documento **describe** el examen. El examen en sí es ejecutable y vive en
[`acceptance.test.mjs`](acceptance.test.mjs): 20 casos que solo hablan HTTP y se
lanzan sin modificación contra cualquier implementación, en cualquier lenguaje.

```bash
node scripts/run-acceptance.mjs                       # lista los destinos
node scripts/run-acceptance.mjs reference-node        # referencia sin framework
node scripts/run-acceptance.mjs express --prepare     # instala y prueba
node scripts/run-acceptance.mjs --url http://host:puerto
```

> Si una implementación necesita que se cambie una de estas pruebas para pasar,
> la comparación entre ecosistemas deja de significar nada. Cambiar el examen
> para que apruebe un candidato es la falta crítica del programa.

## Los 20 casos

| # | Caso | Petición | Respuesta esperada |
| ---: | --- | --- | --- |
| 1 | Salud | `GET /health` | `200` y `{"status":"ok"}` |
| 2 | Colección | `GET /tasks` | `200` con `items` como arreglo |
| 3 | Crear | `POST /tasks` válido con clave | `201`, cabecera `Location`, tarea con `id`, `title`, `completed:false`, `createdAt` |
| 4 | Recorte | título con espacios alrededor | el título se guarda recortado |
| 5 | Recuperar | `GET` sobre el `Location` devuelto | `200` con la misma tarea |
| 6 | Idempotencia | repetir cuerpo y clave | `200`, mismo `id`, **una sola** tarea en la colección |
| 7 | Conflicto | misma clave, cuerpo distinto | `409` `IDEMPOTENCY_KEY_REUSED` |
| 8 | Sin clave | `POST` sin `Idempotency-Key` | `400` `IDEMPOTENCY_KEY_REQUIRED` |
| 9 | Clave en blanco | clave con solo espacios | `400` `IDEMPOTENCY_KEY_REQUIRED` |
| 10 | Título vacío | `title` con solo espacios | `422` con `errors[].field == "title"` y `code == "TITLE_EMPTY"` |
| 11 | Título ausente | cuerpo `{}` | `422` con `TITLE_REQUIRED` |
| 12 | Título no textual | `{"title": 42}` | `422` con `TITLE_REQUIRED` |
| 13 | Título largo | 121 caracteres | `422` con `TITLE_TOO_LONG` |
| 14 | Límite inclusivo | 120 caracteres exactos | `201` |
| 15 | JSON roto | cuerpo no analizable | `400` `MALFORMED_JSON`, nunca `500` |
| 16 | Tipo de contenido | `Content-Type: text/plain` | `415` `UNSUPPORTED_MEDIA_TYPE` |
| 17 | Cuerpo grande | por encima de 64 KiB | `413` `BODY_TOO_LARGE` **y el servicio sigue sano** |
| 18 | Tarea ausente | `GET /tasks/{id}` desconocido | `404` `TASK_NOT_FOUND` |
| 19 | Ruta ausente | ruta que no existe | `404` `ROUTE_NOT_FOUND` |
| 20 | Método | `DELETE /tasks` | `405` `METHOD_NOT_ALLOWED` con cabecera `Allow` |

## Comprobación transversal de todo error

Cada respuesta de error de la tabla pasa además por la misma verificación. Un
error con el código correcto y el sobre equivocado **también incumple**:

1. viaja como `application/problem+json`;
2. lleva los cuatro miembros obligatorios: `type`, `title`, `status`, `code`;
3. `type` es un URI resoluble y `status` coincide con el código HTTP;
4. **no filtra el interior**: ni traza, ni `node_modules`, ni rutas del sistema
   de archivos, ni consultas SQL.

El punto 4 se comprueba por expresión regular sobre el cuerpo serializado. Es la
prueba que sobrevive a un cambio de framework: da igual qué lo genere, si aparece
una traza en la respuesta, falla.

## Por qué `errors[]` por campo

Un `422` que solo dice «datos inválidos» impide construir una interfaz
accesible: sin saber **qué** campo falló, el formulario no puede asociar el
mensaje al control correspondiente ni mover el foco hasta él. Por eso el contrato
lo exige y por eso hay cuatro casos (10 a 13) dedicados a comprobarlo.

## Desviaciones declaradas

Una implementación puede cumplir el contrato con un mecanismo distinto, siempre
que lo **declare**. Las conocidas hoy:

| Implementación | Desviación | Efecto |
| --- | --- | --- |
| Spring Boot | El límite de 64 KiB se comprueba después de que el contenedor haya leído el cuerpo | Mismo código de respuesta; menor protección de memoria que la referencia |

Una desviación declarada es información útil sobre el ecosistema. Una desviación
silenciosa es un fallo de la comparación.
