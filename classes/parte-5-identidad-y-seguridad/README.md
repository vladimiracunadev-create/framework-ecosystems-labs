# Parte 5 — Identidad y seguridad

> [⬅️ Parte 4](../parte-4-datos/README.md) · [🎓 Todas las clases](../README.md) · [📖 Glosario](../../glosario/README.md) · [Parte 6 ➡️](../parte-6-la-interfaz/README.md)

**Quién eres, qué puedes hacer, y las defensas que el framework trae o no trae puestas.**

**Clases 66 a 78** · 13 en total · 13 construidas · 13 tecnologías en juego.

## 🧭 De qué va esta parte

Trece clases sobre lo que ocurre cuando alguien **intenta usar el sistema de una forma que no estaba prevista**.

No es una parte sobre criptografía. Es sobre las decisiones que un framework toma por ti y las que te deja: si escapa por omisión, si trae el testigo CSRF puesto, si su ORM cierra la inyección por construcción, si te obliga a distinguir el 401 del 403.

Y es la parte donde más se nota la diferencia entre lo que un framework **permite** y lo que **garantiza**. Un framework que hace difícil el error correcto es peor que uno que lo hace imposible, aunque los dos «se puedan usar bien».

## 🎒 Qué da por sabido

- Las partes 1 a 4, sobre todo la tubería de la parte 2: casi toda la defensa vive ahí.
- Qué es una cookie y qué significan sus atributos ([conocimientos previos](../../empezar/conocimientos-previos.md)).

## 🎯 Qué sabrás hacer al terminarla

- Montar sesión con cookie y token de acceso, y decir qué se gana y qué se pierde con cada uno.
- Guardar contraseñas con una función de derivación lenta, y cerrar la enumeración de usuarios **en la respuesta y en el tiempo**.
- Implementar el flujo de OAuth 2.0 con PKCE, y explicar qué ataque cierra cada defensa.
- Distinguir autorización por rol de autorización por recurso, y por qué la segunda no se puede declarar.
- Cerrar CSRF, XSS e inyección SQL, y nombrar en cada framework la puerta explícita que las reabre.
- Auditar las dependencias que no elegiste y decidir qué hacer con un hallazgo transitivo.

## 🧵 Por qué en este orden

Las cuatro primeras responden «quién eres»: sesión, token, contraseñas y el protocolo estándar para delegarlo.

Las dos siguientes responden «qué puedes»: por rol y por recurso, que son preguntas de naturaleza distinta.

Las siete últimas son los ataques concretos y sus defensas: CSRF, XSS, inyección, secretos, auditoría, política de contenido y dependencias vulnerables. En ese orden porque cada uno usa lo anterior.

## 📚 Las clases

| # | Clase | Qué resuelve | Nivel | Estado |
| --- | --- | --- | --- | --- |
| [066](066-sesion-con-cookie/README.md) | [Sesión con cookie](066-sesion-con-cookie/README.md) | Recordar al usuario entre peticiones sin exponerlo. | 🟡 intermedio | ✅ Construida |
| [067](067-token-de-acceso/README.md) | [Token de acceso](067-token-de-acceso/README.md) | Firmar y verificar una credencial sin estado en el servidor. | 🟡 intermedio | ✅ Construida |
| [068](068-contrasenas-bien-guardadas/README.md) | [Contraseñas bien guardadas](068-contrasenas-bien-guardadas/README.md) | Almacenar de forma que un volcado no las revele. | 🟡 intermedio | ✅ Construida |
| [069](069-oauth-2-0-y-openid-connect/README.md) | [OAuth 2.0 y OpenID Connect](069-oauth-2-0-y-openid-connect/README.md) | Delegar la identidad sin manejar credenciales ajenas. | 🔴 avanzado | ✅ Construida |
| [070](070-autorizacion-por-rol/README.md) | [Autorización por rol](070-autorizacion-por-rol/README.md) | Separar quién eres de qué puedes hacer. | 🟡 intermedio | ✅ Construida |
| [071](071-autorizacion-por-recurso/README.md) | [Autorización por recurso](071-autorizacion-por-recurso/README.md) | Comprobar la propiedad del dato, no solo el rol. | 🔴 avanzado | ✅ Construida |
| [072](072-csrf/README.md) | [CSRF](072-csrf/README.md) | Entender el ataque antes de activar la defensa. | 🟡 intermedio | ✅ Construida |
| [073](073-xss-y-escapado/README.md) | [XSS y escapado](073-xss-y-escapado/README.md) | Ver qué escapa el framework por omisión y qué no. | 🟡 intermedio | ✅ Construida |
| [074](074-inyeccion-sql/README.md) | [Inyección SQL](074-inyeccion-sql/README.md) | Comprobar que la consulta parametrizada lo es de verdad. | 🟡 intermedio | ✅ Construida |
| [075](075-secretos-y-configuracion/README.md) | [Secretos y configuración](075-secretos-y-configuracion/README.md) | Sacar del código lo que no puede estar en el repositorio. | 🟡 intermedio | ✅ Construida |
| [076](076-auditoria/README.md) | [Auditoría](076-auditoria/README.md) | Dejar rastro de quién hizo qué, utilizable después. | 🔴 avanzado | ✅ Construida |
| [077](077-politica-de-seguridad-de-contenido/README.md) | [Política de seguridad de contenido](077-politica-de-seguridad-de-contenido/README.md) | Limitar lo que el navegador acepta ejecutar. | 🔴 avanzado | ✅ Construida |
| [078](078-dependencias-vulnerables/README.md) | [Dependencias vulnerables](078-dependencias-vulnerables/README.md) | Saber qué arrastras y cuándo te expone. | 🟡 intermedio | ✅ Construida |

## 🎬 Las tecnologías que aparecen

Entre paréntesis, en cuántas clases de esta parte interviene cada una. **Estar aquí no es una recomendación**: es que el problema de esa clase existe de verdad para esa tecnología.

| Ecosistema | Tecnologías |
| --- | --- |
| **JavaScript/TypeScript** | [React](../../atlas/fichas/react.md) (2), [SolidJS](../../atlas/fichas/solid.md) (2), [Svelte](../../atlas/fichas/svelte.md) (2), [Vue](../../atlas/fichas/vue.md) (2), [Lit](../../atlas/fichas/lit.md) (1), [Prisma ORM](../../atlas/fichas/prisma.md) (1) |
| **.NET** | [ASP.NET Core](../../atlas/fichas/aspnet-core.md) (10), [Entity Framework Core](../../atlas/fichas/entity-framework-core.md) (1) |
| **Python** | [FastAPI](../../atlas/fichas/fastapi.md) (10), [SQLAlchemy](../../atlas/fichas/sqlalchemy.md) (1) |
| **JVM** | [Spring Boot](../../atlas/fichas/spring-boot.md) (10), [Hibernate ORM](../../atlas/fichas/hibernate.md) (1) |
| **Node.js** | [Express](../../atlas/fichas/express.md) (10) |

## 📖 Las palabras que esta parte define

[**Sesión**](../../glosario/README.md#sesión) · [**Cookie**](../../glosario/README.md#cookie) · [**Fijación de sesión**](../../glosario/README.md#fijación-de-sesión) · [**Token de acceso**](../../glosario/README.md#token-de-acceso) · [**Función de derivación de clave**](../../glosario/README.md#función-de-derivación-de-clave) · [**Comparación en tiempo constante**](../../glosario/README.md#comparación-en-tiempo-constante) · [**Enumeración de usuarios**](../../glosario/README.md#enumeración-de-usuarios) · [**OAuth 2.0**](../../glosario/README.md#oauth-20) · [**OpenID Connect**](../../glosario/README.md#openid-connect) · [**PKCE**](../../glosario/README.md#pkce) · [**Autorización por rol**](../../glosario/README.md#autorización-por-rol) · [**Autorización por recurso**](../../glosario/README.md#autorización-por-recurso) · [**Seguro (método)**](../../glosario/README.md#seguro-método) · [**CSRF**](../../glosario/README.md#csrf) · [**Testigo sincronizado**](../../glosario/README.md#testigo-sincronizado) · [**XSS**](../../glosario/README.md#xss) · [**Inyección SQL**](../../glosario/README.md#inyección-sql) · [**Consulta parametrizada**](../../glosario/README.md#consulta-parametrizada) · [**Configuración por entorno**](../../glosario/README.md#configuración-por-entorno) · [**Secreto**](../../glosario/README.md#secreto) · [**Auditoría**](../../glosario/README.md#auditoría) · [**Política de seguridad de contenido**](../../glosario/README.md#política-de-seguridad-de-contenido) · [**Nonce**](../../glosario/README.md#nonce) · [**Archivo de bloqueo**](../../glosario/README.md#archivo-de-bloqueo) · [**Dependencia transitiva**](../../glosario/README.md#dependencia-transitiva) · [**Versionado semántico**](../../glosario/README.md#versionado-semántico) · [**Cadena de suministro**](../../glosario/README.md#cadena-de-suministro)

Todas, con su definición, en el [glosario](../../glosario/README.md).

## ✅ Cómo se ejecuta una clase de esta parte

```bash
node scripts/run-class.mjs 066
```

El verificador arranca cada implementación, la somete a su `contrato.json` y **declara cuáles omitió** por no encontrar su cadena de herramientas. Si te faltan cadenas, `node scripts/doctor.mjs` dice cuáles y cómo se instalan.

## ➡️ Y después

La parte 6 cambia de lado del cable: del servidor que responde al navegador que pinta.
