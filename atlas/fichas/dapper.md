# 🎯 Dapper — 2011

> [⬅️ Atlas](../README.md) · [🟦 Ecosistema .NET](../ecosistemas/dotnet.md) · [🗂️ Índice](../frameworks.md)

Dapper es la **alternativa deliberada al mapeador completo**: escribes el SQL, y
Dapper solo se encarga de convertir el resultado en objetos. Nada más.

Nació de una necesidad concreta —un sitio con muchísimo tráfico donde el
rendimiento del acceso a datos importaba— y esa procedencia explica su diseño.

| | |
|---|---|
| **Aparición** | 2011, creado en Stack Overflow |
| **Clasificación** | `micro-orm` |
| **Ecosistema** | .NET (C#) |
| **Licencia** | `Apache-2.0` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://github.com/DapperLib/Dapper> |

---

## 💡 Hace una cosa

```csharp
// El SQL es tuyo. Dapper mapea el resultado y parametriza la consulta.
var tareas = await conexion.QueryAsync<Tarea>(
    "SELECT id, titulo, completada FROM tareas WHERE usuario_id = @usuarioId",
    new { usuarioId });
```

Tres propiedades que se derivan de esa decisión:

1. **Sabes exactamente qué consulta se ejecuta**, porque la escribiste.
2. **No hay sorpresas de traducción**: nada que un generador pueda interpretar de
   forma inesperada.
3. **Se parametriza siempre**, que es la defensa contra la inyección que exige el
   [módulo 07](../../curriculum/07-identidad-y-seguridad.md).

Ese tercer punto merece énfasis: usar SQL escrito a mano **no significa
concatenar cadenas**. Dapper hace natural lo correcto, y esa es la diferencia
entre control y peligro.

## ⚖️ Lo que renuncias

Sin migraciones, sin seguimiento de cambios, sin carga perezosa, sin caché de
identidad. Todo lo que un mapeador completo hace por ti, aquí lo haces tú o no
existe.

Para un dominio con muchas entidades relacionadas, eso es mucho trabajo manual.
Para lecturas complejas —informes, agregaciones, consultas afinadas— es
exactamente lo que quieres.

## 🧭 La conclusión práctica

Los dos no son excluyentes, y esa es la respuesta que el
[módulo 06](../../curriculum/06-persistencia-y-dominio.md) sugiere: **usar el
mapeador completo para el dominio y el micro-mapeador para las lecturas
complejas**, dentro del mismo proyecto.

Es la aplicación directa de la idea de separar el camino de escritura del de
lectura [@fowler-cqrs]: no hay ninguna regla que obligue a que ambos usen la
misma herramienta.

## 🎓 Las dos lecciones

**1. Escribir el SQL no es un retroceso.** Es elegir control sobre abstracción,
para el caso donde la abstracción no aporta.

**2. Mapeador completo y micro-mapeador pueden convivir.** La decisión es por
caso de uso, no por proyecto.

## 🔗 Enlaces

- Documentación oficial: <https://github.com/DapperLib/Dapper>
- [Ficha de Entity Framework Core](entity-framework-core.md) — la otra columna
- [Módulo 06](../../curriculum/06-persistencia-y-dominio.md)

## Fuentes

- [@fowler-cqrs] Fowler, Martin. *CQRS*, 2011 — <https://martinfowler.com/bliki/CQRS.html>
- [@postgresql-docs] PostgreSQL Documentation, PostgreSQL Global Development Group — <https://www.postgresql.org/docs/current/>
