using System.Collections.Concurrent;

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

var tareas = new ConcurrentDictionary<string, object>();
tareas["1"] = new { id = "1", titulo = "original" };
var siguiente = 99;

// `Results.Created(uri, valor)` emite el 201 y la cabecera Location a la vez.
app.MapPost("/tareas", (Cuerpo? cuerpo) =>
{
    var id = Interlocked.Increment(ref siguiente).ToString();
    tareas[id] = new { id, titulo = cuerpo?.Titulo ?? "" };
    return Results.Created($"/tareas/{id}", new { id });
});

app.MapDelete("/tareas/{id}", (string id) =>
    tareas.TryRemove(id, out _)
        ? Results.NoContent()
        : Results.Json(new { error = "no existe" }, statusCode: 404));

app.MapGet("/tareas/{id}", (string id) =>
    tareas.TryGetValue(id, out var tarea)
        ? Results.Json(tarea)
        : Results.Json(new { error = "no existe" }, statusCode: 404));

app.Run();

record Cuerpo(string? Titulo);
