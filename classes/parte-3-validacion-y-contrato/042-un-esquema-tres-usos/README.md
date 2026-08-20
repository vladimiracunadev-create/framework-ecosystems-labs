# Clase 042 — Un esquema, tres usos

> [⬅️ 041](../041-esquemas/README.md) · [📚 Parte 3](../README.md) · [🎓 Clases](../../README.md) · [043 ➡️](../043-documentacion-generada/README.md)
>
> Parte **3 — Validación y contrato** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Derivar **validación, tipos y documentación** de una sola declaración. Es la idea
que la [ficha de FastAPI](../../../atlas/fichas/fastapi.md) sitúa como su
aportación principal, y la que la [ficha de Elysia](../../../atlas/fichas/elysia.md)
reproduce en TypeScript años después.

## 🧩 La situación

Una declaración de tarea con dos restricciones —título de 1 a 120, prioridad de
1 a 3—. Y tres consecuencias sin escribir nada más:

1. **Validación**: la petición que no encaja se rechaza con 422.
2. **Tipos**: el editor sabe qué campos hay y de qué tipo.
3. **Documentación**: el documento de OpenAPI publica las mismas restricciones.

## 📖 Por qué importa: la divergencia silenciosa

Con tres declaraciones separadas —una validación, un tipo, un documento— pasa
siempre lo mismo:

```text
día 1    validación: max 120   ·   documento: max 120   ✅
día 90   validación: max 80    ·   documento: max 120   ❌
```

Alguien ajusta el límite y no toca el documento. **Nada falla**: el servidor
sigue funcionando, el documento sigue siendo válido, y a partir de ese momento
miente.

El cliente que se fía del documento envía un título de 100 caracteres, lo valida
contra el esquema publicado, y **recibe un 422 que no esperaba**. El error está
en el servidor y lo sufre el cliente.

Con una sola declaración eso no puede pasar. No porque haya más disciplina:
porque **no hay una segunda copia que olvidar**.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `{"titulo":"válida"}` | `201` · `prioridad: 2` (el valor por omisión) |
| `{"titulo":""}` | `422` · `code: VALIDACION` |
| `{"titulo":"vale","prioridad":9}` | `422` |
| `GET /openapi.json` | `200` en JSON |
| igual | el cuerpo contiene `maxLength` y `120` |

El último caso es el que demuestra la tesis: **el límite que valida es el mismo
que se publica**, y nadie lo escribió dos veces.

Se comprueba por subcadena y no por estructura a propósito: cada framework anida
el esquema de forma distinta —`components.schemas.Tarea` frente a
`components.schemas.CrearTareaDto`— y lo que el contrato exige es que el límite
**esté**, no dónde.

## 🌐 Las implementaciones

### FastAPI — una declaración, literalmente

```python
class Tarea(BaseModel):
    titulo: str = Field(min_length=1, max_length=120, description="Qué hay que hacer")
    prioridad: Literal[1, 2, 3] = Field(default=2, description="1 alta, 3 baja")
```

**Eso es todo.** El tipo valida, el editor lo entiende y el documento de OpenAPI
sale de él. Cambiar `120` a `80` cambia las tres cosas.

Es el ejemplo más limpio del programa de lo que significa una sola fuente de
verdad, y explica buena parte de la adopción de FastAPI.

### NestJS — una clase, dos vocabularios

```typescript
@ApiProperty({ minLength: 1, maxLength: 120, description: "Qué hay que hacer" })
@IsString()
@Length(1, 120)
titulo!: string;
```

Dos familias de decoradores sobre el **mismo campo**: `class-validator` valida y
`@ApiProperty` documenta. El `120` aparece dos veces, y en la misma línea del
mismo archivo.

No es tan limpio como FastAPI y sigue siendo robusto: **la divergencia sería
visible al leer**, porque los dos números están pegados.

### Spring Boot — y un matiz que mejora la cosa

```java
@Schema(description = "Que hay que hacer")
@NotBlank @Size(max = 120) String titulo,
```

Fíjate: `@Schema` **no repite el 120**. Y aparece en el documento igualmente.

La razón es que springdoc **lee las anotaciones de validación** y las traduce al
esquema publicado. Así que es una fuente de verdad —`@Size`— con una anotación de
documentación encima que solo añade lo que la validación no expresa: la
descripción para personas.

Es una solución mejor de lo que parece a primera vista.

### ASP.NET Core — lo mismo, con la plataforma

```csharp
[Required] [MinLength(1)] [MaxLength(120)]
public string? Titulo { get; set; }
```

Desde .NET 9, `AddOpenApi` viene en la plataforma y lee los atributos de
validación. Sin biblioteca externa.

## 🔬 Comparación

| Framework | Declaraciones | ¿Puede divergir? | Documento |
| --- | --- | --- | --- |
| FastAPI | **una** | **no** | derivado |
| Spring Boot | una + descripción | no en las restricciones | derivado |
| ASP.NET Core | una + descripción | no en las restricciones | derivado |
| NestJS | una clase, dos decoradores | sí, y **a la vista** | derivado |

Ninguno de los cuatro tiene el problema de la divergencia silenciosa, y por
motivos distintos: FastAPI porque solo hay una declaración; Spring y ASP.NET
porque el documento **lee** la validación; NestJS porque las dos declaraciones
están pegadas.

**El caso peligroso no está en esta tabla**: es escribir el documento de OpenAPI
a mano, en un archivo aparte. Ahí sí diverge, y es lo que hace la clase 043.

## 🧭 El límite de este enfoque

La declaración expresa **la forma**. Lo que no expresa:

- Reglas entre campos: «si está completada, la fecha de fin es obligatoria».
- Reglas que consultan datos: «el título no puede repetirse».
- Reglas de negocio: «solo el propietario puede marcarla completada».

Es la misma frontera de la clase 039 —forma frente a dominio— y conviene tenerla
presente antes de creer que el esquema resuelve la validación entera. Resuelve la
parte mecánica, que es la mayoría en volumen y la menos interesante.

## ⚠️ Errores frecuentes

- **Escribir el documento a mano** teniendo un tipo que lo describe.
- **Poner descripciones vacías** para cumplir el expediente.
- **Creer que el esquema valida el dominio.**
- **Publicar el documento de desarrollo en producción** con rutas internas
  dentro.
- **Cambiar la declaración sin mirar quién consume el documento.** Es la clase
  050.

## ✅ Verificación

```bash
node scripts/run-class.mjs 042
```

## 🧪 Reto de transferencia

Cambia `max_length` de 120 a 80 en **una sola** de las cuatro implementaciones y
comprueba, con una petición al documento, que el cambio llegó allí sin tocar
nada más. Después hazlo en un proyecto que tenga el documento escrito a mano: la
diferencia de esfuerzo es el argumento de la clase.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 043 — Documentación generada](../043-documentacion-generada/README.md)
- [Ficha de FastAPI](../../../atlas/fichas/fastapi.md) · [Ficha de Elysia](../../../atlas/fichas/elysia.md)

## Fuentes

- [@openapi-spec] *OpenAPI Specification* v3.1, OpenAPI Initiative — <https://spec.openapis.org/oas/v3.1.0.html>
- [@json-schema] *JSON Schema Specification*, JSON Schema Organization — <https://json-schema.org/specification>
- [@geewax-api-design-patterns] Geewax, JJ. *API Design Patterns*. Manning, 2021. ISBN 9781617295850 — <https://openlibrary.org/isbn/9781617295850>
