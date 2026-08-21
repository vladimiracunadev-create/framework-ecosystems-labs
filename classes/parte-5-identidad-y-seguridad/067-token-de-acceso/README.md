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

## 🌐 Las implementaciones

Ningún framework de los cuatro firma tokens por sí mismo — en los cuatro la
pieza es una biblioteca, y eso ya es el hallazgo:

- **Express** — `jsonwebtoken`: `sign()` y `verify()` con `algorithms`
  fijado.
- **FastAPI** — `PyJWT`: `encode()` y `decode(…, algorithms=["HS256"])`, que
  verifica `exp` por omisión.
- **Spring Boot** — `jjwt`: `parseSignedClaims()` solo acepta tokens
  *firmados* — `alg: none` se rechaza por tipo, no por caso especial. Y exige
  256 bits de clave para HS256: una clave corta no arranca.
- **ASP.NET Core** — `Microsoft.IdentityModel.JsonWebTokens`:
  `TokenValidationParameters` con `ValidAlgorithms` y un detalle que hay que
  saber: **el margen de reloj por omisión es de cinco minutos** — un token
  caducado hace tres minutos sigue entrando. El contrato lo pone a cero.

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
