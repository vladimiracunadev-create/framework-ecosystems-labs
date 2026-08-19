# Rúbricas de evaluación

Las rúbricas se publican **antes** de empezar, no al corregir. Una rúbrica que el
estudiante no conoce no puede orientar su trabajo, y la retroalimentación que
llega sin criterio previo rara vez cambia el desempeño
[@evans-assessment-feedback].

Cada nivel describe una conducta observable. Si dos evaluadores no pueden llegar
al mismo nivel leyendo la misma entrega, el descriptor está mal escrito.

## Escala común

| Nivel | Nombre | Qué significa |
| --- | --- | --- |
| 1 | Inicial | Reconoce el concepto; no lo aplica sin ayuda |
| 2 | Funcional | Lo aplica en el caso previsto; falla al cambiar el contexto |
| 3 | Sólido | Lo aplica en contextos nuevos y justifica sus decisiones |
| 4 | Profesional | Anticipa consecuencias, declara límites y detecta errores ajenos |

La progresión de la escala sigue la de la taxonomía revisada: aplicar, analizar,
evaluar [@anderson-krathwohl-taxonomy]. El salto de 2 a 3 es siempre el mismo:
**transferir a un contexto que no se practicó**.

## Rúbrica del proyecto final

Aprobación: **80/100**, con mínimo **nivel 3** en contrato, seguridad y pruebas.

| Dimensión | Peso | Nivel 2 — funcional | Nivel 3 — sólido | Nivel 4 — profesional |
| --- | ---: | --- | --- | --- |
| Requisitos y producto | 8 | Lista funcionalidades | Atributos de calidad medibles derivados del producto | Escenarios verificados en integración continua |
| Contrato | 10 | Documenta lo implementado | Se escribe antes; las pruebas derivan de él | Evolución sin ruptura, con plan de retirada |
| Arquitectura | 10 | Separa carpetas | Dependencias dirigidas al dominio, probado sin servidor | Función de aptitud que impide la erosión |
| Implementación idiomática | 10 | Sigue tutoriales | Usa las fortalezas del ecosistema sin acoplar el dominio | Justifica cada uso de una escotilla del framework |
| Persistencia y consistencia | 8 | Guarda y recupera | Invariantes probadas bajo concurrencia | Migraciones reversibles sobre datos reales |
| Seguridad | 12 | Autenticación funciona | Autorización por recurso, probada en camino negativo | Modelo de amenazas con riesgos aceptados por escrito |
| Accesibilidad | 8 | Etiquetas presentes | Teclado, foco, nombre y anuncio verificados | Patrón publicado aplicado y probado con lector de pantalla |
| Pruebas | 12 | Camino feliz | Pirámide justificada, suite rápida y estable | Fallan al retirar un control; sin intermitencia |
| Operación | 10 | Se despliega | Telemetría correlacionada y vuelta atrás ensayada | Presupuesto de error con consecuencia declarada |
| Comparación y decisión | 8 | Compara funcionalidades | Protocolo reproducible y registro de decisión | Declara lo que refutaría su propia conclusión |
| Comunicación | 4 | Explica qué hizo | Un tercero reproduce el resultado con el `README` | Defiende alternativas y consecuencias sin guion |

## Rúbrica transversal de honestidad técnica

Se aplica a **toda** entrega del programa y puede rebajar por sí sola el
resultado final.

| Conducta | Nivel 1 | Nivel 3 | Nivel 4 |
| --- | --- | --- | --- |
| Distinguir medido de supuesto | Presenta ambos como iguales | Etiqueta cada afirmación | Publica el protocolo para que otro lo refute |
| Declarar límites | No los menciona | Documento de límites explícito | Anticipa en qué contexto su conclusión deja de valer |
| Citar fuentes | Sin fuente o de oídas | Fuente oficial con fecha | Contrasta la fuente con evidencia del historial |
| Reconocer el error | Lo oculta o lo minimiza | Lo declara y corrige | Lo convierte en una prueba que evita repetirlo |

## Faltas críticas

Cualquiera de estas suspende la entrega, con independencia de la puntuación:

- secretos, credenciales o datos personales reales en el repositorio o en su
  historial;
- contrato o prueba de aceptación alterados para ocultar un fallo;
- cifra de rendimiento presentada sin protocolo, o inventada;
- autorización probada solo en el camino feliz;
- afirmación atribuida a una fuente que no la sostiene;
- proyecto que no puede ejecutarse siguiendo su propia documentación.

La quinta es específica de este programa: **una cita que no dice lo que se le
atribuye es peor que no citar**, porque simula respaldo donde no lo hay.

## Cómo se entrega la retroalimentación

1. **Primero el criterio**, señalando el descriptor exacto de la rúbrica.
2. **Después la distancia**: qué hay en la entrega y qué falta para el nivel
   siguiente.
3. **Por último la acción**: una sola cosa que produciría el mayor avance.
4. **Con oportunidad de reenvío**: ningún módulo se cierra en un intento.

Los cuatro pasos importan en ese orden: la retroalimentación que empieza por la
corrección concreta, sin situar el criterio, se aplica sin comprenderse
[@evans-assessment-feedback].

## Autoevaluación antes de entregar

Responde de memoria, sin releer tu propio código
[@roediger-karpicke-test-enhanced]:

1. ¿Qué decisión de mi entrega es la más difícil de defender y por qué?
2. ¿Qué medí y qué supuse?
3. ¿Qué prueba de las mías falla si retiro un control de seguridad?
4. ¿Qué parte no llevaría a producción tal como está?
5. ¿Qué fuente sostiene mi afirmación más fuerte?

## Fuentes

- [@evans-assessment-feedback] Evans, Carol. *Making Sense of Assessment Feedback in Higher Education*. Review of Educational Research, vol. 83, pp. 70-120, 2013. DOI 10.3102/0034654312474350 — <https://doi.org/10.3102/0034654312474350>
- [@anderson-krathwohl-taxonomy] Anderson, Lorin W.; Krathwohl, David R. *A Taxonomy for Learning, Teaching, and Assessing*. Longman, 2001. ISBN 9780321084057 — <https://openlibrary.org/isbn/9780321084057>
- [@roediger-karpicke-test-enhanced] Roediger, Henry L.; Karpicke, Jeffrey D. *Test-Enhanced Learning*. Psychological Science, vol. 17, pp. 249-255, 2006. DOI 10.1111/j.1467-9280.2006.01693.x — <https://doi.org/10.1111/j.1467-9280.2006.01693.x>
