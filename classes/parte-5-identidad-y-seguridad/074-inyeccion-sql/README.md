# Clase 074 — Inyección SQL

> [⬅️ 073](../073-xss-y-escapado/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [075 ➡️](../075-secretos-y-configuracion/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🟡 intermedio** · Pista **`datos`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Comprobar que la consulta parametrizada **lo es de verdad**. La inyección SQL
es la misma familia que el XSS de la clase 073 —datos que el sistema
interpreta como código— aplicada a la base [@owasp-top10]. La defensa también
es la misma en forma: **separar el código de los datos**, aquí con parámetros
vinculados en lugar de escapado.

## 🧩 La situación

Cuatro consultas con la entrada más famosa del oficio. El contrato no
pregunta «¿rechaza el ataque?» —eso invitaría a filtrar—, sino algo más
exacto: **la entrada maliciosa se guarda como texto y no se ejecuta**. La
tabla sobrevive, y el título vuelve carácter por carácter.

## 🧮 El contrato

| Petición | Respuesta | Qué mide |
| --- | --- | --- |
| `GET /tareas` | `total: 2` | el punto de partida |
| `GET /tareas?titulo=' OR '1'='1` | **`total: 0`** | el clásico no abre la tabla: se busca ese texto literal |
| `POST /tareas` con `'); DROP TABLE tareas; --` | `201` · el título **igual** | el intento de DROP se guarda como dato |
| `GET /tareas` | `total: 3` | **la tabla sigue viva** |
| `GET /tareas/{id}` de la bomba | el título **literal** | vuelve carácter por carácter |
| buscar ese título exacto | `total: 1` | se guardó tal cual, es encontrable |

El cuarto caso es la prueba que la clase existe para hacer: si la
parametrización fuera falsa, la tabla ya no estaría y este `GET` fallaría. Y
el segundo mide el matiz que separa parametrizar de escapar mal: `' OR
'1'='1` no devuelve `0` porque se haya *limpiado*, sino porque se busca **ese
texto** y ninguna tarea se llama así.

## 🌐 Las implementaciones

Las cuatro son ORMs o *query builders*, y comparten una propiedad que es el
hallazgo de la clase: **su API de consulta no acepta SQL como cadena**. No es
que parametricen bien — es que no ofrecen la puerta para hacerlo mal:

- **Prisma** — `findMany({ where: { titulo } })`. El `where` es un objeto,
  no texto; la concatenación no tiene por dónde entrar.
- **SQLAlchemy Core** — `text("… WHERE titulo = :titulo")` con `:titulo`
  como marcador. Es el nivel más bajo del elenco —SQL a la vista— y aun así
  el valor viaja aparte del texto.
- **Hibernate** (vía Spring Data JPA) — `findByTitulo(String)`: el método
  deriva un `WHERE titulo = ?` con parámetro vinculado. No se escribe SQL.
- **Entity Framework Core** — `Where(t => t.Titulo == titulo)`: LINQ traduce
  a SQL parametrizado. La expresión es C#, no una cadena.

Todos tienen **una puerta trasera** para SQL crudo —`$queryRawUnsafe`,
`text()` con f-strings, `createNativeQuery`, `FromSqlRaw`— y ahí sí se puede
concatenar la entrada y reabrir el agujero. El nombre de la de Prisma
—`Unsafe`— es la misma lección de la clase 073: la vía peligrosa lleva el
peligro en el nombre.

## 📊 Comparación

| Framework | La consulta segura | La puerta cruda | ¿SQL a la vista? |
| --- | --- | --- | --- |
| Prisma | `where: { titulo }` | `$queryRawUnsafe` | no |
| SQLAlchemy Core | `text(…)` + `:titulo` | `text(f"… {titulo}")` | **sí**, con marcadores |
| Hibernate/JPA | `findByTitulo(…)` | `createNativeQuery` concatenada | no |
| EF Core | `Where(t => t.Titulo == x)` | `FromSqlRaw($"… {x}")` | no |

SQLAlchemy Core es el caso interesante: enseña el SQL —no lo esconde como
los otros tres— y aun así es seguro, porque el marcador `:titulo` mantiene el
valor fuera del texto. Ver el SQL y ser vulnerable no son lo mismo; lo
peligroso no es escribir SQL, es **construirlo concatenando**.

## ⚠️ Errores frecuentes

- **Concatenar la entrada en la puerta cruda.** `$queryRawUnsafe("… " +
  titulo)` reabre todo. La puerta existe para SQL que tú controlas, no para
  interpolar entrada de usuario.
- **Escapar comillas a mano** en vez de parametrizar. Se olvida un caso —el
  Unicode, el `\`, el comentario— y la lista negra pierde. Parametrizar no
  es una lista negra: el valor no pasa por el analizador de SQL.
- **Parametrizar el valor pero no el nombre de la columna** en un `ORDER BY`
  dinámico. Los identificadores no se pueden vincular; se validan contra una
  lista blanca.
- **Confiar en el ORM y bajar a SQL crudo «solo para esta consulta rápida»**
  sin llevar el parámetro. Es donde reaparece el agujero en bases maduras.
- **Creer que un ORM protege por existir.** Protege su **API de objetos**;
  su puerta cruda concatenada es tan vulnerable como `mysql_query` de 2005.

## ✅ Verificación

```bash
node scripts/run-class.mjs 074
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta
las implementaciones que encuentre y declara las que omitió.

## 🧪 Reto de transferencia

Añade `GET /tareas/ordenar?por=titulo` con orden dinámico y **hazlo seguro
sin poder parametrizar**: el nombre de columna no se vincula. Implementa la
lista blanca (`por` solo puede ser `id` o `titulo`, cualquier otra cosa →
`400`) y añade al contrato el caso `por=titulo); DROP TABLE tareas; --` → 400
con la tabla intacta.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 052 — SQL a mano](../../parte-4-datos/052-sql-a-mano/README.md) —
  los marcadores, cuando el SQL lo escribes tú
- [Clase 073 — XSS y escapado](../073-xss-y-escapado/README.md) — la misma
  familia de ataque, en el navegador

## Fuentes

- [@owasp-top10] *OWASP Top 10* (A03: Injection). OWASP — <https://owasp.org/www-project-top-ten/>
- [@owasp-cheatsheets] *OWASP Cheat Sheet Series* (SQL Injection Prevention). OWASP — <https://cheatsheetseries.owasp.org/>
- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
