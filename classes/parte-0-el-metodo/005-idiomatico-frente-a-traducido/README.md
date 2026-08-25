# Clase 005 — Idiomático frente a traducido

> [⬅️ 004](../004-taxonomia-que-compite-de-verdad-con-que/README.md) · [📚 Parte 0](../README.md) · [🎓 Clases](../../README.md) · [006 ➡️](../006-coste-total-aprender-mantener-contratar-salir/README.md)
>
> Parte **0 — El método: qué es un framework y cómo se compara** · Nivel **🟢 introductorio** · Pista **`backend`** (Backend y API)
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Reconocer cuándo un código es **el de otro framework disfrazado**: escrito en la
sintaxis correcta, con las importaciones correctas, y con las suposiciones de
otro sitio.

Es el error más caro de los que comete alguien que cambia de ecosistema, porque
no da la cara al escribirlo. Compila, pasa las pruebas y llega a producción.

## 📚 Resultados de aprendizaje

Al terminar podrás:

- **Ver la traducción** en un código que funciona, mirando qué piezas del
  framework no está usando.
- **Nombrar lo que se pierde**: no líneas, sino comportamiento que venía puesto.
- **Explicar** por qué el camino feliz no distingue una versión de la otra, y
  por qué eso es exactamente lo que hace peligrosa a la traducción.
- **Escribir** la versión idiomática de una ruta en cuatro frameworks distintos.

## 🧩 La situación

Alguien que lleva cinco años con Express llega a un proyecto de FastAPI. Escribe
su primera ruta y la escribe así:

```python
async def crear(peticion: Request):
    datos = await peticion.json()
    titulo = datos.get("titulo")
    if not titulo:
        return JSONResponse({"code": "TITULO_INVALIDO"}, status_code=422)
```

Funciona. Es Python válido, es FastAPI válido, y hace exactamente lo que tiene
que hacer. En la revisión nadie dice nada, porque **no hay nada que señalar**:
no hay un error, hay una ausencia.

Esta clase pone esa ruta al lado de su versión idiomática y las somete al mismo
contrato. Las dos pasan el camino feliz. Y a partir del segundo caso dejan de
parecerse.

## 🧮 El contrato

Cada implementación expone **la misma ruta dos veces**:

- `/idiomatico/tareas` — escrita como la escribe la comunidad de ese framework.
- `/traducido/tareas` — la misma ruta traducida desde otro framework. No la
  sintaxis, que sería absurda: **la suposición sobre quién valida**.

Las dos escriben en la misma lista, porque son el mismo servicio.

| # | Petición | Idiomática | Traducida |
| --- | --- | --- | --- |
| 1-2 | `{"titulo":"comprar pan"}` | `201` | `201` — **idénticas** |
| 3-4 | `{"titulo":""}` | `422` | `422` — **siguen idénticas** |
| 5-6 | `{"titulo":"     "}` | `422` | **`201`** ← aquí se rompe |
| 7 | `GET /tareas/3` | — | `titulo` son cinco espacios |
| 8-9 | `{"titulo":"  con espacios  "}` | `201`, guarda `"con espacios"` | `201`, guarda `"  con espacios  "` |
| 10 | `GET /tareas` | `total: 5` — la misma lista | |
| 11 | `GET /comparacion` | medido, no declarado | |

**Los cuatro primeros casos son la clase entera.** Si el contrato solo tuviera
esos, las dos rutas serían indistinguibles y la traducción parecería correcta.

Y el caso 11 no se cree nada: `/comparacion` **ejecuta las dos versiones con el
mismo cuerpo válido y compara los resultados** en lugar de afirmar que coinciden.
Escribir «hacen lo mismo» sin comprobarlo sería el mismo error que la clase
denuncia.

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Convención**](../../../glosario/README.md#convención) *(Convención sobre configuración)* | Una regla que el framework da por supuesta sin que la escribas: que la clase `RaizController` atiende la ruta `raiz#mostrar`, que las plantillas están en un directorio concreto. Menos código, y más cosas que aprender antes de poder leerlo. |
| [**Idiomático**](../../../glosario/README.md#idiomático) | Código escrito como lo escribiría quien conoce ese framework, en lugar de traducido literalmente desde otro. Un Express escrito como si fuera Spring funciona y pierde todo lo que hacía valioso a Express. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Express** | framework web de Node.js (JavaScript) | 2010 | MIT | OpenJS Foundation |
| **FastAPI** | framework web de Python (Python) | 2018 | MIT | proyecto independiente |
| **Spring Boot** | framework de aplicación de JVM (Java) | 2014 | Apache-2.0 | Broadcom/VMware y colaboradores |
| **Ruby on Rails** | full-stack-framework de Ruby (Ruby) | 2004 | MIT | proyecto independiente |

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

### 🔧 Spring Boot

Autoconfiguración y servidor incrustado sobre Spring. Convirtió un framework famoso por su configuración XML en uno de arranque inmediato.

- **Documentación oficial:** <https://spring.io/projects/spring-boot>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web, spring-boot-starter-validation`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-005-1.0.0.jar --server.port=3000
```

### 🔧 Ruby on Rails

Origen de «convención sobre configuración» y de las migraciones de base de datos tal como se entienden hoy. Casi todos los frameworks completos posteriores citan su influencia.

- **Documentación oficial:** <https://guides.rubyonrails.org/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `rails ~> 8.0, puma ~> 6.4`
- **Necesita en el PATH:** `ruby`, `bundle`

Preparar sus dependencias, dentro de su directorio:

```bash
bundle install --quiet
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 bundle exec puma -b tcp://127.0.0.1:3000 config.ru
```

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Cuatro frameworks, cuatro traducciones distintas. En tres de ellos lo que se
pierde lo daba el framework; en el cuarto no lo daba nadie, y por eso la
traducción es igual de peligrosa.

### Express · [`express/server.mjs`](implementaciones/express/server.mjs) — traducido desde Rails

**La idiomática:**

```javascript
function tituloValido(cuerpo) {
  const titulo = cuerpo?.titulo;
  if (typeof titulo !== "string") return null;
  const limpio = titulo.trim();
  return limpio.length === 0 ? null : limpio;
}
```

En Express la validación **se escribe**. Componer con piezas pequeñas es el
modelo del ecosistema, no una carencia [@casciaro-node-patterns]. No hay atajo,
y por eso está en una función con nombre en lugar de repartida por el manejador:
es la única forma de que dos rutas apliquen exactamente la misma regla.

Fíjate en que devuelve el título ya normalizado, no un sí o un no. **Validar y
normalizar en el mismo sitio** evita que una ruta recorte y otra no.

**La traducida:**

```javascript
app.post("/traducido/tareas", (peticion, respuesta) => {
  const titulo = peticion.body?.titulo;
  if (!titulo) {
    respuesta.status(422).json({ code: "TITULO_INVALIDO" });
    return;
  }
```

`if (!titulo)` es la comprobación de presencia tal y como suena: ¿vino algo? Y es
verdad que cubre el campo ausente y la cadena vacía.

Lo que no cubre —y en Rails sí cubría— es `"     "`. Cinco espacios son un texto
perfectamente presente para JavaScript.

```javascript
 * Lo que no cubre —y en Rails sí cubría— es `"     "`. Cinco espacios son un
 * texto perfectamente presente para JavaScript. El traductor no omitió la
 * validación: la tradujo mal, que es mucho más difícil de ver.
```

**Este caso es el más incómodo de los cuatro**, y por eso va primero: aquí el
framework no da nada. Express no valida ni en la versión idiomática ni en la
traducida. Lo que se traduce mal no es una pieza del framework: es **una regla
que alguien creía que venía puesta**.

De ahí la forma general del error: traducir no es traducir sintaxis, es
**arrastrar suposiciones sobre quién se encarga de qué**.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — traducido desde Express

**La idiomática** — y «los tipos hacen el trabajo» es literalmente el primer
argumento de venta del framework [@fastapi-features]:

```python
class Tarea(BaseModel):
    """Las reglas viven en el TIPO. No hay `if` que se pueda olvidar."""

    titulo: str = Field(min_length=1)

    @field_validator("titulo")
    @classmethod
    def sin_espacios_sobrantes(cls, valor: str) -> str:
        limpio = valor.strip()
        if not limpio:
            raise ValueError("titulo no puede estar vacio")
        return limpio
```

```python
@app.post("/idiomatico/tareas", status_code=201)
def crear_idiomatico(tarea: Tarea) -> JSONResponse:
    """El manejador NO valida: recibe un objeto que ya cumple."""
```

**La traducida:**

```python
    datos = await peticion.json()
    titulo = datos.get("titulo")
    if not titulo:
        return JSONResponse({"code": "TITULO_INVALIDO"}, status_code=422)
```

`await peticion.json()` es el equivalente exacto de `req.body`. Y aquí la pérdida
es mucho mayor que en Express, porque **lo que se deja de usar sí existía**:

```python
    Y al escribir `Request` en lugar de `Tarea` en la firma, FastAPI deja de
    saber que espera esta ruta: no valida, no convierte y no documenta. La
    diferencia entre las dos no es de estilo — es de cuanto framework se esta
    usando.
```

Y esa última pérdida —la documentación— es la que no se ve leyendo el código, así
que la clase la **mide**:

```python
    esquema = app.openapi()["paths"]
    def tiene_cuerpo(ruta: str) -> bool:
        return "requestBody" in esquema[ruta]["post"]
```

Ejecuta `GET /comparacion` y verás `cuerpo_documentado_en_la_idiomatica: true`
frente a `cuerpo_documentado_en_la_traducida: false`. La ruta traducida aparece
en el esquema OpenAPI generado **sin ningún cuerpo declarado**: quien consulte la
documentación de esa API no sabrá qué mandarle.

Cambiar un tipo por `Request` en la firma apagó una funcionalidad entera del
framework, y no hubo aviso.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — traducido desde Express

**La idiomática:**

```java
    public record Tarea(@NotBlank String titulo) {
    }
```

```java
    @PostMapping("/idiomatico/tareas")
    public ResponseEntity<Map<String, Object>> crearIdiomatico(@Valid @RequestBody Tarea tarea) {
        return ResponseEntity.status(201).body(guardar(tarea.titulo().trim()));
    }
```

`@NotBlank` es de Jakarta Bean Validation —un estándar, no de Spring
[@walls-spring-in-action]— y significa
«no nulo y **no vacío tras recortar**». Esa última parte es justo la que la
traducción pierde.

**La traducida:**

```java
    public ResponseEntity<Map<String, Object>> crearTraducido(
            @RequestBody(required = false) Map<String, Object> cuerpo) {
        Object titulo = cuerpo == null ? null : cuerpo.get("titulo");
        if (titulo == null || titulo.toString().isEmpty()) {
            return ResponseEntity.status(422).body(Map.of("code", "TITULO_INVALIDO"));
        }
```

`Map<String, Object>` es el equivalente exacto de `req.body`. Y en un lenguaje
tipado eso cuesta más que en ninguno:

```java
     * Lo que se pierde no es solo `"     "`: al declarar un mapa en lugar de un
     * tipo, el controlador deja de tener contrato. Nadie que lea la firma sabe
     * que espera esta ruta, ninguna herramienta puede documentarla, y el
     * compilador no puede ayudar. En un lenguaje tipado, renunciar al tipo es
     * renunciar a casi todo.
```

Es la misma pérdida que en FastAPI, en un ecosistema donde además duele el doble:
el motivo de elegir Java es que el compilador vigile, y un `Map<String, Object>`
lo deja mirando.

### Rails · [`rails/config.ru`](implementaciones/rails/config.ru) — traducido desde Express

**La idiomática:**

```ruby
class Tarea
  include ActiveModel::Model

  attr_accessor :titulo

  validates :titulo, presence: true

  def normalizado
    titulo.to_s.strip
  end
end
```

```ruby
  def idiomatico
    tarea = Tarea.new(titulo: params[:titulo])
    return render(json: { code: "TITULO_INVALIDO" }, status: 422) unless tarea.valid?

    render json: guardar(tarea.normalizado), status: 201
  end
```

`presence: true` usa `blank?`, y en Rails un texto de solo espacios **es** blank.
Es la convención sobre la configuración de la que Rails hizo bandera
[@rails-doctrine]: la regla habitual viene puesta, y quien quiera otra la escribe.
Por eso Rails es el framework del que se traduce en el ejemplo de Express: es el
que trae esa regla puesta.

**La traducida:**

```ruby
  def traducido
    cuerpo = JSON.parse(request.body.read) rescue {}
    titulo = cuerpo["titulo"]
    if titulo.nil? || titulo == ""
      return render(json: { code: "TITULO_INVALIDO" }, status: 422)
    end
```

Y aquí hay una segunda pérdida, específica de Rails, que merece leerse entera:

```ruby
  # Y de paso se salta los parámetros fuertes de Rails, que es la pieza que
  # decide qué campos del cuerpo pueden llegar al modelo. Aquí no hay modelo, así
  # que tampoco hay quien lo eche de menos — hasta que alguien manda un campo de
  # más.
```

Leer el cuerpo crudo esquiva `params`, y con él los **parámetros fuertes** — la
pieza que Rails añadió en 2012 precisamente porque el problema contrario había
causado incidentes reales de asignación masiva. La traducción no solo pierde una
validación: **desactiva una defensa**.

## 🔬 Comparación

| Framework | Quién valida en la idiomática | Qué pierde la traducida |
| --- | --- | --- |
| **Express** | una función escrita a mano | la regla completa: nadie la ponía |
| **FastAPI** | Pydantic, antes de entrar al manejador | validación, tipos y documentación generada |
| **Spring Boot** | Jakarta Bean Validation, antes del método | validación, tipos y ayuda del compilador |
| **Rails** | ActiveModel con `presence: true` | validación y los parámetros fuertes |

Tres cosas que se leen de la tabla:

- **Cuanto más da el framework, más se pierde al traducirlo.** FastAPI y Spring
  regalan tres cosas por una firma; escribir `Request` o `Map` las apaga las
  tres a la vez.
- **La pérdida nunca avisa.** No hay error, no hay registro, no hay aviso del
  compilador. La versión traducida es código perfectamente válido.
- **Express demuestra que no es culpa del framework.** Ahí nadie regalaba nada, y
  la traducción falla igual, porque lo que se traslada es la suposición.

## ⚠️ Errores frecuentes

- **Confundir traducir con adaptar.** Adaptar es reescribir con las piezas del
  destino. Traducir es escribir en la sintaxis del destino con las piezas del
  origen.
- **Probar solo el camino feliz.** Es exactamente donde las dos versiones
  coinciden, y por eso las pruebas no cazan la traducción.
- **Creer que menos líneas es peor.** La versión idiomática de Spring son dos
  líneas y hace más que las seis de la traducida. Contar líneas no dice nada por
  sí solo — mira el `/comparacion` de cualquiera de las cuatro.
- **Pensar que el problema es de principiantes.** Le pasa sobre todo a quien
  tiene años de experiencia: cuantas más suposiciones automáticas traigas, más
  se cuelan sin que las revises.
- **Buscar la traducción en el estilo.** No está en los nombres ni en el formato:
  está en **qué piezas del framework no aparecen**.

## ✅ Verificación

```bash
node scripts/run-class.mjs 005
```

Cuatro implementaciones, once casos cada una. El verificador declara las que
omitió por no encontrar su cadena de herramientas; `node scripts/doctor.mjs` dice
cuáles faltan y cómo se instalan.

Para ver la comparación medida de una de ellas, con el servidor levantado:

```bash
curl -s http://127.0.0.1:4100/comparacion
```

## 🧪 Reto de transferencia

1. **Escribe la tercera versión** de la ruta en el framework que uses a diario,
   traduciéndola desde el que usabas antes. Pásale el contrato de esta clase y
   mira en qué caso se cae.
2. **Busca en tu propio código** una firma que reciba el cuerpo crudo —
   `Request`, `Map<String, Object>`, `req.body`, `params` sin filtrar — y
   pregúntate qué pieza del framework se apagó al escribirla así.
3. **Añade un caso al contrato** con un título de 500 caracteres. Ninguna de las
   ocho rutas lo rechaza hoy. Decide dónde pondrías esa regla en cada framework:
   esa decisión es la clase 039 entera.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md) — dónde la traducción es aceptable y dónde no
- [Clase 004](../004-taxonomia-que-compite-de-verdad-con-que/README.md) — clasificar antes de comparar
- [Clase 039](../../parte-3-validacion-y-contrato/039-validar-la-entrada/README.md) — los diez sitios donde puede vivir una regla
- [Índice de la parte 0](../README.md)

## Fuentes

- [@fastapi-features] *FastAPI Features*. FastAPI — <https://fastapi.tiangolo.com/features/>
- [@lubanovic-fastapi] Lubanovic, Bill. *FastAPI: Modern Python Web Development*. O'Reilly Media, 2023. ISBN 9781098135508 — <https://openlibrary.org/isbn/9781098135508>
- [@walls-spring-in-action] Walls, Craig. *Spring in Action*, 6.ª ed. Manning Publications, 2022. ISBN 9781617297571 — <https://openlibrary.org/isbn/9781617297571>
- [@rails-doctrine] Hansson, David Heinemeier. *The Rails Doctrine*. Ruby on Rails — <https://rubyonrails.org/doctrine>
- [@casciaro-node-patterns] Casciaro, M.; Mammino, L. *Node.js Design Patterns*, 3.ª ed. Packt Publishing, 2020. ISBN 9781839214110 — <https://openlibrary.org/isbn/9781839214110>
- [@ousterhout-philosophy] Ousterhout, John. *A Philosophy of Software Design*, 2.ª ed. Yaknyam Press, 2021. ISBN 9781732102217 — <https://openlibrary.org/isbn/9781732102217>
