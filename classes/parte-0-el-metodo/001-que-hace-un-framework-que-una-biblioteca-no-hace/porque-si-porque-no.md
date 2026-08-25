# Por qué sí y por qué no — Qué hace un framework que una biblioteca no hace

> [⬅️ Clase 001](README.md) · [📚 Parte 0](../README.md)

Esta clase no compara cuatro frameworks: compara **una biblioteca contra tres
frameworks**, y por eso su tabla se lee distinto. La pregunta no es «cuál es
mejor» sino «cuánto esqueleto quiero que venga puesto».

| Pieza | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Node.js `http`](../../../atlas/fichas/nodejs.md) | Cuando el proceso hace **una cosa** y quieres que todo lo que ocurre esté escrito en el archivo: un adaptador, un *webhook*, una sonda de salud, un contenedor de arranque rápido. Cero dependencias, cero superficie de suministro, cero versiones que seguir. | En cuanto aparecen la segunda y la tercera ruta. El `if` se convierte en un emparejador de rutas, y escribir un emparejador de rutas mediocre es peor que usar uno bueno. | **Todo lo que no escribas, no existe.** Y lo que escribas lo mantienes tú: el 404, la decodificación, los códigos de estado, los límites de tamaño del cuerpo (clase 033). |
| [Express](../../../atlas/fichas/express.md) | Cuando quieres el esqueleto mínimo que resuelve rutas y poco más, y prefieres elegir tú el resto —validación, ORM, sesiones—. Su API cabe en la cabeza en una tarde. | Cuando el equipo es grande o rota: Express **no impone estructura**, así que dos personas resuelven lo mismo de dos maneras y ninguna está mal. Y lo que no trae hay que traerlo, elegirlo y mantenerlo (clase 072: su middleware de CSRF está retirado). | Libertad a cambio de decisiones. Cada pieza que añades es una elección tuya que alguien tendrá que entender dentro de dos años. |
| [Flask](../../../atlas/fichas/flask.md) | El mismo trato que Express en el ecosistema de Python, con una comunidad que documenta muy bien la parte de «cómo se compone lo demás». Excelente para servicios pequeños y para aprender el mecanismo sin ruido. | Cuando necesitas el paquete completo —administración, ORM, autenticación, migraciones—: eso es Django, y componerlo a mano sobre Flask es rehacer Django peor. | El contexto de petición implícito. Es cómodo de escribir e incómodo de probar aislado, y hace más difícil razonar sobre concurrencia. |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | Cuando el sistema es grande, vive muchos años y lo tocan muchas manos. La autoconfiguración y el contenedor te dan una estructura que **no depende de la disciplina de cada persona**, y el ecosistema cubre desde la seguridad hasta la observabilidad con piezas que encajan entre sí. | Para un servicio de una ruta. Arrancar un contenedor de inversión de control completo, examinar el classpath y autoconfigurar para responder `hola` es desproporcionado — y el arranque en frío lo nota (clase 136). | **Cuando la autoconfiguración acierta, no escribes nada; cuando se equivoca, tienes que entender un mecanismo que hasta ese momento era invisible.** Ese es el trato exacto, y es bueno o malo según cuánto tiempo vayas a estar. |

## La pregunta que decide

No es «¿framework o biblioteca?». Es **¿cuántas de estas cinco cosas voy a
necesitar?**:

1. emparejar más de dos rutas,
2. leer y validar entradas,
3. componer comportamiento transversal (registro, autenticación, errores),
4. que varias personas escriban lo mismo de la misma manera,
5. que alguien mantenga esto cuando yo no esté.

Con una o dos, la biblioteca gana: menos dependencias y todo a la vista. Con
cuatro o cinco, escribir el framework a mano es escribir un framework peor —
y sin documentación, sin comunidad y sin avisos de seguridad.

## Lo que esta tabla no dice

No dice cuál es más rápido. La clase 007 explica por qué esa pregunta, tal
como suele hacerse, no tiene una respuesta que sirva para decidir.

Y no dice cuál es más popular. El número de descargas no responde a ninguna de
las cinco preguntas de arriba, y por eso no aparece en ninguna entrada de este
repositorio.
