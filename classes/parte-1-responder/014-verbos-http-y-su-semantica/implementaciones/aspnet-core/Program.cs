using System.Collections.Concurrent;

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

var tareas = new ConcurrentDictionary<string, object>();
tareas["1"] = new { id = "1", titulo = "original" };
var altas = 0;

app.MapGet("/tareas/{id}", (string id) =>
    tareas.TryGetValue(id, out var tarea) ? Results.Json(tarea) : Results.NotFound());

app.MapPut("/tareas/{id}", (string id, Cuerpo? cuerpo) =>
{
    var tarea = new { id, titulo = cuerpo?.Titulo ?? "" };
    tareas[id] = tarea;
    return Results.Json(tarea);
});

app.MapPost("/tareas", (Cuerpo? cuerpo) =>
{
    var n = Interlocked.Increment(ref altas);
    var id = $"nueva-{n}";
    tareas[id] = new { id, titulo = cuerpo?.Titulo ?? "" };
    return Results.Created($"/tareas/{id}", new { id, altas = n });
});

app.Run();

record Cuerpo(string? Titulo);
