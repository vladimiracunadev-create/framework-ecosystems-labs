# Por qué sí y por qué no — Secretos y configuración

> [⬅️ Clase 075](README.md) · [📚 Parte 5](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | `process.env` y un validador de seis líneas: nada que aprender, todo a la vista | Sin tipos ni validación de serie: cada clave la conviertes y compruebas tú | Reescribir en cada proyecto lo que otros declaran una vez |
| [FastAPI](../../../atlas/fichas/fastapi.md) | `BaseSettings` lee, tipa y valida al construir: la config es una clase declarada | Una dependencia más (`pydantic-settings`) y su curva de `Field`, `env_prefix`, orígenes | Aprender su modelo para lo que en Express es un `??` |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `@ConfigurationProperties` con validación de Bean: tipado, anidado y validado por anotaciones | La ceremonia de propiedades, perfiles y `@Value` antes de la primera lectura | La curva de la jerarquía de configuración de Spring |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `IConfiguration` unifica fuentes en capas con precedencia definida: el problema de «quién gana» resuelto | El modelo de proveedores es potente y por eso no es trivial | Entender el orden de fuentes para no sorprenderse |

## 🧭 El hallazgo

Esta clase invierte el reparto de las de autorización. Allí, los frameworks
con opinión traían la defensa y los minimalistas te daban piezas; aquí, el
**minimalista (Express) te da la regla entera** y los equipados
(FastAPI, Spring, ASP.NET) traen lectura tipada, validación declarativa y
precedencia de fuentes.

La razón es qué clase de problema es cada uno. La autorización depende de tu
dominio —qué es un rol, de quién es el dato— y el framework no puede
adivinarlo. La configuración es un problema **genérico y resuelto**: leer
claves de un entorno, tiparlas, validar que estén. Cuando el problema es
universal, el framework equipado gana; cuando es tuyo, no hay atajo.

## ⚖️ La línea que no se cruza

Todo lo demás en esta clase es preferencia; una cosa no lo es: **el secreto
nunca en el repositorio**. Ni en el código, ni en un `.env` commiteado, ni en
un `appsettings.json` con la clave de producción, ni «temporalmente para la
demo». El historial de git es permanente y público en cuanto el repositorio
lo es —y los repositorios privados dejan de serlo con una fuga, una
adquisición o un error de permisos [@owasp-cheatsheets].

La consecuencia práctica: un secreto que tocó el repositorio **ya está
comprometido** y hay que rotarlo, no borrarlo del último commit. Por eso la
defensa de verdad no es «borrar el secreto que subí» sino que no llegue a
subir: `.gitignore` del `.env`, escáneres de secretos en el gancho de
pre-commit, y la disciplina de que la única fuente en producción sea la
plataforma [@nist-ssdf].

## Fuentes

- [@twelve-factor] *The Twelve-Factor App* (III. Config). — <https://12factor.net/>
- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (Secrets Management). OWASP — <https://cheatsheetseries.owasp.org/>
- [@nist-ssdf] *SP 800-218 — Secure Software Development Framework*. NIST — <https://csrc.nist.gov/projects/ssdf>
