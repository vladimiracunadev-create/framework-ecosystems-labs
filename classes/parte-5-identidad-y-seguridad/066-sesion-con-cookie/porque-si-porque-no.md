# Por qué sí y por qué no — Sesión con cookie

> [⬅️ Clase 066](README.md) · [📚 Parte 5](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | `express-session` con almacenes intercambiables: de un `Map` a Redis sin tocar las rutas | La defensa contra la fijación es **opt-in**: quien no llama a `regenerate()` no la tiene | Recordar el paso que el framework no da por ti |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Componer la pieza deja el mecanismo a la vista: se entiende todo porque se escribió todo | El middleware que su ecosistema sí ofrece guarda los datos **en la cookie** — y eso no se puede revocar | Mantener código de seguridad propio, que es donde más caro sale equivocarse |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `HttpSession` lleva veinte años en producción; los atributos de la cookie se declaran en configuración | `invalidate()` no borra la cookie del navegador: el gesto queda a medias sin ayuda manual | Saber qué hace el contenedor y qué te deja a ti |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | El identificador viaja cifrado con Data Protection: la fijación muere sin código propio | `Session` espera al primer acceso para emitir cookie, y `IsEssential` sorprende a quien no lo conoce | Entender la política de consentimiento aunque no la uses |

## 🧭 La asimetría que enseña

Tres frameworks traen sesiones de servidor de serie y FastAPI no. No es un
descuido: FastAPI se define como framework de **APIs**, y una API moderna
tiende al token sin estado (clase 067). La sesión con cookie pertenece al
mundo de la aplicación web clásica, y quien la quiere en FastAPI la compone.

La trampa está en el medio: el `SessionMiddleware` de Starlette parece la
pieza que falta, pero guarda los datos dentro de la cookie firmada. Para un
carrito o una preferencia de idioma, perfecto. Para identidad, no pasa el
último caso del contrato: **una cookie que se lleva los datos consigo no se
puede revocar desde el servidor**. La diferencia entre «lleva la sesión» y
«lleva un puntero a la sesión» parece un matiz y es toda la clase.

## 🔒 Dónde se decide la seguridad

En dos gestos que el contrato mide y que ningún framework hace entero por ti:

1. **Regenerar el identificador al autenticar.** Express y Spring lo dejan a
   una llamada explícita; olvidarla no rompe nada visible — la aplicación
   funciona igual, solo que fijable [@owasp-cheatsheets].
2. **Matar la sesión en el servidor al salir.** Borrar la cookie es cortesía
   con el navegador; la seguridad está en el almacén. NIST lo formula como
   terminación de sesión, no de cookie [@nist-800-63b].

Los dos comparten forma con la clase 047: el fallo no lanza excepción, no
deja registro, y todas las pruebas felices pasan. Solo un caso que ataca —
reenviar la cookie muerta, plantar un identificador— lo hace visible.

## Fuentes

- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (Session Management). OWASP — <https://cheatsheetseries.owasp.org/>
- [@nist-800-63b] *SP 800-63B — Digital Identity Guidelines*. NIST — <https://pages.nist.gov/800-63-3/sp800-63b.html>
