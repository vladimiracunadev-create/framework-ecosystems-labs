# Parte 2 — La tubería: middleware, filtros e interceptores

> [⬅️ Parte 1](../parte-1-responder/README.md) · [🎓 Todas las clases](../README.md) · [📖 Glosario](../../glosario/README.md) · [Parte 3 ➡️](../parte-3-validacion-y-contrato/README.md)

**Todo lo que ocurre entre que llega la petición y se ejecuta tu código. El mismo patrón con cinco nombres distintos.**

**Clases 26 a 38** · 13 en total · 13 construidas · 11 tecnologías en juego.

## 🧭 De qué va esta parte

Entre que la petición llega y tu función se ejecuta pasan cosas. **Esta parte es esas cosas.**

El patrón se llama de muchas maneras —middleware, capa, filtro, interceptor, gancho— y en el fondo es siempre el mismo: una pieza que envuelve a otra, hace su parte y decide si continúa. Trece clases para verlo en diez frameworks, y para entender por qué el orden en que se registran cambia el comportamiento.

Es la parte donde el programa deja de ser sobre HTTP y empieza a ser sobre **arquitectura**. Registro, correlación, errores, plazos, límites y cabeceras de seguridad no son funciones que se llaman: son decisiones que se toman una vez y se aplican a todo.

## 🎒 Qué da por sabido

- La parte 1 entera, y en particular los códigos de estado y las cabeceras.
- Que registrar un manejador no es llamarlo (clase 002).

## 🎯 Qué sabrás hacer al terminarla

- Escribir una capa transversal en cualquiera de los diez frameworks y saber en qué fase entra.
- Explicar por qué en Starlette hay que registrar las capas al revés, y qué fallo silencioso produce olvidarlo.
- Cortar la cadena para rechazar una petición sin que el manejador llegue a ejecutarse — y demostrarlo con un contador.
- Emitir un registro por petición que sirva para diagnosticar: con el estado final, la duración y un identificador que cruce servicios.
- Convertir cualquier excepción en una respuesta del contrato en un solo punto, sin que ninguna ruta lo sepa.
- Poner plazos, límites de tamaño y límites de tasa, y saber cuáles cancelan de verdad y cuáles solo dejan de esperar.

## 🧵 Por qué en este orden

Las tres primeras enseñan el mecanismo: qué es una capa (026), por qué el orden importa (027) y cómo se corta (028).

Las siete del medio son las capas que toda aplicación acaba teniendo: registro, correlación, errores, plazos, tamaño, tasa y cabeceras de seguridad. En ese orden porque cada una necesita la anterior.

Las tres últimas son la consecuencia arquitectónica de la inversión de control: si el framework construye tus objetos, tiene que saber cómo (036), cuánto viven (037) y a qué altura se engancha el comportamiento transversal (038).

## 📚 Las clases

| # | Clase | Qué resuelve | Nivel | Estado |
| --- | --- | --- | --- | --- |
| [026](026-el-patron-middleware/README.md) | [El patrón middleware](026-el-patron-middleware/README.md) | Reconocer la cadena de responsabilidad detrás de cinco nombres distintos. | 🟢 introductorio | ✅ Construida |
| [027](027-el-orden-importa/README.md) | [El orden importa](027-el-orden-importa/README.md) | Predecir el efecto del orden de registro. | 🟡 intermedio | ✅ Construida |
| [028](028-terminacion-temprana/README.md) | [Terminación temprana](028-terminacion-temprana/README.md) | Cortar la cadena sin llegar al manejador. | 🟡 intermedio | ✅ Construida |
| [029](029-registro-de-peticiones/README.md) | [Registro de peticiones](029-registro-de-peticiones/README.md) | Emitir una línea por petición con lo que sirve para diagnosticar. | 🟢 introductorio | ✅ Construida |
| [030](030-identificador-de-correlacion/README.md) | [Identificador de correlación](030-identificador-de-correlacion/README.md) | Seguir una petición a través de varios servicios. | 🟡 intermedio | ✅ Construida |
| [031](031-manejo-centralizado-de-errores/README.md) | [Manejo centralizado de errores](031-manejo-centralizado-de-errores/README.md) | Convertir cualquier excepción en una respuesta del contrato. | 🟡 intermedio | ✅ Construida |
| [032](032-tiempos-de-espera/README.md) | [Tiempos de espera](032-tiempos-de-espera/README.md) | No dejar que una petición lenta retenga un recurso para siempre. | 🟡 intermedio | ✅ Construida |
| [033](033-limite-de-tamano-del-cuerpo/README.md) | [Límite de tamaño del cuerpo](033-limite-de-tamano-del-cuerpo/README.md) | Rechazar lo excesivo antes de leerlo entero. | 🟡 intermedio | ✅ Construida |
| [034](034-limitacion-de-tasa/README.md) | [Limitación de tasa](034-limitacion-de-tasa/README.md) | Proteger el servicio del uso excesivo, legítimo o no. | 🔴 avanzado | ✅ Construida |
| [035](035-cabeceras-de-seguridad/README.md) | [Cabeceras de seguridad](035-cabeceras-de-seguridad/README.md) | Aplicar las defensas que el navegador respeta si se las pides. | 🟡 intermedio | ✅ Construida |
| [036](036-inyeccion-de-dependencias/README.md) | [Inyección de dependencias](036-inyeccion-de-dependencias/README.md) | Recibir las colaboraciones en lugar de construirlas. | 🟡 intermedio | ✅ Construida |
| [037](037-ciclo-de-vida-de-los-objetos/README.md) | [Ciclo de vida de los objetos](037-ciclo-de-vida-de-los-objetos/README.md) | Elegir entre única instancia, por petición o por uso, y ver la diferencia. | 🔴 avanzado | ✅ Construida |
| [038](038-middleware-decorador-y-aspecto/README.md) | [Middleware, decorador y aspecto](038-middleware-decorador-y-aspecto/README.md) | Distinguir tres formas de envolver comportamiento y cuándo usar cada una. | 🔴 avanzado | ✅ Construida |

## 🎬 Las tecnologías que aparecen

Entre paréntesis, en cuántas clases de esta parte interviene cada una. **Estar aquí no es una recomendación**: es que el problema de esa clase existe de verdad para esa tecnología.

| Ecosistema | Tecnologías |
| --- | --- |
| **Python** | [FastAPI](../../atlas/fichas/fastapi.md) (12), [Django](../../atlas/fichas/django.md) (1), [Flask](../../atlas/fichas/flask.md) (1) |
| **Node.js** | [Express](../../atlas/fichas/express.md) (10), [Fastify](../../atlas/fichas/fastify.md) (1) |
| **.NET** | [ASP.NET Core](../../atlas/fichas/aspnet-core.md) (13) |
| **JVM** | [Spring Boot](../../atlas/fichas/spring-boot.md) (13) |
| **PHP** | [Laravel](../../atlas/fichas/laravel.md) (3) |
| **Node.js/TypeScript** | [NestJS](../../atlas/fichas/nestjs.md) (3) |
| **Go** | [Gin](../../atlas/fichas/gin.md) (1) |
| **Ruby** | [Ruby on Rails](../../atlas/fichas/rails.md) (1) |

## 📖 Las palabras que esta parte define

[**Middleware**](../../glosario/README.md#middleware) · [**Almacén por petición**](../../glosario/README.md#almacén-por-petición) · [**Terminación temprana**](../../glosario/README.md#terminación-temprana) · [**Identificador de correlación**](../../glosario/README.md#identificador-de-correlación) · [**Limitación de tasa**](../../glosario/README.md#limitación-de-tasa) · [**Contenedor de dependencias**](../../glosario/README.md#contenedor-de-dependencias) · [**Ámbito**](../../glosario/README.md#ámbito) · [**Aspecto**](../../glosario/README.md#aspecto) · [**Decorador**](../../glosario/README.md#decorador)

Todas, con su definición, en el [glosario](../../glosario/README.md).

## ✅ Cómo se ejecuta una clase de esta parte

```bash
node scripts/run-class.mjs 026
```

El verificador arranca cada implementación, la somete a su `contrato.json` y **declara cuáles omitió** por no encontrar su cadena de herramientas. Si te faltan cadenas, `node scripts/doctor.mjs` dice cuáles y cómo se instalan.

## ➡️ Y después

La parte 3 pasa de la tubería al contrato: qué entra, con qué forma, y qué se responde cuando no encaja.
