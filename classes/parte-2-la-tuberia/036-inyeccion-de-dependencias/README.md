# Clase 036 — Inyección de dependencias

> [⬅️ 035](../035-cabeceras-de-seguridad/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [037 ➡️](../037-ciclo-de-vida-de-los-objetos/README.md)
>
> Parte **2 — La tubería** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 5 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

**Recibir** las colaboraciones en lugar de construirlas. Y entender que la
ventaja no es la elegancia: es poder sustituirlas sin tocar el código que las usa.

## 🧩 La situación

`GET /ahora` devuelve una fecha que produce un reloj. El manejador **no construye
el reloj, no lo busca y no sabe de qué clase es**: lo recibe.

## 📖 El problema que resuelve

Sin inyección, el manejador construye lo que necesita:

```javascript
function ahora() {
  const reloj = new RelojDelSistema();   // decidido aquí, para siempre
  return { ahora: reloj.ahora() };
}
```

Ese código **no se puede probar sin esperar**: la fecha depende del momento de
ejecución. Y no se puede cambiar el reloj sin editar el manejador.

Con inyección, quien construye es otro. El manejador declara qué necesita y el
contenedor lo aporta. La prueba pasa un reloj fijo; producción pasa el real; el
manejador es el mismo.

Fowler lo formula como la inversión de quién decide la dependencia
[@fowler-injection], y Seemann y van Deursen lo desarrollan como el mecanismo que
permite componer una aplicación desde fuera [@seemann-deursen-di].

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /ahora` | `{"ahora":"2026-01-01T00:00:00Z","origen":"inyectado"}` |
| `GET /ahora` otra vez | **lo mismo** |

La segunda comprobación no es redundante: si el manejador construyera un reloj
real, la fecha cambiaría entre llamadas. **Que no cambie demuestra que la
dependencia es la declarada.**

<!-- generado: fichas -->

## 📖 Las palabras que esta clase define

Si alguna de estas no te dice nada todavía, esta es la clase donde se aprende. Las definiciones viven en el [glosario](../../../glosario/README.md), que reúne las del programa entero.

| Palabra | Qué significa |
| --- | --- |
| [**Contenedor de dependencias**](../../../glosario/README.md#contenedor-de-dependencias) *(Contenedor de inversión de control)* | La pieza que construye tus objetos y les entrega lo que necesitan. Es la consecuencia inevitable de la inversión de control: si el framework llama a tu función, alguien tiene que darle sus dependencias, porque tú ya no puedes. |

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **NestJS** | framework de aplicación de Node.js/TypeScript (TypeScript) | 2017 | MIT | proyecto independiente |
| **Spring Boot** | framework de aplicación de JVM (Java) | 2014 | Apache-2.0 | Broadcom/VMware y colaboradores |
| **ASP.NET Core** | framework web de .NET (C#) | 2016 | MIT | Microsoft y .NET Foundation |
| **FastAPI** | framework web de Python (Python) | 2018 | MIT | proyecto independiente |
| **Laravel** | full-stack-framework de PHP (PHP) | 2011 | MIT | proyecto independiente |

### 🔧 NestJS

Trae a Node.js el modelo de Angular y Spring: módulos, decoradores e inyección de dependencias por constructor.

- **Documentación oficial:** <https://docs.nestjs.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `@nestjs/common ^11.1.6, @nestjs/core ^11.1.6, @nestjs/platform-express ^11.1.6, reflect-metadata ^0.2.2, rxjs ^7.8.2, typescript ^5.9.3, @types/node ^24.7.0`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm,install,--silent,--ignore-scripts pnpm,exec,tsc,-p,tsconfig.json
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node dist/main.js
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `src/main.ts` | código TypeScript |
| `tsconfig.json` | configuración del compilador de TypeScript |

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
PORT=3000 java -jar target/clase-036-1.0.0.jar --server.port=3000
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
| `Clase036.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

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

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las cinco declaran la misma dependencia de cinco maneras. Lo que cambia **no es
la capacidad** —las cinco sustituyen igual de bien— sino cuánta ceremonia exige
el lenguaje que hay debajo.

Y en las cinco, el manejador **no construye, no busca y no sabe de qué clase es**
lo que recibe. Esa ignorancia es el punto entero: es lo que permite sustituirlo
sin tocarlo.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — por constructor, sin anotación

```java
    @RestController
    static class Controlador {
        private final Reloj reloj;

        Controlador(Reloj reloj) {
            this.reloj = reloj;
        }
```

Desde Spring 4.3 **no hace falta anotar**: si hay un solo constructor, el
contenedor lo usa. Es la declaración más limpia del elenco — una clase de Java
corriente, sin nada específico del framework en la parte que importa.

Y por constructor y no por campo, por una razón concreta: **el objeto no puede
existir sin su dependencia**, y el `final` hace que el compilador lo garantice.
Con inyección por campo, un objeto a medio construir es posible y falla en
tiempo de ejecución.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — el contenedor en la plataforma

```csharp
constructor.Services.AddSingleton<IReloj, RelojFijo>();
```

```csharp
app.MapGet("/ahora", (IReloj reloj) =>
    Results.Json(new { ahora = reloj.Ahora(), origen = "inyectado" }));
```

**El tipo del parámetro es la petición.** Sin anotación, sin atributo, sin ficha:
el contenedor mira `IReloj` y resuelve.

Es la declaración más corta de las cinco, y el contenedor **viene en la
plataforma** —`Microsoft.Extensions.DependencyInjection`—, no en una biblioteca
del framework web. Eso significa que el mismo contenedor sirve para una
aplicación de consola o un servicio de fondo.

### Laravel · [`laravel/bootstrap/app.php`](implementaciones/laravel/bootstrap/app.php) — atadura explícita

```php
$app->bind(Reloj::class, RelojFijo::class);
```

Y en [`routes/api.php`](implementaciones/laravel/routes/api.php):

```php
Route::get('/ahora', function (Reloj $reloj) {
    return response()->json(['ahora' => $reloj->ahora(), 'origen' => 'inyectado']);
});
```

La misma idea que ASP.NET Core: el contenedor **lee el tipo del argumento** y
resuelve. PHP conserva los tipos en tiempo de ejecución, así que no hace falta
identificador aparte.

`bind` frente a `singleton` es la decisión de ámbito que la clase 037 desarrolla:
`bind` construye uno nuevo cada vez, `singleton` reutiliza.

### NestJS · [`nestjs/src/main.ts`](implementaciones/nestjs/src/main.ts) — el contenedor traído a Node

```typescript
const RELOJ = "RELOJ";
```

```typescript
  constructor(@Inject(RELOJ) private readonly reloj: Reloj) {}
```

```typescript
@Module({
  controllers: [Controlador],
  providers: [{ provide: RELOJ, useClass: RelojFijo }],
})
```

Hace falta `@Inject` con una **ficha** —esa constante `RELOJ`— por un motivo que
no es de NestJS: **las interfaces de TypeScript no existen en tiempo de
ejecución**. Se borran al compilar, así que el contenedor no puede buscar por un
tipo que ya no está.

Es una consecuencia directa del diseño de TypeScript —tipos que solo viven en el
compilador— y la razón de que NestJS tenga esta ceremonia extra frente a Spring,
.NET o Laravel. Si `Reloj` fuera una clase abstracta en vez de una interfaz, la
ficha no haría falta.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — en la firma, sin contenedor

```python
def obtener_reloj() -> Reloj:
    return RelojFijo()
```

```python
@app.get("/ahora")
def ahora(reloj: Annotated[Reloj, Depends(obtener_reloj)]) -> JSONResponse:
    return JSONResponse({"ahora": reloj.ahora(), "origen": "inyectado"})
```

**No hay contenedor.** `Depends` resuelve una función y pasa su resultado: no hay
registro central, no hay ámbitos declarados y no hay grafo de dependencias que
inspeccionar.

La sustitución se hace con `app.dependency_overrides`, que es exactamente lo que
usan las pruebas. Y lo que se inyecta **se lee en la propia firma**, sin ir a
buscar el registro a otro archivo — la misma virtud que la clase 070 encontraba
en su autorización.

El precio también es real: sin registro central, nadie puede responder «¿quién
depende de qué?» sin leer todas las firmas.

```python
class Reloj(Protocol):
    def ahora(self) -> str: ...
```

Y el contrato es un `Protocol`: **tipado estructural**. `RelojFijo` no declara
que implementa `Reloj` en ninguna parte — lo cumple porque tiene el método. Es la
forma más suelta del elenco de declarar el mismo contrato, y la única donde la
implementación no menciona la interfaz.

## 🔬 Comparación

| Framework | Cómo se declara | ¿Contenedor? | Ceremonia |
| --- | --- | --- | --- |
| ASP.NET Core | tipo del parámetro | en la plataforma | mínima |
| Spring Boot | constructor | sí, central | mínima |
| Laravel | tipo del argumento | sí | una atadura |
| FastAPI | `Depends` en la firma | **no** | ninguna |
| NestJS | `@Inject` + ficha | sí | **la mayor**: los tipos se borran |

## 🧭 El coste de tener contenedor

No es gratis, y conviene decirlo:

**Lo que gana.** Sustituir sin tocar el consumidor. Componer la aplicación desde
un solo sitio. Cambiar el ámbito de un objeto —clase 037— sin cambiar quien lo
usa.

**Lo que cuesta.** El grafo de dependencias es implícito: leer el manejador ya no
te dice qué se ejecuta de verdad. Los fallos aparecen al arrancar o, peor, al
resolver, y el mensaje habla del contenedor y no de tu código. Y la tentación de
registrarlo todo convierte el contenedor en un almacén global con otro nombre.

Por eso FastAPI resulta interesante: **obtiene el beneficio principal —la
sustitución— sin contenedor**, atando la dependencia a la firma de la función. Es
menos potente para grafos profundos y mucho más fácil de seguir leyendo.

## ⚠️ Errores frecuentes

- **Inyección por campo.** Permite objetos a medio construir.
- **Registrar todo en el contenedor.** Un almacén global con otro nombre.
- **Inyectar el contenedor mismo.** Anula la ventaja: vuelve la búsqueda.
- **Ámbito equivocado.** Un objeto de vida larga con estado por petición dentro
  es la clase 037, y es el fallo más caro de esta familia.
- **Interfaces con una sola implementación** creadas «por si acaso».

## ✅ Verificación

```bash
node scripts/run-class.mjs 036
```

## 🧪 Reto de transferencia

Escribe una prueba que sustituya el reloj por uno que devuelva otra fecha, **sin
tocar el manejador**. En FastAPI son dos líneas con `dependency_overrides`; en
Spring, `@MockitoBean`. Si necesitas cambiar el manejador, la inyección estaba mal
hecha.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 037 — Ciclo de vida de los objetos](../037-ciclo-de-vida-de-los-objetos/README.md)
- [Módulo 02 — Arquitectura de frameworks](../../../curriculum/02-arquitectura-de-frameworks.md)

## Fuentes

- [@fowler-injection] Fowler, Martin. *Inversion of Control Containers and the Dependency Injection pattern* — <https://martinfowler.com/articles/injection.html>
- [@seemann-deursen-di] Seemann, Mark; van Deursen, Steven. *Dependency Injection Principles, Practices, and Patterns*. Manning, 2019. ISBN 9781617294730 — <https://openlibrary.org/isbn/9781617294730>
- [@ousterhout-philosophy] Ousterhout, John. *A Philosophy of Software Design*. Yaknyam Press, 2018. ISBN 9781732102200 — <https://openlibrary.org/isbn/9781732102200>
