# Parte 1 — Responder: lo primero que hace cualquier framework

> [⬅️ Parte 0](../parte-0-el-metodo/README.md) · [🎓 Todas las clases](../README.md) · [📖 Glosario](../../glosario/README.md) · [Parte 2 ➡️](../parte-2-la-tuberia/README.md)

**De levantar un proceso que escucha en un puerto a servir una respuesta correcta. El terreno común de todos los frameworks de servidor.**

**Clases 11 a 25** · 15 en total · 15 construidas · 11 tecnologías en juego.

## 🧭 De qué va esta parte

Lo primero que hace cualquier framework de servidor es **recibir una petición y devolver una respuesta**. Quince clases sobre esa frase, porque dentro de ella caben casi todas las decisiones que un framework toma por ti.

El recorrido va de lo más simple —levantar un proceso que responde `hola`— a lo que ya no lo es: negociar el formato, transmitir sin conocer el tamaño total, comprimir, y decidir quién puede leer tu respuesta desde otro origen.

Todo lo de aquí está definido en un estándar público, así que cuando diez frameworks de seis ecosistemas coinciden **no es casualidad ni gusto de nadie**: lo dicta la especificación. Y cuando difieren, la diferencia es un valor por omisión — que es precisamente lo que interesa comparar.

## 🎒 Qué da por sabido

- La parte 0, sobre todo la clase 003: qué es un contrato y por qué es idéntico para todos.
- Las cuatro partes de una petición HTTP y las cuatro familias de códigos de estado ([conocimientos previos](../../empezar/conocimientos-previos.md)).

## 🎯 Qué sabrás hacer al terminarla

- Levantar un servidor mínimo en cualquiera de diez frameworks y saber qué decidió cada uno por ti.
- Elegir el código de estado correcto y justificarlo con el estándar, no con la costumbre.
- Leer y escribir cabeceras sabiendo cuáles no distinguen mayúsculas y cuáles pueden venir repetidas.
- Distinguir un cuerpo ilegible de uno legible pero incompleto, y responder distinto a cada uno.
- Servir archivos, subirlos y transmitir en flujo sin gastar memoria proporcional al tamaño.
- Configurar CORS con una lista explícita, y explicar por qué reflejar cualquier origen equivale a no tener defensa.

## 🧵 Por qué en este orden

Las cinco primeras clases son el núcleo mínimo: arrancar, enrutar, leer parámetros, elegir el verbo y elegir el código. Con eso ya se puede escribir una API entera, mal.

Las siete siguientes son lo que la separa de estar bien: cabeceras, cuerpo, negociación, redirecciones, estáticos, subidas y flujo.

Las tres últimas miran hacia abajo y hacia fuera: la compresión y CORS son decisiones de transporte, y la 025 abre el capó para ver qué hay entre el socket y tu función.

## 📚 Las clases

| # | Clase | Qué resuelve | Nivel | Estado |
| --- | --- | --- | --- | --- |
| [011](011-levantar-un-servidor-y-responder/README.md) | [Levantar un servidor y responder](011-levantar-un-servidor-y-responder/README.md) | Arrancar un proceso que escucha y devuelve una respuesta. | 🟢 introductorio | ✅ Construida |
| [012](012-rutas-y-parametros-de-ruta/README.md) | [Rutas y parámetros de ruta](012-rutas-y-parametros-de-ruta/README.md) | Extraer del camino la parte variable. | 🟢 introductorio | ✅ Construida |
| [013](013-parametros-de-consulta/README.md) | [Parámetros de consulta](013-parametros-de-consulta/README.md) | Leer la cadena de consulta y aplicar valores por omisión. | 🟢 introductorio | ✅ Construida |
| [014](014-verbos-http-y-su-semantica/README.md) | [Verbos HTTP y su semántica](014-verbos-http-y-su-semantica/README.md) | Elegir el método correcto y respetar lo que promete. | 🟢 introductorio | ✅ Construida |
| [015](015-codigos-de-estado/README.md) | [Códigos de estado](015-codigos-de-estado/README.md) | Devolver el código que describe lo ocurrido, no siempre 200. | 🟢 introductorio | ✅ Construida |
| [016](016-cabeceras-leer-y-escribir/README.md) | [Cabeceras: leer y escribir](016-cabeceras-leer-y-escribir/README.md) | Usar las cabeceras como parte del contrato, no como decoración. | 🟢 introductorio | ✅ Construida |
| [017](017-cuerpo-json-recibir-y-devolver/README.md) | [Cuerpo JSON: recibir y devolver](017-cuerpo-json-recibir-y-devolver/README.md) | Deserializar la entrada y serializar la salida sin sorpresas. | 🟢 introductorio | ✅ Construida |
| [018](018-negociacion-de-contenido/README.md) | [Negociación de contenido](018-negociacion-de-contenido/README.md) | Servir la representación que el cliente pide. | 🟡 intermedio | ✅ Construida |
| [019](019-redirecciones/README.md) | [Redirecciones](019-redirecciones/README.md) | Distinguir permanente de temporal y saber cuándo cambia el método. | 🟢 introductorio | ✅ Construida |
| [020](020-servir-archivos-estaticos/README.md) | [Servir archivos estáticos](020-servir-archivos-estaticos/README.md) | Entregar un archivo del disco con el tipo y la caché correctos. | 🟢 introductorio | ✅ Construida |
| [021](021-subida-de-archivos/README.md) | [Subida de archivos](021-subida-de-archivos/README.md) | Recibir multipart sin cargarlo entero en memoria. | 🟡 intermedio | ✅ Construida |
| [022](022-respuesta-en-flujo/README.md) | [Respuesta en flujo](022-respuesta-en-flujo/README.md) | Enviar la respuesta a trozos, sin construirla entera antes. | 🟡 intermedio | ✅ Construida |
| [023](023-compresion/README.md) | [Compresión](023-compresion/README.md) | Comprimir cuando compensa, y no cuando no. | 🟡 intermedio | ✅ Construida |
| [024](024-cors/README.md) | [CORS](024-cors/README.md) | Entender la comprobación previa antes de configurarla. | 🟡 intermedio | ✅ Construida |
| [025](025-que-hace-tu-framework-con-el-socket/README.md) | [Qué hace tu framework con el socket](025-que-hace-tu-framework-con-el-socket/README.md) | Ver la capa que hay debajo del framework: servidor, adaptador y protocolo. | 🔴 avanzado | ✅ Construida |

## 🎬 Las tecnologías que aparecen

Entre paréntesis, en cuántas clases de esta parte interviene cada una. **Estar aquí no es una recomendación**: es que el problema de esa clase existe de verdad para esa tecnología.

| Ecosistema | Tecnologías |
| --- | --- |
| **Python** | [FastAPI](../../atlas/fichas/fastapi.md) (15), [Django](../../atlas/fichas/django.md) (7), [Flask](../../atlas/fichas/flask.md) (7) |
| **Node.js** | [Express](../../atlas/fichas/express.md) (15), [Fastify](../../atlas/fichas/fastify.md) (7) |
| **JVM** | [Spring Boot](../../atlas/fichas/spring-boot.md) (15) |
| **.NET** | [ASP.NET Core](../../atlas/fichas/aspnet-core.md) (14) |
| **Go** | [Gin](../../atlas/fichas/gin.md) (8) |
| **PHP** | [Laravel](../../atlas/fichas/laravel.md) (7) |
| **Ruby** | [Ruby on Rails](../../atlas/fichas/rails.md) (7) |
| **JavaScript** | [Node.js](../../atlas/fichas/nodejs.md) (1) |

## 📖 Las palabras que esta parte define

[**Método HTTP**](../../glosario/README.md#método-http) · [**Código de estado**](../../glosario/README.md#código-de-estado) · [**Cabecera**](../../glosario/README.md#cabecera) · [**Negociación de contenido**](../../glosario/README.md#negociación-de-contenido) · [**Redirección**](../../glosario/README.md#redirección) · [**Respuesta en flujo**](../../glosario/README.md#respuesta-en-flujo) · [**Codificación troceada**](../../glosario/README.md#codificación-troceada) · [**Bucle de eventos**](../../glosario/README.md#bucle-de-eventos) · [**Un hilo por petición**](../../glosario/README.md#un-hilo-por-petición) · [**CORS**](../../glosario/README.md#cors) · [**Origen**](../../glosario/README.md#origen) · [**Comprobación previa**](../../glosario/README.md#comprobación-previa)

Todas, con su definición, en el [glosario](../../glosario/README.md).

## ✅ Cómo se ejecuta una clase de esta parte

```bash
node scripts/run-class.mjs 011
```

El verificador arranca cada implementación, la somete a su `contrato.json` y **declara cuáles omitió** por no encontrar su cadena de herramientas. Si te faltan cadenas, `node scripts/doctor.mjs` dice cuáles y cómo se instalan.

## ➡️ Y después

La parte 2 se mete entre la petición y tu manejador: todo lo que ocurre antes de que tu código se ejecute, y por qué eso es donde vive casi toda la seguridad.
