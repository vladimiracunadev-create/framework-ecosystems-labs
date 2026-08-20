# Clase 045 — Paginación

> [⬅️ 044](../044-versionado-de-api/README.md) · [📚 Parte 3](../README.md) · [🎓 Clases](../../README.md) · [046 ➡️](../046-filtrado-y-ordenacion/README.md)
>
> Parte **3 — Validación y contrato** · Nivel **🟡 intermedio** · Pista **`backend`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Devolver muchos elementos **sin devolverlos todos**, y entender por qué la forma
fácil de hacerlo falla justo cuando más datos hay.

## 🧩 La situación

25 tareas con identificador ordenado. Dos rutas: una pagina por
**desplazamiento** y la otra por **cursor**.

## 📖 Las dos formas

### Por desplazamiento

```text
GET /tareas?desde=10&limite=2
```

«Sáltate 10, dame 2.» Es lo primero que se le ocurre a cualquiera, se traduce
directo a SQL y permite saltar a la página 47 sin pasar por las anteriores.

**Tiene dos problemas que solo aparecen con datos reales:**

**1. La página se desplaza.** Si alguien inserta un elemento mientras paginas,
todo se corre una posición: el último elemento de la página 1 aparece otra vez
como primero de la página 2. Con un borrado, un elemento **desaparece sin que lo
hayas visto**.

**2. El coste crece con la profundidad.** Para dar la página 1000, la base tiene
que **contar y descartar** los 20 000 elementos anteriores. La página 1 es
instantánea y la 1000 tarda segundos.

### Por cursor

```text
GET /tareas-cursor?limite=3&cursor=003
```

«Dame los 3 que vienen **después de este**.» El cursor apunta al último elemento
devuelto.

- **Insertar no desplaza nada**: la pregunta es «después de 003», no «a partir de
  la posición 10».
- **El coste no crece**: con un índice, «los siguientes después de 003» es igual
  de rápido en la página 1 que en la 1000.

**Lo que se pierde:** no puedes saltar a la página 47, y el total es caro de
calcular. Por eso el contrato devuelve `total` en la paginación por
desplazamiento y no en la de cursor — no es un descuido, es la diferencia.

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /tareas` | primera página y `total: 25` |
| `?desde=10&limite=2` | elementos `011` y `012` |
| `?limite=1000` | **`422`** · `LIMITE_INVALIDO` |
| `/tareas-cursor?limite=3` | `001`,`002`,`003` y `siguiente: "003"` |
| `?limite=3&cursor=003` | `004`,`005`,`006` — sin solaparse |
| `?limite=3&cursor=022` | `siguiente: null` |
| `?cursor=999` | `422` · `CURSOR_INVALIDO` |

**El tercer caso es de seguridad**, no de comodidad. Sin tope, `?limite=1000000`
es una petición que carga la tabla entera en memoria — y hacerla cuesta un
segundo a quien la envía.

Y el sexto: **`siguiente: null` explícito** cuando no hay más. El cliente sabe
que terminó sin tener que comparar tamaños ni hacer una petición de más.

## 🌐 Las implementaciones

```python
# FastAPI — el rango en la firma. El máximo NO es opcional.
def listar(
    desde: int = Query(default=0, ge=0),
    limite: int = Query(default=10, ge=1, le=50),
) -> JSONResponse:
```

Una línea por parámetro, con su valor por omisión y su rango. FastAPI rechaza por
su cuenta lo que se salga — y la implementación traduce su error al código del
contrato, porque **el código estable lo decide la API, no la biblioteca de
validación**.

```javascript
// Express — el cursor busca la posición del identificador
const inicio = cursor === undefined ? 0 : TAREAS.findIndex((t) => t.id === cursor) + 1;
```

Sobre un array es una búsqueda lineal; sobre una tabla con índice es
`WHERE id > ? ORDER BY id LIMIT ?`, que es la razón de que el cursor escale.

## 🔬 Comparación

| | Desplazamiento | Cursor |
| --- | --- | --- |
| Saltar a la página N | **sí** | no |
| Total conocido | **sí** | caro |
| Estable con inserciones | **no** | **sí** |
| Coste en profundidad | crece | constante |
| Complejidad | mínima | media |

**Ninguna gana siempre.** La pregunta que decide:

- **Interfaz con números de página y pocos datos** → desplazamiento.
- **Desplazamiento infinito, exportación, sincronización, muchos datos** →
  cursor.

Kleppmann sitúa esta diferencia en el mismo marco que otras decisiones de
acceso a datos: **lo que funciona con mil filas y lo que funciona con diez
millones no son lo mismo**, y el desajuste aparece tarde
[@kleppmann-ddia].

## 🔒 Y el cursor opaco

Este cursor es el identificador visible: `cursor=003`. Es simple y **filtra
información** — que los identificadores son secuenciales, cuántos hay, y permite
adivinar identificadores ajenos.

En una API pública conviene codificarlo, no por seguridad por oscuridad, sino
por dos razones prácticas:

1. **Puedes cambiar su significado** —de identificador a fecha+identificador—
   sin romper a nadie, porque el cliente lo trata como opaco.
2. **Puedes firmarlo** para que nadie fabrique uno que salte a datos que no le
   corresponden.

## ⚠️ Errores frecuentes

- **Sin límite máximo.** `?limite=1000000` como vía de agotamiento.
- **Sin límite por omisión.** «Sin parámetros» acaba devolviendo la tabla.
- **Paginar sin ordenar.** Sin un orden estable, las páginas se solapan y se
  saltan elementos aunque nadie escriba.
- **Ordenar por un campo no único.** Dos filas iguales rompen el cursor: hay que
  desempatar con el identificador.
- **Devolver el total en cursor.** Es la operación cara que el cursor evitaba.
- **Cursor transparente en API pública.**

## ✅ Verificación

```bash
node scripts/run-class.mjs 045
```

## 🧪 Reto de transferencia

Haz que el cursor ordene por `prioridad` en lugar de por identificador y
comprueba que **se rompe**: hay prioridades repetidas y el cursor no sabe por
cuál seguir. Después arréglalo con un cursor compuesto —prioridad más
identificador—. Es el problema real de la paginación por cursor y su solución
estándar.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 046 — Filtrado y ordenación](../046-filtrado-y-ordenacion/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@geewax-api-design-patterns] Geewax, JJ. *API Design Patterns*. Manning, 2021. ISBN 9781617295850 — <https://openlibrary.org/isbn/9781617295850>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
