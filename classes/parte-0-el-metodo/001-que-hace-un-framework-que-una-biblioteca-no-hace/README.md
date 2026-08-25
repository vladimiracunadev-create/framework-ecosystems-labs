# Clase 001 — Qué hace un framework que una biblioteca no hace

> [📚 Parte 0](../README.md) · [🎓 Clases](../../README.md) · [002 ➡️](../002-inversion-de-control-en-concreto/README.md)
>
> Parte **0 — El método: qué es un framework y cómo se compara** · Nivel **🟢 introductorio** · Pista **`backend`** (Backend y API)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

> 🟢 **Es la primera clase del programa.** No da por sabido nada de frameworks.
> Si no has instalado todavía las herramientas, empieza por
> [`empezar/`](../../../empezar/README.md); si nunca has oído hablar de puertos,
> peticiones o dependencias, media hora con
> [conocimientos previos](../../../empezar/conocimientos-previos.md) hace que
> todo lo de aquí se lea seguido.

## 🎯 Objetivo

Distinguir **biblioteca** de **framework** por una sola pregunta: **quién llama
a quién**. No por el tamaño, no por la popularidad, no por si trae ORM.

Es la única clase del programa que se puede resumir en una frase: **si tu código
llama al suyo, es una biblioteca; si el suyo llama al tuyo, es un framework.**

Todo lo demás —las 148 clases siguientes— consiste en ver qué consecuencias
tiene esa inversión, cuánto se paga por ella y en qué se diferencian los que la
aplican.

## 📚 Resultados de aprendizaje

Al terminar podrás:

1. Señalar en un archivo concreto la línea donde se invierte el control.
2. Explicar por qué la misma respuesta HTTP cuesta catorce líneas con una
   biblioteca y cinco con un framework — **sin concluir que una sea mejor**.
3. Enumerar las cinco decisiones que un framework de servidor toma por ti antes
   de que escribas nada.
4. Leer la ficha técnica de un framework —versión, licencia, quién lo mantiene,
   qué hay que instalar— y saber qué significa cada campo.
5. Instalar y arrancar por tu cuenta cualquiera de las cuatro implementaciones,
   sin el verificador.

## 📖 El vocabulario de esta clase

Nueve palabras. Si ya las conoces, salta a [la situación](#-la-situación); si
no, léelas ahora y el resto del programa se lee sin tropiezos.

| Palabra | Qué significa aquí |
| --- | --- |
| **Runtime** (entorno de ejecución) | El programa que **ejecuta** tu código. Node.js ejecuta JavaScript, CPython ejecuta Python, la JVM ejecuta Java, el CLR ejecuta C#. No es un framework: es lo que hay debajo de todos. |
| **Biblioteca** | Código de terceros que **tú llamas**. Tú tienes el control del programa y le pides cosas cuando las necesitas. |
| **Framework** | Código de terceros que **te llama a ti**. Él tiene el control del programa y tú rellenas huecos. Es la definición entera, y no menciona el tamaño. |
| **Dependencia** | Una biblioteca o framework que tu programa necesita para funcionar. Se declara en un archivo y se descarga con un comando. |
| **Manifiesto** | El archivo donde se declaran las dependencias: `package.json`, `requirements.txt`, `pom.xml`, `composer.json`, `Gemfile`, `go.mod`. Cada ecosistema tiene el suyo y todos hacen lo mismo. |
| **Ruta** (*route*) | La pareja método + camino que identifica una petición: `GET /saludo`. |
| **Manejador** (*handler*) | La función que se ejecuta cuando llega una petición que encaja con una ruta. En este programa, el manejador es siempre **tu** código. |
| **Cadena de consulta** (*query string*) | Lo que va después del `?` en una URL: en `/saludo?nombre=ana`, la cadena de consulta es `nombre=ana`. |
| **Inversión de control** | El nombre técnico de «el suyo llama al tuyo». La clase 002 la convierte en un número medible. |

Y una décima que aparece en la comparación y conviene tener a mano:
**convención** es una regla que el framework da por supuesta sin que la
escribas. Cuantas más convenciones, menos código y más cosas que aprender antes
de poder leerlo.

## 🧩 La situación

Un saludo. Tres condiciones y nada más:

- `GET /saludo` responde el texto `hola`.
- Si viene un parámetro `nombre`, responde `hola <nombre>`.
- Cualquier otra ruta responde `404`.

Es deliberadamente pequeño, y hay un motivo. Lo que interesa **no es lo que
hace**, sino cuánto de lo que hace lo escribe una persona y cuánto viene
puesto. Un problema grande escondería esa diferencia entre mil líneas; este la
deja a la vista en catorce.

## 🧮 El contrato

| Petición | Respuesta esperada | Qué mide |
| --- | --- | --- |
| `GET /saludo` | `200`, cuerpo `hola`, `content-type: text/plain` | responder y **declarar el tipo** |
| `GET /saludo?nombre=ana` | cuerpo `hola ana` | leer la cadena de consulta |
| `GET /saludo?nombre=ana%20maria` | cuerpo `hola ana maria` | **decodificar** el valor |
| `GET /adios` | `404` | qué pasa cuando nada coincide |

La especificación ejecutable está en [`contrato.json`](contrato.json), y es
**idéntica para las cuatro implementaciones**. Esa identidad es lo que hace que
la comparación signifique algo, y la clase 003 la convierte en el método de todo
el programa.

**Por qué cada caso está ahí:**

- **El primero** exige `text/plain`. Sin esa cabecera, un navegador tiene que
  adivinar qué hacer con los bytes, y adivinar mal es una vulnerabilidad
  conocida (la clase 035 la cierra). El código `200` y la cabecera
  `content-type` no son convención de este programa: están definidos en el
  estándar de HTTP semántico [@rfc9110].
- **El tercero es el que más se falla, y parece un detalle.** `%20` es la
  codificación de un espacio en una URL [@mdn-web-docs]. Quien lee la cadena de
  consulta con un `split("=")` —que es lo primero que se le ocurre a
  cualquiera— obtiene `ana%20maria` y responde `hola ana%20maria`. Los tres
  frameworks lo decodifican sin que se lo pidas; la biblioteca no.
- **El cuarto es la trampa de la clase.** Las cuatro implementaciones responden
  `404`, y **solo una lo tiene escrito**. Guárdate esa observación: es la
  definición operativa de lo que es un framework.

<!-- generado: fichas -->

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Node.js** | entorno de ejecución de JavaScript (JavaScript) | 2009 | MIT | OpenJS Foundation |
| **Express** | framework web de Node.js (JavaScript) | 2010 | MIT | OpenJS Foundation |
| **Flask** | framework web de Python (Python) | 2010 | BSD-3-Clause | Pallets Projects |
| **Spring Boot** | framework de aplicación de JVM (Java) | 2014 | Apache-2.0 | Broadcom/VMware y colaboradores |

### 🔧 Node.js

Llevó JavaScript al servidor con un bucle de eventos no bloqueante. No es un framework: es quien ejecuta a todos los de su columna.

- **Documentación oficial:** <https://nodejs.org/docs/latest-v22.x/api/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `sin dependencias: solo la biblioteca estándar`
- **Necesita en el PATH:** `node`

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node server.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `server.mjs` | código JavaScript (módulo ES) |

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

### 🔧 Flask

Microframework que dejó a la persona elegir ORM, validación y estructura. El contrapunto exacto de Django dentro del mismo lenguaje.

- **Documentación oficial:** <https://flask.palletsprojects.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `flask==3.1.2`
- **Necesita en el PATH:** `python`

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 python app.py
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `app.py` | código Python |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
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
PORT=3000 java -jar target/clase-001-1.0.0.jar --server.port=3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `pom.xml` | manifiesto de Maven: el proyecto, su Java, sus dependencias y cómo se empaqueta |
| `src/main/java/labs/Aplicacion.java` | código Java |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🗺️ Qué implica elegir cada uno

La ficha de arriba dice qué son. Esta sección dice **en qué te metes** con cada
uno: cómo se empieza un proyecto de verdad, qué estructura impone, qué viene
incluido y qué tendrás que añadir tú.

### Node.js con su módulo `http` — no elegir nada

**Cómo se empieza un proyecto real:** `mkdir mi-servicio && cd mi-servicio && npm init -y`.
Y ya está. No hay nada que instalar: `node:http` viene con el runtime
[@nodejs-docs].

**Qué estructura impone:** ninguna. Un archivo, diez archivos, la que decidas.

**Qué viene incluido:** el análisis de la línea de petición y de las cabeceras
—que es bastante más de lo que parece— y poco más.

**Qué tendrás que añadir tú:** el emparejado de rutas, la lectura de parámetros,
el análisis del cuerpo, la gestión de errores, los códigos de estado por
omisión, los límites de tamaño. Todas las clases de la parte 1 y la parte 2 son,
vistas desde aquí, la lista de lo que tendrás que escribir.

**Cuándo compensa:** cuando el proceso hace **una** cosa —un adaptador, un
*webhook*, una sonda de salud— y quieres cero dependencias y todo el
comportamiento escrito en tu archivo.

### Express — el esqueleto mínimo

**Cómo se empieza un proyecto real:** `npm init -y && npm install express`. No
hay generador oficial ni estructura obligatoria; se empieza con un archivo.

**Qué estructura impone:** ninguna. Y eso es a la vez su virtud y su crítica:
dos personas del mismo equipo resuelven lo mismo de dos maneras distintas y
ninguna está mal.

**Qué viene incluido:** enrutado, cadena de middleware (clase 026), 404 por
omisión, y un puñado de ayudantes de respuesta.

**Qué tendrás que añadir tú:** validación, ORM, sesiones, seguridad, subida de
archivos, compresión, CORS. Cada una es una dependencia que eliges, mantienes y
actualizas. La clase 072 muestra el caso extremo: el middleware de referencia
para CSRF de Express está **retirado**.

**Versión que importa:** este laboratorio usa Express 5, publicado tras diez
años en la rama 4. El salto cambia el manejo de errores asíncronos y el
emparejado de rutas; código de tutoriales de la era 4 puede no comportarse
igual. Comprobar la versión mayor antes de copiar un ejemplo es un hábito que
esta clase quiere dejar instalado.

### Flask — el mismo trato, en Python

**Cómo se empieza un proyecto real:**

```bash
python -m venv .venv          # un entorno aislado para este proyecto
source .venv/bin/activate     # en Windows: .venv\Scripts\activate
pip install flask
```

Ese primer comando es la diferencia cultural más visible con Node: en Python,
**las dependencias se instalan en un entorno virtual por proyecto**, no en un
directorio dentro de la carpeta. Saltárselo instala Flask en el Python del
sistema y mezcla proyectos.

**Qué estructura impone:** ninguna, igual que Express. Su documentación llama a
esto una decisión de diseño y la argumenta [@flask-design].

**Qué viene incluido:** enrutado, plantillas Jinja2, un servidor de desarrollo y
un objeto de contexto por petición.

**Qué tendrás que añadir tú:** lo mismo que en Express. Y hay una alternativa en
el mismo lenguaje que lo trae todo —Django—, lo que convierte al par
Flask/Django en la comparación más limpia del catálogo entre «elige tú» y «viene
puesto».

**Aviso que su propia documentación repite:** el servidor que arranca
`app.run()` es de desarrollo y **no es para producción**. En producción se pone
un servidor WSGI delante (Gunicorn, uWSGI). Es el mismo reparto aplicación /
servidor que la clase 025 compara.

### Spring Boot — el paquete completo

**Cómo se empieza un proyecto real:** no se escribe a mano. Se genera en
[start.spring.io](https://start.spring.io/) eligiendo las *dependencias de
arranque* (los *starters*), y sale un proyecto con su `pom.xml`, su estructura
de directorios y su clase principal.

**Qué estructura impone:** mucha, y a propósito. `src/main/java` para el código,
`src/main/resources` para la configuración, `src/test/java` para las pruebas.
Esa estructura no es de Spring: es de **Maven**, y la comparte todo el
ecosistema JVM.

**Qué viene incluido:** un servidor incrustado (Tomcat), un contenedor de
inversión de control (clase 036), autoconfiguración, y acceso inmediato a
seguridad, datos, mensajería y observabilidad añadiendo un *starter*.

**Qué tendrás que añadir tú:** poco, y ahí está el trato. Cuando la
autoconfiguración acierta no escribes nada; cuando se equivoca, tienes que
entender un mecanismo que hasta ese momento era invisible.

**Lo que hay que saber antes de empezar:** el proyecto se **compila** antes de
ejecutarse. Entre `mvn package` y ver la respuesta pasan segundos, no
milisegundos, y la primera compilación descarga el árbol de dependencias entero.
Por eso el `ejecutar.json` de esta clase le concede 60 segundos de espera y no
15.

## 🌐 Las implementaciones — el código a la vista

Cada bloque es el archivo real del directorio
[`implementaciones/`](implementaciones/). Léelos en este orden: la biblioteca
primero, y los tres frameworks después, contando **qué desaparece** cada vez.

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

Cuenta lo que hay ahí dentro, porque son **cinco decisiones** y las cinco
reaparecen en todo el programa:

1. **Emparejar la ruta.** No hay tabla de rutas: hay un `if`. Y hay que separar
   el camino de la cadena de consulta a mano, porque `peticion.url` las trae
   pegadas — de ahí el `new URL(...)`. Con dos rutas es cómodo; con veinte, ese
   `if` es un emparejador de rutas escrito por ti, y probablemente peor que uno
   hecho.
2. **Leer el parámetro y decodificarlo.** `url.searchParams.get("nombre")` hace
   las dos cosas. Un `split("=")` haría solo la primera, y el tercer caso del
   contrato fallaría.
3. **Decidir el valor por omisión** cuando el parámetro no viene: ese
   `nombre ? … : "hola"`.
4. **Poner el `content-type`.** Sin esa cabecera la respuesta sale sin tipo
   declarado y el primer caso del contrato falla. Fíjate también en el
   `charset=utf-8`: sin él, un nombre con tilde puede llegar mal al cliente.
5. **Escribir el 404.** Es la rama final del `if`. **En los tres frameworks
   siguientes no aparece en ninguna parte del archivo, y el contrato se cumple
   igual.**

Y una línea que no es de esta lista pero conviene ver: `listen(..., "127.0.0.1")`
ata el servidor a la máquina local. Sin ese segundo argumento, Node escucha en
todas las interfaces y el proceso queda accesible desde la red — la clase 035
vuelve sobre por qué eso importa.

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

Léelo al lado del anterior y haz el inventario de lo que **falta**: no hay bucle
de decisión, no hay comparación de rutas, no hay separación de la cadena de
consulta, no hay decodificación y **no hay 404**.

Lo que sí hay es un **registro**. `app.get("/saludo", …)` no ejecuta la función:
la guarda y le dice a Express en qué caso quiere que la llame. Quien tiene el
bucle es él — y por eso la línea del 404 no existe: Express la emite cuando
ninguna ruta registrada coincide.

`peticion.query` llega hecho. Las cuatro primeras decisiones de la lista anterior
las tomó el framework, y la quinta ni siquiera se te presentó.

Y `respuesta.type(...).send(...)` encadenado: los ayudantes de Express devuelven
la propia respuesta para poder enlazarlos. Es azúcar, y es el estilo que casi
todo el ecosistema copió.

### Flask · [`flask/app.py`](implementaciones/flask/app.py)

```python
@app.get("/saludo")
def saludo() -> Response:
    nombre = request.args.get("nombre")
    cuerpo = f"hola {nombre}" if nombre else "hola"
    return Response(cuerpo, mimetype="text/plain")
```

El mismo mecanismo con otra sintaxis. `@app.get("/saludo")` es un **decorador**:
una función que recibe la función recién definida, la registra en una tabla y la
devuelve sin tocarla. Que en Python se escriba encima y en JavaScript como una
llamada a método es **sintaxis**; el mecanismo es idéntico.

Hay una diferencia de diseño real, y no está en el registro: **`request` no es
un argumento**. Es un objeto global que Flask deja accesible solo durante la
petición en curso, y que apunta a un valor distinto en cada una. Su
documentación lo llama una decisión deliberada y explica el porqué
[@flask-design].

El precio es concreto y conviene conocerlo desde el primer día: **probar
`saludo()` aislada requiere montar un contexto de petición**. La función no
declara lo que necesita, así que no se puede llamar sin el andamiaje del
framework alrededor. Compáralo con la firma de Spring Boot del bloque siguiente,
que sí lo declara.

Y `return Response(cuerpo, mimetype="text/plain")` en lugar de devolver una
cadena: si devolvieras texto suelto, Flask lo serviría como `text/html` y el
primer caso del contrato fallaría. **El valor por omisión de Flask está pensado
para navegadores**, y salirse de él es un gesto explícito.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
    @GetMapping(value = "/saludo", produces = MediaType.TEXT_PLAIN_VALUE)
    public String saludo(@RequestParam(name = "nombre", required = false) String nombre) {
        return nombre == null || nombre.isEmpty() ? "hola" : "hola " + nombre;
    }
```

**El grado máximo de inversión de control del elenco**, y merece la pena ver por
qué exactamente.

En Express hay una llamada que registra. En Flask hay un decorador, que es una
llamada disfrazada. Aquí **no hay ninguna de las dos**: hay una **anotación**,
que es un dato adjunto al método y no ejecuta nada. El código del programador no
participa en el registro. Es el arranque quien examina las clases, encuentra
esos datos y construye con ellos la tabla de rutas.

Y el parámetro llega **como argumento del método**, ya decodificado y convertido
al tipo declarado. Ni se lee de un objeto petición ni se busca en un
diccionario: **lo inyecta el framework** — el mecanismo que Fowler describió
como contenedor de inversión de control [@fowler-injection] y que la clase 036
desmonta pieza a pieza.

Fíjate en `produces = MediaType.TEXT_PLAIN_VALUE`: en las otras tres
implementaciones el tipo de contenido se decide **al responder**; aquí se
**declara en la ruta**. Es la primera aparición de una diferencia que recorre
todo el programa: lo que se declara puede inspeccionarse, documentarse y
comprobarse sin ejecutar nada — y la clase 043 lo aprovecha para generar
documentación sola.

**El precio de tanta inversión** tiene un nombre y aparece pronto: si Spring no
encuentra tu clase —porque quedó fuera del ámbito de exploración—, **no hay
error**. La ruta simplemente no existe, porque nunca hubo una línea que fallara.
Menos código que escribir, y fallos que no gritan.

## 🔬 Comparación

| | Node.js (`http`) | Express | Flask | Spring Boot |
| --- | --- | --- | --- | --- |
| Líneas útiles | 14 | 5 | 5 | 4 |
| ¿Quién empareja la ruta? | tú, con un `if` | el framework | el framework | el framework |
| ¿Quién separa la cadena de consulta? | tú | el framework | el framework | el framework |
| ¿Quién decodifica `%20`? | tú | el framework | el framework | el framework |
| ¿Quién pone el `content-type`? | tú | tú, al responder | tú, al responder | **la anotación**, en la ruta |
| ¿Quién emite el 404? | **tú** | el framework | Werkzeug | el `DispatcherServlet` |
| Cómo se registra el manejador | no se registra: se llama | llamada a método | decorador | **anotación** (un dato) |
| Cómo llega el parámetro | lo buscas | en `peticion.query` | en `request.args` | **como argumento** |
| ¿Se puede probar el manejador solo? | sí | sí | **no sin contexto** | sí |
| Dependencias que añades | 0 | 1 | 1 | 1 *starter* (≈35 bibliotecas) |

Cuatro lecturas, y la última es la que importa:

**1. La columna de la izquierda no es peor: es explícita.** Todo lo que hace el
servidor está escrito en el archivo. Cuando algo falla, se lee el archivo. En
las otras tres, cuando algo falla hay que entender un mecanismo que hasta ese
momento era invisible.

**2. La fila del 404 es la definición operativa de la clase.** Las cuatro
responden 404 y solo una lo tiene escrito. **Un comportamiento que aparece sin
que nadie lo pida es, exactamente, el framework tomando una decisión por ti.**

**3. Las filas del medio ordenan el elenco por grado de inversión.** Buscar el
parámetro, encontrarlo puesto en un objeto, o recibirlo como argumento no son
tres comodidades: son tres puntos de una escala. Cuanto más arriba, menos
escribes y menos control tienes sobre lo que pasa antes de tu función.

**4. La última fila es la que nadie mira y la que más cuesta.** Una dependencia
de Express es una decisión tuya que alguien tendrá que entender dentro de dos
años. Un *starter* de Spring Boot son decenas de bibliotecas que llegan juntas,
se actualizan juntas y hay que auditar juntas — la clase 078 mide exactamente
ese problema.

## 🧠 La regla, en una frase

Un framework aplica lo que la literatura de patrones llama el **principio de
Hollywood**: *no nos llames, nosotros te llamamos* [@gof-design-patterns]. El
patrón que lo formaliza es el **método plantilla**: el esqueleto del algoritmo lo
pone la clase base y tú rellenas los huecos.

Un servidor HTTP es ese esqueleto:

```text
aceptar conexión → leer petición → elegir manejador → escribir respuesta → cerrar
                                        ↑
                                   tu hueco
```

Con la biblioteca escribes los cinco pasos. Con el framework rellenas uno.

De ahí sale la consecuencia que gobierna el resto del programa: **elegir un
framework es aceptar su esqueleto**. Por eso comparar frameworks no es comparar
sintaxis — es comparar qué esqueleto te vas a quedar, durante cuántos años y con
qué equipo.

Y la razón de que el trato compense, cuando compensa, es la que Ousterhout llama
**módulo profundo**: una interfaz pequeña —registrar una función— delante de
mucha implementación [@ousterhout-philosophy]. El mal negocio es el contrario:
mucha interfaz que aprender delante de poca implementación.

## ⚠️ Errores frecuentes

| Síntoma | Causa | Qué hacer |
| --- | --- | --- |
| «Framework es lo grande, biblioteca lo pequeño» | Confundir tamaño con control | Express son pocas líneas de API y **es** un framework. La pregunta es quién llama a quién |
| «Biblioteca es lo poco potente» | Lo mismo, al revés | `node:http` implementa HTTP/1.1 entero. Lo que no hace es llamarte |
| Contar líneas y sacar conclusiones | Medir lo fácil en vez de lo que importa | Menos líneas es **menos decisiones tuyas**. Cuál quieres depende del producto — módulo 11 |
| `hola ana%20maria` en la respuesta | Leer la cadena de consulta a mano | Usar el analizador de la plataforma. El tercer caso del contrato existe por esto |
| «El 404 viene con HTTP» | No viene con nada: alguien lo emite | Saber **quién** es la diferencia entre poder cambiarlo y no poder |
| Copiar un ejemplo y que no funcione | Versión mayor distinta a la del ejemplo | Mirar la versión antes de copiar. Express 4 y 5 no se comportan igual |
| `EADDRINUSE` al arrancar | El puerto ya está ocupado | Un proceso de una ejecución anterior sigue vivo. Ver [conocimientos previos](../../../empezar/conocimientos-previos.md) |

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

La línea `⊘` **no es un fallo**: es una cadena de herramientas ausente,
declarada en vez de escondida. Cómo instalarla está en la ficha de arriba y en
[`empezar/`](../../../empezar/README.md).

Y si quieres verlo con tus propias manos, sin el verificador:

```bash
cd classes/parte-0-el-metodo/001-que-hace-un-framework-que-una-biblioteca-no-hace/implementaciones/nodejs
PORT=3000 node server.mjs
```

En otra terminal:

```bash
curl -i "http://127.0.0.1:3000/saludo?nombre=ana%20maria"
```

## 🧪 Reto de transferencia

**Primera parte.** Añade a la implementación con `node:http` una segunda ruta:
`GET /adios` responde `adios`. Cuéntalo: ¿cuántas líneas has tocado y **cuáles**?

Ahora lo mismo en Express. Una llamada más, y **ninguna línea existente
modificada**.

Esa diferencia —que añadir no obligue a tocar lo que ya funcionaba— es lo que
Martin llama diseño abierto a la extensión y cerrado a la modificación
[@martin-clean-architecture], y es la mitad de la razón por la que existen los
frameworks.

**Segunda parte.** Rompe el tercer caso a propósito: en la implementación de
`node:http`, sustituye `url.searchParams.get("nombre")` por un análisis a mano
de `peticion.url` con `split`. Ejecuta el verificador.

Debe fallar **solo** el tercer caso. Ese fallo aislado es el objetivo: acabas de
reproducir, y medir, un error que en producción se descubre con el primer nombre
compuesto.

## 📚 Para seguir

- **La otra mitad de esta pregunta.** Un framework se elige *dentro* de un
  lenguaje, y el lenguaje también decide cosas. El programa hermano
  [polyglot-programming-labs](https://github.com/vladimiracunadev-create/polyglot-programming-labs)
  compara los lenguajes con el mismo método que este compara los frameworks.
- **Lo que pasa cuando el framework habla con una base de datos.** Empieza en la
  clase 051 de este programa, y va a fondo en
  [database-systems-labs](https://github.com/vladimiracunadev-create/database-systems-labs).
- **Dónde acaba corriendo todo esto.** La parte 10 llega al despliegue;
  [multi-cloud-engineering-program](https://github.com/vladimiracunadev-create/multi-cloud-engineering-program)
  continúa desde ahí.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — cuándo la biblioteca es la elección correcta
- [Clase 002 — Inversión de control, en concreto](../002-inversion-de-control-en-concreto/README.md) — la misma idea, medida con un contador
- [Clase 003 — El contrato como unidad de comparación](../003-el-contrato-como-unidad-de-comparacion/README.md) — por qué este contrato es idéntico para los cuatro
- [Módulo 00 — Taxonomía y diagnóstico](../../../curriculum/00-taxonomia-y-diagnostico.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@mdn-web-docs] *MDN Web Docs*. Mozilla — <https://developer.mozilla.org/>
- [@nodejs-docs] *Node.js API Documentation (v22 LTS)*. OpenJS Foundation — <https://nodejs.org/docs/latest-v22.x/api/>
- [@gof-design-patterns] Gamma, E.; Helm, R.; Johnson, R.; Vlissides, J. *Design Patterns*. Addison-Wesley, 1994. ISBN 9780201633610 — <https://openlibrary.org/isbn/9780201633610>
- [@fowler-injection] Fowler, Martin. *Inversion of Control Containers and the Dependency Injection pattern* — <https://martinfowler.com/articles/injection.html>
- [@flask-design] *Design Decisions in Flask*. Pallets — <https://flask.palletsprojects.com/en/stable/design/>
- [@martin-clean-architecture] Martin, Robert C. *Clean Architecture*. Prentice Hall, 2017. ISBN 9780134494166 — <https://openlibrary.org/isbn/9780134494166>
- [@ousterhout-philosophy] Ousterhout, John. *A Philosophy of Software Design*, 2.ª ed. Yaknyam Press, 2021. ISBN 9781732102217 — <https://openlibrary.org/isbn/9781732102217>
