using System.ComponentModel.DataAnnotations;

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

    return Results.Json(new
    {
        titulo = tarea.Titulo!.Trim(),
        completada = tarea.Completada ?? false,
    }, statusCode: 201);
});

app.Run();

class Tarea
{
    [Required(ErrorMessage = "titulo debe ser texto")]
    [MinLength(1, ErrorMessage = "titulo no puede estar vacio")]
    [MaxLength(120, ErrorMessage = "titulo no puede pasar de 120 caracteres")]
    public string? Titulo { get; set; }

    public bool? Completada { get; set; }
}
