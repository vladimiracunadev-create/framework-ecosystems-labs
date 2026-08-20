# 🎂 Dropwizard — 2011

> [⬅️ Atlas](../README.md) · [☕ Ecosistema JVM](../ecosistemas/jvm.md) · [🗂️ Índice](../frameworks.md)

Dropwizard no inventó nada, y esa es su aportación: **ensambla bibliotecas
maduras y probadas en un producto operable**, con métricas y comprobaciones de
salud desde el primer minuto.

> **🎯 Por qué está en este programa**
>
> Porque puso la **operación** dentro del framework años antes de que fuera
> habitual. Lo que el [módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md)
> exige —telemetría, sondas, diagnóstico— aquí venía en la caja en 2011.

| | |
|---|---|
| **Aparición** | 2011, creado en Yammer |
| **Clasificación** | `application-framework` |
| **Ecosistema** | JVM (Java) |
| **Licencia** | `Apache-2.0` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://www.dropwizard.io/en/stable/> |

---

## 💡 Integración en lugar de invención

Dropwizard toma el servidor, la capa REST, el mapeador JSON, la validación, la
biblioteca de métricas y el acceso a datos —cada uno un proyecto consolidado por
separado— y los entrega **configurados para funcionar juntos**.

La decisión de diseño es la que merece atención: *ninguna* de esas piezas es
suya. El valor está en la integración, la configuración por omisión y la
coherencia.

## 📊 Operable desde el primer día

| Viene incluido | Qué resuelve |
| --- | --- |
| **Métricas** por punto de entrada | Latencias y percentiles sin instrumentar a mano |
| **Comprobaciones de salud** declarables | La base de las sondas del [módulo 12](../../curriculum/12-producto-final.md) |
| Puerto de administración separado | La telemetría no se expone en el puerto público |
| Configuración validada al arrancar | **Falla al arrancar**, no en la primera petición |

Las dos últimas filas son decisiones excelentes que casi ningún framework de su
época tomaba, y que hoy son requisitos de cualquier plataforma de ejecución
[@murphy-sre-workbook].

## ⚖️ El compromiso

**Se gana** un servicio observable sin trabajo adicional, y una pila de
componentes con años de recorrido.

**Se paga** flexibilidad: cambiar una de las piezas integradas es ir contra el
diseño. Y hay menos ecosistema alrededor que en Spring, con la consecuencia
habitual para el [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md).

## 🎓 Las dos lecciones

**1. Integrar bien es una aportación real.** No hace falta inventar para aportar
valor: elegir, configurar y sostener la coherencia es trabajo difícil y útil.

**2. La operabilidad debería venir por omisión.** Un framework que obliga a
añadir métricas y sondas a posteriori garantiza que en muchos proyectos no se
añadirán.

## 🔗 Enlaces

- Documentación oficial: <https://www.dropwizard.io/en/stable/>
- [Ficha de Spring Boot](spring-boot.md) · [Ficha de Kubernetes](kubernetes.md)
- [Módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md)

## Fuentes

- [@murphy-sre-workbook] Murphy, Niall Richard et al. *The Site Reliability Workbook*. O'Reilly Media, 2018. ISBN 9781492029502 — <https://openlibrary.org/isbn/9781492029502>
