# 🅰️🟣 AdonisJS — 2015

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

AdonisJS es la respuesta actual a la pregunta que [Sails](sails.md) hizo demasiado
pronto: **un framework de Node con todo incluido**, al estilo de
[Laravel](laravel.md), pero con TypeScript de primera clase.

| | |
|---|---|
| **Aparición** | 2015 |
| **Clasificación** | `full-stack-framework` |
| **Ecosistema** | Node.js / TypeScript |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.adonisjs.com/> |

---

## 💡 Qué trae en la caja

ORM (Lucid), migraciones, autenticación, validación, correo, colas, pruebas,
inyección de dependencias y línea de comandos. Es la lista que la
[ficha de Laravel](laravel.md) usa para explicar por qué un framework completo
acorta el tiempo hasta la primera versión útil.

La diferencia con Sails es el momento y la ejecución: llega cuando TypeScript ya
es el estándar de facto en Node, y sus tipos no son un añadido sino el diseño.

## ⚖️ Completo frente a componible

Es la tensión permanente del ecosistema Node y el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) la plantea sin
falso equilibrio:

| | Framework completo | Piezas elegidas |
| --- | --- | --- |
| **Arranque** | Rápido | Lento |
| **Decisiones** | Ya tomadas | Todas tuyas |
| **Casos raros** | Puedes chocar | Cambias la pieza |
| **Incorporación** | Aprendes el framework | Aprendes la combinación del equipo |

Ninguna columna gana siempre. La pregunta útil no es cuál es mejor, sino **cuánta
decisión quiere tomar este equipo y cuánta prefiere heredar**.

## 🧭 El riesgo del ecosistema pequeño

AdonisJS tiene menos personas alrededor que [NestJS](nestjs.md), y eso pesa: menos
respuestas escritas, menos bibliotecas de terceros, menos gente contratable con
experiencia. Es el mismo factor que la [ficha de Sails](sails.md) señala como
causa de fondo.

## 🎓 Las dos lecciones

**1. La misma idea funciona o no según el momento.** AdonisJS acierta con la
propuesta que a Sails le salió mal, porque llega con TypeScript maduro.

**2. Completo y componible son preferencias de equipo, no verdades técnicas.** Lo
que cambia es dónde se paga el coste: al arrancar o al mantener.

## 🔗 Enlaces

- Documentación oficial: <https://docs.adonisjs.com/>
- [Ficha de NestJS](nestjs.md) · [Ficha de Laravel](laravel.md) · [Ficha de Sails](sails.md)
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@casciaro-node-patterns] Casciaro, Mario; Mammino, Luciano. *Node.js Design Patterns*, 3.ª ed. Packt, 2020. ISBN 9781839214110 — <https://openlibrary.org/isbn/9781839214110>
