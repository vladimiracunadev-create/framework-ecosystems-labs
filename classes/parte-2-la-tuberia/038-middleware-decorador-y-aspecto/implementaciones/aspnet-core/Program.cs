var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

var auditoria = new List<string>();

// (1) EXTERNA — en ASP.NET Core se llama middleware. Ve metodo y ruta; el enrutado aun no ocurrio.
app.Use(async (contexto, siguiente) =>
{
    if (contexto.Request.Path != "/auditoria")
    {
        auditoria.Add($"externa:{contexto.Request.Method} {contexto.Request.Path}");
    }
    await siguiente();
});

// (2) INTERNA — en ASP.NET Core es un FILTRO DE PUNTO FINAL. Ya sabe que punto final se va a
// ejecutar, y puede actuar antes y despues de el.
app.MapGet("/accion", () =>
{
    auditoria.Add("manejador");
    return Results.Json(new { ok = true });
}).AddEndpointFilter(async (contexto, siguiente) =>
{
    auditoria.Add("interna:accion");
    var resultado = await siguiente(contexto);
    auditoria.Add("interna:fin");
    return resultado;
});

app.MapGet("/auditoria", () => Results.Json(new { auditoria }));

app.Run();
