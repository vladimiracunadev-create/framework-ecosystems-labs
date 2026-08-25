# Parte 6 — La interfaz: del HTML del servidor al componente

> [⬅️ Parte 5](../parte-5-identidad-y-seguridad/README.md) · [🎓 Todas las clases](../README.md) · [📖 Glosario](../../glosario/README.md) · [Parte 7 ➡️](../parte-7-renderizado-y-fullstack/README.md)

**Cómo se pinta una pantalla y dónde vive el estado. Aquí el elenco cambia por completo.**

**Clases 79 a 92** · 14 en total · 5 construidas · 15 tecnologías en juego.

## 🧭 De qué va esta parte

Catorce clases que recorren el camino que la industria recorrió en veinte años: **del HTML generado en el servidor al componente que vive en el navegador**.

Empieza por donde empezó todo —una plantilla y un formulario que funciona sin una línea de JavaScript— y llega a los tres modelos de reactividad que se reparten hoy el ecosistema. En medio, el puente: la mejora progresiva, que es lo que separa añadir comportamiento de exigirlo.

El recorrido no es nostálgico. Las primeras clases enseñan cosas que siguen siendo la mejor solución para muchas pantallas, y las últimas explican por qué el péndulo volvió con teoría y no por moda.

## 🎒 Qué da por sabido

- HTML y CSS básicos.
- Las partes 1 y 2: cómo se responde y cómo se compone la respuesta.
- El escapado de la clase 073, que aquí se aplica en cada plantilla.

## 🎯 Qué sabrás hacer al terminarla

- Renderizar la misma lista con seis motores de plantillas y decir **dónde vive el escapado** en cada uno.
- Construir un formulario que funcione sin JavaScript y mejorarlo sin romper el caso base.
- Escribir un componente con propiedades, eventos y estado local en cinco bibliotecas distintas.
- Elegir dónde vive un estado —local, elevado, en un contexto o en un almacén— y justificar el coste de cada opción.
- Tratar los datos del servidor como una caché y no como estado, con lo que eso implica.
- Distinguir los tres modelos de reactividad y predecir qué se vuelve a pintar en cada uno.

## 🧵 Por qué en este orden

Las tres primeras son el suelo: plantillas de servidor (079), formularios que funcionan solos (080) y la mejora progresiva (081), que es el puente.

Las siete siguientes construyen el componente pieza a pieza: primero (082), propiedades y eventos (083), estado (084), listas (085), formularios (086), efectos (087) y estado compartido (088).

Las cuatro últimas son lo que distingue una aplicación de una página: estado del servidor, enrutado en el cliente, accesibilidad y los modelos de reactividad.

## 📚 Las clases

| # | Clase | Qué resuelve | Nivel | Estado |
| --- | --- | --- | --- | --- |
| [079](079-plantillas-en-el-servidor/README.md) | [Plantillas en el servidor](079-plantillas-en-el-servidor/README.md) | Generar HTML donde están los datos. | 🟢 introductorio | ✅ Construida |
| [080](080-formularios-que-funcionan-sin-javascript/README.md) | [Formularios que funcionan sin JavaScript](080-formularios-que-funcionan-sin-javascript/README.md) | Construir sobre lo que el navegador ya sabe hacer. | 🟢 introductorio | ✅ Construida |
| [081](081-mejora-progresiva/README.md) | [Mejora progresiva](081-mejora-progresiva/README.md) | Añadir comportamiento sin romper el caso base. | 🟡 intermedio | ✅ Construida |
| [082](082-el-primer-componente/README.md) | [El primer componente](082-el-primer-componente/README.md) | Encapsular marcado y comportamiento en una unidad reutilizable. | 🟢 introductorio | ✅ Construida |
| [083](083-propiedades-y-eventos/README.md) | [Propiedades y eventos](083-propiedades-y-eventos/README.md) | Comunicar hacia abajo con datos y hacia arriba con eventos. | 🟢 introductorio | ✅ Construida |
| [084](084-estado-local/README.md) | [Estado local](084-estado-local/README.md) | Guardar y actualizar un valor que pertenece a un componente. | 🟢 introductorio | 🚧 Esqueleto |
| [085](085-listas-y-claves/README.md) | [Listas y claves](085-listas-y-claves/README.md) | Renderizar una colección y entender por qué la identidad importa. | 🟡 intermedio | 🚧 Esqueleto |
| [086](086-formularios-controlados/README.md) | [Formularios controlados](086-formularios-controlados/README.md) | Decidir si la fuente de verdad es el DOM o el estado. | 🟡 intermedio | 🚧 Esqueleto |
| [087](087-efectos-y-ciclo-de-vida/README.md) | [Efectos y ciclo de vida](087-efectos-y-ciclo-de-vida/README.md) | Ejecutar trabajo fuera del renderizado y limpiarlo después. | 🟡 intermedio | 🚧 Esqueleto |
| [088](088-estado-compartido/README.md) | [Estado compartido](088-estado-compartido/README.md) | Sacar el estado del componente sin recurrir a variables globales. | 🟡 intermedio | 🚧 Esqueleto |
| [089](089-estado-del-servidor-en-el-cliente/README.md) | [Estado del servidor en el cliente](089-estado-del-servidor-en-el-cliente/README.md) | Distinguir el estado propio del que es copia de otro sitio. | 🔴 avanzado | 🚧 Esqueleto |
| [090](090-enrutado-en-el-cliente/README.md) | [Enrutado en el cliente](090-enrutado-en-el-cliente/README.md) | Cambiar de vista sin recargar y sin romper el navegador. | 🟡 intermedio | 🚧 Esqueleto |
| [091](091-accesibilidad-del-componente/README.md) | [Accesibilidad del componente](091-accesibilidad-del-componente/README.md) | Construir un control que funcione con teclado y lector de pantalla. | 🟡 intermedio | 🚧 Esqueleto |
| [092](092-los-tres-modelos-de-reactividad/README.md) | [Los tres modelos de reactividad](092-los-tres-modelos-de-reactividad/README.md) | Explicar por qué el mismo cambio actualiza cosas distintas en cada framework. | 🔴 avanzado | 🚧 Esqueleto |

## 🎬 Las tecnologías que aparecen

Entre paréntesis, en cuántas clases de esta parte interviene cada una. **Estar aquí no es una recomendación**: es que el problema de esa clase existe de verdad para esa tecnología.

| Ecosistema | Tecnologías |
| --- | --- |
| **JavaScript/TypeScript** | [React](../../atlas/fichas/react.md) (12), [Svelte](../../atlas/fichas/svelte.md) (12), [Vue](../../atlas/fichas/vue.md) (11), [SolidJS](../../atlas/fichas/solid.md) (10), [Lit](../../atlas/fichas/lit.md) (4) |
| **JavaScript** | [Alpine.js](../../atlas/fichas/alpinejs.md) (5), [htmx](../../atlas/fichas/htmx.md) (5) |
| **Python** | [Django](../../atlas/fichas/django.md) (2), [Flask](../../atlas/fichas/flask.md) (1) |
| **TypeScript** | [Angular](../../atlas/fichas/angular.md) (5) |
| **PHP** | [Laravel](../../atlas/fichas/laravel.md) (2) |
| **Ruby** | [Ruby on Rails](../../atlas/fichas/rails.md) (2) |
| **.NET** | [ASP.NET Core](../../atlas/fichas/aspnet-core.md) (1) |
| **Node.js** | [Express](../../atlas/fichas/express.md) (1) |
| **JVM** | [Spring Boot](../../atlas/fichas/spring-boot.md) (1) |

## 📖 Las palabras que esta parte define

[**Escapado**](../../glosario/README.md#escapado) · [**Enviar-redirigir-mostrar**](../../glosario/README.md#enviar-redirigir-mostrar) · [**Mejora progresiva**](../../glosario/README.md#mejora-progresiva) · [**Componente**](../../glosario/README.md#componente) · [**Propiedad**](../../glosario/README.md#propiedad) · [**Evento**](../../glosario/README.md#evento) · [**Estado**](../../glosario/README.md#estado) · [**Clave de lista**](../../glosario/README.md#clave-de-lista) · [**Formulario controlado**](../../glosario/README.md#formulario-controlado) · [**Efecto**](../../glosario/README.md#efecto) · [**Estado compartido**](../../glosario/README.md#estado-compartido) · [**Estado del servidor**](../../glosario/README.md#estado-del-servidor) · [**Reactividad**](../../glosario/README.md#reactividad) · [**DOM virtual**](../../glosario/README.md#dom-virtual) · [**Señal**](../../glosario/README.md#señal)

Todas, con su definición, en el [glosario](../../glosario/README.md).

## ✅ Cómo se ejecuta una clase de esta parte

```bash
node scripts/run-class.mjs 079
```

El verificador arranca cada implementación, la somete a su `contrato.json` y **declara cuáles omitió** por no encontrar su cadena de herramientas. Si te faltan cadenas, `node scripts/doctor.mjs` dice cuáles y cómo se instalan.

## ➡️ Y después

La parte 7 junta los dos lados: dónde se genera el HTML y quién carga los datos.
