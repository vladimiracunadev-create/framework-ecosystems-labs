var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

var tareas = Enumerable.Range(1, 25)
    .Select(i => new { id = i.ToString("D3"), titulo = $"tarea {i}" })
    .ToList();

app.MapGet("/tareas", (HttpRequest peticion) =>
{
    if (!TryLeer(peticion, "desde", 0, 0, int.MaxValue, out var desde))
    {
        return Results.Json(new { code = "DESDE_INVALIDO" }, statusCode: 422);
    }
    if (!TryLeer(peticion, "limite", 10, 1, 50, out var limite))
    {
        return Results.Json(new { code = "LIMITE_INVALIDO" }, statusCode: 422);
    }

    return Results.Json(new
    {
        elementos = tareas.Skip(desde).Take(limite),
        total = tareas.Count,
    });
});

app.MapGet("/tareas-cursor", (HttpRequest peticion) =>
{
    if (!TryLeer(peticion, "limite", 10, 1, 50, out var limite))
    {
        return Results.Json(new { code = "LIMITE_INVALIDO" }, statusCode: 422);
    }

    var cursor = peticion.Query["cursor"].FirstOrDefault();
    var inicio = 0;
    if (!string.IsNullOrEmpty(cursor))
    {
        var posicion = tareas.FindIndex(t => t.id == cursor);
        if (posicion < 0)
        {
            return Results.Json(new { code = "CURSOR_INVALIDO" }, statusCode: 422);
        }
        inicio = posicion + 1;
    }

    var pagina = tareas.Skip(inicio).Take(limite).ToList();
    var siguiente = inicio + limite < tareas.Count ? pagina[^1].id : null;
    return Results.Json(new { elementos = pagina, siguiente });
});

app.Run();

static bool TryLeer(HttpRequest peticion, string nombre, int omision, int min, int max, out int valor)
{
    valor = omision;
    var crudo = peticion.Query[nombre].FirstOrDefault();
    if (string.IsNullOrEmpty(crudo)) return true;
    if (!int.TryParse(crudo, out valor)) return false;
    return valor >= min && valor <= max;
}
