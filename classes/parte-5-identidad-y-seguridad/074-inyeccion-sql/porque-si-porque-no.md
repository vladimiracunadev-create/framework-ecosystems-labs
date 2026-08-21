# Por qué sí y por qué no — Inyección SQL

> [⬅️ Clase 074](README.md) · [📚 Parte 5](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Prisma](../../../atlas/fichas/prisma.md) | La API de objetos no tiene forma de concatenar: seguro por construcción | Para lo que el `where` no cubre hay que bajar a `$queryRawUnsafe`, y el nombre no siempre frena | Perder expresividad o cruzar a la puerta cruda con cuidado |
| [SQLAlchemy Core](../../../atlas/fichas/sqlalchemy.md) | Enseña el SQL y aún así es seguro: el marcador mantiene el valor fuera del texto | Justo por ver el SQL, un f-string parece igual de válido y no lo es | La disciplina de no interpolar lo que se puede vincular |
| [Hibernate](../../../atlas/fichas/hibernate.md) | Las consultas derivadas (`findByTitulo`) generan parámetros sin escribir SQL | JPQL y `createNativeQuery` permiten concatenar, y la costumbre de «una nativa rápida» reabre el hueco | Vigilar las consultas nativas como excepción, no como norma |
| [Entity Framework Core](../../../atlas/fichas/entity-framework-core.md) | LINQ es C#, no una cadena: el compilador está entre la entrada y el SQL | `FromSqlRaw` con interpolación de cadena concatena; solo `FromSql` (interpolada) parametriza | Conocer cuál de los dos métodos parametriza, porque se parecen |

## 🧭 El hallazgo

La inyección SQL fue el riesgo n.º 1 de OWASP durante más de una década y hoy
es raro encontrarla en código nuevo. No porque los programadores mejoraran,
sino porque **la herramienta por omisión cambió**: la generación de
`mysql_query("… " + $_GET['x'])` dio paso a ORMs cuya API de objetos no tiene
dónde concatenar. La defensa se movió del programador a la herramienta —el
mismo movimiento que el escapado por omisión de la clase 073.

Por eso la inyección de 2026 casi nunca entra por la puerta principal, sino
por las traseras: la consulta nativa «rápida», el `ORDER BY` dinámico que no
se puede parametrizar, el informe con SQL construido a mano. El ORM protege
su camino feliz; el agujero vive en los desvíos [@owasp-cheatsheets].

## ⚖️ Y por qué SQLAlchemy Core sigue en el elenco

Podría parecer el eslabón débil —enseña el SQL— y es justo lo contrario: es
la prueba de que **ver el SQL no es el problema**. Un marcador `:titulo` en
una consulta escrita a mano es tan seguro como el `where` de Prisma, porque
la seguridad no está en esconder el SQL sino en mantener el valor fuera de
él. Quitarlo del elenco habría sugerido que escribir SQL es inseguro por
naturaleza, y esa es exactamente la confusión que la clase deshace.

## Fuentes

- [@owasp-top10] *OWASP Top 10* (A03: Injection). OWASP — <https://owasp.org/www-project-top-ten/>
- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (SQL Injection Prevention). OWASP — <https://cheatsheetseries.owasp.org/>
