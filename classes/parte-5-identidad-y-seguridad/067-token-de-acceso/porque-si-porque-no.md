# Por qué sí y por qué no — Token de acceso

> [⬅️ Clase 067](README.md) · [📚 Parte 5](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | `jsonwebtoken` es el estándar de facto de Node: dos funciones y listo | Fijar `algorithms` es responsabilidad tuya; sin la lista, decide el token | Conocer el ataque para saber qué opción activa la defensa |
| [FastAPI](../../../atlas/fichas/fastapi.md) | `PyJWT` hace `algorithms` **obligatorio**: la API no deja escribir la versión vulnerable | Firmar y verificar a mano queda fuera del framework: nada te integra el `Depends` de seguridad solo | Escribir la extracción del `Bearer` y el 401 tú mismo |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `jjwt` rechaza `alg: none` por tipo y exige clave de 256 bits: dos errores clásicos imposibles | La pieza oficial (resource server de Spring Security) solo verifica; para emitir hay que salirse de ella | Dos mundos —biblioteca para emitir, framework para verificar— que hay que reconciliar |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `TokenValidationParameters` cubre emisor, audiencia, vida y algoritmo en un solo objeto | `ClockSkew` de **cinco minutos por omisión**: el token caducado que sigue entrando sorprende en el peor momento | Leer los valores por omisión antes de confiar en ellos |

## 🧭 El hallazgo transversal

Ninguno de los cuatro frameworks firma tokens: **en los cuatro, la pieza es
una biblioteca**. Compárese con la clase 066, donde tres de cuatro traían la
sesión de serie. La industria decidió que la sesión es del framework y el
token es de una biblioteca — y eso cuenta una historia: el token nació para
cruzar fronteras entre servicios [@rfc6749], y lo que cruza fronteras no
puede depender de un framework concreto.

## ⚖️ La decisión real

No es «token porque es moderno». Es una compra con precio:

- **Compras**: verificar sin tocar red ni almacén, escalar horizontal sin
  sesiones pegajosas, y que un tercero verifique sin llamarte.
- **Pagas**: no poder revocar. El caso séptimo de la 066 —la credencial
  robada que deja de valer al cerrar sesión— **no existe aquí**: un token
  robado vale hasta su `exp`, lo borres donde lo borres.

Por eso la práctica actual empareja tokens **cortos** con refresh tokens
rotativos guardados en el servidor [@rfc9700]: se recupera la capacidad de
revocar pagando un poco de estado. El péndulo vuelve al medio.

## Fuentes

- [@rfc6749] *RFC 6749 — The OAuth 2.0 Authorization Framework*. IETF, 2012 — <https://www.rfc-editor.org/rfc/rfc6749>
- [@rfc9700] *RFC 9700 — Best Current Practice for OAuth 2.0 Security*. IETF, 2025 — <https://www.rfc-editor.org/rfc/rfc9700>
