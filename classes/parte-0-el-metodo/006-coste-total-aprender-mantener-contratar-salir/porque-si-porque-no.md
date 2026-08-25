# Por qué sí y por qué no — Coste total: aprender, mantener, contratar, salir

> [⬅️ Clase 006](README.md) · [📚 Parte 0](../README.md)

La tabla de la clase mide lo que se paga. Esta mide **lo que se cobra**, que es
la otra mitad del trato y la que los números no enseñan.

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | Tres conceptos y 95 paquetes: se entiende entero en una tarde | No impone nada, y en un equipo grande cada uno impone lo suyo | Que la coherencia entre rutas dependa de la disciplina, no del framework |
| [NestJS](../../../atlas/fichas/nestjs.md) | Estructura obligatoria: módulos, límites y validación que ninguna ruta puede saltarse | Nueve conceptos y 158 paquetes antes de la primera línea útil | Seis de siete archivos hablan su idioma, y no hay alternativa en Node |

## 🧭 Lo que este contrato no puede probar

- **El coste de contratar.** Es la única de las cuatro que no sale de ningún
  archivo, y por eso la implementación responde `medido: false`. Los datos
  existen —encuestas del sector, ofertas de tu mercado— pero no aquí, y traerlos
  sin fecha ni muestra sería inventarlos con otro formato.
- **El punto en que la estructura empieza a compensar.** Depende del tamaño del
  equipo, de la rotación y de cuánto dura el proyecto. No hay número universal, y
  quien lo dé sin conocer tu equipo está adivinando.
- **La calidad de lo que se descarga.** Ciento cincuenta y ocho paquetes no son
  peores que noventa y cinco por ser más: son **más superficie**. Cuánto riesgo
  hay ahí depende de cuáles sean, y eso es la parte 9 del programa.
- **Lo que cuesta salir de verdad.** Contar archivos es un proxy, no la factura.
  La factura incluye reescribir pruebas, reentrenar al equipo y convivir con dos
  modelos durante la migración — la parte 11 entera.

## 💡 Lo que hay que llevarse

Un framework es una compra a plazos. El primer día se paga aprenderlo; cada
semana, mantenerlo; cada contratación, encontrar a alguien que lo sepa; y el
último día, salir.

**Casi todas las comparativas hablan del primer día.** Es el único plazo que se
ve al empezar, y el más barato de los cuatro.

Brooks lo dijo antes de que existieran los frameworks y sigue siendo la mejor
formulación: **no hay bala de plata** — ninguna herramienta quita la complejidad
esencial del problema, solo la mueve de sitio [@brooks-mythical-man-month]. Lo
que hace un framework es cobrarte por moverla, y el precio tiene cuatro
componentes.

La consecuencia práctica es más pequeña y más útil: **mide antes de discutir**.
Tres de las cuatro dimensiones se calculan en dos minutos sobre tu propio
proyecto. Las discusiones que empiezan con esos tres números duran mucho menos y
terminan mejor que las que empiezan con impresiones.

Y para la cuarta, la regla de la casa: **cuando no se puede medir, se dice**. Un
hueco declarado es información; un número inventado con formato de medida es lo
contrario.

## Fuentes

- [@brooks-mythical-man-month] Brooks, Frederick P. *The Mythical Man-Month*, ed. aniversario. Addison-Wesley, 1995. ISBN 9780201835953 — <https://openlibrary.org/isbn/9780201835953>
- [@ford-evolutionary-architectures] Ford, N.; Parsons, R.; Kua, P.; Sadalage, P. *Building Evolutionary Architectures*, 2.ª ed. O'Reilly Media, 2022. ISBN 9781492097549 — <https://openlibrary.org/isbn/9781492097549>
- [@richards-ford-fundamentals] Richards, M.; Ford, N. *Fundamentals of Software Architecture: An Engineering Approach*. O'Reilly Media, 2020. ISBN 9781492043454 — <https://openlibrary.org/isbn/9781492043454>
