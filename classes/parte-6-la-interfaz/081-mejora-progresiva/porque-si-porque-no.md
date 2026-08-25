# Por qué sí y por qué no — Mejora progresiva

> [⬅️ Clase 081](README.md) · [📚 Parte 6](../README.md)

| Framework | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [htmx](../../../atlas/fichas/htmx.md) | El patrón ES su tesis: atributos sobre HTML funcional, servidor dueño del render | Interacciones ricas del lado cliente (arrastrar, edición en vivo) le quedan lejos | Aceptar el viaje al servidor como unidad de interacción |
| [Alpine.js](../../../atlas/fichas/alpinejs.md) | Mejora quirúrgica sin paso de compilación: un script y atributos | Las expresiones en atributos crecen mal: lo que empieza en una línea acaba pidiendo un framework | Saber parar antes de reescribir React dentro de atributos HTML |
| [React](../../../atlas/fichas/react.md) | Server Actions formalizó el patrón: `<form action>` como caso base de primera clase | El patrón completo vive en el meta-framework; React solo no lo trae | Next.js (u otro) para que la promesa sea real |
| [Svelte](../../../atlas/fichas/svelte.md) | `use:enhance` es la versión más literal del elenco: intercepta TU formulario y si no está, el formulario queda | Igual: la pieza es de SvelteKit, no de Svelte | El meta-framework como parte del trato |

## 🧭 El hallazgo

Los cuatro llegan al mismo patrón desde extremos opuestos. htmx y Alpine
**parten del HTML** y le suben comportamiento; React y Svelte **parten del
componente** y sus meta-frameworks les bajaron el formulario clásico como
caso base — Server Actions y form actions son, literalmente, la clase 080
readmitida en el mundo de los componentes.

Que los dos extremos converjan aquí no es casualidad: es la corrección de una
década. La generación SPA hizo del JavaScript un requisito y pagó el precio
—pantallas en blanco, arañas ciegas, formularios muertos con la red lenta— y
la respuesta de la industria fue recuperar el caso base sin renunciar a la
mejora [@gross-hypermedia-systems]. Esta clase es ese punto de acuerdo.

## ⚖️ La frontera del fragmento

La decisión técnica que parte el elenco —¿el servidor devuelve HTML o
datos?— es menos estética de lo que parece:

- **HTML de vuelta** (htmx): una sola fuente de renderizado, la del
  servidor (clase 079). El cliente no duplica plantillas — pero cada
  interacción viaja.
- **Datos de vuelta** (Alpine, React, Svelte): el cliente renderiza, y por
  tanto **tiene plantillas propias**. Nace la duplicación servidor/cliente
  que las clases siguientes gestionarán — y con ella el estado del cliente,
  la hidratación y todo el mundo de la parte 6.

Ninguna es gratis. La pregunta útil no es cuál es mejor sino **cuántas
interacciones por página** hay: pocas y gruesas favorecen HTML; muchas y
finas, datos. Y la trampa clásica es decidirlo por identidad de equipo en
vez de por la página que se está construyendo.

## Fuentes

- [@gross-hypermedia-systems] Gross, C.; Stepinski, A.; Akşimşek, D. *Hypermedia Systems*. Big Sky Software, 2024. ISBN 9798990991804 — <https://openlibrary.org/isbn/9798990991804>
- [@htmx-essays] *htmx Essays*. — <https://htmx.org/essays/>
- [@react-server-components] *React Server Components*. React — <https://react.dev/reference/rsc/server-components>
