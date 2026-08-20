# Por qué sí y por qué no — Idempotencia

> [⬅️ Clase 047](README.md) · [📚 Parte 3](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) | `computeIfAbsent` sobre un mapa concurrente: **atómico sin pensarlo** | Sigue siendo estado por proceso | Un almacén compartido para que la garantía sea real |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) | `GetOrAdd` con la misma propiedad | Igual | Igual |
| [FastAPI](../../../atlas/fichas/fastapi.md) | El bucle de eventos evita la carrera **dentro de un proceso** | Esa protección desaparece con varios trabajadores | Falsa sensación de seguridad al probar en local |
| [Express](../../../atlas/fichas/express.md) | Un solo hilo, mismo efecto | Igual | Igual |

## 🧭 La trampa de los dos de abajo

Node y Python de un solo hilo **no tienen carrera dentro del proceso**: entre el
`if` y el `set` no se ejecuta otra petición.

Eso hace que la versión ingenua —comprobar y luego escribir— funcione
perfectamente en desarrollo, pase las pruebas, y **falle en producción** en cuanto
hay más de un trabajador. Que es siempre.

Los dos de arriba obligan a usar una operación atómica porque el lenguaje asume
concurrencia. Es más ruidoso y no permite escribir la versión rota sin darse
cuenta.

## 🔒 Dónde va de verdad la clave

En una base de datos, con **una restricción de unicidad**:

```sql
CREATE UNIQUE INDEX ON idempotencia (clave);
```

El segundo intento falla al insertar, se captura ese fallo y se devuelve la
respuesta guardada. **La atomicidad la garantiza el motor**, que es el único
componente que la puede garantizar entre varias instancias.

Todo lo demás —mapa en memoria, caché sin transacción, comprobar antes de
escribir— tiene el mismo hueco con distinta forma. Kleppmann lo trata como el
caso canónico de por qué las garantías de unicidad tienen que estar donde está el
dato [@kleppmann-ddia].

## 💡 Y la alternativa que evita todo esto

**Hacer la operación idempotente por diseño.**

`PUT /tareas/{id}` con el identificador generado por el cliente no necesita
claves, ni almacén, ni caducidad: repetirlo escribe lo mismo. La clase 014 lo
explica, y cuando el diseño lo permite es siempre la respuesta mejor.

La clave de idempotencia es para lo que **no se puede** hacer idempotente: crear
algo cuyo identificador decide el servidor, cobrar, enviar. Ahí no hay atajo.

## Fuentes

- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
