# Clase 039 — Validar la entrada

> [⬅️ 038](../../parte-2-la-tuberia/038-middleware-decorador-y-aspecto/README.md) · [📚 Parte 3](../README.md) · [🎓 Clases](../../README.md) · [040 ➡️](../040-errores-por-campo-con-rfc-9457/README.md)
>
> Parte **3 — Validación y contrato** · Nivel **🟢 introductorio** · Pista **`backend`**
>
> ✅ **Clase construida** — 10 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Rechazar lo inválido **antes de que llegue a la lógica**, y ver dónde vive esa
regla en diez frameworks: en un `if`, en un tipo, en un esquema o en un
formulario.

## 🧩 La situación

`POST /tareas` acepta un título de 1 a 120 caracteres y un `completada`
booleano opcional. El título se recorta. Todo lo demás responde **422**.

## 🧮 El contrato

| Cuerpo | Respuesta |
| --- | --- |
| `{"titulo":"leer el módulo 05"}` | `201` · `completada: false` |
| `{"titulo":"  con espacios  "}` | `201` · `titulo: "con espacios"` |
| `{"titulo":"hecha","completada":true}` | `201` |
| `{"titulo":""}` | `422` |
| `{"titulo":"     "}` | **`422`** |
| `{"completada":true}` | `422` |
| título de 129 caracteres | `422` |
| `{"titulo":"vale","completada":"si"}` | **`422`** |

Los dos casos en negrita son los que separan las implementaciones. El de los
espacios porque casi nadie recorta antes de comprobar; el del tipo equivocado
por una razón más profunda que se explica abajo.

<!-- generado: fichas -->

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Express** | framework web de Node.js (JavaScript) | 2010 | MIT | OpenJS Foundation |
| **Fastify** | framework web de Node.js (JavaScript/TypeScript) | 2016 | MIT | OpenJS Foundation |
| **FastAPI** | framework web de Python (Python) | 2018 | MIT | proyecto independiente |
| **Flask** | framework web de Python (Python) | 2010 | BSD-3-Clause | Pallets Projects |
| **Django** | framework web de Python (Python) | 2005 | BSD-3-Clause | Django Software Foundation |
| **Spring Boot** | framework de aplicación de JVM (Java) | 2014 | Apache-2.0 | Broadcom/VMware y colaboradores |
| **ASP.NET Core** | framework web de .NET (C#) | 2016 | MIT | Microsoft y .NET Foundation |
| **Laravel** | full-stack-framework de PHP (PHP) | 2011 | MIT | proyecto independiente |
| **Ruby on Rails** | full-stack-framework de Ruby (Ruby) | 2004 | MIT | proyecto independiente |
| **Gin** | framework web de Go (Go) | 2014 | MIT | proyecto independiente |

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

### 🔧 Fastify

Validación y serialización derivadas de JSON Schema, con un sistema de plugins con encapsulamiento explícito.

- **Documentación oficial:** <https://fastify.dev/docs/latest/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `fastify ^5.6.1`
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

### 🔧 Django

Baterías incluidas: ORM, migraciones, panel de administración, autenticación y formularios. Su panel generado sigue siendo un argumento decisivo para productos internos.

- **Documentación oficial:** <https://docs.djangoproject.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `django==5.2.8`
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
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web, spring-boot-starter-validation`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-039-1.0.0.jar --server.port=3000
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
| `Clase039.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

### 🔧 Laravel

El framework más usado de PHP: ORM Eloquent, migraciones, colas, programación de tareas, pruebas y un ecosistema comercial propio. Redefinió lo que se espera de la experiencia de desarrollo en el lenguaje.

- **Documentación oficial:** <https://laravel.com/docs>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `php ^8.2, laravel/framework ^12.0`
- **Necesita en el PATH:** `php`, `composer`

Preparar sus dependencias, dentro de su directorio:

```bash
composer install --no-interaction --quiet
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 php -S 127.0.0.1:3000 -t public
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `bootstrap/app.php` | arranque de Laravel: qué grupo de rutas, qué capas y qué manejo de errores |
| `bootstrap/providers.php` | código PHP |
| `composer.json` | manifiesto de Composer: la versión de PHP y las bibliotecas del proyecto |
| `config/app.php` | código PHP |
| `config/cache.php` | código PHP |
| `config/session.php` | código PHP |
| `config/view.php` | código PHP |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |

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

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `.bundle/config` | archivo del proyecto |
| `config.ru` | punto de entrada de Rack, el estándar de servidores de Ruby |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Gemfile` | dependencias de Ruby |

### 🔧 Gin

El framework HTTP más usado de Go: enrutado rápido y middleware, sobre la biblioteca estándar.

- **Documentación oficial:** <https://gin-gonic.com/en/docs/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `Go 1.24, github.com/gin-gonic/gin v1.11.0`
- **Necesita en el PATH:** `go`

Preparar sus dependencias, dentro de su directorio:

```bash
go mod tidy
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 go run main.go
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `go.mod` | módulo de Go: su nombre, la versión del lenguaje y sus dependencias |
| `main.go` | código Go |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones

Las diez cumplen el mismo contrato y **colocan la regla en sitios distintos**:
en un `if`, en un tipo, en un esquema, en un formulario, en un modelo o en una
etiqueta de estructura. Dónde vive decide si se puede olvidar.

### Express y Flask — en un `if`

```javascript
function validar(cuerpo) {
  const titulo = cuerpo?.titulo;
  if (typeof titulo !== "string") return "titulo debe ser texto";
  if (titulo.trim().length < 1) return "titulo no puede estar vacío";
  if (titulo.length > 120) return "titulo no puede pasar de 120 caracteres";
  ...
}
```

Explícito y sin sorpresas. La regla está donde se lee, y **hay que acordarse de
llamarla en cada ruta que acepte una tarea**.

### FastAPI — en el tipo

```python
class Tarea(BaseModel):
    titulo: str = Field(min_length=1, max_length=120)
    completada: bool = False

    @field_validator("titulo")
    @classmethod
    def sin_espacios_sobrantes(cls, valor: str) -> str:
        limpio = valor.strip()
        if not limpio:
            raise ValueError("titulo no puede estar vacío")
        return limpio
```

El manejador **no valida nada**: recibe un objeto que ya cumple. Y fíjate en el
validador de campo: además de comprobar, **transforma** —devuelve el valor
recortado—. Validación y normalización en el mismo sitio.

### Fastify — en un esquema, con un límite

```javascript
const esquema = {
  body: {
    type: "object",
    required: ["titulo"],
    properties: { titulo: { type: "string", minLength: 1, maxLength: 120 } },
  },
};
```

Y aquí apareció el primer fallo real de la clase: **`"     "` pasaba**.

`minLength: 1` cuenta caracteres del texto **crudo**, y cinco espacios son cinco
caracteres. JSON Schema no recorta.

No es un defecto: es la naturaleza del mecanismo. **Un esquema describe la forma
del dato; «no vacío tras recortar» es una regla del dominio.** La implementación
la añade aparte, y esa separación —forma frente a dominio— es el eje de toda la
parte 3.

### Django — en un formulario

```python
class FormularioTarea(forms.Form):
    titulo = forms.CharField(min_length=1, max_length=120, strip=True)
    completada = forms.BooleanField(required=False)
```

La validación de Django vive en un **formulario**, y `strip=True` está ahí desde
que existe. Su ventaja es la reutilización: el mismo formulario sirve para una
petición JSON y para un `<form>` de navegador.

### Laravel — en una línea

```php
$datos = $peticion->validate([
    'titulo' => ['required', 'string', 'min:1', 'max:120'],
    'completada' => ['sometimes', 'boolean'],
]);
```

La declaración más compacta de las diez. Las reglas son cadenas, así que se
pueden guardar en configuración, y `sometimes` expresa exactamente «si viene,
que sea booleano».

### Rails — en un modelo sin base de datos

```ruby
class Tarea
  include ActiveModel::Model
  validates :titulo, presence: true, length: { maximum: 120 }
end
```

`ActiveModel` da las validaciones de ActiveRecord **sobre un objeto normal**. Y
`presence: true` en Rails ya considera vacío un texto de solo espacios — de los
diez, es el único que trae esa regla puesta.

### Gin — en etiquetas de la estructura

```go
type tarea struct {
	Titulo     string `json:"titulo" binding:"required,min=1,max=120"`
	Completada *bool  `json:"completada"`
}
```

El puntero en `Completada` no es un capricho: en Go, `false` y «no vino» son el
mismo valor cero. **El puntero es la única forma de distinguirlos**, y esa
distinción importa en cuanto hay campos opcionales.

## 🔍 El hallazgo: un tipo equivocado no es entrada inválida

`{"titulo":"vale","completada":"si"}` debería dar **422**. En la primera versión,
Spring Boot y ASP.NET Core daban **400**.

La causa es estructural: en un framework tipado, el cuerpo se **enlaza a un tipo
antes de validarse**. Un `"si"` que debe ser booleano falla al deserializar, y
para el framework eso es un cuerpo que no pudo interpretar — 400.

Pero el cuerpo era JSON perfectamente válido. Lo que está mal es el **contenido**,
y eso es 422 según el estándar [@rfc9110].

La corrección consiste en **aceptar el valor crudo y comprobar el tipo a mano**:

```java
// Spring: `Object` en vez de `Boolean`
Object completada) { ... }

if (completada != null && !(completada instanceof Boolean)) {
    return ...422...;
}
```

```csharp
// ASP.NET Core: JsonElement? en vez de bool?
public JsonElement? Completada { get; set; }
```

**Ese es el precio de que el enlace ocurra antes que la validación**, y no hay
forma de evitarlo sin renunciar al enlace automático. Los frameworks dinámicos no
tienen el problema porque no hay enlace: el valor llega tal cual y la validación
lo mira.

Es una de las pocas veces del programa donde el tipado estático **estorba**, y
merece decirse con la misma claridad con la que se dicen sus ventajas.

## 🔬 Comparación

| Framework | Dónde vive la regla | ¿Recorta? | ¿Distingue «vacío» de «solo espacios»? |
| --- | --- | --- | --- |
| Rails | modelo (`ActiveModel`) | con `strip` | **sí**, de fábrica |
| Django | formulario | **sí**, `strip=True` | sí |
| FastAPI | tipo + validador | con validador | sí, escrito |
| Laravel | reglas declarativas | no | con regla extra |
| Spring Boot | anotaciones | no | `@NotBlank` sí |
| Fastify | esquema | **no** | **no**: hay que añadirlo |
| Express, Flask | `if` | a mano | a mano |
| ASP.NET Core | atributos | no | a mano |
| Gin | etiquetas | no | a mano |

## ⚠️ Errores frecuentes

- **Validar en el manejador y olvidarlo en la ruta siguiente.**
- **Comprobar la longitud sin recortar.** `"     "` pasa.
- **Confundir «no vino» con «vino vacío»** en lenguajes sin nulos para el tipo.
- **Devolver 400 en un tipo equivocado.** Es 422: el cuerpo se entendió.
- **Validar solo en el cliente.** La validación del cliente es comodidad; la del
  servidor es la que cuenta [@owasp-asvs].
- **Aceptar campos que no declaraste.** La clase 041 lo trata.

## ✅ Verificación

```bash
node scripts/run-class.mjs 039
```

## 🧪 Reto de transferencia

Añade una regla que dependa de **dos campos a la vez**: si `completada` es
verdadero, el título no puede empezar por «TODO». Es donde los esquemas se
quedan cortos y hacen falta validadores del dominio — en cuáles de los diez
resulta natural y en cuáles no es la respuesta del reto.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 040 — Errores por campo con RFC 9457](../040-errores-por-campo-con-rfc-9457/README.md)
- [Módulo 05 — Backend y API](../../../curriculum/05-backend-y-api.md)

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@owasp-asvs] *OWASP Application Security Verification Standard*, OWASP Foundation — <https://owasp.org/www-project-application-security-verification-standard/>
- [@evans-ddd] Evans, Eric. *Domain-Driven Design*. Addison-Wesley, 2003. ISBN 9780321125217 — <https://openlibrary.org/isbn/9780321125217>
