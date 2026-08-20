using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

var constructor = WebApplication.CreateBuilder(args);

// `AddOpenApi` viene en la plataforma desde .NET 9: no hace falta biblioteca.
// Lee los atributos de validacion del tipo y los traduce al documento.
constructor.Services.AddOpenApi();

var app = constructor.Build();

// El documento se publica en la misma ruta que los demas, para que el
// contrato pueda ser identico.
app.MapOpenApi("/openapi.json");

app.MapPost("/tareas", (Tarea? tarea) =>
{
    if (tarea is null)
    {
        return Results.Json(new { code = "VALIDACION" }, statusCode: 422);
    }

    var contexto = new ValidationContext(tarea);
    var resultados = new List<ValidationResult>();
    if (!Validator.TryValidateObject(tarea, contexto, resultados, validateAllProperties: true))
    {
        return Results.Json(new { code = "VALIDACION" }, statusCode: 422);
    }

    return Results.Json(new
    {
        titulo = tarea.Titulo,
        prioridad = tarea.Prioridad ?? 2,
    }, statusCode: 201);
});

app.Run();

/// <summary>
/// Una clase, dos vocabularios: los atributos de <c>DataAnnotations</c> validan
/// y el generador de OpenAPI los lee para documentar. Igual que en Spring Boot.
/// </summary>
class Tarea
{
    [JsonPropertyName("titulo")]
    [Required]
    [MinLength(1)]
    [MaxLength(120)]
    public string? Titulo { get; set; }

    [JsonPropertyName("prioridad")]
    [Range(1, 3)]
    public int? Prioridad { get; set; }
}
