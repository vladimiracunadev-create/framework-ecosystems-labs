using Microsoft.AspNetCore.Diagnostics;

var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

const string tipo = "application/problem+json";

// `UseExceptionHandler` con una tuberia propia: cualquier excepcion que suba
// hasta aqui se convierte en una respuesta del contrato.
app.UseExceptionHandler(rama => rama.Run(async contexto =>
{
    var caracteristica = contexto.Features.Get<IExceptionHandlerFeature>();

    if (caracteristica?.Error is ErrorDeNegocio negocio)
    {
        contexto.Response.StatusCode = negocio.Estado;
        contexto.Response.ContentType = tipo;
        await contexto.Response.WriteAsJsonAsync(new
        {
            type = "about:blank",
            title = negocio.Message,
            status = negocio.Estado,
            code = negocio.Codigo,
        });
        return;
    }

    // El mensaje real se registra; al cliente va uno generico.
    Console.Error.WriteLine($"error no controlado: {caracteristica?.Error.Message}");
    contexto.Response.StatusCode = 500;
    contexto.Response.ContentType = tipo;
    await contexto.Response.WriteAsJsonAsync(new
    {
        type = "about:blank",
        title = "error interno",
        status = 500,
        code = "ERROR_INTERNO",
    });
}));

app.MapGet("/roto", () =>
{
    throw new InvalidOperationException("referencia interna: secreto=abc123");
});

app.MapGet("/negocio", () =>
{
    throw new ErrorDeNegocio("la tarea ya estaba completada", 409, "TAREA_YA_COMPLETADA");
});

app.MapGet("/ok", () => Results.Json(new { ok = true }));

app.Run();

class ErrorDeNegocio(string mensaje, int estado, string codigo) : Exception(mensaje)
{
    public int Estado { get; } = estado;
    public string Codigo { get; } = codigo;
}
