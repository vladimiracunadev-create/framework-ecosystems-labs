# Por qué sí y por qué no — El elenco: por qué no todos resuelven todo

> [⬅️ Clase 009](README.md) · [📚 Parte 0](../README.md)

Aquí «por qué sí» no significa «por qué elegirlo»: significa **para qué está**, y
con qué se junta en lugar de a qué sustituye.

| | Para qué está | Para qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | Atender peticiones y encaminarlas | Todo lo demás: ni interfaz, ni datos, ni móvil | Necesitar otras tres piezas para tener un producto |
| [React](../../../atlas/fichas/react.md) | Convertir estado en interfaz, en web y —vía React Native— fuera del navegador | Servir, guardar, enrutar en servidor | Que la pila alrededor la decidas y la mantengas tú |
| [Prisma ORM](../../../atlas/fichas/prisma.md) | Hablar con la base de datos, y solo eso | Cualquier cosa que ocurra por encima | Un esquema y un generador más en la tubería |
| [Flutter](../../../atlas/fichas/flutter.md) | Dibujar la misma interfaz en móvil, web y escritorio con su propio motor | Servidor y persistencia | Un lenguaje entero —Dart— y unos controles que no son los del sistema |

## 🧭 Lo que este contrato no puede probar

- **Que el campo `targets` esté completo.** Es la lectura que hace este
  repositorio de a qué se dirige cada tecnología, contrastada con su
  documentación oficial. Una pieza puede tener un uso legítimo que su
  documentación no destaca.
- **Que dos tecnologías del mismo destino sean intercambiables.** Compartir
  casilla es el requisito mínimo para comparar, no la conclusión. Express y
  Django comparten `backend` y cambiar de uno a otro es cambiar de lenguaje.
- **Que un problema con muchas opciones sea una decisión fácil.** Cuarenta y
  cuatro frameworks de servidor no significan cuarenta y cuatro candidatos
  reales: la mayoría queda fuera por el lenguaje antes de mirar nada más.
- **Que Flutter sea único de verdad.** El contrato comprueba que su categoría
  tiene un solo miembro en ESTE catálogo. Que eso refleje el mundo o refleje la
  clasificación es justo la pregunta que la clase te deja hacer.

## 💡 Lo que hay que llevarse

Un lenguaje es de propósito general: con Python puedes escribir un servidor, un
análisis de datos o un videojuego, mejor o peor. **Un framework no.** Está hecho
para un tipo de problema y para ese lo hace bien; fuera de él no es que lo haga
mal — es que no lo hace.

De ahí sale la palabra que este programa usa en cada clase: **elenco**. No es una
lista de candidatos entre los que elegir, es la lista de quienes tienen algo que
decir sobre ese problema concreto. Cuando un framework famoso no aparece en una
clase, casi nunca es un olvido: es que ese problema no existe para él.

La consecuencia práctica llega antes que cualquier comparación: **primero
descarta por casilla, después compara**. Cuatro de cada cinco discusiones sobre
tecnología se ahorran ahí, porque comparaban piezas que se usan juntas.

Y una advertencia sobre las cifras: que un problema tenga cuarenta soluciones y
otro nueve no dice cuál es más difícil. Dice **dónde se ha concentrado el
esfuerzo de la industria**, que es otra cosa y cambia con la década. Brooks
avisaba de que la complejidad esencial no se va a ninguna parte
[@brooks-mythical-man-month]: cuando una casilla se llena de opciones, casi
siempre es porque el problema de al lado se llevó la parte difícil.

## Fuentes

- [@brooks-mythical-man-month] Brooks, Frederick P. *The Mythical Man-Month*, ed. aniversario. Addison-Wesley, 1995. ISBN 9780201835953 — <https://openlibrary.org/isbn/9780201835953>
- [@richards-ford-fundamentals] Richards, M.; Ford, N. *Fundamentals of Software Architecture: An Engineering Approach*. O'Reilly Media, 2020. ISBN 9781492043454 — <https://openlibrary.org/isbn/9781492043454>
- [@react-native-architecture] *React Native Architecture Overview*. Meta — <https://reactnative.dev/architecture/overview>
