# Por qué sí y por qué no — Tiempos de espera

> [⬅️ Clase 032](README.md) · [📚 Parte 2](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [FastAPI](../../../atlas/fichas/fastapi.md) | `wait_for` **cancela** de verdad: el trabajo deja de consumir recursos | Un `await` bloqueante dentro no se cancela: congela el bucle | Disciplina con el código síncrono |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | Testigo de cancelación explícito, con política declarada aparte | Cooperativo: si nadie lo mira, no cancela nada | Propagar el testigo por todo el código |
| [Express](../../../atlas/fichas/express.md) | Sencillo de entender y aplicar a todo | **No cancela**: solo responde antes | El trabajo lento sigue gastando, y hay que limpiar el temporizador |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Plazo por configuración, sin ensuciar el manejador | **Solo aplica a manejadores asíncronos** | Reescribir el manejador para que el plazo exista |

## 🧭 Dejar de esperar no es cancelar

Es la distinción que ordena la tabla, y tiene consecuencias medibles.

**Express responde 504 y el manejador sigue.** La consulta pesada sigue en la base
de datos, el archivo se sigue leyendo, la llamada saliente sigue abierta. Si la
lentitud viene de saturación, **responder antes no la alivia**: el trabajo
acumulado sigue creciendo.

**FastAPI cancela.** El trabajo se detiene, los recursos se liberan, y el sistema
tiene una oportunidad real de recuperarse.

**ASP.NET Core lo deja claro:** te da el testigo y te obliga a propagarlo. Es más
trabajo y es honesto — cancelar de verdad requiere que el código colabore, y
fingir lo contrario es peor.

## ⚠️ La limitación de Spring, sin rodeos

El plazo **no aplica a manejadores síncronos**. No es un descuido: en el modelo de
un hilo por petición, un hilo bloqueado en entrada/salida no se puede interrumpir
sin riesgo de dejar estado a medias.

La consecuencia práctica: en un proyecto Spring típico, con controladores
síncronos, **el plazo de esta clase no existe**. La protección real viene de
otros sitios —plazos de la base de datos, del cliente HTTP, del servidor de
entrada— y conviene saberlo antes de creerse cubierto.

Es la manifestación más clara del compromiso que el
[módulo 02](../../../curriculum/02-arquitectura-de-frameworks.md) compara: el
modelo de un hilo por petición es más simple de programar y más rígido de
controlar.

## 💡 El plazo que importa más que este

El de esta clase protege de **tus** manejadores lentos. El que evita las cascadas
es el de **cada llamada saliente**: base de datos, otros servicios, colas.

Sin ese, cortas la respuesta y la llamada de abajo sigue ocupando su conexión —así
que el recurso escaso no se libera y la cascada ocurre igual. Es la lección
central de Nygard [@nygard-release-it]: los plazos protegen en el punto donde se
espera, no donde se responde.

## Fuentes

- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
