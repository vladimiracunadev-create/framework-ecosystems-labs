# Clase 075 — Secretos y configuración

> [⬅️ 074](../074-inyeccion-sql/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [076 ➡️](../076-auditoria/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🟡 intermedio** · Pista **`plataforma`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Sacar del código **lo que no puede estar en el repositorio**. Un secreto en
el código es un secreto publicado: vive en el historial de git para siempre,
lo ve todo el que clona, y rotarlo obliga a un commit. La configuración
—secretos incluidos— entra por **el entorno**, no por el fuente
[@twelve-factor].

## 🧩 La situación

La aplicación necesita dos cosas para arrancar: en qué entorno corre y un
secreto. Las dos vienen de variables de entorno. Si falta alguna, **la
aplicación no arranca** — y lo dice claro, nombrando lo que falta. Si están,
arranca y reporta su configuración **sin revelar nunca el secreto**.

## 🧮 El contrato

| Petición | Respuesta | Qué mide |
| --- | --- | --- |
| `GET /configuracion` | `entorno: "pruebas"`, `secreto_presente: true` | la config viene del entorno |
| `GET /configuracion` | **no contiene** el valor del secreto | se reporta presencia, no valor |
| `POST /validar` con las dos claves | `valida: true` | el validador acepta lo completo |
| `POST /validar` sin `APP_SECRETO` | `422`, **nombra** `APP_SECRETO` | falla claro y dice qué falta |
| `POST /validar` con `{}` | `422`, nombra **las dos** | enumera todo, no solo lo primero |

El validador de `/validar` es **el mismo** que corre en el arranque: la regla
que decide si la aplicación puede levantar es la que responde el endpoint.
Eso hace medible por HTTP algo que ocurre antes de la primera petición — que
la aplicación **no habría arrancado** sin las variables es, de hecho, lo que
prueba que las lee: el verificador les da valor por su campo `env`, y si no
lo hiciera, ninguna de las cuatro escucharía.

El último caso mide un detalle que cuesta despliegues reales: enumerar
**todo** lo que falta de una vez. Un validador que se rinde en la primera
variable ausente convierte «faltan tres» en tres arranques fallidos
seguidos.

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
- **Versión que ejecuta esta clase:** `fastapi>=0.115, uvicorn>=0.30`
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
PORT=3000 java -jar target/clase-075-1.0.0.jar --server.port=3000
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
| `Clase075.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Aquí el reparto **se invierte** respecto a las clases de autorización: el
framework con más ceremonia trae más ayuda, y el minimalista te deja la regla
entera. Y las cuatro comparten un gesto que es el contenido de la clase — **el
mismo validador lo usan el arranque y el endpoint**.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — la regla, entera y tuya

```javascript
const REQUERIDAS = ["APP_ENTORNO", "APP_SECRETO"];
```

```javascript
function validar(fuente) {
  const faltan = REQUERIDAS.filter((clave) => !fuente[clave]);
  return { valida: faltan.length === 0, faltan };
}
```

```javascript
const arranque = validar(process.env);
if (!arranque.valida) {
  console.error(`Configuración incompleta, faltan: ${arranque.faltan.join(", ")}`);
  process.exit(1);
}
```

Nada de esto viene incluido: `process.env` y seis líneas. Y las seis contienen
las dos decisiones que importan.

**Ninguna clave tiene valor por omisión.** Un secreto con valor por defecto es
un secreto que alguien olvidó poner y que corre en producción con la clave del
ejemplo.

**El validador devuelve todas las que faltan, no la primera.** Quien despliega
sin tres variables no quiere descubrirlas de una en una, en tres despliegues
fallidos seguidos.

Y `process.exit(1)`: **el proceso no llega a escuchar**. Fallar al arrancar es
la única forma de no fallar en la primera petición del primer usuario.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — el mejor equipado

```python
_faltan = validar(dict(os.environ))
if _faltan:
    raise RuntimeError(f"Configuración incompleta, faltan: {', '.join(_faltan)}")
```

La implementación usa un validador explícito **para medir el mismo mensaje en
los cuatro**, pero conviene saber que la vía idiomática de FastAPI es más
corta: `pydantic-settings` (`BaseSettings`) lee el entorno, convierte tipos y
**falla al construirse** si falta una obligatoria. La validación *es* la
declaración de la clase — la misma idea que en la clase 013, aplicada a la
configuración.

### Spring Boot · [`spring-boot/…/application.properties`](implementaciones/spring-boot/src/main/resources/application.properties)

```properties
app.entorno=${APP_ENTORNO:}
app.secreto=${APP_SECRETO:}
```

Y en [`Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java):

```java
    @Value("${app.entorno:}")
    private String entorno;
```

```java
    @jakarta.annotation.PostConstruct
    void comprobarArranque() {
```

```java
        if (!faltan.isEmpty()) {
            throw new IllegalStateException("Configuracion incompleta, faltan: " + String.join(", ", faltan));
        }
```

Dos saltos: el entorno entra en `application.properties` como `app.entorno` y
`@Value` lo inyecta en el campo. El `:` final del marcador declara valor por
omisión vacío — **deliberadamente vacío**, para que sea el validador quien
decida, y no un valor por defecto silencioso.

`@PostConstruct` es la pieza del ciclo de vida (clase 037): corre cuando el
objeto ya está construido e inyectado, y lanzar ahí **aborta el contexto
entero**. La aplicación no termina de levantar.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — una fuente ordenada

```csharp
List<string> Validar(Func<string, string?> fuente) =>
    requeridas.Where(clave => string.IsNullOrEmpty(fuente(clave))).ToList();
```

```csharp
var faltanArranque = Validar(clave => constructor.Configuration[clave]);
if (faltanArranque.Count > 0)
{
    throw new InvalidOperationException(
        $"Configuración incompleta, faltan: {string.Join(", ", faltanArranque)}");
}
```

`IConfiguration` unifica variables de entorno, `appsettings.json` y argumentos
de línea de comandos en **una sola fuente con orden de precedencia declarado**.
Es la aportación real de este framework a la clase: el código no necesita saber
de dónde vino cada valor, y cambiar el origen no cambia el código.

Fíjate en que `Validar` recibe **una función** y no un diccionario: es lo que
permite que el mismo validador consulte `IConfiguration` al arrancar y un
diccionario del cuerpo en el endpoint.

### Lo que ninguna de las cuatro deja salir

```javascript
  respuesta.json({
    entorno: config.entorno,
    secreto_presente: Boolean(config.secreto),
    secreto: "****",
  });
```

Las cuatro reportan **la presencia del secreto, no su valor**. Un endpoint de
configuración que devuelve el secreto es exactamente el agujero que esta clase
viene a cerrar, y aparece más veces de lo que parece: empieza como una ayuda de
diagnóstico en desarrollo y nadie la quita.

## 📊 Comparación

| Framework | De dónde lee | La validación | El secreto en el reporte |
| --- | --- | --- | --- |
| FastAPI | `BaseSettings` | al construir el objeto | enmascarado |
| Spring Boot | `application.properties` ← entorno | `@PostConstruct` | enmascarado |
| ASP.NET Core | `IConfiguration` (fuentes en capas) | antes de `Build()` | enmascarado |
| Express | `process.env` | validador propio | enmascarado |

La diferencia no es de seguridad —los cuatro fallan al arrancar y ninguno
filtra el secreto— sino de **cuánto código pones tú**. Y el orden de fuentes
de ASP.NET (`appsettings` < entorno < argumentos) es la respuesta a un
problema real que las otras resuelven a mano: qué gana cuando la misma clave
está en dos sitios.

## 🔑 Qué es un secreto y qué no

- **Configuración**: en qué entorno corres, a qué URL apuntas, cuántos
  trabajadores. No es sensible; cambia entre despliegues. Puede ir en un
  fichero versionado por entorno.
- **Secreto**: la clave de la base, el token de la API, la clave de firma de
  la clase 067. Su filtración es un incidente. **Nunca** en el repositorio,
  ni siquiera en un `.env` commiteado.

El `.env` es una herramienta de **desarrollo local** —cómodo, y por eso
peligroso— que va siempre en `.gitignore`. En producción, el secreto lo
inyecta la plataforma: variables del orquestador, un gestor de secretos
(Vault, Secrets Manager), nunca un fichero en la imagen [@owasp-cheatsheets].

## ⚠️ Errores frecuentes

- **El secreto con valor por omisión.** `APP_SECRETO ?? "cambiar-esto"`
  arranca sin protestar y corre en producción con la clave del ejemplo. Sin
  valor por defecto, el arranque falla — que es lo que quieres.
- **Fallar en la primera petición, no al arrancar.** Un secreto que solo se
  lee cuando se usa esconde la falta hasta que un usuario la encuentra.
- **Loguear la configuración completa al arrancar.** El secreto acaba en los
  registros, que suelen tener menos protección que la base.
- **Un endpoint de configuración que devuelve el secreto.** El propio
  agujero: el segundo caso del contrato existe por esto.
- **Rendirse en la primera variable ausente.** Enumera todas.
- **`.env` en el repositorio.** Aunque el repositorio sea privado: privado
  hoy no es privado dentro de tres adquisiciones.

## ✅ Verificación

```bash
node scripts/run-class.mjs 075
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta
las implementaciones que encuentre y declara las que omitió, y les inyecta
`APP_ENTORNO` y `APP_SECRETO` por el campo `env` de cada receta.

## 🧪 Reto de transferencia

Añade una clave **tipada**: `APP_MAX_CONEXIONES`, un entero. Haz que el
arranque falle si no es un número (`"muchas"` → error claro con la clave y el
tipo esperado) y añade el caso al contrato. Observa cuál de los cuatro
frameworks te da la conversión y la validación de tipo **gratis** — es la
diferencia entre leer `process.env` y declarar un `BaseSettings`.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 067 — Token de acceso](../067-token-de-acceso/README.md) — la clave
  de firma que esta clase saca del código
- [Clase 078 — Dependencias vulnerables](../078-dependencias-vulnerables/README.md) — la otra mitad de la seguridad de plataforma

## Fuentes

- [@twelve-factor] *The Twelve-Factor App* (III. Config). — <https://12factor.net/>
- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (Secrets Management). OWASP — <https://cheatsheetseries.owasp.org/>
- [@nist-ssdf] *SP 800-218 — Secure Software Development Framework (SSDF)*. NIST — <https://csrc.nist.gov/projects/ssdf>
