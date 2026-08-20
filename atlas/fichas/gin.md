# 🍸 Gin — 2014

> [⬅️ Atlas](../README.md) · [🐹 Ecosistema Go](../ecosistemas/go.md) · [🗂️ Índice](../frameworks.md)

Gin es el framework HTTP más usado de Go. Su ficha sirve para plantear la
pregunta que define el ecosistema entero: **¿de verdad hace falta un framework
cuando la biblioteca estándar ya trae un servidor listo para producción?**

| | |
|---|---|
| **Aparición** | 2014 |
| **Clasificación** | `web-framework` |
| **Ecosistema** | Go |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://gin-gonic.com/en/docs/> |

---

## 🧭 La pregunta previa del ecosistema

En casi todos los ecosistemas del Atlas, el framework compite contra otro
framework. En Go compite contra **no usar ninguno**: `net/http` incluye un
servidor apto para producción, y muchos servicios en explotación no usan nada más
[@donovan-kernighan-go].

Lo que Gin añade sobre esa base:

| Aporta | Detalle |
| --- | --- |
| Enrutado con parámetros | `/tasks/:id`, con un árbol de rutas rápido |
| Cadena de middleware | Con el orden explícito del [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md) |
| Enlace y validación | Desde etiquetas de estructura |
| Respuestas cómodas | JSON, XML, renderizado |
| Recuperación ante pánico | Que una petición no tumbe el proceso |

Ninguna de esas cosas es imposible sin Gin: **todas son azúcar sobre una base que
ya funciona**. Por eso la matriz del
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) en Go puntúa
dimensiones distintas: no «qué trae en la caja», sino **cuánta comodidad
compensa la dependencia**.

## 💡 Enlace por etiquetas, y su límite

```go
type CrearTarea struct {
    Title string `json:"title" binding:"required,max=120"`
}
```

Cómodo, y con el mismo hallazgo que la
[ficha de FastAPI](fastapi.md) documenta: **el vocabulario de errores del
validador no es el de tu contrato**. Traducirlo es trabajo propio, en un punto
único, o el cliente acabará recibiendo el formato interno de una dependencia.

## ⚖️ El compromiso

**Se gana** menos código repetido y una API conocida por mucha gente.

**Se paga** una dependencia en el camino crítico de cada petición, con su propio
mantenimiento y su cadena de suministro. En un ecosistema donde la alternativa es
la biblioteca estándar, eso pesa más que en otros.

## 🎓 Las dos lecciones

**1. Cuando la biblioteca estándar es capaz, el framework compite contra
nada.** Eso cambia las preguntas de la matriz de decisión.

**2. Todo validador tiene su propio vocabulario de errores.** Si no lo traduces,
tu contrato público lo define una dependencia.

## 🔗 Enlaces

- Documentación oficial: <https://gin-gonic.com/en/docs/>
- [Ficha de chi](chi.md) · [Ficha de Echo](echo.md) · [Ficha de Fiber](fiber.md)
- [Ecosistema Go](../ecosistemas/go.md)

## Fuentes

- [@donovan-kernighan-go] Donovan, Alan A. A.; Kernighan, Brian W. *The Go Programming Language*. Addison-Wesley, 2016. ISBN 9780134190440 — <https://openlibrary.org/isbn/9780134190440>
