# 🟦 .NET y C#

> [⬅️ Atlas](../README.md) · [🗂️ Índice](../frameworks.md) · [🧭 Taxonomía](../../docs/TAXONOMY.md)

El ecosistema donde **un solo proveedor marca la dirección**, con lo bueno y lo
malo que eso implica: migraciones grandes, pero anunciadas, documentadas y con
herramientas. Es también el que mejor ilustra el arco completo desde una
abstracción que oculta HTTP hasta una que lo abraza.

## Por qué este ecosistema es como es

| Condición de la plataforma | Consecuencia en sus frameworks |
| --- | --- |
| **Microsoft decide** el rumbo y publica calendario de soporte | Menos fragmentación; dependencia de las prioridades de una empresa |
| Historia de **compatibilidad con Windows** y luego apertura | Conviven piezas históricas atadas a Windows con otras multiplataforma |
| El lenguaje **evoluciona rápido** y los frameworks lo siguen | Las API mínimas de ASP.NET Core existen gracias a características recientes de C# |
| Herramientas **integradas** con el entorno de desarrollo | La experiencia por omisión es alta; el conocimiento de lo que hay debajo, menor |

## La línea del tiempo, o el arco de una abstracción

**2002 · Web Forms.** Trasladó el modelo de eventos del escritorio a la web:
botones con manejadores `Click`, estado conservado entre peticiones en un campo
oculto. Funcionó, y ocultó HTTP tan bien que una generación entera de
programadores no supo qué era un verbo ni un código de estado. Es el argumento
histórico exacto por el que el
[módulo 01](../../curriculum/01-http-eventos-y-contratos.md) enseña el protocolo
antes que ningún framework.

**2009 · ASP.NET MVC.** La corrección: rutas, verbos, vistas sin estado. Microsoft
adoptó el patrón que el resto del campo ya usaba, y publicó buena parte del
código bajo licencia abierta.

**2016 · ASP.NET Core.** Reescritura completa: multiplataforma, de código
abierto, con su propio contenedor de dependencias y su propia canalización de
middleware. La migración desde .NET Framework fue larga y cara — y es, junto con
la de AngularJS a Angular, uno de los dos casos de estudio de migración masiva
mejor documentados del campo.

**2018-2022 · Blazor y MAUI.** Componentes en C# ejecutados en WebAssembly **o**
en el servidor: el mismo modelo con dos lugares de ejecución, lo que lo convierte
en un banco de pruebas excepcional para el
[módulo 04](../../curriculum/04-fullstack-y-renderizado.md). **MAUI** recogió el
relevo de Xamarin para móvil y escritorio.

## El contraste que este ecosistema enseña mejor

**Entity Framework Core frente a Dapper** es la versión más limpia del
compromiso del [módulo 06](../../curriculum/06-persistencia-y-dominio.md):

| | Entity Framework Core | Dapper |
| --- | --- | --- |
| Escribes | Consultas en el lenguaje | SQL |
| Genera | La consulta | Nada; solo mapea el resultado |
| Migraciones | Incluidas | Aparte |
| Riesgo | Consultas generadas que no esperabas | Texto SQL que hay que mantener |
| Cuándo encaja | Dominio con muchas entidades relacionadas | Lecturas complejas y control fino |

Ambos son de Microsoft o de su órbita, ambos están mantenidos, y la elección no
es de calidad sino de qué quieres controlar.

## Las 10 tecnologías

<!-- generado:tabla-ecosistema dotnet -->
| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| **ASP.NET Web Forms** | `component-framework` | 2002 | 🌱 Pionero | ⚪ histórico | `NOASSERTION` | [oficial](https://learn.microsoft.com/aspnet/web-forms/) |
| **ASP.NET MVC** | `web-framework` | 2009 | 🏛️ Clásico | ⚪ histórico | `Apache-2.0` | [oficial](https://learn.microsoft.com/aspnet/mvc/) |
| **WPF** | `ui-framework` | 2006 | 🏛️ Clásico | 🟡 mantenimiento | `MIT` | [oficial](https://learn.microsoft.com/dotnet/desktop/wpf/) |
| **Xamarin** | `ui-framework` | 2011 | 🏛️ Clásico | ⚪ histórico | `MIT` | [oficial](https://learn.microsoft.com/xamarin/) |
| **ASP.NET Core** | `web-framework` | 2016 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://learn.microsoft.com/aspnet/core/) |
| **Avalonia** | `ui-framework` | 2020 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://docs.avaloniaui.net/) |
| **Blazor** | `component-framework` | 2018 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://learn.microsoft.com/aspnet/core/blazor/) |
| **Dapper** | `micro-orm` | 2011 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://github.com/DapperLib/Dapper) |
| **.NET MAUI** | `ui-framework` | 2022 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://learn.microsoft.com/dotnet/maui/) |
| **Entity Framework Core** | `orm` | 2016 | 🟢 Vigente | 🟢 activo | `MIT` | [oficial](https://learn.microsoft.com/ef/core/) |
<!-- fin -->

## Qué aportó cada una

<!-- generado:notas-ecosistema dotnet -->
- **ASP.NET Web Forms** — Trasladó el modelo de eventos del escritorio a la web mediante estado de vista en el servidor. Su abstracción sobre HTTP es el ejemplo clásico de por qué el módulo 01 enseña el protocolo primero.
- **ASP.NET MVC** — La respuesta de Microsoft al modelo-vista-controlador, y el paso intermedio entre Web Forms y ASP.NET Core.
- **WPF** — Introdujo el enlace de datos declarativo y el patrón modelo-vista-vista-modelo, que después migró a la web.
- **Xamarin** — Aplicaciones móviles nativas en C#. Su sustitución por .NET MAUI es una migración reciente y bien documentada que conviene leer.
- **ASP.NET Core** — Reescritura multiplataforma y de código abierto de la pila web de Microsoft. Sus API mínimas trajeron el estilo de los microframeworks al ecosistema .NET.
- **Avalonia** — Lleva el modelo de WPF fuera de Windows, con dibujo propio en todas las plataformas.
- **Blazor** — Componentes en C# ejecutados en WebAssembly o en el servidor. Permite comparar el mismo modelo de componentes con dos lugares de ejecución distintos.
- **Dapper** — Mapea resultados de SQL escrito a mano, sin generar consultas. La alternativa deliberada al mapeador completo.
- **.NET MAUI** — Sucesor de Xamarin.Forms con un único proyecto para móvil y escritorio.
- **Entity Framework Core** — Mapeador con migraciones y consultas integradas en el lenguaje. El contraste con Dapper ilustra el compromiso entre abstracción y control.
<!-- fin -->

## Para seguir

- [Laboratorio 05](../../labs/05-aspnet-core/README.md) — ASP.NET Core contra el contrato canónico.
- [Módulo 10](../../curriculum/10-modernizacion-y-migracion.md) — la migración de .NET Framework a .NET Core como caso real.
