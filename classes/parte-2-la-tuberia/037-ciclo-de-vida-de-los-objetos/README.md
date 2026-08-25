# Clase 037 — Ciclo de vida de los objetos

> [⬅️ 036](../036-inyeccion-de-dependencias/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [038 ➡️](../038-middleware-decorador-y-aspecto/README.md)
>
> Parte **2 — La tubería** · Nivel **🔴 avanzado** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Elegir entre **única instancia**, **una por petición** y **una por uso** sabiendo
qué se gana y qué se arriesga. Es el ajuste que más fallos sutiles causa de toda
la parte 2.

## 🧩 La situación

Dos servicios idénticos con ámbitos distintos exponen un contador de cuántas veces
se construyeron. Tres peticiones seguidas revelan la diferencia: **el de única
instancia sigue en 1**.

## 📖 Los tres ámbitos

| Ámbito | Cuándo se crea | Coste | Riesgo |
| --- | --- | --- | --- |
| **Única instancia** | una vez, al arrancar | mínimo | el estado lo comparten **todas** las peticiones |
| **Por petición** | una por petición | bajo | ninguno relevante |
| **Por uso** | cada vez que se pide | el mayor | ninguno; puede sorprender que haya varias |

Los nombres cambian —*singleton*, *scoped*, *transient*, *request*— y la idea es
la misma en los cuatro frameworks.

## ⚠️ El fallo que esta clase existe para prevenir

Guardar **estado de una petición** en un objeto de **única instancia**.

```java
@Component                       // ¡única instancia!
class Servicio {
    private String usuarioActual;   // ← el usuario de la última petición
}
```

Ese campo lo comparten todas las peticiones. Con dos usuarios simultáneos, **uno
puede ver los datos del otro**.

Y lo peor es cómo se manifiesta: **funciona perfectamente en desarrollo**, donde
hay una petición cada vez. El fallo aparece con concurrencia, es intermitente, y
depende de la coincidencia temporal — la clase de error más cara de diagnosticar.

Es el mismo error que la clase 027 destapó con la traza en una variable de módulo,
con otra cara: aquí el estado global no lo escribes tú, **te lo da el contenedor**
sin que se note.

OWASP lo clasifica entre los fallos de control de acceso, porque su consecuencia
habitual es servirle a alguien los datos de otro [@owasp-top10].

**La regla:** un objeto de única instancia debe ser **sin estado**, o tener solo
estado inmutable, o usar estructuras pensadas para concurrencia.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| 1.ª | `unico: 1` |
| 2.ª | `unico: 1` — **no se volvió a crear** |
| 3.ª | `unico: 1` |

<!-- generado: fichas -->

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **NestJS** | framework de aplicación de Node.js/TypeScript (TypeScript) | 2017 | MIT | proyecto independiente |
| **Spring Boot** | framework de aplicación de JVM (Java) | 2014 | Apache-2.0 | Broadcom/VMware y colaboradores |
| **ASP.NET Core** | framework web de .NET (C#) | 2016 | MIT | Microsoft y .NET Foundation |
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
PORT=3000 java -jar target/clase-037-1.0.0.jar --server.port=3000
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
| `Clase037.csproj` | proyecto de .NET: el marco de destino y las dependencias |
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

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las cuatro registran dos servicios idénticos con ámbitos distintos y devuelven
sus identificadores. El contrato mira una cosa: **si el número cambia entre dos
peticiones**.

### NestJS · [`nestjs/src/main.ts`](implementaciones/nestjs/src/main.ts) — el ámbito en el decorador

```typescript
@Injectable()
class ServicioUnico {
  readonly id = ++creadosUnico;
}
```

```typescript
@Injectable({ scope: Scope.REQUEST })
class ServicioPorPeticion {
  readonly id = ++creadosPorPeticion;
}
```

El ámbito por omisión es **única instancia**: se construye una vez al arrancar y
se comparte. Barato, y **cualquier estado que guarde lo ven todas las
peticiones**, incluidas las de otros usuarios.

Y un detalle de propagación que conviene conocer antes de usar `Scope.REQUEST`:
**un servicio por petición contagia su ámbito a quien lo inyecta**. El
controlador que depende de él pasa a construirse por petición también, con su
coste — y el que dependa de ese controlador, también.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — el proxy que resuelve la paradoja

```java
    @Component
    @Scope(ConfigurableBeanFactory.SCOPE_SINGLETON)
    static class ServicioUnico {
        final int id = CREADOS_UNICO.incrementAndGet();
    }
```

```java
    @Component
    @RequestScope
    static class ServicioPorPeticion {
        final int id = CREADOS_PETICION.incrementAndGet();
    }
```

```java
        Controlador(ServicioUnico unico, ServicioPorPeticion porPeticion) {
```

Mira ese constructor y piensa un momento: **el controlador es de única instancia
y necesita algo por petición**. ¿Cómo puede un objeto creado al arrancar recibir
uno que se creará después, muchas veces?

La respuesta es un **proxy**: Spring inyecta un intermediario —que sí es único—
y ese intermediario resuelve, en cada llamada, la instancia real de la petición
en curso.

Sin ese mecanismo, un objeto de vida larga **no podría depender de uno de vida
corta**. Y explica un fallo clásico del ecosistema: inyectar un objeto por
petición sin proxy congela la primera instancia para siempre, y a partir de ahí
todos los usuarios comparten los datos del primero.

A diferencia de NestJS, aquí el ámbito **no se contagia**: el controlador sigue
siendo único.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — tres ámbitos con nombre

```csharp
constructor.Services.AddSingleton<ServicioUnico>();
constructor.Services.AddScoped<ServicioPorPeticion>();
```

Tres ámbitos y tres nombres: `Singleton` uno para todo el proceso, `Scoped` uno
por petición, `Transient` uno por cada vez que se pide. Es el vocabulario más
explícito del elenco — el ámbito se lee en la línea de registro, no en el tipo.

Y .NET aporta algo que ninguno de los otros tres tiene: **detecta la dependencia
cautiva**. Un objeto de única instancia que depende de uno por petición hace
fallar el arranque en desarrollo, en lugar de comportarse mal en producción.

De los cuatro, es el único que convierte este error en un fallo temprano — y es
exactamente el error que el proxy de Spring resuelve por otra vía.

### Laravel · [`laravel/bootstrap/app.php`](implementaciones/laravel/bootstrap/app.php) — y una advertencia sobre PHP

```php
$app->singleton(ServicioUnico::class);
$app->bind(ServicioPorPeticion::class);
```

```php
Route::get('/ambitos', function (ServicioUnico $unico, ServicioPorPeticion $porPeticion) {
```

Dos verbos y toda la diferencia: `singleton` guarda la instancia, `bind`
construye una nueva cada vez.

Y aquí un matiz que **cambia el significado de la palabra «única»**: el servidor
de desarrollo de PHP atiende cada petición en un **proceso nuevo**, así que
«única instancia» dura lo que dura la petición.

Con un gestor de procesos persistente —PHP-FPM con `pm.max_requests` alto,
Octane, Swoole— el matiz cambia y el riesgo de estado compartido vuelve. Es el
mismo modelo de ejecución que la clase 014 obligó a tener en cuenta, y explica
por qué en PHP el estado compartido entre peticiones se ha resuelto
históricamente con infraestructura externa y no con variables.

## 🔬 Comparación

| Framework | Ámbito por omisión | ¿Detecta dependencias cautivas? |
| --- | --- | --- |
| Spring Boot | única instancia | no; usa proxy para que funcione |
| ASP.NET Core | ninguno: se declara siempre | **sí**, en desarrollo |
| NestJS | única instancia | no; propaga el ámbito hacia arriba |
| Laravel | por uso (`bind`) | no |

**El valor por omisión es el peligroso en tres de cuatro.** Única instancia es lo
barato y lo que casi nadie cambia, y es justo el que comparte estado.

## ⚠️ Errores frecuentes

- **Estado de petición en un objeto de única instancia.** El fallo caro.
- **Dependencia cautiva.** Un objeto único que depende de uno por petición.
- **Todo por petición «por si acaso».** Coste innecesario en objetos sin estado.
- **Suponer que el ámbito por omisión es el correcto.** En tres de cuatro es el
  arriesgado.
- **Guardar una conexión a base de datos en un objeto de única instancia** en
  lugar de usar el grupo de conexiones — clase 061.

## ✅ Verificación

```bash
node scripts/run-class.mjs 037
```

## 🧪 Reto de transferencia

Añade al servicio de única instancia un campo que guarde el último identificador
de correlación de la clase 030. Lanza dos peticiones **simultáneas** con
identificadores distintos y observa que una responde el de la otra. Después
arréglalo cambiando el ámbito. **Reproducir el fallo es el ejercicio.**

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 027 — El orden importa](../027-el-orden-importa/README.md) — el mismo fallo con otra cara
- [Módulo 02 — Arquitectura de frameworks](../../../curriculum/02-arquitectura-de-frameworks.md)

## Fuentes

- [@seemann-deursen-di] Seemann, Mark; van Deursen, Steven. *Dependency Injection Principles, Practices, and Patterns*. Manning, 2019. ISBN 9781617294730 — <https://openlibrary.org/isbn/9781617294730>
- [@owasp-top10] *OWASP Top 10*, OWASP Foundation — <https://owasp.org/www-project-top-ten/>
- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
