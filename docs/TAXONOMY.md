# Taxonomía

## Definiciones operativas

| Término | Responsabilidad dominante | Ejemplo |
| --- | --- | --- |
| Lenguaje | sintaxis y semántica de programas | Python, Java, Rust |
| Runtime | ejecuta código y ofrece servicios base | Node.js, JVM, .NET |
| Biblioteca | el código de la aplicación la invoca | React, cliente HTTP |
| Framework | controla parte del ciclo e invoca la aplicación | Angular, Django |
| Metaframework | integra UI, routing, renderizado y servidor sobre otro ecosistema | Next.js, Nuxt, SvelteKit |
| SDK | herramientas y API para una plataforma | Flutter SDK, Android SDK |
| Toolkit UI | componentes y modelo para interfaces | Jetpack Compose |
| ORM | mapea y coordina persistencia | Hibernate, Eloquent |
| CMS | producto configurable para gestionar contenido | no equivale a un framework general |
| Plataforma | ejecución, despliegue y servicios integrados | proveedor o PaaS |

Las fronteras pueden solaparse. Debe usarse la autodefinición oficial junto con el comportamiento técnico, no una etiqueta heredada.

## Las etiquetas del catálogo

Las definiciones de arriba son las generales. El catálogo del repositorio usa
treinta y siete etiquetas concretas —`web-framework`, `ui-library`, `orm`,
`react-metaframework`…— y **cada una está definida dentro de
[`catalog/frameworks.json`](../catalog/frameworks.json)**, junto a los datos que
clasifica, para que no puedan separarse.

La tabla completa, con cuántas tecnologías hay en cada categoría y ejemplos, se
publica en [el atlas](../atlas/frameworks.md#por-clasificación). La
[clase 004](../classes/parte-0-el-metodo/004-taxonomia-que-compite-de-verdad-con-que/README.md)
la verifica: si alguien reclasifica una entrada, se pone en rojo.

## Inversión de control

En una biblioteca, la aplicación decide cuándo llamar. En un framework, la aplicación registra piezas que el framework crea o invoca durante su ciclo. El grado varía: un framework minimalista puede controlar solo el transporte; uno de aplicación puede controlar módulos, dependencias, persistencia y construcción.

## Clasificación multidimensional

Además de `kind`, registra:

- lenguaje y runtime;
- destino de producto;
- ejecución cliente/servidor/dispositivo;
- opinión arquitectónica;
- modelo de extensibilidad;
- gobierno, licencia y soporte;
- madurez de herramientas y migraciones.

Una clasificación no es un ranking.
