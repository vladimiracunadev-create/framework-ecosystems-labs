# Por qué sí y por qué no — Paginación

> [⬅️ Clase 045](README.md) · [📚 Parte 3](../README.md)

Aquí lo que se compara no son frameworks: es **desplazamiento frente a cursor**.
Los cuatro implementan los dos igual de bien, y la elección la decide el producto.

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| **Desplazamiento** | Saltar a cualquier página; el total sale gratis | La página se desplaza al insertar, y el coste crece con la profundidad | Elementos repetidos, elementos perdidos, y páginas profundas lentas |
| **Cursor** | Estable ante inserciones y con coste constante | No hay página N ni total barato | Una interfaz sin números de página |

## 🧭 La regla que funciona

**¿La lista cambia mientras se pagina?**

- **No** —un catálogo, un informe cerrado— → desplazamiento. Es más simple y el
  problema que evita el cursor no existe.
- **Sí** —un flujo de actividad, una bandeja, cualquier cosa con escrituras
  concurrentes— → cursor. Con desplazamiento, un usuario **verá elementos dos
  veces y se perderá otros**, y nunca sabrá por qué.

Y una segunda pregunta que decide sola: **¿cuántos datos habrá dentro de dos
años?** El desplazamiento funciona perfectamente hasta que no, y ese punto llega
sin aviso.

## ⚠️ Lo que los cuatro frameworks sí deciden por ti

**Nada.** Ninguno impone un límite máximo, ninguno obliga a ordenar, ninguno
avisa de que paginar sin orden estable produce resultados incoherentes.

Las tres reglas hay que escribirlas:

1. **Límite máximo siempre.** Sin él, `?limite=1000000` es una petición legítima
   que carga la tabla entera — la clase de agotamiento de recursos que Nygard
   agrupa bajo la idea de que todo recurso necesita un tope
   [@nygard-release-it].
2. **Orden explícito y estable.** Sin `ORDER BY`, la base no promete ningún
   orden, y dos peticiones seguidas pueden devolver las mismas filas en
   posiciones distintas.
3. **Desempate por identificador.** Ordenar por un campo con valores repetidos
   rompe el cursor: hay que añadir el identificador como segundo criterio.

## Fuentes

- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
