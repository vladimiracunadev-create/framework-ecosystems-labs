# Por qué sí y por qué no — Contraseñas bien guardadas

> [⬅️ Clase 068](README.md) · [📚 Parte 5](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | `bcryptjs` puro JavaScript: instala en cualquier sitio, sin compilador ni scripts | bcrypt trunca a 72 bytes en silencio, y la variante JS es más lenta que la nativa | Saber el límite de 72 bytes o heredar su sorpresa |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Argon2id con parámetros sensatos de fábrica: la opción que OWASP pone primera | La pieza es 100 % externa: el framework no opina ni valida nada de esto | Elegir bien la biblioteca — el framework no te protege de elegir mal |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `PasswordEncoder` es una interfaz: bcrypt hoy, Argon2 mañana, y `{bcrypt}` delegante para migrar | El módulo bueno viene dentro de Spring Security y hay que saber pedir solo `spring-security-crypto` | Conocer el mapa de módulos para no arrastrar el framework de seguridad entero |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `PasswordHasher` versiona el formato y avisa con `SuccessRehashNeeded`: la migración de coste está pensada de serie | PBKDF2 es el más débil de los cuatro contra GPUs al mismo coste de CPU | Compensar con más iteraciones lo que el algoritmo no trae de resistencia a memoria |

## 🧭 El hallazgo

Los cuatro resúmenes llevan **la sal y los parámetros dentro**. No es
casualidad ni conveniencia: es la lección de diseño de la clase. El resumen
es un dato **autodescriptivo** — se verifica sin configuración y se migra
sin romper lo anterior. Compárese con guardar sal y coste en columnas
aparte: cada verificación necesita leer tres campos y la migración necesita
un plan.

La diferencia real entre los cuatro no está en la seguridad de hoy sino en
la **migración de mañana**: Spring (`DelegatingPasswordEncoder`) y ASP.NET
(`SuccessRehashNeeded`) traen el camino de actualización de serie; en
Express y FastAPI ese camino se escribe a mano. Las contraseñas viven años;
el algoritmo que las guarda, no.

## ⚖️ Y por qué no «algo más simple»

SHA-256 con sal parece suficiente y no lo es: la velocidad que lo hace
barato para ti lo hace barato para la GPU del atacante. NIST pide funciones
de derivación con coste [@nist-800-63b] y OWASP ordena las opciones —
Argon2id, scrypt, bcrypt, PBKDF2 — todas con la misma propiedad: **ser
lentas es su función** [@owasp-cheatsheets]. Es de los pocos lugares de la
ingeniería donde se paga a propósito por rendimiento peor.

## Fuentes

- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (Password Storage). OWASP — <https://cheatsheetseries.owasp.org/>
- [@nist-800-63b] *SP 800-63B — Digital Identity Guidelines*. NIST — <https://pages.nist.gov/800-63-3/sp800-63b.html>
