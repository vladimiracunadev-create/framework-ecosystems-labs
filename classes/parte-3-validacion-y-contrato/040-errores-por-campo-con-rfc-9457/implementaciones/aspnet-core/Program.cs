using System.Text.Json;
using System.Text.Json.Serialization;

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

const string tipo = "application/problem+json";

// Se valida a mano y se ACUMULAN los errores. `Validator.TryValidateObject`
// tambien los acumula, pero sus mensajes no traen un codigo estable: para
// devolver `codigo` hay que ponerlo aqui.
app.MapPost("/tareas", (Tarea? tarea) =>
{
    var errores = new List<object>();

    var titulo = tarea?.Titulo;
    if (titulo is null || titulo.Trim().Length == 0)
    {
        errores.Add(new { campo = "titulo", codigo = "REQUERIDO", detalle = "no puede estar vacio" });
    }
    else if (titulo.Length > 120)
    {
        errores.Add(new { campo = "titulo", codigo = "LONGITUD", detalle = "maximo 120 caracteres" });
    }

    if (tarea?.Prioridad is int p && p is not (1 or 2 or 3))
    {
        errores.Add(new { campo = "prioridad", codigo = "VALOR", detalle = "debe ser 1, 2 o 3" });
    }

    if (errores.Count > 0)
    {
        var problema = JsonSerializer.Serialize(new
        {
            type = "about:blank",
            title = "la entrada no es valida",
            status = 422,
            code = "VALIDACION",
            errors = errores,
        });
        return Results.Text(problema, tipo, statusCode: 422);
    }

    return Results.Json(new { titulo = titulo!.Trim() }, statusCode: 201);
});

app.Run();

class Tarea
{
    [JsonPropertyName("titulo")]
    public string? Titulo { get; set; }

    [JsonPropertyName("prioridad")]
    public int? Prioridad { get; set; }
}
