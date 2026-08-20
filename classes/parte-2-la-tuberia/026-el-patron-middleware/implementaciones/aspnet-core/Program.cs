var constructor = WebApplication.CreateBuilder(args);
var app = constructor.Build();

// `Use` recibe el contexto y `siguiente`. Llamar a `siguiente()` continúa la
// tubería; no llamarlo la corta, que es la clase 028.
app.Use(async (contexto, siguiente) =>
{
    contexto.Response.Headers["X-Capa"] = "intermedia";
    await siguiente();
});

app.MapGet("/a", () => Results.Json(new { ruta = "a" }));
app.MapGet("/b", () => Results.Json(new { ruta = "b" }));

// El manejador final: si nada coincidió, la tubería llega aquí.
app.Run(async contexto =>
{
    contexto.Response.StatusCode = 404;
    contexto.Response.ContentType = "application/json";
    await contexto.Response.WriteAsync("{\"error\":\"no existe\"}");
});

app.Run();
