# Clase 075 — Secretos y configuración

> [⬅️ 074](../074-inyeccion-sql/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [076 ➡️](../076-auditoria/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🟡 intermedio** · Pista **`plataforma`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Sacar del código **lo que no puede estar en el repositorio**. Un secreto en
el código es un secreto publicado: vive en el historial de git para siempre,
lo ve todo el que clona, y rotarlo obliga a un commit. La configuración
—secretos incluidos— entra por **el entorno**, no por el fuente
[@twelve-factor].

## 🧩 La situación

La aplicación necesita dos cosas para arrancar: en qué entorno corre y un
secreto. Las dos vienen de variables de entorno. Si falta alguna, **la
aplicación no arranca** — y lo dice claro, nombrando lo que falta. Si están,
arranca y reporta su configuración **sin revelar nunca el secreto**.

## 🧮 El contrato

| Petición | Respuesta | Qué mide |
| --- | --- | --- |
| `GET /configuracion` | `entorno: "pruebas"`, `secreto_presente: true` | la config viene del entorno |
| `GET /configuracion` | **no contiene** el valor del secreto | se reporta presencia, no valor |
| `POST /validar` con las dos claves | `valida: true` | el validador acepta lo completo |
| `POST /validar` sin `APP_SECRETO` | `422`, **nombra** `APP_SECRETO` | falla claro y dice qué falta |
| `POST /validar` con `{}` | `422`, nombra **las dos** | enumera todo, no solo lo primero |

El validador de `/validar` es **el mismo** que corre en el arranque: la regla
que decide si la aplicación puede levantar es la que responde el endpoint.
Eso hace medible por HTTP algo que ocurre antes de la primera petición — que
la aplicación **no habría arrancado** sin las variables es, de hecho, lo que
prueba que las lee: el verificador les da valor por su campo `env`, y si no
lo hiciera, ninguna de las cuatro escucharía.

El último caso mide un detalle que cuesta despliegues reales: enumerar
**todo** lo que falta de una vez. Un validador que se rinde en la primera
variable ausente convierte «faltan tres» en tres arranques fallidos
seguidos.

## 🌐 Las implementaciones

Aquí el reparto se invierte respecto a las clases de autorización: **el
framework con más ceremonia trae más ayuda**, y el minimalista te deja la
regla entera:

- **FastAPI** — el más equipado: `pydantic-settings` (`BaseSettings`) lee el
  entorno, convierte tipos y **falla al construirse** si falta una
  obligatoria. La validación es la declaración de la clase. (La
  implementación usa un validador explícito para medir el mismo mensaje en
  los cuatro, pero la vía idiomática es aún más corta.)
- **Spring Boot** — `application.properties` mapea `APP_ENTORNO` a
  `app.entorno` y `@Value` lo inyecta; un `@PostConstruct` corre el
  validador y **aborta el contexto** si falta algo.
- **ASP.NET Core** — `IConfiguration` unifica entorno, `appsettings.json` y
  argumentos en una sola fuente ordenada; el validador corre antes de
  `Build()`.
- **Express** — nada de esto viene incluido: `process.env` y un validador de
  seis líneas. Explícito y tuyo, como toda la seguridad de esta pista en
  Node.

## 📊 Comparación

| Framework | De dónde lee | La validación | El secreto en el reporte |
| --- | --- | --- | --- |
| FastAPI | `BaseSettings` | al construir el objeto | enmascarado |
| Spring Boot | `application.properties` ← entorno | `@PostConstruct` | enmascarado |
| ASP.NET Core | `IConfiguration` (fuentes en capas) | antes de `Build()` | enmascarado |
| Express | `process.env` | validador propio | enmascarado |

La diferencia no es de seguridad —los cuatro fallan al arrancar y ninguno
filtra el secreto— sino de **cuánto código pones tú**. Y el orden de fuentes
de ASP.NET (`appsettings` < entorno < argumentos) es la respuesta a un
problema real que las otras resuelven a mano: qué gana cuando la misma clave
está en dos sitios.

## 🔑 Qué es un secreto y qué no

- **Configuración**: en qué entorno corres, a qué URL apuntas, cuántos
  trabajadores. No es sensible; cambia entre despliegues. Puede ir en un
  fichero versionado por entorno.
- **Secreto**: la clave de la base, el token de la API, la clave de firma de
  la clase 067. Su filtración es un incidente. **Nunca** en el repositorio,
  ni siquiera en un `.env` commiteado.

El `.env` es una herramienta de **desarrollo local** —cómodo, y por eso
peligroso— que va siempre en `.gitignore`. En producción, el secreto lo
inyecta la plataforma: variables del orquestador, un gestor de secretos
(Vault, Secrets Manager), nunca un fichero en la imagen [@owasp-cheatsheets].

## ⚠️ Errores frecuentes

- **El secreto con valor por omisión.** `APP_SECRETO ?? "cambiar-esto"`
  arranca sin protestar y corre en producción con la clave del ejemplo. Sin
  valor por defecto, el arranque falla — que es lo que quieres.
- **Fallar en la primera petición, no al arrancar.** Un secreto que solo se
  lee cuando se usa esconde la falta hasta que un usuario la encuentra.
- **Loguear la configuración completa al arrancar.** El secreto acaba en los
  registros, que suelen tener menos protección que la base.
- **Un endpoint de configuración que devuelve el secreto.** El propio
  agujero: el segundo caso del contrato existe por esto.
- **Rendirse en la primera variable ausente.** Enumera todas.
- **`.env` en el repositorio.** Aunque el repositorio sea privado: privado
  hoy no es privado dentro de tres adquisiciones.

## ✅ Verificación

```bash
node scripts/run-class.mjs 075
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta
las implementaciones que encuentre y declara las que omitió, y les inyecta
`APP_ENTORNO` y `APP_SECRETO` por el campo `env` de cada receta.

## 🧪 Reto de transferencia

Añade una clave **tipada**: `APP_MAX_CONEXIONES`, un entero. Haz que el
arranque falle si no es un número (`"muchas"` → error claro con la clave y el
tipo esperado) y añade el caso al contrato. Observa cuál de los cuatro
frameworks te da la conversión y la validación de tipo **gratis** — es la
diferencia entre leer `process.env` y declarar un `BaseSettings`.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 067 — Token de acceso](../067-token-de-acceso/README.md) — la clave
  de firma que esta clase saca del código
- [Clase 078 — Dependencias vulnerables](../078-dependencias-vulnerables/README.md) — la otra mitad de la seguridad de plataforma

## Fuentes

- [@twelve-factor] *The Twelve-Factor App* (III. Config). — <https://12factor.net/>
- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (Secrets Management). OWASP — <https://cheatsheetseries.owasp.org/>
- [@nist-ssdf] *SP 800-218 — Secure Software Development Framework (SSDF)*. NIST — <https://csrc.nist.gov/projects/ssdf>
