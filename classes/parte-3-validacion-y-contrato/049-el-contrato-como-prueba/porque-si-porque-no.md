# Por qué sí y por qué no — El contrato como prueba

> [⬅️ Clase 049](README.md) · [📚 Parte 3](../README.md)

Esta clase no compara frameworks: los cuatro cumplen los seis casos y esa
igualdad **es el resultado**. Lo que se compara es el método.

| Enfoque | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| **Un contrato para todos** | Un fallo señala una diferencia real; un verde significa lo mismo en todos | Hay que resistir la tentación de adaptarlo cuando uno no pasa | Investigar cada divergencia en vez de rodearla |
| Una batería por framework | Cómoda, idiomática, escrita por quien lo conoce | Cada uno pasa **su** examen: la comparación no significa nada | Una ilusión de equivalencia |
| Contrato con adaptadores | Permite absorber diferencias de forma | El adaptador acaba **tapando la diferencia** que querías ver | Comparación contaminada |

## 🧭 La disciplina que cuesta

Cuando una implementación falla el contrato hay dos reacciones posibles, y solo
una es útil:

- **Ajustar el contrato para que pase.** Rápido, y destruye el valor: el contrato
  pasa a describir lo que los frameworks hacen en lugar de lo que la API debe
  hacer.
- **Averiguar por qué falla.** Lento, y es donde está todo el aprendizaje.

Esta parte del programa hizo lo segundo cuatro veces, y las cuatro cambiaron una
clase: `Cache-Control` con `private` de Symfony, el 200 frente al 204 de CORS, el
400 en vez del 422 ante un tipo equivocado, y el `detalle` en inglés de Pydantic.

**Tres de las cuatro resultaron ser culpa del contrato, no del framework** — y esa
también es información: un contrato que exige más de lo que exige el estándar
mide la implementación.

## 💡 Qué hace útil a esta prueba

**No sabe nada del código.** No conoce nombres de funciones, ni clases, ni
estructuras internas. Solo códigos, cabeceras y cuerpos — exactamente lo que ve
un cliente real.

Esa ignorancia tiene dos consecuencias:

1. **Un refactor completo no la rompe.** Puedes reescribir el servidor entero: si
   el comportamiento externo no cambia, sigue en verde.
2. **Un cambio de comportamiento la rompe siempre.** No hay forma de que pase por
   accidente.

Freeman y Pryce lo señalan como la propiedad que separa una prueba que da
confianza de una que solo repite la implementación con otra sintaxis
[@freeman-pryce-goos]. Y es la razón de que este contrato pueda sobrevivir no ya
a un refactor, sino **a cambiar de framework** — que es literalmente lo que hace
en cada clase.

## ⚠️ Lo que no cubre

Es lento —arranca procesos reales— y **no dice dónde está el fallo**, solo que
existe. Diagnosticarlo exige las pruebas de los niveles de abajo.

Por eso no sustituye a nada: complementa. La clase 126 reparte el esfuerzo entre
niveles, y la regla es la de siempre — muchas rápidas abajo, pocas lentas arriba
[@fowler-test-pyramid].

## Fuentes

- [@freeman-pryce-goos] Freeman, Steve; Pryce, Nat. *Growing Object-Oriented Software, Guided by Tests*. Addison-Wesley, 2009. ISBN 9780321503626 — <https://openlibrary.org/isbn/9780321503626>
- [@fowler-test-pyramid] Fowler, Martin. *TestPyramid* — <https://martinfowler.com/bliki/TestPyramid.html>
