var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

app.MapGet("/eco", (HttpRequest peticion, HttpResponse respuesta) =>
{
    var recibido = peticion.Headers["X-Peticion"].FirstOrDefault() ?? "(ninguna)";
    respuesta.Headers["X-Respuesta"] = "servida";
    respuesta.Headers.CacheControl = "no-store";
    return Results.Json(new { recibido });
});

app.Run();
