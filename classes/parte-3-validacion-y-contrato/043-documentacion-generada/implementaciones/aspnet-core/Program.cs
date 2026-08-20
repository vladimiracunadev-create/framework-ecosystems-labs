using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

var constructor = WebApplication.CreateBuilder(args);
constructor.Services.AddOpenApi();

var app = constructor.Build();
app.MapOpenApi("/openapi.json");

var tareas = new Dictionary<string, object>
{
    ["1"] = new { id = "1", titulo = "existente" },
};

// `Produces` declara los codigos. El generador documenta lo que esta en la
// FIRMA; el 404 vive dentro de un `if` y ninguna herramienta lee la logica.
app.MapGet("/tareas/{id}", (string id) =>
        tareas.TryGetValue(id, out var tarea)
            ? Results.Json(tarea)
            : Results.Json(new { code = "NO_EXISTE" }, statusCode: 404))
    .Produces(200)
    .Produces(404);

app.MapPost("/tareas", (Tarea? tarea) =>
    {
        if (tarea?.Titulo is null || tarea.Titulo.Length == 0 || tarea.Titulo.Length > 120)
        {
            return Results.Json(new { code = "VALIDACION" }, statusCode: 422);
        }

        var id = (tareas.Count + 1).ToString();
        var creada = new { id, titulo = tarea.Titulo };
        tareas[id] = creada;
        return Results.Json(creada, statusCode: 201);
    })
    .Produces(201)
    .Produces(422);

app.Run();

class Tarea
{
    [JsonPropertyName("titulo")]
    [Required]
    [MinLength(1)]
    [MaxLength(120)]
    public string? Titulo { get; set; }
}
