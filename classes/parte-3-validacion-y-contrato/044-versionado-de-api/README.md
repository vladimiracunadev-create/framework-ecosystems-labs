# Clase 044 — Versionado de API

> [⬅️ 043](../043-documentacion-generada/README.md) · [📚 Parte 3](../README.md) · [🎓 Clases](../../README.md) · [045 ➡️](../045-paginacion/README.md)
>
> Parte **3 — Validación y contrato** · Nivel **🔴 avanzado** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Servir **dos versiones vivas del mismo recurso** sin romper a quien ya te
consume. Y comparar las dos formas de hacerlo.

## 🧩 La situación

La v1 devuelve `nombre: "Ada Lovelace"`. La v2 lo separa en `nombre` y
`apellido`. Es el cambio incompatible más común que existe, y las dos versiones
conviven.

## 📖 Las dos formas

### En la ruta

```text
GET /v1/personas/1
GET /v2/personas/1
```

**A favor:** se ve en el registro, en la caché y en el navegador. Se prueba con
`curl` sin pensar. Un cliente antiguo no puede acabar en la v2 por accidente.

**En contra:** el mismo recurso tiene dos URL. Quien defiende REST con rigor
objeta que la identidad del recurso no debería cambiar porque cambie su
representación.

### En la cabecera

```text
GET /personas/1
X-Api-Version: 2
```

**A favor:** una sola URL por recurso, que es lo que el modelo de REST propone.

**En contra:** invisible. No se ve en el registro sin configurarlo, la caché
necesita `Vary` —la trampa de la clase 018— y probar con el navegador es
incómodo.

Y un detalle que decide más de lo que parece: **si el cliente no envía la
cabecera, ¿qué versión recibe?** Estas cuatro implementaciones sirven la v1, que
es la respuesta correcta: **no romper a quien no pidió nada**.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /v1/personas/1` | `{"id":"1","nombre":"Ada Lovelace"}` |
| `GET /v2/personas/1` | `{"id":"1","nombre":"Ada","apellido":"Lovelace"}` |
| `GET /personas/1` sin cabecera | **la v1** |
| con `x-api-version: 2` | la v2 |
| igual | la respuesta declara `x-api-version: 2` |
| con `x-api-version: 9` | `400` · `VERSION_DESCONOCIDA` |

Los dos últimos casos merecen atención. **Declarar qué versión sirvió** permite
diagnosticar: sin eso, un cliente que recibe la forma equivocada no sabe si el
problema es suyo o del servidor. Y **rechazar una versión desconocida** en lugar
de adivinar evita que un error tipográfico se sirva en silencio como v1.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Versionado de API**](../../../glosario/README.md#versionado-de-api) | Cómo se publica un cambio que rompe a los clientes existentes. En la ruta, en una cabecera o por negociación de contenido; lo que no cambia es la obligación de decidir cuánto tiempo se mantiene la versión anterior. |

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
PORT=3000 java -jar target/clase-044-1.0.0.jar --server.port=3000
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
| `Clase044.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones

Lo interesante es cómo se separa el código de cada versión:

```java
// Spring — enruta POR LA CABECERA: dos métodos distintos, misma ruta
@GetMapping(value = "/personas/1", headers = "X-Api-Version=2")
public ResponseEntity<Map<String, String>> porCabeceraV2() { }
```

Es más limpio que un `if` dentro de un método: cada versión es **un método
independiente** que se puede congelar, probar y borrar por separado.

```python
# FastAPI — un enrutador por versión
v1 = APIRouter(prefix="/v1")
v2 = APIRouter(prefix="/v2")
```

```csharp
// ASP.NET Core — un grupo por versión
var v1 = app.MapGroup("/v1");
```

Los tres persiguen lo mismo: **que la v1 pueda congelarse mientras la v2
evoluciona**. Un `if (version == 2)` dentro de un manejador compartido consigue
lo contrario — las dos versiones acopladas en el mismo código, y tocar una
arriesga la otra.

## 🔬 Comparación

| Framework | Por ruta | Por cabecera | Separación del código |
| --- | --- | --- | --- |
| Spring Boot | anotación | **enruta por cabecera** | un método por versión |
| FastAPI | enrutador con prefijo | con un `if` | enrutador por versión |
| ASP.NET Core | grupo de rutas | con un `switch` | grupo por versión |
| Express | montaje de enrutador | con un `if` | manual |

Spring es el único que **enruta** por la cabecera en lugar de ramificar dentro
del manejador. La diferencia se nota cuando hay tres versiones vivas: tres
métodos independientes frente a un `switch` de sesenta líneas.

## 🧭 La pregunta que va antes

**¿Necesitas versionar?**

Versionar duplica el código que mantienes, las pruebas que ejecutas y la
documentación que publicas. La clase 050 muestra que **la mayoría de los cambios
se pueden hacer compatibles**: añadir campos opcionales, devolver el campo viejo
y el nuevo a la vez, ampliar en lugar de estrechar.

El orden sensato:

1. **Intenta que el cambio sea compatible.** Casi siempre se puede.
2. **Si no**, versiona — y planifica desde el principio **cuándo retiras la
   antigua**, porque una versión sin fecha de retirada es una versión eterna.
3. **Nunca** cambies el significado sin cambiar la versión.

Geewax es tajante en esto: el coste real del versionado no es publicarlo, es
**mantenerlo durante años** [@geewax-api-design-patterns].

## ⚠️ Errores frecuentes

- **Versionar cambios compatibles.** Coste sin beneficio.
- **Servir la última versión por omisión.** Rompe a quien no pidió nada.
- **Versión en cabecera sin `Vary`.** La caché sirve la forma equivocada.
- **Adivinar la versión** ante un valor desconocido.
- **No declarar qué versión sirvió.** Diagnóstico imposible.
- **No planificar la retirada.** Cinco versiones vivas y nadie sabe cuál usar.

## ✅ Verificación

```bash
node scripts/run-class.mjs 044
```

## 🧪 Reto de transferencia

Añade `Vary: X-Api-Version` a las respuestas de la ruta con cabecera y explica,
con el caso de la clase 018, qué le pasaría a un cliente si no estuviera. Después
decide cuál de las dos formas usarías en una API pública y justifícalo.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 050 — Qué rompe a quién](../050-que-rompe-a-quien/README.md)
- [Módulo 05 — Backend y API](../../../curriculum/05-backend-y-api.md)

## Fuentes

- [@geewax-api-design-patterns] Geewax, JJ. *API Design Patterns*. Manning, 2021. ISBN 9781617295850 — <https://openlibrary.org/isbn/9781617295850>
- [@richardson-amundsen-restful] Richardson, Leonard; Amundsen, Mike. *RESTful Web APIs*. O'Reilly Media, 2013. ISBN 9781449358068 — <https://openlibrary.org/isbn/9781449358068>
- [@semver] *Semantic Versioning 2.0.0* — <https://semver.org/>
