using System.ComponentModel.DataAnnotations;
using System.Text.Json;

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

// Se valida a mano con `Validator` en lugar de dejar que el enlace automatico
// rechace: asi el 422 lleva nuestro formato y no el del framework, que ademas
// usaria 400. La clase 017 explica por que la distincion importa.
app.MapPost("/tareas", (Tarea? tarea) =>
{
    if (tarea is null)
    {
        return Results.Json(new { error = "cuerpo JSON mal formado" }, statusCode: 400);
    }

    var contexto = new ValidationContext(tarea);
    var resultados = new List<ValidationResult>();
    if (!Validator.TryValidateObject(tarea, contexto, resultados, validateAllProperties: true))
    {
        return Results.Json(
            new { error = resultados[0].ErrorMessage }, statusCode: 422);
    }

    var completada = false;
    if (tarea.Completada is JsonElement valor && valor.ValueKind != JsonValueKind.Null)
    {
        if (valor.ValueKind is not (JsonValueKind.True or JsonValueKind.False))
        {
            return Results.Json(
                new { error = "completada debe ser booleano" }, statusCode: 422);
        }
        completada = valor.GetBoolean();
    }

    return Results.Json(new
    {
        titulo = tarea.Titulo!.Trim(),
        completada,
    }, statusCode: 201);
});

app.Run();

class Tarea
{
    [Required(ErrorMessage = "titulo debe ser texto")]
    [MinLength(1, ErrorMessage = "titulo no puede estar vacio")]
    [MaxLength(120, ErrorMessage = "titulo no puede pasar de 120 caracteres")]
    public string? Titulo { get; set; }

    /// <summary>
    /// <c>JsonElement?</c> y no <c>bool?</c> a proposito.
    ///
    /// Con <c>bool?</c>, un <c>"si"</c> en el cuerpo falla al DESERIALIZAR
    /// —antes de que exista validacion— y el enlace automatico responde 400.
    /// Pero un tipo equivocado es entrada invalida, no cuerpo ilegible:
    /// corresponde 422.
    /// </summary>
    public JsonElement? Completada { get; set; }
}
