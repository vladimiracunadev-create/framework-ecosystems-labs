# Clase 026 — El patrón middleware

> [⬅️ 025](../../parte-1-responder/025-que-hace-tu-framework-con-el-socket/README.md) · [📚 Parte 2](../README.md) · [🎓 Clases](../../README.md) · [027 ➡️](../027-el-orden-importa/README.md)
>
> Parte **2 — La tubería** · Nivel **🟢 introductorio** · Pista **`backend`**
>
> ✅ **Clase construida** — 10 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Reconocer **la misma idea con cinco nombres distintos**, y entender por qué todos
los frameworks de servidor acabaron adoptándola.

## 📖 Un patrón con muchos nombres

| Framework | Cómo lo llama | Cómo continúa la cadena |
| --- | --- | --- |
| Express | middleware | `siguiente()` |
| Fastify | gancho (`onRequest`) | por fase, sin llamada explícita |
| FastAPI | middleware | `await siguiente(peticion)` |
| Flask | ganchos (`after_request`) | por fase |
| Django | middleware | `siguiente(peticion)` |
| Spring Boot | **filtro** / interceptor | `cadena.doFilter(...)` |
| ASP.NET Core | middleware | `await siguiente()` |
| Laravel | middleware | `$siguiente($peticion)` |
| Rails | middleware de Rack | `@app.call(env)` |
| Gin | middleware | `c.Next()` |

Debajo de los diez está la **cadena de responsabilidad** del catálogo de patrones
[@gof-design-patterns]: una serie de objetos que reciben una petición y deciden
si la atienden o la pasan al siguiente.

## 🧩 La situación

Una capa intermedia añade `x-capa: intermedia` a **todas** las respuestas: a `/a`,
a `/b` y también al 404 de una ruta que no existe. Ninguna de las rutas sabe que
esa capa existe.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /a` | `200` · `{"ruta":"a"}` · `x-capa: intermedia` |
| `GET /b` | `200` · `{"ruta":"b"}` · `x-capa: intermedia` |
| `GET /no-existe` | `404` · **también** `x-capa: intermedia` |
| `GET /tampoco` | `404` · `{"error":"no existe"}` |

**El tercer caso es el importante.** Si el 404 lleva la cabecera, la capa se
ejecutó **antes del enrutado** — que es lo que distingue una capa de la tubería
de un decorador de ruta. Y es lo que hace que la autenticación, el registro y la
correlación puedan cubrir rutas que aún no existen.

## 🌐 Las implementaciones

### La forma más desnuda: Rack, en Rails

```ruby
class Capa
  def initialize(app)
    @app = app
  end

  def call(env)
    estado, cabeceras, cuerpo = @app.call(env)
    cabeceras["x-capa"] = "intermedia"
    [estado, cabeceras, cuerpo]
  end
end
```

Un objeto que envuelve a otro y responde a `call`. **Eso es todo el patrón.**
Rails no inventó nada aquí: hereda Rack entero, y Rack es la especificación
mínima del patrón en Ruby.

### Express — la referencia

```javascript
app.use((peticion, respuesta, siguiente) => {
  respuesta.set("x-capa", "intermedia");
  siguiente();
});
```

`siguiente()` es explícito y obligatorio: sin esa llamada, la cadena se detiene y
la petición se queda colgada. Es la fuente número uno de peticiones que nunca
responden en Express.

### Fastify — ganchos por fase, no una cadena

```javascript
app.addHook("onRequest", async (peticion, respuesta) => {
  respuesta.header("x-capa", "intermedia");
});
```

Fastify **no usa la cadena de Express**. Usa ganchos con nombre, uno por fase del
ciclo: `onRequest`, `preHandler`, `onSend`, `onResponse`. No hay `siguiente()`
que olvidar, y a cambio hay que saber en qué fase entra cada cosa.

Es una decisión de diseño con consecuencias medibles: sin cadena que recorrer, el
coste por petición es menor.

### Django — una fábrica, no una función

```python
def capa(siguiente):
    def procesar(peticion):
        respuesta = siguiente(peticion)
        respuesta["X-Capa"] = "intermedia"
        return respuesta

    return procesar
```

La forma es distinta y por una razón concreta: **la función externa se ejecuta
una vez al arrancar** y la interna en cada petición. Ese hueco es el sitio
correcto para el trabajo caro de inicialización — abrir un fichero de
configuración, compilar una expresión regular— que no debe repetirse.

### Spring Boot — filtro

```java
@Component
public static class Capa implements Filter {
    public void doFilter(ServletRequest peticion, ServletResponse respuesta, FilterChain cadena) {
        ((HttpServletResponse) respuesta).setHeader("X-Capa", "intermedia");
        cadena.doFilter(peticion, respuesta);
    }
}
```

En el mundo de los servlets el patrón se llama **filtro**, y existe desde mucho
antes que Express. Spring tiene además **interceptores**, que actúan más adentro:
después del enrutado y sabiendo qué método va a ejecutarse. La clase 038 compara
las dos capas.

### Laravel — una clase con `handle`

```php
class Capa
{
    public function handle(Request $peticion, Closure $siguiente)
    {
        $respuesta = $siguiente($peticion);
        $respuesta->headers->set('X-Capa', 'intermedia');

        return $respuesta;
    }
}
```

Laravel **no acepta una función anónima** aquí, y el motivo es práctico: al
registrar la capa por su nombre de clase, el contenedor puede construirla
inyectándole dependencias y reutilizarla por nombre en grupos de rutas.

Al montar esta clase, pasar una función anónima produjo un error de tipo directo.
La restricción es deliberada.

### Gin — `Next()` en medio

```go
motor.Use(func(c *gin.Context) {
	c.Header("X-Capa", "intermedia")
	c.Next()
})
```

Lo interesante de Gin es que `Next()` está **en medio**: lo que escribas después
se ejecuta al volver, con la respuesta ya generada. Es la forma más visual de ver
que la cadena se recorre hacia dentro y se deshace hacia fuera.

## 🔬 Comparación

| Framework | Modelo | ¿Se puede olvidar continuar? | Registro |
| --- | --- | --- | --- |
| Express | cadena con `siguiente()` | **sí**, y cuelga la petición | `app.use` |
| Gin | cadena con `Next()` | sí | `motor.Use` |
| ASP.NET Core | cadena con `siguiente()` | sí | `app.Use` |
| Laravel | cadena, clase con `handle` | sí | lista de capas |
| Rails | Rack, objeto con `call` | sí | `config.middleware.use` |
| Spring Boot | filtro con `doFilter` | sí | componente descubierto |
| Django | fábrica de función | sí | lista en `MIDDLEWARE` |
| FastAPI | cadena con `await siguiente` | sí | decorador |
| Fastify | **ganchos por fase** | **no**: no hay cadena | `addHook` |
| Flask | **ganchos por fase** | **no** | decorador |

**Ocho de diez usan la cadena y dos usan ganchos.** La diferencia no es
cosmética:

- **Con cadena**, la capa decide si continúa. Eso permite la terminación
  temprana de la clase 028 —cortar y responder— y permite envolver la ejecución
  para medirla.
- **Con ganchos**, la capa no puede cortar tan naturalmente y a cambio **no se
  puede olvidar continuar**, que es un error real y frecuente.

## ⚠️ Errores frecuentes

- **Olvidar `siguiente()`.** La petición se queda colgada hasta que expire.
- **Llamar a `siguiente()` dos veces.** Comportamiento indefinido.
- **Escribir en la respuesta después de continuar** sin comprobar si ya se envió.
- **Poner una capa cara antes de la que rechaza.** Autenticar antes de limitar la
  tasa significa autenticar peticiones que ibas a rechazar.
- **Suponer que el orden de registro es el de ejecución.** En Spring y en
  Starlette no lo es — clase 027.

## ✅ Verificación

```bash
node scripts/run-class.mjs 026
```

## 🧪 Reto de transferencia

Añade una segunda capa que mida la duración de la petición y la emita en
`server-timing`. Después decide dónde registrarla **respecto a la primera**, y
justifica el orden. La clase 027 te dará el criterio.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 027 — El orden importa](../027-el-orden-importa/README.md)
- [Módulo 02 — Arquitectura de frameworks](../../../curriculum/02-arquitectura-de-frameworks.md)

## Fuentes

- [@gof-design-patterns] Gamma, Erich; Helm, Richard; Johnson, Ralph; Vlissides, John. *Design Patterns*. Addison-Wesley, 1994. ISBN 9780201633610 — <https://openlibrary.org/isbn/9780201633610>
- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@casciaro-node-patterns] Casciaro, Mario; Mammino, Luciano. *Node.js Design Patterns*, 3.ª ed. Packt, 2020. ISBN 9781839214110 — <https://openlibrary.org/isbn/9781839214110>
