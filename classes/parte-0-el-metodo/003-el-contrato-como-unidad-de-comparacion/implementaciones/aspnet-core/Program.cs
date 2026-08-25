using System.Collections.Concurrent;
using System.Text.Json.Serialization;

// El mismo contrato, en ASP.NET Core. Como en Spring, hay un metodo que ATA el
// 201 a su Location —Results.Created(uri, valor)— y otro que no admite cuerpo
// —Results.NoContent()—. Las dos lineas donde el tipo impide el error.
var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

var tareas = new ConcurrentDictionary<string, Tarea>();
var siguiente = 0;

app.MapGet("/tareas", () =>
{
    var lista = tareas.Values.ToList();
    return Results.Json(new { total = lista.Count, tareas = lista });
});

app.MapPost("/tareas", (Cuerpo? cuerpo) =>
{
    var id = Interlocked.Increment(ref siguiente).ToString();
    var tarea = new Tarea(id, cuerpo?.Titulo ?? "");
    tareas[id] = tarea;
    // FUERA DE LA OMISION (1): sin esto seria un 200 sin Location.
    return Results.Created($"/tareas/{id}", tarea);
});

app.MapGet("/tareas/{id}", (string id) =>
    // FUERA DE LA OMISION (2): el 404 por omision de ASP.NET Core no lleva
    // cuerpo, y el contrato exige JSON con un campo `error`.
    tareas.TryGetValue(id, out var tarea)
        ? Results.Json(tarea)
        : Results.Json(new { error = "no-encontrada" }, statusCode: 404));

app.MapDelete("/tareas/{id}", (string id) =>
{
    if (!tareas.TryRemove(id, out _))
    {
        return Results.Json(new { error = "no-encontrada" }, statusCode: 404);
    }
    // FUERA DE LA OMISION (3): NoContent no admite contenido.
    return Results.NoContent();
});

app.Run();

record Tarea(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("titulo")] string Titulo);

class Cuerpo
{
    [JsonPropertyName("titulo")]
    public string? Titulo { get; set; }
}
