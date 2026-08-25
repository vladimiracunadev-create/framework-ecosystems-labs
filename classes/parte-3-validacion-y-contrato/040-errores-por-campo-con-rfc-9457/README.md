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

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**RFC 9457**](../../../glosario/README.md#rfc-9457) *(Problem Details, application/problem+json)* | El formato estándar de los errores de una API HTTP: un objeto con `type`, `title`, `status` y `detail`, más los campos propios que hagan falta. Un `422` que solo diga «datos inválidos» impide construir una interfaz accesible. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Express** | framework web de Node.js (JavaScript) | 2010 | MIT | OpenJS Foundation |
| **FastAPI** | framework web de Python (Python) | 2018 | MIT | proyecto independiente |
| **Spring Boot** | framework de aplicación de JVM (Java) | 2014 | Apache-2.0 | Broadcom/VMware y colaboradores |
| **ASP.NET Core** | framework web de .NET (C#) | 2016 | MIT | Microsoft y .NET Foundation |

### 🔧 Express

Definió el modelo de middleware encadenado que copiaron casi todos los frameworks de Node.js. Minimalista no significa biblioteca: posee el bucle de peticiones.

- **Documentación oficial:** <https://expressjs.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `express ^5.1.0`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node server.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

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

### 🔧 Spring Boot

Autoconfiguración y servidor incrustado sobre Spring. Convirtió un framework famoso por su configuración XML en uno de arranque inmediato.

- **Documentación oficial:** <https://spring.io/projects/spring-boot>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web, spring-boot-starter-validation`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-040-1.0.0.jar --server.port=3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `pom.xml` | manifiesto de Maven: el proyecto, su Java, sus dependencias y cómo se empaqueta |
| `src/main/java/labs/Aplicacion.java` | código Java |

### 🔧 ASP.NET Core

Reescritura multiplataforma y de código abierto de la pila web de Microsoft. Sus API mínimas trajeron el estilo de los microframeworks al ecosistema .NET.

- **Documentación oficial:** <https://learn.microsoft.com/aspnet/core/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `net10.0`
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
| `Clase040.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las cuatro devuelven el mismo documento de error. Lo que cambia es **cuánto
trabajo hace el framework para acumular los fallos** — y cuánto cuesta ponerle
un código estable a cada uno.

Antes de leerlas, ten presente la diferencia que la clase mide: informar del
**primer** error obliga al usuario a un viaje por cada campo mal; informar de
**todos** le deja arreglarlo de una vez.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — ya vienen acumulados

```python
class Tarea(BaseModel):
    titulo: str = Field(min_length=1, max_length=120)
    prioridad: Literal[1, 2, 3] | None = None
```

```python
    for detalle in error.errors():
        # `loc` es ("body", "titulo"): el primer elemento es de dónde vino.
        ubicacion = [str(x) for x in detalle["loc"] if x != "body"]
        errores.append({
            "campo": ".".join(ubicacion) or "cuerpo",
            "codigo": CODIGOS.get(detalle["type"], "INVALIDO"),
            "detalle": detalle["msg"],
        })
```

Pydantic devuelve **todos** los errores de una vez, cada uno con su ubicación
exacta y un tipo identificable. Lo único que queda por hacer es traducir su
vocabulario al del contrato:

```python
CODIGOS = {
    "missing": "REQUERIDO",
    "string_type": "TIPO",
    "string_too_short": "REQUERIDO",
    "string_too_long": "LONGITUD",
    "literal_error": "VALOR",
}
```

Cinco entradas de diccionario, y ahí acaba el trabajo. Y para estructuras
anidadas, `loc` da la ruta completa —`("body","items",0,"nombre")` se convierte
en `items.0.nombre`—, que es exactamente lo que una interfaz necesita para
señalar el campo correcto dentro de una lista. **Ningún otro de los cuatro lo da
tan hecho.**

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — y el límite de las anotaciones estándar

```java
    public record Tarea(
            @NotBlank(message = "REQUERIDO|no puede estar vacio")
            @Size(max = 120, message = "LONGITUD|maximo 120 caracteres")
            String titulo,
```

```java
            List<Map<String, String>> errores = e.getBindingResult().getFieldErrors().stream()
                    .map(Errores::traducir)
                    .toList();
```

`getFieldErrors()` devuelve **todos** los campos que fallaron, así que la parte
de acumular viene resuelta como en FastAPI.

Lo que no viene resuelto es el código. Mira ese `"REQUERIDO|no puede estar
vacio"`: las anotaciones de validación estándar **solo tienen un hueco para el
mensaje**, no hay un campo para un identificador de error. De ahí el apaño de
codificarlo dentro del propio mensaje y partirlo después:

```java
            int corte = mensaje.indexOf('|');
            String codigo = corte > 0 ? mensaje.substring(0, corte) : "INVALIDO";
            String detalle = corte > 0 ? mensaje.substring(corte + 1) : mensaje;
```

**Funciona y es feo, y decirlo importa.** En un proyecto real se define una
anotación propia con su campo de código, que es más trabajo del que parece: hay
que escribir la anotación, su validador y registrarlo. Este laboratorio muestra
el apaño porque es lo que de verdad se encuentra en los proyectos.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — acumular a mano

```javascript
function validar(cuerpo) {
  const errores = [];
  const titulo = cuerpo?.titulo;
  if (typeof titulo !== "string") {
    errores.push({ campo: "titulo", codigo: "TIPO", detalle: "debe ser texto" });
  } else if (titulo.trim() === "") {
    errores.push({ campo: "titulo", codigo: "REQUERIDO", detalle: "no puede estar vacío" });
  } else if (titulo.length > 120) {
    errores.push({ campo: "titulo", codigo: "LONGITUD", detalle: "máximo 120 caracteres" });
  }
```

Sin mecanismo que acumule, el patrón es explícito: **una lista, y `push` en
lugar de `return`**.

Es la diferencia de una palabra entre informar de un error e informar de todos,
y es el fallo más común de esta clase — porque `return` es lo que uno escribe
sin pensar.

Fíjate también en el encadenamiento `if / else if`: sobre el mismo campo solo se
informa del **primer** problema, porque decirle a alguien que su título «debe ser
texto» y además «no puede estar vacío» no ayuda. Acumular por campo, no por
comprobación.

```javascript
    return respuesta.status(422).type(TIPO).json({
      type: "about:blank",
      title: "la entrada no es válida",
      status: 422,
      code: "VALIDACION",
      errors: errores,
    });
```

`422` y no `400`: el cuerpo se entendió perfectamente, lo que no vale es su
contenido. Y el tipo de contenido es `application/problem+json`, que es lo que
permite a un cliente distinguir un error estructurado de una respuesta normal
[@rfc9457].

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — a mano, y con un motivo declarado

```csharp
    var errores = new List<object>();

    var titulo = tarea?.Titulo;
    if (titulo is null || titulo.Trim().Length == 0)
    {
        errores.Add(new { campo = "titulo", codigo = "REQUERIDO", detalle = "no puede estar vacio" });
    }
    else if (titulo.Length > 120)
    {
        errores.Add(new { campo = "titulo", codigo = "LONGITUD", detalle = "maximo 120 caracteres" });
    }
```

Igual que Express, y **no por falta de herramienta**. .NET trae
`Validator.TryValidateObject`, que también acumula; lo que sus mensajes no traen
es un código estable, así que para devolver `codigo` habría que ponerlo aquí de
todas formas.

Es el mismo problema que Spring resuelve con el apaño del `|`, decidido en la
otra dirección: si el código hay que escribirlo, mejor escribirlo donde se lee.

```csharp
        return Results.Text(problema, tipo, statusCode: 422);
```

Y `Results.Text` con el tipo explícito en lugar de `Results.Json`, por la razón
que la clase 031 documentó: `Results.Json` reescribiría el `content-type` a
`application/json` y se llevaría por delante el `problem+json`.

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
