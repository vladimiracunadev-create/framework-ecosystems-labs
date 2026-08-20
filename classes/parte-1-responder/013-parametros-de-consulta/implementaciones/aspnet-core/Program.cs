var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

// Se lee de la colección de consulta en lugar de enlazar a `int? limite`.
// Con enlace automático, un texto no convertible produce un **400 del
// framework** antes de entrar al manejador, y este contrato distingue el 400
// («no te entiendo») del 422 («te entiendo y no vale»).
app.MapGet("/tareas", (HttpRequest peticion) =>
{
    if (!peticion.Query.TryGetValue("limite", out var crudo) || string.IsNullOrEmpty(crudo))
    {
        return Results.Json(new { limite = 20 });
    }

    if (!int.TryParse(crudo, out var limite) || limite < 1 || limite > 100)
    {
        return Results.Json(
            new { error = "limite debe ser un entero entre 1 y 100" }, statusCode: 422);
    }

    return Results.Json(new { limite });
});

app.Run();
