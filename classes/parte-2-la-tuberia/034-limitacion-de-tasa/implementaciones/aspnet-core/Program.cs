using System.Threading.RateLimiting;

var constructor = WebApplication.CreateBuilder(args);

// .NET trae limitacion de tasa en la plataforma: no hace falta biblioteca.
constructor.Services.AddRateLimiter(opciones =>
{
    opciones.RejectionStatusCode = 429;
    opciones.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(contexto =>
        RateLimitPartition.GetFixedWindowLimiter(
            contexto.Connection.RemoteIpAddress?.ToString() ?? "anonimo",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 3,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
            }));

    opciones.OnRejected = async (contexto, cancelacion) =>
    {
        contexto.HttpContext.Response.Headers.RetryAfter = "60";
        contexto.HttpContext.Response.ContentType = "application/problem+json";
        await contexto.HttpContext.Response.WriteAsJsonAsync(new
        {
            type = "about:blank",
            title = "demasiadas peticiones",
            status = 429,
            code = "CUPO_AGOTADO",
        }, cancelacion);
    };
});

var app = constructor.Build();
app.UseRateLimiter();

app.MapGet("/datos", () => Results.Json(new { ok = true }));

app.Run();
