# Por qué sí y por qué no — Hipermedia como alternativa

> [⬅️ Clase 103](README.md) · [📚 Parte 7](../README.md)

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [htmx](../../../atlas/fichas/htmx.md) | 16,6 kB comprimidos y el programa a la vista en el marcado | Una escritura que toca tres sitios necesita que el cliente lo haya previsto | Atributos repartidos por la plantilla, y ninguno obligatorio |
| [Hotwire Turbo](../../../atlas/fichas/hotwire-turbo.md) | El servidor manda varias instrucciones en una sola respuesta | 46,0 kB, y se activa en todo salvo que se le excluya | Un comportamiento global que hay que conocer para depurar |

## 🧭 Lo que este contrato no puede probar

- **Que el fragmento se coloque.** El verificador no ejecuta JavaScript: ve que
  el servidor devuelve el trozo correcto, no que el navegador lo meta en su
  sitio. Lo segundo es la clase 128.
- **La latencia.** El coste de este modelo es una ida y vuelta por interacción, y
  aquí las dos van por la interfaz de retorno de la máquina. En una red móvil la
  diferencia con un estado local es de trescientos milisegundos por clic.
- **Las escrituras que tocan varios sitios.** Es donde las dos bibliotecas
  divergen de verdad, y con una lista y un formulario no se llega a ver. Está
  explicado en el código y no medido.
- **Phoenix LiveView.** Es la tercera respuesta y no está: su mecanismo es una
  conexión abierta con diferencias del árbol, no fragmentos por HTTP, y eso es la
  parte 8.

## 💡 Lo que hay que llevarse

Lo primero, y es lo que convierte esta clase en algo aplicable mañana y no en una
declaración de principios: **la misma ruta puede contestar de dos formas**. Un
`if` sobre una cabecera, dos respuestas, una sola escritura. No hace falta
adoptar nada, ni reescribir nada, ni convencer a nadie: una ruta que sepa
devolver un fragmento a quien lo pida es compatible con lo que ya tienes.

Lo segundo es qué se ahorra de verdad, porque no es lo que se suele decir. **No
se ahorran bytes**: htmx pesa más que Astro con una isla, y Turbo pesa más que
SvelteKit entero. Lo que se ahorra es el código de sincronización — la copia de
la lista en el navegador, el estado de carga, la actualización optimista, la
invalidación. Todo eso, que en la parte 6 son clases enteras, aquí no llega a
plantearse porque solo hay una lista y está en el servidor.

Lo tercero es el precio, y hay que decirlo antes que después: **una ida y vuelta
por interacción**. Marcar una casilla es una petición. Filtrar una lista es una
petición. En un panel de administración eso es invisible y correcto. En un editor
de texto, en un arrastrar y soltar o en un filtro que reacciona letra a letra, es
inaceptable, y ninguna cantidad de entusiasmo lo arregla.

Y lo cuarto, que es lo que esta clase aporta al programa entero. La parte 6 y las
nueve clases anteriores de la 7 dan por hecho que hay estado de interfaz en el
navegador y discuten cómo mantenerlo barato. Esta clase enseña que **esa premisa
es una elección**, no una ley. La pregunta correcta al empezar una pantalla no es
qué framework usar: es si esa pantalla necesita estado propio. Muchas no lo
necesitan, y para esas, la respuesta más barata lleva veinte años inventada.

## Fuentes

- [@htmx-docs] *htmx — Documentación oficial* — <https://htmx.org/docs/>
- [@hotwire-turbo-handbook] *Turbo Handbook*. Hotwired — <https://turbo.hotwired.dev/handbook/introduction>
- [@htmx-essays] *htmx Essays* — <https://htmx.org/essays/>
- [@fielding-rest-dissertation] Fielding, Roy T. *Architectural Styles and the Design of Network-based Software Architectures*. Universidad de California, Irvine, 2000 — <https://ics.uci.edu/~fielding/pubs/dissertation/top.htm>
