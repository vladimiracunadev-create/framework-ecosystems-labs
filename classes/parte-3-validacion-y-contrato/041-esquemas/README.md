# Clase 041 — Esquemas

> [⬅️ 040](../040-errores-por-campo-con-rfc-9457/README.md) · [📚 Parte 3](../README.md) · [🎓 Clases](../../README.md) · [042 ➡️](../042-un-esquema-tres-usos/README.md)
>
> Parte **3 — Validación y contrato** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Declarar la forma de los datos **como dato**, no como código. Y ver la
consecuencia inmediata: un esquema se puede **publicar**.

## 🧩 La situación

Lo mismo que la clase 039, con dos diferencias que cambian todo:

1. Un campo **que el esquema no declara se rechaza**, no se ignora.
2. `GET /esquemas/tarea` **devuelve el esquema**.

## 📖 Código frente a dato

```javascript
// Como código: se ejecuta, y ya está.
if (typeof titulo !== "string") return "titulo debe ser texto";

// Como dato: se ejecuta, se publica, se compara, se versiona.
{ type: "string", minLength: 1, maxLength: 120 }
```

La diferencia no es de estilo. Un esquema, al ser una estructura de datos:

| Se puede… | Con un `if` |
| --- | --- |
| **Publicar** para que el cliente valide antes de enviar | no |
| **Comparar** dos versiones y saber qué cambió | no |
| **Generar** documentación y tipos | no |
| **Reutilizar** en el cliente, en pruebas y en el servidor | no |

La implementación de Express escribe **un intérprete de esquema a mano** —cuarenta
líneas— precisamente para que se vea que un esquema es un árbol de datos que
alguien recorre. En un proyecto real se usa una biblioteca; el punto es entender
qué hace.

## 🔒 El campo que no declaraste

```json
{ "titulo": "vale", "titluo": "error de dedo" }
```

Sin `additionalProperties: false`, **los cuatro frameworks aceptan esto en
silencio**: guardan la tarea con el título correcto e ignoran el campo mal
escrito.

Dos problemas:

**Diagnóstico.** El cliente escribió mal un nombre y nadie se lo dice. Si el campo
era opcional, el fallo aparece semanas después como «no se guardó la prioridad».

**Seguridad.** Es el vector de asignación masiva: un cliente envía
`{"titulo":"x","rol":"admin"}` y si el objeto se vuelca a la base de datos sin
filtrar, el campo extra viaja con él. OWASP lo recoge entre los fallos de control
de acceso [@owasp-top10].

Cómo se llama la defensa en cada uno:

| Framework | Cómo se activa | ¿Por omisión? |
| --- | --- | --- |
| JSON Schema | `additionalProperties: false` | no |
| FastAPI | `model_config = ConfigDict(extra="forbid")` | no |
| Spring Boot | `@JsonIgnoreProperties(ignoreUnknown = false)` | **no**: Jackson ignora |
| ASP.NET Core | `[JsonUnmappedMemberHandling(Disallow)]` | **no**: se ignora |

**Ninguno lo trae puesto.** Los cuatro prefieren la tolerancia, que es razonable
para evolucionar una API y peligrosa para recibir datos de terceros.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `{"titulo":"válida","prioridad":2}` | `201` |
| `{"prioridad":1}` | `422` · campo `titulo`, código `REQUERIDO` |
| `{"titulo":"vale","prioridad":9}` | `422` · campo `prioridad`, código `VALOR` |
| `{"titulo":"vale","titluo":"..."}` | **`422`** |
| `GET /esquemas/tarea` | `200` con el esquema |

## 🌐 Las implementaciones

### FastAPI — el esquema se deriva del modelo

```python
@app.get("/esquemas/tarea")
def esquema() -> dict[str, object]:
    return Tarea.model_json_schema()
```

**No hay dos copias que mantener.** El modelo que valida es el mismo que genera
el esquema publicado, así que no pueden divergir. Es la propiedad que la clase
042 lleva hasta sus últimas consecuencias.

### Spring Boot y ASP.NET Core — la forma vive en el tipo

El esquema publicado se construye a mano, porque el tipo no lo genera solo. Es
una **segunda fuente de verdad**, y las dos fuentes divergen en cuanto alguien
cambia una y olvida la otra.

Existen bibliotecas que lo derivan del tipo; usarlas es la respuesta correcta y
está fuera del alcance de esta clase.

### Express — el esquema como estructura, y su intérprete

```javascript
function validar(esquema, valor) {
  if (esquema.type === "object") { ... }
  if (esquema.type === "string") { ... }
  ...
}
```

Cuarenta líneas que recorren un árbol. **Eso es todo lo que hace por debajo una
biblioteca de JSON Schema**, con muchos más casos cubiertos.

## 🔬 Comparación

| Framework | Esquema y validación | ¿Publicar es gratis? |
| --- | --- | --- |
| FastAPI | **la misma declaración** | **sí**, se deriva |
| Fastify | el esquema **es** la validación | sí |
| Spring Boot | tipo anotado; esquema aparte | no |
| ASP.NET Core | tipo anotado; esquema aparte | no |
| Express | el esquema es el dato que interpretas | sí |

Las filas de arriba y la de abajo comparten una propiedad que las de en medio no
tienen: **una sola declaración**. En Spring y en ASP.NET, el tipo y el esquema
publicado son dos cosas que hay que mantener sincronizadas a mano — y la clase
043 muestra qué pasa cuando dejan de estarlo.

## ⚠️ Errores frecuentes

- **No rechazar campos desconocidos.** Diagnóstico pobre y asignación masiva.
- **Confundir esquema con dominio.** El esquema describe la forma; «no vacío tras
  recortar» no cabe en él. Es la lección de la clase 039.
- **Publicar un esquema que no es el que valida.** Peor que no publicarlo.
- **Esquemas gigantes sin componer.** Se reutilizan por referencia, como el
  código.
- **Validar solo la entrada.** La salida también tiene forma, y la clase 050
  muestra qué rompe cuando cambia.

## ✅ Verificación

```bash
node scripts/run-class.mjs 041
```

## 🧪 Reto de transferencia

Haz que el cliente **use** el esquema publicado: escribe un script que lo
descargue, valide un objeto con él y solo entonces envíe la petición. Ese es el
argumento entero de esta clase — un esquema que no se publica es un `if` con más
sintaxis.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 042 — Un esquema, tres usos](../042-un-esquema-tres-usos/README.md)
- [Módulo 05 — Backend y API](../../../curriculum/05-backend-y-api.md)

## Fuentes

- [@json-schema] *JSON Schema Specification*, JSON Schema Organization — <https://json-schema.org/specification>
- [@owasp-top10] *OWASP Top 10*, OWASP Foundation — <https://owasp.org/www-project-top-ten/>
- [@geewax-api-design-patterns] Geewax, JJ. *API Design Patterns*. Manning, 2021. ISBN 9781617295850 — <https://openlibrary.org/isbn/9781617295850>
