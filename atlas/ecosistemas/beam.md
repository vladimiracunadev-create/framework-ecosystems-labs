# 💜 BEAM — Elixir y Erlang

> [⬅️ Atlas](../README.md) · [🗂️ Índice](../frameworks.md) · [🧭 Taxonomía](../../docs/TAXONOMY.md)

**Dos entradas, y el argumento más fuerte del Atlas a favor de mirar el runtime
antes que el framework.** Aquí las propiedades que en otros ecosistemas se
compran con infraestructura —aislamiento de fallos, concurrencia masiva,
actualización sin parar el servicio— vienen de la máquina virtual.

## Por qué este ecosistema es como es

| Condición de la plataforma | Consecuencia en sus frameworks |
| --- | --- |
| **Procesos ligeros** aislados, cientos de miles por nodo | Una conexión abierta por usuario es viable; en otros ecosistemas es un problema de arquitectura |
| **Aislamiento de fallos**: un proceso cae sin arrastrar a los demás | La cultura es «deja que falle y supervisa», no «evita todo fallo» |
| **Árboles de supervisión** en la plataforma | Reinicio y recuperación son primitivas del runtime, no una capa que añadas |
| Diseñada para **telefonía**, con décadas de disponibilidad continua | Actualización del código en caliente, sin detener el servicio |
| Comunidad pequeña | Menos opciones, menos rotación, documentación más consistente |

## Phoenix y LiveView

**Phoenix** (2014) parece un framework web convencional: enrutado, vistas,
contextos, ORM. Su diferencia no está en la API sino debajo — la concurrencia y
la tolerancia a fallos las pone la máquina virtual.

**LiveView** (2019) es la consecuencia interesante. Mantiene el **estado de la
interfaz en el servidor** y envía por WebSocket solo las diferencias del HTML. El
navegador apenas ejecuta código propio de la aplicación.

Eso solo es viable si una conexión abierta y con estado por usuario es barata. En
la mayoría de los ecosistemas no lo es; en la BEAM sí. **La arquitectura de la
interfaz acabó determinada por una propiedad del runtime**, que es exactamente la
lección del [módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md): el
runtime no es un detalle de instalación.

## Cómo se compara con lo demás

| Enfoque | Dónde vive el estado | Qué se envía | Requisito |
| --- | --- | --- | --- |
| Aplicación de página única | Navegador | JSON | JavaScript en el cliente |
| htmx / Turbo | Servidor | Fragmentos de HTML por petición | Ninguno especial |
| **LiveView** | Servidor | Diferencias de HTML por WebSocket | Conexión con estado barata |

Las tres columnas resuelven el mismo problema. La tercera solo está disponible si
elegiste esta plataforma, y esa es una decisión que se toma antes que la del
framework.

## Las 2 tecnologías

<!-- generado:tabla-ecosistema beam -->
| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**Phoenix**](../fichas/phoenix.md) | `full-stack-framework` | 2014 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://hexdocs.pm/phoenix/overview.html) |
| **Phoenix LiveView** | `realtime-ui-framework` | 2019 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://hexdocs.pm/phoenix_live_view/) |
<!-- fin -->

## Qué aportó cada una

<!-- generado:notas-ecosistema beam -->
- **Phoenix** — Aprovecha la máquina virtual de Erlang para manejar cientos de miles de conexiones simultáneas con tolerancia a fallos.
- **Phoenix LiveView** — Interfaz interactiva con el estado en el servidor y diferencias enviadas por WebSocket. La alternativa más completa a la aplicación de página única.
<!-- fin -->
