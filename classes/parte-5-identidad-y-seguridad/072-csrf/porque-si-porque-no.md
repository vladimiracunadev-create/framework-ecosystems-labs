# Por qué sí y por qué no — CSRF

> [⬅️ Clase 072](README.md) · [📚 Parte 5](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | La versión a mano son quince líneas y se entienden todas | `csurf` retirado: el ecosistema dejó huérfana la defensa de un ataque del top de OWASP | Mantener tú lo que el ecosistema soltó |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Componerla sobre la sesión propia es natural — ya compusiste la sesión | El framework asume APIs con token donde el CSRF no aplica, y no te avisa cuando sí aplica | Saber tú cuándo estás en el caso con cookies |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | **Activa por omisión**: la única de las cuatro que protege sin pedirlo | Por eso mismo, `csrf.disable()` es la línea más copiada de sus tutoriales | Entender la defensa para saber cuándo apagarla es obligatorio, no opcional |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `Antiforgery` de serie, con el double-submit firmado que no necesita sesión | La validación en APIs mínimas es explícita: quien no llama a validar no valida | Un olvido silencioso posible por endpoint |

## 🧭 El hallazgo

La postura de cada framework ante el CSRF retrata su generación:

- **Spring y ASP.NET** nacieron sirviendo formularios con cookies — el CSRF
  era SU problema, y la defensa vino de serie y encendida.
- **Express** lo tuvo (csurf) y lo **perdió**: el ecosistema migró a APIs
  con token, el paquete quedó sin uso, sin mantenimiento, y retirado.
- **FastAPI** nació después de esa migración y nunca lo trajo.

La trampa está en que la migración no fue completa: las aplicaciones con
cookies de sesión siguen existiendo — la mitad de esta parte las construye —
y quien las sirve con Express o FastAPI hereda un ataque de primera división
sin defensa de serie [@owasp-cheatsheets].

## ⚖️ Cuándo NO hace falta

La defensa CSRF protege **la autenticación que el navegador adjunta solo**.
Si la credencial viaja en un encabezado que el código escribe a mano
(`Authorization: Bearer …`, clase 067), la página del atacante no puede
adjuntarla — no hay CSRF que defender.

De ahí la regla que resume la parte:

| Credencial | ¿CSRF? |
| --- | --- |
| Cookie de sesión | **sí**: SameSite + testigo |
| Token en encabezado | no |
| Cookie **con** token en encabezado (BFF) | sí, por la cookie |

Y de ahí que `csrf.disable()` sea legítimo en las clases 070 y 071 (Basic
por encabezado, sin cookies) e ilegítimo en cuanto la 066 entra en escena.
La línea es la misma; el contexto decide.

## Fuentes

- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (CSRF Prevention). OWASP — <https://cheatsheetseries.owasp.org/>
- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
