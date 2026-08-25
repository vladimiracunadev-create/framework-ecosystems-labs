# Clase 049 — El contrato como prueba

> [⬅️ 048](../048-etags-y-cache-condicional/README.md) · [📚 Parte 3](../README.md) · [🎓 Clases](../../README.md) · [050 ➡️](../050-que-rompe-a-quien/README.md)
>
> Parte **3 — Validación y contrato** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Esta clase no enseña una capacidad nueva. Enseña **el método de todo el
programa**, y por qué las 38 clases anteriores significan algo.

## 🧩 La situación

Cuatro servidores. Un contrato de seis casos. **Ninguno conoce a los otros**,
ninguno comparte código, y el verificador no sabe qué framework hay al otro lado
del socket.

## 📖 Por qué eso importa

Una comparación entre frameworks solo significa algo si **lo que se compara es lo
mismo**.

Si cada framework tuviera su propia batería de pruebas —escrita por quien lo
conoce, con sus convenciones y su idea de qué es correcto— entonces «los cuatro
pasan» no diría nada: cada uno pasaría **su** examen.

Con un contrato único:

- Un fallo señala **una diferencia real de comportamiento**, no de estilo.
- Un verde significa **lo mismo** en los cuatro.
- Añadir un caso obliga a los cuatro a la vez, y ahí aparecen las divergencias.

Es exactamente lo que ocurrió a lo largo de estas clases. `Cache-Control` con
`private`, el 200 frente al 204 en la comprobación previa de CORS, el 400 en vez
del 422 ante un tipo equivocado, el `detalle` en inglés de Pydantic: **ninguna se
habría visto sin un contrato común**, porque cada framework por separado se
comportaba de forma razonable.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /tareas/1` | `200` con la tarea |
| `GET /tareas/999` | `404` · `NO_EXISTE` |
| `POST` con título en blanco | `422` · `VALIDACION` |
| `POST` válido | `201` + `Location: /tareas/2` |
| `DELETE /tareas/2` | `204` sin cuerpo |
| `GET /tareas/2` | `404` |

Seis casos que recorren lo esencial de la parte 1 y la parte 3. Deliberadamente
modesto: **el contrato no está para lucirse, está para ser el mismo**.

## 🌐 Lo que el verificador no sabe

```bash
node scripts/run-class.mjs 049
```

El verificador arranca un proceso, espera al puerto, envía peticiones HTTP y
compara respuestas. **No importa qué hay dentro.**

Esa ignorancia es la propiedad valiosa: es la misma que tiene un cliente real. Un
navegador o una aplicación móvil tampoco saben si detrás hay Express o Spring
Boot — solo ven códigos, cabeceras y cuerpos.

Probar exactamente eso, y nada más, es lo que hace que la prueba sobreviva a un
refactor, a un cambio de biblioteca y hasta a un cambio de framework. Freeman y
Pryce lo defienden como la propiedad que distingue una prueba útil de una que
solo repite la implementación [@freeman-pryce-goos].

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
PORT=3000 java -jar target/clase-049-1.0.0.jar --server.port=3000
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
| `Clase049.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Esta clase no enseña una capacidad nueva: **enseña el método del programa**, y
por eso sus cuatro implementaciones son deliberadamente sencillas — leer, crear,
borrar.

Lo interesante no es el código. Es que **ninguna sabe que las otras existen**,
ninguna comparte una línea, y el verificador no sabe qué framework hay al otro
lado del socket. Léelas buscando el parecido, no la diferencia.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs)

```javascript
app.get("/tareas/:id", (peticion, respuesta) => {
  const tarea = tareas.get(peticion.params.id);
  return tarea ? respuesta.json(tarea) : respuesta.status(404).json({ code: "NO_EXISTE" });
});
```

```javascript
  const titulo = peticion.body?.titulo;
  if (typeof titulo !== "string" || titulo.trim() === "") {
    return respuesta.status(422).json({ code: "VALIDACION" });
  }
```

```javascript
  respuesta.status(201).location(`/tareas/${id}`).json(tarea);
```

Fíjate en `titulo.trim() === ""`. El tercer caso del contrato envía `"   "` —tres
espacios— precisamente porque **una cadena de espacios no es una cadena vacía** y
un `if (!titulo)` la dejaría pasar.

Ese caso está en el contrato para que los cuatro tengan que recortar antes de
comprobar. Es un ejemplo pequeño de lo que hace un buen contrato: **elegir la
entrada que separa las implementaciones correctas de las que casi lo son**.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

```python
def crear(cuerpo: Cuerpo) -> Response:
    if not cuerpo.titulo.strip():
        return JSONResponse({"code": "VALIDACION"}, status_code=422)
```

```python
    return JSONResponse(tarea, status_code=201,
                        headers={"location": f"/tareas/{identificador}"})
```

Lo mismo. Y una decisión declarada: el modelo `Cuerpo` **no** valida el título
con `min_length`, aunque podría. Se valida a mano para que el `422` lo emita el
código del contrato y no el mecanismo de Pydantic, y así las cuatro respuestas
sean idénticas — la clase 040 mide exactamente esa diferencia.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
        Object titulo = cuerpo == null ? null : cuerpo.get("titulo");
        String texto = titulo == null ? "" : titulo.toString().trim();
        if (texto.isEmpty()) {
            return ResponseEntity.status(422).body(Map.of("code", "VALIDACION"));
        }
```

```java
        return ResponseEntity.created(URI.create("/tareas/" + id)).body(tarea);
```

`created(URI)` otra vez: el `201` y su `Location` atados por el tipo, como en la
clase 003.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
app.MapGet("/tareas/{id}", (string id) =>
    tareas.TryGetValue(id, out var tarea)
        ? Results.Json(tarea)
        : Results.Json(new { code = "NO_EXISTE" }, statusCode: 404));
```

```csharp
    return Results.Created($"/tareas/{id}", tarea);
```

```csharp
app.MapDelete("/tareas/{id}", (string id) =>
    tareas.TryRemove(id, out _)
        ? Results.NoContent()
        : Results.Json(new { code = "NO_EXISTE" }, statusCode: 404));
```

Tres rutas en tres expresiones. Es la más compacta de las cuatro, y sigue
haciendo exactamente lo mismo.

### Por qué esto es una prueba y no una demostración

```json
    {
      "nombre": "crear con entrada inválida",
      "peticion": { "metodo": "POST", "ruta": "/tareas", "cuerpo": { "titulo": "   " } },
      "esperado": { "estado": 422, "json_contiene": { "code": "VALIDACION" } }
    },
```

El contrato de esta clase es **el mismo archivo** para las cuatro. No hay
adaptador, no hay una suite por framework, no hay una capa que traduzca. El
verificador abre un socket, envía la petición y compara.

Y eso tiene una consecuencia que vale la clase entera: **si las pruebas fueran
distintas para cada implementación, «pasa» significaría cosas distintas** y la
comparación no compararía nada.

Es la razón de que este repositorio no tenga una carpeta de pruebas por
framework. Meszaros lo formula desde el otro lado —una prueba mide lo que su
autor decidió medir [@meszaros-xunit]—, y aquí el autor es uno solo para las
cuatro.

## 🔬 Comparación

| Framework | Líneas del servidor | Casos que pasa |
| --- | --- | --- |
| Express | 30 | 6 de 6 |
| FastAPI | 38 | 6 de 6 |
| Spring Boot | 62 | 6 de 6 |
| ASP.NET Core | 35 | 6 de 6 |

La columna de la derecha es idéntica **a propósito**. Es el resultado que hace
comparable la columna de la izquierda: si los cuatro cumplen lo mismo, entonces
las diferencias de longitud, de estilo y de ceremonia se pueden discutir sin que
nadie tenga que aclarar «ya, pero el mío también hace X».

## 🧭 Dónde encaja esto en una estrategia de pruebas

Este contrato es una **prueba de comportamiento externo**: arranca el sistema y
lo usa por su interfaz pública.

| Nivel | Qué prueba | Coste | Qué no ve |
| --- | --- | --- | --- |
| Unidad | una función | mínimo | la integración |
| Integración | varias piezas | medio | el contrato HTTP |
| **Contrato** | **el comportamiento externo** | alto | los caminos internos |

No sustituye a las otras: **es lenta y no dice dónde está el fallo**, solo que
existe. Lo que aporta es que **no se puede engañar**: no conoce nombres de
funciones ni estructuras internas, así que un refactor completo la deja intacta y
un cambio de comportamiento la rompe siempre.

La clase 126 desarrolla el reparto entre niveles.

## ⚠️ Errores frecuentes

- **Una batería por framework.** Cada uno pasa su examen y la comparación se
  evapora.
- **Adaptadores por implementación.** El adaptador acaba tapando la diferencia
  que querías ver.
- **Probar detalles internos.** Se rompe con cada refactor y no detecta nada.
- **Contrato demasiado estricto.** Exigir más de lo que exige el estándar mide la
  implementación — el error que esta parte cometió tres veces.
- **Contrato demasiado laxo.** Pasa todo y no garantiza nada.
- **Solo el camino feliz.** Los errores también son contrato.

## ✅ Verificación

```bash
node scripts/run-class.mjs 049
```

## 🧪 Reto de transferencia

Escribe una **quinta implementación** en el framework que quieras —Flask, Gin,
Laravel, el que sea—, añádela a la carpeta con su `ejecutar.json`, y consíguela
en verde **sin tocar el contrato**. Si necesitas cambiar el contrato para que
pase, o el contrato estaba mal o tu implementación no cumple. Averiguar cuál de
las dos es el ejercicio.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 129 — Pruebas de contrato](../../parte-10-calidad-y-operacion/129-pruebas-de-contrato/README.md)
- [Módulo 08 — Calidad, rendimiento y operación](../../../curriculum/08-calidad-rendimiento-y-operacion.md)

## Fuentes

- [@freeman-pryce-goos] Freeman, Steve; Pryce, Nat. *Growing Object-Oriented Software, Guided by Tests*. Addison-Wesley, 2009. ISBN 9780321503626 — <https://openlibrary.org/isbn/9780321503626>
- [@fowler-test-pyramid] Fowler, Martin. *TestPyramid* — <https://martinfowler.com/bliki/TestPyramid.html>
- [@humble-farley-continuous-delivery] Humble, Jez; Farley, David. *Continuous Delivery*. Addison-Wesley, 2010. ISBN 9780321601919 — <https://openlibrary.org/isbn/9780321601919>
- [@meszaros-xunit] Meszaros, Gerard. *xUnit Test Patterns: Refactoring Test Code*. Addison-Wesley, 2007. ISBN 9780131495050 — <https://openlibrary.org/isbn/9780131495050>
