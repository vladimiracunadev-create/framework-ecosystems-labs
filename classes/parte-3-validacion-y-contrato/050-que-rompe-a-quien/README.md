# Clase 050 — Qué rompe a quién

> [⬅️ 049](../049-el-contrato-como-prueba/README.md) · [📚 Parte 3](../README.md) · [🎓 Clases](../../README.md) · [051 ➡️](../../parte-4-datos/051-conectar-a-una-base-de-datos/README.md)
>
> Parte **3 — Validación y contrato** · Nivel **🔴 avanzado** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Clasificar un cambio como **compatible o incompatible antes de publicarlo**, y
demostrarlo con la petición del cliente antiguo en lugar de razonarlo.

## 🧩 La situación

Tres versiones del mismo recurso, servidas a la vez:

- **v1** — el contrato original.
- **v2** — tres cambios **compatibles**.
- **v3** — tres cambios **incompatibles**.

Y **la misma petición del cliente antiguo** enviada a las tres. Lo que pasa con
ella es la prueba.

## 📖 Los seis cambios

### Compatibles: el cliente antiguo sigue funcionando

| # | Cambio | Por qué no rompe |
| --- | --- | --- |
| 1 | Añadir un campo **opcional** a la entrada | Quien no lo envía sigue igual |
| 2 | Añadir un campo a la **salida** | El cliente que no lo lee no se entera |
| 3 | Añadir un valor a un conjunto de **salida** | Idem, si el cliente no valida lo que recibe |

### Incompatibles: lo rompen

| # | Cambio | Cómo rompe |
| --- | --- | --- |
| 4 | Hacer **obligatorio** un campo que no lo era | El cliente antiguo no lo envía → 422 |
| 5 | **Renombrar o quitar** un campo de la salida | El cliente lee `undefined` **y no se entera** |
| 6 | **Estrechar** una validación | Un valor que antes valía deja de valer |

## ⚠️ El quinto es el peligroso

Los cambios 4 y 6 producen un **422 ruidoso**: el cliente falla, alguien lo ve,
se investiga. Son malos y visibles.

El cambio 5 es distinto. Renombrar `titulo` a `nombre` en la salida hace que el
cliente lea `undefined` y **siga adelante**: guarda una cadena vacía, muestra un
hueco, envía un correo sin asunto. **No hay error en ningún sitio.**

El contrato de esta clase lo comprueba explícitamente —la v3 responde `201` con
`nombre` en lugar de `titulo`— porque **el éxito aparente es lo que lo hace
grave**.

## 🧩 Y la asimetría que ordena todo

| | Entrada | Salida |
| --- | --- | --- |
| **Añadir** | compatible si es opcional | **compatible** |
| **Quitar** | compatible | **incompatible** |
| **Estrechar** | **incompatible** | compatible |
| **Ampliar** | compatible | **incompatible** si el cliente valida |

Es el principio de robustez con nombre y apellidos: **sé permisivo con lo que
recibes y conservador con lo que envías**. Lo que aceptas puede crecer sin
romper a nadie; lo que prometes, no.

Y hay una consecuencia práctica que casi nadie aplica: **un cliente que valida
estrictamente lo que recibe convierte el cambio 3 en incompatible**. Por eso la
regla de la clase 041 era rechazar lo desconocido **en la entrada** y tolerarlo
**en la salida**.

## 🧮 El contrato

| Petición | Respuesta | Qué demuestra |
| --- | --- | --- |
| cliente antiguo → v1 | `201` con `titulo` | punto de partida |
| **el mismo** → v2 | `201` con `titulo` | **compatible** |
| igual | además `prioridad` y `estado` | lo nuevo no estorba |
| **el mismo** → v3 | `422`, campo `prioridad` | **incompatible** |
| título de 129 → v3 | `422`, campo `titulo` | validación estrechada |
| completo → v3 | `201` con `nombre` | **el rompimiento silencioso** |

Fíjate en que el contrato **no razona**: envía la petición del cliente antiguo y
mira qué vuelve. Es la única forma honesta de clasificar un cambio.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Cambio incompatible**](../../../glosario/README.md#cambio-incompatible) *(Breaking change)* | Un cambio que hace fallar a un cliente que funcionaba. Quitar un campo lo es; añadir uno opcional, no. Saber cuál es cuál es lo que permite evolucionar una API sin coordinar despliegues. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Express** | framework web de Node.js (JavaScript) | 2010 | MIT | OpenJS Foundation |
| **FastAPI** | framework web de Python (Python) | 2018 | MIT | proyecto independiente |
| **Spring Boot** | framework de aplicación de JVM (Java) | 2014 | Apache-2.0 | Broadcom/VMware y colaboradores |
| **ASP.NET Core** | framework web de .NET (C#) | 2016 | MIT | Microsoft y .NET Foundation |

### 🔧 Express

Definió el modelo de middleware encadenado que copiaron casi todos los frameworks de Node.js. Minimalista no significa biblioteca: posee el bucle de peticiones.

- **Documentación oficial:** <https://expressjs.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `express ^5.1.0`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node server.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

### 🔧 FastAPI

Deriva validación, serialización y documentación OpenAPI de las anotaciones de tipo. Demostró que el tipado opcional de Python podía ser infraestructura, no adorno.

- **Documentación oficial:** <https://fastapi.tiangolo.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `fastapi==0.121.3, uvicorn==0.40.0`
- **Necesita en el PATH:** `python`

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 python -m uvicorn main:app --host 127.0.0.1 --port 3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `main.py` | código Python |
| `requirements.txt` | dependencias de Python, una por línea, con versión fijada |

### 🔧 Spring Boot

Autoconfiguración y servidor incrustado sobre Spring. Convirtió un framework famoso por su configuración XML en uno de arranque inmediato.

- **Documentación oficial:** <https://spring.io/projects/spring-boot>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-050-1.0.0.jar --server.port=3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `pom.xml` | manifiesto de Maven: el proyecto, su Java, sus dependencias y cómo se empaqueta |
| `src/main/java/labs/Aplicacion.java` | código Java |

### 🔧 ASP.NET Core

Reescritura multiplataforma y de código abierto de la pila web de Microsoft. Sus API mínimas trajeron el estilo de los microframeworks al ecosistema .NET.

- **Documentación oficial:** <https://learn.microsoft.com/aspnet/core/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `net10.0`
- **Necesita en el PATH:** `dotnet`

Preparar sus dependencias, dentro de su directorio:

```bash
dotnet build -c Release --nologo -v quiet
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 dotnet run -c Release --no-build --urls http://127.0.0.1:3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `Clase050.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones

Las cuatro sirven **las tres versiones a la vez** para que el cliente antiguo
pueda demostrarlo con una petición. El código está en
[`implementaciones/`](implementaciones/), con cada cambio comentado y clasificado.

## 🔬 Comparación

| Cambio | En la entrada | En la salida |
| --- | --- | --- |
| Añadir | compatible si es opcional | **compatible** |
| Quitar | compatible | **incompatible** |
| Estrechar | **incompatible** | compatible |
| Ampliar | compatible | **incompatible** si el cliente valida |

Es la tabla que resume la clase, y la asimetría entre columnas es el principio de
robustez: **lo que aceptas puede crecer; lo que prometes, no**.

## 🧭 Qué hacer cuando el cambio es incompatible

Tres caminos, en orden de preferencia:

**1. No lo hagas incompatible.** Casi siempre se puede: en vez de renombrar
`titulo` a `nombre`, **devuelve los dos** durante un tiempo. Cuesta una línea y
compra meses.

**2. Versiona.** La clase 044 compara las formas. Es honesto y multiplica el
código que mantienes.

**3. Coordina la migración.** Solo funciona si conoces a todos tus clientes —una
API interna, sí; una pública, nunca—.

Y hay un paso previo que casi nadie da y decide entre el 1 y el 3: **saber quién
consume qué campo**. Sin esa información, todo cambio es una apuesta. Con
registro por campo consumido, la conversación pasa de «¿esto romperá algo?» a
«esto afecta a estos tres clientes».

Geewax lo trata como el problema central de evolucionar una API
[@geewax-api-design-patterns], y Newman lo enmarca en la coordinación entre
equipos: **un cambio incompatible es un despliegue coordinado disfrazado de
cambio de código** [@newman-building-microservices].

## ⚠️ Errores frecuentes

- **Renombrar un campo de salida.** El fallo más silencioso de la lista.
- **Añadir un campo obligatorio** en lugar de opcional con valor por omisión.
- **Estrechar una validación** sin mirar los datos que ya entraron.
- **Cambiar el tipo de un campo.** De `"1"` a `1` rompe a todo cliente tipado.
- **Cambiar el significado sin cambiar el nombre.** Que `estado` pase de
  `"ok"` a `"OK"` no es cosmético.
- **Clasificar razonando.** Envía la petición del cliente antiguo y míralo.

## ✅ Verificación

```bash
node scripts/run-class.mjs 050
```

## 🧪 Reto de transferencia

Añade una **v4** que renombre `titulo` a `nombre` **manteniendo los dos** durante
la transición, y marca el antiguo como obsoleto en el documento de OpenAPI.
Comprueba que el cliente antiguo y el nuevo funcionan a la vez. Eso es una
migración compatible, y es lo que evita las tres opciones incómodas de arriba.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 044 — Versionado de API](../044-versionado-de-api/README.md)
- [Módulo 05 — Backend y API](../../../curriculum/05-backend-y-api.md)

## Fuentes

- [@geewax-api-design-patterns] Geewax, JJ. *API Design Patterns*. Manning, 2021. ISBN 9781617295850 — <https://openlibrary.org/isbn/9781617295850>
- [@newman-building-microservices] Newman, Sam. *Building Microservices*, 2.ª ed. O'Reilly Media, 2021. ISBN 9781492034025 — <https://openlibrary.org/isbn/9781492034025>
- [@semver] *Semantic Versioning 2.0.0* — <https://semver.org/>
