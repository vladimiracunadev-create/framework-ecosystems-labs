# 📐 Kivy — 2011

> [⬅️ Atlas](../README.md) · [🐍 Ecosistema Python](../ecosistemas/python.md) · [🗂️ Índice](../frameworks.md)

Kivy permite construir interfaces multiplataforma en Python —escritorio y móvil—
con su **propio motor de dibujo**. Es la misma decisión estructural que toma
[Flutter](flutter.md), en un ecosistema muy distinto.

| | |
|---|---|
| **Aparición** | 2011 |
| **Clasificación** | `ui-framework` |
| **Ecosistema** | Python |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://kivy.org/doc/stable/> |

---

## 💡 Dibujo propio, con las mismas consecuencias

Kivy no usa los componentes del sistema: dibuja con aceleración por hardware. Eso
produce el mismo balance que la [ficha de Flutter](flutter.md) describe:

| | Consecuencia |
| --- | --- |
| Aspecto | Idéntico en todas las plataformas, y **distinto del sistema** |
| Componentes nuevos del sistema | No aparecen solos |
| Accesibilidad | Depende de que el framework la reimplemente |
| Tamaño del artefacto | Mayor: hay que empaquetar Python y el motor |

Que dos proyectos independientes —uno con respaldo de Google, otro comunitario—
lleguen al mismo diseño confirma que el compromiso es estructural, no una
elección de moda.

## ⚖️ El coste real: empaquetar Python

La dificultad principal de Kivy no está en su API sino en **llevar un intérprete
de Python a un teléfono**. Empaquetar, firmar y publicar exige herramientas
específicas y es la parte donde más proyectos se atascan.

Para el [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) eso entra
en **coste total de operación**, no en calidad del framework: una tecnología cuya
publicación es frágil tiene un coste continuo aunque el código sea excelente.

## 🧭 Cuándo encaja

**Encaja** cuando el equipo ya es de Python, el trabajo pesado está en Python
—cálculo, datos, control de instrumentos— y la interfaz es un envoltorio.

**No encaja** para una aplicación móvil de consumo que deba sentirse nativa: ahí
[Flutter](flutter.md) o [React Native](react-native.md) tienen mucho más
recorrido y ecosistema.

## 🎓 Las dos lecciones

**1. El mismo compromiso aparece en ecosistemas independientes.** Dibujar propio
frente a usar lo nativo es una elección estructural, no una moda.

**2. La distribución es parte de la decisión.** Un framework fácil de programar y
difícil de publicar tiene un coste que se paga en cada versión.

## 🔗 Enlaces

- Documentación oficial: <https://kivy.org/doc/stable/>
- [Ficha de Flutter](flutter.md) — la misma decisión con más recursos
- [Módulo 09](../../curriculum/09-movil-escritorio-y-offline.md)

## Fuentes

- [@windmill-flutter] Windmill, Eric. *Flutter in Action*. Manning Publications, 2019. ISBN 9781617296147 — <https://openlibrary.org/isbn/9781617296147>
