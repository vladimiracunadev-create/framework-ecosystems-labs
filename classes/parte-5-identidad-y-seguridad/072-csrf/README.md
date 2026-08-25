# Clase 072 — CSRF

> [⬅️ 071](../071-autorizacion-por-recurso/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [073 ➡️](../073-xss-y-escapado/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Entender **el ataque** antes de activar la defensa. El *Cross-Site Request
Forgery* explota una decisión de diseño del navegador: **la cookie viaja
sola** — el navegador la adjunta a toda petición hacia su dominio, la inicie
quien la inicie [@rfc6265].

## 🧩 La situación: el ataque, en concreto

1. La víctima inicia sesión en `banco.example`. Cookie en el navegador.
2. Visita `atacante.example`, donde una página invisible envía
   `POST banco.example/transferir`.
3. El navegador **adjunta la cookie de banco.example** — es su trabajo.
4. Para el servidor, la petición es indistinguible de una legítima: cookie
   válida, sesión válida, usuario autenticado.

El atacante no robó nada — ni cookie, ni contraseña. Usó a la víctima como
**proxy confuso**: hizo que su navegador, ya autenticado, trabajara para él
[@hoffman-web-application-security].

## 📖 La defensa

Dos capas, y las clases anteriores ya pusieron la primera:

- **`SameSite=Lax`** (clase 066): la cookie no viaja en peticiones que otra
  página provoca. Corta el ataque básico — pero no todo: la navegación de
  nivel superior sí lleva la cookie, y los despliegues con subdominios o
  `SameSite=None` la pierden.
- **El testigo sincronizado**: un valor aleatorio por sesión que el servidor
  entrega **en el cuerpo de una respuesta** y exige de vuelta **en un
  encabezado**. La página del atacante puede *enviar* peticiones a tu
  dominio, pero no puede *leer* respuestas de él — la política de mismo
  origen se lo impide. No puede leer el testigo → no puede enviarlo → 403
  [@owasp-cheatsheets].

## 🧮 El contrato

| Petición | Respuesta | Qué mide |
| --- | --- | --- |
| `POST /entrar` | `200` · cookie + testigo en el cuerpo | el reparto: cookie e información van por canales distintos |
| `GET /saldo` sin sesión | `401` | quién eres, primero |
| `POST /transferir` **solo con la cookie** | **`403`** | la petición del atacante, literal |
| con un testigo **inventado** | `403` | adivinar tampoco |
| con **el testigo entregado** | `200` · `saldo: 90` | la legítima pasa |
| `GET /saldo` | `saldo: 90` | **los dos 403 nunca movieron dinero** |

El último caso es el que separa este contrato de una prueba decorativa: no
basta con que los ataques reciban 403 — hay que comprobar que **el estado no
cambió**. Un 403 emitido después de transferir también pasaría los casos
anteriores.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Seguro (método)**](../../../glosario/README.md#seguro-método) | Un método que no cambia el estado del servidor. `GET` y `HEAD` lo son. Un `GET` que transfiera dinero es indefendible: bastaría una etiqueta `<img>` en cualquier página para dispararlo. |
| [**CSRF**](../../../glosario/README.md#csrf) *(Falsificación de petición entre sitios)* | El ataque en que una página del atacante provoca una petición a tu sitio y el navegador **adjunta la cookie** — es su trabajo. Se corta con un testigo que el atacante no puede leer ni adivinar, y con `SameSite`. |
| [**Testigo sincronizado**](../../../glosario/README.md#testigo-sincronizado) *(Token CSRF)* | Un valor aleatorio que vive en la sesión y viaja en el cuerpo o en una cabecera —nunca en una cookie sola, que el navegador también adjuntaría—. La página del atacante no puede leerlo porque no puede leer respuestas de otro origen. |

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
- **Versión que ejecuta esta clase:** `express ^5.1.0, express-session ^1.18.1`
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
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web, spring-boot-starter-security`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-072-1.0.0.jar --server.port=3000
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
| `Clase072.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `Program.cs` | código C# |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

El reparto más nítido de la parte: **en dos frameworks la protección no se
escribe, se usa; en los otros dos se compone a mano.** Y la diferencia no es de
gusto — es de cuántas líneas tuyas se interponen entre un atacante y el dinero.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — no se escribe, se activa

```java
                .csrf(csrf -> csrf.ignoringRequestMatchers("/entrar"))
```

Esa línea **es toda la defensa**. El `CsrfFilter` de Spring Security guarda el
testigo en la sesión, exige `X-CSRF-TOKEN` en todo lo que muta y responde `403`
él solo: el código de las rutas no se entera de que existe un ataque llamado
CSRF. Lo único que escribe la aplicación es la entrega del testigo:

```java
        CsrfToken testigo = (CsrfToken) peticion.getAttribute("_csrf");
        return ResponseEntity.ok(Map.of("usuario", usuario, "csrf", testigo.getToken()));
```

Fíjate también en lo que la línea *excluye*: `/entrar` queda fuera porque es
donde el cliente consigue su primer testigo — no puede exigirse uno a quien
todavía no tiene ninguno. Y es la primera clase de la parte que **no apaga** el
CSRF; las anteriores lo desactivaban porque eran API sin cookies, y ahí no hay
nada que proteger.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — el par firmado

```csharp
constructor.Services.AddAntiforgery(opciones =>
{
    opciones.HeaderName = "x-csrf-token";
});
```

```csharp
    var testigos = antiforgery.GetAndStoreTokens(contexto);
    return Results.Json(new { usuario, csrf = testigos.RequestToken });
```

```csharp
        await antiforgery.ValidateRequestAsync(contexto);
    }
    catch (AntiforgeryValidationException)
    {
        return Results.Json(new { error = "testigo-invalido" }, statusCode: 403);
```

Emite un **par**: una cookie firmada que se queda en el navegador y un testigo
que el cliente debe repetir en el encabezado. Es el patrón *double-submit* con
firma — la variante **sin estado** del testigo, que no necesita guardar nada en
el servidor. La página del atacante tiene la cookie (el navegador la adjunta
sola) pero **no puede leer el testigo**, y sin los dos no pasa.

La única diferencia práctica con Spring es que aquí la validación se invoca:
`ValidateRequestAsync` está en el cuerpo de la ruta, no en un filtro anterior.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — quince líneas, y por qué

```javascript
    peticion.session.csrf = crypto.randomBytes(24).toString("base64url");
    respuesta.json({ usuario, csrf: peticion.session.csrf });
```

```javascript
function conTestigo(peticion, respuesta, siguiente) {
  const recibido = peticion.get("x-csrf-token") ?? "";
  const esperado = peticion.session.csrf ?? "";
  const iguales =
    recibido.length === esperado.length &&
    crypto.timingSafeEqual(Buffer.from(recibido), Buffer.from(esperado));
  if (!esperado || !iguales) {
    return respuesta.status(403).json({ error: "testigo-invalido" });
  }
  siguiente();
}
```

```javascript
app.post("/transferir", conSesion, conTestigo, (peticion, respuesta) => {
```

El testigo vive **en la sesión** y viaja en el cuerpo de la respuesta, nunca en
una cookie sola: una cookie el navegador también la adjuntaría sola, y entonces
el atacante la tendría igual que tiene la de sesión.

`timingSafeEqual` es la comparación en tiempo constante de la clase 068,
tercera aparición. Y la comprobación de longitud antes es obligatoria, no
cosmética: `timingSafeEqual` **lanza** si los dos búferes miden distinto.

El dato que importa de esta implementación no está en el código: **el
middleware histórico de Express para esto, `csurf`, está retirado**. Que el
paquete de referencia para un ataque del top de OWASP quedara sin
mantenimiento es información sobre el ecosistema, no una anécdota — y es
exactamente la pregunta que el módulo 11 enseña a hacer antes de elegir.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — sobre la sesión de la 066

```python
    testigo = secrets.token_urlsafe(24)
    sesiones[identificador] = {"usuario": credenciales.usuario, "csrf": testigo}
    respuesta = JSONResponse({"usuario": credenciales.usuario, "csrf": testigo})
```

```python
    if not x_csrf_token or not secrets.compare_digest(actual["csrf"], x_csrf_token):
        return JSONResponse({"error": "testigo-invalido"}, status_code=403)
```

Nunca lo tuvo, y se compone sobre la sesión que la clase 066 ya había tenido
que construir a mano. `compare_digest` acepta cadenas de distinta longitud sin
lanzar, así que aquí no hace falta la comprobación previa de Express — una
diferencia pequeña de la biblioteca estándar que ahorra un fallo real.

### Lo que los cuatro dejan sin testigo

```javascript
app.get("/saldo", conSesion, (peticion, respuesta) => {
```

`GET` no lleva testigo en ninguna de las cuatro implementaciones, **a
propósito**: la defensa protege las escrituras. Y eso solo es seguro si el `GET`
cumple lo que la clase 014 exige de él — no mutar nada. Un `GET` que
transfiriera dinero sería indefendible: el atacante no necesitaría un
formulario, le bastaría una etiqueta `<img>`.

## 📊 Comparación

| Framework | La pieza | Dónde ocurre el 403 | Patrón |
| --- | --- | --- | --- |
| Spring Boot | `CsrfFilter`, de serie y **activo por omisión** | en el filtro, antes de tu código | sincronizado en sesión |
| ASP.NET Core | `Antiforgery`, de serie | donde tú llamas a validar | double-submit firmado |
| Express | compuesta (csurf retirado) | en tu middleware | sincronizado en sesión |
| FastAPI | compuesta | en tu handler | sincronizado en sesión |

Spring es el único donde la defensa está **activa por omisión** — tan por
omisión que la mayoría de los tutoriales de API empiezan por apagarla
(`csrf.disable()`, clases 070 y 071 incluidas). Esta clase es el contexto de
esa línea: se apaga cuando no hay cookies de sesión que proteger, y **solo**
entonces.

## ⚠️ Errores frecuentes

- **`csrf.disable()` copiado de un tutorial** en una aplicación que sí usa
  cookies de sesión. La línea más peligrosa de Stack Overflow.
- **Confiar solo en `SameSite`.** Es la primera capa, no la única: `Lax`
  deja pasar la navegación de nivel superior, y basta un subdominio
  comprometido para el resto.
- **El testigo en una cookie sin más.** El navegador la adjunta solo, igual
  que la de sesión: no defiende nada. El testigo tiene que viajar por un
  canal que exija JavaScript del mismo origen — encabezado o campo de
  formulario.
- **Proteger solo los formularios y no el JSON.** El `fetch` con
  `credentials: 'include'` sufre el mismo ataque.
- **GET que muta.** Ninguna defensa CSRF protege un
  `GET /borrar?id=1` — los GET no llevan testigo por diseño (clase 014).
- **Probar los 403 sin probar el estado.** El último caso del contrato.

## ✅ Verificación

```bash
node scripts/run-class.mjs 072
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta
las implementaciones que encuentre y declara las que omitió.

## 🧪 Reto de transferencia

Cambia la defensa de Express al patrón **double-submit firmado** de ASP.NET
(el testigo en una cookie propia, firmada, más el encabezado) y decide qué
casos del contrato cambian. Después responde con código: ¿por qué el
double-submit necesita la firma? — plantar cookies desde un subdominio es la
respuesta.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 066 — Sesión con cookie](../066-sesion-con-cookie/README.md) — la
  cookie y su `SameSite`
- [Clase 014 — Verbos HTTP y su semántica](../../parte-1-responder/014-verbos-http-y-su-semantica/README.md) — por qué GET no debe mutar

## Fuentes

- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (Cross-Site Request Forgery Prevention). OWASP — <https://cheatsheetseries.owasp.org/>
- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
- [@rfc6265] *RFC 6265 — HTTP State Management Mechanism*. IETF, 2011 — <https://www.rfc-editor.org/rfc/rfc6265>
- [@owasp-top10] *OWASP Top 10*. OWASP — <https://owasp.org/www-project-top-ten/>
