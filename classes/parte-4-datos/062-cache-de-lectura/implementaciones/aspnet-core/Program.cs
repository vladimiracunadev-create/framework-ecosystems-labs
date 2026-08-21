using System.Collections.Concurrent;
using Microsoft.Extensions.Caching.Memory;

var constructor = WebApplication.CreateBuilder(args);

// ASP.NET Core trae `IMemoryCache` de serie, pero hay que pedirla: sin esta
// línea, inyectarla falla al arrancar. Es una caché EXPLÍCITA —se llama a mano,
// como el `Map` de Express— y a la vez del framework, con caducidad, tamaño
// máximo y desalojo incorporados.
constructor.Services.AddMemoryCache();

var app = constructor.Build();

// EL ALMACÉN. Aquí hace de base de datos, y lo único que importa de él es que
// cada lectura CUESTA — por eso se cuentan.
var almacen = new ConcurrentDictionary<int, Tarea>();
var consultas = 0;
var aciertos = 0;

void ReiniciarDatos()
{
    almacen.Clear();
    almacen[1] = new Tarea(1, "comprar pan");
    consultas = 0;
    aciertos = 0;
}

ReiniciarDatos();

Tarea? LeerDelAlmacen(int id)
{
    Interlocked.Increment(ref consultas);
    return almacen.TryGetValue(id, out var tarea) ? tarea : null;
}

app.MapGet("/reiniciar", (IMemoryCache cache) =>
{
    // `IMemoryCache` no tiene «vaciar»: hay que quitar las claves que conoces.
    // Es una limitación real, y la razón de que en producción se use un prefijo
    // de versión en la clave para invalidar en bloque.
    foreach (var id in almacen.Keys) cache.Remove(id);
    cache.Remove(1);
    ReiniciarDatos();
    return Results.Json(new { consultas, aciertos });
});

app.MapGet("/metricas", () => Results.Json(new { consultas, aciertos }));

// LEER PASANDO POR LA CACHÉ: mirar, y si no está, consultar y guardar.
app.MapGet("/tareas/{id:int}", (IMemoryCache cache, int id) =>
{
    if (cache.TryGetValue(id, out Tarea? guardada) && guardada is not null)
    {
        Interlocked.Increment(ref aciertos);
        return Results.Json(new { id = guardada.Id, titulo = guardada.Titulo });
    }

    var tarea = LeerDelAlmacen(id);
    if (tarea is null) return Results.Json(new { code = "NO_EXISTE" }, statusCode: 404);

    // Una caducidad, siempre. Sin ella, una entrada que nadie invalide se queda
    // ahí para siempre y la memoria del proceso solo crece.
    cache.Set(id, tarea, TimeSpan.FromMinutes(5));
    return Results.Json(new { id = tarea.Id, titulo = tarea.Titulo });
});

// LEER SIN PASAR POR LA CACHÉ: la verdad, para poder compararla.
app.MapGet("/sin-cache/tareas/{id:int}", (int id) =>
{
    var tarea = LeerDelAlmacen(id);
    return tarea is null
        ? Results.Json(new { code = "NO_EXISTE" }, statusCode: 404)
        : Results.Json(new { id = tarea.Id, titulo = tarea.Titulo });
});

// ESCRIBIR E INVALIDAR. Las dos cosas, y en este orden.
app.MapPatch("/tareas/{id:int}", (IMemoryCache cache, int id, Cambio cambio) =>
{
    if (!almacen.TryGetValue(id, out var actual))
    {
        return Results.Json(new { code = "NO_EXISTE" }, statusCode: 404);
    }

    var nueva = actual with { Titulo = cambio.Titulo ?? actual.Titulo };
    almacen[id] = nueva;
    // QUITAR, no reescribir. Escribir el valor nuevo en la caché parece más
    // eficiente y abre una carrera: dos escrituras a la vez pueden dejar
    // guardado el valor de la que perdió. Quitar solo puede causar una consulta
    // de más.
    cache.Remove(id);
    return Results.Json(new { id = nueva.Id, titulo = nueva.Titulo });
});

// ESCRIBIR Y OLVIDAR LA INVALIDACIÓN.
//
// No falla nada. Simplemente, a partir de aquí, la caché devuelve un valor que
// ya no existe en ninguna parte — y lo hará hasta que caduque.
app.MapPost("/escribir-sin-invalidar", (Cambio cambio) =>
{
    almacen[1] = almacen[1] with { Titulo = cambio.Titulo ?? almacen[1].Titulo };
    return Results.Json(new { ok = true });
});

app.Run();

record Cambio(string? Titulo);

record Tarea(int Id, string Titulo);
