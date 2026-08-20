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

// `MapFallback` y NO `app.Run(manejador)`: `Run` registra una capa TERMINAL,
// que corta la tuberia antes de llegar al enrutado. Con ella, incluso /a y /b
// respondian 404. `MapFallback` registra una ruta comodin, que es lo que
// corresponde: se evalua despues de las demas.
app.MapFallback(() => Results.Json(new { error = "no existe" }, statusCode: 404));

app.Run();
