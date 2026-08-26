# Por qué sí y por qué no — Estado compartido

> [⬅️ Clase 088](README.md) · [📚 Parte 6](../README.md)

Aquí la tabla compara **las tres respuestas**, no los cuatro frameworks: pasar
hacia abajo, usar el contexto del framework, o traer un almacén.

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| **Pasar hacia abajo** | El flujo se lee siguiendo las firmas: no hay magia que buscar | Cada nivel intermedio queda atado a un dato que no le importa | Que mover un componente signifique arrastrar propiedades ajenas |
| **El contexto del framework** | Ya está instalado, y resuelve la mayoría de los casos de una rama | En React reejecuta a todos los consumidores al cambiar | Un problema de rendimiento que solo existe en un modelo de los cuatro |
| **Un almacén** | Un dato, un dueño, y cualquiera lo lee sin atravesar nada | El componente deja de ser función de sus propiedades | Probarlo exige preparar el almacén, y escribir deja de tener un responsable claro |

Y lo que aporta cada framework a esas tres respuestas:

| | Contexto | Almacén en la caja | Reactividad fina |
| --- | --- | :---: | :---: |
| [React](../../../atlas/fichas/react.md) | `useContext` | ❌ | ❌ |
| [Vue](../../../atlas/fichas/vue.md) | `provide`/`inject` | ❌ (Pinia aparte) | ✅ |
| [Svelte](../../../atlas/fichas/svelte.md) | `setContext`/`getContext` | ✅ | ✅ |
| [SolidJS](../../../atlas/fichas/solid.md) | `createContext` | ✅ | ✅ |

## 🧭 Lo que este contrato no puede probar

- **El coste de rendimiento del contexto de React.** Es real, está documentado y
  ocurre al reejecutar los consumidores en el navegador. Aquí no se mide: haría
  falta un árbol grande, un DOM y la metodología de la clase 007.
- **Las suscripciones.** El almacén de esta clase es un objeto con dos
  funciones; los de verdad avisan a quien lee cuando el valor cambia. Ese aviso
  ocurre en el navegador.
- **Que un almacén global se degrade.** La afirmación «si cualquiera escribe,
  nadie sabe quién cambió qué» es una experiencia repetida, no una medición.
- **Cuál es el umbral.** Cuántos niveles de perforación justifican cambiar de
  forma depende del proyecto. Lo que la clase da es la **cifra** para tu caso, no
  el umbral.

## 💡 Lo que hay que llevarse

La secuencia correcta tiene tres escalones y casi todo el mundo se salta los dos
primeros:

1. **Pasa el dato hacia abajo.** Con uno o dos niveles es lo más simple y lo más
   fácil de seguir. No hay nada que arreglar.
2. **Cuando molesta, mide.** Cuenta cuántos componentes aceptan el dato sin
   usarlo. Ese número —el `coste.json` de esta clase— convierte una molestia en
   una decisión.
3. **Prueba el contexto del framework antes que una biblioteca.** Los cuatro lo
   traen. Resuelve el caso de «una rama entera necesita esto» sin añadir
   dependencias, y la clase 006 explica lo que cuesta cada dependencia añadida.

El almacén global es el cuarto escalón, y llega cuando el dato es **de la
aplicación**, no de una pantalla: la sesión, el idioma, el carrito, el tema. Ahí
sí compensa, y ahí sigue habiendo que decidir quién puede escribir.

Porque la trampa es esa. Osmani lo señala al hablar de módulos y estado
compartido: **el patrón que resuelve el acoplamiento entre padres e hijos crea
otro acoplamiento, con el módulo** [@osmani-js-design-patterns]. Ninguna de las
tres respuestas elimina el problema — lo mueven de sitio, y cada sitio tiene su
factura.

Si uno se lleva una regla: **el dato debe vivir lo más abajo posible, y subir
solo cuando alguien más lo necesite de verdad**. Es la misma frase de la clase
084 leída al revés, y las dos juntas son casi todo lo que hay que saber sobre
dónde poner el estado.

## Fuentes

- [@osmani-js-design-patterns] Osmani, Addy. *Learning JavaScript Design Patterns*, 2.ª ed. O'Reilly Media, 2023. ISBN 9781098139872 — <https://openlibrary.org/isbn/9781098139872>
- [@vue-reactivity] *Reactivity in Depth*. Vue.js — <https://vuejs.org/guide/extras/reactivity-in-depth.html>
- [@solid-reactivity] *Intro to Reactivity*. SolidJS — <https://docs.solidjs.com/concepts/intro-to-reactivity>
