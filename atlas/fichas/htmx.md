# 🔁 htmx — 2020

> [⬅️ Atlas](../README.md) · [🟨 Ecosistema JavaScript](../ecosistemas/javascript.md) · [🗂️ Índice](../frameworks.md)

htmx es la propuesta más contracorriente del Atlas y la que mejor cierra su
argumento: **la evolución del campo no es una línea recta hacia el navegador**.
Veinte años después de que jQuery añadiera comportamiento a HTML mediante
atributos, htmx hace lo mismo — y esta vez con una teoría detrás.

Su tesis: la mayoría de las aplicaciones que se construyeron como página única
podrían haberse construido con **HTML como formato de respuesta**, y el sector
tomó ese desvío por costumbre más que por necesidad.

> **🎯 Por qué está en este programa**
>
> **Porque obliga a defender una decisión que casi nadie defiende**
> ([módulo 04](../../curriculum/04-fullstack-y-renderizado.md)). Preguntar «¿por
> qué esta pantalla necesita estado en el cliente?» y no tener respuesta es un
> resultado del programa tan válido como cualquier implementación.
>
> **Y porque devuelve al primer plano el trabajo de Roy Fielding**
> ([módulo 01](../../curriculum/01-http-eventos-y-contratos.md) y
> [módulo 05](../../curriculum/05-backend-y-api.md)): la restricción de hipermedia
> que define REST, y que casi ninguna API llamada «REST» cumple.

| | |
|---|---|
| **Aparición** | 2020, creado por Carson Gross (sucesor de intercooler.js, 2013) |
| **Clasificación** | `hypermedia-library` — biblioteca, no framework |
| **Ecosistema** | JavaScript (sin fase de construcción) |
| **Licencia** | `BSD-2-Clause` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://htmx.org/docs/> |

---

## 📜 El diagnóstico

El camino habitual desde 2015 para una pantalla con cualquier interacción era
este:

1. El servidor expone una API JSON.
2. El cliente descarga una aplicación que sabe pedir ese JSON.
3. El cliente mantiene una copia del estado y lo sincroniza.
4. El cliente decide cómo se convierte ese estado en HTML.

htmx observa que ese camino **duplica el modelo de datos y la lógica de
presentación en dos sitios**, y que para muchas pantallas —un listado con
filtros, un formulario, una tabla con paginación— ese coste no compra nada.

## 💡 La idea: cualquier elemento, cualquier verbo, cualquier evento

HTML nativo solo sabe hacer peticiones de dos formas: un enlace hace `GET` y
reemplaza la página entera, y un formulario hace `GET` o `POST` y reemplaza la
página entera. htmx generaliza eso:

```html
<!-- Cualquier elemento puede hacer cualquier petición, disparada por cualquier
     evento, y reemplazar cualquier parte de la página. -->
<button hx-post="/tareas/7/completar"
        hx-target="#fila-7"
        hx-swap="outerHTML">
  Completar
</button>

<!-- Búsqueda con retardo: el servidor devuelve las filas ya renderizadas -->
<input type="search" name="q"
       hx-get="/tareas/buscar"
       hx-trigger="input changed delay:300ms"
       hx-target="#resultados">
<tbody id="resultados"><!-- lo que llega es HTML, no JSON --></tbody>
```

El servidor responde **con el fragmento de HTML ya renderizado**. No hay modelo
en el cliente, no hay plantilla en el cliente, no hay sincronización. El estado
vive donde ya vivía.

## 🧠 La teoría: hipermedia de verdad

Aquí es donde htmx se separa de una simple biblioteca de comodidad. Su
planteamiento se apoya en la tesis doctoral en la que Roy Fielding definió REST,
y en particular en la restricción que casi todo el sector ignora: **el hipermedia
como motor del estado de la aplicación** [@fielding-rest-dissertation].

La idea es que la respuesta del servidor no debe ser solo datos, sino datos **más
las acciones posibles**. El cliente no necesita saber de antemano qué se puede
hacer con un recurso: la respuesta se lo dice.

| | API JSON típica | Hipermedia |
| --- | --- | --- |
| Respuesta | `{"id":7,"done":false}` | HTML con el estado **y** el botón de completar |
| Quién sabe qué acciones existen | El cliente, cableado | El servidor, en cada respuesta |
| Al añadir una acción | Desplegar cliente y servidor | Solo el servidor |
| Acoplamiento | Cliente y servidor comparten modelo | El cliente solo entiende HTML |

Los autores desarrollan el argumento completo —incluyendo cuándo **no** aplica—
en un libro que además es la mejor introducción disponible al concepto
[@gross-hypermedia-systems], y en una colección de ensayos que discute los casos
límite con honestidad poco frecuente [@htmx-essays].

**Consecuencia incómoda para el módulo 05:** casi ninguna API llamada «REST» lo
es en el sentido de Fielding, porque casi ninguna cumple la restricción de
hipermedia. La mayoría son API HTTP con recursos, que es una cosa distinta y
perfectamente legítima — pero conviene llamarla por su nombre
[@richardson-amundsen-restful].

## ⚖️ Cuándo encaja y cuándo no

Los propios autores son explícitos, y eso les da credibilidad:

### Encaja bien

- Aplicaciones **con mucho contenido y formularios**: paneles internos, gestores,
  comercio, sitios editoriales con interacción.
- Equipos **pequeños o de perfil de servidor**, que evitan mantener dos bases de
  código y dos modelos.
- Productos donde **la latencia de red es aceptable** para cada interacción.

### No encaja

- Interacción **de estado local intenso**: un editor de texto, una herramienta de
  dibujo, un juego. Ir al servidor por cada pulsación no es viable.
- **Funcionamiento sin conexión** real, con cola de operaciones y resolución de
  conflictos: ahí hace falta el modelo del
  [módulo 09](../../curriculum/09-movil-escritorio-y-offline.md).
- Cuando el **mismo backend sirve a una aplicación móvil nativa**, que necesita
  datos y no fragmentos de HTML.

Esa última fila es la objeción más seria y merece decirse claro: si hay clientes
que no son navegadores, el servidor necesita **también** una API de datos. La
respuesta de htmx es que ambas cosas pueden coexistir; la contrapartida es que
hay que mantener dos superficies.

## 🧭 Tres respuestas al mismo exceso

htmx no está solo. La quinta era del [Atlas](../README.md#las-cinco-eras) reúne
tres diagnósticos parecidos con soluciones distintas:

| | htmx | Astro | Qwik |
| --- | --- | --- | --- |
| Diagnóstico | El estado no debía salir del servidor | Se envía JavaScript innecesario | La hidratación es cara |
| Solución | HTML como respuesta | Cero por omisión, islas explícitas | Reanudar en vez de reconstruir |
| Coste | Latencia por interacción | Estado compartido entre islas | Modelo mental nuevo |

Y a su lado, con la misma filosofía y otro punto de partida: **Turbo** en Rails y
**LiveView** en Phoenix.

## 🎓 Las tres lecciones

**1. El campo avanza en péndulo, no en línea recta.** Quien solo conoce la era en
la que empezó confunde su punto de partida con el estado natural de las cosas.

**2. Una decisión por omisión no es una decisión.** «Hacemos una aplicación de
página única» debería exigir la misma justificación que cualquier otra opción del
módulo 04. Que htmx exista obliga a escribir esa justificación.

**3. Leer la fuente original cambia el vocabulario.** Casi todo el sector usa
«REST» para algo que Fielding no llamó así. No es pedantería: distinguir API HTTP
de hipermedia cambia cómo se diseña el contrato y a qué se acopla el cliente.

## 🔗 Enlaces

- Documentación oficial: <https://htmx.org/docs/>
- [Ecosistema JavaScript](../ecosistemas/javascript.md) · [Ficha de jQuery](jquery.md) — el círculo que cierra
- [Módulo 04](../../curriculum/04-fullstack-y-renderizado.md) — decidir la estrategia por contenido

## Fuentes

- [@gross-hypermedia-systems] Gross, Carson; Stepinski, Adam; Akşimşek, Deniz. *Hypermedia Systems*. Big Sky Software, 2024. ISBN 9798990991804 — <https://openlibrary.org/isbn/9798990991804>
- [@richardson-amundsen-restful] Richardson, Leonard; Amundsen, Mike; Ruby, Sam. *RESTful Web APIs*. O'Reilly Media, 2013. ISBN 9781449358068 — <https://openlibrary.org/isbn/9781449358068>
- [@fielding-rest-dissertation] Fielding, Roy T. *Architectural Styles and the Design of Network-based Software Architectures*. University of California, Irvine, 2000 — <https://ics.uci.edu/~fielding/pubs/dissertation/top.htm>
- [@htmx-essays] Gross, Carson. *htmx Essays* — <https://htmx.org/essays/>
