var constructor = WebApplication.CreateBuilder(args);

// El middleware de tiempos de espera de ASP.NET Core cancela el token de la
// peticion, de modo que el trabajo en curso puede enterarse y detenerse.
constructor.Services.AddRequestTimeouts(opciones =>
{
    opciones.DefaultPolicy = new Microsoft.AspNetCore.Http.Timeouts.RequestTimeoutPolicy
    {
        Timeout = TimeSpan.FromMilliseconds(300),
        TimeoutStatusCode = 504,
    };
});

var app = constructor.Build();
app.UseRequestTimeouts();

app.MapGet("/rapido", () => Results.Json(new { ok = true }));

app.MapGet("/lento", async (CancellationToken cancelacion) =>
{
    try
    {
        await Task.Delay(1200, cancelacion);
    }
    catch (OperationCanceledException)
    {
        // El plazo se agoto: el middleware ya emitio el 504.
        return Results.Empty;
    }
    return Results.Json(new { ok = true, tarde = true });
});

app.Run();
