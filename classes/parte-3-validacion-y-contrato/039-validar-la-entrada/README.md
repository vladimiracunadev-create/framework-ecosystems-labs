# Clase 039 — Validar la entrada

> [⬅️ 038](../../parte-2-la-tuberia/038-middleware-decorador-y-aspecto/README.md) · [📚 Parte 3](../README.md) · [🎓 Clases](../../README.md) · [040 ➡️](../040-errores-por-campo-con-rfc-9457/README.md)
>
> Parte **3 — Validación y contrato** · Nivel **🟢 introductorio** · Pista **`backend`**
>
> ✅ **Clase construida** — 10 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Rechazar lo inválido **antes de que llegue a la lógica**, y ver dónde vive esa
regla en diez frameworks: en un `if`, en un tipo, en un esquema o en un
formulario.

## 🧩 La situación

`POST /tareas` acepta un título de 1 a 120 caracteres y un `completada`
booleano opcional. El título se recorta. Todo lo demás responde **422**.

## 🧮 El contrato

| Cuerpo | Respuesta |
| --- | --- |
| `{"titulo":"leer el módulo 05"}` | `201` · `completada: false` |
| `{"titulo":"  con espacios  "}` | `201` · `titulo: "con espacios"` |
| `{"titulo":"hecha","completada":true}` | `201` |
| `{"titulo":""}` | `422` |
| `{"titulo":"     "}` | **`422`** |
| `{"completada":true}` | `422` |
| título de 129 caracteres | `422` |
| `{"titulo":"vale","completada":"si"}` | **`422`** |

Los dos casos en negrita son los que separan las implementaciones. El de los
espacios porque casi nadie recorta antes de comprobar; el del tipo equivocado
por una razón más profunda que se explica abajo.

## 🌐 Las implementaciones

Las diez cumplen el mismo contrato y **colocan la regla en sitios distintos**:
en un `if`, en un tipo, en un esquema, en un formulario, en un modelo o en una
etiqueta de estructura. Dónde vive decide si se puede olvidar.

### Express y Flask — en un `if`

```javascript
function validar(cuerpo) {
  const titulo = cuerpo?.titulo;
  if (typeof titulo !== "string") return "titulo debe ser texto";
  if (titulo.trim().length < 1) return "titulo no puede estar vacío";
  if (titulo.length > 120) return "titulo no puede pasar de 120 caracteres";
  ...
}
```

Explícito y sin sorpresas. La regla está donde se lee, y **hay que acordarse de
llamarla en cada ruta que acepte una tarea**.

### FastAPI — en el tipo

```python
class Tarea(BaseModel):
    titulo: str = Field(min_length=1, max_length=120)
    completada: bool = False

    @field_validator("titulo")
    @classmethod
    def sin_espacios_sobrantes(cls, valor: str) -> str:
        limpio = valor.strip()
        if not limpio:
            raise ValueError("titulo no puede estar vacío")
        return limpio
```

El manejador **no valida nada**: recibe un objeto que ya cumple. Y fíjate en el
validador de campo: además de comprobar, **transforma** —devuelve el valor
recortado—. Validación y normalización en el mismo sitio.

### Fastify — en un esquema, con un límite

```javascript
const esquema = {
  body: {
    type: "object",
    required: ["titulo"],
    properties: { titulo: { type: "string", minLength: 1, maxLength: 120 } },
  },
};
```

Y aquí apareció el primer fallo real de la clase: **`"     "` pasaba**.

`minLength: 1` cuenta caracteres del texto **crudo**, y cinco espacios son cinco
caracteres. JSON Schema no recorta.

No es un defecto: es la naturaleza del mecanismo. **Un esquema describe la forma
del dato; «no vacío tras recortar» es una regla del dominio.** La implementación
la añade aparte, y esa separación —forma frente a dominio— es el eje de toda la
parte 3.

### Django — en un formulario

```python
class FormularioTarea(forms.Form):
    titulo = forms.CharField(min_length=1, max_length=120, strip=True)
    completada = forms.BooleanField(required=False)
```

La validación de Django vive en un **formulario**, y `strip=True` está ahí desde
que existe. Su ventaja es la reutilización: el mismo formulario sirve para una
petición JSON y para un `<form>` de navegador.

### Laravel — en una línea

```php
$datos = $peticion->validate([
    'titulo' => ['required', 'string', 'min:1', 'max:120'],
    'completada' => ['sometimes', 'boolean'],
]);
```

La declaración más compacta de las diez. Las reglas son cadenas, así que se
pueden guardar en configuración, y `sometimes` expresa exactamente «si viene,
que sea booleano».

### Rails — en un modelo sin base de datos

```ruby
class Tarea
  include ActiveModel::Model
  validates :titulo, presence: true, length: { maximum: 120 }
end
```

`ActiveModel` da las validaciones de ActiveRecord **sobre un objeto normal**. Y
`presence: true` en Rails ya considera vacío un texto de solo espacios — de los
diez, es el único que trae esa regla puesta.

### Gin — en etiquetas de la estructura

```go
type tarea struct {
	Titulo     string `json:"titulo" binding:"required,min=1,max=120"`
	Completada *bool  `json:"completada"`
}
```

El puntero en `Completada` no es un capricho: en Go, `false` y «no vino» son el
mismo valor cero. **El puntero es la única forma de distinguirlos**, y esa
distinción importa en cuanto hay campos opcionales.

## 🔍 El hallazgo: un tipo equivocado no es entrada inválida

`{"titulo":"vale","completada":"si"}` debería dar **422**. En la primera versión,
Spring Boot y ASP.NET Core daban **400**.

La causa es estructural: en un framework tipado, el cuerpo se **enlaza a un tipo
antes de validarse**. Un `"si"` que debe ser booleano falla al deserializar, y
para el framework eso es un cuerpo que no pudo interpretar — 400.

Pero el cuerpo era JSON perfectamente válido. Lo que está mal es el **contenido**,
y eso es 422 según el estándar [@rfc9110].

La corrección consiste en **aceptar el valor crudo y comprobar el tipo a mano**:

```java
// Spring: `Object` en vez de `Boolean`
Object completada) { ... }

if (completada != null && !(completada instanceof Boolean)) {
    return ...422...;
}
```

```csharp
// ASP.NET Core: JsonElement? en vez de bool?
public JsonElement? Completada { get; set; }
```

**Ese es el precio de que el enlace ocurra antes que la validación**, y no hay
forma de evitarlo sin renunciar al enlace automático. Los frameworks dinámicos no
tienen el problema porque no hay enlace: el valor llega tal cual y la validación
lo mira.

Es una de las pocas veces del programa donde el tipado estático **estorba**, y
merece decirse con la misma claridad con la que se dicen sus ventajas.

## 🔬 Comparación

| Framework | Dónde vive la regla | ¿Recorta? | ¿Distingue «vacío» de «solo espacios»? |
| --- | --- | --- | --- |
| Rails | modelo (`ActiveModel`) | con `strip` | **sí**, de fábrica |
| Django | formulario | **sí**, `strip=True` | sí |
| FastAPI | tipo + validador | con validador | sí, escrito |
| Laravel | reglas declarativas | no | con regla extra |
| Spring Boot | anotaciones | no | `@NotBlank` sí |
| Fastify | esquema | **no** | **no**: hay que añadirlo |
| Express, Flask | `if` | a mano | a mano |
| ASP.NET Core | atributos | no | a mano |
| Gin | etiquetas | no | a mano |

## ⚠️ Errores frecuentes

- **Validar en el manejador y olvidarlo en la ruta siguiente.**
- **Comprobar la longitud sin recortar.** `"     "` pasa.
- **Confundir «no vino» con «vino vacío»** en lenguajes sin nulos para el tipo.
- **Devolver 400 en un tipo equivocado.** Es 422: el cuerpo se entendió.
- **Validar solo en el cliente.** La validación del cliente es comodidad; la del
  servidor es la que cuenta [@owasp-asvs].
- **Aceptar campos que no declaraste.** La clase 041 lo trata.

## ✅ Verificación

```bash
node scripts/run-class.mjs 039
```

## 🧪 Reto de transferencia

Añade una regla que dependa de **dos campos a la vez**: si `completada` es
verdadero, el título no puede empezar por «TODO». Es donde los esquemas se
quedan cortos y hacen falta validadores del dominio — en cuáles de los diez
resulta natural y en cuáles no es la respuesta del reto.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 040 — Errores por campo con RFC 9457](../040-errores-por-campo-con-rfc-9457/README.md)
- [Módulo 05 — Backend y API](../../../curriculum/05-backend-y-api.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@owasp-asvs] *OWASP Application Security Verification Standard*, OWASP Foundation — <https://owasp.org/www-project-application-security-verification-standard/>
- [@evans-ddd] Evans, Eric. *Domain-Driven Design*. Addison-Wesley, 2003. ISBN 9780321125217 — <https://openlibrary.org/isbn/9780321125217>
