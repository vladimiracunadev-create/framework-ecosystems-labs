# Por qué sí y por qué no — Cómo se mide (y cómo se miente) el rendimiento

> [⬅️ Clase 007](README.md) · [📚 Parte 0](../README.md)

Los cuatro están aquí por lo que enseñan **sobre la medición**, no por lo que
marcan en un cronómetro.

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | El caso base: el más medido del mundo y el más citado sin entorno | Su coste de enrutado es irrelevante frente al de cualquier ruta real | Aparecer siempre el último en tablas que no miden lo que importa |
| [Fastify](../../../atlas/fichas/fastify.md) | Nació de una comparativa y publica las suyas con método | Comparte runtime con Express: la diferencia entre ambos es la parte pequeña | Que su ventaja real se diluya en cuanto la ruta hace trabajo de verdad |
| [Gin](../../../atlas/fichas/gin.md) | Compila a código máquina y el runtime no calienta como una máquina virtual | El recolector de basura sigue ahí, y aparece justo en la cola | Un p99 que la media esconde igual que en los demás |
| [axum](../../../atlas/fichas/axum.md) | Es donde se ven las dos trampas de los lenguajes compilados: el binario sin optimizar y el bucle que el compilador borró | La primera construcción tarda minutos y desanima a medirlo bien | Que casi todas las tablas que lo incluyen lo midan en modo depuración |

## 🧭 Lo que este contrato no puede probar

Esta es la sección más importante de la clase, porque la lista de lo que **no**
se puede afirmar es más larga que la de lo que sí.

- **Que un framework sea más rápido que otro.** No está en el contrato y no
  puede estarlo: el resultado dependería de la máquina que ejecute el
  verificador, y el repositorio se ejecuta en máquinas distintas cada día.
- **Cuánto cuesta el enrutado de cada uno.** Haría falta aislar el framework del
  trabajo, con herramientas de perfilado y varias ejecuciones. Es un trabajo
  legítimo y no cabe en una clase introductoria.
- **El comportamiento bajo carga.** Esta clase mide un trabajo secuencial en un
  proceso tranquilo. Lo que pasa con mil peticiones simultáneas —colas, cambios
  de contexto, presión de memoria— es otro problema entero, y es el de la parte 9.
- **La latencia real de tu servicio.** Cuatrocientos hashes no son tu ruta. El
  método vale; el número, no.

Lo que sí prueba: **que la media oculta la cola, siempre**, y que las tres
trampas de la clase se pueden ejecutar y ver.

## 💡 Lo que hay que llevarse

Una medición es una afirmación sobre el mundo, y como toda afirmación necesita
condiciones para ser cierta. Publicar el número sin las condiciones no es
resumir: es quitarle lo que lo hacía verdad.

Los cuatro datos del entorno —runtime, versión, núcleos, modo de compilación— no
son burocracia. Son las condiciones. **Sin ellas el número no es reproducible, y
lo que no es reproducible no es una medición.**

Gregg lo formula como una regla de trabajo: antes de creerte una métrica,
pregunta cómo se obtuvo y qué no incluye [@gregg-systems-performance]. Casi
siempre la respuesta a la segunda pregunta es la interesante.

Y el hallazgo práctico, el que cambia cómo mira uno un panel: **tus usuarios no
viven en la media**. Si el p99 es seis veces la media, una de cada cien
peticiones tarda seis veces más — y con cien peticiones por página, eso le pasa a
todo el mundo, todo el rato. Nygard lo cuenta al revés y se entiende mejor: los
sistemas no se caen por la media, se caen por la cola [@nygard-release-it].

## Fuentes

- [@gregg-systems-performance] Gregg, Brendan. *Systems Performance*, 2.ª ed. Addison-Wesley, 2020. ISBN 9780136820154 — <https://openlibrary.org/isbn/9780136820154>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@klabnik-nichols-rust] Klabnik, S.; Nichols, C. *The Rust Programming Language*, 2.ª ed. No Starch Press, 2023. ISBN 9781718503106 — <https://openlibrary.org/isbn/9781718503106>
