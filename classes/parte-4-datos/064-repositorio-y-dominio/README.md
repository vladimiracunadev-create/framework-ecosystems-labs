# Clase 064 — Repositorio y dominio

> [⬅️ 063](../063-bases-no-relacionales/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [065 ➡️](../065-probar-sin-base-de-datos/README.md)
>
> Parte **4 — Datos** · Nivel **🔴 avanzado** · Pista **`datos`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Escribir reglas de negocio que **no saben que hay base de datos** — y
comprobarlo, no prometerlo.

## 🧩 La situación

Un proyecto con tareas y **tres reglas**:

1. No se cierra un proyecto con tareas pendientes.
2. No se añaden tareas a un proyecto cerrado.
3. No hay dos tareas con el mismo título en el mismo proyecto.

## 🌐 Las implementaciones

[Prisma](implementaciones/prisma/), [SQLAlchemy](implementaciones/sqlalchemy/),
[Hibernate](implementaciones/hibernate/) y
[Entity Framework Core](implementaciones/entity-framework-core/).

Las cuatro tienen **dos repositorios**: uno contra el ORM y otro en memoria. Y el
dominio no distingue uno de otro.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /dominio` | **`menciona_orm: false`**, `reglas: 3` |
| `POST /proyectos` | `201` |
| `POST /proyectos/1/tareas` | `201` |
| `POST /proyectos/1/cerrar` | **`409 QUEDAN_PENDIENTES`** |
| `POST …/tareas/1/terminar` | `pendientes: 0` |
| `POST /proyectos/1/cerrar` | `cerrado: true` |
| `POST /proyectos/1/tareas` | **`409 PROYECTO_CERRADO`** |
| … `POST /proyectos/2/tareas` "repetida" ×2 | **`409 TITULO_REPETIDO`** |
| `GET /pruebas-del-dominio` | **`3 de 3`**, `uso_base_de_datos: false` |

## 📖 Los dos casos que hacen honesta esta clase

El primero y el último no comprueban comportamiento: comprueban **la
arquitectura**.

### `GET /dominio` lee su propio código

```javascript
const importados = texto.split(…).filter((linea) => linea.startsWith("import "));
const prohibidas = ["prisma", "express"];
```

Se lee el archivo del dominio y se miran **sus imports**. Si alguien añadiera
`import { PrismaClient }` para «resolverlo rápido», el contrato fallaría.

Fíjate en que mira los *imports*, no cualquier mención: el propio comentario del
archivo dice «no importa Prisma», y buscar la palabra suelta daba un falso
positivo — de hecho lo dio al escribir esta clase. Lo que importa es **de qué
depende** el módulo, no de qué habla.

### `GET /pruebas-del-dominio` ejecuta las reglas sin base de datos

```javascript
const memoria = new RepositorioEnMemoria();
```

Las tres reglas, contra un `Map`. Sin motor, sin esquema, sin transacción, sin
limpiar tablas. **Es el argumento entero de la clase**, y se ejecuta de verdad en
lugar de afirmarse en un README.

## 📖 Por qué el dominio puede tener las reglas

Porque **el proyecto es la raíz** y nadie toca una tarea sin pasar por él.

```javascript
proyecto.anadirTarea(id, titulo);   // única puerta
```

Si el resto del código pudiera insertar tareas por su cuenta —un repositorio con
`guardarTarea()`, un `INSERT` desde un manejador—, «no se añaden tareas a un
proyecto cerrado» sería **una recomendación**, no una regla.

Esa es la idea de *agregado*: un grupo de objetos con una entrada única y una
frontera dentro de la cual las invariantes siempre se cumplen [@evans-ddd]. Y
tiene una consecuencia práctica que se nota enseguida: **el repositorio guarda
agregados, no tablas**. Por eso `guardar(proyecto)` escribe también sus tareas.

## ⚠️ El repositorio que no sirve de nada

```python
def query(self):
    return self.sesion.query(FilaProyecto)   # devuelve el ORM hacia fuera
```

Un repositorio que expone consultas del ORM **no esconde nada**: el dominio
sigue dependiendo de él, las pruebas siguen necesitando una base, y encima hay
una clase más.

La prueba de fuego es la que aplica esta clase: **si la interfaz se puede
implementar con un diccionario, está bien puesta.** Aquí se puede, y por eso hay
dos implementaciones.

De ahí también que el repositorio devuelva **entidades del dominio, no filas**:

```csharp
return new Proyecto(fila.Id, fila.Nombre, fila.Cerrado, tareas);  // no `fila`
```

Esa línea es la frontera. Devolver `fila` habría ahorrado veinte líneas y anulado
la clase entera.

## 🔬 Dos modelos, no uno

Cada implementación tiene `Proyecto` (dominio) y `FilaProyecto` (persistencia), y
en este caso se parecen mucho.

**Que se parezcan ahora no significa que sobre uno.** Se separan cuando:

- El dominio necesita un tipo que la base no tiene —un importe con divisa, un
  intervalo de fechas.
- Un concepto vive en tres tablas, o tres conceptos en una.
- El esquema tiene columnas históricas que el dominio no debería conocer.
- Hay que cambiar el esquema sin tocar las reglas, o al revés.

El coste es real —dos clases y una traducción— y se paga por adelantado. Con
cuatro campos y ninguna regla, **no vale la pena**: eso es la clase 053.

## 🔬 Comparación

| ORM | Cómo se inyecta el repositorio | Dominio realmente limpio |
| --- | --- | --- |
| Prisma | a mano, en el módulo | **sí** |
| SQLAlchemy | a mano, con un `Protocol` como contrato | **sí** |
| Hibernate | `@Service` + inyección de Spring | **sí**: `Dominio.java` no importa `jakarta` ni `springframework` |
| EF Core | `AddScoped<IRepositorio, RepositorioEfCore>` | **sí** |

La fila de Hibernate merece un matiz: aquí el dominio está limpio **porque las
entidades JPA son otras clases**. En la [clase 054](../054-data-mapper/README.md),
donde la entidad era la del dominio, las anotaciones vivían encima de ella. La
diferencia entre las dos clases es exactamente esa: aquí hay dos modelos.

Y en EF Core la inyección hace visible el argumento:

```csharp
constructor.Services.AddScoped<IRepositorio, RepositorioEfCore>();
```

Cambiar esa línea por `RepositorioEnMemoria` deja el servicio **entero**
funcionando sin base de datos. Es un cambio de una palabra.

## ⚠️ Errores frecuentes

- **Un repositorio que devuelve consultas o filas del ORM.** No aísla nada.
- **Reglas en el manejador HTTP.** Se saltan desde cualquier otra entrada.
- **Un repositorio por tabla.** Va por agregado, no por tabla.
- **Traer el agregado entero para leer un campo.** Para las consultas de lectura
  suele convenir otro camino — y ahí sí, SQL directo (clase 060).
- **Adoptar el patrón sin reglas que proteger.** Coste sin beneficio.
- **Poner la interfaz del repositorio junto a su implementación.** Pertenece al
  lado del dominio: es él quien declara lo que necesita.

## ✅ Verificación

```bash
node scripts/run-class.mjs 064
```

## 🧪 Reto de transferencia

Añade una cuarta regla —un proyecto no admite más de tres tareas— y comprueba
**cuántos archivos hay que tocar**: uno. Después escribe su caso en
`/pruebas-del-dominio` y verás que se ejecuta sin base de datos. Repite el
ejercicio en la clase 053 y cuenta la diferencia.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 054 — Data Mapper](../054-data-mapper/README.md)
- [Clase 065 — Probar sin base de datos](../065-probar-sin-base-de-datos/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@evans-ddd] Evans, Eric. *Domain-Driven Design*. Addison-Wesley, 2003. ISBN 9780321125217 — <https://openlibrary.org/isbn/9780321125217>
- [@martin-clean-architecture] Martin, Robert C. *Clean Architecture*. Prentice Hall, 2017. ISBN 9780134494166 — <https://openlibrary.org/isbn/9780134494166>
- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
