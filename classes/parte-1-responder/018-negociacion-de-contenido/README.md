# Clase 018 — Negociación de contenido

> [⬅️ 017](../017-cuerpo-json-recibir-y-devolver/README.md) · [📚 Parte 1](../README.md) · [🎓 Clases](../../README.md) · [019 ➡️](../019-redirecciones/README.md)
>
> Parte **1 — Responder** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Servir la representación que el cliente pide, y **declararlo** para que ninguna
caché sirva la equivocada.

## 🧩 La situación

`GET /tareas/1` devuelve JSON si el cliente pide `application/json` y HTML si
pide `text/html`. Si pide algo que no sabes servir, **406**. Y en todos los casos
la respuesta lleva `Vary: Accept`.

## 📖 Por qué `Vary` no es opcional

Una caché guarda respuestas indexadas por URL. Si dos clientes piden
`/tareas/1` y uno quiere JSON y el otro HTML, **la caché serviría al segundo lo
que guardó del primero**.

`Vary: Accept` le dice a la caché que esa URL tiene varias representaciones y que
debe guardarlas por separado según la cabecera `Accept` [@rfc9111]. Sin ella, la
negociación funciona en desarrollo —donde no hay caché— y falla en producción.

Es un fallo especialmente desagradable porque **es intermitente**: depende de
quién pidió primero.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `accept: application/json` | `200` · `content-type: application/json` |
| `accept: text/html` | `200` · `content-type: text/html` |
| cualquiera | `vary` contiene `accept` |
| `accept: application/pdf` | `406` |
| `accept: */*` | `200` · JSON (la representación por omisión) |

<!-- generado: fichas -->

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
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-018-1.0.0.jar --server.port=3000
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
| `Clase018.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Cuatro frameworks y **cuatro repartos distintos del mismo trabajo**: elegir el
tipo, emitir `Vary` y decidir el 406. Ninguno hace las tres cosas.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — las tres, hechas

```javascript
  respuesta.format({
    "application/json": () => respuesta.json(tarea),
    "text/html": () => respuesta.type("text/html").send(`<h1>${tarea.titulo}</h1>`),
    default: () => respuesta.status(406).json({ error: "no puedo servir ese tipo" }),
  });
```

`format` hace **tres cosas a la vez**: elige según `Accept`, emite `Vary:
Accept` por su cuenta y llama a `default` cuando nada encaja. Es de las pocas
veces en que Express trae resuelto algo no trivial, y la única del elenco donde
el `Vary` no hay que acordarse de poner.

Ese detalle importa más de lo que parece: **sin `Vary: Accept`, una caché
intermedia serviría el HTML a quien pidió JSON**, porque para ella las dos
peticiones son la misma URL [@rfc9111].

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — ninguna, y por diseño

```python
def preferido(accept: str) -> str | None:
```

```python
    candidatos = []
    for parte in accept.split(","):
        trozos = parte.split(";")
        tipo = trozos[0].strip()
        calidad = 1.0
        for extra in trozos[1:]:
            if extra.strip().startswith("q="):
                try:
                    calidad = float(extra.strip()[2:])
                except ValueError:
                    calidad = 0.0
        if calidad > 0:
            candidatos.append((calidad, tipo))
    candidatos.sort(key=lambda x: -x[0])
```

**Starlette no negocia.** Expone la cabecera y deja la decisión a la
aplicación, así que esta implementación es la más larga con diferencia: hay que
analizar los valores de calidad (`q=`), ordenarlos y resolver los comodines a
mano.

Léela entera aunque sea larga, porque es la única que **enseña qué hay dentro de
la negociación**. Lo que en Express es una llamada, aquí son veinte líneas — y
las veinte están en el estándar [@rfc9110].

```python
    cabeceras = {"vary": "Accept"}
```

Y el `Vary` también a mano, en las tres ramas.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — la elección y el 406

```java
    @GetMapping(value = "/tareas/1", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> json() {
        return ResponseEntity.ok().header("Vary", "Accept")
                .body(Map.of("id", "1", "titulo", "negociar"));
    }
```

```java
    @GetMapping(value = "/tareas/1", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> html() {
        return ResponseEntity.ok().header("Vary", "Accept").body("<h1>negociar</h1>");
    }
```

**El enfoque más declarativo de los cuatro**, y el único donde la negociación no
aparece como código: **dos métodos con la misma ruta** y distinto `produces`.
Cada uno declara qué sabe servir y Spring elige; si ninguno encaja, emite el
`406` por su cuenta.

La consecuencia práctica es que añadir un tercer formato es añadir un método, no
tocar una condición. El `Vary`, en cambio, hay que ponerlo — y hay que ponerlo
**en los dos**.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — decisión explícita

```csharp
    respuesta.Headers.Vary = "Accept";
    var accept = peticion.Headers.Accept.ToString();

    if (accept.Contains("application/json") || accept.Contains("*/*") || accept.Length == 0)
    {
        return Results.Json(new { id = "1", titulo = "negociar" });
    }
    if (accept.Contains("text/html"))
    {
        return Results.Content("<h1>negociar</h1>", "text/html");
    }
    return Results.Json(new { error = "no puedo servir ese tipo" }, statusCode: 406);
```

Las **API mínimas** no negocian: la decisión es un `if`. Y conviene declarar la
limitación de este extracto, porque es una comparación honesta y no un juicio
sobre el framework: los **controladores MVC** de ASP.NET Core sí tienen
formateadores de salida configurables y negocian como Spring. Lo que se compara
aquí es el camino mínimo, que es el que se elige para un servicio pequeño.

Fíjate también en que `accept.Contains(...)` **ignora los valores de calidad**.
Funciona para el contrato de esta clase y no implementa el estándar: un
`Accept: text/html;q=0.9, application/json;q=0.1` elegiría JSON si aparece
primero en la condición. Es exactamente el trabajo que FastAPI hace a mano y
que Express y Spring hacen por ti.

## 🔬 Comparación

| Framework | ¿Negocia solo? | ¿`Vary` automático? | ¿406 automático? |
| --- | --- | --- | --- |
| Express | **sí**, con `format` | **sí** | sí, con `default` |
| Spring Boot | **sí**, con `produces` | no | **sí** |
| FastAPI | no | no | no |
| ASP.NET Core | no en API mínimas | no | no |

Dos de cuatro negocian y **solo uno emite `Vary` por su cuenta**. Es la cabecera
que más se olvida del programa, y la que produce el fallo más difícil de
reproducir.

## ⚠️ Errores frecuentes

- **Olvidar `Vary: Accept`.** Funciona sin caché y falla con ella.
- **Ignorar los valores de calidad.** `Accept: text/html;q=0.9, application/json`
  prefiere JSON aunque HTML aparezca antes.
- **Tratar `*/*` como error.** Casi todos los clientes lo envían; significa
  «dame lo que quieras».
- **Devolver 200 con un tipo que el cliente no pidió.** El 406 existe para eso.

## ✅ Verificación

```bash
node scripts/run-class.mjs 018
```

## 🧪 Reto de transferencia

Añade `text/csv` como tercera representación y comprueba qué implementación
necesita menos cambios. La respuesta te dice cuál escala mejor cuando el número
de formatos crece.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 048 — ETags y caché condicional](../../parte-3-validacion-y-contrato/048-etags-y-cache-condicional/README.md)
- [Módulo 01 — HTTP, eventos y contratos](../../../curriculum/01-http-eventos-y-contratos.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@rfc9111] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Caching*, RFC 9111, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9111>
- [@grigorik-hpbn] Grigorik, Ilya. *High Performance Browser Networking*. O'Reilly Media, 2013. ISBN 9781449344764 — <https://openlibrary.org/isbn/9781449344764>
