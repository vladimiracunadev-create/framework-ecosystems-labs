# Clase 070 — Autorización por rol

> [⬅️ 069](../069-oauth-2-0-y-openid-connect/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [071 ➡️](../071-autorizacion-por-recurso/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Separar **quién eres** de **qué puedes hacer**. Las clases 066 a 069
resolvieron la primera pregunta; esta clase resuelve la segunda — y mide la
distinción que más se confunde en la práctica: `401` no es `403`.

## 🧩 La situación

Dos usuarios con la misma contraseña y distinto rol: `ana` es administradora,
`luis` es lector. El mismo `/panel` responde `200` a una y `403` al otro; las
`/tareas` las leen los dos; borrarlas exige el rol de administradora.

## 🧮 El contrato

| Petición | Respuesta | Qué mide |
| --- | --- | --- |
| `GET /panel` sin credenciales | `401` + `WWW-Authenticate` | no sé quién eres: **te pido credenciales** |
| credenciales malas | `401` | sigue sin saberse quién eres |
| `ana` (administradora) | `200` | el rol permitido |
| `luis` (lector) | **`403`** | sé quién eres **y no puedes** — sin pedir credenciales |
| `GET /tareas` como `luis` | `200` | el rol corta por recurso, no por persona |
| `DELETE /tareas/1` como `luis` | `403` | la misma ruta, otro verbo, otra regla |
| `DELETE /tareas/1` como `ana` | `204` | y el borrado **ocurre** |
| `GET /tareas` después | `total: 1` | no fue un 204 decorativo |

La pareja `401`/`403` es el corazón: ante un `401` el cliente reintenta con
credenciales; ante un `403`, no — reintentar no va a cambiar tu rol. Un
servidor que confunde los dos rompe a todos los clientes bien escritos
[@rfc9110]. Y el último caso evita el fallo clásico de las pruebas de
autorización: comprobar el código de estado y no comprobar **el efecto**.

La autenticación es Basic [@rfc9110] a propósito: credenciales estáticas en
la cabecera dejan el contrato enfocado en lo que la clase enseña, que es la
autorización.

## 🌐 Las implementaciones

El reparto vuelve a ser desigual, y es el hallazgo de la clase:

- **Spring Boot** — aquí sí entra **Spring Security entero**: usuarios en
  memoria con roles, y las reglas en un `SecurityFilterChain` —
  `requestMatchers("/panel").hasRole("ADMIN")`. La autorización vive en la
  configuración, no en los controladores.
- **ASP.NET Core** — el framework parte el problema en dos: la
  **autenticación es enchufable** (el esquema Basic se escribe a mano, no
  viene) y la **autorización es de serie** — políticas con nombre
  (`RequireRole`) que cada ruta pide con `RequireAuthorization`.
- **Express** — no trae ni una cosa ni la otra: el archivo entero *es* el
  framework de autorización. Treinta líneas legibles — y tuyas para siempre,
  con sus futuros bugs.
- **FastAPI** — sin roles de serie, pero `Depends` hace algo que ninguno de
  los otros hace: la regla queda **en la firma de la ruta**
  (`Depends(con_rol("admin"))`) — quién puede qué se lee sin leer el cuerpo.

## 📊 Comparación

| Framework | La regla vive en… | Se lee en la ruta | Quién la mantiene |
| --- | --- | --- | --- |
| Spring Boot | la configuración central | no — hay que ir a la cadena | el framework |
| ASP.NET Core | políticas con nombre | sí — `RequireAuthorization("…")` | el framework |
| Express | middleware propio | sí — `conRol("admin")` | **tú** |
| FastAPI | dependencias propias | sí — en la firma | **tú** |

Centralizar (Spring) hace imposible olvidar una ruta nueva sin pasar por la
configuración; declarar en la ruta (los otros tres) hace el permiso visible
donde se usa. Los dos estilos fallan distinto: la regla central que nadie
actualizó frente a la ruta nueva a la que nadie puso middleware.

## ⚠️ Errores frecuentes

- **403 donde va 401, y al revés.** El cliente no puede decidir si reintentar.
- **Autorizar solo en la interfaz.** Ocultar el botón de borrar no protege el
  `DELETE`: el contrato de esta clase pega directamente contra la API, como
  cualquier atacante [@owasp-top10].
- **Probar el código de estado y no el efecto.** Un `204` que no borró pasa
  todas las pruebas menos la última de este contrato.
- **El rol dentro del recurso** (`if usuario.rol == "admin"` repetido en cada
  handler). Se olvida uno y nadie lo ve: la regla debe vivir en una pieza —
  middleware, política o configuración.
- **Roles que crecen sin límite** (`editor-senior-fines-de-semana`). El rol
  responde «qué clase de usuario eres»; cuando la pregunta es «¿es tuyo este
  dato?», el rol no alcanza — esa es la clase 071.

## ✅ Verificación

```bash
node scripts/run-class.mjs 070
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta
las implementaciones que encuentre y declara las que omitió.

## 🧪 Reto de transferencia

Añade el rol `editora` que puede crear (`POST /tareas`) pero no borrar, y los
tres casos que lo midan. Observa en cuál de las cuatro implementaciones el
cambio toca **un** archivo y en cuál toca varios — esa diferencia es la tabla
de comparación hecha carne.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 071 — Autorización por recurso](../071-autorizacion-por-recurso/README.md) — cuando el rol no alcanza
- [Clase 031 — Manejo centralizado de errores](../../parte-2-la-tuberia/031-manejo-centralizado-de-errores/README.md) — la misma lección: la regla en un solo lugar

## Fuentes

- [@rfc9110] *RFC 9110 — HTTP Semantics* (§15.5.2 401, §15.5.4 403, §11 autenticación). IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@owasp-top10] *OWASP Top 10* (A01: Broken Access Control). OWASP — <https://owasp.org/www-project-top-ten/>
- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (Authorization). OWASP — <https://cheatsheetseries.owasp.org/>
