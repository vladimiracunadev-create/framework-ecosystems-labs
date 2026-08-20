# 🧵 Fiber — 2020

> [⬅️ Atlas](../README.md) · [🐹 Ecosistema Go](../ecosistemas/go.md) · [🗂️ Índice](../frameworks.md)

Fiber **copia deliberadamente la API de [Express](express.md)** para que quien
llega desde Node.js se sienta en casa. Es una decisión de adopción inteligente y
contiene un aviso que esta ficha existe para dar.

| | |
|---|---|
| **Aparición** | 2020 |
| **Clasificación** | `web-framework` |
| **Ecosistema** | Go |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.gofiber.io/> |

---

## ⚠️ Familiaridad de sintaxis, no de semántica

```go
app.Get("/tasks", func(c *fiber.Ctx) error {
    return c.JSON(fiber.Map{"items": items})   // se lee como Express
})
```

Se **lee** igual que Express. **No se comporta** igual:

| | Express (Node.js) | Fiber (Go) |
| --- | --- | --- |
| Modelo de concurrencia | Un hilo, bucle de eventos | Una gorutina por petición |
| Estado compartido | Un solo hilo: sin carreras por defecto | **Varias gorutinas: hay carreras reales** |
| Errores | Excepciones y promesas rechazadas | Valores devueltos que hay que comprobar |
| Bloquear | Bloquea el servidor entero | Bloquea solo esa gorutina |

La segunda fila es la peligrosa. En Node.js, un mapa global compartido entre
peticiones es razonablemente seguro porque solo hay un hilo. **En Go, ese mismo
código es una carrera de datos** — el tipo de fallo que aparece bajo carga, de
forma intermitente, y que el
[módulo 02](../../curriculum/02-arquitectura-de-frameworks.md) describe al hablar
de alcances y estado compartido.

Quien traslada un patrón mental de Express a Fiber sin reparar en esto escribe un
error que las pruebas locales no encuentran [@donovan-kernighan-go].

## 🧭 La lección general

Es el mismo aviso que la [ficha de Sanic](sanic.md) hace en Python al pasar de
síncrono a asíncrono: **una API familiar puede esconder un modelo de ejecución
distinto**.

Es también una advertencia para el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md): la «facilidad de
migración» que ofrece una API parecida es real para la sintaxis y **falsa para la
semántica**, y las decisiones de arquitectura viven en la semántica.

## 🎓 Las dos lecciones

**1. Copiar una API acorta la curva de sintaxis, no la de modelo.** El riesgo es
que la persona crea que ya sabe.

**2. El estado compartido significa cosas distintas según el modelo de
concurrencia.** Lo que es seguro en un hilo es una carrera en varios.

## 🔗 Enlaces

- Documentación oficial: <https://docs.gofiber.io/>
- [Ficha de Express](express.md) — el original · [Ficha de Sanic](sanic.md) — el mismo aviso
- [Módulo 02](../../curriculum/02-arquitectura-de-frameworks.md)

## Fuentes

- [@donovan-kernighan-go] Donovan, Alan A. A.; Kernighan, Brian W. *The Go Programming Language*. Addison-Wesley, 2016. ISBN 9780134190440 — <https://openlibrary.org/isbn/9780134190440>
