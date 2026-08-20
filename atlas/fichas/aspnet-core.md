# 🟦 ASP.NET Core — 2016

> [⬅️ Atlas](../README.md) · [🟦 Ecosistema .NET](../ecosistemas/dotnet.md) · [🗂️ Índice](../frameworks.md)

ASP.NET Core es la reescritura multiplataforma y de código abierto de la pila web
de Microsoft. Es **uno de los cinco laboratorios ejecutables** del programa, y el
que mejor muestra cómo un ecosistema con un único proveedor puede corregir el
rumbo por completo sin dejar de dar soporte al anterior.

| | |
|---|---|
| **Aparición** | 2016 |
| **Clasificación** | `web-framework` |
| **Ecosistema** | .NET (C#) |
| **Licencia** | `MIT` |
| **Gobierno** | Microsoft y .NET Foundation |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://learn.microsoft.com/aspnet/core/> |

---

## 💡 Middleware e inyección, en la caja

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<IRepositorioDeTareas, RepositorioSql>();   // contenedor propio

var app = builder.Build();
app.UseAuthentication();     // el orden de la cadena ES la arquitectura
app.UseAuthorization();
app.MapPost("/tasks", async (CrearTarea entrada, IRepositorioDeTareas repo) => { /* ... */ });
app.Run();
```

Dos piezas del [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md)
vienen integradas: **cadena de middleware con orden explícito** e **inyección de
dependencias con alcances** —singleton, por petición, transitorio— con la misma
semántica y las mismas trampas que el módulo describe
[@freeman-pro-aspnet-core].

Las **API mínimas** trajeron además el estilo de los microframeworks a un
ecosistema que venía de controladores y atributos: el mismo framework admite hoy
los dos estilos.

## 🧪 Lo que reveló implementar el contrato

En el [laboratorio 05](../../labs/05-aspnet-core/README.md), ASP.NET Core cumple
las 20 pruebas de aceptación. Tres hallazgos concretos:

**1. El enlace automático de modelo choca con el orden del contrato.** Igual que
en [Spring Boot](spring-boot.md): el contrato exige comprobar tamaño, tipo y
clave de idempotencia **antes** de analizar el cuerpo, así que el cuerpo se lee a
mano.

**2. Las lecturas síncronas están prohibidas por omisión.** Comprobar el final
del flujo con `EndOfStream` lanza excepción: el framework impide bloquear el hilo
de la petición. Es una decisión de diseño excelente y una sorpresa la primera vez.

**3. Mucho viene gratis.** `camelCase` en el JSON, `Location` en el `201`,
`MapFallback` para la ruta desconocida. Lo que hubo que añadir a mano fue el
`405` con cabecera `Allow`.

## ⚖️ Lo que hay que declarar

**Un proveedor marca el ritmo.** Versiones anuales con calendario de soporte
publicado. Eso da previsibilidad —se sabe hasta cuándo hay parches— y significa
que el rumbo no se negocia.

**La migración desde .NET Framework fue larga.** Junto con la de
[AngularJS](angularjs.md), es uno de los dos grandes casos documentados del
[módulo 10](../../curriculum/10-modernizacion-y-migracion.md).

## 🎓 Las dos lecciones

**1. Un ecosistema con un solo proveedor puede corregir el rumbo por completo.**
Menos fragmentación, y dependencia de las prioridades de una empresa.

**2. Prohibir lo peligroso por omisión es mejor que documentarlo.** Impedir la
lectura síncrona evita una clase entera de errores de rendimiento.

## 🔗 Enlaces

- Documentación oficial: <https://learn.microsoft.com/aspnet/core/>
- [Laboratorio 05](../../labs/05-aspnet-core/README.md) · [Ficha de ASP.NET Web Forms](aspnet-webforms.md) · [Ficha de Spring Boot](spring-boot.md)
- [Módulo 02](../../curriculum/02-arquitectura-de-frameworks.md)

## Fuentes

- [@freeman-pro-aspnet-core] Freeman, Adam. *Pro ASP.NET Core 7*. Manning Publications, 2023. ISBN 9781633437821 — <https://openlibrary.org/isbn/9781633437821>
