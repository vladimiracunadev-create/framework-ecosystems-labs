# Por qué sí y por qué no — Repositorio y dominio

> [⬅️ Clase 064](README.md) · [📚 Parte 4](../README.md)

| ORM | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Prisma](../../../atlas/fichas/prisma.md) | Sus objetos son planos: traducirlos a entidades es directo | Sin inyección de dependencias propia, el cableado es manual | Un archivo que conoce las dos partes |
| [SQLAlchemy](../../../atlas/fichas/sqlalchemy.md) | Un `Protocol` describe el repositorio sin herencia | Y no lo comprueba nadie en tiempo de ejecución | Confiar en el verificador de tipos |
| [Hibernate](../../../atlas/fichas/hibernate.md) | Spring inyecta la interfaz sin fontanería | Dos modelos de objetos vivos a la vez, y es fácil confundirlos | Nombres claros o problemas |
| [Entity Framework Core](../../../atlas/fichas/entity-framework-core.md) | `AddScoped<IRepositorio, …>`: cambiar de repositorio es una palabra | El seguimiento de cambios no ayuda cuando el objeto que traduces no es el que rastrea | Guardar a mano lo que antes era automático |

## 🧭 Lo que se pierde al separar

Conviene decirlo, porque casi nadie lo menciona: **el seguimiento de cambios deja
de trabajar para ti**.

En la clase 053, `tarea.hecha = true` seguido de `save()` bastaba: el ORM sabía
qué había cambiado. Aquí el objeto modificado es del dominio, el ORM no lo
conoce, y `guardar(proyecto)` tiene que **recorrer las tareas y decidir cuáles
son nuevas y cuáles cambiaron**.

Eso es código que antes no escribías, y es la parte más aburrida del patrón. Con
agregados grandes hay dos salidas conocidas: guardar el agregado entero cada vez
—simple y caro— o llevar la cuenta de lo que cambió —eficiente y más código.

Ninguna es gratis, y ninguna aparece en los diagramas.

## 🧭 Cuándo NO hacer esto

- **Si el dominio no tiene reglas.** Con cuatro campos y ningún invariante, la
  clase 053 es más corta y no esconde nada.
- **Si el equipo no comparte el vocabulario.** Este patrón vive de que los
  nombres del código sean los del negocio. Sin eso, son dos capas de traducción
  entre dos modelos igual de técnicos.
- **Para las consultas de lectura.** Un informe no necesita agregados: necesita
  la consulta de la clase 060.

Ese último punto es importante y se olvida: **escribir y leer no tienen por qué
usar el mismo modelo**. Las reglas viven en el agregado; las pantallas suelen
vivir mejor con una consulta directa.

## 💡 Lo que hay que llevarse

La pregunta no es «¿uso repositorio?». Es:

> **¿Puedo comprobar esta regla sin arrancar nada?**

Si la respuesta es sí, la dependencia apunta en la dirección correcta: el dominio
no sabe nada del almacenamiento, y el almacenamiento se adapta al dominio. Martin
lo formula como la regla de dependencia — **lo estable no puede depender de lo
volátil** [@martin-clean-architecture], y en cualquier sistema con años por
delante lo volátil es siempre cómo se guardan las cosas.

Y si la respuesta es no, ninguna carpeta llamada `repositorios/` lo arregla.

## Fuentes

- [@evans-ddd] Evans, Eric. *Domain-Driven Design*. Addison-Wesley, 2003. ISBN 9780321125217 — <https://openlibrary.org/isbn/9780321125217>
- [@martin-clean-architecture] Martin, Robert C. *Clean Architecture*. Prentice Hall, 2017. ISBN 9780134494166 — <https://openlibrary.org/isbn/9780134494166>
