# Clase 025 — Qué hace tu framework con el socket

> [⬅️ 024](../024-cors/README.md) · [📚 Parte 1](../README.md) · [🎓 Clases](../../README.md) · [026 ➡️](../../parte-2-la-tuberia/026-el-patron-middleware/README.md)
>
> Parte **1 — Responder** · Nivel **🔴 avanzado** · Pista **`backend`**
>
> ✅ **Clase construida** — 5 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Cerrar la parte 1 mirando **debajo** del framework: qué hay entre el socket y tu
manejador, y qué añade exactamente cada capa. Es la clase que convierte catorce
recetas en un modelo mental.

## 🧩 La situación

La misma respuesta —`{"capa": "..."}` en la raíz y un 404 en JSON fuera de ella—
servida **sin framework** y con cuatro frameworks distintos. El contrato es
idéntico; lo que cambia es cuánto código hace falta y cuántas capas hay debajo.

## 🌐 El punto de partida: sin framework

```javascript
import http from "node:http";

const servidor = http.createServer((peticion, respuesta) => {
  if (peticion.method === "GET" && peticion.url === "/") {
    respuesta.writeHead(200, { "content-type": "application/json" });
    respuesta.end(JSON.stringify({ capa: "sin framework" }));
    return;
  }
  respuesta.writeHead(404, { "content-type": "application/json" });
  respuesta.end(JSON.stringify({ error: "no existe" }));
});
```

**Esto es todo lo que hay.** Node analiza la línea de petición y las cabeceras;
lo demás lo escribes tú. Y en esas doce líneas ya se ven las tres cosas que un
framework aporta:

| En el código sin framework | Lo que aporta el framework |
| --- | --- |
| un `if` con método y ruta | tabla de rutas con parámetros |
| la rama final del `if` | 404 automático |
| `writeHead` + `end` con JSON a mano | serialización y cabeceras |

Escala mal por una razón concreta: **con veinte rutas, ese `if` es una cascada de
comparaciones**, y cada una hay que mantenerla a mano. Un enrutador convierte eso
en una estructura de datos.

## 🏗️ Las capas de cada uno

### Express sobre Node

```text
socket → http de Node → Express → middleware → tu manejador
```

Express **no reemplaza el servidor**: lo envuelve. `app.listen()` llama por debajo
a `http.createServer`. Lo que añade son la tabla de rutas, la cadena de middleware
y los valores por omisión.

Se ve en que puedes mezclar ambos mundos: `http.createServer(app)` funciona,
porque una aplicación de Express **es** un manejador de peticiones de Node.

### FastAPI sobre ASGI

```text
socket → Uvicorn → ASGI → Starlette → FastAPI → tu función
```

Aquí hay una frontera que no existe en Express: **FastAPI no tiene servidor**.
Define una aplicación ASGI, y un servidor externo la ejecuta.

Esa frontera es la que permite cambiar Uvicorn por otro servidor sin tocar la
aplicación, y también la que obliga a desplegar dos piezas en lugar de una. Es un
compromiso, y explica por qué la receta de arranque dice `uvicorn main:app`.

### Spring Boot con servidor incrustado

```text
socket → Tomcat (dentro del proceso) → contenedor de servlets → despachador → filtros → tu método
```

**La pila más profunda de las cinco.** Spring Boot incrusta un servidor completo
dentro del proceso e invierte la relación histórica: antes se desplegaba la
aplicación *dentro* de un servidor; ahora el servidor viene *dentro* de la
aplicación.

Ese cambio —que la [ficha de Spring Boot](../../../atlas/fichas/spring-boot.md)
sitúa en su contexto— es el que hizo posible el `java -jar` de una sola pieza y,
con él, los contenedores.

Cada capa cuesta arranque y aporta algo: el contenedor de servlets da la API de
servlets, el despachador da el enrutado por anotaciones, los filtros dan la
cadena de intercepción.

### Gin sobre net/http

```text
socket → net/http de Go → Gin → tu manejador
```

La misma forma que Express, con una diferencia de fondo: **el servidor ya venía
con el lenguaje**. Go trae en su biblioteca estándar un servidor HTTP de calidad
de producción, así que Gin no tiene que traerlo.

Eso explica por qué los frameworks de Go son más pequeños que los de cualquier
otro ecosistema del Atlas: no compiten con el vacío, compiten con algo que ya está
bien resuelto.

## 🌐 Las implementaciones

Las cinco cumplen el mismo contrato. Los fragmentos de arriba son los archivos
reales de [`implementaciones/`](implementaciones/): la versión sin framework en
[`nodejs/server.mjs`](implementaciones/nodejs/server.mjs), y las cuatro restantes
en sus carpetas correspondientes.

Lo que conviene mirar al compararlas no es la longitud, sino **qué línea hace el
enrutado y qué línea produce el 404**. En la versión sin framework las dos son
tuyas; en las otras cuatro, ninguna.

## 🔬 Comparación

| Implementación | Capas hasta tu código | ¿Trae servidor? | Líneas para el contrato |
| --- | --- | --- | --- |
| Node sin framework | 1 | el lenguaje | 12 |
| Gin | 2 | el lenguaje | 10 |
| Express | 2 | el lenguaje | 8 |
| FastAPI | 4 | **no**, externo | 8 |
| Spring Boot | 5 | incrustado | 20 |

**Menos capas no es mejor.** Cada una existe porque resuelve algo:

- La tabla de rutas evita la cascada de `if`.
- La cadena de middleware evita repetir la autenticación en cada manejador.
- El contenedor de inversión de control evita construir dependencias a mano.

**Lo que se paga son dos cosas concretas**: el tiempo de arranque —la clase 136 lo
mide— y el coste de depurar cuando algo va mal en una capa que no escribiste. Un
fallo dentro del despachador de Spring exige entender el despachador.

## 🎓 La lección de la parte 1

Catorce clases de HTTP se resumen en una frase: **el framework no hace nada que no
pudieras escribir tú; hace que no tengas que escribirlo cada vez**.

Todo lo de esta parte —rutas, verbos, códigos, cabeceras, JSON, negociación,
redirecciones, estáticos, subidas, flujos, compresión, CORS— está en el estándar
[@rfc9110]. Los frameworks no lo inventan: lo empaquetan con distintos valores por
omisión.

Por eso quien entiende HTTP puede aprender cualquiera de los diez en un día, y
quien solo conoce un framework empieza de cero con el siguiente. Es el argumento
del [módulo 00](../../../curriculum/00-taxonomia-y-diagnostico.md), y ahora está
demostrado clase por clase.

## ⚠️ Errores frecuentes

- **Creer que el framework «es» el servidor.** Express y Gin envuelven el del
  lenguaje; FastAPI necesita uno externo; Spring Boot incrusta uno completo.
- **Optimizar la capa del framework.** Casi nunca es donde está el tiempo.
- **Desplegar una aplicación ASGI sin servidor.** `python main.py` no levanta
  FastAPI.
- **Suponer que menos capas es mejor.** Cada una resuelve algo que si no
  escribes tú.
- **Depurar sin saber qué hay debajo.** Un fallo en el despachador exige conocer
  el despachador.

## ✅ Verificación

```bash
node scripts/run-class.mjs 025
```

## 🧪 Reto de transferencia

Escribe un enrutador mínimo sobre la versión sin framework: una tabla de
`método + patrón → función`, con soporte para `:parametro`. Cuando funcione,
habrás escrito el 20 % de Express que se usa el 80 % del tiempo — y entenderás
qué es el otro 80 %.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Parte 2 — La tubería](../../parte-2-la-tuberia/README.md)
- [Módulo 02 — Arquitectura de frameworks](../../../curriculum/02-arquitectura-de-frameworks.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@casciaro-node-patterns] Casciaro, Mario; Mammino, Luciano. *Node.js Design Patterns*, 3.ª ed. Packt, 2020. ISBN 9781839214110 — <https://openlibrary.org/isbn/9781839214110>
- [@richards-ford-fundamentals] Richards, Mark; Ford, Neal. *Fundamentals of Software Architecture*. O'Reilly Media, 2020. ISBN 9781492043454 — <https://openlibrary.org/isbn/9781492043454>
