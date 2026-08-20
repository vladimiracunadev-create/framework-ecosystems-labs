using System.Collections.Concurrent;
using System.Text.Json.Serialization;

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

var tareas = new ConcurrentDictionary<string, object>();
tareas["1"] = new { id = "1", titulo = "existente", completada = false };
var siguiente = 1;

app.MapGet("/tareas/{id}", (string id) =>
    tareas.TryGetValue(id, out var tarea)
        ? Results.Json(tarea)
        : Results.Json(new { code = "NO_EXISTE" }, statusCode: 404));

app.MapPost("/tareas", (Cuerpo? cuerpo) =>
{
    var titulo = (cuerpo?.Titulo ?? "").Trim();
    if (titulo.Length == 0)
    {
        return Results.Json(new { code = "VALIDACION" }, statusCode: 422);
    }

    var id = Interlocked.Increment(ref siguiente).ToString();
    var tarea = new { id, titulo, completada = false };
    tareas[id] = tarea;
    return Results.Created($"/tareas/{id}", tarea);
});

app.MapDelete("/tareas/{id}", (string id) =>
    tareas.TryRemove(id, out _)
        ? Results.NoContent()
        : Results.Json(new { code = "NO_EXISTE" }, statusCode: 404));

app.Run();

class Cuerpo
{
    [JsonPropertyName("titulo")]
    public string? Titulo { get; set; }
}
