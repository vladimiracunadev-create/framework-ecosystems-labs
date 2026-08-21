# Clase 062 — Caché de lectura

> [⬅️ 061](../061-grupo-de-conexiones/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [063 ➡️](../063-bases-no-relacionales/README.md)
>
> Parte **4 — Datos** · Nivel **🔴 avanzado** · Pista **`datos`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Evitar la consulta repetida — y **aceptar el coste de la invalidación**, que es
la parte que nadie cuenta cuando propone una caché.

## 🧩 La situación

Una tarea que se lee dos veces, se modifica, se vuelve a leer. Y después una
escritura que **olvida invalidar**.

## 🌐 Las implementaciones

[Express](implementaciones/express/), [FastAPI](implementaciones/fastapi/),
[Spring Boot](implementaciones/spring-boot/) y
[ASP.NET Core](implementaciones/aspnet-core/).

Las cuatro cuentan **consultas al almacén** y **aciertos de caché**, que es lo
único que distingue una lectura cacheada de una que no lo está: el cuerpo de la
respuesta es idéntico.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /reiniciar` | `consultas: 0`, `aciertos: 0` |
| `GET /tareas/1` | "comprar pan" |
| `GET /metricas` | `consultas: 1`, `aciertos: 0` |
| `GET /tareas/1` | **lo mismo** |
| `GET /metricas` | **`consultas: 1`**, `aciertos: 1` |
| `PATCH /tareas/1` "regar" | `200` |
| `GET /tareas/1` | **"regar"** |
| `GET /metricas` | `consultas: 2`, `aciertos: 1` |
| `POST /escribir-sin-invalidar` "fantasma" | `ok` |
| `GET /tareas/1` | **"regar"** ← *miente* |
| `GET /sin-cache/tareas/1` | **"fantasma"** |

**Los dos últimos casos son la clase.** El contrato no comprueba que la caché
funcione: comprueba que **miente cuando se olvida invalidarla**, y lo comprueba
con una lectura directa al almacén que dice otra cosa.

Es el fallo más caro de esta categoría, y su forma es siempre esta: no hay
excepción, no hay registro, no hay nada. Solo un dato viejo que se sirve como si
fuera nuevo.

## 📖 Las tres preguntas de cualquier caché

Ninguna caché está bien diseñada hasta que las tres tienen respuesta:

1. **¿Qué se guarda?** Una entidad, una consulta, una respuesta HTTP entera.
2. **¿Cuándo deja de valer?** Por tiempo, por invalidación explícita, o las dos.
3. **¿Quién más la tiene?** Si hay tres instancias, hay tres cachés.

La tercera es la que más se olvida y la que más rompe:

```javascript
const cache = new Map();   // esta caché vive en ESTE proceso
```

Con un solo proceso funciona. Con tres instancias detrás de un balanceador, la
invalidación de una **no alcanza a las otras dos**, y el dato viejo sigue
sirviéndose desde ellas. Ese es el momento en que hace falta una caché
compartida — Redis, Memcached— y con ella llega otra red que puede fallar.

## 🌐 Declarativa frente a explícita

Spring es el único de los cuatro con una caché **declarativa**:

```java
@Cacheable(cacheNames = "tareas", key = "#id")
public Map<String, Object> leer(int id) { ... }   // no se entra si ya está

@CacheEvict(cacheNames = "tareas", key = "#id")
public Map<String, Object> modificar(int id, String titulo) { ... }
```

No hay ningún mapa a la vista. El método se lee como si no hubiera caché, y esa
es a la vez su virtud y su trampa: **el código no dice dónde está la caché ni
cuándo se vacía**.

Los otros tres son explícitos:

```csharp
if (cache.TryGetValue(id, out Tarea? guardada)) { ... }   // ASP.NET Core
cache.Set(id, tarea, TimeSpan.FromMinutes(5));
```

```javascript
if (cache.has(id)) { ... }                                // Express
```

Y hay una asimetría que conviene ver: **Express y FastAPI no traen caché**. Lo
que hay en sus implementaciones es un `Map` y un diccionario. No es una carencia
del ejemplo — es el hallazgo: en esos ecosistemas la caché es una decisión que
tomas tú, con una biblioteca que eliges tú.

## ⚠️ Borrar, no reescribir

```javascript
cache.delete(id);            // sí
cache.set(id, valorNuevo);   // parece mejor, y no lo es
```

Reescribir la entrada ahorra una consulta y abre una carrera:

1. La escritura A pone el título en «uno».
2. La escritura B pone el título en «dos».
3. B guarda «dos» en la caché.
4. **A guarda «uno»** — llegó más tarde por casualidad.

El almacén tiene «dos» y la caché dice «uno», indefinidamente. Borrar no puede
producir eso: lo peor que pasa es una consulta de más.

Spring ofrece las dos —`@CacheEvict` y `@CachePut`— y esta es la razón de
preferir la primera.

## ⚠️ Siempre una caducidad

```csharp
cache.Set(id, tarea, TimeSpan.FromMinutes(5));
```

Aunque invalides bien. Por dos razones:

- **Memoria.** Una entrada que nadie invalida se queda para siempre, y la caché
  sin límite es una fuga de memoria con otro nombre.
- **Errores.** El día que se te escape una invalidación —y se te escapará— la
  caducidad pone un techo al daño: cinco minutos de dato viejo en lugar de
  indefinido.

La caducidad no sustituye a la invalidación: **la respalda**.

## 🔬 Comparación

| Framework | Caché de serie | Cómo se usa | Caducidad | Vaciar entera |
| --- | --- | --- | --- | --- |
| Express | **no** | un `Map`, o una biblioteca | a mano | `clear()` |
| FastAPI | **no** | un diccionario, o una biblioteca | a mano | `clear()` |
| Spring Boot | **sí**, abstracta | `@Cacheable` / `@CacheEvict` | según el proveedor | `cache.clear()` |
| ASP.NET Core | **sí**, `IMemoryCache` | explícita, `TryGetValue` / `Set` | incorporada | **no se puede** |

Dos detalles de la tabla que sorprenden al usarlos:

**Spring abstrae el proveedor.** `@Cacheable` funciona igual con un mapa en
memoria, con Caffeine o con Redis: se cambia una dependencia y el código no se
toca. Es la ventaja real de que sea declarativa.

**`IMemoryCache` no sabe vaciarse.** Solo se pueden quitar claves conocidas. Por
eso en producción se usa un prefijo de versión en la clave —`v3:tarea:1`— y
«vaciar» consiste en subir el número.

## ⚠️ Errores frecuentes

- **Olvidar invalidar.** El caso del contrato. No avisa.
- **Guardar la referencia en vez de una copia.** Quien reciba la respuesta puede
  modificar la entrada de la caché sin querer.
- **Reescribir la entrada al escribir.** Carrera.
- **Cachear sin caducidad.** Fuga de memoria y errores indefinidos.
- **Cachear en el proceso con varias instancias.** Cada una miente por su lado.
- **Cachear datos por usuario con una clave global.** El fallo más grave de
  todos: servirle a alguien los datos de otro.
- **Cachear antes de medir.** Sin la clase 056 hecha, no sabes si el problema
  era la consulta repetida o una consulta lenta.

## ✅ Verificación

```bash
node scripts/run-class.mjs 062
```

## 🧪 Reto de transferencia

Arranca **dos** instancias en puertos distintos sobre el mismo almacén. Modifica
en una y lee en la otra: la segunda seguirá devolviendo el valor viejo, con el
código correcto y la invalidación bien escrita. Es la forma más rápida de
entender por qué la caché compartida existe.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 048 — ETags y caché condicional](../../parte-3-validacion-y-contrato/048-etags-y-cache-condicional/README.md)
- [Clase 056 — El problema N+1](../056-el-problema-n-1/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
- [@rfc9111] Fielding, Roy T.; Nottingham, Mark; Reschke, Julian. *RFC 9111: HTTP Caching*. IETF, 2022. — <https://www.rfc-editor.org/rfc/rfc9111>
