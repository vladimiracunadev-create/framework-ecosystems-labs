# Clase 067 — Token de acceso

> [⬅️ 066](../066-sesion-con-cookie/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [068 ➡️](../068-contrasenas-bien-guardadas/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Firmar y verificar una credencial **sin estado en el servidor**. La clase 066
guardó la sesión en el servidor; esta la mete entera en el token, firmada
[@rfc7519]. El servidor no recuerda nada entre peticiones — y ese es a la vez
el atractivo y el precio.

## 🧩 La situación

`POST /token` con credenciales entrega un JWT. `GET /informe` lo exige en
`Authorization: Bearer …` y lo verifica **sin consultar nada**: la única
prueba de autenticidad es la firma. El contrato ataca esa firma por los
cuatro costados conocidos.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /informe` sin token | `401` |
| `POST /token` con credenciales malas | `401` |
| `POST /token` con credenciales buenas | `200` · `{token, tipo: "Bearer"}` |
| `GET /informe` con el token recién emitido | `200` · `{"usuario": "ana"}` |
| el mismo token **con la firma alterada** | `401` |
| un token **caducado** con firma buena | `401` |
| un token firmado **con otra clave** | `401` |
| el ataque **`alg: none`** — sin firma | `401` |

Los tres primeros ataques son estáticos: tokens precalculados que viajan en el
contrato, porque un token caducado o de otra clave es solo texto. El cuarto es
histórico y sigue siendo el mejor examen de una verificación: un token cuya
cabecera declara `alg: none` y no trae firma. Las bibliotecas que dejaban que
**la cabecera del token eligiera el algoritmo** lo aceptaban — y la cabecera
la escribe el atacante [@hoffman-web-application-security]. Por eso las cuatro
implementaciones fijan la lista de algoritmos en el código del verificador, no
la leen del token.

Para el caso dinámico, el verificador ganó variables entre casos: el caso que
emite declara `guardar: {token: "token"}` y los siguientes interpolan
`${token}` — incluida la versión alterada, que es `${token}AA`.

## 📖 Lo que un JWT es y lo que no es

```text
eyJhbGciOiJIUzI1NiJ9 . eyJzdWIiOiJhbmEiLCJleHAiOjQxMDI0NDQ4MDB9 . BIRKBW…
        cabecera              cuerpo (¡legible!)                    firma
```

- El cuerpo va **codificado, no cifrado**: cualquiera que tenga el token lee
  lo que lleva. Un JWT no es un lugar para secretos.
- La firma garantiza **integridad**, no confidencialidad: nadie puede
  cambiarlo sin romperla, todos pueden leerlo.
- `exp` es la única caducidad que existe. No hay «cerrar sesión»: **lo que no
  se guarda no se puede revocar**, y hasta que caduque, un token robado abre.
  La mitigación estándar es emitirlos cortos y renovarlos con un refresh token
  que sí vive en el servidor — es decir, volver a tener estado, solo que menos
  a menudo [@rfc9700].

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Token de acceso**](../../../glosario/README.md#token-de-acceso) *(JWT)* | Un dato firmado que el cliente presenta en cada petición y que el servidor verifica **sin consultar nada**. Su cuerpo va codificado, no cifrado: cualquiera que lo tenga puede leerlo. Y lo que no se guarda no se puede revocar. |

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
PORT=3000 java -jar target/clase-067-1.0.0.jar --server.port=3000
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
| `Clase067.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

**Ninguno de los cuatro frameworks firma tokens por sí mismo.** En los cuatro
la pieza es una biblioteca externa, y eso ya es el hallazgo: emitir y verificar
un JWT no es trabajo del framework web. Lo que sí cambia entre ellos es qué te
deja hacer mal esa biblioteca.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — con `jsonwebtoken`

```javascript
  const token = jwt.sign({ sub: usuario }, SECRETO, {
    algorithm: "HS256",
    expiresIn: "1h",
  });
  respuesta.json({ token, tipo: "Bearer", expira_en: 3600 });
```

El token lleva lo que el servidor necesitará saber **sin consultar nada**:
quién (`sub`) y hasta cuándo (`exp`). No lleva secretos — el cuerpo de un JWT
va codificado, **no cifrado**: cualquiera que lo tenga puede leerlo.

```javascript
    const datos = jwt.verify(token, SECRETO, { algorithms: ["HS256"] });
```

Esa lista `algorithms` es la línea que separa esta clase de un titular de
seguridad. **Sin ella, la biblioteca acepta lo que declare la cabecera del
token — y la cabecera la escribe quien ataca.** El ataque `alg: none` fue
exactamente eso.

```javascript
  } catch {
    respuesta.status(401).json({ error: "token-invalido" });
  }
```

Alterado, caducado, de otra clave o ausente: **un solo 401 para todo**. Al
cliente legítimo le da igual el matiz, y al atacante no hay que dárselo.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — con PyJWT

```python
    token = jwt.encode(
        {"sub": credenciales.usuario, "exp": int(time.time()) + 3600},
        SECRETO,
        algorithm="HS256",
    )
```

Aquí la caducidad se calcula a mano —`int(time.time()) + 3600`— en lugar de
declararse como en Express. Mismo resultado, un recordatorio menos que el
framework te da.

```python
        datos = jwt.decode(token, SECRETO, algorithms=["HS256"])
    except jwt.InvalidTokenError:
        return JSONResponse({"error": "token-invalido"}, status_code=401)
```

`InvalidTokenError` es la **clase base** de toda la jerarquía de errores de
PyJWT: firma mala, formato roto y caducidad caen ahí. Es lo que permite el 401
único sin enumerar casos. Y `decode` verifica `exp` por omisión.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — con jjwt

```java
    private static final SecretKey CLAVE = Keys.hmacShaKeyFor(
            "clave-de-firma-solo-para-el-laboratorio".getBytes(StandardCharsets.UTF_8));
```

`hmacShaKeyFor` **exige al menos 256 bits para HS256**: una clave corta no
arranca. El framework convierte una mala práctica en un error de ejecución, que
es la forma más eficaz de documentación que existe.

```java
            Claims datos = Jwts.parser().verifyWith(CLAVE).build()
                    .parseSignedClaims(token).getPayload();
```

Y aquí está la mejor decisión de diseño del elenco: **`parseSignedClaims` solo
acepta tokens firmados**. `alg: none` no es un caso especial que haya que
acordarse de bloquear con una lista; es un token *no firmado*, y se rechaza por
tipo. Express y FastAPI lo evitan porque el programador escribió la lista;
Spring lo evita porque la API no ofrece la otra opción.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — con Microsoft.IdentityModel

```csharp
    var resultado = await manejador.ValidateTokenAsync(token, new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        IssuerSigningKey = clave,
        ValidAlgorithms = [SecurityAlgorithms.HmacSha256],
        ClockSkew = TimeSpan.Zero,
    });
```

Un objeto de parámetros en lugar de argumentos sueltos: cada cosa que se valida
—o que se decide no validar— queda escrita. `ValidateIssuer = false` no es
descuido, es una decisión declarada, y eso es mejor que un valor por omisión
invisible.

Y el detalle que hay que saber antes de escribir el contrato: **`ClockSkew` vale
cinco minutos por omisión**. Un token caducado hace tres minutos seguiría
entrando. Es una tolerancia razonable para relojes desincronizados entre
servidores y una trampa para cualquiera que intente *medir* la caducidad; por
eso aquí se pone a cero.

## 📊 Comparación

| Framework | Biblioteca | `alg: none` | Caducidad | Detalle propio |
| --- | --- | --- | --- | --- |
| Express | `jsonwebtoken` | rechazado si fijas `algorithms` | verifica `exp` | sin lista de algoritmos, decide el token |
| FastAPI | `PyJWT` | rechazado: `algorithms` es obligatorio | por omisión | la API obliga a lo correcto |
| Spring Boot | `jjwt` | rechazado por tipo | por omisión | exige clave ≥ 256 bits |
| ASP.NET Core | `Microsoft.IdentityModel` | rechazado con `ValidAlgorithms` | **margen de 5 min por omisión** | `ClockSkew` explícito |

## ⚖️ Sesión o token

La pregunta de la parte, y no tiene una respuesta única:

| | Sesión (066) | Token (067) |
| --- | --- | --- |
| Estado en el servidor | sí | no |
| Revocar al instante | **sí** | no: espera al `exp` |
| Verificar sin red | no: consulta el almacén | **sí**: solo la firma |
| Varios servicios verifican | difícil: comparten almacén | fácil: comparten clave pública |
| Robo de la credencial | se mata la sesión | vale hasta caducar |

La regla práctica: **aplicación web con su propio backend → sesión; API que
consumen terceros o varios servicios → token**. Y las arquitecturas reales
combinan: sesión con el navegador, tokens entre servicios [@rfc9700].

## ⚠️ Errores frecuentes

- **Aceptar el algoritmo que declara el token.** El `alg: none` clásico. La
  lista de algoritmos se fija en el verificador.
- **Meter secretos en el cuerpo.** Es legible por diseño.
- **Tokens de horas o días sin refresh.** Ventana de robo enorme y ninguna
  forma de cerrarla.
- **«Cerrar sesión» borrando el token del cliente.** El servidor sigue
  aceptando todas las copias hasta `exp` — compárese con el caso séptimo de
  la clase 066, que un token no puede pasar.
- **El mismo secreto HS256 repartido entre servicios.** Quien puede verificar
  puede **emitir**. Varios verificadores → claves asimétricas.
- **Ignorar el margen de reloj del framework.** Cinco minutos por omisión en
  .NET; el contrato que no lo sabe mide otra cosa.

## ✅ Verificación

```bash
node scripts/run-class.mjs 067
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta
las implementaciones que encuentre y declara las que omitió.

## 🧪 Reto de transferencia

Añade `POST /token/renovar`: recibe un refresh token opaco (guardado en el
servidor, como una sesión), emite un access token nuevo y **rota** el refresh.
Añade al contrato el caso «refresh usado dos veces → 401»: la rotación
convierte el robo del refresh en un fallo detectable [@rfc9700].

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 066 — Sesión con cookie](../066-sesion-con-cookie/README.md) — la
  alternativa con estado
- [Clase 069 — OAuth 2.0 y OpenID Connect](../069-oauth-2-0-y-openid-connect/README.md) — de dónde salen los tokens cuando no los emites tú

## Fuentes

- [@rfc7519] *RFC 7519 — JSON Web Token (JWT)*. IETF, 2015 — <https://www.rfc-editor.org/rfc/rfc7519>
- [@rfc9700] *RFC 9700 — Best Current Practice for OAuth 2.0 Security*. IETF, 2025 — <https://www.rfc-editor.org/rfc/rfc9700>
- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (JSON Web Token). OWASP — <https://cheatsheetseries.owasp.org/>
