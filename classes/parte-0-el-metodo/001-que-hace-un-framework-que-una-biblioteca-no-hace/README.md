# Clase 001 — Qué hace un framework que una biblioteca no hace

> [📚 Parte 0](../README.md) · [🎓 Clases](../../README.md) · [002 ➡️](../002-inversion-de-control-en-concreto/README.md)
>
> Parte **0 — El método: qué es un framework y cómo se compara** · Nivel **🟢 introductorio** · Pista **`backend`** (Backend y API)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Distinguir **biblioteca** de **framework** por una sola pregunta: **quién llama
a quién**. No por el tamaño, no por la popularidad, no por si trae ORM.

Esta es la primera clase del programa y la única que se puede resumir en una
frase: si tu código llama al suyo, es una biblioteca; si el suyo llama al tuyo,
es un framework.

## 📚 Resultados de aprendizaje

Al terminar podrás:

1. Señalar en un archivo concreto la línea donde se invierte el control.
2. Explicar por qué la misma respuesta HTTP cuesta veinte líneas con una
   biblioteca y cinco con un framework — sin concluir que una sea mejor.
3. Enumerar las cuatro decisiones que un framework de servidor toma por ti
   antes de que escribas nada.

## 🧩 La situación

Un saludo. `GET /saludo` responde `hola`; si viene un parámetro `nombre`,
responde `hola <nombre>`; cualquier otra ruta responde 404.

Es deliberadamente pequeño. Lo que interesa no es lo que hace, sino **cuánto de
lo que hace lo escribe una persona y cuánto viene puesto**.

## 🧮 El contrato

| Petición | Respuesta esperada | Qué mide |
| --- | --- | --- |
| `GET /saludo` | `200`, cuerpo `hola`, `content-type: text/plain` | responder y declarar el tipo |
| `GET /saludo?nombre=ana` | cuerpo `hola ana` | leer la cadena de consulta |
| `GET /saludo?nombre=ana%20maria` | cuerpo `hola ana maria` | **decodificar** el valor |
| `GET /adios` | `404` | qué pasa cuando nada coincide |

La especificación ejecutable está en [`contrato.json`](contrato.json).

El tercer caso parece un detalle y es el que más se falla: `%20` es la
codificación de un espacio [@rfc9110]. Quien lee la URL con un `split("=")`
—que es lo primero que se le ocurre a cualquiera— obtiene `ana%20maria` y
responde `hola ana%20maria`. Los tres frameworks lo decodifican sin que se lo
pidas; la biblioteca no.

Y el cuarto es la trampa de la clase: **las cuatro implementaciones responden
404, pero solo una lo tiene escrito**.

## 🌐 Las implementaciones — el código a la vista

### La biblioteca · [`nodejs/server.mjs`](implementaciones/nodejs/server.mjs)

```javascript
import { createServer } from "node:http";

createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, "http://127.0.0.1");

  if (url.pathname === "/saludo") {
    const nombre = url.searchParams.get("nombre");

    const cuerpo = nombre ? `hola ${nombre}` : "hola";

    respuesta.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    respuesta.end(cuerpo);
    return;
  }

  respuesta.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  respuesta.end("no encontrado");
}).listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
```

`node:http` **no es un framework**: es una biblioteca de la plataforma
[@nodejs-docs]. Tú creas el servidor, tú escribes el bucle de decisión, tú
llamas a lo que hay que llamar. Nadie te llama a ti.

Cuenta lo que hay ahí dentro, porque son cinco decisiones y todas reaparecen:

1. **Emparejar la ruta.** No hay tabla de rutas: hay un `if`. Y hay que separar
   la ruta de la cadena de consulta a mano, porque `peticion.url` las trae
   pegadas.
2. **Leer el parámetro y decodificarlo.** `URLSearchParams` lo hace; un
   `split` no.
3. **Decidir el valor por omisión** cuando el parámetro no viene.
4. **Poner el `content-type`.** Sin esa cabecera la respuesta sale sin tipo
   declarado y el primer caso del contrato falla.
5. **Escribir el 404.** Es una línea. En los otros tres no aparece.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs)

```javascript
import express from "express";

const app = express();

app.get("/saludo", (peticion, respuesta) => {
  const nombre = peticion.query.nombre;
  respuesta.type("text/plain").send(nombre ? `hola ${nombre}` : "hola");
});

app.listen(Number(process.env.PORT ?? 3000), "127.0.0.1");
```

Léelo al lado del anterior. **No hay bucle de decisión, no hay comparación de
rutas y no hay 404.**

Lo que hay es un **registro**: `app.get("/saludo", …)` no ejecuta la función —
la guarda y le dice a Express en qué caso quiere que la llame. Quien tiene el
bucle es él.

`peticion.query` llega hecho: la ruta ya está emparejada, la cadena de consulta
ya está separada y el `%20` ya está decodificado. Las tres cosas de la lista
anterior.

### Flask · [`flask/app.py`](implementaciones/flask/app.py)

```python
@app.get("/saludo")
def saludo() -> Response:
    nombre = request.args.get("nombre")
    cuerpo = f"hola {nombre}" if nombre else "hola"
    return Response(cuerpo, mimetype="text/plain")
```

El mismo mecanismo con otra sintaxis. `@app.get("/saludo")` es un **decorador**:
recibe la función recién definida, la registra en una tabla y la devuelve sin
tocarla. Que en Python se escriba encima de la función y en JavaScript como una
llamada a método es **sintaxis**; el mecanismo es idéntico.

Hay una diferencia de diseño real, y no está en el registro: `request` **no es
un argumento**. Es un objeto de contexto que Flask deja accesible durante la
petición, un poco de magia deliberada que su propia documentación defiende y
discute [@flask-design]. El precio es concreto: probar `saludo()` aislada
requiere montar un contexto de petición.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
    @GetMapping(value = "/saludo", produces = MediaType.TEXT_PLAIN_VALUE)
    public String saludo(@RequestParam(name = "nombre", required = false) String nombre) {
        return nombre == null || nombre.isEmpty() ? "hola" : "hola " + nombre;
    }
```

**El grado máximo de inversión de control del elenco**, y merece la pena ver por
qué.

En Express hay una llamada que registra. En Flask hay un decorador, que es una
llamada disfrazada. Aquí no hay ninguna de las dos: hay una **anotación**, que
es un dato pegado al método. El código del programador **no ejecuta nada**. Es
el arranque el que examina las clases, encuentra las anotaciones y construye con
ellas la tabla de rutas.

Y el parámetro llega **como argumento del método**, decodificado y convertido al
tipo declarado. Ni se lee de una petición ni se busca en un diccionario: lo
inyecta el framework — el mecanismo que Fowler describió como contenedor de
inversión de control [@fowler-injection].

## 🔬 Comparación

| | Node.js (`http`) | Express | Flask | Spring Boot |
| --- | --- | --- | --- | --- |
| Líneas útiles | 14 | 5 | 5 | 4 |
| ¿Quién empareja la ruta? | tú, con un `if` | el framework | el framework | el framework |
| ¿Quién decodifica `%20`? | tú | el framework | el framework | el framework |
| ¿Quién pone el `content-type`? | tú | tú, en una llamada | tú, en una llamada | la anotación |
| ¿Quién emite el 404? | **tú** | el framework | Werkzeug | el `DispatcherServlet` |
| Cómo se registra el manejador | no se registra: se llama | llamada a método | decorador | anotación |
| Cómo llega el parámetro | lo buscas | en `peticion.query` | en `request.args` | **como argumento** |

Tres lecturas, y la tercera es la que importa:

**1. La columna de la izquierda no es peor: es explícita.** Todo lo que hace el
servidor está escrito en el archivo. Cuando algo falla, se lee el archivo. En
las otras tres, cuando algo falla hay que entender un mecanismo que hasta ese
momento era invisible.

**2. La fila del 404 es la definición operativa de la clase.** Las cuatro
responden 404 y solo una lo tiene escrito. Un comportamiento que aparece sin
que nadie lo pida es, exactamente, el framework tomando una decisión por ti.

**3. La última fila ordena el elenco por grado de inversión.** Buscar el
parámetro, encontrarlo puesto en un objeto, o recibirlo como argumento no son
tres comodidades: son tres puntos de una escala. Cuanto más arriba, menos
escribes y menos control tienes sobre lo que pasa antes de tu función.

## 🧠 La regla, en una frase

Un framework aplica lo que la literatura de patrones llama el **principio de
Hollywood**: *no nos llames, nosotros te llamamos* [@gof-design-patterns]. El
patrón que lo formaliza es el método plantilla — el esqueleto del algoritmo lo
pone la clase base y tú rellenas los huecos.

Un servidor HTTP es ese esqueleto: aceptar conexiones, leer la petición,
elegir un manejador, escribir la respuesta, cerrar. Con la biblioteca lo
escribes tú; con el framework rellenas un hueco.

Y de ahí sale la consecuencia que gobierna el resto del programa: **elegir un
framework es aceptar su esqueleto**. Por eso comparar frameworks no es comparar
sintaxis — es comparar qué esqueleto te vas a quedar.

## ⚠️ Errores frecuentes

- **Creer que «framework» significa «grande».** Express son unas pocas líneas de
  API pública y es un framework; hay bibliotecas de gráficos enormes que no lo
  son. El tamaño no entra en la definición.
- **Creer que «biblioteca» significa «poco potente».** `node:http` implementa
  HTTP/1.1 entero. Lo que no hace es llamarte.
- **Contar líneas y sacar conclusiones.** Menos líneas no es mejor framework:
  es **menos decisiones tuyas**. Cuál de las dos cosas quieres depende del
  producto, y esa pregunta llega en el módulo 11.
- **Leer la cadena de consulta a mano.** El tercer caso del contrato existe por
  esto. Es el fallo que se descubre en producción, con el primer nombre
  compuesto.
- **Suponer que el 404 «viene con HTTP».** No viene con nada: alguien lo emite.
  Saber quién es la diferencia entre poder cambiarlo y no poder.

## ✅ Verificación

```bash
node scripts/run-class.mjs 001
```

Salida real en una máquina sin JDK con Maven:

```text
Clase 001 — Qué hace un framework que una biblioteca no hace
  ✔ nodejs               4 casos
  ✔ express              4 casos
  ✔ flask                4 casos
  ⊘ spring-boot          falta la herramienta `mvn`

RESUMEN: 3 verificadas · 0 con fallo · 1 omitidas por falta de herramientas
```

La línea `⊘` no es un fallo: es una cadena de herramientas ausente,
**declarada** en vez de escondida. Cómo instalarla está en
[`empezar/`](../../../empezar/README.md).

## 🧪 Reto de transferencia

Añade a la implementación con `node:http` una segunda ruta: `GET /adios`
responde `adios`. Cuéntalo: ¿cuántas líneas has tocado y cuáles?

Haz lo mismo en Express. **Una llamada más, y ninguna línea existente
modificada.**

Esa diferencia —que añadir no obligue a tocar lo que ya funcionaba— es lo que
Martin llama diseño abierto a la extensión y cerrado a la modificación
[@martin-clean-architecture], y es la mitad de la razón por la que existen los
frameworks. La otra mitad, la que se paga, llega en la clase 006.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — cuándo la biblioteca es la elección correcta
- [Clase 002 — Inversión de control, en concreto](../002-inversion-de-control-en-concreto/README.md)
- [Módulo 00 — Taxonomía y diagnóstico](../../../curriculum/00-taxonomia-y-diagnostico.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@nodejs-docs] *Node.js API Documentation (v22 LTS)*. OpenJS Foundation — <https://nodejs.org/docs/latest-v22.x/api/>
- [@gof-design-patterns] Gamma, E.; Helm, R.; Johnson, R.; Vlissides, J. *Design Patterns*. Addison-Wesley, 1994. ISBN 9780201633610 — <https://openlibrary.org/isbn/9780201633610>
- [@fowler-injection] Fowler, Martin. *Inversion of Control Containers and the Dependency Injection pattern* — <https://martinfowler.com/articles/injection.html>
- [@flask-design] *Design Decisions in Flask*. Pallets — <https://flask.palletsprojects.com/en/stable/design/>
- [@martin-clean-architecture] Martin, Robert C. *Clean Architecture*. Prentice Hall, 2017. ISBN 9780134494166 — <https://openlibrary.org/isbn/9780134494166>
