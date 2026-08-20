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

## 🌐 Las implementaciones

Las cinco declaran la misma dependencia de cinco maneras. Lo que cambia no es la
capacidad —las cinco sustituyen igual de bien— sino **cuánta ceremonia exige el
lenguaje que hay debajo**. Cinco formas de declarar lo mismo:

### Spring Boot — por constructor, sin anotación

```java
Controlador(Reloj reloj) {
    this.reloj = reloj;
}
```

Desde Spring 4.3 no hace falta anotar: **si hay un solo constructor, el contenedor
lo usa**.

Y por constructor y no por campo, por una razón concreta: **el objeto no puede
existir sin su dependencia**. El compilador lo garantiza. Con inyección por campo,
un objeto a medio construir es posible y falla en tiempo de ejecución.

### ASP.NET Core — el contenedor en la plataforma

```csharp
constructor.Services.AddSingleton<IReloj, RelojFijo>();

app.MapGet("/ahora", (IReloj reloj) => ...);
```

Sin anotación ni atributo: **el tipo del parámetro es la petición**. Es la
declaración más corta de las cinco, y el contenedor viene en la plataforma, no en
una biblioteca.

### NestJS — el contenedor traído a Node

```typescript
constructor(@Inject(RELOJ) private readonly reloj: Reloj) {}
```

Hace falta `@Inject` con una ficha porque **las interfaces de TypeScript no
existen en tiempo de ejecución**: se borran al compilar. El contenedor no puede
buscar por un tipo que ya no está, así que se usa una constante como identificador.

Es una consecuencia directa del diseño de TypeScript, y la razón de que NestJS
tenga esta ceremonia extra frente a Spring o .NET.

### FastAPI — en la firma, sin contenedor

```python
@app.get("/ahora")
def ahora(reloj: Annotated[Reloj, Depends(obtener_reloj)]) -> JSONResponse:
```

**No hay contenedor.** `Depends` resuelve una función y pasa su resultado. La
sustitución se hace con `app.dependency_overrides`, que es exactamente lo que
usan las pruebas.

Es el enfoque más ligero: sin registro central, sin ámbitos declarados, y lo que
se inyecta se lee en la propia firma.

### Laravel — atadura explícita

```php
$app->bind(Reloj::class, RelojFijo::class);

Route::get('/ahora', function (Reloj $reloj) { ... });
```

El contenedor lee el **tipo** del argumento y resuelve — igual que ASP.NET Core.
PHP conserva los tipos en tiempo de ejecución, así que no hace falta la ficha de
NestJS.

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
