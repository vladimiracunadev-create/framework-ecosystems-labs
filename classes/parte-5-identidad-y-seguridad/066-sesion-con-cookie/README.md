# Clase 066 — Sesión con cookie

> [⬅️ 065](../../parte-4-datos/065-probar-sin-base-de-datos/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [067 ➡️](../067-token-de-acceso/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Recordar al usuario entre peticiones **sin exponerlo**. HTTP no tiene memoria;
la cookie es el mecanismo estándar para dársela [@rfc6265], y casi todo lo que
puede salir mal está en los detalles: qué viaja en la cookie, con qué
atributos, y qué pasa de verdad al cerrar sesión.

## 🧩 La situación

Un usuario entra con su contraseña y el servidor le da una cookie. Con ella,
`/perfil` responde quién es. Al salir, la cookie muere — **y no solo en el
navegador**: la copia que un atacante hubiera robado tiene que dejar de abrir
la puerta.

La regla que ordena toda la clase: **la cookie identifica, no cuenta**. A la
cookie viaja un identificador opaco; los datos —quién eres, qué puedes hacer—
viven en el servidor. En cuanto los datos viajan dentro de la cookie, el
servidor pierde la capacidad de retirarlos.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /perfil` sin cookie | `401` |
| `POST /entrar` con credenciales malas | `401`, **sin** `Set-Cookie` |
| `POST /entrar` con credenciales buenas | `200` · cookie `sesion` con `HttpOnly`, `SameSite=Lax`, `Path=/` y sin la contraseña dentro |
| `GET /perfil` con la cookie | `200` · `{"usuario": "ana"}` |
| `POST /entrar` trayendo `sesion=fijada-por-el-atacante` | la cookie emitida **no conserva ese valor** |
| `POST /salir` | `204` · cookie con `Max-Age=0` o `Expires` en el pasado |
| `GET /perfil` **reenviando la cookie vieja** | `401` |

Los dos últimos casos son la pareja que mide de verdad. El sexto comprueba que
el navegador recibe la orden de tirar la cookie; el séptimo hace lo que haría
un atacante con una copia robada: **reenviarla después del cierre**. Si el
estado de la sesión viviera dentro de la cookie, ese caso no podría pasar —
no habría nada en el servidor que borrar.

Y el quinto mide la **fijación de sesión**: el servidor no debe adoptar un
identificador que trae el cliente; el que emite al autenticar tiene que ser
suyo y nuevo [@owasp-cheatsheets].

Para poder medir esto, el verificador ganó un tarro de cookies explícito:
cada caso declara si viaja con las cookies guardadas (`cookies: true`) y solo
quien declara `guardar_cookies` escribe en el tarro. Así el último caso puede
reenviar deliberadamente una cookie que el servidor ya dio por muerta.

## 🔬 Los atributos, uno a uno

```text
Set-Cookie: sesion=k3o0…Zw; Path=/; HttpOnly; SameSite=Lax
```

- **`HttpOnly`** — el script de la página no puede leerla. Un XSS ya no puede
  exfiltrar la sesión con `document.cookie` (puede seguir usándola desde la
  página; la clase 073 vuelve sobre esto).
- **`SameSite=Lax`** — la cookie no viaja en peticiones que otra página
  provoca, salvo la navegación de nivel superior. Es la primera línea contra
  el CSRF, y la clase 072 mide qué cubre y qué no.
- **`Path=/`** — delimita dónde viaja. Aquí, toda la aplicación.
- **`Secure`** — solo sobre HTTPS [@rfc8446]. El laboratorio corre sobre HTTP
  en `127.0.0.1`, así que exigirlo en el contrato sería afirmar sin medir: se
  queda en la prosa, pero **en producción no es opcional** [@owasp-cheatsheets].

## 🌐 Las implementaciones — el código a la vista

Tres frameworks traen la pieza de serie y uno no la trae, y esa asimetría es el
hallazgo de la clase. Cada bloque es el archivo real del directorio
[`implementaciones/`](implementaciones/).

### Express · [`express/server.mjs`](implementaciones/express/server.mjs)

```javascript
app.use(
  session({
    name: "sesion",
    secret: "clave-de-firma-solo-para-el-laboratorio",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", path: "/" },
  }),
);
```

`express-session` guarda la sesión **en el servidor** y a la cookie solo viaja
el identificador, firmado con el secreto. Por eso cerrar sesión puede invalidar
de verdad.

`saveUninitialized: false` es la línea que más se olvida: sin ella, **una visita
anónima crea sesión y recibe cookie**. Menos estado y menos superficie.

Los dos gestos que exige el contrato:

```javascript
  peticion.session.regenerate((error) => {
    if (error) return respuesta.status(500).json({ error: "sesion" });
    peticion.session.usuario = usuario;
```

```javascript
  peticion.session.destroy(() => {
    respuesta.clearCookie("sesion", { path: "/" });
    respuesta.status(204).end();
  });
```

`regenerate` descarta el identificador con el que llegó la petición y emite uno
nuevo: es la defensa contra la **fijación de sesión**. `destroy` borra la
entrada del almacén y `clearCookie` le dice al navegador que tire la suya —
hacen falta los dos, y el orden de importancia es ese.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

**FastAPI no trae sesiones de servidor.** Lo que ofrece su ecosistema —el
`SessionMiddleware` de Starlette— guarda los datos *dentro* de la cookie,
firmados, y ese diseño **no puede pasar el último caso del contrato**: tras
cerrar sesión no hay nada en el servidor que borrar. Así que la implementación
compone la pieza que falta:

```python
sesiones: dict[str, str] = {}
```

```python
    identificador = secrets.token_urlsafe(32)
    sesiones[identificador] = credenciales.usuario

    respuesta = JSONResponse({"usuario": credenciales.usuario})
    respuesta.set_cookie(
        key="sesion",
        value=identificador,
        httponly=True,   # el script de la página no puede leerla
        samesite="lax",  # no viaja en peticiones que otra página provoca
        path="/",
    )
```

Se ignora cualquier cookie que traiga la petición y se emite un identificador
**nuevo** en cada inicio: la fijación muere ahí. `token_urlsafe` sale del
generador criptográfico del sistema; un contador o un `random` corriente serían
adivinables.

Y el cierre, que es donde se ve por qué el estado tiene que vivir en el
servidor:

```python
    if sesion:
        sesiones.pop(sesion, None)
    respuesta = Response(status_code=204)
    respuesta.delete_cookie(key="sesion", path="/")
```

Sin el `pop`, una copia robada de la cookie seguiría abriendo la puerta.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
        HttpSession sesion = peticion.getSession(true);
        peticion.changeSessionId();
        sesion.setAttribute("usuario", usuario);
```

El almacén no lo pone Spring: lo pone **el contenedor**, Tomcat. `HttpSession`
es la API de Servlet, anterior a Spring y compartida por todo el ecosistema
JVM. `changeSessionId()` es el equivalente exacto del `regenerate` de Express.

`getSession(true)` crea si no existe; en `/perfil` se usa `getSession(false)`
justo por lo contrario:

```java
        HttpSession sesion = peticion.getSession(false);
        Object usuario = sesion == null ? null : sesion.getAttribute("usuario");
```

Y el detalle que esta clase existe para enseñar:

```java
        if (sesion != null) {
            sesion.invalidate();
        }
        Cookie borrado = new Cookie("sesion", "");
        borrado.setMaxAge(0);
        borrado.setPath("/");
        respuesta.addCookie(borrado);
```

`invalidate()` borra el almacén, **pero no ordena al navegador tirar la
cookie**. Esa cabecera de borrado se emite a mano. Es la única de las cuatro
implementaciones donde el framework hace medio trabajo y no avisa.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
constructor.Services.AddDistributedMemoryCache();
constructor.Services.AddSession(opciones =>
{
    opciones.Cookie.Name = "sesion";
    opciones.Cookie.HttpOnly = true;
    opciones.Cookie.SameSite = SameSiteMode.Lax;
    opciones.Cookie.Path = "/";
    opciones.Cookie.IsEssential = true;
});
```

La sesión se apoya en `IDistributedCache`: aquí una caché en memoria, en
producción una compartida. `IsEssential = true` es la trampa propia de este
framework — sin ella la cookie queda sujeta a la política de consentimiento y
**el middleware puede decidir no emitirla**.

```csharp
    contexto.Session.SetString("usuario", usuario);
```

No hay `regenerate` porque no hace falta: el identificador viaja protegido con
Data Protection, y **un valor que este servidor no emitió no descifra**. La
fijación se cierra por construcción, no por un gesto que haya que acordarse de
escribir.

```csharp
    contexto.Session.Clear();
    contexto.Response.Cookies.Delete("sesion", new CookieOptions { Path = "/" });
```

Los mismos dos gestos que en Express, con los mismos dos motivos.

## 📊 Comparación

| Framework | La pieza | Dónde vive el estado | Fijación | Invalidar al salir |
| --- | --- | --- | --- | --- |
| Express | `express-session` | almacén del middleware | `regenerate()` **explícito** | `destroy()` + `clearCookie()` |
| FastAPI | no la trae: se compone | diccionario propio | identificador nuevo en cada inicio | `pop` + `delete_cookie()` |
| Spring Boot | `HttpSession` (Tomcat) | contenedor de servlets | `changeSessionId()` **explícito** | `invalidate()` + cookie a mano |
| ASP.NET Core | `AddSession()` | `IDistributedCache` | un valor ajeno no descifra | `Clear()` + `Cookies.Delete()` |

En los cuatro, el estado en memoria comparte la limitación de las clases 034 y
047: con dos instancias, cada una tendría sus sesiones. En producción el
almacén es compartido — Redis es lo habitual, y en ASP.NET Core es
literalmente cambiar el registro de `IDistributedCache`.

## ⚠️ Errores frecuentes

- **Guardar datos en la cookie para «ahorrar» el almacén.** Funciona hasta que
  hay que revocar. Si el estado viaja con el cliente, cerrar sesión es una
  sugerencia.
- **Cerrar sesión borrando solo la cookie.** El navegador la tira; la copia
  robada sigue abriendo. La sesión se mata **en el servidor**
  [@owasp-cheatsheets].
- **Conservar el identificador de antes de autenticar.** Es la fijación de
  sesión: el atacante planta un identificador, la víctima entra, y el atacante
  ya está dentro [@hoffman-web-application-security].
- **Identificadores adivinables.** Un contador o un `random` corriente en vez
  del generador criptográfico. NIST pide identificadores impredecibles y con
  entropía suficiente [@nist-800-63b].
- **Sin `HttpOnly` «para leerla desde el frontend».** Si el frontend necesita
  saber quién eres, se lo dice un endpoint (`/perfil`), no la cookie.
- **Sesiones sin caducidad.** Este laboratorio la omite deliberadamente para
  no medir relojes; en producción, caducidad absoluta y de inactividad
  [@nist-800-63b].

## ✅ Verificación

```bash
node scripts/run-class.mjs 066
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta
las implementaciones que encuentre y declara las que omitió.

## 🧪 Reto de transferencia

Añade `GET /sesiones` que liste las sesiones vivas del usuario autenticado y
`POST /salir-de-todas` que las mate todas — el botón «cerrar sesión en todos
los dispositivos». Exige cambiar el almacén: de identificador → usuario a
poder buscar por usuario. Comprueba con el contrato que tras salir de todas,
ninguna cookie antigua vale.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 067 — Token de acceso](../067-token-de-acceso/README.md) — la
  alternativa sin estado, y qué se pierde al elegirla
- [Clase 072 — CSRF](../072-csrf/README.md) — el ataque que explota que la
  cookie viaja sola
- [Clase 034 — Limitación de tasa](../../parte-2-la-tuberia/034-limitacion-de-tasa/README.md) — la misma lección sobre estado en el proceso

## Fuentes

- [@rfc6265] *RFC 6265 — HTTP State Management Mechanism*. IETF, 2011 — <https://www.rfc-editor.org/rfc/rfc6265>
- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (Session Management). OWASP — <https://cheatsheetseries.owasp.org/>
- [@nist-800-63b] *SP 800-63B — Digital Identity Guidelines: Authentication and Lifecycle Management*. NIST — <https://pages.nist.gov/800-63-3/sp800-63b.html>
- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
- [@rfc8446] *RFC 8446 — The Transport Layer Security (TLS) Protocol Version 1.3*. IETF, 2018 — <https://www.rfc-editor.org/rfc/rfc8446>
