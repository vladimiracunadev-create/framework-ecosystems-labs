# Por qué sí y por qué no — El método de esta obra

> [⬅️ Clase 010](README.md) · [📚 Parte 0](../README.md)

El elenco de esta clase son dos, y están por lo mismo: son las dos cadenas de
herramientas que casi todo el mundo tiene ya instaladas.

| | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) | Node.js hace falta para ejecutar el propio verificador: quien pueda correr una clase, puede correr esta | Su biblioteca estándar es más verbosa para leer directorios | Cinco líneas donde Python usa una |
| [FastAPI](../../../atlas/fichas/fastapi.md) | Python está en casi todas las máquinas y `pathlib` hace el recorrido de archivos casi invisible | Necesita instalar dos paquetes antes de arrancar | Un entorno más que preparar para una clase que no enseña Python |

## 🧭 Lo que este método no puede probar

Esta sección es la que más importa de toda la clase, porque describe los límites
del repositorio entero.

- **Que una implementación esté bien escrita.** El contrato comprueba
  comportamiento observable. Un código horrible que responda lo correcto pasa
  igual, y por eso existen el README con el código a la vista y la comparación:
  para que alguien lo lea.
- **Que un framework sea buena idea para tu proyecto.** El verde dice «cumple
  este contrato», no «elígelo». La decisión vive en `porque-si-porque-no.md`, y
  es prosa argumentada, no una medición.
- **Que el contrato cubra el problema.** Cinco casos son cinco casos. Lo que no
  se preguntó no se sabe, y por eso cada clase declara explícitamente qué se
  quedó fuera.
- **Que lo omitido funcione.** Un `⊘` no es una promesa: es la ausencia de
  información. Solo el barrido completo con todas las cadenas instaladas —
  `classes-full.yml`, semanal— convierte esos huecos en respuestas.
- **Que el repositorio esté al día.** Las versiones caducan. Por eso cada dato
  que puede envejecer se genera de su fuente en lugar de escribirse: el catálogo,
  las fichas, las tablas de cadenas, la bibliografía. Lo que se escribe a mano es
  el juicio, que envejece mucho más despacio.

## 💡 Lo que hay que llevarse

El método completo cabe en cuatro frases:

1. **El contrato va primero.** Escribirlo después de la primera implementación lo
   convierte en una descripción, y una descripción no compara nada.
2. **No hay adaptadores.** Todas las implementaciones reciben las mismas
   peticiones por el mismo protocolo. Si algo hay que traducir, la diferencia
   deja de ser del framework y pasa a ser del traductor.
3. **El verde dice lo que pasó y lo que no.** Verificada, con fallo, omitida —
   tres estados, nunca mezclados. Un resumen que sumara omitidas a verificadas
   sería más bonito y sería mentira.
4. **Lo que se puede generar, se genera.** Lo escrito a mano es lo que exige un
   juicio; todo lo demás sale de su fuente y se comprueba en cada entrega.

Meszaros lo dice de las pruebas y vale igual para las clases: una prueba que no
puede fallar no está probando nada [@meszaros-xunit]. La mitad del trabajo de
este repositorio consiste en asegurarse de que sus afirmaciones **pueden**
ponerse en rojo — el caso 2 de esta clase es literalmente eso: un lazo que se
rompe si alguien añade un caso sin mirar.

Y una nota sobre por qué la parte 0 va primero aunque no enseñe ningún
framework. Wiggins y McTighe llaman a esto diseñar hacia atrás: decidir qué debe
quedar cuando se olvide el detalle, y construir desde ahí [@wiggins-mctighe-ubd].
De las 149 clases, los frameworks concretos se olvidarán. **El criterio para
compararlos, no** — y es lo único que seguirá sirviendo cuando aparezcan los
frameworks que todavía no existen.

## Fuentes

- [@meszaros-xunit] Meszaros, Gerard. *xUnit Test Patterns: Refactoring Test Code*. Addison-Wesley, 2007. ISBN 9780131495050 — <https://openlibrary.org/isbn/9780131495050>
- [@wiggins-mctighe-ubd] Wiggins, G.; McTighe, J. *Understanding by Design*, 2.ª ed. ASCD, 2005. ISBN 9781416600350 — <https://openlibrary.org/isbn/9781416600350>
- [@ousterhout-philosophy] Ousterhout, John. *A Philosophy of Software Design*, 2.ª ed. Yaknyam Press, 2021. ISBN 9781732102217 — <https://openlibrary.org/isbn/9781732102217>
