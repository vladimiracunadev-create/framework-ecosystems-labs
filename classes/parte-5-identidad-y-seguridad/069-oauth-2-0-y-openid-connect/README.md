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

## 🌐 Las implementaciones

Las cuatro son deliberadamente **la misma lógica**: registro de clientes con
`redirect_uri` fija, códigos de un solo uso con su reto PKCE guardado, y el
canje que compara `S256(verificador)` contra ese reto. El protocolo no deja
margen creativo, y eso también enseña — la creatividad en un protocolo de
seguridad es el fallo. Cambia solo la pieza que firma el `id_token`: las
mismas cuatro bibliotecas de la clase 067.

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
