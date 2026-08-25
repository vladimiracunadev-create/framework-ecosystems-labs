# Clase 038 — Middleware, decorador y aspecto

> [⬅️ 037](../037-ciclo-de-vida-de-los-objetos/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [039 ➡️](../../parte-3-validacion-y-contrato/039-validar-la-entrada/README.md)
>
> Parte **2 — La tubería** · Nivel **🔴 avanzado** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Distinguir **tres alturas** para envolver comportamiento, y saber cuál
corresponde a cada necesidad. Es la clase que cierra la parte 2 y ordena todo lo
anterior.

## 🧩 La situación

La misma auditoría implementada en dos alturas distintas. La traza resultante es
idéntica en los cuatro frameworks:

```text
externa:GET /accion → interna:accion → manejador → interna:fin
```

Los marcadores se llaman `externa` e `interna` **a propósito**: cada framework
llama distinto a lo mismo, y unificar los nombres es lo que hace comparable el
contrato.

## 📖 Las tres alturas

| Altura | Qué ve | Qué no ve |
| --- | --- | --- |
| **Capa de transporte** | método, ruta, cabeceras, cuerpo crudo | qué código va a ejecutarse |
| **Intercepción de manejador** | qué clase y método se ejecutan, sus argumentos, su resultado | nada del transporte que no le pasen |
| **Aspecto sobre el método** | la ejecución de un método, **venga de donde venga** | absolutamente nada de HTTP |

Y cómo lo llama cada framework:

| Framework | Externa | Interna |
| --- | --- | --- |
| Spring Boot | filtro | **aspecto** |
| NestJS | middleware | **interceptor** |
| ASP.NET Core | middleware | **filtro de punto final** |
| FastAPI | middleware | **decorador** |

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /accion` | `200` · `{"ok":true}` |
| `GET /auditoria` | `["externa:GET /accion","interna:accion","manejador","interna:fin"]` |

El segundo caso comprueba las dos cosas a la vez: que **las capas envuelven al
manejador de fuera adentro**, y que **se deshacen al revés** — la capa interna
registra su fin después del manejador y antes de que salga la respuesta.

## 🌐 Las implementaciones — el código a la vista

Las cuatro producen la misma traza con mecanismos de nombres distintos. Léelas
comparando **qué información tiene cada altura**: la externa solo conoce método y
ruta; la interna conoce el método que se va a ejecutar y su resultado.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py) — capa y decorador

```python
@app.middleware("http")
async def capa(peticion: Request, siguiente):
    if peticion.url.path != "/auditoria":
        auditoria.append(f"externa:{peticion.method} {peticion.url.path}")
    return await siguiente(peticion)
```

```python
def auditar(funcion: Callable) -> Callable:
    @functools.wraps(funcion)
    def envoltura(*args, **kwargs):
        auditoria.append(f"interna:{funcion.__name__}")
        resultado = funcion(*args, **kwargs)
        auditoria.append("interna:fin")
        return resultado

    return envoltura
```

```python
@app.get("/accion")
@auditar
def accion() -> JSONResponse:
```

La diferencia de altura se ve en una línea: la capa escribe
`peticion.url.path`, el decorador escribe `funcion.__name__`. **Una conoce la
URL, la otra conoce la función.**

Y `functools.wraps` no es decoración: sin él, la función envuelta pierde su
nombre y su firma, y **FastAPI deja de poder inspeccionarla** para construir la
documentación y la validación. Es el fallo clásico de decorar en este ecosistema.

Python no necesita un mecanismo de aspectos aparte porque **el decorador ya es la
forma nativa de envolver comportamiento**.

### NestJS · [`nestjs/src/main.ts`](implementaciones/nestjs/src/main.ts) — middleware e interceptor

```typescript
class CapaExterna implements NestMiddleware {
  use(peticion: Request, respuesta: Response, siguiente: NextFunction): void {
    auditoria.push(`externa:${peticion.method} ${peticion.originalUrl}`);
    siguiente();
  }
}
```

```typescript
class CapaInterna implements NestInterceptor {
  intercept(contexto: ExecutionContext, siguiente: CallHandler): Observable<unknown> {
    auditoria.push(`interna:${contexto.getHandler().name}`);
    return siguiente.handle().pipe(tap(() => auditoria.push("interna:fin")));
  }
}
```

`contexto.getHandler().name` frente a `peticion.method`: la misma diferencia de
altura, con nombres propios de NestJS. Y el interceptor devuelve un
**observable**, así que puede transformar el resultado además de observarlo.

Un tropiezo real que el código documenta y merece la pena:

```typescript
    auditoria.push(`externa:${peticion.method} ${peticion.originalUrl}`);
```

`originalUrl` y **no** `path`. Al montar la capa sobre una ruta concreta con
`forRoutes("accion")`, Express recorta el prefijo de montaje y `path` vale `/`.
Es el mismo comportamiento que hace que un enrutador anidado vea rutas relativas:
cómodo al componer, sorprendente al registrar.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java) — filtro y **aspecto**

```java
    public static class CapaFiltro implements Filter {
        @Override
        public void doFilter(ServletRequest peticion, ServletResponse respuesta, FilterChain cadena)
                throws IOException, ServletException {
            HttpServletRequest p = (HttpServletRequest) peticion;
            if (!"/auditoria".equals(p.getRequestURI())) {
                AUDITORIA.add("externa:" + p.getMethod() + " " + p.getRequestURI());
            }
```

```java
    public static class CapaAspecto {
        @Around("execution(* labs.Aplicacion.Controlador.accion(..))")
        public Object auditar(ProceedingJoinPoint punto) throws Throwable {
            AUDITORIA.add("interna:" + punto.getSignature().getName());
            Object resultado = punto.proceed();
            AUDITORIA.add("interna:fin");
            return resultado;
        }
    }
```

**El aspecto es la pieza más distinta de las cuatro, y la más interesante: no
sabe nada de HTTP.** Se engancha a la **ejecución de un método**, sea cual sea
quien lo llame.

Por eso el mismo aspecto sirve para una petición web, una tarea programada o una
prueba unitaria. Middleware y filtros viven en **el transporte**; el aspecto vive
en **el código**.

El precio está en la propia línea: `execution(* labs.Aplicacion.Controlador.accion(..))`
es una expresión de corte, escrita en un lenguaje aparte, que se evalúa en tiempo
de ejecución. **Renombrar el método rompe el aspecto sin que el compilador diga
nada.**

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs) — middleware y filtro de punto final

```csharp
app.Use(async (contexto, siguiente) =>
{
    if (contexto.Request.Path != "/auditoria")
    {
        auditoria.Add($"externa:{contexto.Request.Method} {contexto.Request.Path}");
    }
    await siguiente();
});
```

```csharp
}).AddEndpointFilter(async (contexto, siguiente) =>
{
    auditoria.Add("interna:accion");
    var resultado = await siguiente(contexto);
    auditoria.Add("interna:fin");
    return resultado;
});
```

**Filtro de punto final**: ya sabe qué punto final se va a ejecutar, y puede
actuar antes y después. Y a diferencia del aspecto de Spring, **se registra en la
ruta**, encadenado al `MapGet` — así que renombrar el manejador no lo rompe,
porque no lo nombra.

Es el punto medio del elenco: la información de la altura interna, con el
acoplamiento de la externa.

## 🎯 La distinción que de verdad importa

Fíjate en la fila de Spring: su capa interna es un **aspecto**, y eso lo pone en
una categoría aparte.

```java
@Around("execution(* labs.Aplicacion.Controlador.accion(..))")
public Object auditar(ProceedingJoinPoint punto) throws Throwable { ... }
```

Ese aspecto **no sabe nada de HTTP**. Se engancha a la ejecución de un método,
así que el mismo código funciona si el método lo llama una petición web, una
tarea programada, un consumidor de cola o una prueba.

Es la diferencia de fondo de esta clase:

> **Middleware e interceptores viven en el transporte. El aspecto vive en el
> código.**

La consecuencia práctica: una auditoría implementada como middleware **solo audita
lo que llega por HTTP**. La misma operación disparada por una tarea nocturna pasa
sin registrar. Con un aspecto, se audita igual.

## 🔍 Un detalle que costó una corrección

La implementación de NestJS registraba `externa:GET /` en lugar de
`externa:GET /accion`.

Causa: la capa se monta sobre una ruta concreta —`forRoutes("accion")`— y Express
**recorta el prefijo de montaje**, así que `peticion.path` vale `/`. La solución
es `originalUrl`.

Es el mismo comportamiento que hace que un enrutador anidado vea rutas relativas:
**cómodo al componer, sorprendente al registrar**. Y explica por qué muchos
registros de peticiones muestran rutas incompletas sin que nadie sepa por qué.

## 🧭 Cuál elegir

| Necesitas… | Altura | Por qué |
| --- | --- | --- |
| Cabeceras de seguridad, CORS, compresión | **transporte** | Son propiedades de la respuesta HTTP |
| Autenticación, cupos, plazos | **transporte** | Deben cortar antes de gastar |
| Transformar el resultado de un manejador | **intercepción** | Ya conoce el resultado |
| Auditar una operación de negocio | **aspecto** | Debe capturarla venga de donde venga |
| Reintentar o cachear una llamada interna | **aspecto** | No tiene nada que ver con HTTP |

La regla resumida: **cuanto más cerca del dominio esté lo que quieres envolver,
más adentro debe estar la capa**.

## ⚠️ Lo que hay que vigilar en los aspectos

Los aspectos tienen fama de mágicos, y con razón: **el código que se ejecuta no
está donde se lee**.

Un método con un aspecto alrededor se comporta distinto de lo que dice su cuerpo,
y nada en el punto de llamada lo indica. Depurar eso exige saber que el aspecto
existe.

Además, en Spring los aspectos funcionan mediante proxy, lo que trae una trampa
clásica: **una llamada desde dentro del mismo objeto no pasa por el proxy**, así
que el aspecto no se aplica. Es el mismo mecanismo que hace que `@Transactional`
o `@Cacheable` no funcionen en llamadas internas — uno de los desconciertos más
frecuentes con Spring.

## 🔬 Comparación

| Framework | ¿Tiene aspectos reales? | Alternativa |
| --- | --- | --- |
| Spring Boot | **sí**, con AspectJ | — |
| FastAPI | no hace falta: **el decorador es nativo** | decoradores de Python |
| NestJS | no: interceptores, atados a la petición | interceptor |
| ASP.NET Core | no de serie | filtros, o generación de código |

Python es el caso interesante: **no necesita un mecanismo de aspectos** porque el
decorador ya envuelve cualquier función, con o sin HTTP de por medio. Lo que en
Java requirió una tecnología aparte, en Python es sintaxis del lenguaje.

## ⚠️ Errores frecuentes

- **Auditar en la capa de transporte** una operación de negocio: lo que no llega
  por HTTP no se audita.
- **Llamada interna con aspecto de Spring.** No pasa por el proxy y no se aplica.
- **Usar un aspecto para algo que no es transversal.** Magia sin justificación.
- **Confundir filtro con interceptor** y quedarse sin la información que
  necesitabas.
- **Registrar `path` en una capa montada sobre una ruta.** Devuelve la ruta
  recortada, no la completa.

## ✅ Verificación

```bash
node scripts/run-class.mjs 038
```

## 🧪 Reto de transferencia

Llama al método auditado **desde otro método del mismo objeto** en la
implementación de Spring y comprueba que el aspecto no se aplica. Después
explica por qué, y cuál de las dos soluciones habituales —extraer a otro
componente o autoinyectarse— prefieres.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Parte 3 — Validación y contrato](../../parte-3-validacion-y-contrato/README.md)
- [Módulo 02 — Arquitectura de frameworks](../../../curriculum/02-arquitectura-de-frameworks.md)

## Fuentes

- [@gof-design-patterns] Gamma, Erich; Helm, Richard; Johnson, Ralph; Vlissides, John. *Design Patterns*. Addison-Wesley, 1994. ISBN 9780201633610 — <https://openlibrary.org/isbn/9780201633610>
- [@ousterhout-philosophy] Ousterhout, John. *A Philosophy of Software Design*. Yaknyam Press, 2018. ISBN 9781732102200 — <https://openlibrary.org/isbn/9781732102200>
- [@martin-clean-architecture] Martin, Robert C. *Clean Architecture*. Prentice Hall, 2017. ISBN 9780134494166 — <https://openlibrary.org/isbn/9780134494166>
