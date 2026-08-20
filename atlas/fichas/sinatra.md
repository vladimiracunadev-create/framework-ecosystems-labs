# 🎩 Sinatra — 2007

> [⬅️ Atlas](../README.md) · [💎 Ecosistema Ruby](../ecosistemas/ruby.md) · [🗂️ Índice](../frameworks.md)

Sinatra es la tecnología con **la mejor relación entre tamaño e influencia de
todo el Atlas**. Su idea cabe en una línea —un verbo, una ruta, un bloque— y esa
línea está hoy en Flask, Express, Slim, Bottle, Spark Java y una docena más.

> **🎯 Por qué está en este programa**
>
> Porque demuestra que **una API bien diseñada viaja entre lenguajes**. Quien
> aprende Sinatra reconoce Flask y Express al instante, no por parecido
> superficial sino porque son la misma idea traducida. Es la tesis del Atlas en su
> forma más pura: aprende el patrón, reconoce la familia.

| | |
|---|---|
| **Aparición** | 2007, creado por Blake Mizerany |
| **Clasificación** | `web-framework` — microframework |
| **Ecosistema** | Ruby |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://sinatrarb.com/documentation.html> |

---

## 💡 La idea, en cuatro líneas

```ruby
require "sinatra"

get "/tasks" do
  json tareas
end

post "/tasks" do
  # ...
  status 201
end
```

No hay clases obligatorias, ni configuración, ni estructura de directorios, ni
generadores. **Un verbo HTTP, una ruta, un bloque de código.** El archivo se
ejecuta y hay un servidor [@harris-sinatra].

Comparado con Rails, que llegó tres años antes con todo incluido, Sinatra fue la
afirmación contraria: **no todo el mundo necesita un producto completo**.

## 🧬 El linaje: la misma idea en cinco lenguajes

| Framework | Año | Lenguaje | La misma forma |
| --- | ---: | --- | --- |
| **Sinatra** | 2007 | Ruby | `get "/tasks" do ... end` |
| **Flask** | 2010 | Python | `@app.get("/tasks")` |
| **Express** | 2010 | JavaScript | `app.get("/tasks", (req, res) => ...)` |
| **Slim** | 2010 | PHP | `$app->get('/tasks', ...)` |
| **Spark Java** | 2011 | Java | `get("/tasks", (req, res) -> ...)` |
| **Bottle** | 2009 | Python | `@route("/tasks")` |

Seis lenguajes, seis comunidades distintas, la misma decisión de diseño. Cuando
un patrón se repite así, deja de ser una preferencia estética: es que resuelve
bien un problema real.

Y esa convergencia es la razón de que el
[módulo 01](../../curriculum/01-http-eventos-y-contratos.md) enseñe **la
semántica de HTTP antes que ningún framework**. Todos estos son la misma capa
fina sobre el mismo protocolo; quien entiende el protocolo entiende los seis.

## ⚖️ Lo que hereda del lenguaje

Sinatra es difícil de imaginar fuera de Ruby. Su API se apoya en tres
características del lenguaje [@shaughnessy-ruby-microscope]:

| Característica de Ruby | Qué permite |
| --- | --- |
| **Bloques** como argumento natural | `get "/x" do ... end` se lee como una estructura del lenguaje |
| **Métodos a nivel superior** | No hace falta declarar una clase para empezar |
| **Metaprogramación** | `get`, `post`, `put` se definen dinámicamente |

Es un buen ejemplo del [módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md):
un framework **hereda las posibilidades de su lenguaje**. Flask y Express
consiguen algo parecido con decoradores y funciones de primera clase, pero cada
uno con el acento de su idioma.

## 🧭 Cuándo encaja hoy

**Encaja** para servicios pequeños y bien delimitados, para poner una fachada HTTP
sobre trabajo que ya existe, para prototipos, y para enseñar —es de los caminos
más cortos que existen entre «nada» y «un servidor que responde».

**No encaja** cuando el producto va a crecer sin estructura decidida. El riesgo es
el de todos los microframeworks y lo enuncia bien el
[laboratorio 02](../../labs/02-express-api/README.md): **se falla por omisión**,
porque nada te recuerda lo que falta —límites de tamaño, cabeceras, validación
completa, manejo uniforme de errores.

## 🎓 Las tres lecciones

**1. Una API puede ser más influyente que un framework entero.** Sinatra tiene una
cuota modesta y su forma está en media docena de ecosistemas.

**2. La convergencia entre comunidades independientes es evidencia.** Cuando seis
lenguajes llegan al mismo diseño por separado, no es moda: es ajuste al problema.

**3. Reconocer el patrón vale más que memorizar la API.** Es literalmente el
objetivo de este Atlas, y Sinatra es su demostración más limpia.

## 🔗 Enlaces

- Documentación oficial: <https://sinatrarb.com/documentation.html>
- [Ficha de Rails](rails.md) — la otra mitad del ecosistema · [Ficha de Express](express.md) · [Ficha de Flask](flask.md)
- [Módulo 01](../../curriculum/01-http-eventos-y-contratos.md)

## Fuentes

- [@harris-sinatra] Harris, Alan; Haase, Konstantin. *Sinatra: Up and Running*. O'Reilly Media, 2011. ISBN 9781449323981 — <https://openlibrary.org/isbn/9781449323981>
- [@shaughnessy-ruby-microscope] Shaughnessy, Pat. *Ruby Under a Microscope*. No Starch Press, 2014. ISBN 9781593275273 — <https://openlibrary.org/isbn/9781593275273>
