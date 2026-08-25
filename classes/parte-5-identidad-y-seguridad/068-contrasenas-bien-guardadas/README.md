# Clase 068 — Contraseñas bien guardadas

> [⬅️ 067](../067-token-de-acceso/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [069 ➡️](../069-oauth-2-0-y-openid-connect/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Almacenar contraseñas de forma que **un volcado de la base de datos no las
revele**. La amenaza que ordena la clase no es «me roban una contraseña»: es
«me roban la tabla entera», y contra eso la única defensa es que lo guardado
no sea la contraseña — ni nada que permita recuperarla [@owasp-cheatsheets].

## 🧩 La situación

`POST /usuarios` registra y `POST /entrar` verifica. Entre las dos, la
contraseña se convierte en un **resumen con sal y coste**: la misma
contraseña, registrada dos veces, produce resúmenes distintos — y las dos
verifican.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| registrar a `ana` con `secreta123` | `201` · el resumen, y **la contraseña no aparece en la respuesta** |
| registrar a `bea` con **la misma** `secreta123` | `201` · un resumen **distinto** al de `ana` |
| registrar a `ana` otra vez | `409` |
| entrar con la contraseña correcta | `200` |
| entrar con la incorrecta | `401` |
| entrar con un usuario que no existe | `401` — **el mismo** que la clave mala |

El segundo caso es el que mide la sal: sin ella, dos usuarios con la misma
contraseña comparten resumen, y quien vuelca la tabla lo ve — y ataca una vez
para entrar en dos cuentas. El verificador lo comprueba con `json_distinto`:
guarda el primer resumen y exige que el segundo no coincida.

El último caso mide la **enumeración de usuarios**: si «no existe» respondiera
distinto que «clave mala», el formulario de entrada sería un oráculo de qué
correos están registrados.

> La ruta de registro devuelve el resumen **como ventana de inspección del
> laboratorio**: es lo que el contrato necesita medir. En producción, el
> resumen no sale de la base de datos.

## 📖 Por qué un resumen no basta, y qué le falta

- **Resumen** (SHA-256 a secas) — irreversible, pero idéntico para claves
  idénticas y calculable a miles de millones por segundo en una GPU. Las
  tablas precalculadas lo comen.
- **+ Sal** — un valor aleatorio por usuario, guardado junto al resumen. Mata
  las tablas precalculadas y hace único cada resumen. Es lo que mide el
  segundo caso.
- **+ Coste** — el algoritmo se hace **deliberadamente lento** (bcrypt,
  scrypt, Argon2, PBKDF2). Al usuario le cuesta cien milisegundos una vez; al
  atacante, cien milisegundos **por intento** — y su negocio son los miles de
  millones de intentos [@nist-800-63b].

Los cuatro algoritmos de esta clase escriben la sal y sus parámetros **dentro
del propio resumen** — por eso verificar no necesita configuración, y por eso
se puede subir el coste mañana sin romper los resúmenes de ayer.

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
- **Versión que ejecuta esta clase:** `bcryptjs ^3.0.2, express ^5.1.0`
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
- **Versión que ejecuta esta clase:** `fastapi>=0.115, uvicorn>=0.30, argon2-cffi>=23.1`
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
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web, spring-security-crypto`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-068-1.0.0.jar --server.port=3000
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
- **Versión que ejecuta esta clase:** `net10.0, Microsoft.Extensions.Identity.Core 9.0.0`
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
| `Clase068.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Como en la 067, **ningún framework hace esto solo**: la pieza siempre es una
biblioteca. Y otra vez la elección de biblioteca dice de quién es el problema —
aquí las cuatro usan una **función de derivación lenta** distinta, y las cuatro
escriben los parámetros *dentro* del resumen.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — bcrypt, coste 12

```javascript
const COSTE = 12;
```

```javascript
  const resumen = bcrypt.hashSync(clave, COSTE);
  usuarios.set(usuario, resumen);
```

El coste es el parámetro que **envejece bien**: subirlo encarece cada intento
del atacante sin tocar el código. El resumen lo lleva escrito
(`$2a$12$…`), así que se puede subir mañana y re-resumir al entrar.

Se usa `bcryptjs` —la variante en JavaScript puro— y no `bcrypt`, que compila
código nativo mediante un script de instalación: este repositorio instala con
`--ignore-scripts` a propósito, y esa restricción de la cadena de suministro
también decide qué biblioteca acaba en el proyecto.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — Argon2id

```python
ph = PasswordHasher()
```

```python
    resumen = ph.hash(credenciales.clave)
```

**Argon2id**, ganador del Password Hashing Competition y primera opción de
OWASP [@owasp-cheatsheets]. Lo notable es lo que *no* aparece: ningún
parámetro. `PasswordHasher()` trae memoria, tiempo y paralelismo sensatos y los
escribe dentro del resumen, así que verificar no necesita configuración — la
lee del propio resumen. Subirlos mañana no rompe los de ayer:
`check_needs_rehash` dice cuáles re-resumir al siguiente inicio de sesión.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — BCrypt

```java
    private final BCryptPasswordEncoder codificador = new BCryptPasswordEncoder(12);
```

```java
        String resumen = codificador.encode(clave);
        usuarios.put(usuario, resumen);
```

La dependencia es `spring-security-crypto`, **solo el módulo de criptografía**.
Es una distinción que merece la pena: se puede usar el resumidor de Spring
Security sin arrastrar sus filtros, su cadena de seguridad ni su modelo de
sesión. La biblioteca grande no obliga a comprarlo todo.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — PBKDF2 con versión

```csharp
var hasher = new PasswordHasher<string>();
```

```csharp
    var veredicto = hasher.VerifyHashedPassword(usuario, resumen, clave);
    if (veredicto == PasswordVerificationResult.Failed || !usuarios.ContainsKey(usuario))
```

PBKDF2 con sal aleatoria por resumen, y **la versión del formato escrita dentro
del propio resumen**. Por eso `VerifyHashedPassword` no devuelve un booleano
sino tres valores: correcto, fallido, y `SuccessRehashNeeded` — «la contraseña
es buena, pero este resumen se hizo con parámetros viejos y conviene
rehacerlo». Es el único del elenco que convierte la migración de parámetros en
parte del tipo de retorno en lugar de en una llamada aparte que hay que
recordar.

### Lo que hacen las cuatro igual: el señuelo

```javascript
const SENUELO = bcrypt.hashSync("senuelo-que-nunca-coincide", COSTE);
```

```javascript
  const resumen = usuarios.get(usuario) ?? SENUELO;
  const coincide = bcrypt.compareSync(clave ?? "", resumen);
```

Cuando el usuario no existe, las cuatro implementaciones **verifican igualmente
contra un resumen señuelo**. Rechazar sin verificar tardaría microsegundos
frente a los cien milisegundos de una verificación real, y ese delta de tiempo
es un oráculo de enumeración tan bueno como un mensaje distinto: se pregunta
por mil nombres y se apunta cuáles tardaron.

Y por eso también el 401 dice lo mismo en los dos casos. **La respuesta y el
tiempo que tarda son las dos mitades del mismo mensaje**; cuidar una y olvidar
la otra no protege nada.

## 📊 Comparación

| Framework | Pieza | Algoritmo | La sal | El formato |
| --- | --- | --- | --- | --- |
| Express | `bcryptjs` | bcrypt | dentro del resumen | `$2b$12$…` |
| FastAPI | `argon2-cffi` | **Argon2id** | dentro del resumen | `$argon2id$v=19$m=…` |
| Spring Boot | `spring-security-crypto` | bcrypt | dentro del resumen | `$2a$12$…` |
| ASP.NET Core | `PasswordHasher<T>` | PBKDF2-HMAC | dentro del resumen | base64 con byte de versión |

Tres formatos legibles que declaran algoritmo y coste, y uno opaco con
versión binaria. El efecto es el mismo; la diferencia aparece al **migrar**:
los `$…$` se inspeccionan con los ojos, el de Identity necesita su decoder.

## ⚠️ Errores frecuentes

- **Cifrar en vez de resumir.** El cifrado se descifra: quien roba la base y
  la clave de cifrado tiene todas las contraseñas. Un resumen no se deshace.
- **Resumen rápido (SHA-256, MD5) aunque tenga sal.** La GPU del atacante
  agradece la velocidad. El coste es la defensa, no la irreversibilidad sola.
- **La misma sal para todos** («pepper» casero mal entendido). Vuelve a unir
  los resúmenes de claves iguales — exactamente lo que el segundo caso caza.
- **Comparar resúmenes con `==`.** La comparación que corta al primer byte
  distinto filtra información por tiempo; las bibliotecas comparan en tiempo
  constante y por eso se usa su `verify`, no el tuyo.
- **Distinguir «usuario no existe» de «clave mala»** — en el mensaje o en el
  tiempo de respuesta.
- **Límites de longitud heredados del algoritmo sin saberlo.** bcrypt trunca
  a 72 bytes en silencio: dos claves que empiezan igual durante 72 bytes son
  la misma. Argon2 no trunca.

## ✅ Verificación

```bash
node scripts/run-class.mjs 068
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta
las implementaciones que encuentre y declara las que omitió.

## 🧪 Reto de transferencia

Implementa la **migración de coste**: baja el coste a 4, registra un usuario,
súbelo a 12 y haz que el siguiente inicio de sesión re-resuma la contraseña
con el coste nuevo (es el único momento en que el servidor la tiene en
claro). Añade al contrato un caso que verifique que el resumen cambió de
formato tras entrar.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 066 — Sesión con cookie](../066-sesion-con-cookie/README.md) — qué
  se entrega a cambio de la contraseña
- [Clase 078 — Dependencias vulnerables](../078-dependencias-vulnerables/README.md) — la otra mitad de «me roban la base»

## Fuentes

- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (Password Storage). OWASP — <https://cheatsheetseries.owasp.org/>
- [@nist-800-63b] *SP 800-63B — Digital Identity Guidelines: Authentication and Lifecycle Management*. NIST — <https://pages.nist.gov/800-63-3/sp800-63b.html>
- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
- [@adkins-building-secure-reliable] Adkins, H. et al. *Building Secure and Reliable Systems*. O'Reilly Media, 2020. ISBN 9781492083122 — <https://openlibrary.org/isbn/9781492083122>
