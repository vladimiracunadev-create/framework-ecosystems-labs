# Por qué sí y por qué no — Ciclo de vida de los objetos

> [⬅️ Clase 037](README.md) · [📚 Parte 2](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | **Detecta dependencias cautivas** y falla al arrancar, no en producción | Hay que declarar el ámbito siempre: no hay valor por omisión | Una decisión explícita por cada registro |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | El proxy permite que lo de vida larga dependa de lo de vida corta | Ese proxy es invisible: cuando falla, el error es desconcertante | Entender un mecanismo que normalmente no se ve |
| [NestJS](../../../atlas/fichas/nestjs.md) | Ámbito declarado en el decorador, junto a la clase | El ámbito por petición **se propaga hacia arriba** sin avisar | Un servicio por petición vuelve por petición a todo lo que lo use |
| [Laravel](../../../atlas/fichas/laravel.md) | `singleton` y `bind` son explícitos y cortos | El modelo de proceso por petición de PHP **oculta el riesgo** en desarrollo | Un fallo que solo aparece con un gestor de procesos persistente |

## 🧭 El valor por omisión es el arriesgado

En tres de los cuatro, lo que sale por omisión —o lo que todo el mundo escribe—
es **única instancia**. Es lo barato, y es justo el ámbito que comparte estado
entre peticiones.

Eso convierte esta clase en una de las pocas donde **la recomendación es concreta
y no depende del contexto**:

> Un objeto de única instancia debe ser **sin estado**. Si necesita recordar algo
> de la petición en curso, su ámbito está mal.

## 🔒 Por qué es un problema de seguridad y no de corrección

El síntoma habitual no es un error: es **que un usuario ve datos de otro**.

No se cae nada, no hay excepción, no salta ninguna alarma. La respuesta es válida
—bien formada, con su 200— y contiene información equivocada. Puede pasar meses
sin que nadie lo note, y cuando se nota, no hay registro que lo demuestre porque
nunca hubo error.

OWASP lo sitúa entre los fallos de control de acceso [@owasp-top10] por su
consecuencia, no por su causa. Y explica por qué **ASP.NET Core detectándolo al
arrancar** es más valioso de lo que parece: convierte un fallo silencioso de
producción en uno ruidoso de desarrollo, que es el intercambio correcto.

## ⚠️ Y la trampa que solo tiene PHP

En Laravel, con el servidor de desarrollo, «única instancia» **dura una
petición**, porque cada petición es un proceso nuevo. El fallo de estado
compartido **no se puede reproducir en desarrollo**.

Con un gestor de procesos persistente o un servidor de aplicación moderno de PHP,
el proceso sobrevive y el riesgo vuelve — con el código sin cambiar.

Es el peor escenario posible para aprender: **el entorno donde pruebas te oculta
el fallo que el entorno donde despliegas va a tener**. Saberlo es la única
defensa.

## Fuentes

- [@owasp-top10] *OWASP Top 10*, OWASP Foundation — <https://owasp.org/www-project-top-ten/>
