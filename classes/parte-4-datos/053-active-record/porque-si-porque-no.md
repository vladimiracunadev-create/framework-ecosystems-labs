# Por qué sí y por qué no — Active Record

> [⬅️ Clase 053](README.md) · [📚 Parte 4](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Active Record de Rails](../../../atlas/fichas/rails.md) | El patrón llevado al extremo: `save` valida siempre | Callbacks encadenados y modelos que engordan sin freno | Depurar cascadas invisibles |
| [Eloquent](../../../atlas/fichas/laravel.md) | Sintaxis muy corta y un constructor de consultas excelente | No valida al guardar: hay que colgarlo de un evento | Recordar el paso extra en cada camino |
| [ORM de Django](../../../atlas/fichas/django.md) | Migraciones, administración y consultas en una pieza | `save()` escribe lo que le des; validar es aparte | El mismo olvido, con otro nombre |
| [TypeORM](../../../atlas/fichas/typeorm.md) | Ofrece los dos patrones y deja elegir | Sin validación de ninguna clase | Escribirla tú |

## 🧭 Cuándo es la respuesta correcta

**Sí**, cuando las tablas y los conceptos coinciden. Un CRUD administrativo, un
panel interno, una aplicación cuyo dominio *es* su esquema: Active Record es más
corto y no hay ninguna ventaja en complicarlo.

**Sí**, cuando el equipo es pequeño y la velocidad importa más que la estructura.

**No**, cuando las reglas de negocio son el producto. El modelo se convierte en
el sitio donde cabe todo, y sacar la lógica después cuesta más que haberla puesto
fuera desde el principio.

**No**, cuando probar rápido importa. El objeto no existe sin su tabla.

## 💡 Lo que hay que llevarse

El acoplamiento de Active Record no es un defecto: es **la propuesta**. Une el
objeto a la fila a propósito, y de esa unión sale toda su brevedad.

Martin lo plantea como una cuestión de dirección de dependencias: cuando la
lógica de negocio depende de la persistencia, el detalle más volátil del sistema
—cómo se guardan las cosas— acaba mandando sobre la parte más estable
[@martin-clean-architecture].

Eso es un problema real **cuando hay lógica de negocio que proteger**. Cuando no
la hay —y en muchísimas aplicaciones no la hay— es un coste que se paga por nada.

La pregunta útil no es cuál es mejor, sino: **¿mi dominio tiene reglas que
sobrevivirían a un cambio de base de datos?** Si la respuesta es no, esta clase
tiene tu patrón; si es sí, la 054.

## Fuentes

- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@martin-clean-architecture] Martin, Robert C. *Clean Architecture*. Prentice Hall, 2017. ISBN 9780134494166 — <https://openlibrary.org/isbn/9780134494166>
