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

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Esquema**](../../../glosario/README.md#esquema) | Una descripción declarativa de la forma que deben tener unos datos. Un mismo esquema puede servir para validar la entrada, generar la documentación y tipar el código — tres usos de una sola declaración. |

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
PORT=3000 java -jar target/clase-041-1.0.0.jar --server.port=3000
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
| `Clase041.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

La pregunta de esta clase es **cuántas copias de la forma existen**. Una sola
—derivada del código— o dos, que divergen en cuanto alguien cambia una y olvida
la otra.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — el esquema como dato, y su intérprete

```javascript
const ESQUEMA_TAREA = {
  type: "object",
  required: ["titulo"],
  additionalProperties: false,
  properties: {
    titulo: { type: "string", minLength: 1, maxLength: 120 },
    prioridad: { type: "integer", enum: [1, 2, 3] },
  },
};
```

**El esquema es un dato, no código.** Se puede leer, publicar, versionar,
comparar entre dos versiones y enviar a un cliente para que valide antes de
enviar. Un `if` no permite nada de eso.

Y lo que sigue es lo que esta clase quiere que veas al menos una vez:

```javascript
function validar(esquema, valor) {
  const errores = [];
  if (esquema.type === "object") {
    if (typeof valor !== "object" || valor === null || Array.isArray(valor)) {
      return [{ campo: "cuerpo", codigo: "TIPO" }];
    }
    for (const requerido of esquema.required ?? []) {
      if (!(requerido in valor)) errores.push({ campo: requerido, codigo: "REQUERIDO" });
    }
```

```javascript
    for (const [clave, sub] of Object.entries(esquema.properties ?? {})) {
      if (!(clave in valor)) continue;
      errores.push(...validar(sub, valor[clave]).map((e) => ({ ...e, campo: clave })));
    }
```

Cuarenta líneas que **recorren un árbol y se llaman a sí mismas** para los
subobjetos. Eso es todo lo que hace por debajo una biblioteca de JSON Schema —
con cientos de casos más cubiertos, pero con el mismo mecanismo.

En un proyecto real se usa la biblioteca. Aquí está escrito a mano por la misma
razón que la clase 018 analiza la cabecera `Accept` a mano: **para que el
mecanismo deje de ser magia**.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — el esquema se deriva del modelo

```python
class Tarea(BaseModel):
    model_config = ConfigDict(extra="forbid")

    titulo: str = Field(min_length=1, max_length=120)
    prioridad: Literal[1, 2, 3] | None = None
```

```python
@app.get("/esquemas/tarea")
def esquema() -> dict[str, object]:
    # El esquema se DERIVA del modelo: no hay una segunda copia que mantener.
    return Tarea.model_json_schema()
```

**No hay dos copias que mantener.** El modelo que valida es el mismo que genera
el esquema publicado, así que no pueden divergir — ni siquiera queriendo. Es la
propiedad que la clase 042 lleva hasta sus últimas consecuencias.

Y `extra="forbid"` merece atención porque es el equivalente exacto del
`additionalProperties: false` de JSON Schema, y porque su ausencia produce un
fallo muy desagradable: un cliente que escribe `"titluo"` en vez de `"titulo"`
recibiría un `422` por título ausente **sin enterarse de que se equivocó al
teclear** — o, peor, el campo se ignoraría en silencio.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — la forma vive en el tipo, y el esquema aparte

```java
        Map<String, Object> esquema = new LinkedHashMap<>();
        esquema.put("type", "object");
        esquema.put("required", List.of("titulo"));
        esquema.put("additionalProperties", false);
        esquema.put("properties", propiedades);
        return esquema;
```

La forma real está en el tipo —el `record` con sus anotaciones— y el esquema
publicado **se construye a mano**. Son dos fuentes de verdad para lo mismo, y
las dos fuentes divergen en cuanto alguien cambia una y olvida la otra.

Que esta implementación sea deliberadamente ingenua es parte de la clase:
existen bibliotecas que derivan el esquema del tipo, y **usarlas es la respuesta
correcta**. Lo que se enseña aquí es a reconocer el problema cuando lo tienes
delante, no a resolverlo así.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — la misma duplicidad, y un atributo que salva

```csharp
var esquema = new
{
    type = "object",
    required = new[] { "titulo" },
    additionalProperties = false,
    properties = new
    {
        titulo = new { type = "string", minLength = 1, maxLength = 120 },
        prioridad = new { type = "integer", @enum = new[] { 1, 2, 3 } },
    },
};
```

Misma situación que Spring: dos copias.

Pero hay un detalle propio de .NET que vale la clase entera:

```csharp
[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
class Tarea
```

```csharp
    catch (JsonException)
    {
        // El atributo `JsonUnmappedMemberHandling.Disallow` de abajo hace que un
        // campo desconocido lance aqui. Sin el, .NET lo IGNORA en silencio.
        return Problema([new { campo = "cuerpo", codigo = "DESCONOCIDO" }]);
    }
```

**Sin ese atributo, .NET ignora en silencio los campos que no conoce.** Es el
mismo problema del `"titluo"` de FastAPI, con el valor por omisión en la
dirección contraria: Pydantic hay que decirle que prohíba, y a .NET también,
pero uno lo llama `extra="forbid"` y el otro `JsonUnmappedMemberHandling.Disallow`.

Que los cuatro frameworks necesiten una decisión explícita para rechazar campos
desconocidos dice algo del ecosistema: **ignorar lo que no se entiende es el
valor por omisión en todas partes**, y casi nunca es lo que quieres en una API
que otros consumen.

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
