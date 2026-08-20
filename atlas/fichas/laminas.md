# 🏛️ Laminas — 2019

> [⬅️ Atlas](../README.md) · [🐘 Ecosistema PHP](../ecosistemas/php.md) · [🗂️ Índice](../frameworks.md)

Laminas es la continuación de [Zend Framework](zend-framework.md) bajo gobierno de
la Linux Foundation. Su ficha existe para documentar **cómo se hace bien un
cambio de manos**, que es una de las preguntas que el
[módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) obliga a plantear
antes de adoptar cualquier cosa.

| | |
|---|---|
| **Aparición** | 2019, como continuación de Zend Framework |
| **Clasificación** | `application-framework` |
| **Ecosistema** | PHP |
| **Licencia** | `BSD-3-Clause` |
| **Gobierno** | Linux Foundation |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://docs.laminas.dev/> |

---

## ✅ Cómo se hizo el traspaso

| Riesgo de un cambio de manos | Cómo se mitigó |
| --- | --- |
| El código se abandona | Se transfirió a una fundación con gobierno abierto |
| Nadie sabe cómo migrar | Guía completa y **herramienta automática** de reescritura |
| Se pierde el equipo | Continuidad de los mantenedores |
| Confusión de identidad | Nombre nuevo, historial conservado, correspondencia explícita |
| Rotura silenciosa | La API se mantuvo; cambiaron los espacios de nombres |

Esa última fila es la clave técnica: **el cambio fue de nombres, no de
comportamiento**, así que una herramienta pudo automatizarlo. Cuando una
migración es mecánica, se puede automatizar; cuando exige criterio, no. Distinguir
ambos casos es lo que decide si una migración se hace o se pospone años, como
enseña el [módulo 10](../../curriculum/10-modernizacion-y-migracion.md).

## 🧩 Qué aporta hoy

Laminas mantiene la propuesta de Zend: componentes independientes, gran atención
a los estándares de interoperabilidad [@php-fig-psr] y un enfoque empresarial
—explícito, configurable, con soporte largo—.

Comparte espacio con [Symfony](symfony.md) en el extremo explícito del ecosistema
PHP, frente al extremo de convención que ocupa [Laravel](laravel.md).

## 🎓 Las dos lecciones

**1. Un cambio de gobierno puede salir bien.** Si el proyecto lo prepara —guía,
herramienta, continuidad—, adoptar un proyecto de un solo patrocinador es un
riesgo gestionable.

**2. Distinguir migración mecánica de migración con criterio.** La primera se
automatiza y se hace; la segunda se planifica y se pospone. Saber cuál tienes
delante cambia la estimación por completo.

## 🔗 Enlaces

- Documentación oficial: <https://docs.laminas.dev/>
- [Ficha de Zend Framework](zend-framework.md) — de dónde viene · [Ficha de Symfony](symfony.md)
- [Módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)

## Fuentes

- [@php-fig-psr] *PSR — PHP Standards Recommendations*, PHP-FIG — <https://www.php-fig.org/psr/>
