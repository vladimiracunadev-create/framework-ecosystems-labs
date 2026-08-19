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
