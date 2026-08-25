# Clase 062 — Caché de lectura

> [⬅️ 061](../061-grupo-de-conexiones/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [063 ➡️](../063-bases-no-relacionales/README.md)
>
> Parte **4 — Datos** · Nivel **🔴 avanzado** · Pista **`datos`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Evitar la consulta repetida — y **aceptar el coste de la invalidación**, que es
la parte que nadie cuenta cuando propone una caché.

## 🧩 La situación

Una tarea que se lee dos veces, se modifica, se vuelve a leer. Y después una
escritura que **olvida invalidar**.

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
PORT=3000 java -jar target/clase-062-1.0.0.jar --server.port=3000
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
| `Clase062.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las cuatro cuentan **consultas al almacén** y **aciertos de caché**, que es lo
único que distingue una lectura cacheada de una que no lo está: el cuerpo de la
respuesta es idéntico. Por eso todas exponen `/metricas` — sin ese contador, una
caché no se puede demostrar ni desmentir.

Y las cuatro tienen las mismas cinco rutas: leer por la caché, leer sin ella,
escribir invalidando, escribir **sin** invalidar, y reiniciar.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs)

**La caché es un `Map`. Eso es el hallazgo, no la carencia:**

```javascript
const cache = new Map();
```

Express no trae ninguna. Con un solo proceso funciona; con tres instancias detrás
de un balanceador, **cada una tiene su propia caché** y la invalidación de una no
alcanza a las otras. Ese es el momento exacto en que hace falta algo compartido,
como Redis — y no antes.

**Mirar, y si no está, consultar y guardar:**

```javascript
  if (cache.has(id)) {
    aciertos += 1;
    respuesta.set("X-Cache", "HIT").json(cache.get(id));
    return;
  }
```

```javascript
  cache.set(id, { ...tarea });
  respuesta.set("X-Cache", "MISS").json(tarea);
```

Se guarda **una copia**. Guardar la referencia dejaría que quien reciba la
respuesta modifique la entrada de la caché sin querer, y ese error es
prácticamente imposible de encontrar después.

**Borrar, no reescribir:**

```javascript
  cache.delete(id);
  respuesta.json(tarea);
```

Escribir el valor nuevo en la caché parece más eficiente y **abre una carrera**:
dos escrituras simultáneas pueden dejar guardado el valor de la que perdió.
Borrar solo puede causar una consulta de más.

**Y el fallo, que no falla:**

```javascript
app.post("/escribir-sin-invalidar", (peticion, respuesta) => {
  const tarea = almacen.get(1);
  tarea.titulo = String(peticion.body?.titulo ?? tarea.titulo);
  respuesta.json({ ok: true });
});
```

No hay excepción ni registro. A partir de ahí la caché devuelve un valor que **ya
no existe en ninguna parte**, y lo hará hasta que caduque o alguien reinicie el
proceso. El contrato lo comprueba porque es el único modo de que se vea.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

La misma estructura, y la misma ausencia:

```python
cache: dict[int, dict[str, Any]] = {}
```

```python
    if id_tarea in cache:
        contadores["aciertos"] += 1
        return JSONResponse(cache[id_tarea], headers={"X-Cache": "HIT"})
```

```python
    cache[id_tarea] = dict(tarea)
    return JSONResponse(tarea, headers={"X-Cache": "MISS"})
```

`dict(tarea)` es la copia, igual que el `{ ...tarea }` de Express.

```python
    cache.pop(id_tarea, None)
    return JSONResponse(tarea)
```

Con un detalle propio de Python que conviene tener presente: el aviso del
comentario no es teórico. **Con `--workers 4`, cada proceso tiene su propio
diccionario** — y como el arranque típico de FastAPI en producción es
precisamente con varios trabajadores, la caché en memoria de proceso se rompe
antes aquí que en Node.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — la única declarativa

Spring es **el único de los cuatro con una caché declarativa de serie**:

```java
@SpringBootApplication
@EnableCaching
public class Aplicacion {
```

```java
        @Cacheable(cacheNames = "tareas", key = "#id")
        public Map<String, Object> leer(int id) {
            consultas.incrementAndGet();
```

`@Cacheable` es todo el mecanismo: si la clave está, **devuelve lo guardado sin
entrar al método**; si no, entra y guarda lo que devuelva. De ahí que el contador
de consultas viva *dentro* — solo sube cuando el cuerpo se ejecuta de verdad.

```java
        @CacheEvict(cacheNames = "tareas", key = "#id")
        public Map<String, Object> modificar(int id, String titulo) {
```

Existe también `@CachePut`, que escribe el valor nuevo. Misma carrera, misma
recomendación: **evict, no put**.

**Y aquí está el precio de lo declarativo:**

```java
            int antes = almacen.consultas();
            Map<String, Object> tarea = almacen.leer(id);
```

`@Cacheable` **no dice si acertó**: o entra al método o no entra. La única forma
de saberlo es mirar si el contador subió. Es la contrapartida exacta de que la
caché sea invisible en el código: cómoda de escribir, opaca de observar.

```java
        public void escribirSinInvalidar(String titulo) {
            filas.get(1).put("titulo", titulo);
        }
```

El mismo método sin `@CacheEvict`. **La diferencia entre lo correcto y lo roto es
una anotación que no está**, y nada en el cuerpo del método lo insinúa. En
Express el `cache.delete` que falta al menos se echa de menos leyendo; aquí no.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — explícita, pero del framework

```csharp
constructor.Services.AddMemoryCache();
```

Sin esa línea, inyectar `IMemoryCache` **falla al arrancar**. Es una caché
explícita —se llama a mano, como el `Map` de Express— y a la vez del framework:
trae caducidad, tamaño máximo y desalojo incorporados.

```csharp
    if (cache.TryGetValue(id, out Tarea? guardada) && guardada is not null)
    {
        Interlocked.Increment(ref aciertos);
```

**La caducidad, siempre:**

```csharp
    cache.Set(id, tarea, TimeSpan.FromMinutes(5));
```

Sin ella, una entrada que nadie invalide se queda ahí para siempre y la memoria
del proceso solo crece. Es la tercera de las tres preguntas de cualquier caché, y
la que más se olvida.

**Y una limitación que merece leerse, porque explica una práctica real:**

```csharp
    foreach (var id in almacen.Keys) cache.Remove(id);
```

`IMemoryCache` **no tiene «vaciar»**: hay que quitar las claves que conoces. Por
eso en producción se antepone un prefijo de versión a la clave —`v7:tarea:1`— y
subir el número invalida todo en bloque sin recorrer nada. La misma técnica sirve
en Redis, donde recorrer claves es aún peor idea.

**El contraste completo, en una línea por framework:** Express y FastAPI no traen
caché y se ve dónde está; Spring la trae y no se ve; ASP.NET la trae y se ve. Las
tres posiciones son defendibles — lo que no es defendible es no saber en cuál
estás.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /reiniciar` | `consultas: 0`, `aciertos: 0` |
| `GET /tareas/1` | "comprar pan" |
| `GET /metricas` | `consultas: 1`, `aciertos: 0` |
| `GET /tareas/1` | **lo mismo** |
| `GET /metricas` | **`consultas: 1`**, `aciertos: 1` |
| `PATCH /tareas/1` "regar" | `200` |
| `GET /tareas/1` | **"regar"** |
| `GET /metricas` | `consultas: 2`, `aciertos: 1` |
| `POST /escribir-sin-invalidar` "fantasma" | `ok` |
| `GET /tareas/1` | **"regar"** ← *miente* |
| `GET /sin-cache/tareas/1` | **"fantasma"** |

**Los dos últimos casos son la clase.** El contrato no comprueba que la caché
funcione: comprueba que **miente cuando se olvida invalidarla**, y lo comprueba
con una lectura directa al almacén que dice otra cosa.

Es el fallo más caro de esta categoría, y su forma es siempre esta: no hay
excepción, no hay registro, no hay nada. Solo un dato viejo que se sirve como si
fuera nuevo.

## 📖 Las tres preguntas de cualquier caché

Ninguna caché está bien diseñada hasta que las tres tienen respuesta:

1. **¿Qué se guarda?** Una entidad, una consulta, una respuesta HTTP entera.
2. **¿Cuándo deja de valer?** Por tiempo, por invalidación explícita, o las dos.
3. **¿Quién más la tiene?** Si hay tres instancias, hay tres cachés.

La tercera es la que más se olvida y la que más rompe:

```javascript
const cache = new Map();   // esta caché vive en ESTE proceso
```

Con un solo proceso funciona. Con tres instancias detrás de un balanceador, la
invalidación de una **no alcanza a las otras dos**, y el dato viejo sigue
sirviéndose desde ellas. Ese es el momento en que hace falta una caché
compartida — Redis, Memcached— y con ella llega otra red que puede fallar.

## 🌐 Declarativa frente a explícita

Spring es el único de los cuatro con una caché **declarativa**:

```java
@Cacheable(cacheNames = "tareas", key = "#id")
public Map<String, Object> leer(int id) { ... }   // no se entra si ya está

@CacheEvict(cacheNames = "tareas", key = "#id")
public Map<String, Object> modificar(int id, String titulo) { ... }
```

No hay ningún mapa a la vista. El método se lee como si no hubiera caché, y esa
es a la vez su virtud y su trampa: **el código no dice dónde está la caché ni
cuándo se vacía**.

Los otros tres son explícitos:

```csharp
if (cache.TryGetValue(id, out Tarea? guardada)) { ... }   // ASP.NET Core
cache.Set(id, tarea, TimeSpan.FromMinutes(5));
```

```javascript
if (cache.has(id)) { ... }                                // Express
```

Y hay una asimetría que conviene ver: **Express y FastAPI no traen caché**. Lo
que hay en sus implementaciones es un `Map` y un diccionario. No es una carencia
del ejemplo — es el hallazgo: en esos ecosistemas la caché es una decisión que
tomas tú, con una biblioteca que eliges tú.

## ⚠️ Borrar, no reescribir

```javascript
cache.delete(id);            // sí
cache.set(id, valorNuevo);   // parece mejor, y no lo es
```

Reescribir la entrada ahorra una consulta y abre una carrera:

1. La escritura A pone el título en «uno».
2. La escritura B pone el título en «dos».
3. B guarda «dos» en la caché.
4. **A guarda «uno»** — llegó más tarde por casualidad.

El almacén tiene «dos» y la caché dice «uno», indefinidamente. Borrar no puede
producir eso: lo peor que pasa es una consulta de más.

Spring ofrece las dos —`@CacheEvict` y `@CachePut`— y esta es la razón de
preferir la primera.

## ⚠️ Siempre una caducidad

```csharp
cache.Set(id, tarea, TimeSpan.FromMinutes(5));
```

Aunque invalides bien. Por dos razones:

- **Memoria.** Una entrada que nadie invalida se queda para siempre, y la caché
  sin límite es una fuga de memoria con otro nombre.
- **Errores.** El día que se te escape una invalidación —y se te escapará— la
  caducidad pone un techo al daño: cinco minutos de dato viejo en lugar de
  indefinido.

La caducidad no sustituye a la invalidación: **la respalda**.

## 🔬 Comparación

| Framework | Caché de serie | Cómo se usa | Caducidad | Vaciar entera |
| --- | --- | --- | --- | --- |
| Express | **no** | un `Map`, o una biblioteca | a mano | `clear()` |
| FastAPI | **no** | un diccionario, o una biblioteca | a mano | `clear()` |
| Spring Boot | **sí**, abstracta | `@Cacheable` / `@CacheEvict` | según el proveedor | `cache.clear()` |
| ASP.NET Core | **sí**, `IMemoryCache` | explícita, `TryGetValue` / `Set` | incorporada | **no se puede** |

Dos detalles de la tabla que sorprenden al usarlos:

**Spring abstrae el proveedor.** `@Cacheable` funciona igual con un mapa en
memoria, con Caffeine o con Redis: se cambia una dependencia y el código no se
toca. Es la ventaja real de que sea declarativa.

**`IMemoryCache` no sabe vaciarse.** Solo se pueden quitar claves conocidas. Por
eso en producción se usa un prefijo de versión en la clave —`v3:tarea:1`— y
«vaciar» consiste en subir el número.

## ⚠️ Errores frecuentes

- **Olvidar invalidar.** El caso del contrato. No avisa.
- **Guardar la referencia en vez de una copia.** Quien reciba la respuesta puede
  modificar la entrada de la caché sin querer.
- **Reescribir la entrada al escribir.** Carrera.
- **Cachear sin caducidad.** Fuga de memoria y errores indefinidos.
- **Cachear en el proceso con varias instancias.** Cada una miente por su lado.
- **Cachear datos por usuario con una clave global.** El fallo más grave de
  todos: servirle a alguien los datos de otro.
- **Cachear antes de medir.** Sin la clase 056 hecha, no sabes si el problema
  era la consulta repetida o una consulta lenta.

## ✅ Verificación

```bash
node scripts/run-class.mjs 062
```

## 🧪 Reto de transferencia

Arranca **dos** instancias en puertos distintos sobre el mismo almacén. Modifica
en una y lee en la otra: la segunda seguirá devolviendo el valor viejo, con el
código correcto y la invalidación bien escrita. Es la forma más rápida de
entender por qué la caché compartida existe.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 048 — ETags y caché condicional](../../parte-3-validacion-y-contrato/048-etags-y-cache-condicional/README.md)
- [Clase 056 — El problema N+1](../056-el-problema-n-1/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@rfc9111] Fielding, Roy T.; Nottingham, Mark; Reschke, Julian. *RFC 9111: HTTP Caching*. IETF, 2022. — <https://www.rfc-editor.org/rfc/rfc9111>
