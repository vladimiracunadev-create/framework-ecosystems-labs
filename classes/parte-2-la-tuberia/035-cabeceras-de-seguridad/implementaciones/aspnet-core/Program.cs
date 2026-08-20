var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

app.Use(async (contexto, siguiente) =>
{
    var cabeceras = contexto.Response.Headers;
    cabeceras["X-Content-Type-Options"] = "nosniff";
    cabeceras["X-Frame-Options"] = "DENY";
    cabeceras["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
    cabeceras["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'";
    cabeceras["Referrer-Policy"] = "no-referrer";
    cabeceras.Remove("Server");
    await siguiente();
});

app.MapGet("/datos", () => Results.Json(new { ok = true }));

app.Run();
