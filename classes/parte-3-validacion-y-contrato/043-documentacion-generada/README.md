# Clase 043 — Documentación generada

> [⬅️ 042](../042-un-esquema-tres-usos/README.md) · [📚 Parte 3](../README.md) · [🎓 Clases](../../README.md) · [044 ➡️](../044-versionado-de-api/README.md)
>
> Parte **3 — Validación y contrato** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Publicar una descripción de la API **y comprobar que coincide con el
comportamiento real**. La segunda mitad es la que casi nunca se hace.

## 🧩 La situación

`GET /openapi.json` describe dos rutas con sus códigos —201, 422, 200, 404— y el
contrato **ejecuta esas cuatro respuestas** para comprobar que existen de verdad.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /openapi.json` | declara `/tareas` y `/tareas/{id}` |
| igual | declara `"201"`, `"422"` y `"404"` |
| `POST /tareas` válido | `201` — el documentado |
| `POST /tareas` inválido | `422` — el documentado |
| `GET /tareas/no-existe` | `404` — el documentado |
| `GET /tareas/1` | `200` — el documentado |

**Esa segunda mitad es la aportación de la clase.** Un documento que declara un
404 que el servidor no devuelve nunca es tan inútil como uno que no lo declara.

## 🌐 Las implementaciones

### El límite de «generado»

```java
@GetMapping("/tareas/{id}")
@ApiResponses({
        @ApiResponse(responseCode = "200", description = "La tarea"),
        @ApiResponse(responseCode = "404", description = "No existe"),
})
```

Fíjate en que el 404 **hay que declararlo**. springdoc documenta por su cuenta el
código de éxito porque está en la firma; el 404 vive dentro de un `if`, y
**ninguna herramienta lee la lógica del método**.

Es la frontera exacta de lo que significa documentación generada:

> Se genera lo que está en **la firma y las anotaciones**. Lo que hace el cuerpo,
> no.

Lo mismo en FastAPI con `responses={404: ...}` y en ASP.NET Core con
`.Produces(404)`.

### Express — la que puede mentir

```javascript
const DOCUMENTO = {
  openapi: "3.1.0",
  paths: { "/tareas": { post: { responses: { 201: {}, 422: {} } } } },
};
```

Express no genera nada: no hay tipos ni esquemas de los que derivar. El documento
está **escrito a mano**, y por eso esta implementación es la que mejor enseña la
clase — es la única que puede divergir.

Está deliberadamente **al lado de las rutas** para reducir la distancia. En un
proyecto real vive en otro archivo, y esa distancia es la que produce la
divergencia.

## 🔬 Comparación

| Framework | Documento | ¿Qué documenta solo? | ¿Qué hay que declarar? |
| --- | --- | --- | --- |
| FastAPI | derivado | rutas, entrada, salida, código de éxito | los códigos de error |
| Spring Boot | derivado | igual | igual |
| ASP.NET Core | derivado | igual | igual |
| Express | **a mano** | nada | todo |

## 🧭 Documentación de referencia, no manual

Lo que estas cuatro publican es **referencia**: rutas, formas, códigos. Es
imprescindible y no es suficiente.

Lo que no cabe en un documento generado:

- **Por qué** existe esta operación y cuándo usarla.
- **Qué garantías** ofrece: ¿es idempotente? ¿se lee lo que se acaba de escribir?
- **Secuencias**: primero crea la sesión, luego el pago.
- **Límites operativos**: cupos, tamaños, plazos.

Confundir referencia con documentación completa es el error habitual: se publica
el documento generado y se declara la API documentada. El resultado es una
referencia impecable de una API que nadie sabe usar.

## ⚠️ Errores frecuentes

- **No declarar los códigos de error.** El documento anuncia solo el camino feliz.
- **Escribir el documento a mano** teniendo tipos de los que derivarlo.
- **Publicarlo y no verificarlo.** Es lo que este contrato añade.
- **Exponer el documento de desarrollo en producción** con rutas internas dentro.
- **Creer que la referencia es la documentación.**

## ✅ Verificación

```bash
node scripts/run-class.mjs 043
```

## 🧪 Reto de transferencia

Añade una ruta **sin declararla** en el documento de Express y comprueba que el
contrato **no lo detecta**. Después añade un caso que compare la lista de rutas
reales con las documentadas. Ese caso es la diferencia entre publicar
documentación y garantizarla.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 049 — El contrato como prueba](../049-el-contrato-como-prueba/README.md)
- [Módulo 05 — Backend y API](../../../curriculum/05-backend-y-api.md)

## Fuentes

- [@openapi-spec] *OpenAPI Specification* v3.1, OpenAPI Initiative — <https://spec.openapis.org/oas/v3.1.0.html>
- [@jin-sahni-designing-web-apis] Jin, Brenda; Sahni, Saurabh; Shevat, Amir. *Designing Web APIs*. O'Reilly Media, 2018. ISBN 9781492026921 — <https://openlibrary.org/isbn/9781492026921>
- [@geewax-api-design-patterns] Geewax, JJ. *API Design Patterns*. Manning, 2021. ISBN 9781617295850 — <https://openlibrary.org/isbn/9781617295850>
