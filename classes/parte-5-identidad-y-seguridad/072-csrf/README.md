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

## 🌐 Las implementaciones

El reparto más nítido de la parte hasta ahora:

- **Spring Boot** — la protección **no se escribe: se usa**. El `CsrfFilter`
  de Spring Security guarda el testigo en la sesión, exige `X-CSRF-TOKEN` en
  todo lo que muta y responde 403 él solo — el código de la ruta ni se
  entera de los ataques. El login solo lee el testigo y lo entrega.
- **ASP.NET Core** — igual de serio: `AddAntiforgery` emite un **par**
  (cookie firmada + testigo) y `ValidateRequestAsync` comprueba que casan.
  Es el patrón *double-submit* con firma, la variante sin estado del
  testigo.
- **Express** — el middleware histórico, `csurf`, está **retirado**. La
  defensa se compone a mano sobre `express-session`: quince líneas con
  `timingSafeEqual`. Que el paquete de referencia de un ataque del top de
  OWASP quedara sin mantenimiento es un dato sobre el ecosistema, no una
  anécdota.
- **FastAPI** — nunca lo tuvo: se compone sobre la sesión de la clase 066,
  con `secrets.compare_digest`.

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
