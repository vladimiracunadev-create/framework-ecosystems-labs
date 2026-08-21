# Por qué sí y por qué no — Caché de lectura

> [⬅️ Clase 062](README.md) · [📚 Parte 4](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | Un `Map` y ya: no hay nada que aprender | Y tampoco caducidad, ni límite de tamaño, ni desalojo | Escribir una caché de verdad, o elegir biblioteca |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Igual, y con `functools` para casos triviales | Igual, y con varios procesos cada uno tiene la suya | Descubrirlo en producción |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Declarativa y con proveedor intercambiable: mapa, Caffeine o Redis sin tocar el código | La caché es invisible: el método se lee como si no existiera | Depurar lo que no se ve |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `IMemoryCache` de serie, con caducidad y límite de tamaño | No sabe vaciarse entera | Versionar las claves |

## 🧭 Antes de poner una caché

Tres preguntas, en este orden. Si alguna no tiene respuesta, todavía no toca.

1. **¿Cuánto se lee y cuánto se escribe?** Una caché gana cuando se lee mucho más
   de lo que se escribe. Con lecturas y escrituras parejas, la invalidación
   cuesta más de lo que ahorra.
2. **¿Cuánto dato viejo se puede tolerar?** No es una pregunta técnica: es del
   negocio. El precio de un producto y el número de visitas de una página
   admiten respuestas muy distintas.
3. **¿Se puede arreglar la consulta en su lugar?** Un índice que falta, un N+1
   sin resolver, una agregación en memoria: los tres se arreglan sin añadir un
   sistema nuevo.

La tercera es la que más veces evita la caché entera. Y por eso esta clase va
después de la 056 y la 060, no antes.

## 🧭 Lo que la caché añade además de velocidad

Un modo de fallo nuevo, que conviene decidir por adelantado: **si la caché no
responde, ¿el servicio falla o consulta al almacén?**

- **Consultar** mantiene el servicio en pie y descarga toda la carga de golpe
  sobre la base — que puede ser justo lo que la tumbe.
- **Fallar** protege la base y tira el servicio.

No hay respuesta general, y sí una recomendación: **decidirlo antes**, porque la
opción por omisión de la mayoría de las bibliotecas es la primera y nadie se
entera hasta que ocurre.

## 💡 Lo que hay que llevarse

La caché no es una optimización: es **una segunda copia del dato**. Y toda copia
plantea la misma pregunta que Kleppmann sitúa en el centro de los sistemas
distribuidos — **cómo se mantienen de acuerdo dos copias del mismo dato**
[@kleppmann-ddia].

La respuesta completa se llama coherencia, y es un problema difícil. La respuesta
práctica para una caché de lectura son dos reglas modestas:

- **Borra la entrada al escribir**, siempre, en la misma operación.
- **Ponle caducidad**, aunque creas que la primera regla se cumple.

Con esas dos, el peor caso es servir un dato viejo durante unos minutos. Sin la
segunda, el peor caso no tiene final.

## Fuentes

- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
