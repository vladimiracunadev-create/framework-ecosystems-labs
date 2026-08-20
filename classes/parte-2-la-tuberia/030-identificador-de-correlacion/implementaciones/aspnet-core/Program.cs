var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

app.Use(async (contexto, siguiente) =>
{
    var entrante = contexto.Request.Headers["X-Request-Id"].FirstOrDefault();
    var correlacion = !string.IsNullOrEmpty(entrante) && entrante.Length <= 128
        ? entrante
        : Guid.NewGuid().ToString();

    contexto.Items["correlacion"] = correlacion;
    contexto.Response.Headers["X-Request-Id"] = correlacion;
    await siguiente();
});

app.MapGet("/eco", (HttpContext contexto) => Results.Json(new
{
    correlacion = (string)contexto.Items["correlacion"]!,
    generado = string.IsNullOrEmpty(contexto.Request.Headers["X-Request-Id"].FirstOrDefault()),
}));

app.Run();
