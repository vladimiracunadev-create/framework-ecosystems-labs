var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

app.MapGet("/tareas/1", (HttpRequest peticion, HttpResponse respuesta) =>
{
    respuesta.Headers.Vary = "Accept";
    var accept = peticion.Headers.Accept.ToString();

    // Las API mínimas no negocian por su cuenta: la decisión es explícita.
    if (accept.Contains("application/json") || accept.Contains("*/*") || accept.Length == 0)
    {
        return Results.Json(new { id = "1", titulo = "negociar" });
    }
    if (accept.Contains("text/html"))
    {
        return Results.Content("<h1>negociar</h1>", "text/html");
    }
    return Results.Json(new { error = "no puedo servir ese tipo" }, statusCode: 406);
});

app.Run();
