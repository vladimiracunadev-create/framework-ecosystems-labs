var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

// `int? limite` hace que ASP.NET Core intente convertir la cadena de consulta.
// Si el texto no es un entero, el valor llega nulo y lo tratamos como inválido.
app.MapGet("/tareas", (int? limite) =>
{
    var valor = limite ?? 20;
    if (valor < 1 || valor > 100)
    {
        return Results.Json(new { error = "limite debe ser un entero entre 1 y 100" }, statusCode: 422);
    }
    return Results.Json(new { limite = valor });
});

app.Run();
