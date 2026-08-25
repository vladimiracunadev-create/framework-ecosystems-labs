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

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**OpenAPI**](../../../glosario/README.md#openapi) | El formato estándar para describir una API HTTP: rutas, parámetros, cuerpos y respuestas. Cuando se deriva del código en lugar de escribirse aparte, no puede quedarse desactualizado. |

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
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web, spring-boot-starter-validation, springdoc-openapi-starter-webmvc-ui 2.8.13`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-043-1.0.0.jar --server.port=3000
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
| `Clase043.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Tres de los cuatro **derivan** el documento del código. Uno lo escribe a mano — y
es el que mejor enseña la clase, porque es el único que puede mentir.

Léelas buscando una cosa: **qué se genera solo y qué hay que declarar**.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

```python
@app.get(
    "/tareas/{id}",
    response_model=TareaCreada,
    responses={404: {"model": Problema, "description": "No existe"}},
)
```

```python
@app.post(
    "/tareas",
    status_code=status.HTTP_201_CREATED,
    response_model=TareaCreada,
    responses={422: {"model": Problema, "description": "Entrada invalida"}},
)
```

El `200` y el `201` salen solos, porque están en la firma. **El `404` hay que
declararlo**, porque vive dentro de un `if` y ninguna herramienta lee la lógica
del método.

Y `response_model` no es documentación decorativa: FastAPI **filtra la respuesta
por ese modelo**, así que un campo que el modelo no declare no sale. Documentar y
serializar acaban siendo la misma decisión.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
    @GetMapping("/tareas/{id}")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "La tarea"),
            @ApiResponse(responseCode = "404", description = "No existe"),
    })
```

Exactamente el mismo reparto con otra sintaxis: springdoc documenta por su cuenta
lo que está en la firma, y el `404` hay que decirlo.

Esa coincidencia entre dos ecosistemas distintos es la frontera de lo que
significa «documentación generada», y conviene tenerla escrita:

> **Se genera lo que está en la firma y en las anotaciones. Lo que hace el
> cuerpo, no.**

Quien espere que la herramienta descubra los códigos leyendo el método va a
publicar un contrato incompleto sin enterarse.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
app.MapGet("/tareas/{id}", (string id) =>
        tareas.TryGetValue(id, out var tarea)
            ? Results.Json(tarea)
            : Results.Json(new { code = "NO_EXISTE" }, statusCode: 404))
    .Produces(200)
    .Produces(404);
```

```csharp
constructor.Services.AddOpenApi();
```

```csharp
app.MapOpenApi("/openapi.json");
```

`.Produces(404)` es el `responses={404: …}` de FastAPI y el `@ApiResponse` de
Spring. **Tres sintaxis, la misma necesidad.**

Y el documento se publica en `/openapi.json`, la misma ruta que en los otros
tres. Que el contrato de esta clase pueda ser idéntico depende de eso: si cada
framework publicara en su ruta por omisión, el contrato tendría que tener cuatro
rutas y dejaría de comparar.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — la que puede mentir

```javascript
const DOCUMENTO = {
  openapi: "3.1.0",
  info: { title: "Tareas", version: "1.0.0" },
  paths: {
    "/tareas": {
      post: {
        responses: { 201: { description: "Creada" }, 422: { description: "Entrada invalida" } },
      },
    },
```

**Express no genera nada.** No hay tipos ni esquemas de los que derivar, así que
el documento está escrito a mano.

Y por eso esta implementación es la más valiosa de la clase: **es la única que
puede divergir del código**. Cambiar el `422` por un `400` en la ruta y olvidar
el documento produce una API que promete una cosa y hace otra, y nada lo detecta.

Está deliberadamente **al lado de las rutas** para reducir la distancia. En un
proyecto real vive en otro archivo, a veces en otro repositorio, y esa distancia
es exactamente lo que produce la divergencia.

Hay bibliotecas que derivan el documento de esquemas en Express y en Fastify —y
usarlas es la respuesta correcta—; lo que la clase enseña es **qué se pierde
cuando no las hay**, que es la capacidad de que el documento se equivoque solo.

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
