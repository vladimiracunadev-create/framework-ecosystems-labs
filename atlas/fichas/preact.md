# 🟪 Preact — 2015

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

Preact reimplementa la API de React en una fracción de su tamaño. Es útil como
herramienta y es **más útil todavía como experimento**: al poner lado a lado dos
implementaciones de la misma interfaz, deja ver **cuánto del peso de una
biblioteca es esencial y cuánto es accidental**.

> **🎯 Por qué está en este programa**
>
> Porque el [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) pide
> distinguir **complejidad esencial** —la que viene del problema— de **complejidad
> accidental** —la que viene de las decisiones. Preact es la medición de esa
> diferencia hecha por otro equipo: la misma API, muchísimo menos código.

| | |
|---|---|
| **Aparición** | 2015, creado por Jason Miller |
| **Clasificación** | `ui-library` |
| **Ecosistema** | JavaScript / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://preactjs.com/guide/v10/getting-started/> |

---

## 💡 Qué quitó, y qué dice eso

Preact conserva el modelo —componentes, estado, enganches, árbol virtual— y
prescinde de piezas que React añadió para resolver problemas concretos. Su propia
documentación enumera las diferencias con honestidad poco frecuente
[@preact-differences]:

| Lo que React tiene y Preact no | Para qué existe en React |
| --- | --- |
| Sistema de eventos sintéticos | Normalizar diferencias entre navegadores, hoy mucho menores |
| Algunas comprobaciones en desarrollo | Detectar errores antes; cuestan tamaño |
| Ciertas API heredadas | Compatibilidad con código antiguo |

La lectura interesante es esta: **buena parte de ese peso resolvía problemas de
2013 que la plataforma ya resolvió**. Es el mismo fenómeno de la ficha de
[jQuery](jquery.md) —el navegador absorbe el trabajo de la biblioteca— aplicado a
una generación posterior.

## ⚖️ Cuándo tiene sentido y cuándo no

**Tiene sentido** cuando el tamaño del paquete es una restricción real y medida:
sitios de contenidos con islas interactivas, incrustaciones en páginas de
terceros, aplicaciones dirigidas a dispositivos y redes modestas.

**No tiene sentido** por defecto. La compatibilidad es alta pero no total, y una
biblioteca del ecosistema React que dependa de detalles internos puede no
funcionar. Cambiar por unos kilobytes sin haber medido su efecto en una red real
es optimizar sin datos, que es exactamente lo que el
[módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md) desaconseja.

## 🧭 El detalle que más enseña

Preact demuestra que **la API y la implementación son cosas separables**. Se puede
conservar el contrato —lo que el programador escribe— y reemplazar por completo
lo que hay debajo.

Es la misma idea que sostiene el contrato canónico de este programa: cinco
implementaciones distintas, el mismo examen. Y es la razón de que el
[módulo 05](../../curriculum/05-backend-y-api.md) insista en que **el contrato
existe antes que la implementación y sobrevive a ella**.

## 🎓 Las tres lecciones

**1. Parte del peso de cualquier biblioteca es histórico.** Resuelve problemas que
ya no existen y sigue ahí por compatibilidad. Reconocerlo evita atribuir todo el
tamaño a complejidad esencial.

**2. Una API puede sobrevivir a su implementación.** Si el contrato está bien
definido, se puede sustituir lo de debajo.

**3. Cambiar por tamaño exige medir.** Sin una medición en red limitada, el ahorro
es una cifra sin contexto — el error que el módulo 08 persigue en toda
comparación.

## 🔗 Enlaces

- Documentación oficial: <https://preactjs.com/guide/v10/getting-started/>
- [Ficha de React](react.md) · [Ficha de Astro](astro.md) — donde se usa a menudo
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@preact-differences] *Differences to React*, Preact — <https://preactjs.com/guide/v10/differences-to-react/>
