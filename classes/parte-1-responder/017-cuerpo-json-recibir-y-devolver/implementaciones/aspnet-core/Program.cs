using System.Text.Json;

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

// Se lee el cuerpo a mano en lugar de enlazarlo a un tipo: así se distingue el
// JSON ilegible (400) del legible pero incompleto (422). Con enlace automático,
// ASP.NET Core devuelve 400 en ambos casos.
app.MapPost("/tareas", async (HttpRequest peticion) =>
{
    JsonElement cuerpo;
    try
    {
        cuerpo = await JsonSerializer.DeserializeAsync<JsonElement>(peticion.Body);
    }
    catch (JsonException)
    {
        return Results.Json(new { error = "cuerpo JSON mal formado" }, statusCode: 400);
    }

    if (cuerpo.ValueKind != JsonValueKind.Object
        || !cuerpo.TryGetProperty("titulo", out var titulo)
        || titulo.ValueKind != JsonValueKind.String
        || string.IsNullOrEmpty(titulo.GetString()))
    {
        return Results.Json(new { error = "titulo es obligatorio" }, statusCode: 422);
    }

    return Results.Json(
        new { id = "1", titulo = titulo.GetString(), completada = false },
        statusCode: 201);
});

app.Run();
