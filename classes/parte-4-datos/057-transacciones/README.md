# Clase 057 — Transacciones

> [⬅️ 056](../056-el-problema-n-1/README.md) · [📚 Parte 4](../README.md) · [🎓 Clases](../../README.md) · [058 ➡️](../058-migraciones/README.md)
>
> Parte **4 — Datos** · Nivel **🟡 intermedio** · Pista **`datos`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Agrupar operaciones para que ocurran **todas o ninguna** — y ver, en el mismo
contrato, qué pasa cuando no se hace.

## 🧩 La situación

Dos cuentas con 100 cada una. Transferir dinero de una a otra: cobrar del origen,
abonar al destino. Dos escrituras que tienen que valer como una.

## 🌐 Las implementaciones

Las cuatro exponen **dos rutas con el mismo código dentro**: `/transferir`, que
lo envuelve en una transacción, y `/transferir-sin-transaccion`, que no. El
código está en [`implementaciones/`](implementaciones/).

## 🧮 El contrato

| Petición | Respuesta |
| --- | --- |
| `GET /reiniciar` | `[100, 100]`, total `200` |
| `POST /transferir` 30 | `200` |
| `GET /cuentas` | `[70, 130]`, total `200` |
| `POST /transferir` 999 | `409 SALDO_INSUFICIENTE` |
| `GET /cuentas` | `[70, 130]`, total **`200`** |
| `POST /transferir` a la cuenta 99 | `404 NO_EXISTE` |
| `GET /cuentas` | `[70, 130]`, total **`200`** |
| `POST /transferir-sin-transaccion` a la cuenta 99 | `404 NO_EXISTE` |
| `GET /cuentas` | `[60, 130]`, total **`190`** |

**El último caso es la clase entera.** Mismo código, mismo error, misma respuesta
al cliente — y diez unidades que ya no existen.

## ⚠️ Los dos fallos no son iguales

El contrato provoca dos errores a propósito, y la diferencia entre ellos es lo
que explica para qué sirve una transacción:

| Fallo | Cuándo se detecta | ¿Necesita transacción? |
| --- | --- | --- |
| `SALDO_INSUFICIENTE` | **antes** de escribir nada | no |
| `NO_EXISTE` (destino) | **después** de haber cobrado | **sí** |

Un fallo que ocurre antes de la primera escritura queda bien sin ninguna ayuda:
no hay nada que deshacer. Por eso el caso del saldo insuficiente pasa igual en
las dos rutas, y **por eso es engañoso**: probar solo ese caso da la sensación de
que todo está protegido.

El fallo que importa es el que ocurre **a mitad**. Y a mitad no significa «se
deshizo el trabajo» —significa que **la mitad quedó hecha**.

## 📖 El detalle que casi siempre se escapa

Ninguna de las cuatro implementaciones «no tiene transacción» en la ruta rota.
Las cuatro tienen **dos**: una por escritura.

```python
origen.saldo -= monto
s.commit()          # <- transacción 1, confirmada
destino = s.get(Cuenta, a)
if destino is None:
    raise ...       # el abono nunca ocurre, y el cobro ya es definitivo
```

Los ORM confirman por su cuenta salvo que se les diga lo contrario, y eso es
cómodo hasta el momento en que dos escrituras dependen la una de la otra. **Lo
que la transacción añade no es «guardar»: es agrupar.**

De ahí que el arreglo se vea tan pequeño en las cuatro:

```javascript
// Prisma — `tx`, no `prisma`. Usar el cliente de fuera dejaría las escrituras
// FUERA de la transacción, y la vuelta atrás no las alcanzaría.
await prisma.$transaction((tx) => mover(tx, peticion.body));
```

```python
with CrearSesion() as s, s.begin():   # commit al salir, rollback ante excepción
    mover(s, cuerpo)
```

```java
@Transactional
public void transferir(Map<String, Object> cuerpo) { mover(cuerpo); }
```

```csharp
await using var transaccion = await contexto.Database.BeginTransactionAsync();
```

## ⚠️ La trampa de `@Transactional` en Spring

```java
public static class FalloDeNegocio extends RuntimeException { ... }
//                                        ^^^^^^^^^^^^^^^^ no es un detalle
```

**Spring solo deshace la transacción ante excepciones no comprobadas.** Ante una
excepción comprobada —una que hereda de `Exception` sin heredar de
`RuntimeException`— hace **commit** y la propaga.

El resultado es exactamente el fallo que esta clase persigue: el error llega al
cliente, parece manejado, y la mitad del trabajo quedó escrita. Se corrige con
`@Transactional(rollbackFor = ...)`, pero lo primero es saber que la regla existe.

## 🔬 Comparación

| ORM | Cómo se abre | Qué la deshace | Confirmación implícita |
| --- | --- | --- | --- |
| Prisma | `$transaction(async (tx) => …)` | cualquier excepción | por operación |
| SQLAlchemy | `Session.begin()` | cualquier excepción | al hacer `commit()` |
| Hibernate | `@Transactional` | solo excepciones **no comprobadas** | por método de repositorio |
| Entity Framework Core | `BeginTransactionAsync()` | `RollbackAsync()` o no confirmar | por `SaveChanges` |

Las tres primeras deshacen ante una excepción; **la de Spring lo hace con una
condición**, y esa condición es la fuente de casi todos los fallos reales de esta
categoría.

## 📖 Lo que una transacción no resuelve

Vale la pena decir qué queda fuera, porque es fácil pedirle de más:

- **No protege de lo que ocurre después de confirmar.** Una vez hecho el commit,
  el arreglo es una operación compensatoria, no una vuelta atrás.
- **No cruza servicios.** Si el abono lo hace otro sistema por HTTP, ninguna
  transacción de base de datos lo alcanza. Ese es el terreno de los patrones de
  compensación, y es un problema distinto y más caro.
- **No garantiza aislamiento por sí sola.** Dos transferencias a la vez sobre la
  misma cuenta pueden pisarse según el nivel de aislamiento —clase 061.
- **No hace la operación idempotente.** Reintentar una transferencia confirmada
  la ejecuta dos veces —clase 047.

## ⚠️ Errores frecuentes

- **Probar solo el fallo que ocurre antes de escribir.** Pasa sin transacción.
- **Usar el cliente de fuera dentro del bloque.** En Prisma, `prisma` en lugar de
  `tx` deja las escrituras fuera y la vuelta atrás no las alcanza.
- **Confiar en `@Transactional` con excepciones comprobadas.** Hace commit.
- **Llamar a un método `@Transactional` desde la misma clase.** La llamada no
  pasa por el proxy y la anotación no hace nada.
- **Dejar la transacción abierta durante una llamada de red.** Bloquea filas
  mientras se espera a un tercero.
- **Capturar la excepción dentro del bloque.** Sin excepción que salga, se
  confirma lo que había.

## ✅ Verificación

```bash
node scripts/run-class.mjs 057
```

## 🧪 Reto de transferencia

Cambia el orden en `mover`: comprueba que el destino existe **antes** de cobrar.
El contrato pasará entero incluso por la ruta sin transacción. Después añade una
tercera escritura al final y comprueba que vuelve a romperse. La conclusión es la
que importa: **ordenar las comprobaciones ayuda, pero no sustituye a agrupar**.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 056 — El problema N+1](../056-el-problema-n-1/README.md)
- [Clase 047 — Idempotencia](../../parte-3-validacion-y-contrato/047-idempotencia/README.md)
- [Módulo 06 — Persistencia y dominio](../../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@kleppmann-ddia] Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly Media, 2017. ISBN 9781449373320 — <https://openlibrary.org/isbn/9781449373320>
- [@fowler-poeaa] Fowler, Martin. *Patterns of Enterprise Application Architecture*. Addison-Wesley, 2002. ISBN 9780321127426 — <https://openlibrary.org/isbn/9780321127426>
- [@nygard-release-it] Nygard, Michael T. *Release It!*, 2.ª ed. Pragmatic Bookshelf, 2018. ISBN 9781680502398 — <https://openlibrary.org/isbn/9781680502398>
