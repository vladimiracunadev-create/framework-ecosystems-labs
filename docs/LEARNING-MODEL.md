# Modelo de aprendizaje

Este documento explica **por qué** el programa está construido como está. Cada
decisión pedagógica se apoya en una fuente de la
[bibliografía verificada](../sources/bibliography.json), igual que el contenido
técnico. Un programa que exige evidencia a sus afirmaciones técnicas y no a sus
decisiones didácticas es incoherente.

## Principio rector: alineamiento constructivo

Los objetivos, las actividades y la evaluación de cada módulo describen la misma
conducta. Si el objetivo dice «elegir un framework justificando el compromiso»,
la actividad tiene que ser elegir y justificar, y la evaluación tiene que
puntuar la justificación. Cuando estos tres elementos divergen, el estudiante
optimiza para el examen y no para el objetivo
[@biggs-constructive-alignment].

Por eso todos los módulos comparten la misma estructura de doce secciones, y las
secciones de objetivos, reto y criterios se leen en conjunto: si no se
corresponden, el módulo está mal escrito.

## Diseño inverso

Cada módulo se escribió en este orden [@wiggins-mctighe-ubd]:

1. ¿Qué evidencia aceptamos de que alguien lo aprendió? → *Criterios de
   evaluación*.
2. ¿Qué tiene que producir para generarla? → *Reto de transferencia*.
3. ¿Qué necesita saber y practicar antes? → *Concepto*, *Anatomía*,
   *Implementación*, *Pruebas*.

El orden inverso —contenido primero, evaluación al final— produce temarios que
cubren mucho y demuestran poco.

## Objetivos observables

Los objetivos se redactan con verbos de la taxonomía revisada —recordar,
comprender, aplicar, analizar, evaluar, crear— porque cada verbo implica un tipo
distinto de evidencia [@anderson-krathwohl-taxonomy]. «Conocer HTTP» no puede
evaluarse; «clasificar cinco métodos por sus tres propiedades» sí.

La progresión del programa sube por esa escala: los módulos 00 a 04 se concentran
en comprender y aplicar; del 05 al 10 en analizar; del 11 al 12 en evaluar y
crear.

## Cinco decisiones de diseño y su motivo

### 1. Concepto antes que API

Cada módulo abre con la parte que no depende del framework. La razón es de carga
cognitiva: aprender simultáneamente el concepto, su sintaxis y las convenciones
de una herramienta satura la memoria de trabajo y ninguna de las tres se
consolida [@sweller-1988-cognitive-load], [@sweller-cognitive-load-theory].

Al separar, el concepto se aprende una vez y se transfiere a cada ecosistema
nuevo; es la razón por la que el módulo 01 se implementa sin framework alguno.

### 2. Ejemplo resuelto y luego desvanecimiento

La sección *Implementación mínima* muestra el ejemplo completo y comentado; el
*Reto de transferencia* retira ese andamiaje y pide el mismo tipo de trabajo en
un contexto distinto. Para quien empieza, estudiar un ejemplo resuelto produce
más aprendizaje por unidad de tiempo que resolver el problema sin apoyo; el apoyo
debe retirarse a medida que crece la competencia
[@sweller-cognitive-load-theory].

### 3. Recuperación activa y repaso espaciado

Cada módulo termina con *Comprobación de recuerdo*: cinco preguntas que se
responden **de memoria**, antes de volver al texto. Recuperar lo aprendido
produce más retención a largo plazo que releerlo, incluso cuando releer se siente
más productivo [@roediger-karpicke-test-enhanced].

Cada bloque de preguntas indica además **cuándo repetirlas** en módulos
posteriores. La práctica distribuida y la práctica de recuperación son las dos
técnicas con mejor respaldo entre las habituales; subrayar y releer están entre
las de menor utilidad demostrada [@dunlosky-effective-techniques],
[@brown-make-it-stick].

### 4. Un problema real que se repite en contextos distintos

El programa entero gira sobre un solo contrato, TaskFlow, implementado en
ecosistemas distintos. Esa estructura sigue la secuencia de activar el
conocimiento previo, demostrar, aplicar e integrar sobre una tarea auténtica
completa, en vez de sobre ejercicios desconectados
[@merrill-first-principles].

Repetir el mismo problema en contextos variados es también lo que produce
transferencia: lo que se retiene es el patrón, no la sintaxis
[@brown-make-it-stick].

### 5. Práctica deliberada, no horas acumuladas

Los retos apuntan siempre al borde de la competencia actual y llevan un criterio
de terminado verificable. La mejora proviene de practicar en el límite con
retroalimentación inmediata y correctiva, no del tiempo dedicado
[@ericsson-peak]. Por eso las pruebas automáticas del repositorio importan
pedagógicamente: son retroalimentación que llega en segundos y no depende de que
haya alguien disponible para darla.

## Retroalimentación

La retroalimentación solo cambia el desempeño si el estudiante entiende el
criterio, reconoce la distancia respecto a él y tiene una oportunidad de actuar
sobre ella [@evans-assessment-feedback]. El programa lo implementa así:

| Elemento | Cómo se implementa aquí |
| --- | --- |
| Criterio explícito y previo | Rúbricas de cuatro niveles publicadas en cada módulo |
| Distancia visible | Pruebas compartidas que fallan y dicen qué falta |
| Oportunidad de actuar | Los retos se reenvían; ningún módulo se cierra en un intento |
| Retroalimentación por pares | La defensa del módulo 12 y la crítica de comparaciones ajenas |

La tutoría individual produce mejoras notables frente a la clase expositiva, y
buena parte del efecto proviene de que el estudiante habla, explica y recibe
respuesta sobre lo que dijo, más que del formato en sí
[@vanlehn-tutoring]. De ahí que los retos pidan justificar decisiones por escrito
y que el módulo 12 termine con una defensa oral.

## Rutas y ritmo

Las 180 horas se distribuyen en cuatro rutas descritas en
[`curriculum/README.md`](../curriculum/README.md). El ritmo recomendado es
**sesiones distribuidas**, no bloques intensivos: la misma cantidad de horas
repartida en más días produce más retención [@dunlosky-effective-techniques].

Recomendación operativa: dos sesiones semanales de dos horas, con la
*Comprobación de recuerdo* del módulo anterior al empezar cada una.

## Lo que este modelo no promete

- **No garantiza dominio profesional.** Completar el programa demuestra criterio
  y capacidad de comparar; la competencia profesional requiere operar sistemas
  reales durante meses.
- **No sustituye la retroalimentación humana.** Las pruebas automáticas verifican
  el contrato; no evalúan si una decisión de arquitectura es sensata para un
  contexto concreto.
- **No es neutral.** El programa privilegia explícitamente la comparación honesta
  y el diagnóstico sobre la velocidad de entrega inicial. Ese sesgo es
  deliberado y está declarado.

## Fuentes

- [@biggs-constructive-alignment] Biggs, John. *Enhancing teaching through constructive alignment*. Higher Education, vol. 32, pp. 347-364, 1996. DOI 10.1007/BF00138871 — <https://doi.org/10.1007/BF00138871>
- [@wiggins-mctighe-ubd] Wiggins, Grant; McTighe, Jay. *Understanding by Design*, 2.ª ed. ampliada. ASCD, 2005. ISBN 9781416600350 — <https://openlibrary.org/isbn/9781416600350>
- [@anderson-krathwohl-taxonomy] Anderson, Lorin W.; Krathwohl, David R. *A Taxonomy for Learning, Teaching, and Assessing*. Longman, 2001. ISBN 9780321084057 — <https://openlibrary.org/isbn/9780321084057>
- [@sweller-1988-cognitive-load] Sweller, John. *Cognitive Load During Problem Solving: Effects on Learning*. Cognitive Science, vol. 12, pp. 257-285, 1988. DOI 10.1207/s15516709cog1202_4 — <https://doi.org/10.1207/s15516709cog1202_4>
- [@sweller-cognitive-load-theory] Sweller, John; Ayres, Paul; Kalyuga, Slava. *Cognitive Load Theory*. Springer, 2011. ISBN 9781441981257 — <https://openlibrary.org/isbn/9781441981257>
- [@roediger-karpicke-test-enhanced] Roediger, Henry L.; Karpicke, Jeffrey D. *Test-Enhanced Learning*. Psychological Science, vol. 17, pp. 249-255, 2006. DOI 10.1111/j.1467-9280.2006.01693.x — <https://doi.org/10.1111/j.1467-9280.2006.01693.x>
- [@dunlosky-effective-techniques] Dunlosky, John et al. *Improving Students' Learning With Effective Learning Techniques*. Psychological Science in the Public Interest, vol. 14, pp. 4-58, 2013. DOI 10.1177/1529100612453266 — <https://doi.org/10.1177/1529100612453266>
- [@brown-make-it-stick] Brown, Peter C.; Roediger, Henry L.; McDaniel, Mark A. *Make It Stick: The Science of Successful Learning*. Belknap Press of Harvard University Press, 2014. ISBN 9780674729018 — <https://openlibrary.org/isbn/9780674729018>
- [@merrill-first-principles] Merrill, M. David. *First principles of instruction*. Educational Technology Research and Development, vol. 50, pp. 43-59, 2002. DOI 10.1007/BF02505024 — <https://doi.org/10.1007/BF02505024>
- [@ericsson-peak] Ericsson, Anders; Pool, Robert. *Peak: Secrets from the New Science of Expertise*. Houghton Mifflin Harcourt, 2016. ISBN 9780544456235 — <https://openlibrary.org/isbn/9780544456235>
- [@evans-assessment-feedback] Evans, Carol. *Making Sense of Assessment Feedback in Higher Education*. Review of Educational Research, vol. 83, pp. 70-120, 2013. DOI 10.3102/0034654312474350 — <https://doi.org/10.3102/0034654312474350>
- [@vanlehn-tutoring] VanLehn, Kurt. *The Relative Effectiveness of Human Tutoring, Intelligent Tutoring Systems, and Other Tutoring Systems*. Educational Psychologist, vol. 46, pp. 197-221, 2011. DOI 10.1080/00461520.2011.611369 — <https://doi.org/10.1080/00461520.2011.611369>
