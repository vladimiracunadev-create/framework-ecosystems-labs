using System.Diagnostics;

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

var registro = new List<object>();

app.Use(async (contexto, siguiente) =>
{
    var reloj = Stopwatch.StartNew();
    await siguiente();
    reloj.Stop();

    if (contexto.Request.Path != "/registro")
    {
        registro.Add(new
        {
            metodo = contexto.Request.Method,
            ruta = contexto.Request.Path.Value,
            estado = contexto.Response.StatusCode,
            medido = reloj.Elapsed.TotalMilliseconds >= 0,
        });
    }
});

app.MapGet("/ok", () => Results.Json(new { ok = true }));
app.MapGet("/falla", () => Results.Json(new { error = "roto" }, statusCode: 500));
app.MapGet("/registro", () => Results.Json(new { registro }));

app.Run();
