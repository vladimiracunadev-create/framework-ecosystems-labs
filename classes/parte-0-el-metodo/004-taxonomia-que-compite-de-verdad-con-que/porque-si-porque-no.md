# Por qué sí y por qué no — Taxonomía: qué compite de verdad con qué

> [⬅️ Clase 004](README.md) · [📚 Parte 0](../README.md)

Esta clase no compara implementaciones: **coloca cinco tecnologías en su sitio**.
Así que la tabla no dice cuál es mejor, sino para qué está cada una y qué se
paga por elegirla.

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | Hace una sola cosa —el bucle de peticiones— y la hace con la menor superficie posible | No decide nada por ti: validación, persistencia y estructura son tuyas | Escribir a mano lo que otros traen puesto, y mantenerlo coherente entre rutas |
| [NestJS](../../../atlas/fichas/nestjs.md) | Trae estructura de verdad a Node: módulos, inyección por constructor, límites explícitos | Es una capa entera encima de otro framework, con su propio vocabulario | Cero alternativas dentro de Node: salir de él es cambiar de modelo |
| [React](../../../atlas/fichas/react.md) | Una sola responsabilidad: la interfaz como función del estado | No arranca nada; todo lo demás lo eliges y lo mantienes tú | Un ecosistema de decisiones que el equipo tiene que tomar y revisar |
| [Next.js](../../../atlas/fichas/nextjs.md) | Cierra esas decisiones: rutas, renderizado en servidor y construcción | Lo cierra con SUS convenciones, y algunas atan a una plataforma concreta | El acoplamiento: es la dimensión que el módulo 11 obliga a puntuar |
| [Prisma ORM](../../../atlas/fichas/prisma.md) | Esquema propio del que sale un cliente tipado exacto | Un lenguaje más que aprender, fuera del lenguaje del proyecto | Un generador en la tubería de construcción y un archivo que hay que mantener |

## 🧭 Lo que este contrato no puede probar

Conviene decirlo, porque la clase verifica de verdad y hay cosas que no verifica:

- **Que la clasificación sea la única posible.** `ui-library` frente a
  `ui-framework` separa React de Vue por quién posee el ciclo de render, y es una
  línea defendible — no la única. Un catálogo que priorizara el tamaño del
  ecosistema las pondría juntas.
- **Que el catálogo esté completo.** Son 138 tecnologías elegidas, no todas las
  que existen. Que algo falte no significa que no cuente.
- **Que las categorías no cambien.** Un framework puede crecer hasta otra
  casilla: Next.js empezó cerca de un generador de sitios estáticos y hoy es otra
  cosa. La fecha de verificación del catálogo está en cada respuesta por eso.

Lo que sí prueba, y no es poco: **que las afirmaciones de la clase coinciden con
los datos del repositorio**, y que dejarán de coincidir en cuanto alguien cambie
uno de los dos sin mirar el otro.

## 💡 Lo que hay que llevarse

Clasificar no es un ejercicio de bibliotecario. Es lo que decide **si una
comparación significa algo**.

La mayoría de las discusiones sobre frameworks que no llevan a ninguna parte
tienen la misma forma: dos personas comparando piezas de categorías distintas,
cada una con razón dentro de la suya. «React vs Next.js», «Express vs NestJS»,
«Prisma vs SQL» — en los tres casos la pregunta está mal hecha, y ninguna
respuesta la arregla.

Richards y Ford lo dicen para arquitectura y vale igual aquí: **en ingeniería no
hay mejores prácticas, hay compromisos**, y un compromiso solo se puede evaluar
entre opciones que resuelven el mismo problema [@richards-ford-fundamentals].

Y la segunda mitad, que es la que casi nunca se hace: **contar cuántas
alternativas reales tienes**. Es un número, se puede calcular hoy, y en la
casilla donde da cero conviene pensarlo dos veces antes de que sea tarde.

## Fuentes

- [@richards-ford-fundamentals] Richards, M.; Ford, N. *Fundamentals of Software Architecture: An Engineering Approach*. O'Reilly Media, 2020. ISBN 9781492043454 — <https://openlibrary.org/isbn/9781492043454>
- [@react-why] Hunt, Pete. *Why did we build React?*. Meta — <https://legacy.reactjs.org/blog/2013/06/05/why-react.html>
- [@nextjs-app-router] *Next.js App Router*. Vercel — <https://nextjs.org/docs/app>
