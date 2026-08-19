# Diagnóstico inicial

Este cuestionario no puntúa: **sitúa**. Su función es decidir por dónde empiezas
y qué puedes saltarte. Respóndelo antes de leer ningún módulo y sin consultar
nada; una respuesta buscada no informa de tu punto de partida.

El propio acto de intentar responder lo que aún no sabes mejora el aprendizaje
posterior de ese material [@brown-make-it-stick]. Fallar aquí es parte del
método, no un mal resultado.

## Parte A — Conceptos (10 preguntas)

Responde en dos o tres frases. Marca con «no lo sé» lo que no sepas: es
información útil y no resta.

| # | Pregunta | Módulo que la cubre |
| --- | --- | --- |
| 1 | ¿Qué distingue una biblioteca de un framework? No respondas por tamaño | 00 |
| 2 | ¿Qué significa inversión de control y quién invierte qué? | 02 |
| 3 | ¿Qué responsabilidad tiene un runtime que no tiene un framework? | 00 |
| 4 | ¿Qué diferencia hay entre «segura» e «idempotente» en un método HTTP? | 01 |
| 5 | ¿Cuándo se responde 422 y no 400? | 01 |
| 6 | ¿Qué comprueba una prueba de contrato que no comprueba una unitaria? | 08 |
| 7 | ¿Por qué autenticar no basta para dejar ver un recurso concreto? | 07 |
| 8 | ¿Qué ocurre al reintentar una operación no idempotente? | 01, 09 |
| 9 | ¿Cuándo existe el HTML en renderizado de cliente y en el de servidor? | 04 |
| 10 | ¿Por qué una reescritura completa es más arriesgada que una migración incremental? | 10 |

## Parte B — Práctica (una hora)

Diseña `POST /tasks` **en papel o pseudocódigo**, sin abrir un editor. Debe
incluir:

1. la forma exacta de la entrada y de la respuesta correcta;
2. el código de estado de al menos tres situaciones de error, con su motivo;
3. la validación, campo por campo, con el error que produce cada fallo;
4. qué pasa si el mismo mensaje llega dos veces;
5. una prueba que falle si eliminas la validación.

El punto 5 es el que discrimina: escribir una prueba que **falle** al retirar el
control requiere entender qué protege ese control.

## Parte C — Autoevaluación de contexto

No hay respuestas correctas; orientan el ritmo, no la ruta.

1. ¿Cuántos ecosistemas distintos has usado en producción?
2. ¿Has migrado alguna vez un sistema en funcionamiento? ¿Cómo terminó?
3. ¿Has medido el rendimiento de algo tú mismo, con un protocolo?
4. ¿Has verificado alguna vez una interfaz con lector de pantalla?
5. ¿Cuántas horas semanales puedes dedicar de forma sostenida?

La quinta importa más de lo que parece: el programa está diseñado para
**sesiones distribuidas**. La misma cantidad de horas repartida en más días
produce mejor retención que concentrarlas [@dunlosky-effective-techniques].

## Orientación de entrada

| Aciertos en la parte A | Parte B | Por dónde empezar |
| --- | --- | --- |
| 0–3 | Incompleta | Módulos 00 y 01 completos, sin saltarse la referencia sin framework |
| 4–6 | Puntos 1–3 | Módulo 00 en lectura rápida; 01 y 02 con práctica guiada |
| 7–8 | Puntos 1–4 | Prueba de transferencia de la ruta elegida; entra por el 03 o el 05 |
| 9–10 | Los cinco puntos | Ruta avanzada desde el 05, sin omitir 07 ni 08 |

Independientemente del resultado, **los módulos 07 (seguridad) y 08 (calidad y
operación) no se saltan**. Son las áreas donde la experiencia previa produce con
más frecuencia una confianza que no se corresponde con la práctica actual.

## Repetición del diagnóstico

Vuelve a responder la parte A —de memoria, sin mirar— al terminar el módulo 06 y
otra vez al terminar el 11. Comparar tus tres respuestas a la misma pregunta es
la mejor evidencia de progreso que produce este programa, y el propio acto de
recuperarlas consolida lo aprendido [@roediger-karpicke-test-enhanced].

## Fuentes

- [@brown-make-it-stick] Brown, Peter C.; Roediger, Henry L.; McDaniel, Mark A. *Make It Stick: The Science of Successful Learning*. Belknap Press of Harvard University Press, 2014. ISBN 9780674729018 — <https://openlibrary.org/isbn/9780674729018>
- [@dunlosky-effective-techniques] Dunlosky, John et al. *Improving Students' Learning With Effective Learning Techniques*. Psychological Science in the Public Interest, vol. 14, pp. 4-58, 2013. DOI 10.1177/1529100612453266 — <https://doi.org/10.1177/1529100612453266>
- [@roediger-karpicke-test-enhanced] Roediger, Henry L.; Karpicke, Jeffrey D. *Test-Enhanced Learning*. Psychological Science, vol. 17, pp. 249-255, 2006. DOI 10.1111/j.1467-9280.2006.01693.x — <https://doi.org/10.1111/j.1467-9280.2006.01693.x>
