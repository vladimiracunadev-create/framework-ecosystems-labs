# Clase 068 — Contraseñas bien guardadas

> [⬅️ 067](../067-token-de-acceso/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [069 ➡️](../069-oauth-2-0-y-openid-connect/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Almacenar contraseñas de forma que **un volcado de la base de datos no las
revele**. La amenaza que ordena la clase no es «me roban una contraseña»: es
«me roban la tabla entera», y contra eso la única defensa es que lo guardado
no sea la contraseña — ni nada que permita recuperarla [@owasp-cheatsheets].

## 🧩 La situación

`POST /usuarios` registra y `POST /entrar` verifica. Entre las dos, la
contraseña se convierte en un **resumen con sal y coste**: la misma
contraseña, registrada dos veces, produce resúmenes distintos — y las dos
verifican.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| registrar a `ana` con `secreta123` | `201` · el resumen, y **la contraseña no aparece en la respuesta** |
| registrar a `bea` con **la misma** `secreta123` | `201` · un resumen **distinto** al de `ana` |
| registrar a `ana` otra vez | `409` |
| entrar con la contraseña correcta | `200` |
| entrar con la incorrecta | `401` |
| entrar con un usuario que no existe | `401` — **el mismo** que la clave mala |

El segundo caso es el que mide la sal: sin ella, dos usuarios con la misma
contraseña comparten resumen, y quien vuelca la tabla lo ve — y ataca una vez
para entrar en dos cuentas. El verificador lo comprueba con `json_distinto`:
guarda el primer resumen y exige que el segundo no coincida.

El último caso mide la **enumeración de usuarios**: si «no existe» respondiera
distinto que «clave mala», el formulario de entrada sería un oráculo de qué
correos están registrados.

> La ruta de registro devuelve el resumen **como ventana de inspección del
> laboratorio**: es lo que el contrato necesita medir. En producción, el
> resumen no sale de la base de datos.

## 📖 Por qué un resumen no basta, y qué le falta

- **Resumen** (SHA-256 a secas) — irreversible, pero idéntico para claves
  idénticas y calculable a miles de millones por segundo en una GPU. Las
  tablas precalculadas lo comen.
- **+ Sal** — un valor aleatorio por usuario, guardado junto al resumen. Mata
  las tablas precalculadas y hace único cada resumen. Es lo que mide el
  segundo caso.
- **+ Coste** — el algoritmo se hace **deliberadamente lento** (bcrypt,
  scrypt, Argon2, PBKDF2). Al usuario le cuesta cien milisegundos una vez; al
  atacante, cien milisegundos **por intento** — y su negocio son los miles de
  millones de intentos [@nist-800-63b].

Los cuatro algoritmos de esta clase escriben la sal y sus parámetros **dentro
del propio resumen** — por eso verificar no necesita configuración, y por eso
se puede subir el coste mañana sin romper los resúmenes de ayer.

## 🌐 Las implementaciones

Como en la 067, ningún framework hace esto solo — y otra vez la pieza dice
de quién es el problema:

- **Express** — `bcryptjs`, coste 12. La variante pura de JavaScript: sin
  compilación nativa, sin scripts de instalación (que este repositorio
  bloquea deliberadamente).
- **FastAPI** — `argon2-cffi`: **Argon2id**, el ganador del Password Hashing
  Competition y la primera opción de OWASP [@owasp-cheatsheets].
  `PasswordHasher()` trae parámetros sensatos sin decidir nada.
- **Spring Boot** — `spring-security-crypto`, solo el módulo de criptografía:
  `BCryptPasswordEncoder(12)` sin arrastrar filtros ni sesiones.
- **ASP.NET Core** — `PasswordHasher<T>` de Identity: PBKDF2 con sal
  aleatoria, y la versión del formato dentro del resumen —
  `SuccessRehashNeeded` avisa cuando un resumen viejo merece actualizarse.

Las cuatro verifican contra un **resumen señuelo** cuando el usuario no
existe: rechazar sin verificar tardaría microsegundos frente a los cien
milisegundos de una verificación real, y ese delta de tiempo también es un
oráculo de enumeración.

## 📊 Comparación

| Framework | Pieza | Algoritmo | La sal | El formato |
| --- | --- | --- | --- | --- |
| Express | `bcryptjs` | bcrypt | dentro del resumen | `$2b$12$…` |
| FastAPI | `argon2-cffi` | **Argon2id** | dentro del resumen | `$argon2id$v=19$m=…` |
| Spring Boot | `spring-security-crypto` | bcrypt | dentro del resumen | `$2a$12$…` |
| ASP.NET Core | `PasswordHasher<T>` | PBKDF2-HMAC | dentro del resumen | base64 con byte de versión |

Tres formatos legibles que declaran algoritmo y coste, y uno opaco con
versión binaria. El efecto es el mismo; la diferencia aparece al **migrar**:
los `$…$` se inspeccionan con los ojos, el de Identity necesita su decoder.

## ⚠️ Errores frecuentes

- **Cifrar en vez de resumir.** El cifrado se descifra: quien roba la base y
  la clave de cifrado tiene todas las contraseñas. Un resumen no se deshace.
- **Resumen rápido (SHA-256, MD5) aunque tenga sal.** La GPU del atacante
  agradece la velocidad. El coste es la defensa, no la irreversibilidad sola.
- **La misma sal para todos** («pepper» casero mal entendido). Vuelve a unir
  los resúmenes de claves iguales — exactamente lo que el segundo caso caza.
- **Comparar resúmenes con `==`.** La comparación que corta al primer byte
  distinto filtra información por tiempo; las bibliotecas comparan en tiempo
  constante y por eso se usa su `verify`, no el tuyo.
- **Distinguir «usuario no existe» de «clave mala»** — en el mensaje o en el
  tiempo de respuesta.
- **Límites de longitud heredados del algoritmo sin saberlo.** bcrypt trunca
  a 72 bytes en silencio: dos claves que empiezan igual durante 72 bytes son
  la misma. Argon2 no trunca.

## ✅ Verificación

```bash
node scripts/run-class.mjs 068
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta
las implementaciones que encuentre y declara las que omitió.

## 🧪 Reto de transferencia

Implementa la **migración de coste**: baja el coste a 4, registra un usuario,
súbelo a 12 y haz que el siguiente inicio de sesión re-resuma la contraseña
con el coste nuevo (es el único momento en que el servidor la tiene en
claro). Añade al contrato un caso que verifique que el resumen cambió de
formato tras entrar.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 066 — Sesión con cookie](../066-sesion-con-cookie/README.md) — qué
  se entrega a cambio de la contraseña
- [Clase 078 — Dependencias vulnerables](../078-dependencias-vulnerables/README.md) — la otra mitad de «me roban la base»

## Fuentes

- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (Password Storage). OWASP — <https://cheatsheetseries.owasp.org/>
- [@nist-800-63b] *SP 800-63B — Digital Identity Guidelines: Authentication and Lifecycle Management*. NIST — <https://pages.nist.gov/800-63-3/sp800-63b.html>
- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
- [@adkins-building-secure-reliable] Adkins, H. et al. *Building Secure and Reliable Systems*. O'Reilly Media, 2020. ISBN 9781492083122 — <https://openlibrary.org/isbn/9781492083122>
