# Por qué sí y por qué no — ETags y caché condicional

> [⬅️ Clase 048](README.md) · [📚 Parte 3](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `.eTag()` explícito y un filtro que la genera sola | El filtro automático **no ahorra cómputo**, solo envío | Creerse que optimiza más de lo que optimiza |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Cabecera tipada y middleware para estáticos | Para recursos dinámicos, todo manual | Escribir las dos comprobaciones |
| [Express](../../../atlas/fichas/express.md) | Genera una etiqueta débil para JSON por su cuenta | Esa automática solo sirve para el 304, no para `If-Match` | Escribir la tuya para la protección de escritura |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Control total y explícito | Ninguna ayuda | Todo a mano |

## 🧭 Los dos usos no valen lo mismo

**El 304** ahorra ancho de banda. Es agradable y **casi nunca es el cuello de
botella**: el servidor ya hizo el trabajo entero —consultó, serializó— y solo se
ahorra el envío.

**El `If-Match`** evita perder datos. No es una optimización: es corrección.

Y la asimetría en la práctica es notable: **casi todo el mundo implementa el
primero y casi nadie el segundo**, aunque el segundo es el que impide que el
trabajo de un usuario desaparezca.

## 💡 Cuándo el 304 sí compensa de verdad

Cuando la etiqueta se puede calcular **sin construir la respuesta**.

- Un número de versión de la fila: una consulta trivial, y si no cambió, 304 sin
  tocar nada más.
- Un recurso derivado de varios: la etiqueta puede ser el máximo de sus
  versiones.

Ahí el ahorro sí es de cómputo, y puede ser grande. Con un resumen del contenido
—lo que hacen estas cuatro implementaciones— el ahorro es solo de red.

## ⚠️ Y la parte que no es técnica

Un 412 le llega al usuario como «no se pudo guardar». Si la interfaz no lo maneja,
la protección se percibe como un fallo y **alguien pedirá quitarla**.

Manejarlo bien es: detectar el 412, recargar la versión actual, **mostrar las dos
versiones** y dejar que la persona decida. Es más trabajo que ignorar el conflicto
y es la diferencia entre proteger datos y frustrar usuarios.

Kleppmann sitúa esta decisión en el mismo plano que la resolución de conflictos en
sistemas distribuidos: **detectar el conflicto es la parte fácil; decidir qué
hacer con él es de producto** [@kleppmann-ddia].

## Fuentes

- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
