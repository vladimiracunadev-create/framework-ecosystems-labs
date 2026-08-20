using System.Text.Json;

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

static bool Valido(JsonElement cuerpo, int maximo, out string titulo)
{
    titulo = "";
    if (!cuerpo.TryGetProperty("titulo", out var valor)) return false;
    if (valor.ValueKind != JsonValueKind.String) return false;
    titulo = valor.GetString() ?? "";
    return titulo.Length > 0 && titulo.Length <= maximo;
}

app.MapPost("/v1/tareas", (JsonElement cuerpo) =>
    Valido(cuerpo, 200, out var titulo)
        ? Results.Json(new { id = "1", titulo }, statusCode: 201)
        : Results.Json(new { code = "VALIDACION" }, statusCode: 422));

// Los tres cambios COMPATIBLES.
app.MapPost("/v2/tareas", (JsonElement cuerpo) =>
{
    if (!Valido(cuerpo, 200, out var titulo))
    {
        return Results.Json(new { code = "VALIDACION" }, statusCode: 422);
    }
    var prioridad = cuerpo.TryGetProperty("prioridad", out var p) ? p.GetInt32() : 2;
    return Results.Json(
        new { id = "1", titulo, prioridad, estado = "pendiente" }, statusCode: 201);
});

// Los tres INCOMPATIBLES.
app.MapPost("/v3/tareas", (JsonElement cuerpo) =>
{
    if (!cuerpo.TryGetProperty("prioridad", out _))
    {
        return Results.Json(new { code = "VALIDACION", campo = "prioridad" }, statusCode: 422);
    }
    if (!Valido(cuerpo, 120, out var titulo))
    {
        return Results.Json(new { code = "VALIDACION", campo = "titulo" }, statusCode: 422);
    }
    return Results.Json(new { id = "1", nombre = titulo }, statusCode: 201);
});

app.Run();
