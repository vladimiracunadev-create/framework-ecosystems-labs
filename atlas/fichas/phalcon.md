# 🦅 Phalcon — 2012

> [⬅️ Atlas](../README.md) · [🐘 Ecosistema PHP](../ecosistemas/php.md) · [🗂️ Índice](../frameworks.md)

Phalcon hizo algo que ningún otro framework del catálogo hace: **se distribuye
como una extensión compilada del lenguaje**, no como código fuente. El framework
no se carga ni se interpreta en cada petición: ya está dentro del intérprete.

| | |
|---|---|
| **Aparición** | 2012 |
| **Clasificación** | `full-stack-framework` |
| **Ecosistema** | PHP (extensión en C) |
| **Licencia** | `BSD-3-Clause` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.phalcon.io/latest/> |

---

## 💡 La decisión y su factura

**Lo que compra:** en el modelo de PHP —un proceso por petición— cargar e
interpretar los archivos del framework se paga cada vez. Phalcon elimina ese
coste porque el framework ya está compilado dentro del intérprete.

**Lo que cuesta**, y es mucho más de lo que sugiere el titular:

| Coste | Por qué importa |
| --- | --- |
| **Instalación no estándar** | Hay que instalar una extensión en el servidor: adiós a los alojamientos compartidos |
| **No se puede leer el código** | Depurar hacia dentro del framework deja de ser posible |
| **Atado a versiones del intérprete** | Cada versión mayor de PHP exige una compilación nueva |
| **Ecosistema pequeño** | Menos gente, menos bibliotecas, menos respuestas |
| **Contenedores más complejos** | La imagen debe llevar la extensión |

## 🧭 Lo que enseña para decidir

Phalcon es un caso extremo y por eso didáctico del
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md): **una ventaja
técnica real puede quedar anulada por costes de operación**.

La pregunta correcta no es «¿es más rápido?» sino: ¿cuánto de tu latencia total
es carga del framework? En la mayoría de las aplicaciones, la respuesta es «poco»
—el tiempo se va en la base de datos y en la red— y el
[módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md) exige medirlo
antes de optimizarlo.

Y una segunda: ¿qué pasa cuando quieras depurar dentro? Ver el código del
framework es una herramienta de diagnóstico que se pierde por completo.

## 🎓 Las dos lecciones

**1. Una ventaja técnica se evalúa junto a sus costes de operación.** Rápido e
imposible de instalar donde estás no es rápido.

**2. Poder leer el código del framework es una capacidad de diagnóstico.** Se
echa de menos exactamente el día que hace falta.

## 🔗 Enlaces

- Documentación oficial: <https://docs.phalcon.io/latest/>
- [Ficha de Laravel](laravel.md) · [Ficha de Symfony](symfony.md)
- [Módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md)

## Fuentes

- [@gregg-systems-performance] Gregg, Brendan. *Systems Performance*, 2.ª ed. Pearson, 2020. ISBN 9780136820154 — <https://openlibrary.org/isbn/9780136820154>
