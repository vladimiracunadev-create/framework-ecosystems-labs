# Clase 029 — Registro de peticiones

> [⬅️ 028](../028-terminacion-temprana/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [030 ➡️](../030-identificador-de-correlacion/README.md)
>
> Parte **2 — La tubería** · Nivel **🟢 introductorio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Emitir **una línea por petición** con lo que de verdad sirve para diagnosticar, y
entender por qué esa línea solo puede escribirse al final.

## 🧩 La situación

Cada petición deja una entrada con método, ruta, estado y duración. Una petición
que responde 200 y otra que responde 500 dejan **la misma forma de línea con
estado distinto**.

## 📖 Por qué al final y no al principio

Al entrar sabes el método y la ruta. **No sabes el estado ni la duración**, que
son justo los dos campos por los que se busca cuando algo va mal.

Por eso las cuatro implementaciones registran al terminar:

| Framework | Momento |
| --- | --- |
| Express | evento `finish` de la respuesta |
| FastAPI | después de `await siguiente(peticion)` |
| ASP.NET Core | después de `await siguiente()` |
| Spring Boot | después de `cadena.doFilter(...)` |

Es la parte de vuelta de la pila de la clase 027: **el código después de continuar
se ejecuta con la respuesta ya hecha**.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /ok` | `200` |
| `GET /falla` | `500` |
| `GET /registro` | las dos líneas, con su estado real |

El contrato comprueba que el 500 **se registró como 500**. Un registro que
anotara 200 para todo sería peor que no tenerlo: daría confianza falsa.

## 🔍 Un detalle que costó una corrección

La consulta a `/registro` **no se registra a sí misma**. Sin esa exclusión, mirar
el registro lo ensucia, y en un panel que consulta cada segundo el ruido tapa el
tráfico real.

La primera versión de Express funcionaba por accidente: el evento `finish` llega
después de construir el cuerpo, así que la línea de `/registro` no aparecía en la
respuesta que devolvía. **Pasaba la prueba por temporización, no por diseño.** Se
hizo explícita, como en los otros tres.

Es un ejemplo pequeño de algo importante: **una prueba verde no significa que el
código sea correcto**, significa que en esa ejecución se comportó como se
esperaba.

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
PORT=3000 java -jar target/clase-029-1.0.0.jar --server.port=3000
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
| `Clase029.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las cuatro registran **al terminar**, no al entrar, y las cuatro excluyen la
consulta del propio registro. Las dos decisiones son el contenido de la clase, y
las dos se ven en el código.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — el registro va en un evento

```javascript
app.use((peticion, respuesta, siguiente) => {
  const inicio = process.hrtime.bigint();
  respuesta.on("finish", () => {
```

```javascript
    if (peticion.path === "/registro") return;
```

```javascript
    registro.push({
      metodo: peticion.method,
      ruta: peticion.path,
      estado: respuesta.statusCode,
```

**`respuesta.on("finish", …)` y no una línea después de `siguiente()`.** Esa es
la diferencia que define la implementación de Express, y viene de su modelo: la
capa devuelve el control antes de que la respuesta se haya enviado, así que
`respuesta.statusCode` leído justo después de `siguiente()` todavía no es el
definitivo.

El estado **no se conoce al entrar**. Registrar al entrar produce un registro que
dice qué se pidió y no dice qué pasó, que es la mitad inútil de la información.

Y `process.hrtime.bigint()` en vez de `Date.now()`: es un reloj monótono, así que
un ajuste de hora del sistema a mitad de la petición no produce duraciones
negativas.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — el registro va después del await

```python
    inicio = time.perf_counter()
    respuesta = await siguiente(peticion)
    duracion = time.perf_counter() - inicio
```

```python
    if peticion.url.path != "/registro":
        registro.append({
            "metodo": peticion.method,
            "ruta": peticion.url.path,
            "estado": respuesta.status_code,
            "medido": duracion >= 0,
        })
    return respuesta
```

Aquí **no hace falta un evento**, y es consecuencia directa de la clase 028: la
capa de Starlette *devuelve* la respuesta, así que después del `await` el objeto
respuesta ya existe y su estado es el definitivo.

`time.perf_counter()` es el reloj monótono de Python — mismo criterio que
`hrtime` en Node.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
            long inicio = System.nanoTime();
            cadena.doFilter(peticion, respuesta);
            long duracion = System.nanoTime() - inicio;
```

```java
            if (!"/registro".equals(p.getRequestURI())) {
                Map<String, Object> linea = new LinkedHashMap<>();
                linea.put("metodo", p.getMethod());
                linea.put("ruta", p.getRequestURI());
                linea.put("estado", ((HttpServletResponse) respuesta).getStatus());
```

Lo mismo, con la estructura de un filtro: lo que va después de `doFilter` se
ejecuta al volver, y ahí `getStatus()` ya es el definitivo.

`System.nanoTime()` completa el trío de relojes monótonos. **Los tres
ecosistemas tienen uno y los tres lo usan aquí**: cuando algo se repite en los
cuatro, casi siempre es que el problema lo impone el dominio.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
    var reloj = Stopwatch.StartNew();
    await siguiente();
    reloj.Stop();
```

```csharp
    if (contexto.Request.Path != "/registro")
    {
        registro.Add(new
        {
            metodo = contexto.Request.Method,
            ruta = contexto.Request.Path.Value,
            estado = contexto.Response.StatusCode,
```

`Stopwatch` es el reloj monótono de .NET, y es el único de los cuatro que tiene
**nombre de objeto en lugar de nombre de función**. Da igual para el resultado y
dice algo del estilo de cada plataforma.

### Las dos decisiones, y por qué están

**Registrar al terminar.** Sin el estado, el registro no responde a la pregunta
para la que se escribió: *qué salió mal*.

**No registrar la consulta del registro.** Mirar el registro no es tráfico de la
aplicación. Contarlo lo ensucia — y en un sistema real, una sonda que consulta
cada cinco segundos acaba siendo la ruta más frecuente del informe.

Y una declaración honesta sobre el campo `medido`: el contrato comprueba que la
duración **se midió**, no cuánto. Afirmar un número concreto haría el contrato
dependiente de la máquina, y este repositorio prefiere medir el mecanismo antes
que fingir que mide el rendimiento — la clase 007 desarrolla por qué.

## 🔬 Comparación

| Framework | Momento del registro | ¿Trae registro de peticiones? |
| --- | --- | --- |
| ASP.NET Core | tras `await siguiente()` | sí, configurable |
| Spring Boot | tras `cadena.doFilter` | sí, desactivado por omisión |
| FastAPI | tras `await siguiente(peticion)` | no |
| Express | evento `finish` | no |

Los dos primeros lo traen y ninguno lo activa con el formato que querrías: en
los cuatro acabas escribiendo la capa para controlar qué campos salen.

## 📖 Qué debe llevar la línea

| Campo | Por qué |
| --- | --- |
| método y ruta | qué se pidió |
| estado | cómo acabó |
| duración | si fue lento y cuánto |
| identificador de correlación | para unir esta línea con las de otros servicios — clase 030 |
| usuario o inquilino | para filtrar por afectado |

Y qué **no** debe llevar, porque acaba en un sistema que mucha gente puede leer:
contraseñas, credenciales, tarjetas, datos personales y cuerpos completos de
petición.

La ruta con parámetros merece un cuidado especial: registrar
`/usuarios/12345/token/abcdef` mete un secreto en el registro. Conviene registrar
**la plantilla** —`/usuarios/:id/token/:valor`— y no el valor.

## 📊 El paso siguiente: texto o estructura

Estas cuatro implementaciones acumulan objetos, que es lo que hace verificable el
contrato. En producción la decisión real es otra:

- **Texto plano** — legible por una persona, penoso de consultar.
- **JSON por línea** — feo de leer, y **consultable**: «todas las peticiones con
  estado 500 y duración mayor de un segundo» es una consulta, no un `grep` con
  expresiones regulares.

La clase 130 desarrolla esa decisión, y Majors y sus coautores la enmarcan en algo
más amplio: un sistema es observable cuando puedes responder preguntas que no
habías previsto [@majors-observability]. Una línea de texto libre no lo permite;
un objeto con campos estables, sí.

## ⚠️ Errores frecuentes

- **Registrar al entrar.** Te pierdes el estado y la duración.
- **Registrar secretos.** Contraseñas o credenciales en un sistema que mucha
  gente lee.
- **Registrar el cuerpo completo.** Volumen y datos personales.
- **Registrar la ruta con sus valores** en lugar de la plantilla.
- **Registrar la propia consulta del registro.** Ruido que se realimenta.
- **Registrar en texto libre** y descubrir a los seis meses que no se puede
  consultar.

## ✅ Verificación

```bash
node scripts/run-class.mjs 029
```

## 🧪 Reto de transferencia

Cambia las cuatro implementaciones para emitir **una línea JSON** por petición en
la salida estándar, con campos idénticos en los cuatro. Después comprueba que
`node scripts/run-class.mjs 029` sigue en verde: el contrato no cambia porque el
formato del registro no es parte del contrato HTTP.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 030 — Identificador de correlación](../030-identificador-de-correlacion/README.md)
- [Módulo 08 — Calidad, rendimiento y operación](../../../curriculum/08-calidad-rendimiento-y-operacion.md)

## Fuentes

- [@majors-observability] Majors, Charity; Fong-Jones, Liz; Miranda, George. *Observability Engineering*. O'Reilly Media, 2022. ISBN 9781492076445 — <https://openlibrary.org/isbn/9781492076445>
- [@beyer-sre] Beyer, Betsy; Jones, Chris; Petoff, Jennifer; Murphy, Niall Richard. *Site Reliability Engineering*. O'Reilly Media, 2016. ISBN 9781491929124 — <https://openlibrary.org/isbn/9781491929124>
