# Clase 046 — Filtrado y ordenación

> [⬅️ 045](../045-paginacion/README.md) · [📚 Parte 3](../README.md) · [🎓 Clases](../../README.md) · [047 ➡️](../047-idempotencia/README.md)
>
> Parte **3 — Validación y contrato** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Aceptar criterios del cliente **sin abrir un agujero**. Es la clase donde una
comodidad —«deja que el cliente ordene por lo que quiera»— se convierte en un
problema de seguridad si se implementa como parece natural.

## 🧩 La situación

`GET /tareas?completada=true&orden=-prioridad` filtra y ordena. Un campo que no
esté en la **lista blanca** responde 422.

## 🔒 La lista blanca no es una precaución: es el mecanismo

La forma «natural» de implementar esto es tomar el nombre del campo que envía el
cliente y usarlo:

```javascript
// NO HAGAS ESTO
resultado.sort((a, b) => a[campo] > b[campo] ? 1 : -1);
consulta += ` ORDER BY ${campo}`;   // y esto, menos todavía
```

Tres problemas, de menor a mayor gravedad:

**1. Ordenar por un campo interno.** `?orden=hash_contrasena` no expone el valor,
y **expone el orden**: comparando resultados se puede deducir información del
campo. Es una fuga por canal lateral.

**2. Filtrar por un campo que no debería ser filtrable.** `?rol=admin` sobre una
tabla de usuarios convierte una lista pública en un directorio de
administradores.

**3. Inyección.** Si el nombre del campo acaba concatenado en una consulta, el
cliente escribe SQL. Es el vector clásico, y OWASP lo mantiene entre los riesgos
principales precisamente porque sigue apareciendo [@owasp-top10].

**La lista blanca resuelve los tres a la vez**, y por eso las cuatro
implementaciones la tienen antes que cualquier otra cosa:

```javascript
const CAMPOS_ORDENABLES = new Set(["titulo", "prioridad"]);
const CAMPOS_FILTRABLES = new Set(["completada", "prioridad"]);
```

## 🌐 Las implementaciones

Las cuatro declaran la lista blanca **antes que ninguna otra cosa**, y las cuatro
la traducen a algo que tú escribiste. El código está en
[`implementaciones/`](implementaciones/).

## 📖 Y el paso que casi nadie da

Tener la lista blanca no basta si después usas el texto del cliente. Fíjate en
cómo la traducen Spring y ASP.NET:

```java
// La lista blanca se traduce a un comparador CONOCIDO
Comparator<Tarea> comparador = "titulo".equals(campo)
        ? Comparator.comparing(Tarea::titulo)
        : Comparator.comparingInt(Tarea::prioridad);
```

```csharp
Func<Tarea, object> clave = campo == "titulo" ? t => t.Titulo : t => t.Prioridad;
```

**El texto del cliente nunca llega a la consulta.** Solo decide qué comparador
—de los que tú escribiste— se usa. Con un ORM, lo equivalente es traducir a una
expresión construida por ti, no interpolar el nombre.

Es la diferencia entre validar la entrada y **no usar la entrada**, y la segunda
es estructuralmente más segura.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /tareas` | los tres |
| `?completada=true` | solo el `2` |
| `?orden=titulo` | alfa, beta, gamma |
| `?orden=-prioridad` | 3, 2, 1 |
| `?orden=id` | **`422`** · `CAMPO_NO_ORDENABLE` |
| `?titulo=alfa` | **`422`** · `CAMPO_NO_FILTRABLE` |
| `?completada=quizas` | `422` · `VALOR_INVALIDO` |

**El quinto caso es el importante.** `id` existe en el objeto y **no está en la
lista blanca**: se rechaza. Un filtro que solo comprobara «¿existe este campo?»
lo aceptaría.

## 🧭 El prefijo `-` para descendente

```text
?orden=titulo     ascendente
?orden=-titulo    descendente
```

Es una convención extendida y suficiente. Las alternativas —`orden=titulo&dir=desc`,
`sort=titulo:desc`— funcionan igual; lo que importa es **elegir una y
documentarla**, porque el cliente no la puede adivinar.

Y cuando hagan falta varios criterios, `?orden=-prioridad,titulo` se lee bien y
se analiza fácil. Geewax recomienda esa forma por ser la que menos ensucia la
cadena de consulta [@geewax-api-design-patterns].

## 🔬 Comparación

| Framework | Cómo traduce la lista blanca | ¿Puede el texto del cliente llegar a la consulta? |
| --- | --- | --- |
| Spring Boot | a un `Comparator` tipado | **no** |
| ASP.NET Core | a un selector tipado | **no** |
| FastAPI | a una clave de ordenación | solo si lo escribes mal |
| Express | a un índice del objeto | **sí**, si olvidas la lista |

Los dos primeros hacen incómodo lo inseguro. En los dos últimos, `a[campo]` es
una línea que funciona y parece razonable — y ahí la lista blanca no es una
precaución añadida: **es la única defensa**.

## ⚠️ Errores frecuentes

- **Interpolar el nombre del campo en la consulta.** Inyección directa.
- **Aceptar cualquier campo que exista en el objeto.** Fuga de campos internos.
- **Filtrar en memoria lo que debería filtrar la base.** Funciona con 3 filas y
  con 3 millones agota la memoria.
- **No validar el valor.** El campo está permitido; el valor puede no serlo.
- **Filtros sin índice.** Correcto y lentísimo — clase 056.
- **No documentar qué campos se admiten.** El cliente prueba a ciegas.

## ✅ Verificación

```bash
node scripts/run-class.mjs 046
```

## 🧪 Reto de transferencia

Añade `?titulo_contiene=al` como filtro de texto parcial. Después responde: ¿qué
pasa si el cliente envía `%`, `_` o una expresión regular? Es la misma pregunta
de la lista blanca aplicada al **valor** en lugar de al campo, y tiene la misma
respuesta: escapar o rechazar, nunca interpolar.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 074 — Inyección SQL](../../parte-5-identidad-y-seguridad/074-inyeccion-sql/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@owasp-top10] *OWASP Top 10*, OWASP Foundation — <https://owasp.org/www-project-top-ten/>
- [@geewax-api-design-patterns] Geewax, JJ. *API Design Patterns*. Manning, 2021. ISBN 9781617295850 — <https://openlibrary.org/isbn/9781617295850>
- [@hoffman-web-application-security] Hoffman, Andrew. *Web Application Security*. O'Reilly Media, 2020. ISBN 9781492053118 — <https://openlibrary.org/isbn/9781492053118>
