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
    // NO se captura la cancelacion: devolver un resultado aqui produciria un
    // 200 y pisaria el 504 que el middleware iba a emitir. Dejar que la
    // excepcion suba es lo correcto — el middleware la espera.
    await Task.Delay(1200, cancelacion);
    return Results.Json(new { ok = true, tarde = true });
});

app.Run();
