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

<!-- generado: fichas -->

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **FastAPI** | framework web de Python (Python) | 2018 | MIT | proyecto independiente |
| **NestJS** | framework de aplicación de Node.js/TypeScript (TypeScript) | 2017 | MIT | proyecto independiente |
| **Spring Boot** | framework de aplicación de JVM (Java) | 2014 | Apache-2.0 | Broadcom/VMware y colaboradores |
| **ASP.NET Core** | framework web de .NET (C#) | 2016 | MIT | Microsoft y .NET Foundation |

### 🔧 FastAPI

Deriva validación, serialización y documentación OpenAPI de las anotaciones de tipo. Demostró que el tipado opcional de Python podía ser infraestructura, no adorno.

- **Documentación oficial:** <https://fastapi.tiangolo.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `fastapi==0.121.3, uvicorn==0.40.0`
- **Necesita en el PATH:** `python`

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 python -m uvicorn main:app --host 127.0.0.1 --port 3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `main.py` | código Python |
| `requirements.txt` | dependencias de Python, una por línea, con versión fijada |

### 🔧 NestJS

Trae a Node.js el modelo de Angular y Spring: módulos, decoradores e inyección de dependencias por constructor.

- **Documentación oficial:** <https://docs.nestjs.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `@nestjs/common ^11.1.6, @nestjs/core ^11.1.6, @nestjs/platform-express ^11.1.6, reflect-metadata ^0.2.2, rxjs ^7.8.2, @nestjs/swagger ^11.2.0, class-validator ^0.14.2, class-transformer ^0.5.1, typescript ^5.9.3, @types/node ^24.7.0`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
pnpm exec tsc -p tsconfig.json
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node dist/main.js
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `src/main.ts` | código TypeScript |
| `tsconfig.json` | configuración del compilador de TypeScript |

### 🔧 Spring Boot

Autoconfiguración y servidor incrustado sobre Spring. Convirtió un framework famoso por su configuración XML en uno de arranque inmediato.

- **Documentación oficial:** <https://spring.io/projects/spring-boot>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web, spring-boot-starter-validation, springdoc-openapi-starter-webmvc-ui 2.8.13`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-042-1.0.0.jar --server.port=3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `pom.xml` | manifiesto de Maven: el proyecto, su Java, sus dependencias y cómo se empaqueta |
| `src/main/java/labs/Aplicacion.java` | código Java |
| `src/main/resources/application.properties` | configuración de Spring Boot: lo que se ajusta sin tocar el código |

### 🔧 ASP.NET Core

Reescritura multiplataforma y de código abierto de la pila web de Microsoft. Sus API mínimas trajeron el estilo de los microframeworks al ecosistema .NET.

- **Documentación oficial:** <https://learn.microsoft.com/aspnet/core/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `net10.0, Microsoft.AspNetCore.OpenApi 10.0.0`
- **Necesita en el PATH:** `dotnet`

Preparar sus dependencias, dentro de su directorio:

```bash
dotnet build -c Release --nologo -v quiet
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 dotnet run -c Release --no-build --urls http://127.0.0.1:3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `Clase042.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Los tres usos de esta clase son **validar** en tiempo de ejecución, **tipar**
para el editor y **documentar** para quien consume la API. La pregunta es
cuántas veces hay que escribir el mismo `120`.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — una declaración, literalmente

```python
    titulo: str = Field(min_length=1, max_length=120, description="Qué hay que hacer")
    prioridad: Literal[1, 2, 3] = Field(default=2, description="1 alta, 3 baja")
```

**Eso es todo.** Esas dos líneas validan la petición, tipan el objeto para el
editor y generan el esquema del documento de OpenAPI.

Cambiar `120` por `80` cambia las tres cosas, y **no hay forma de que
diverjan** — no porque alguien tenga cuidado, sino porque no hay tres
declaraciones que mantener sincronizadas.

Es el ejemplo más limpio del programa de lo que significa una sola fuente de
verdad, y explica buena parte de la adopción de FastAPI [@fastapi-features].

### NestJS · [`nestjs/src/main.ts`](implementaciones/nestjs/src/main.ts) — una clase, dos vocabularios

```typescript
class CrearTareaDto {
  @ApiProperty({ minLength: 1, maxLength: 120, description: "Qué hay que hacer" })
  @IsString()
  @Length(1, 120)
  titulo!: string;
```

Dos familias de decoradores sobre el **mismo campo**: `class-validator` valida y
`@ApiProperty` documenta. El `120` aparece dos veces.

Y sin embargo es más robusto de lo que suena: **los dos números están pegados**,
en líneas consecutivas del mismo campo. Una divergencia sería visible al leer, no
un descubrimiento de dentro de tres meses.

```typescript
      exceptionFactory: () => new HttpException({ code: "VALIDACION" }, 422),
```

Y un detalle que costó un intento: la fábrica **tiene que devolver una
`HttpException`**. Devolver un `Error` normal hace que NestJS lo trate como fallo
no controlado y responda `500` — un error de validación convertido en error del
servidor, que es justo la confusión que la clase 015 enseña a evitar.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — y un matiz que mejora la cosa

```java
    public record Tarea(
            @Schema(description = "Que hay que hacer")
            @NotBlank @Size(max = 120) String titulo,

            @Schema(description = "1 alta, 3 baja", defaultValue = "2")
            @Min(1) @Max(3) Integer prioridad) {
    }
```

Fíjate en lo que **no** hay: `@Schema` no repite el `120`. Y el `120` aparece en
el documento igualmente.

La razón es que springdoc **lee las anotaciones de validación** y las traduce al
esquema publicado. Así que hay una sola fuente de verdad —`@Size`— y la
anotación de documentación encima solo añade lo que la validación no puede
expresar: **la descripción para personas**.

Es una solución mejor de lo que parece a primera vista, y el reparto correcto:
cada anotación dice lo que solo ella sabe.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — lo mismo, con la plataforma

```csharp
class Tarea
{
    [JsonPropertyName("titulo")]
    [Required]
    [MinLength(1)]
    [MaxLength(120)]
    public string? Titulo { get; set; }
```

```csharp
constructor.Services.AddOpenApi();
```

```csharp
app.MapOpenApi("/openapi.json");
```

Mismo reparto que Spring: los atributos de `DataAnnotations` validan y el
generador de OpenAPI los lee para documentar. **Una fuente, dos lectores.**

Y una diferencia que importa al elegir: desde .NET 9, `AddOpenApi` **viene en la
plataforma** — no hace falta añadir Swashbuckle ni NSwag. Una dependencia menos
que auditar y actualizar, que es lo que la clase 078 mide.

```csharp
    var contexto = new ValidationContext(tarea);
    var resultados = new List<ValidationResult>();
    if (!Validator.TryValidateObject(tarea, contexto, resultados, validateAllProperties: true))
```

`validateAllProperties: true` no es opcional: **sin él, `TryValidateObject` solo
comprueba `[Required]`** y se salta el resto de atributos. Es un valor por
omisión sorprendente y una fuente conocida de validaciones que no validan.

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
- [@fastapi-features] *FastAPI Features*. FastAPI — <https://fastapi.tiangolo.com/features/>
