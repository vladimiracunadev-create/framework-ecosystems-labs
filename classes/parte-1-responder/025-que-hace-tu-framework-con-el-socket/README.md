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

## 🌐 Las implementaciones — el código a la vista

Las cinco cumplen el mismo contrato. Al compararlas no mires la longitud: mira
**qué línea hace el enrutado y qué línea produce el 404**. En la versión sin
framework las dos son tuyas; en las otras cuatro, ninguna de las dos existe como
tal.

### Sin framework · [`nodejs/server.mjs`](implementaciones/nodejs/server.mjs)

```javascript
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

**Esto es todo lo que hay entre el socket y tu respuesta.** Node analiza la
línea de petición y las cabeceras —eso sí viene hecho, y es más de lo que
parece— y a partir de ahí el archivo es la aplicación entera.

El enrutado es un `if`. El 404 es la rama final de ese `if`. Ninguna de las dos
cosas es un concepto: son código.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs)

```javascript
const app = express();

app.get("/", (peticion, respuesta) => {
  respuesta.json({ capa: "express" });
});

app.use((peticion, respuesta) => {
  respuesta.status(404).json({ error: "no existe" });
});
```

Express **no reemplaza el servidor: lo envuelve**. Por debajo sigue estando el
mismo `http` de Node del bloque anterior. Lo que añade son tres cosas: la tabla
de rutas, la cadena de middleware y un 404 por omisión.

Fíjate en que aquí el 404 sí se escribe — pero **no como una rama de un `if`**,
sino como el último eslabón de la cadena. Es el mismo hecho con otra estructura,
y esa estructura es la que permite insertar cosas en medio (clase 026).

### Gin · [`gin/main.go`](implementaciones/gin/main.go)

```go
	motor := gin.New()

	motor.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"capa": "gin"})
	})

	motor.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"error": "no existe"})
	})
```

La misma relación que Express con Node, y con una diferencia de fondo: **aquí el
servidor ya venía con el lenguaje**. `net/http` es biblioteca estándar, así que
Gin no tiene que traer un servidor — solo el enrutador rápido y las utilidades.

Es la razón por la que los frameworks de Go son más pequeños que los de
cualquier otro ecosistema: no tienen que aportar lo que ya está puesto.

`NoRoute` es el nombre más honesto del elenco para el 404: no dice «error», dice
«ninguna ruta».

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

```python
app = FastAPI()


@app.get("/")
def raiz() -> JSONResponse:
    return JSONResponse({"capa": "fastapi"})
```

```python
@app.exception_handler(404)
async def no_encontrado(peticion: Request, error) -> JSONResponse:
    return JSONResponse({"error": "no existe"}, status_code=404)
```

**FastAPI no tiene servidor.** Define una aplicación ASGI y quien la ejecuta es
Uvicorn, desde fuera del archivo. La frontera entre las dos piezas es el
protocolo ASGI, y eso es lo que permite **cambiar de servidor sin tocar la
aplicación** — a Hypercorn, a Granian, a lo que venga.

Es un reparto distinto del de Express y Gin: no es «el framework envuelve al
servidor», es «el framework y el servidor son dos programas que hablan un
protocolo».

Y el 404 no es una ruta ni un eslabón: es un **manejador de excepción**. Tres
frameworks, tres estructuras distintas para el mismo hecho.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
    @GetMapping("/")
    public Map<String, String> raiz() {
        return Map.of("capa", "spring-boot");
    }
```

```java
    @RestController
    static class Errores implements ErrorController {
        @RequestMapping("/error")
        public ResponseEntity<Map<String, String>> error() {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "no existe"));
        }
    }
```

**La pila más profunda de las cinco.** Spring Boot incrusta un servidor completo
—Tomcat por omisión— dentro del proceso, y entre el socket y ese método hay
conector, contenedor de servlets, despachador y cadena de filtros.

El 404 llega por un camino que no se parece a ninguno de los anteriores: el
contenedor **reenvía internamente a `/error`**, y lo que se implementa es el
controlador de esa ruta. No es una rama, ni un eslabón, ni una excepción: es una
segunda petición interna.

### Cinco formas de decir «no existe»

| | Cómo se enruta | Cómo se emite el 404 |
| --- | --- | --- |
| Sin framework | un `if` | la rama final del `if` |
| Express | tabla de rutas | último eslabón de la cadena |
| Gin | árbol de rutas | `NoRoute`, un manejador declarado |
| FastAPI | tabla de rutas | **manejador de excepción** |
| Spring Boot | despachador + anotaciones | **reenvío interno a `/error`** |

Cinco mecanismos para el mismo byte en el cable. Y esa tabla es el resumen de la
clase: **lo que el framework hace con el socket determina dónde puedes
intervenir** — y por tanto qué puedes cambiar y qué no.

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
