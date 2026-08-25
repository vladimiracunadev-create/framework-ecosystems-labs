# Clase 069 — OAuth 2.0 y OpenID Connect

> [⬅️ 068](../068-contrasenas-bien-guardadas/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [070 ➡️](../070-autorizacion-por-rol/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🔴 avanzado** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Delegar la identidad **sin manejar credenciales ajenas**. «Entrar con Google»
significa que tu aplicación nunca ve la contraseña de Google del usuario — ve
un código, lo canjea por tokens, y cada pieza del canje tiene una defensa con
nombre [@rfc6749]. Esta clase construye el flujo de código de autorización
con PKCE paso a paso y **mide cada defensa por separado**.

## 🧩 La situación

Cada implementación es un **servidor de autorización mínimo** con los dos
endpoints del flujo: `/autorizar` (emite el código) y `/token` (lo canjea).
El verificador hace los otros dos papeles — el navegador que va y vuelve, y
el cliente que canjea. La pantalla de login se omite con un usuario fijo:
lo que se mide es la mecánica del protocolo, no el formulario.

En producción **no se escribe un servidor de autorización**: se despliega
uno (Keycloak, spring-authorization-server) o se contrata (Auth0, Cognito).
Se escribe el *cliente* — y para escribir un cliente correcto hay que
entender qué comprueba el servidor y por qué, que es lo que este contrato
deja a la vista.

## 📖 El flujo, paso a paso

```text
 cliente                    navegador                servidor de autorización
    │  1. genera verificador     │                              │
    │     y su resumen (reto)    │                              │
    ├──────────────────────────► │  GET /autorizar?…            │
    │                            │     &code_challenge=RETO ───►│ 2. guarda el reto
    │                            │                              │    y emite el código
    │                            │ ◄─── 302 ?code=…&state=… ────┤
    │ ◄──────────────────────────┤                              │
    │  3. POST /token: código + VERIFICADOR ────────────────────►│ 4. ¿S256(verificador)
    │                                                            │    == reto guardado?
    │ ◄──────────── access_token + id_token ─────────────────────┤
```

El código viaja por el navegador — por barras de direcciones, historiales y
registros. PKCE existe porque ese viaje no es de fiar: el código robado no
vale nada sin el verificador, **que nunca viajó** [@rfc9700].

## 🧮 El contrato

| Paso | Petición | Qué defiende |
| --- | --- | --- |
| 1 | `GET /autorizar` completo → `302` con `code` y el `state` **de vuelta** | el `state` es el testigo anti-CSRF del cliente |
| 2 | `POST /token` con código + verificador correcto → `200` con `access_token` e `id_token` | el canje feliz |
| 3 | **el mismo código otra vez** → `400` | un código es de un solo uso |
| 4 | código nuevo + **verificador equivocado** → `400` | PKCE: el código robado no se canjea |
| 5 | `redirect_uri` **no registrada** → `400` directo, sin `Location` | el código solo viaja a URIs registradas |
| 6 | **sin `code_challenge`** → `302` con `error=invalid_request`, **sin `code`** | PKCE es obligatorio, y el error sí vuelve al cliente |

Los casos 5 y 6 parecen gemelos y son opuestos, y esa asimetría es de las
cosas más finas del protocolo: con una `redirect_uri` desconocida **no se
redirige nada** —redirigir sería un open redirect al servidor del atacante—;
con una registrada pero una petición mal formada, el error **sí** viaja de
vuelta, con el `state` intacto [@rfc6749].

Para medir el flujo, el verificador ganó dos piezas: captura de parámetros
de la `Location` de una redirección (`guardar_consulta`, porque el código
llega ahí y no en un cuerpo) y cuerpos `application/x-www-form-urlencoded`
(`formulario`, porque el endpoint de token recibe formulario por
especificación, y probarlo con JSON sería probar otro protocolo).

## 🔬 OAuth y OpenID Connect, separados

- **OAuth 2.0** responde «¿puede esta aplicación acceder a esto?» — entrega
  `access_token`, que es **autorización** [@rfc6749].
- **OpenID Connect** responde «¿quién es el usuario?» — añade `id_token`, un
  JWT con `iss`, `sub` y `aud`, que es **identidad**.

Confundirlos es el error de diseño clásico: usar un `access_token` como
prueba de identidad. El `access_token` dice que puedes; el `id_token` dice
quién eres — y su `aud` dice **a quién** se lo dice, que es lo que impide
reutilizarlo en otra aplicación.

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
- **Versión que ejecuta esta clase:** `express ^5.1.0, jsonwebtoken ^9.0.2`
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
- **Versión que ejecuta esta clase:** `fastapi>=0.115, uvicorn>=0.30, pyjwt>=2.9`
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
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web, jjwt-api 0.12.6, jjwt-impl 0.12.6, jjwt-jackson 0.12.6`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-069-1.0.0.jar --server.port=3000
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
- **Versión que ejecuta esta clase:** `net10.0, Microsoft.IdentityModel.JsonWebTokens 8.6.1`
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
| `Clase069.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las cuatro son deliberadamente **la misma lógica**, y esa coincidencia es el
contenido: en un protocolo de seguridad, **la creatividad es el fallo**. Lo que
cambia entre ellas es la biblioteca que firma el `id_token` —las mismas cuatro
de la clase 067— y el idioma en que se escribe el mismo resumen SHA-256.

Se lee una vez el flujo completo en Express y después, framework a framework, la
pieza que sí cambia.

### El flujo, en Express · [`express/server.mjs`](implementaciones/express/server.mjs)

**Registro de clientes.** La `redirect_uri` se declara por adelantado:

```javascript
const CLIENTES = new Map([["cliente-demo", { redireccion: "https://app.example/callback" }]]);
```

**La primera defensa, y la que más se rompe en la vida real:**

```javascript
  if (!cliente || q.redirect_uri !== cliente.redireccion) {
    return respuesta.status(400).json({ error: "invalid_request" });
  }
```

Cliente desconocido o URI no registrada: error **directo**, sin redirigir.
Redirigir el error a una URI no verificada sería entregar datos al sitio del
atacante — el *open redirect* clásico. Fíjate en que la comprobación es de
igualdad exacta, no «que empiece por»: un prefijo se puede extender.

**El código y su reto PKCE:**

```javascript
  const codigo = crypto.randomBytes(24).toString("base64url");
  codigos.set(codigo, {
    reto: q.code_challenge,
    redireccion: q.redirect_uri,
    cliente: q.client_id,
    usado: false,
  });
```

```javascript
  if (q.state) destino.searchParams.set("state", q.state);
```

El `state` vuelve **tal cual**: es el testigo anti-CSRF *del cliente*, y el
servidor de autorización ni lo interpreta ni lo recuerda.

**El canje, donde PKCE hace su trabajo:**

```javascript
  const resumen = crypto
    .createHash("sha256")
    .update(String(f.code_verifier ?? ""))
    .digest("base64url");

  if (invalido || resumen !== entrada.reto) {
    if (entrada) entrada.usado = true;
    return respuesta.status(400).json({ error: "invalid_grant" });
  }
```

El resumen del verificador que llega ahora tiene que casar con el reto que
llegó al principio. **Solo quien inició el flujo tiene el verificador**, así que
un código interceptado por el camino no se puede canjear. Y un código que llega
dos veces se quema: `usado = true` también en la rama de error.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

```python
def _resumen_s256(verificador: str) -> str:
    digesto = hashlib.sha256(verificador.encode()).digest()
    return urlsafe_b64encode(digesto).rstrip(b"=").decode()
```

```python
    id_token = jwt.encode(
        {
            "iss": "http://laboratorio.local",
            "sub": "ana",
            "aud": f.get("client_id"),
            "exp": int(time.time()) + 3600,
        },
        SECRETO,
        algorithm="HS256",
    )
```

`rstrip(b"=")` no es cosmética: **base64url sin relleno** es lo que exige la
especificación de PKCE, y dejar los `=` produce un reto que no casa con el que
calcula cualquier cliente conforme. Los cuatro lenguajes tienen que quitarlo, y
los cuatro lo hacen de una forma distinta.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
            byte[] digesto = MessageDigest.getInstance("SHA-256")
                    .digest(verificador.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(digesto);
```

```java
        String idToken = Jwts.builder()
                .issuer("http://laboratorio.local")
                .subject("ana")
                .audience().add(f.get("client_id")).and()
                .expiration(new Date(System.currentTimeMillis() + 3_600_000))
                .signWith(CLAVE, Jwts.SIG.HS256)
                .compact();
```

`withoutPadding()` resuelve lo mismo que el `rstrip` de Python, con nombre
propio. Y `audience().add(…).and()` delata una decisión del formato: **`aud`
puede ser una lista**, así que la API obliga a añadir en lugar de asignar.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
    var digesto = SHA256.HashData(Encoding.UTF8.GetBytes(verificador));
    return Convert.ToBase64String(digesto).TrimEnd('=').Replace('+', '-').Replace('/', '_');
```

```csharp
    var idToken = manejador.CreateToken(new SecurityTokenDescriptor
    {
        Issuer = "http://laboratorio.local",
        Audience = f["client_id"].FirstOrDefault(),
        Claims = new Dictionary<string, object> { ["sub"] = "ana" },
        Expires = DateTime.UtcNow.AddHours(1),
        SigningCredentials = new SigningCredentials(clave, SecurityAlgorithms.HmacSha256),
    });
```

Es el único de los cuatro donde **base64url hay que construirlo a mano**:
`Convert.ToBase64String` produce base64 estándar y los tres reemplazos lo
convierten. Node lo tiene como codificación (`"base64url"`), Python y Java
traen la variante en la biblioteca estándar; .NET obliga a saber la diferencia
entre los dos alfabetos, que es exactamente el tipo de detalle que produce un
«funciona en mi cliente y no en el suyo».

> ⚠️ Estos cuatro servidores de autorización existen **para poder medir el
> protocolo**, no para usarlos. En producción no se escribe uno: se despliega
> uno probado —Keycloak, Authentik— o se contrata. Escribir el propio es la
> decisión que esta clase enseña a no tomar.

## 📊 Comparación

La diferencia real entre ecosistemas no está en este código sino en qué
ofrece cada uno para **no** escribirlo:

| Ecosistema | El servidor de verdad | El cliente de verdad |
| --- | --- | --- |
| Express | ninguno oficial (se despliega Keycloak o se contrata) | `openid-client` |
| FastAPI | ninguno oficial | `authlib` |
| Spring Boot | **`spring-authorization-server`** | `spring-security-oauth2-client` |
| ASP.NET Core | ninguno de Microsoft (Duende es comercial, OpenIddict comunitario) | `AddOpenIdConnect()` de serie |

Spring es el único de los cuatro con servidor de autorización oficial del
ecosistema, y .NET el que mejor cliente trae de serie. Los cuatro pueden
consumir cualquier proveedor: esa es la gracia de que sea un estándar.

## ⚠️ Errores frecuentes

- **Implementar tu propio servidor de autorización en producción.** Esta
  clase lo hace para medirlo; hacerlo de verdad es asumir el mantenimiento
  de seguridad de Keycloak con el equipo que no tiene Keycloak.
- **Redirigir errores a `redirect_uri` sin validarla.** Open redirect: el
  caso 5 existe por esto.
- **Aceptar el código más de una vez.** Un código interceptado y reusado es
  una sesión robada; el RFC pide además revocar lo emitido si se detecta el
  segundo canje [@rfc9700].
- **Omitir `state`** — CSRF en el callback: el atacante inyecta *su* código
  en la sesión de la víctima.
- **Usar el flujo implícito** (`response_type=token`). Retirado por la
  buena práctica actual: el token viajaba en la URL [@rfc9700].
- **Validar el `id_token` sin comprobar `aud` e `iss`.** Un `id_token`
  emitido para otra aplicación no es tuyo aunque la firma sea válida.

## ✅ Verificación

```bash
node scripts/run-class.mjs 069
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta
las implementaciones que encuentre y declara las que omitió.

## 🧪 Reto de transferencia

Añade la caducidad del código (60 segundos) y el caso que la mide: pide un
código, espera —o inyecta un reloj—, y comprueba que el canje tardío
responde `400`. Después añade `refresh_token` a la respuesta del token y el
caso de rotación de la clase 067.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 067 — Token de acceso](../067-token-de-acceso/README.md) — qué es lo
  que este flujo termina entregando
- [Clase 072 — CSRF](../072-csrf/README.md) — el ataque del que `state`
  protege al callback

## Fuentes

- [@rfc6749] *RFC 6749 — The OAuth 2.0 Authorization Framework*. IETF, 2012 — <https://www.rfc-editor.org/rfc/rfc6749>
- [@rfc9700] *RFC 9700 — Best Current Practice for OAuth 2.0 Security*. IETF, 2025 — <https://www.rfc-editor.org/rfc/rfc9700>
- [@rfc7519] *RFC 7519 — JSON Web Token (JWT)*. IETF, 2015 — <https://www.rfc-editor.org/rfc/rfc7519>
- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
