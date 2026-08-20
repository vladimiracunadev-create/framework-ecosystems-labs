var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

var manejadorLlamado = 0;

app.Use(async (contexto, siguiente) =>
{
    if (contexto.Request.Path == "/publico")
    {
        await siguiente();
        return;
    }

    // No llamar a `siguiente()` corta la tubería aquí mismo.
    if (contexto.Request.Headers.Authorization != "Bearer valido")
    {
        contexto.Response.StatusCode = 401;
        contexto.Response.Headers.WWWAuthenticate = "Bearer";
        await contexto.Response.WriteAsJsonAsync(
            new { error = "no autorizado", manejador = manejadorLlamado });
        return;
    }

    await siguiente();
});

app.MapGet("/privado", () =>
{
    manejadorLlamado++;
    return Results.Json(new { ok = true, manejador = manejadorLlamado });
});

app.MapGet("/publico", () => Results.Json(new { ok = true, publico = true }));

app.Run();
